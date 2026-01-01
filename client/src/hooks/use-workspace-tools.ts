
import { useState } from 'react';

interface ToolNudge {
  toolName: string;
  reason: string;
}

export function useWorkspaceTools() {
  const [isNudging, setIsNudging] = useState(false);

  const nudgeTool = async ({ toolName, reason }: ToolNudge) => {
    setIsNudging(true);
    try {
      const response = await fetch('/api/workspace-tools/nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, reason })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to record tool nudge');
      }

      return data;
    } finally {
      setIsNudging(false);
    }
  };

  const getNudges = async () => {
    const response = await fetch('/api/workspace-tools/nudges');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get nudges');
    }

    return data;
  };

  return {
    nudgeTool,
    getNudges,
    isNudging
  };
}
