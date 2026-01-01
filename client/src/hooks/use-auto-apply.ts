import { useEffect, useState } from 'react';
import { useAssistantStore } from './use-assistant-store';
import { applyFileEdit } from '@/lib/code-change-applier';
import { useToast } from './use-toast';

export function useAutoApply() {
  const { pendingChanges, settings, clearPendingChanges } = useAssistantStore();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!settings.autoApplyChanges || pendingChanges.length === 0 || isApplying) return;

    const applyChanges = async () => {
      setIsApplying(true);
      const successfulChanges: string[] = [];
      const failedChanges: Array<{ file: string; error: string }> = [];

      try {
        for (const change of pendingChanges) {
          try {
            await applyFileEdit({
              file: change.fileName,
              added: 0,
              removed: 0,
              newContent: change.newContent,
              oldContent: change.oldContent,
              changeType: change.oldContent ? 'edit' : 'create',
            });
            successfulChanges.push(change.fileName);
          } catch (error) {
            failedChanges.push({
              file: change.fileName,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        if (successfulChanges.length > 0) {
          toast({
            title: 'Changes applied',
            description: `Successfully applied ${successfulChanges.length} change(s)`,
          });

          // Auto-restart workflow if enabled
          if (settings.autoRestartWorkflow) {
            try {
              const response = await fetch('/api/workflow/restart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });

              if (response.ok) {
                toast({
                  title: 'Workflow restarted',
                  description: 'Application has been restarted with your changes',
                });
              }
            } catch (error) {
              console.error('Failed to restart workflow:', error);
            }
          }
        }

        if (failedChanges.length > 0) {
          toast({
            title: 'Some changes failed',
            description: `Failed to apply ${failedChanges.length} change(s). Check console for details.`,
            variant: 'destructive',
          });
          console.error('Failed changes:', failedChanges);
        }

        clearPendingChanges();
      } catch (error) {
        toast({
          title: 'Failed to apply changes',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      } finally {
        setIsApplying(false);
      }
    };

    applyChanges();
  }, [pendingChanges, settings.autoApplyChanges, clearPendingChanges, toast, isApplying]);

  return { isApplying };
}