import { useCallback, useRef } from "react";
import { Upload, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getLanguageFromFileName } from "@/lib/file-utils";
import type { File as FileType } from "@shared/schema";

interface FileUploadProps {
  onUpload: (file: FileType) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit`,
            variant: "destructive",
          });
          continue;
        }

        try {
          const content = await file.text();
          const newFile: FileType = {
            id: crypto.randomUUID(),
            name: file.name,
            content,
            language: getLanguageFromFileName(file.name),
            size: file.size,
            uploadedAt: new Date().toISOString(),
          };
          onUpload(newFile);
          toast({
            title: "File uploaded",
            description: `${file.name} has been added`,
          });
        } catch (error) {
          toast({
            title: "Upload failed",
            description: `Could not read ${file.name}`,
            variant: "destructive",
          });
        }
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onUpload, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0 && inputRef.current) {
        const dt = new DataTransfer();
        for (const file of Array.from(files)) {
          dt.items.add(file);
        }
        inputRef.current.files = dt.files;
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
    []
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="border-2 border-dashed border-border rounded-md p-6 text-center hover:border-primary/50 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      data-testid="dropzone-file-upload"
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".js,.jsx,.ts,.tsx,.py,.rb,.java,.cpp,.c,.cs,.go,.rs,.php,.html,.css,.scss,.json,.xml,.yaml,.yml,.md,.sql,.sh,.vue,.svelte,.swift,.kt,.scala,.txt"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        data-testid="input-file-upload"
      />
      
      <div className="w-12 h-12 rounded-md bg-muted mx-auto mb-3 flex items-center justify-center">
        <Upload className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="text-sm font-medium mb-1">Drop files here or click to upload</div>
      <div className="text-xs text-muted-foreground mb-3">
        Supports code files up to 5MB
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        data-testid="button-browse-files"
      >
        <FileCode2 className="h-4 w-4 mr-2" />
        Browse Files
      </Button>
    </div>
  );
}
