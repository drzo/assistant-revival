import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";
import { assistantPromptStorage } from "../assistant-prompts/storage";
import { analyzeMessageContext, detectSuggestedPrompt } from "../assistant-prompts/mode-detector";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export function registerChatRoutes(app: Express): void {
  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Send message and get AI response (streaming)
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content, mentionedFiles, promptId } = req.body;

      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Analyze context and suggest optimal prompt
      const context = analyzeMessageContext(content, mentionedFiles?.length || 0);
      const availablePrompts = await assistantPromptStorage.getAllPrompts();
      const suggestedPrompt = detectSuggestedPrompt(context, availablePrompts);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);

      // Get active assistant prompt
      let systemPrompt = `You are a helpful coding assistant. You can:
1. Propose file edits using structured format
2. Suggest shell commands for package installation
3. Explain code and provide guidance

When proposing changes:
- For file edits, use this format: FILE_EDIT: filename.ext | +lines -lines
- For shell commands, use: SHELL_COMMAND: command here
- For package installation, use: INSTALL_PACKAGE: package-name

Always be specific and actionable.`;

      if (promptId) {
        const prompt = await assistantPromptStorage.getPrompt(promptId);
        if (prompt) {
          systemPrompt = prompt.instructions + "\n\n" + systemPrompt;
        }
      }

      // Build context from mentioned files
      let fileContext = "";
      if (mentionedFiles && mentionedFiles.length > 0) {
        fileContext = "\n\nReferenced files:\n";
        for (const file of mentionedFiles) {
          fileContext += `\nFile: ${file.name}\n\`\`\`${file.language || ""}\n${file.content}\n\`\`\`\n`;
        }
      }

      // Stream response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Write suggested prompt if any
      if (suggestedPrompt) {
        res.write(`data: ${JSON.stringify({ suggestedPrompt: { id: suggestedPrompt.id, name: suggestedPrompt.name } })}\n\n`);
      }

      const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content + fileContext },
        ],
        stream: true,
      });

      let buffer = "";
      const shellCommands: string[] = [];
      const fileEdits: any[] = [];
      const seenCommands = new Set<string>();
      const seenEdits = new Set<string>();

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          buffer += content;

          // Parse shell commands
          const shellMatches = buffer.matchAll(/SHELL_COMMAND:\s*(.+?)(?:\n|$)/g);
          for (const match of shellMatches) {
            const cmd = match[1].trim();
            if (!seenCommands.has(cmd)) {
              seenCommands.add(cmd);
              shellCommands.push(cmd);
              res.write(`data: ${JSON.stringify({ shellCommand: cmd })}\n\n`);
            }
          }

          // Parse package installations
          const installMatches = buffer.matchAll(/INSTALL_PACKAGE:\s*(.+?)(?:\n|$)/g);
          for (const match of installMatches) {
            const pkg = match[1].trim();
            const cmd = `npm install ${pkg}`;
            if (!seenCommands.has(cmd)) {
              seenCommands.add(cmd);
              shellCommands.push(cmd);
              res.write(`data: ${JSON.stringify({ shellCommand: cmd })}\n\n`);
            }
          }

          // Parse file edits
          const fileEditMatches = buffer.matchAll(/FILE_EDIT:\s*(.+?)\s*\|\s*\+(\d+)\s*-(\d+)/g);
          for (const match of fileEditMatches) {
            const editKey = `${match[1]}-${match[2]}-${match[3]}`;
            if (!seenEdits.has(editKey)) {
              seenEdits.add(editKey);
              const edit = {
                file: match[1].trim(),
                added: parseInt(match[2]),
                removed: parseInt(match[3])
              };
              fileEdits.push(edit);
              res.write(`data: ${JSON.stringify({ fileEdit: edit })}\n\n`);
            }
          }

          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Save assistant message with metadata
      const message = await chatStorage.createMessage(conversationId, "assistant", buffer);
      
      // Store metadata about actions
      if (shellCommands.length > 0 || fileEdits.length > 0) {
        // This would be extended to save to database in production
        res.write(`data: ${JSON.stringify({ 
          metadata: { shellCommands, fileEdits } 
        })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true, shellCommands, fileEdits })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in chat:", error);
      // Check if headers already sent (SSE streaming started)
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });
}