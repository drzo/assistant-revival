
import type { Express, Request, Response } from "express";
import * as fs from 'fs/promises';
import * as path from 'path';

export function registerFileOperationsRoutes(app: Express): void {
  // Read file content
  app.post("/api/file/read", async (req: Request, res: Response) => {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
      }

      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf-8');

      res.json({ filePath, content });
    } catch (error) {
      console.error("Error reading file:", error);
      res.status(500).json({ 
        error: "Failed to read file",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Write file content
  app.post("/api/file/write", async (req: Request, res: Response) => {
    try {
      const { filePath, content } = req.body;

      if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
      }

      const fullPath = path.join(process.cwd(), filePath);
      const dir = path.dirname(fullPath);
      
      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, content, 'utf-8');

      res.json({ filePath, success: true });
    } catch (error) {
      console.error("Error writing file:", error);
      res.status(500).json({ 
        error: "Failed to write file",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // List directory contents
  app.post("/api/file/list", async (req: Request, res: Response) => {
    try {
      const { dirPath = '.' } = req.body;
      const fullPath = path.join(process.cwd(), dirPath);

      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const files = entries.map(entry => ({
        name: entry.name,
        path: path.join(dirPath, entry.name),
        isDirectory: entry.isDirectory(),
        isFile: entry.isFile()
      }));

      res.json({ dirPath, files });
    } catch (error) {
      console.error("Error listing directory:", error);
      res.status(500).json({ 
        error: "Failed to list directory",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Delete file or directory
  app.post("/api/file/delete", async (req: Request, res: Response) => {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
      }

      const fullPath = path.join(process.cwd(), filePath);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        await fs.rm(fullPath, { recursive: true, force: true });
      } else {
        await fs.unlink(fullPath);
      }

      res.json({ filePath, success: true });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ 
        error: "Failed to delete file",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
}
