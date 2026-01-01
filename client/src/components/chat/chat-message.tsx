import { Bot, User, FileCode2, ChevronRight, Terminal, FileEdit, Play, Check, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { useCodeActions } from "@/hooks/use-code-actions";
import type { Message } from "@shared/schema";
import { CodeBlock } from "./code-block";
import { WorkspaceToolNudge } from "./workspace-tool-nudge";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: Message;
  onFileClick?: (fileId: string) => void;
  onCodeChangeProposed?: (change: any) => void;
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

// Helper to generate consistent hash for command tracking
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

declare global {
  interface String {
    hashCode(): number;
  }
}

export function ChatMessage({ message, onFileClick, onCodeChangeProposed }: ChatMessageProps) {
  const { files, settings } = useAssistantStore();
  const isUser = message.role === "user";
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { 
    handleShellCommand, 
    handleScreenshot, 
    handleScrape, 
    configureWorkflow,
    configureDeployment 
  } = useCodeActions();
  const { toast } = useToast();

  const handleConfigureWorkflow = async (workflow: any) => {
    try {
      await configureWorkflow(workflow);
      toast({
        title: "Workflow configured",
        description: `Workflow "${workflow.workflowName}" has been set up`,
      });
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleConfigureDeployment = async (deployment: any) => {
    try {
      await configureDeployment(deployment);
      toast({
        title: "Deployment configured",
        description: "Deployment settings have been updated",
      });
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  const [appliedEdits, setAppliedEdits] = useState<Set<string>>(new Set());
  const [copiedCommands, setCopiedCommands] = useState<Set<number>>(new Set());
  const [executedCommands, setExecutedCommands] = useState<Set<number>>(new Set());
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  // Detect URLs in message content
  const urls = message.content.match(URL_PATTERN) || [];

  const handleUrlAction = async (url: string, action: 'screenshot' | 'scrape') => {
    setLoadingUrl(url);
    try {
      if (action === 'screenshot') {
        await handleScreenshot(url);
        toast({
          title: "Screenshot captured",
          description: "Screenshot has been added to the conversation",
        });
      } else {
        await handleScrape(url);
        toast({
          title: "Content scraped",
          description: "Page content has been added to the conversation",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process URL",
        variant: "destructive",
      });
    } finally {
      setLoadingUrl(null);
    }
  };


  const handleExecuteCommand = async (cmd: string, idx: number) => {
    if (executedCommands.has(idx)) return;

    try {
      const result = await handleShellCommand(cmd);
      setExecutedCommands(new Set([...executedCommands, idx]));
      
      // Show command output if available
      if (result?.output) {
        toast({
          title: "Command executed",
          description: result.output.substring(0, 200) + (result.output.length > 200 ? '...' : ''),
        });
      }
    } catch (error) {
      console.error("Failed to execute command:", error);
      toast({
        title: "Command failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  // Parse shell commands, file edits, package installs, and workspace tool nudges from message metadata
  const metadata = (message as any).metadata || {};
  const packageInstalls = metadata.packageInstalls || [];
  const workspaceToolNudges = metadata.workspaceToolNudges || [];
  const workflowConfigurations = metadata.workflowConfigurations || [];
  const deploymentConfigurations = metadata.deploymentConfigurations || [];

  const renderContent = (content: string) => {
    if (!content) return null;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {content.slice(lastIndex, match.index)}
          </span>
        );
      }

      const language = match[1] || "plaintext";
      const code = match[2].trim();
      parts.push(
        <CodeBlock key={`code-${match.index}`} code={code} language={language} />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{content}</span>;
  };

  const getFileName = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    return file?.name || fileId;
  };

  const handleApplyEdit = async (edit: any, index: number) => {
    const editKey = `${edit.file}-${index}`;
    if (appliedEdits.has(editKey)) return;

    try {
      // Import and use the applyFileEdit function
      const { applyFileEdit } = await import('@/lib/code-change-applier');
      
      await applyFileEdit({
        file: edit.file,
        added: edit.added || 0,
        removed: edit.removed || 0,
        newContent: edit.newContent,
        oldContent: edit.oldContent,
        changeType: edit.oldContent ? 'edit' : 'create',
      });

      // Notify parent component about the code change
      if (onCodeChangeProposed) {
        onCodeChangeProposed(edit);
      }

      // Mark as applied
      setAppliedEdits(new Set([...appliedEdits, editKey]));
      
      toast({
        title: "Edit applied",
        description: `Updated ${edit.file}`,
      });
    } catch (error) {
      console.error("Failed to apply edit:", error);
      toast({
        title: "Failed to apply edit",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 px-4 py-2",
        isUser ? "" : ""
      )}
      data-testid={`message-${message.id}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-primary flex items-center justify-center mt-1">
          <Bot className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      )}

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {isUser ? "You" : "Assistant"}
          </span>
          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>

        {/* Package Installations */}
        {packageInstalls.map((pkg: any, idx: number) => {
          const pkgKey = `${pkg.language}-${pkg.packages.join('-')}-${idx}`;
          const isInstalled = executedCommands.has(pkgKey.hashCode());
          
          return (
            <div key={`pkg-${idx}`} className="flex items-center gap-2 p-2 rounded-md bg-muted border border-border">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-xs font-mono">
                Install {pkg.language}: {pkg.packages.join(', ')}
              </span>
              {!isInstalled ? (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={async () => {
                    const installCmd = pkg.language === 'nodejs' 
                      ? `npm install ${pkg.packages.join(' ')}`
                      : pkg.language === 'python'
                      ? `pip install ${pkg.packages.join(' ')}`
                      : `install ${pkg.packages.join(' ')}`;
                    
                    try {
                      await handleShellCommand(installCmd);
                      setExecutedCommands(new Set([...executedCommands, pkgKey.hashCode()]));
                    } catch (error) {
                      console.error('Failed to install packages:', error);
                    }
                  }}
                >
                  Install
                </Button>
              ) : (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </div>
          );
        })}

        {/* Shell Commands */}
        {metadata.shellCommands?.map((cmd: string, idx: number) => {
          const isCopied = copiedCommands.has(idx);
          const isExecuted = executedCommands.has(idx);

          return (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-muted border border-border">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <code className="flex-1 text-xs font-mono overflow-hidden text-ellipsis">{cmd}</code>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  navigator.clipboard.writeText(cmd);
                  setCopiedCommands(new Set([...copiedCommands, idx]));
                  setTimeout(() => {
                    setCopiedCommands(prev => {
                      const next = new Set(prev);
                      next.delete(idx);
                      return next;
                    });
                  }, 2000);
                }}
                title="Copy command"
              >
                {isCopied ? <Check className="h-3 w-3" /> : "Copy"}
              </Button>
              {!isExecuted && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleExecuteCommand(cmd, idx)}
                  title="Execute command"
                >
                  <Play className="h-3 w-3" />
                </Button>
              )}
              {isExecuted && <Check className="h-4 w-4 text-green-600" />}
            </div>
          );
        })}

        {/* File Edits */}
        {metadata.fileEdits?.map((edit: any, idx: number) => {
          const editKey = `${edit.file}-${idx}`;
          const isApplied = appliedEdits.has(editKey);

          return (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-muted border border-border">
              <FileEdit className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-xs font-mono overflow-hidden text-ellipsis">{edit.file}</span>
              <span className="text-xs text-green-600">+{edit.added}</span>
              <span className="text-xs text-red-600">-{edit.removed}</span>
              {!isApplied ? (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleApplyEdit(edit, idx)}
                  disabled={!settings.autoApplyChanges}
                >
                  Apply
                </Button>
              ) : (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </div>
          );
        })}


        {message.mentionedFiles && message.mentionedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1 py-1">
            {message.mentionedFiles.map((fileId) => {
              const fileName = getFileName(fileId);
              return (
                <FileChangeCard
                  key={fileId}
                  fileName={fileName}
                  onClick={() => onFileClick?.(fileId)}
                />
              );
            })}
          </div>
        )}

        <div className="text-sm leading-relaxed text-foreground">
          {renderContent(message.content)}
        </div>

        {/* Workspace Tool Nudges */}
        {workspaceToolNudges.map((nudge: any, idx: number) => (
          <WorkspaceToolNudge
            key={`nudge-${idx}`}
            toolName={nudge.toolName}
            reason={nudge.reason}
          />
        ))}

        {/* Workflow Configurations */}
        {workflowConfigurations.map((workflow: any, idx: number) => {
          const workflowKey = `workflow-${workflow.workflowName}-${idx}`;
          const isConfigured = executedCommands.has(workflowKey.hashCode());
          
          return (
            <Card key={`workflow-${idx}`} className="p-3 border-muted mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Workflow: {workflow.workflowName}
                </span>
                {workflow.setRunButton && (
                  <Badge variant="outline" className="text-xs">Run Button</Badge>
                )}
                {!isConfigured ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        await handleConfigureWorkflow(workflow);
                        setExecutedCommands(new Set([...executedCommands, workflowKey.hashCode()]));
                      } catch (error) {
                        console.error('Failed to configure workflow:', error);
                      }
                    }}
                  >
                    Configure
                  </Button>
                ) : (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Mode: {workflow.mode || 'sequential'}
              </div>
              <div className="mt-2 space-y-1">
                {workflow.commands?.map((cmd: string, cmdIdx: number) => (
                  <code key={cmdIdx} className="block text-xs bg-muted px-2 py-1 rounded">
                    {cmd}
                  </code>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Deployment Configurations */}
        {deploymentConfigurations.map((deployment: any, idx: number) => {
          const deploymentKey = `deployment-${idx}`;
          const isConfigured = executedCommands.has(deploymentKey.hashCode());
          
          return (
            <Card key={`deployment-${idx}`} className="p-3 border-muted mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Deployment Configuration</span>
                {!isConfigured ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        await handleConfigureDeployment(deployment);
                        setExecutedCommands(new Set([...executedCommands, deploymentKey.hashCode()]));
                      } catch (error) {
                        console.error('Failed to configure deployment:', error);
                      }
                    }}
                  >
                    Apply
                  </Button>
                ) : (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </div>
              {deployment.buildCommand && (
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground mb-1">Build:</div>
                  <code className="block text-xs bg-muted px-2 py-1 rounded">
                    {deployment.buildCommand}
                  </code>
                </div>
              )}
              <div>
                <div className="text-xs text-muted-foreground mb-1">Run:</div>
                <code className="block text-xs bg-muted px-2 py-1 rounded">
                  {deployment.runCommand}
                </code>
              </div>
            </Card>
          );
        })}

        {/* URL Actions */}
        {message.role === "user" && urls.length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              <span>URLs detected</span>
            </div>
            {urls.map((url, idx) => (
              <Card key={idx} className="p-3 border-muted">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono truncate flex-1">{url}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUrlAction(url, 'screenshot')}
                      disabled={loadingUrl === url}
                      className="h-7"
                    >
                      <Camera className="w-3 h-3 mr-1" />
                      Screenshot
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUrlAction(url, 'scrape')}
                      disabled={loadingUrl === url}
                      className="h-7"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Scrape
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {message.role === "assistant" && metadata.codeChanges && metadata.codeChanges.length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Code2 className="w-3 h-3" />
              <span>Suggested code changes</span>
            </div>
            {metadata.codeChanges.map((change: any, idx: number) => {
              const isApplied = appliedEdits.has(`${change.file}-${idx}`);
              return (
                <Card key={idx} className="p-3 border-muted">
                  <div className="flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-mono truncate flex-1">{change.file}</span>
                    <span className="text-xs text-green-600">+{change.added}</span>
                    <span className="text-xs text-red-600">-{change.removed}</span>
                    {!isApplied ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (onCodeChangeProposed) {
                            onCodeChangeProposed(change);
                          }
                          setAppliedEdits(new Set([...appliedEdits, `${change.file}-${idx}`]));
                        }}
                        disabled={!settings.autoApplyChanges}
                        className="h-7"
                      >
                        Apply
                      </Button>
                    ) : (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>

      {isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-muted flex items-center justify-center mt-1">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function FileChangeCard({ fileName, onClick }: { fileName: string; onClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border border-border rounded-md bg-card text-xs">
        <CollapsibleTrigger className="flex items-center gap-2 px-2 py-1.5 w-full hover:bg-accent/50 transition-colors">
          <ChevronRight className={cn("h-3 w-3 transition-transform", isOpen && "rotate-90")} />
          <FileCode2 className="h-3 w-3 text-blue-500" />
          <span className="font-mono flex-1 text-left">{fileName}</span>
          <div className="flex items-center gap-1">
            <span className="text-green-600">+0</span>
            <span className="text-red-600">-0</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-2 py-1.5 border-t border-border bg-muted/30">
            <button
              onClick={onClick}
              className="text-xs text-blue-500 hover:underline"
            >
              View file
            </button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}