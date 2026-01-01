
import { useMutation, useQuery } from "@tanstack/react-query";

interface MastraAgent {
  name: string;
  description: string;
}

interface MastraTool {
  name: string;
  description: string;
}

interface MastraChatRequest {
  message: string;
  agentName?: string;
  tools?: string[];
}

interface MastraChatResponse {
  response: string;
  toolCalls: any[];
  agentName: string;
}

export function useMastra() {
  // Get available agents
  const { data: agents } = useQuery<{ agents: MastraAgent[] }>({
    queryKey: ['/api/mastra/agents'],
  });

  // Get available tools
  const { data: tools } = useQuery<{ tools: MastraTool[] }>({
    queryKey: ['/api/mastra/tools'],
  });

  // Chat with Mastra agent
  const chatMutation = useMutation<MastraChatResponse, Error, MastraChatRequest>({
    mutationFn: async (request) => {
      const response = await fetch('/api/mastra/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to chat with Mastra agent');
      }

      return response.json();
    },
  });

  return {
    agents: agents?.agents || [],
    tools: tools?.tools || [],
    chat: chatMutation.mutateAsync,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
  };
}
