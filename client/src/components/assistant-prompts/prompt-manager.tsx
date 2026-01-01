
import { useState } from "react";
import { Plus, Trash2, Star, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { AssistantPrompt } from "@shared/schema";

interface PromptManagerProps {
  prompts: AssistantPrompt[];
  onCreatePrompt: (name: string, instructions: string) => Promise<void>;
  onUpdatePrompt: (id: number, name: string, instructions: string) => Promise<void>;
  onDeletePrompt: (id: number) => Promise<void>;
  onSetDefault: (id: number) => Promise<void>;
}

export function PromptManager({
  prompts,
  onCreatePrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onSetDefault,
}: PromptManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim() || !instructions.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and instructions are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await onCreatePrompt(name, instructions);
      setName("");
      setInstructions("");
      toast({
        title: "Success",
        description: "Custom prompt created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prompt",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !name.trim() || !instructions.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and instructions are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await onUpdatePrompt(editingId, name, instructions);
      setEditingId(null);
      setName("");
      setInstructions("");
      toast({
        title: "Success",
        description: "Prompt updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prompt",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (prompt: AssistantPrompt) => {
    setEditingId(prompt.id);
    setName(prompt.name);
    setInstructions(prompt.instructions);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setInstructions("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Assistant Prompts</DialogTitle>
          <DialogDescription>
            Create and manage custom prompts to personalize your Assistant's behavior
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt-name">Name</Label>
              <Input
                id="prompt-name"
                placeholder="e.g., Detailed Responses"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="prompt-instructions">Instructions</Label>
              <Textarea
                id="prompt-instructions"
                placeholder="Enter custom instructions for the Assistant..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={10}
              />
            </div>
            <div className="flex gap-2">
              {editingId ? (
                <>
                  <Button onClick={handleUpdate} className="flex-1">
                    Update Prompt
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleCreate} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Prompt
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Saved Prompts</Label>
            <ScrollArea className="h-[400px] border rounded-md p-2">
              {prompts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No custom prompts yet
                </div>
              ) : (
                <div className="space-y-2">
                  {prompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className={cn(
                        "p-3 rounded-md border cursor-pointer hover:bg-accent",
                        editingId === prompt.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1" onClick={() => handleEdit(prompt)}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{prompt.name}</span>
                            {prompt.isDefault && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {prompt.instructions}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!prompt.isDefault && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onSetDefault(prompt.id)}
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => onDeletePrompt(prompt.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
