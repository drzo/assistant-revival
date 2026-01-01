
import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { Badge } from "@/components/ui/badge";

export function AssistantModeToggle() {
  const { settings, updateSettings } = useAssistantStore();
  const isAdvanced = settings.mode === 'advanced';

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 border rounded-md p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={!isAdvanced ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSettings({ mode: 'basic' })}
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              Basic
              <Badge variant="outline" className="text-xs">Free</Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Answer questions using codebase knowledge</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isAdvanced ? "secondary" : "ghost"}
              size="sm"
              onClick={() => updateSettings({ mode: 'advanced' })}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Advanced
              <Badge variant="outline" className="text-xs">$0.05/edit</Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Propose and apply code changes automatically</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
