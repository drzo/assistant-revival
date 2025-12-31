/**
 * OpenAI Provider Implementation
 * 
 * Wraps the OpenAI API client to conform to the AIProvider interface.
 */

import OpenAI from "openai";
import type {
  AIProvider,
  ChatCompletionOptions,
  ChatCompletionResult,
  ChatCompletionChunk,
} from "../types";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  readonly displayName = "OpenAI";

  private client: OpenAI | null = null;
  private apiKey: string;
  private baseURL: string;
  private model: string;
  private initialized = false;

  constructor(config: {
    apiKey?: string;
    baseURL?: string;
    model?: string;
  }) {
    this.apiKey = config.apiKey || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "";
    this.baseURL = config.baseURL || process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1";
    this.model = config.model || "gpt-4o-mini";
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
    });

    this.initialized = true;
    console.log(`✓ OpenAI provider initialized (model: ${this.model})`);
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    if (!this.client) {
      throw new Error("OpenAI provider not initialized");
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: options.messages,
      max_tokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1.0,
      stream: false,
    });

    const content = response.choices[0]?.message?.content || "";
    const finishReason = response.choices[0]?.finish_reason || "stop";

    return {
      content,
      finishReason,
    };
  }

  async chatCompletionStream(
    options: ChatCompletionOptions,
    onChunk: (chunk: ChatCompletionChunk) => void
  ): Promise<void> {
    if (!this.client) {
      throw new Error("OpenAI provider not initialized");
    }

    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: options.messages,
      max_tokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1.0,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onChunk({ content });
      }

      const finishReason = chunk.choices[0]?.finish_reason;
      if (finishReason) {
        onChunk({ content: "", done: true });
      }
    }
  }

  async dispose(): Promise<void> {
    this.client = null;
    this.initialized = false;
  }
}
