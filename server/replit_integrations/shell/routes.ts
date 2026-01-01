
import { Router } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export function registerShellRoutes(router: Router) {
  router.post("/api/shell/execute", async (req, res) => {
    try {
      const { command, workingDirectory } = req.body;

      if (!command) {
        return res.status(400).json({ error: "Command is required" });
      }

      console.log(`[Shell] Executing command: ${command}`);
      console.log(`[Shell] Working directory: ${workingDirectory || process.cwd()}`);

      const { stdout, stderr } = await execAsync(command, {
        cwd: workingDirectory || process.cwd(),
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });

      res.json({
        success: true,
        command,
        output: stdout || stderr,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error executing shell command:", error);
      res.status(500).json({ 
        error: "Failed to execute shell command",
        details: error instanceof Error ? error.message : String(error),
        output: error.stdout || error.stderr || ""
      });
    }
  });
}
