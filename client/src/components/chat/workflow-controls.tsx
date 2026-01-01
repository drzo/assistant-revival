import { Play, Square, RotateCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodeActions } from "@/hooks/use-code-actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkflowControlsProps {
  workflowName: string;
  status: 'idle' | 'running' | 'success' | 'failed';
}

export function WorkflowControls({ workflowName, status }: WorkflowControlsProps) {
  const { executeWorkflow, restartWorkflow, stopWorkflow, configureWorkflow } = useCodeActions();
  const { toast } = useToast();
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [commands, setCommands] = useState('');
  const [mode, setMode] = useState<'sequential' | 'parallel'>('sequential');
  const [isRunButton, setIsRunButton] = useState(false);

  const handleStart = async () => {
    try {
      await executeWorkflow(workflowName);
    } catch (error) {
      console.error('Failed to start workflow:', error);
    }
  };

  const handleRestart = async () => {
    try {
      await restartWorkflow(workflowName);
    } catch (error) {
      console.error('Failed to restart workflow:', error);
    }
  };

  const handleStop = async () => {
    try {
      await stopWorkflow(workflowName);
    } catch (error) {
      console.error('Failed to stop workflow:', error);
    }
  };

  const handleConfigure = async () => {
    try {
      await configureWorkflow(workflowName, newWorkflowName, commands, mode);
      toast({
        title: "Workflow configured successfully",
        description: `Workflow ${newWorkflowName} has been configured.`,
      });
    } catch (error) {
      console.error('Failed to configure workflow:', error);
      toast({
        title: "Failed to configure workflow",
        description: "There was an error configuring the workflow.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-1">
      {status !== 'running' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStart}
          className="h-6 px-2"
          title="Start workflow"
        >
          <Play className="h-3 w-3" />
        </Button>
      )}
      {status === 'running' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStop}
            className="h-6 px-2"
            title="Stop workflow"
          >
            <Square className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            className="h-6 px-2"
            title="Restart workflow"
          >
            <RotateCw className="h-3 w-3" />
          </Button>
        </>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            title="Configure workflow"
            onClick={() => setIsRunButton(true)}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Workflow</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workflow-name" className="text-right">
                Workflow Name
              </Label>
              <Input
                id="workflow-name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commands" className="text-right">
                Commands
              </Label>
              <Input
                id="commands"
                value={commands}
                onChange={(e) => setCommands(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mode" className="text-right">
                Mode
              </Label>
              <Select onValueChange={(value: 'sequential' | 'parallel') => setMode(value)} defaultValue={mode}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="parallel">Parallel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleConfigure}>Save Configuration</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}