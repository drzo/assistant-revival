
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ApplyProgressProps {
  total: number;
  completed: number;
  failed: number;
  currentFile?: string;
}

export function ApplyProgress({ total, completed, failed, currentFile }: ApplyProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = total > 0 ? ((completed + failed) / total) * 100 : 0;
    setProgress(newProgress);
  }, [completed, failed, total]);

  if (total === 0) {
    return null;
  }

  const isComplete = completed + failed >= total;
  const hasFailures = failed > 0;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isComplete && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            {isComplete && !hasFailures && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            {isComplete && hasFailures && <XCircle className="h-4 w-4 text-yellow-600" />}
            
            <span className="text-sm font-medium">
              {isComplete 
                ? hasFailures 
                  ? "Completed with errors"
                  : "All changes applied"
                : "Applying changes..."}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {completed}/{total} {failed > 0 && `(${failed} failed)`}
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {currentFile && !isComplete && (
          <div className="text-xs text-muted-foreground">
            Current: {currentFile}
          </div>
        )}

        {isComplete && (
          <div className="text-xs">
            {!hasFailures ? (
              <span className="text-green-600">✓ Successfully applied all changes</span>
            ) : (
              <span className="text-yellow-600">
                ⚠ {completed} succeeded, {failed} failed
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
