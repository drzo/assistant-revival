
import type { Express, Request, Response } from "express";
import { assistantPromptStorage } from "./storage";

export function registerAssistantPromptRoutes(app: Express): void {
  // Get all prompts
  app.get("/api/assistant-prompts", async (req: Request, res: Response) => {
    try {
      const prompts = await assistantPromptStorage.getAllPrompts();
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching assistant prompts:", error);
      res.status(500).json({ error: "Failed to fetch assistant prompts" });
    }
  });

  // Get default prompt
  app.get("/api/assistant-prompts/default", async (req: Request, res: Response) => {
    try {
      const prompt = await assistantPromptStorage.getDefaultPrompt();
      res.json(prompt || null);
    } catch (error) {
      console.error("Error fetching default prompt:", error);
      res.status(500).json({ error: "Failed to fetch default prompt" });
    }
  });

  // Get single prompt
  app.get("/api/assistant-prompts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const prompt = await assistantPromptStorage.getPrompt(id);
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      res.status(500).json({ error: "Failed to fetch prompt" });
    }
  });

  // Create new prompt
  app.post("/api/assistant-prompts", async (req: Request, res: Response) => {
    try {
      const { name, instructions, isDefault } = req.body;
      if (!name || !instructions) {
        return res.status(400).json({ error: "Name and instructions are required" });
      }
      const prompt = await assistantPromptStorage.createPrompt(name, instructions, isDefault);
      res.status(201).json(prompt);
    } catch (error) {
      console.error("Error creating prompt:", error);
      res.status(500).json({ error: "Failed to create prompt" });
    }
  });

  // Update prompt
  app.patch("/api/assistant-prompts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { name, instructions, isDefault } = req.body;
      const prompt = await assistantPromptStorage.updatePrompt(id, name, instructions, isDefault);
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      console.error("Error updating prompt:", error);
      res.status(500).json({ error: "Failed to update prompt" });
    }
  });

  // Set default prompt
  app.post("/api/assistant-prompts/:id/set-default", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await assistantPromptStorage.setDefaultPrompt(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error setting default prompt:", error);
      res.status(500).json({ error: "Failed to set default prompt" });
    }
  });

  // Delete prompt
  app.delete("/api/assistant-prompts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await assistantPromptStorage.deletePrompt(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      res.status(500).json({ error: "Failed to delete prompt" });
    }
  });
}
