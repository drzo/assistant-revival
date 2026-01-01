import { getLlama, Llama, LlamaModel, LlamaChatSession, LlamaContext } from "node-llama-cpp";
import path from "path";
import fs from "fs-extra";

export interface LocalLLMConfig {
  enabled: boolean;
  modelPath: string;
  gpuLayers?: number;
  contextSize?: number;
  temperature?: number;
  enableFunctionCalling?: boolean;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stream?: boolean;
  functions?: Record<string, any>;
  jsonSchema?: any;
}

export class LocalLLMService {
  private llama: Llama | null = null;
  private modelCache: Map<string, LlamaModel> = new Map();
  private sessionCache: Map<string, LlamaChatSession> = new Map();
  private contextCache: Map<string, LlamaContext> = new Map();
  private config: LocalLLMConfig;
  private initialized: boolean = false;

  constructor(config: LocalLLMConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      console.log("[LocalLLM] Initializing node-llama-cpp...");
      this.llama = await getLlama();
      this.initialized = true;
      console.log("[LocalLLM] Initialization complete");
    } catch (error) {
      console.error("[LocalLLM] Failed to initialize:", error);
      throw new Error(`Failed to initialize local LLM: ${error}`);
    }
  }

  async loadModel(modelPath: string, options?: {
    gpuLayers?: number;
    contextSize?: number;
  }): Promise<string> {
    if (!this.initialized || !this.llama) {
      throw new Error("LocalLLMService not initialized");
    }

    // Check if model already loaded
    const modelId = path.basename(modelPath);
    if (this.modelCache.has(modelId)) {
      console.log(`[LocalLLM] Model ${modelId} already loaded`);
      return modelId;
    }

    // Verify model file exists
    if (!await fs.pathExists(modelPath)) {
      throw new Error(`Model file not found: ${modelPath}`);
    }

    try {
      console.log(`[LocalLLM] Loading model from ${modelPath}...`);
      const model = await this.llama.loadModel({
        modelPath,
        gpuLayers: options?.gpuLayers ?? this.config.gpuLayers,
      });

      this.modelCache.set(modelId, model);
      console.log(`[LocalLLM] Model ${modelId} loaded successfully`);
      return modelId;
    } catch (error) {
      console.error(`[LocalLLM] Failed to load model:`, error);
      throw new Error(`Failed to load model: ${error}`);
    }
  }

  async createSession(modelId: string, options?: {
    contextSize?: number;
    systemPrompt?: string;
  }): Promise<string> {
    const model = this.modelCache.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not loaded`);
    }

    try {
      const context = await model.createContext({
        contextSize: options?.contextSize ?? this.config.contextSize ?? 4096,
      });

      const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
        systemPrompt: options?.systemPrompt,
      });

      const sessionId = `${modelId}-${Date.now()}`;
      this.sessionCache.set(sessionId, session);
      this.contextCache.set(sessionId, context);

      console.log(`[LocalLLM] Created session ${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error(`[LocalLLM] Failed to create session:`, error);
      throw new Error(`Failed to create session: ${error}`);
    }
  }

  async generateResponse(
    sessionId: string,
    prompt: string,
    options?: GenerationOptions
  ): Promise<string> {
    const session = this.sessionCache.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    try {
      const response = await session.prompt(prompt, {
        temperature: options?.temperature ?? this.config.temperature ?? 0.7,
        maxTokens: options?.maxTokens,
        topP: options?.topP,
        topK: options?.topK,
        functions: options?.functions,
        grammar: options?.jsonSchema ? this.createJsonGrammar(options.jsonSchema) : undefined,
      });

      return response;
    } catch (error) {
      console.error(`[LocalLLM] Failed to generate response:`, error);
      throw new Error(`Failed to generate response: ${error}`);
    }
  }

  async streamResponse(
    sessionId: string,
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: GenerationOptions
  ): Promise<void> {
    const session = this.sessionCache.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    try {
      await session.prompt(prompt, {
        temperature: options?.temperature ?? this.config.temperature ?? 0.7,
        maxTokens: options?.maxTokens,
        topP: options?.topP,
        topK: options?.topK,
        functions: options?.functions,
        grammar: options?.jsonSchema ? this.createJsonGrammar(options.jsonSchema) : undefined,
        onTextChunk: onChunk,
      });
    } catch (error) {
      console.error(`[LocalLLM] Failed to stream response:`, error);
      throw new Error(`Failed to stream response: ${error}`);
    }
  }

  async destroySession(sessionId: string): Promise<void> {
    const context = this.contextCache.get(sessionId);
    if (context) {
      await context.dispose();
      this.contextCache.delete(sessionId);
    }

    this.sessionCache.delete(sessionId);
    console.log(`[LocalLLM] Destroyed session ${sessionId}`);
  }

  async unloadModel(modelId: string): Promise<void> {
    const model = this.modelCache.get(modelId);
    if (model) {
      await model.dispose();
      this.modelCache.delete(modelId);
      console.log(`[LocalLLM] Unloaded model ${modelId}`);
    }

    // Clean up associated sessions
    for (const [sessionId, _] of this.sessionCache) {
      if (sessionId.startsWith(modelId)) {
        await this.destroySession(sessionId);
      }
    }
  }

  async dispose(): Promise<void> {
    console.log("[LocalLLM] Disposing service...");

    // Destroy all sessions
    for (const sessionId of Array.from(this.sessionCache.keys())) {
      await this.destroySession(sessionId);
    }

    // Unload all models
    for (const modelId of Array.from(this.modelCache.keys())) {
      await this.unloadModel(modelId);
    }

    this.initialized = false;
    console.log("[LocalLLM] Service disposed");
  }

  getStatus(): {
    initialized: boolean;
    modelsLoaded: number;
    activeSessions: number;
  } {
    return {
      initialized: this.initialized,
      modelsLoaded: this.modelCache.size,
      activeSessions: this.sessionCache.size,
    };
  }

  private createJsonGrammar(schema: any): any {
    // This would use node-llama-cpp's JSON grammar generation
    // For now, return undefined - full implementation would use LlamaJsonSchemaGrammar
    return undefined;
  }
}

// Singleton instance
let localLLMService: LocalLLMService | null = null;

export function getLocalLLMService(config?: LocalLLMConfig): LocalLLMService {
  if (!localLLMService && config) {
    localLLMService = new LocalLLMService(config);
  }

  if (!localLLMService) {
    throw new Error("LocalLLMService not initialized");
  }

  return localLLMService;
}

export async function initializeLocalLLM(config: LocalLLMConfig): Promise<LocalLLMService> {
  if (!config.enabled) {
    throw new Error("Local LLM is not enabled");
  }

  const service = getLocalLLMService(config);
  await service.initialize();
  return service;
}
