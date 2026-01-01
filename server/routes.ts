import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerScreenshotRoutes } from "./replit_integrations/screenshot";
import { registerScrapingRoutes } from "./replit_integrations/scraping";
import { registerShellRoutes } from "./replit_integrations/shell";
import { registerFileOperationsRoutes } from "./replit_integrations/file-operations";
import { registerDeploymentRoutes } from "./replit_integrations/deployment";
import { registerWorkflowRoutes } from "./replit_integrations/workflow";
import { getAgent } from "./replit_integrations/mastra/config";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are Assistant, a helpful AI that assists developers with their code. You specialize in:
- Explaining code concepts clearly
- Suggesting code improvements and fixes
- Writing new code based on requirements
- Reviewing code and pointing out potential issues

When suggesting code changes, format them clearly using markdown code blocks with the appropriate language tag.

If the user mentions files (@filename), you have access to their contents and should reference them in your response.

Keep responses concise but thorough. Be friendly and supportive.`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Chat endpoint with streaming
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, files, agentName } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build context from files
      let contextMessage = message;
      if (files && files.length > 0) {
        const fileContexts = files.map((file: { name: string; content: string; language: string }) =>
          `File: ${file.name}\n\`\`\`${file.language}\n${file.content}\n\`\`\``
        ).join("\n\n");
        contextMessage = `${fileContexts}\n\nUser request: ${message}`;
      }

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Check if using a Mastra agent (non-assistant agents)
      if (agentName && agentName !== 'assistantAgent') {
        try {
          console.log(`Using Mastra agent: ${agentName}`);
          const agent = getAgent(agentName);
          const result = await agent.generate(contextMessage);
          
          const fullResponse = result?.text || '';
          console.log(`Mastra agent response length: ${fullResponse.length}`);
          
          if (fullResponse) {
            res.write(`data: ${JSON.stringify({ content: fullResponse })}\n\n`);
            
            const codeChanges = parseCodeChanges(fullResponse, files);
            if (codeChanges.length > 0) {
              res.write(`data: ${JSON.stringify({ codeChanges })}\n\n`);
            }
            
            res.write(`data: ${JSON.stringify({ done: true, agentName })}\n\n`);
            res.end();
            return;
          }
          console.log("Mastra agent returned empty response, falling back to OpenAI");
        } catch (agentError) {
          console.error("Mastra agent error, falling back to OpenAI:", agentError);
        }
      }

      let systemPrompt = SYSTEM_PROMPT;
      if (req.body.systemPrompt) {
        systemPrompt = req.body.systemPrompt;
      }

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contextMessage },
        ],
        stream: true,
        max_completion_tokens: 4096,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Check if the response contains code changes
      const codeChanges = parseCodeChanges(fullResponse, files);
      if (codeChanges.length > 0) {
        res.write(`data: ${JSON.stringify({ codeChanges })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "An error occurred" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process chat message" });
      }
    }
  });

  // Sessions endpoints
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const { name } = req.body;
      const session = await storage.createSession({ name: name || "New Chat" });
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      await storage.deleteSession(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  app.get("/api/sessions/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessagesBySession(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Files endpoints
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getAllFiles();
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const { name, content, language, size } = req.body;
      const file = await storage.createFile({ name, content, language, size });
      res.status(201).json(file);
    } catch (error) {
      console.error("Error creating file:", error);
      res.status(500).json({ error: "Failed to create file" });
    }
  });

  app.patch("/api/files/:id", async (req, res) => {
    try {
      const { content } = req.body;
      const file = await storage.updateFile(req.params.id, content);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      console.error("Error updating file:", error);
      res.status(500).json({ error: "Failed to update file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      await storage.deleteFile(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // Checkpoints endpoints
  app.get("/api/sessions/:id/checkpoints", async (req, res) => {
    try {
      const checkpoints = await storage.getCheckpointsBySession(req.params.id);
      res.json(checkpoints);
    } catch (error) {
      console.error("Error fetching checkpoints:", error);
      res.status(500).json({ error: "Failed to fetch checkpoints" });
    }
  });

  app.post("/api/checkpoints", async (req, res) => {
    try {
      const { sessionId, messageId, description, files } = req.body;
      const checkpoint = await storage.createCheckpoint({
        sessionId,
        messageId,
        description,
        files,
      });
      res.status(201).json(checkpoint);
    } catch (error) {
      console.error("Error creating checkpoint:", error);
      res.status(500).json({ error: "Failed to create checkpoint" });
    }
  });

  // Replit integrations routes
  // In a real application, you might want to use express.Router() for better organization
  // and then mount the router here. For simplicity, we're registering routes directly.
  registerImageRoutes(app);
  registerScreenshotRoutes(app);
  registerScrapingRoutes(app);
  registerFileOperationsRoutes(app);
  registerDeploymentRoutes(app);
  registerWorkflowRoutes(app);
  registerShellRoutes(app);

  return httpServer;
}

// Helper function to parse code changes from AI response
function parseCodeChanges(response: string, files: Array<{ id: string; name: string; content: string; language: string }> | undefined) {
  if (!files || files.length === 0) return [];

  const changes: Array<{
    fileId: string;
    fileName: string;
    oldContent: string;
    newContent: string;
  }> = [];

  // Look for code blocks that might be file modifications
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(response)) !== null) {
    const language = match[1];
    const code = match[2].trim();

    // Try to match code blocks to existing files by language or content similarity
    for (const file of files) {
      if (file.language === language ||
          response.toLowerCase().includes(file.name.toLowerCase())) {
        // Check if this looks like a full file replacement or significant edit
        if (code.length > 50 && code !== file.content) {
          changes.push({
            fileId: file.id,
            fileName: file.name,
            oldContent: file.content,
            newContent: code,
          });
          break;
        }
      }
    }
  }

  return changes;
}