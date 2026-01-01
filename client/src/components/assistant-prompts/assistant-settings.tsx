import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { Separator } from "@/components/ui/separator";

export function AssistantSettings() {
  const { settings, updateSettings } = useAssistantStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-assistant-settings">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Assistant Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure how the assistant behaves
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-apply" className="text-sm font-medium">
                    Auto-apply changes
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically apply code suggestions
                  </p>
                </div>
                <Switch
                  id="auto-apply"
                  checked={settings.autoApplyChanges}
                  onCheckedChange={(checked) =>
                    updateSettings({ autoApplyChanges: checked })
                  }
                  data-testid="switch-auto-apply"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-restart" className="text-sm font-medium">
                    Auto-restart workflow
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Restart app when files change
                  </p>
                </div>
                <Switch
                  id="auto-restart"
                  checked={settings.autoRestartWorkflow}
                  onCheckedChange={(checked) =>
                    updateSettings({ autoRestartWorkflow: checked })
                  }
                  data-testid="switch-auto-restart"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Changes are saved automatically</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}