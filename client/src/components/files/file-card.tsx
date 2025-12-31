import { X, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize, getFileIcon } from "@/lib/file-utils";
import type { File } from "@shared/schema";

interface FileCardProps {
  file: File;
  isActive?: boolean;
  onRemove: (fileId: string) => void;
  onClick: (fileId: string) => void;
}

export function FileCard({ file, isActive, onRemove, onClick }: FileCardProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 p-3 rounded-md border border-border hover-elevate cursor-pointer transition-colors",
        isActive && "bg-accent border-accent-border"
      )}
      onClick={() => onClick(file.id)}
      data-testid={`card-file-${file.id}`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
        <span className="text-xs font-mono font-semibold text-muted-foreground">
          {getFileIcon(file.language)}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm truncate">{file.name}</div>
        <div className="text-xs text-muted-foreground">
          {formatFileSize(file.size)} • {file.language}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file.id);
        }}
        data-testid={`button-remove-file-${file.id}`}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
