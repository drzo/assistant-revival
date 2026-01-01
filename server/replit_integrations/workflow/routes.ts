
import type { Express, Request, Response } from "express";

export function registerWorkflowRoutes(app: Express) {
  // Configure workflow
  app.post('/api/workflow/configure', async (req: Request, res: Response) => {
    try {
      const { workflowName, commands, setRunButton, mode } = req.body;

      if (!workflowName || !commands || !Array.isArray(commands)) {
        return res.status(400).json({ 
          error: 'workflowName and commands array are required' 
        });
      }

      console.log('Workflow configuration:', { 
        workflowName, 
        commands, 
        setRunButton, 
        mode: mode || 'sequential' 
      });

      res.json({ 
        success: true, 
        workflow: { 
          name: workflowName,
          commands,
          setRunButton: setRunButton || false,
          mode: mode || 'sequential'
        }
      });
    } catch (error) {
      console.error('Error configuring workflow:', error);
      res.status(500).json({ 
        error: 'Failed to configure workflow',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Restart workflow
  app.post('/api/workflow/restart', async (req: Request, res: Response) => {
    try {
      console.log('Workflow restart requested');
      res.json({ success: true, message: 'Workflow restart initiated' });
    } catch (error) {
      console.error('Error restarting workflow:', error);
      res.status(500).json({ 
        error: 'Failed to restart workflow',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Execute workflow
  app.post('/api/workflow/execute', async (req: Request, res: Response) => {
    try {
      const { workflowName } = req.body;

      if (!workflowName) {
        return res.status(400).json({ error: 'workflowName is required' });
      }

      console.log('Executing workflow:', workflowName);
      res.json({ success: true, message: `Workflow "${workflowName}" started` });
    } catch (error) {
      console.error('Error executing workflow:', error);
      res.status(500).json({ 
        error: 'Failed to execute workflow',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get workflow status
  app.get('/api/workflow/status', async (req: Request, res: Response) => {
    try {
      res.json({ 
        status: 'running',
        workflow: 'Start application'
      });
    } catch (error) {
      console.error('Error fetching workflow status:', error);
      res.status(500).json({ 
        error: 'Failed to fetch workflow status',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
}
