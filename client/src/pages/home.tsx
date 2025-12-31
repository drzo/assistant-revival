import { useState, useCallback, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatContainer } from "@/components/chat/chat-container";
import { FileViewer } from "@/components/files/file-viewer";
import { DiffViewer } from "@/components/diff/diff-viewer";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { useToast } from "@/hooks/use-toast";
import type { Message, Session, Checkpoint } from "@shared/schema";

export default function Home() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    files,
    sessions,
    addSession,
    currentSessionId,
    setCurrentSession,
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    pendingChanges,
    setPendingChanges,
    applyPendingChanges,
    clearPendingChanges,
    checkpoints,
    addCheckpoint,
    setLoading,
    setStreaming,
    isStreaming,
  } = useAssistantStore();

  const selectedFile = files.find((f) => f.id === selectedFileId);

  const handleNewSession = useCallback(() => {
    const session: Session = {
      id: crypto.randomUUID(),
      name: `Chat ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSession(session);
    clearMessages();
    toast({
      title: "New chat started",
      description: "Start a new conversation with Assistant",
    });
  }, [addSession, clearMessages, toast]);

  const handleSendMessage = useCallback(async (content: string, mentionedFiles: string[]) => {
    let sessionId = currentSessionId;
    
    if (!sessionId) {
      const session: Session = {
        id: crypto.randomUUID(),
        name: `Chat ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addSession(session);
      sessionId = session.id;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      mentionedFiles: mentionedFiles.length > 0 ? mentionedFiles : undefined,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);

    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    addMessage(assistantMessage);

    setStreaming(true);
    
    try {
      const mentionedFileData = files.filter((f) => mentionedFiles.includes(f.id));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          files: mentionedFileData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullContent += data.content;
                  updateMessage(assistantMessageId, { content: fullContent });
                }
                if (data.codeChanges && data.codeChanges.length > 0) {
                  setPendingChanges(data.codeChanges);
                }
                if (data.error) {
                  throw new Error(data.error);
                }
              } catch (e) {
                if (e instanceof SyntaxError) {
                  continue;
                }
                throw e;
              }
            }
          }
        }
      }

      if (!fullContent) {
        updateMessage(assistantMessageId, { 
          content: "I apologize, but I couldn't generate a response. Please try again." 
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      updateMessage(assistantMessageId, { 
        content: "I encountered an error while processing your request. Please try again." 
      });
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStreaming(false);
    }
  }, [currentSessionId, files, addSession, addMessage, updateMessage, setPendingChanges, setStreaming, toast]);

  const handleApplyChanges = useCallback(() => {
    const checkpoint: Checkpoint = {
      id: crypto.randomUUID(),
      sessionId: currentSessionId || "",
      messageId: messages[messages.length - 1]?.id || "",
      description: `Applied ${pendingChanges.length} change${pendingChanges.length !== 1 ? "s" : ""}`,
      files: [...files],
      createdAt: new Date().toISOString(),
    };
    addCheckpoint(checkpoint);
    applyPendingChanges();
    toast({
      title: "Changes applied",
      description: "Your files have been updated. A checkpoint was created for rollback.",
    });
  }, [pendingChanges, files, currentSessionId, messages, addCheckpoint, applyPendingChanges, toast]);

  const handleRejectChanges = useCallback(() => {
    clearPendingChanges();
    toast({
      title: "Changes rejected",
      description: "The proposed changes were discarded",
    });
  }, [clearPendingChanges, toast]);

  const handleFileUpload = useCallback(() => {
    const input = document.getElementById("file-upload") as HTMLInputElement;
    input?.click();
  }, []);

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <AppSidebar
          onNewSession={handleNewSession}
          onSelectFile={setSelectedFileId}
          selectedFileId={selectedFileId || undefined}
        />
        
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border h-14">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <span className="text-sm font-medium">
                {currentSessionId ? sessions.find(s => s.id === currentSessionId)?.name || "Chat" : "Welcome"}
              </span>
            </div>
            <ThemeToggle />
          </header>
          
          <main className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={selectedFile ? 60 : 100} minSize={40}>
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    <ChatContainer
                      onSend={handleSendMessage}
                      onFileUpload={handleFileUpload}
                      onFileClick={setSelectedFileId}
                    />
                  </div>
                  
                  {pendingChanges.length > 0 && (
                    <DiffViewer
                      changes={pendingChanges}
                      onApply={handleApplyChanges}
                      onReject={handleRejectChanges}
                    />
                  )}
                </div>
              </Panel>
              
              {selectedFile && (
                <>
                  <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
                  <Panel defaultSize={40} minSize={20}>
                    <FileViewer
                      file={selectedFile}
                      onClose={() => setSelectedFileId(null)}
                    />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
