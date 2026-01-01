
export interface FileEdit {
  file: string;
  added: number;
  removed: number;
  oldContent?: string;
  newContent?: string;
  changeType: 'edit' | 'create' | 'delete';
}

export interface ShellCommand {
  command: string;
  workingDirectory?: string;
}

export interface PackageInstall {
  language: string;
  packages: string[];
}

export interface WorkspaceToolNudge {
  toolName: string;
  reason: string;
}

export interface WorkflowConfiguration {
  workflowName: string;
  commands: string[];
  setRunButton?: boolean;
  mode?: 'sequential' | 'parallel';
}

export interface DeploymentConfiguration {
  buildCommand?: string;
  runCommand: string;
}

export function parseCodeChangesFromMessage(content: string): {
  fileEdits: FileEdit[];
  shellCommands: string[];
  packageInstalls: PackageInstall[];
  workspaceToolNudges: WorkspaceToolNudge[];
  workflowConfigurations: WorkflowConfiguration[];
  deploymentConfigurations: DeploymentConfiguration[];
} {
  const fileEdits: FileEdit[] = [];
  const shellCommands: string[] = [];
  const packageInstalls: PackageInstall[] = [];
  const workspaceToolNudges: WorkspaceToolNudge[] = [];
  const workflowConfigurations: WorkflowConfiguration[] = [];
  const deploymentConfigurations: DeploymentConfiguration[] = [];

  // Parse proposed_file_replace_substring
  const replaceSubstringRegex = /<proposed_file_replace_substring[^>]*file_path="([^"]+)"[^>]*>([\s\S]*?)<\/proposed_file_replace_substring>/g;
  let match;

  while ((match = replaceSubstringRegex.exec(content)) !== null) {
    const filePath = match[1];
    const changeContent = match[2];
    
    const oldStrMatch = changeContent.match(/<old_str>([\s\S]*?)<\/old_str>/);
    const newStrMatch = changeContent.match(/<new_str>([\s\S]*?)<\/new_str>/);
    
    if (oldStrMatch && newStrMatch) {
      const oldContent = oldStrMatch[1].trim();
      const newContent = newStrMatch[1].trim();
      
      fileEdits.push({
        file: filePath,
        added: newContent.split('\n').length,
        removed: oldContent.split('\n').length,
        oldContent,
        newContent,
        changeType: 'edit',
      });
    }
  }

  // Parse proposed_file_replace
  const replaceFileRegex = /<proposed_file_replace[^>]*file_path="([^"]+)"[^>]*>([\s\S]*?)<\/proposed_file_replace>/g;
  
  while ((match = replaceFileRegex.exec(content)) !== null) {
    const filePath = match[1];
    const newContent = match[2].trim();
    
    fileEdits.push({
      file: filePath,
      added: newContent.split('\n').length,
      removed: 0,
      newContent,
      changeType: 'create',
    });
  }

  // Parse proposed_file_insert
  const insertFileRegex = /<proposed_file_insert[^>]*file_path="([^"]+)"[^>]*>([\s\S]*?)<\/proposed_file_insert>/g;
  
  while ((match = insertFileRegex.exec(content)) !== null) {
    const filePath = match[1];
    const newContent = match[2].trim();
    
    fileEdits.push({
      file: filePath,
      added: newContent.split('\n').length,
      removed: 0,
      newContent,
      changeType: 'create',
    });
  }

  // Parse shell commands
  const shellCommandRegex = /<proposed_shell_command[^>]*>([\s\S]*?)<\/proposed_shell_command>/g;
  
  while ((match = shellCommandRegex.exec(content)) !== null) {
    const command = match[1].trim();
    if (command) {
      shellCommands.push(command);
    }
  }

  // Parse package installations
  const packageInstallRegex = /<proposed_package_install[^>]*language="([^"]+)"[^>]*package_list="([^"]+)"[^>]*\/>/g;
  
  while ((match = packageInstallRegex.exec(content)) !== null) {
    const language = match[1];
    const packageList = match[2];
    const packages = packageList.split(',').map(p => p.trim()).filter(Boolean);
    
    if (packages.length > 0) {
      packageInstalls.push({ language, packages });
    }
  }

  // Parse workspace tool nudges
  const toolNudgeRegex = /<proposed_workspace_tool_nudge[^>]*tool_name="([^"]+)"[^>]*reason="([^"]+)"[^>]*\/>/g;
  
  while ((match = toolNudgeRegex.exec(content)) !== null) {
    workspaceToolNudges.push({
      toolName: match[1],
      reason: match[2],
    });
  }

  // Parse workflow configurations
  const workflowRegex = /<proposed_workflow_configuration[^>]*workflow_name="([^"]+)"[^>]*(set_run_button="(true|false)")?[^>]*(mode="(sequential|parallel)")?[^>]*>([\s\S]*?)<\/proposed_workflow_configuration>/g;
  
  while ((match = workflowRegex.exec(content)) !== null) {
    const workflowName = match[1];
    const setRunButton = match[3] === 'true';
    const mode = (match[5] || 'sequential') as 'sequential' | 'parallel';
    const commandsText = match[6].trim();
    const commands = commandsText.split('\n').map(cmd => cmd.trim()).filter(Boolean);
    
    workflowConfigurations.push({
      workflowName,
      commands,
      setRunButton,
      mode,
    });
  }

  // Parse deployment configurations
  const deploymentRegex = /<proposed_deployment_configuration[^>]*(build_command="([^"]+)")?[^>]*run_command="([^"]+)"[^>]*\/>/g;
  
  while ((match = deploymentRegex.exec(content)) !== null) {
    const buildCommand = match[2];
    const runCommand = match[3];
    
    deploymentConfigurations.push({
      buildCommand: buildCommand || undefined,
      runCommand,
    });
  }

  return { 
    fileEdits, 
    shellCommands, 
    packageInstalls,
    workspaceToolNudges,
    workflowConfigurations,
    deploymentConfigurations,
  };
}

export async function applyFileEdit(edit: FileEdit): Promise<void> {
  if (edit.changeType === 'create' && edit.newContent) {
    // Create or replace entire file
    const response = await fetch('/api/files/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: edit.file,
        content: edit.newContent,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to write file: ${edit.file}`);
    }
  } else if (edit.changeType === 'edit' && edit.oldContent && edit.newContent) {
    // Read current file, replace substring, write back
    const readResponse = await fetch('/api/files/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: edit.file }),
    });
    
    if (!readResponse.ok) {
      throw new Error(`Failed to read file: ${edit.file}`);
    }
    
    const { content: currentContent } = await readResponse.json();
    const updatedContent = currentContent.replace(edit.oldContent, edit.newContent);
    
    const writeResponse = await fetch('/api/files/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: edit.file,
        content: updatedContent,
      }),
    });
    
    if (!writeResponse.ok) {
      throw new Error(`Failed to write file: ${edit.file}`);
    }
  } else if (edit.changeType === 'delete') {
    const response = await fetch('/api/files/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: edit.file }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${edit.file}`);
    }
  }
}
