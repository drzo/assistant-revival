import { useRef, useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { TypingIndicator } from "./typing-indicator";
import { PromptSelector } from "../assistant-prompts/prompt-selector";
import { PromptManager } from "../assistant-prompts/prompt-manager";
import { AssistantSettings } from "../assistant-prompts/assistant-settings";
import { AgentSelector } from "./agent-selector";
import { useToast } from "@/hooks/use-toast";
import { parseCodeChangesFromMessage } from "@/lib/code-change-applier";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useAutoApply } from "@/hooks/use-auto-apply";
import type { AssistantPrompt } from "@shared/schema";

interface ChatContainerProps {
  onFileUpload: () => void;
  onFileClick?: (fileId: string) => void;
}

export function ChatContainer({ onFileUpload, onFileClick }: ChatContainerProps) {
  const { sessionMessages, currentSessionId, isStreaming, isLoading, updateMessage, setPendingChanges, settings, files } = useAssistantStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sendMessage, isStreaming: isChatStreaming } = useChatStream();
  
  // Auto-apply code changes when enabled
  useAutoApply();


  const [prompts, setPrompts] = useState<AssistantPrompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("assistantAgent");

  const messages = useMemo(() => {
    if (!currentSessionId) return [];
    return sessionMessages[currentSessionId] || [];
  }, [sessionMessages, currentSessionId]);

  const handleCodeChangeProposed = (change: any) => {
    if (settings.autoApplyChanges) {
      setPendingChanges([change]);
    } else {
      const store = useAssistantStore.getState();
      const currentChanges = store.pendingChanges || [];
      setPendingChanges([...currentChanges, change]);
      toast({
        title: "Code change proposed",
        description: "Review the changes in the diff viewer below",
      });
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch("/api/assistant-prompts");
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
        const defaultPrompt = data.find((p: any) => p.isDefault);
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

  const handleUpdatePrompt = async (id: number, name: string, instructions: string) => {
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

  const handleDeletePrompt = async (id: number) => {
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

  const handleSetDefault = async (id: number) => {
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
  }, [messages, isChatStreaming]);

  // Parse code actions from messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;
    if ((lastMessage as any).metadata) return; // Already parsed

    const { fileEdits, shellCommands } = parseCodeChangesFromMessage(lastMessage.content);

    if (fileEdits.length > 0 || shellCommands.length > 0) {
      updateMessage(lastMessage.id, {
        ...lastMessage,
        metadata: { fileEdits, shellCommands }
      } as any);
    }
  }, [messages, updateMessage]);

  const handleSendMessage = async (content: string, mentionedFiles: string[], systemPrompt?: string) => {
    await sendMessage(content, mentionedFiles, systemPrompt, selectedAgent);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <AgentSelector
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
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
        <AssistantSettings />
      </div>
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-base font-medium mb-1">Welcome to Assistant</h2>
              <p className="text-xs text-muted-foreground text-center max-w-md">
                Upload files, mention them with @, and get AI-powered code suggestions
              </p>
            </div>
          ) : (
            <div className="py-2">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onFileClick={onFileClick}
                  onCodeChangeProposed={handleCodeChangeProposed}
                />
              ))}
              {isChatStreaming && messages[messages.length - 1]?.role === "assistant" &&
                messages[messages.length - 1]?.content === "" && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput
        onSendMessage={handleSendMessage}
        onFileUpload={onFileUpload}
        disabled={isLoading || isChatStreaming}
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