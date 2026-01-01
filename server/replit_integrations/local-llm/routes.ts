import express from "express";
import { getLocalLLMService, initializeLocalLLM, LocalLLMConfig } from "./index";
import { assistantFunctions, getFilteredFunctions } from "./functions";

const router = express.Router();

/**
 * Initialize local LLM service
 * POST /api/local-llm/initialize
 */
router.post("/initialize", async (req, res) => {
  try {
    const config: LocalLLMConfig = req.body;

    if (!config.enabled) {
      return res.status(400).json({
        success: false,
        error: "Local LLM is not enabled in configuration"
      });
    }

    const service = await initializeLocalLLM(config);
    const status = service.getStatus();

    res.json({
      success: true,
      message: "Local LLM service initialized successfully",
      status
    });
  } catch (error: any) {
    console.error("[LocalLLM API] Initialization error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Load a model
 * POST /api/local-llm/models/load
 */
router.post("/models/load", async (req, res) => {
  try {
    const { modelPath, gpuLayers, contextSize } = req.body;

    if (!modelPath) {
      return res.status(400).json({
        success: false,
        error: "modelPath is required"
      });
    }

    const service = getLocalLLMService();
    const modelId = await service.loadModel(modelPath, { gpuLayers, contextSize });

    res.json({
      success: true,
      modelId,
      message: "Model loaded successfully"
    });
  } catch (error: any) {
    console.error("[LocalLLM API] Model load error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Unload a model
 * POST /api/local-llm/models/unload
 */
router.post("/models/unload", async (req, res) => {
  try {
    const { modelId } = req.body;

    if (!modelId) {
      return res.status(400).json({
        success: false,
        error: "modelId is required"
      });
    }

    const service = getLocalLLMService();
    await service.unloadModel(modelId);

    res.json({
      success: true,
      message: "Model unloaded successfully"
    });
  } catch (error: any) {
    console.error("[LocalLLM API] Model unload error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Create a chat session
 * POST /api/local-llm/sessions/create
 */
router.post("/sessions/create", async (req, res) => {
  try {
    const { modelId, contextSize, systemPrompt } = req.body;

    if (!modelId) {
      return res.status(400).json({
        success: false,
        error: "modelId is required"
      });
    }

    const service = getLocalLLMService();
    const sessionId = await service.createSession(modelId, { contextSize, systemPrompt });

    res.json({
      success: true,
      sessionId,
      message: "Session created successfully"
    });
  } catch (error: any) {
    console.error("[LocalLLM API] Session creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Destroy a chat session
 * POST /api/local-llm/sessions/destroy
 */
router.post("/sessions/destroy", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "sessionId is required"
      });
    }

    const service = getLocalLLMService();
    await service.destroySession(sessionId);

    res.json({
      success: true,
      message: "Session destroyed successfully"
    });
  } catch (error: any) {
    console.error("[LocalLLM API] Session destruction error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate a response (non-streaming)
 * POST /api/local-llm/generate
 */
router.post("/generate", async (req, res) => {
  try {
    const { sessionId, prompt, options } = req.body;

    if (!sessionId || !prompt) {
      return res.status(400).json({
        success: false,
        error: "sessionId and prompt are required"
      });
    }

    const service = getLocalLLMService();

    // Add function calling if enabled
    const generationOptions = { ...options };
    if (options?.enableFunctionCalling) {
      generationOptions.functions = getFilteredFunctions(options.allowedFunctions);
    }

    const response = await service.generateResponse(sessionId, prompt, generationOptions);

    res.json({
      success: true,
      response,
      sessionId
    });
  } catch (error: any) {
    console.error("[LocalLLM API] Generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate a response (streaming)
 * POST /api/local-llm/generate/stream
 */
router.post("/generate/stream", async (req, res) => {
  try {
    const { sessionId, prompt, options } = req.body;

    if (!sessionId || !prompt) {
      return res.status(400).json({
        success: false,
        error: "sessionId and prompt are required"
      });
    }

    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const service = getLocalLLMService();

    // Add function calling if enabled
    const generationOptions = { ...options };
    if (options?.enableFunctionCalling) {
      generationOptions.functions = getFilteredFunctions(options.allowedFunctions);
    }

    // Stream response chunks
    await service.streamResponse(
      sessionId,
      prompt,
      (chunk: string) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
      generationOptions
    );

    // Send completion event
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("[LocalLLM API] Streaming error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

/**
 * Get service status
 * GET /api/local-llm/status
 */
router.get("/status", async (req, res) => {
  try {
    const service = getLocalLLMService();
    const status = service.getStatus();

    res.json({
      success: true,
      status
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * List available functions
 * GET /api/local-llm/functions
 */
router.get("/functions", async (req, res) => {
  try {
    const functionList = Object.keys(assistantFunctions).map(name => ({
      name,
      description: (assistantFunctions as any)[name].description
    }));

    res.json({
      success: true,
      functions: functionList,
      count: functionList.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
