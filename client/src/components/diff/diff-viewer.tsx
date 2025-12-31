import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { CodeChange } from "@shared/schema";

interface DiffViewerProps {
  changes: CodeChange[];
  onApply: () => void;
  onReject: () => void;
}

export function DiffViewer({ changes, onApply, onReject }: DiffViewerProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(
    new Set(changes.map((c) => c.fileId))
  );

  const toggleFile = (fileId: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId);
    } else {
      newExpanded.add(fileId);
    }
    setExpandedFiles(newExpanded);
  };

  if (changes.length === 0) return null;

  return (
    <div className="border-t border-border bg-card">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Proposed Changes</span>
          <span className="text-xs text-muted-foreground">
            {changes.length} file{changes.length !== 1 ? "s" : ""}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            data-testid="button-reject-changes"
          >
            <X className="h-3 w-3 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={onApply}
            data-testid="button-apply-changes"
          >
            <Check className="h-3 w-3 mr-1" />
            Apply All
          </Button>
        </div>
      </div>
      
      <ScrollArea className="max-h-80">
        <div className="p-2 space-y-2">
          {changes.map((change) => (
            <DiffFileCard
              key={change.fileId}
              change={change}
              isExpanded={expandedFiles.has(change.fileId)}
              onToggle={() => toggleFile(change.fileId)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface DiffFileCardProps {
  change: CodeChange;
  isExpanded: boolean;
  onToggle: () => void;
}

function DiffFileCard({ change, isExpanded, onToggle }: DiffFileCardProps) {
  const oldLines = change.oldContent.split("\n");
  const newLines = change.newContent.split("\n");
  
  const diffLines = computeDiff(oldLines, newLines);
  const additions = diffLines.filter((l) => l.type === "add").length;
  const deletions = diffLines.filter((l) => l.type === "remove").length;

  return (
    <div className="rounded-md border border-border overflow-hidden" data-testid={`diff-file-${change.fileId}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-muted/50 hover-elevate"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs truncate">{change.fileName}</span>
          <span className="text-xs text-chart-2">+{additions}</span>
          <span className="text-xs text-destructive">-{deletions}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="overflow-x-auto">
          <pre className="text-xs font-mono">
            {diffLines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "px-3 py-0.5",
                  line.type === "add" && "bg-chart-2/10 text-chart-2",
                  line.type === "remove" && "bg-destructive/10 text-destructive"
                )}
              >
                <span className="select-none pr-2 text-muted-foreground/50">
                  {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                </span>
                {line.content}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

interface DiffLine {
  type: "add" | "remove" | "unchanged";
  content: string;
}

function computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < oldLines.length || j < newLines.length) {
    if (i >= oldLines.length) {
      result.push({ type: "add", content: newLines[j] });
      j++;
    } else if (j >= newLines.length) {
      result.push({ type: "remove", content: oldLines[i] });
      i++;
    } else if (oldLines[i] === newLines[j]) {
      result.push({ type: "unchanged", content: oldLines[i] });
      i++;
      j++;
    } else {
      const oldInNew = newLines.slice(j).indexOf(oldLines[i]);
      const newInOld = oldLines.slice(i).indexOf(newLines[j]);

      if (oldInNew === -1 && newInOld === -1) {
        result.push({ type: "remove", content: oldLines[i] });
        result.push({ type: "add", content: newLines[j] });
        i++;
        j++;
      } else if (oldInNew === -1 || (newInOld !== -1 && newInOld < oldInNew)) {
        result.push({ type: "remove", content: oldLines[i] });
        i++;
      } else {
        result.push({ type: "add", content: newLines[j] });
        j++;
      }
    }
  }

  return result;
}
