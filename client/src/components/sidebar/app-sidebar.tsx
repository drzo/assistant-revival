import { useState } from "react";
import { Plus, MessageSquare, Trash2, FolderOpen, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileCard } from "@/components/files/file-card";
import { FileUpload } from "@/components/files/file-upload";
import { CheckpointList } from "@/components/checkpoints/checkpoint-list";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onNewSession: () => void;
  onSelectFile: (fileId: string) => void;
  selectedFileId?: string;
}

export function AppSidebar({ onNewSession, onSelectFile, selectedFileId }: AppSidebarProps) {
  const [activeTab, setActiveTab] = useState<"files" | "history">("files");
  const {
    sessions,
    currentSessionId,
    setCurrentSession,
    deleteSession,
    files,
    addFile,
    removeFile,
    checkpoints,
    restoreCheckpoint,
  } = useAssistantStore();

  const handleSessionClick = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Assistant</h1>
            <p className="text-xs text-muted-foreground">Memorial Edition</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="px-2 py-2">
            <Button
              onClick={onNewSession}
              className="w-full justify-start"
              variant="outline"
              data-testid="button-new-session"
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-32">
              <SidebarMenu>
                {sessions.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                    No chat history yet
                  </div>
                ) : (
                  sessions.map((session) => (
                    <SidebarMenuItem key={session.id}>
                      <SidebarMenuButton
                        onClick={() => handleSessionClick(session.id)}
                        className={cn(
                          currentSessionId === session.id && "bg-sidebar-accent"
                        )}
                        data-testid={`button-session-${session.id}`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="flex-1 truncate text-xs">{session.name}</span>
                      </SidebarMenuButton>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        data-testid={`button-delete-session-${session.id}`}
                        type="button"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="flex-1">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "files" | "history")}>
            <TabsList className="w-full grid grid-cols-2 mx-2" style={{ width: "calc(100% - 16px)" }}>
              <TabsTrigger value="files" className="text-xs" data-testid="tab-files">
                <FolderOpen className="h-3 w-3 mr-1" />
                Files
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs" data-testid="tab-history">
                <History className="h-3 w-3 mr-1" />
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="files" className="mt-2 px-2">
              <div className="space-y-2">
                {files.length > 0 && (
                  <ScrollArea className="h-40">
                    <div className="space-y-2 pr-2">
                      {files.map((file) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          isActive={file.id === selectedFileId}
                          onRemove={removeFile}
                          onClick={onSelectFile}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
                <FileUpload onUpload={addFile} />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-2">
              <CheckpointList
                checkpoints={checkpoints.filter((c) => c.sessionId === currentSessionId)}
                onRestore={restoreCheckpoint}
              />
            </TabsContent>
          </Tabs>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          In loving memory of Replit Assistant
          <br />
          Dec 2024 - Dec 2025
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
