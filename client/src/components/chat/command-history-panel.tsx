
import { Terminal, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCommandHistory } from '@/hooks/use-command-history';
import { useCodeActions } from '@/hooks/use-code-actions';

export function CommandHistoryPanel() {
  const { history, clearHistory } = useCommandHistory();
  const { handleShellCommand } = useCodeActions();

  if (history.length === 0) {
    return (
      <Card className="p-4 text-center text-sm text-muted-foreground">
        No command history yet
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-medium">Command History</span>
        </div>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          Clear
        </Button>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {history.map((execution, idx) => (
            <Card key={idx} className="p-2 border-muted">
              <div className="flex items-start gap-2">
                {execution.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <code className="text-xs block truncate">{execution.command}</code>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(execution.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {execution.output && (
                    <div className="mt-1 text-xs text-muted-foreground truncate">
                      {execution.output}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShellCommand(execution.command, execution.workingDirectory)}
                  className="h-7"
                >
                  Rerun
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
