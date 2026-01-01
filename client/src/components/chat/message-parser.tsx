
import { Button } from "@/components/ui/button";
import { FileCode } from "lucide-react";

interface CodeChangeBlock {
  type: 'code_change';
  fileName: string;
  description: string;
  oldContent: string;
  newContent: string;
}

interface MessageParserProps {
  content: string;
  onCodeChangeProposed?: (change: any) => void;
}

export function MessageParser({ content, onCodeChangeProposed }: MessageParserProps) {
  // Parse code change blocks from markdown-style format
  const parseCodeChanges = (text: string): CodeChangeBlock[] => {
    const changes: CodeChangeBlock[] = [];
    const regex = /```diff\s+(\S+)\s*\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const fileName = match[1];
      const diffContent = match[2];
      
      const lines = diffContent.split('\n');
      let oldContent = '';
      let newContent = '';
      
      for (const line of lines) {
        if (line.startsWith('-')) {
          oldContent += line.substring(1) + '\n';
        } else if (line.startsWith('+')) {
          newContent += line.substring(1) + '\n';
        } else {
          oldContent += line + '\n';
          newContent += line + '\n';
        }
      }

      changes.push({
        type: 'code_change',
        fileName,
        description: `Update ${fileName}`,
        oldContent: oldContent.trim(),
        newContent: newContent.trim(),
      });
    }

    return changes;
  };

  const codeChanges = parseCodeChanges(content);

  return (
    <div className="space-y-2">
      <div className="prose dark:prose-invert max-w-none">
        {content}
      </div>
      
      {codeChanges.length > 0 && onCodeChangeProposed && (
        <div className="space-y-2 pt-2 border-t">
          {codeChanges.map((change, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileCode className="h-4 w-4" />
              <span className="text-sm flex-1">{change.description}</span>
              <Button
                size="sm"
                onClick={() => onCodeChangeProposed({
                  id: `change-${Date.now()}-${idx}`,
                  ...change,
                })}
              >
                Preview
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
