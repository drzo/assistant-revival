
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { File, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileMentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  availableFiles: Array<{ path: string; name: string }>;
  mentionedFiles: string[];
  onMentionFile: (filePath: string) => void;
  onRemoveMention: (filePath: string) => void;
  disabled?: boolean;
}

export function FileMentionInput({
  value,
  onChange,
  onSubmit,
  availableFiles,
  mentionedFiles,
  onMentionFile,
  onRemoveMention,
  disabled
}: FileMentionInputProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (newValue: string) => {
    onChange(newValue);
    
    // Detect @ mentions
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (atMatch) {
      setMentionFilter(atMatch[1]);
      setShowMentions(true);
      setCursorPosition(cursorPos);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (filePath: string) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const beforeAt = textBeforeCursor.replace(/@\w*$/, '');
    const newValue = `${beforeAt}@${filePath} ${textAfterCursor}`;
    
    onChange(newValue);
    onMentionFile(filePath);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const filteredFiles = availableFiles.filter(file =>
    file.path.toLowerCase().includes(mentionFilter.toLowerCase()) ||
    file.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {mentionedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mentionedFiles.map(filePath => (
            <div
              key={filePath}
              className="flex items-center gap-1 px-2 py-1 bg-accent rounded-md text-sm"
            >
              <File className="h-3 w-3" />
              <span>{filePath}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => onRemoveMention(filePath)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type @ to mention files, or ask a question..."
          disabled={disabled}
          className="min-h-[80px]"
        />
        
        {showMentions && filteredFiles.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-2 border rounded-md bg-background shadow-lg">
            <ScrollArea className="max-h-48">
              <div className="p-2 space-y-1">
                {filteredFiles.map(file => (
                  <Button
                    key={file.path}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => insertMention(file.path)}
                  >
                    <File className="h-4 w-4" />
                    <span className="truncate">{file.path}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
