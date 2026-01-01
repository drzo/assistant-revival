
import type { Express, Request, Response } from "express";
import { assistantPromptStorage } from "./storage";
import { importBulkPrompts } from "./import-bulk";
import { importPromptsFromCSV } from "./import-csv";

export function registerAssistantPromptRoutes(app: Express): void {
  // Import prompts from markdown file
  app.post("/api/assistant-prompts/import", async (req: Request, res: Response) => {
    try {
      const { filePath } = req.body;
      if (!filePath) {
        return res.status(400).json({ error: "filePath is required" });
      }
      const result = await importBulkPrompts(filePath);
      res.json(result);
    } catch (error) {
      console.error("Error importing prompts:", error);
      res.status(500).json({ error: "Failed to import prompts" });
    }
  });

  // Import prompts from CSV file
  app.post("/api/assistant-prompts/import-csv", async (req: Request, res: Response) => {
    try {
      const { filePath } = req.body;
      if (!filePath) {
        return res.status(400).json({ error: "filePath is required" });
      }
      const result = await importPromptsFromCSV(filePath);
      res.json(result);
    } catch (error) {
      console.error("Error importing CSV prompts:", error);
      res.status(500).json({ error: "Failed to import CSV prompts" });
    }
  });
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
      const id = parseInt(req.params.id);
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
      if (typeof name !== 'string' || typeof instructions !== 'string') {
        return res.status(400).json({ error: "Name and instructions must be strings" });
      }
      const prompt = await assistantPromptStorage.createPrompt(name, instructions, isDefault);
      res.status(201).json(prompt);
    } catch (error) {
      console.error("Error creating prompt:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create prompt";
      res.status(500).json({ error: "Failed to create prompt", details: errorMessage });
    }
  });

  // Update prompt
  app.patch("/api/assistant-prompts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
      await assistantPromptStorage.deletePrompt(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      res.status(500).json({ error: "Failed to delete prompt" });
    }
  });
}
