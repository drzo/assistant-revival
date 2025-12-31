import { useRef, useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { TypingIndicator } from "./typing-indicator";
import { PromptSelector } from "../assistant-prompts/prompt-selector";
import { PromptManager } from "../assistant-prompts/prompt-manager";
import { useToast } from "@/hooks/use-toast";
import type { AssistantPrompt } from "@shared/schema";

interface ChatContainerProps {
  onSend: (message: string, mentionedFiles: string[]) => void;
  onFileUpload: () => void;
  onFileClick?: (fileId: string) => void;
}

export function ChatContainer({ onSend, onFileUpload, onFileClick }: ChatContainerProps) {
  const { sessionMessages, currentSessionId, isStreaming, isLoading } = useAssistantStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [prompts, setPrompts] = useState<AssistantPrompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  const messages = useMemo(() => {
    if (!currentSessionId) return [];
    return sessionMessages[currentSessionId] || [];
  }, [sessionMessages, currentSessionId]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch("/api/assistant-prompts");
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
        const defaultPrompt = data.find((p: AssistantPrompt) => p.isDefault);
        if (defaultPrompt) {
          setSelectedPromptId(defaultPrompt.id);
        }
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  const handleCreatePrompt = async (name: string, instructions: string) => {
    const response = await fetch("/api/assistant-prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, instructions }),
    });
    if (response.ok) {
      await fetchPrompts();
    } else {
      throw new Error("Failed to create prompt");
    }
  };

  const handleUpdatePrompt = async (id: string, name: string, instructions: string) => {
    const response = await fetch(`/api/assistant-prompts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, instructions }),
    });
    if (response.ok) {
      await fetchPrompts();
    } else {
      throw new Error("Failed to update prompt");
    }
  };

  const handleDeletePrompt = async (id: string) => {
    const response = await fetch(`/api/assistant-prompts/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchPrompts();
      if (selectedPromptId === id) {
        setSelectedPromptId(null);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to delete prompt",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    const response = await fetch(`/api/assistant-prompts/${id}/set-default`, {
      method: "POST",
    });
    if (response.ok) {
      await fetchPrompts();
      setSelectedPromptId(id);
      toast({
        title: "Success",
        description: "Default prompt updated",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to set default prompt",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PromptSelector
            prompts={prompts}
            selectedPromptId={selectedPromptId}
            onSelectPrompt={setSelectedPromptId}
          />
          <PromptManager
            prompts={prompts}
            onCreatePrompt={handleCreatePrompt}
            onUpdatePrompt={handleUpdatePrompt}
            onDeletePrompt={handleDeletePrompt}
            onSetDefault={handleSetDefault}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-4">
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-medium mb-2">Welcome to Assistant</h2>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                A memorial edition of the lightweight AI tool for chat and quick edits.
                Upload files, mention them with @, and get AI-powered code suggestions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                <QuickAction 
                  title="Upload a file"
                  description="Add code files to provide context"
                  onClick={onFileUpload}
                />
                <QuickAction
                  title="Ask a question"
                  description="Get help with code or concepts"
                  onClick={() => {}}
                />
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onFileClick={onFileClick}
                />
              ))}
              {isStreaming && messages[messages.length - 1]?.role === "assistant" && 
                messages[messages.length - 1]?.content === "" && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ChatInput
        onSend={onSend}
        onFileUpload={onFileUpload}
        disabled={isLoading}
      />
    </div>
  );
}

function QuickAction({ 
  title, 
  description, 
  onClick 
}: { 
  title: string; 
  description: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-3 rounded-md border border-border hover-elevate active-elevate-2 transition-colors"
      data-testid={`button-quick-action-${title.toLowerCase().replace(/\s/g, "-")}`}
      type="button"
    >
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </button>
  );
}
