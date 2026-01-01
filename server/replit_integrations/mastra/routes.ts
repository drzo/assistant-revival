import type { Express, Request, Response } from "express";
import { getAgent } from './config';
import { mastraTools } from './tools';

export function registerMastraRoutes(app: Express) {
  app.post("/api/mastra/chat", async (req: Request, res: Response) => {
    try {
      const { message, agentName = 'assistantAgent', tools = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const agent = getAgent(agentName);
      
      const result = await agent.generate(message);

      res.json({
        response: result.text,
        agentName,
      });
    } catch (error) {
      console.error("Mastra chat error:", error);
      res.status(500).json({ 
        error: "Failed to process request with Mastra agent",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/mastra/agents", (_req: Request, res: Response) => {
    res.json({
      agents: [
        { name: 'assistantAgent', description: 'General purpose coding assistant' },
        { name: 'codeReviewerAgent', description: 'Code quality and best practices reviewer' },
        { name: 'debuggerAgent', description: 'Debugging and problem-solving specialist' },
      ],
    });
  });

  app.get("/api/mastra/tools", (_req: Request, res: Response) => {
    res.json({
      tools: Object.keys(mastraTools).map(name => ({
        name,
        description: mastraTools[name as keyof typeof mastraTools].description,
      })),
    });
  });
}
