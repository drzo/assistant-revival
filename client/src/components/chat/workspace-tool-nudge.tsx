
import { AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface WorkspaceToolNudgeProps {
  toolName: string;
  reason: string;
}

const toolInfo: Record<string, { title: string; description: string; action: string }> = {
  envEditor: {
    title: "Secrets Tool",
    description: "Manage environment variables and API keys securely",
    action: "Open Secrets"
  },
  publishing: {
    title: "Publishing",
    description: "Deploy your changes to the web",
    action: "Open Publishing"
  },
  deployments: {
    title: "Deployments",
    description: "Configure and manage your deployments",
    action: "Open Deployments"
  }
};

export function WorkspaceToolNudge({ toolName, reason }: WorkspaceToolNudgeProps) {
  const tool = toolInfo[toolName];
  
  if (!tool) return null;

  return (
    <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900 dark:text-blue-100">
        {tool.title} Recommended
      </AlertTitle>
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <p className="mb-2">{reason}</p>
        <p className="text-sm mb-3">{tool.description}</p>
        <Button size="sm" variant="outline" className="gap-2">
          {tool.action}
          <ExternalLink className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
