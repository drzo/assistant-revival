/**
 * AI Provider Types and Interfaces
 * 
 * Defines the common interface for AI providers (OpenAI, node-llama-cpp, etc.)
 * and related types for the AI provider system.
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface ChatCompletionChunk {
  content: string;
  done?: boolean;
}

export interface ChatCompletionResult {
  content: string;
  finishReason?: string;
}

/**
 * Abstract AI Provider Interface
 * 
 * All AI providers must implement this interface to be compatible
 * with the provider system.
 */
export interface AIProvider {
  /**
   * Unique identifier for the provider
   */
  readonly name: string;

  /**
   * Human-readable display name
   */
  readonly displayName: string;

  /**
   * Whether the provider is currently available
   */
  isAvailable(): Promise<boolean>;

  /**
   * Initialize the provider (load models, connect to API, etc.)
   */
  initialize(): Promise<void>;

  /**
   * Generate a chat completion
   */
  chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult>;

  /**
   * Generate a streaming chat completion
   */
  chatCompletionStream(
    options: ChatCompletionOptions,
    onChunk: (chunk: ChatCompletionChunk) => void
  ): Promise<void>;

  /**
   * Clean up resources
   */
  dispose(): Promise<void>;
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  /**
   * Provider type
   */
  type: "openai" | "llama-cpp" | "auto";

  /**
   * OpenAI configuration
   */
  openai?: {
    apiKey?: string;
    baseURL?: string;
    model?: string;
  };

  /**
   * node-llama-cpp configuration
   */
  llamaCpp?: {
    modelPath?: string;
    contextSize?: number;
    gpuLayers?: number;
  };

  /**
   * Fallback configuration
   */
  fallback?: {
    enabled: boolean;
    providers: Array<"openai" | "llama-cpp">;
  };
}

/**
 * Provider status information
 */
export interface ProviderStatus {
  name: string;
  displayName: string;
  available: boolean;
  initialized: boolean;
  error?: string;
}
