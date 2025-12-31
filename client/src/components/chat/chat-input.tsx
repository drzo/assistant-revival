import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, AtSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, mentionedFiles: string[]) => void;
  onFileUpload: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onFileUpload, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [mentionedFiles, setMentionedFiles] = useState<string[]>([]);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { files, isStreaming } = useAssistantStore();

  const handleSend = useCallback(() => {
    if (!message.trim() || disabled || isStreaming) return;
    onSend(message.trim(), mentionedFiles);
    setMessage("");
    setMentionedFiles([]);
  }, [message, mentionedFiles, disabled, isStreaming, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (fileId: string, fileName: string) => {
    if (!mentionedFiles.includes(fileId)) {
      setMentionedFiles([...mentionedFiles, fileId]);
      setMessage((prev) => prev + `@${fileName} `);
    }
    setShowFilePicker(false);
    textareaRef.current?.focus();
  };

  const removeFileMention = (fileId: string) => {
    setMentionedFiles(mentionedFiles.filter((id) => id !== fileId));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = 
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [message]);

  const isDisabled = disabled || isStreaming;

  return (
    <div className="border-t border-border bg-background p-4">
      {mentionedFiles.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {mentionedFiles.map((fileId) => {
            const file = files.find((f) => f.id === fileId);
            return (
              <span
                key={fileId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs"
              >
                @{file?.name || fileId}
                <button
                  onClick={() => removeFileMention(fileId)}
                  className="hover:text-destructive ml-1"
                  data-testid={`button-remove-mention-${fileId}`}
                >
                  x
                </button>
              </span>
            );
          })}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Assistant anything... (use @ to mention files)"
            className="min-h-[44px] max-h-40 resize-none pr-20 text-sm"
            disabled={isDisabled}
            data-testid="input-chat-message"
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Popover open={showFilePicker} onOpenChange={setShowFilePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={isDisabled || files.length === 0}
                  data-testid="button-mention-file"
                  type="button"
                >
                  <AtSign className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="end" side="top">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Mention a file
                </div>
                {files.length > 0 ? (
                  files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleFileSelect(file.id, file.name)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded-sm hover-elevate",
                        mentionedFiles.includes(file.id) && "bg-accent"
                      )}
                      data-testid={`button-select-file-${file.id}`}
                      type="button"
                    >
                      <span className="font-mono text-xs">{file.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No files uploaded yet
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onFileUpload}
              disabled={isDisabled}
              data-testid="button-upload-file"
              type="button"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isDisabled}
          className="h-9"
          data-testid="button-send-message"
          type="button"
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              <span className="text-xs text-primary-foreground/70">
                {navigator.platform.includes("Mac") ? "⌘↵" : "Ctrl+↵"}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
