
import type { Express, Request, Response } from 'express';

interface WorkspaceToolNudge {
  toolName: string;
  reason: string;
  timestamp: Date;
}

let toolNudges: WorkspaceToolNudge[] = [];

export function registerWorkspaceToolRoutes(app: Express) {
  // Record a tool nudge
  app.post('/api/workspace-tools/nudge', async (req: Request, res: Response) => {
    try {
      const { toolName, reason } = req.body;

      if (!toolName || !reason) {
        return res.status(400).json({ 
          error: 'toolName and reason are required' 
        });
      }

      const nudge: WorkspaceToolNudge = {
        toolName,
        reason,
        timestamp: new Date()
      };

      toolNudges.unshift(nudge);
      
      // Keep only last 50 nudges
      if (toolNudges.length > 50) {
        toolNudges = toolNudges.slice(0, 50);
      }

      console.log(`[Workspace Tool] Nudge to ${toolName}: ${reason}`);

      res.json({ 
        success: true,
        nudge
      });
    } catch (error) {
      console.error('Error recording tool nudge:', error);
      res.status(500).json({ 
        error: 'Failed to record tool nudge',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get tool nudge history
  app.get('/api/workspace-tools/nudges', async (req: Request, res: Response) => {
    res.json(toolNudges);
  });
}
