
import { useEffect, useState } from 'react';
import { Play, Check, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCodeActions } from '@/hooks/use-code-actions';

export function WorkflowStatus() {
  const [status, setStatus] = useState<any>(null);
  const { getWorkflowStatus } = useCodeActions();

  useEffect(() => {
    const fetchStatus = async () => {
      const workflowStatus = await getWorkflowStatus();
      setStatus(workflowStatus);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [getWorkflowStatus]);

  if (!status) return null;

  return (
    <Card className="p-3 border-muted">
      <div className="flex items-center gap-2">
        {status.status === 'running' ? (
          <Play className="h-4 w-4 text-blue-500 animate-pulse" />
        ) : status.status === 'success' ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="text-sm font-medium">
          {status.workflow || 'No active workflow'}
        </span>
        <Badge variant={status.status === 'running' ? 'default' : 'secondary'}>
          {status.status}
        </Badge>
      </div>
    </Card>
  );
}
