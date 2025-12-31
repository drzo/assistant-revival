/**
 * node-llama-cpp Provider Implementation
 * 
 * Provides local LLM capabilities using node-llama-cpp.
 */

import { getLlama, LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import type {
  AIProvider,
  ChatCompletionOptions,
  ChatCompletionResult,
  ChatCompletionChunk,
  ChatMessage,
} from "../types";
import path from "path";
import fs from "fs";

export class LlamaCppProvider implements AIProvider {
  readonly name = "llama-cpp";
  readonly displayName = "Local LLM (llama.cpp)";

  private llama: any = null;
  private model: LlamaModel | null = null;
  private context: LlamaContext | null = null;
  private modelPath: string;
  private contextSize: number;
  private gpuLayers: number;
  private initialized = false;

  constructor(config: {
    modelPath?: string;
    contextSize?: number;
    gpuLayers?: number;
  }) {
    this.modelPath = config.modelPath || this.getDefaultModelPath();
    this.contextSize = config.contextSize || 4096;
    this.gpuLayers = config.gpuLayers || 33; // Auto-detect GPU layers
  }

  private getDefaultModelPath(): string {
    // Check common model locations
    const possiblePaths = [
      path.join(process.cwd(), "models", "model.gguf"),
      path.join(process.cwd(), "models", "llama-2-7b-chat.Q4_K_M.gguf"),
      path.join(process.env.HOME || "", ".cache", "llama-models", "model.gguf"),
      "/models/model.gguf",
    ];

    for (const modelPath of possiblePaths) {
      if (fs.existsSync(modelPath)) {
        return modelPath;
      }
    }

    // Return first path as default (will be created/downloaded if needed)
    return possiblePaths[0];
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Check if model file exists
      if (!fs.existsSync(this.modelPath)) {
        console.log(`⚠️  Model not found at ${this.modelPath}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking llama-cpp availability:", error);
      return false;
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    console.log(`🦙 Initializing llama.cpp provider...`);
    console.log(`   Model path: ${this.modelPath}`);

    if (!fs.existsSync(this.modelPath)) {
      throw new Error(
        `Model file not found at ${this.modelPath}. ` +
        `Please download a GGUF model and place it at this location, or set LLAMA_MODEL_PATH environment variable.`
      );
    }

    try {
      // Initialize llama
      this.llama = await getLlama();
      console.log("   ✓ Llama initialized");

      // Load model
      this.model = await this.llama.loadModel({
        modelPath: this.modelPath,
        gpuLayers: this.gpuLayers,
      });
      console.log("   ✓ Model loaded");

      // Create context
      if (!this.model) {
        throw new Error("Model failed to load");
      }
      this.context = await this.model.createContext({
        contextSize: this.contextSize,
      });
      console.log("   ✓ Context created");

      this.initialized = true;
      console.log(`✓ llama.cpp provider initialized`);
    } catch (error) {
      console.error("Failed to initialize llama.cpp provider:", error);
      throw error;
    }
  }

  private convertMessages(messages: ChatMessage[]): Array<{ role: string; content: string }> {
    return messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      content: msg.content,
    }));
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    if (!this.context || !this.model) {
      throw new Error("llama.cpp provider not initialized");
    }

    const session = new LlamaChatSession({
      contextSequence: this.context.getSequence(),
    });

    // Build conversation history
    const messages = this.convertMessages(options.messages);
    let response = "";

    // Process all messages except the last one as history
    for (let i = 0; i < messages.length - 1; i += 2) {
      if (i + 1 < messages.length) {
        const userMsg = messages[i];
        const assistantMsg = messages[i + 1];
        
        if (userMsg.role === "user" && assistantMsg.role === "model") {
          // Add to session history without generating
          await session.prompt(userMsg.content, {
            maxTokens: 0, // Don't generate, just add to history
          });
        }
      }
    }

    // Generate response for the last message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      response = await session.prompt(lastMessage.content, {
        maxTokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        topP: options.topP || 0.95,
      });
    }

    return {
      content: response,
      finishReason: "stop",
    };
  }

  async chatCompletionStream(
    options: ChatCompletionOptions,
    onChunk: (chunk: ChatCompletionChunk) => void
  ): Promise<void> {
    if (!this.context || !this.model) {
      throw new Error("llama.cpp provider not initialized");
    }

    const session = new LlamaChatSession({
      contextSequence: this.context.getSequence(),
    });

    // Build conversation history
    const messages = this.convertMessages(options.messages);

    // Process all messages except the last one as history
    for (let i = 0; i < messages.length - 1; i += 2) {
      if (i + 1 < messages.length) {
        const userMsg = messages[i];
        const assistantMsg = messages[i + 1];
        
        if (userMsg.role === "user" && assistantMsg.role === "model") {
          // Add to session history without generating
          await session.prompt(userMsg.content, {
            maxTokens: 0, // Don't generate, just add to history
          });
        }
      }
    }

    // Generate streaming response for the last message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      await session.prompt(lastMessage.content, {
        maxTokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        topP: options.topP || 0.95,
        onTextChunk: (text: string) => {
          onChunk({ content: text });
        },
      });
    }

    // Signal completion
    onChunk({ content: "", done: true });
  }

  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
    }
    if (this.model) {
      await this.model.dispose();
      this.model = null;
    }
    this.llama = null;
    this.initialized = false;
  }
}
