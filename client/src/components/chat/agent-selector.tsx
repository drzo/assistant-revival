import { Bot, Bug, Code } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMastra } from "@/hooks/use-mastra";

interface AgentSelectorProps {
  selectedAgent: string;
  onSelectAgent: (agent: string) => void;
}

const agentIcons: Record<string, typeof Bot> = {
  assistantAgent: Bot,
  codeReviewerAgent: Code,
  debuggerAgent: Bug,
};

export function AgentSelector({ selectedAgent, onSelectAgent }: AgentSelectorProps) {
  const { agents } = useMastra();

  const getAgentIcon = (name: string) => {
    const IconComponent = agentIcons[name] || Bot;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Select value={selectedAgent} onValueChange={onSelectAgent}>
      <SelectTrigger 
        className="w-[180px]" 
        data-testid="select-agent-trigger"
      >
        <div className="flex items-center gap-2">
          {getAgentIcon(selectedAgent)}
          <SelectValue placeholder="Select agent" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem 
            key={agent.name} 
            value={agent.name}
            data-testid={`select-agent-${agent.name}`}
          >
            <div className="flex items-center gap-2">
              {getAgentIcon(agent.name)}
              <div className="flex flex-col">
                <span className="text-sm">{agent.name.replace(/Agent$/, '')}</span>
                <span className="text-xs text-muted-foreground">
                  {agent.description}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
