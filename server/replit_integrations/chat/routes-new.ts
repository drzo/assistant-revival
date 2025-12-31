import type { Express, Request, Response } from "express";
import type { AIProviderManager } from "../../ai";
import { chatStorage } from "./storage";

/**
 * Register chat routes with AI provider manager
 */
export function registerChatRoutesWithAI(app: Express, aiManager: AIProviderManager): void {
  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
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
      const id = req.params.id;
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Send message and get AI response (streaming) - NEW VERSION
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = req.params.id;
      const { content } = req.body;

      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let fullResponse = "";

      // Stream response from AI provider (with automatic fallback)
      await aiManager.chatCompletionStream(
        {
          messages: chatMessages,
          maxTokens: 2048,
          temperature: 0.7,
          stream: true,
        },
        (chunk) => {
          if (chunk.content) {
            fullResponse += chunk.content;
            res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
          }
          if (chunk.done) {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          }
        }
      );

      // Save assistant message
      await chatStorage.createMessage(conversationId, "assistant", fullResponse);

      res.end();
    } catch (error) {
      console.error("Error sending message:", error);
      // Check if headers already sent (SSE streaming started)
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });

  // Get AI provider status
  app.get("/api/ai/providers", async (req: Request, res: Response) => {
    try {
      const status = await aiManager.getProviderStatus();
      const primary = aiManager.getPrimaryProvider();
      
      res.json({
        primary: primary ? primary.name : null,
        providers: status,
      });
    } catch (error) {
      console.error("Error fetching provider status:", error);
      res.status(500).json({ error: "Failed to fetch provider status" });
    }
  });
}
