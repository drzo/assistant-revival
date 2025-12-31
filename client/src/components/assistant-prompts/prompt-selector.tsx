
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssistantPrompt } from "@shared/schema";

interface PromptSelectorProps {
  prompts: AssistantPrompt[];
  selectedPromptId: string | null;
  onSelectPrompt: (id: string) => void;
}

export function PromptSelector({
  prompts,
  selectedPromptId,
  onSelectPrompt,
}: PromptSelectorProps) {
  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);
  const defaultPrompt = prompts.find((p) => p.isDefault);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {selectedPrompt?.name || defaultPrompt?.name || "Default Assistant"}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {prompts.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No custom prompts
          </div>
        ) : (
          prompts.map((prompt) => (
            <DropdownMenuItem
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt.id)}
              className="flex items-center justify-between"
            >
              <span>{prompt.name}</span>
              {(selectedPromptId === prompt.id || (!selectedPromptId && prompt.isDefault)) && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
