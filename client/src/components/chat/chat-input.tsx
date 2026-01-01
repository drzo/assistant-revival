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
import { parseFileMentions } from "@/lib/mention-parser";

interface ChatInputProps {
  onSendMessage: (message: string, mentionedFiles: string[], systemPrompt?: string) => void;
  onFileUpload: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onFileUpload, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [mentionedFiles, setMentionedFiles] = useState<string[]>([]);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { files, isStreaming } = useAssistantStore();

  const handleSend = useCallback(() => {
    if (!message.trim() || disabled || isStreaming) return;
    
    // Parse @ mentions from message
    const { mentionedFileIds } = parseFileMentions(message, files);
    const allMentionedFiles = Array.from(new Set([...mentionedFiles, ...mentionedFileIds]));
    
    onSendMessage(message.trim(), allMentionedFiles);
    setMessage("");
    setMentionedFiles([]);
  }, [message, mentionedFiles, disabled, isStreaming, onSendMessage, files]);

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
    <div className="border-t border-border bg-background px-4 py-3">
      <div className="flex items-start gap-2 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Assistant, use @ to include specific files..."
            className="min-h-[42px] max-h-40 resize-none pr-24 text-sm border-border"
            disabled={isDisabled}
            data-testid="input-chat-message"
          />
          
          <div className="absolute right-1 bottom-1 flex items-center gap-0.5">
            <Popover open={showFilePicker} onOpenChange={setShowFilePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isDisabled || files.length === 0}
                  data-testid="button-mention-file"
                  type="button"
                >
                  <AtSign className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-1" align="end" side="top">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                  Add file context
                </div>
                {files.length > 0 ? (
                  <div className="max-h-64 overflow-auto">
                    {files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => handleFileSelect(file.id, file.name)}
                        className={cn(
                          "w-full text-left px-2 py-1.5 text-xs rounded-sm hover:bg-accent transition-colors",
                          mentionedFiles.includes(file.id) && "bg-accent"
                        )}
                        data-testid={`button-select-file-${file.id}`}
                        type="button"
                      >
                        <span className="font-mono">{file.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                    No files uploaded
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
          size="sm"
          className="h-[42px] px-4"
          data-testid="button-send-message"
          type="button"
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
