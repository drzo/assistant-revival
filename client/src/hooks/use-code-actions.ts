import { useEffect } from 'react';
import { useAssistantStore } from './use-assistant-store';
import { parseCodeChangesFromMessage } from '@/lib/code-change-applier';
import { useToast } from './use-toast';
import { useFileOperations } from './use-file-operations';
import { usePackageManager } from './use-package-manager';
import { useCommandHistory } from './use-command-history';

export function useCodeActions() {
  const { messages, settings, setPendingChanges, applyPendingChanges, files, updateFileContent } = useAssistantStore();
  const { toast } = useToast();
  const fileOps = useFileOperations();
  const { installPackages } = usePackageManager();
  const { addExecution } = useCommandHistory();

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    const { fileEdits, shellCommands } = parseCodeChangesFromMessage(lastMessage.content);

    // Store metadata in the message if not already present
    if ((fileEdits.length > 0 || shellCommands.length > 0) && !(lastMessage as any).metadata) {
      (lastMessage as any).metadata = { fileEdits, shellCommands };
    }

    // Handle auto-apply if enabled
    if (settings.autoApplyChanges && fileEdits.length > 0) {
      const changes = fileEdits.map(edit => {
        const file = files.find(f => f.name === edit.file);
        return {
          fileId: file?.id || edit.file,
          fileName: edit.file,
          oldContent: file?.content || '',
          newContent: '', // Would need actual content from message
          description: `${edit.added} additions, ${edit.removed} deletions`
        };
      });
      setPendingChanges(changes);
      applyPendingChanges();
    }
  }, [messages, settings.autoApplyChanges, files, setPendingChanges, applyPendingChanges]);

  const applyChange = async (change: any) => {
    try {
      const { applyFileEdit } = await import('@/lib/code-change-applier');
      await applyFileEdit(change);
      
      toast({
        title: 'Change applied',
        description: `Updated ${change.file}`,
      });
    } catch (error) {
      toast({
        title: 'Failed to apply change',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };
  const executeShellCommand = async (command: string, workingDirectory?: string) => {
    try {
      const response = await fetch('/api/shell/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, workingDirectory })
      });

      if (!response.ok) {
        const error = await response.json();
        addExecution({
          command,
          workingDirectory,
          output: error.message || error.error,
          success: false,
        });
        throw new Error(error.message || 'Failed to execute command');
      }

      const result = await response.json();
      addExecution({
        command,
        workingDirectory,
        output: result.output,
        success: true,
      });
      
      toast({
        title: "Command executed",
        description: result.output?.substring(0, 100) || command
      });
      return result;
    } catch (error) {
      console.error('Failed to execute command:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute shell command",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleShellCommand = async (command: string, workingDirectory?: string) => {
    return executeShellCommand(command, workingDirectory);
  };
  const captureScreenshot = async (url: string) => {
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to capture screenshot');
      }

      const result = await response.json();
      toast({
        title: "Screenshot captured",
        description: `Screenshot of ${url} saved to ${result.path}`
      });
      return result.path;
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to capture screenshot",
        variant: "destructive"
      });
    }
  };
  const scrapeUrl = async (url: string) => {
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to scrape URL');
      }

      const result = await response.json();
      toast({
        title: "URL scraped",
        description: `Scraped ${url}`
      });
      return result.content;
    } catch (error) {
      console.error('Failed to scrape URL:', error);
      toast({
        title: "Error",
        description: "Failed to scrape URL",
        variant: "destructive"
      });
    }
  };

  const readFileContent = async (filePath: string) => {
    try {
      const result = await fileOps.readFile.mutateAsync({ filePath });
      toast({
        title: 'File read successfully',
        description: `Read ${filePath}`,
      });
      return result.content;
    } catch (error) {
      toast({
        title: 'Failed to read file',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const writeFileContent = async (filePath: string, content: string) => {
    try {
      await fileOps.writeFile.mutateAsync({ filePath, content });
      toast({
        title: 'File written successfully',
        description: `Updated ${filePath}`,
      });
    } catch (error) {
      toast({
        title: 'Failed to write file',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const listDirectory = async (dirPath?: string) => {
    try {
      const result = await fileOps.listFiles.mutateAsync({ dirPath });
      return result.files;
    } catch (error) {
      toast({
        title: 'Failed to list directory',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteFileOrDir = async (filePath: string) => {
    try {
      await fileOps.deleteFile.mutateAsync({ filePath });
      toast({
        title: 'Deleted successfully',
        description: `Deleted ${filePath}`,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleScreenshot = async (url: string) => {
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, fullPage: false })
      });

      if (!response.ok) {
        throw new Error('Failed to capture screenshot');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      toast({
        title: 'Screenshot captured',
        description: `Screenshot of ${url}`,
      });

      return imageUrl;
    } catch (error) {
      toast({
        title: 'Screenshot failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleScrape = async (url: string) => {
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to scrape URL');
      }

      const data = await response.json();

      toast({
        title: 'Content scraped',
        description: `Scraped ${data.title || url}`,
      });

      return data;
    } catch (error) {
      toast({
        title: 'Scraping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const restartWorkflow = async (workflowName?: string) => {
    try {
      const response = await fetch('/api/workflow/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowName })
      });

      if (!response.ok) {
        throw new Error('Failed to restart workflow');
      }

      toast({
        title: 'Workflow restarted',
        description: workflowName ? `Workflow "${workflowName}" restarted` : 'Application has been restarted',
      });
    } catch (error) {
      toast({
        title: 'Restart failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const stopWorkflow = async (workflowName?: string) => {
    try {
      const response = await fetch('/api/workflow/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowName })
      });

      if (!response.ok) {
        throw new Error('Failed to stop workflow');
      }

      toast({
        title: 'Workflow stopped',
        description: workflowName ? `Workflow "${workflowName}" stopped` : 'Workflow has been stopped',
      });
    } catch (error) {
      toast({
        title: 'Stop failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const installPackage = async (language: string, packages: string[]) => {
    try {
      await installPackages.mutateAsync({ language, packages });
    } catch (error) {
      // Error already handled by mutation
      throw error;
    }
  };

  const configureWorkflow = async (
    currentName: string,
    newName: string,
    commands: string,
    mode?: 'sequential' | 'parallel'
  ) => {
    try {
      const response = await fetch('/api/workflow/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowName: newName || currentName,
          commands: commands.split(',').map(c => c.trim()).filter(Boolean),
          mode,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to configure workflow');
      }

      const result = await response.json();

      toast({
        title: 'Workflow configured',
        description: `Workflow "${newName || currentName}" has been configured`,
      });

      return result;
    } catch (error) {
      toast({
        title: 'Configuration failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const executeWorkflow = async (workflowName: string) => {
    try {
      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowName })
      });

      if (!response.ok) {
        throw new Error('Failed to execute workflow');
      }

      toast({
        title: 'Workflow started',
        description: `Executing workflow "${workflowName}"`,
      });

      return response.json();
    } catch (error) {
      toast({
        title: 'Execution failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getWorkflowStatus = async () => {
    try {
      const response = await fetch('/api/workflow/status');
      if (!response.ok) {
        throw new Error('Failed to get workflow status');
      }
      return response.json();
    } catch (error) {
      console.error('Failed to get workflow status:', error);
      return null;
    }
  };

  const configureDeployment = async (deployment: {
    buildCommand?: string;
    runCommand: string;
  }) => {
    try {
      const response = await fetch('/api/deployment/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deployment)
      });

      if (!response.ok) {
        throw new Error('Failed to configure deployment');
      }

      toast({
        title: 'Deployment configured',
        description: 'Deployment settings have been updated',
      });
    } catch (error) {
      toast({
        title: 'Configuration failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    applyChange,
    executeShellCommand,
    captureScreenshot,
    scrapeUrl,
    readFileContent,
    writeFileContent,
    listDirectory,
    deleteFileOrDir,
    handleScreenshot,
    handleScrape,
    restartWorkflow,
    stopWorkflow,
    installPackage,
    configureWorkflow,
    configureDeployment,
    executeWorkflow,
    getWorkflowStatus,
    handleShellCommand,
  };
}