import { X, Download, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeBlock } from "@/components/chat/code-block";
import type { File } from "@shared/schema";

interface FileViewerProps {
  file: File;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const handleDownload = () => {
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full border-l border-border">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-mono text-sm truncate">{file.name}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            data-testid="button-download-file"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-file-viewer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <CodeBlock
          code={file.content}
          language={file.language}
          fileName={file.name}
        />
      </ScrollArea>
    </div>
  );
}
