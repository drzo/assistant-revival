import { Bot, User, FileCode2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import type { Message } from "@shared/schema";
import { CodeBlock } from "./code-block";

interface ChatMessageProps {
  message: Message;
  onFileClick?: (fileId: string) => void;
}

export function ChatMessage({ message, onFileClick }: ChatMessageProps) {
  const { files } = useAssistantStore();
  const isUser = message.role === "user";
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

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

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
      data-testid={`message-${message.id}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] space-y-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-md p-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-card-border"
          )}
        >
          {message.mentionedFiles && message.mentionedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {message.mentionedFiles.map((fileId) => (
                <Badge
                  key={fileId}
                  variant="secondary"
                  className="cursor-pointer text-xs"
                  onClick={() => onFileClick?.(fileId)}
                  data-testid={`badge-file-${fileId}`}
                >
                  <FileCode2 className="h-3 w-3 mr-1" />
                  @{getFileName(fileId)}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="text-sm leading-relaxed">
            {renderContent(message.content)}
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground px-1">
          {timestamp}
        </span>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
