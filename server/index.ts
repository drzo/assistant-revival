import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerBatchRoutes } from "./replit_integrations/batch";
import { registerAssistantPromptRoutes } from "./replit_integrations/assistant-prompts";
import { registerOrgPersonaRoutes } from "./replit_integrations/org-persona";
import { seedOrgPersona } from "./replit_integrations/org-persona/seed";
import { initializeDatabase } from "./db"; // Import database initialization
import { seedDefaultPrompts } from "./replit_integrations/assistant-prompts/seed"; // Import seed function
import { importPromptsFromFile } from "./replit_integrations/assistant-prompts/import-from-file";
import { registerScrapingRoutes } from "./replit_integrations/scraping";
import screenshotRoutes from "./replit_integrations/screenshot/routes";
import creditRoutes from "./replit_integrations/credits/routes";
import { registerMastraRoutes } from "./replit_integrations/mastra";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database and seed default data
  await initializeDatabase(); // Call database initialization
  await seedDefaultPrompts(); // Call seed function
  await importPromptsFromFile(); // Import prompts from file

  // Seed organizational persona
  await seedOrgPersona();

  await registerRoutes(httpServer, app);
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerBatchRoutes(app);
  registerAssistantPromptRoutes(app);
  registerOrgPersonaRoutes(app);
  registerScrapingRoutes(app);
  app.use("/api/screenshot", screenshotRoutes);
  app.use("/api/credits", creditRoutes);

  const checkpointRoutes = (await import("./replit_integrations/checkpoints/routes")).default;
  app.use("/api", checkpointRoutes);

  // Seed default assistant prompt (this is now redundant due to the seedDefaultPrompts call above)
  // const { seedDefaultPrompt } = await import("./replit_integrations/assistant-prompts/seed");
  // await seedDefaultPrompt();

  registerMastraRoutes(app);

  // start server
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();