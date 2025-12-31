/**
 * AI Provider Manager
 * 
 * Manages multiple AI providers with automatic fallback support.
 */

import type {
  AIProvider,
  ProviderConfig,
  ProviderStatus,
  ChatCompletionOptions,
  ChatCompletionResult,
  ChatCompletionChunk,
} from "./types";
import { OpenAIProvider } from "./providers/openai-provider";
import { LlamaCppProvider } from "./providers/llama-cpp-provider";

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private config: ProviderConfig;
  private primaryProvider: AIProvider | null = null;
  private fallbackProviders: AIProvider[] = [];

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Initialize all configured providers
   */
  async initialize(): Promise<void> {
    console.log("🤖 Initializing AI Provider Manager...");

    // Create providers based on configuration
    if (this.config.type === "openai" || this.config.type === "auto") {
      const openaiProvider = new OpenAIProvider(this.config.openai || {});
      this.providers.set("openai", openaiProvider);
    }

    if (this.config.type === "llama-cpp" || this.config.type === "auto") {
      const llamaProvider = new LlamaCppProvider(this.config.llamaCpp || {});
      this.providers.set("llama-cpp", llamaProvider);
    }

    // Initialize providers and determine availability
    const providerEntries = Array.from(this.providers.entries());
    const initPromises = providerEntries.map(async ([name, provider]) => {
      try {
        const available = await provider.isAvailable();
        if (available) {
          await provider.initialize();
          console.log(`✓ ${provider.displayName} provider ready`);
          return { name, provider, available: true };
        } else {
          console.log(`⚠️  ${provider.displayName} provider not available`);
          return { name, provider, available: false };
        }
      } catch (error) {
        console.error(`❌ Failed to initialize ${provider.displayName}:`, error);
        return { name, provider, available: false };
      }
    });

    const results = await Promise.all(initPromises);

    // Set up primary and fallback providers
    if (this.config.type === "auto") {
      // Auto mode: prefer OpenAI, fallback to llama-cpp
      const openaiResult = results.find((r) => r.name === "openai");
      const llamaResult = results.find((r) => r.name === "llama-cpp");

      if (openaiResult?.available) {
        this.primaryProvider = openaiResult.provider;
        if (llamaResult?.available) {
          this.fallbackProviders.push(llamaResult.provider);
        }
      } else if (llamaResult?.available) {
        this.primaryProvider = llamaResult.provider;
      }
    } else {
      // Specific provider mode
      const result = results.find((r) => r.name === this.config.type);
      if (result?.available) {
        this.primaryProvider = result.provider;
      }

      // Set up fallbacks if enabled
      if (this.config.fallback?.enabled && this.config.fallback.providers) {
        for (const fallbackName of this.config.fallback.providers) {
          const fallbackResult = results.find((r) => r.name === fallbackName);
          if (fallbackResult?.available && fallbackResult.provider !== this.primaryProvider) {
            this.fallbackProviders.push(fallbackResult.provider);
          }
        }
      }
    }

    if (!this.primaryProvider) {
      throw new Error("No AI providers available. Please configure at least one provider.");
    }

    console.log(`✓ Primary provider: ${this.primaryProvider.displayName}`);
    if (this.fallbackProviders.length > 0) {
      console.log(
        `✓ Fallback providers: ${this.fallbackProviders.map((p) => p.displayName).join(", ")}`
      );
    }
  }

  /**
   * Get the current primary provider
   */
  getPrimaryProvider(): AIProvider | null {
    return this.primaryProvider;
  }

  /**
   * Get status of all providers
   */
  async getProviderStatus(): Promise<ProviderStatus[]> {
    const statuses: ProviderStatus[] = [];

    const providerEntries2 = Array.from(this.providers.entries());
    for (const [name, provider] of providerEntries2) {
      try {
        const available = await provider.isAvailable();
        statuses.push({
          name: provider.name,
          displayName: provider.displayName,
          available,
          initialized: available,
        });
      } catch (error) {
        statuses.push({
          name: provider.name,
          displayName: provider.displayName,
          available: false,
          initialized: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return statuses;
  }

  /**
   * Generate chat completion with automatic fallback
   */
  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    if (!this.primaryProvider) {
      throw new Error("No AI provider available");
    }

    // Try primary provider
    try {
      return await this.primaryProvider.chatCompletion(options);
    } catch (error) {
      console.error(`Primary provider (${this.primaryProvider.displayName}) failed:`, error);

      // Try fallback providers
      for (const fallbackProvider of this.fallbackProviders) {
        try {
          console.log(`Trying fallback provider: ${fallbackProvider.displayName}`);
          return await fallbackProvider.chatCompletion(options);
        } catch (fallbackError) {
          console.error(`Fallback provider (${fallbackProvider.displayName}) failed:`, fallbackError);
        }
      }

      // All providers failed
      throw new Error("All AI providers failed to generate a response");
    }
  }

  /**
   * Generate streaming chat completion with automatic fallback
   */
  async chatCompletionStream(
    options: ChatCompletionOptions,
    onChunk: (chunk: ChatCompletionChunk) => void
  ): Promise<void> {
    if (!this.primaryProvider) {
      throw new Error("No AI provider available");
    }

    // Try primary provider
    try {
      await this.primaryProvider.chatCompletionStream(options, onChunk);
      return;
    } catch (error) {
      console.error(`Primary provider (${this.primaryProvider.displayName}) failed:`, error);

      // Try fallback providers
      for (const fallbackProvider of this.fallbackProviders) {
        try {
          console.log(`Trying fallback provider: ${fallbackProvider.displayName}`);
          await fallbackProvider.chatCompletionStream(options, onChunk);
          return;
        } catch (fallbackError) {
          console.error(`Fallback provider (${fallbackProvider.displayName}) failed:`, fallbackError);
        }
      }

      // All providers failed
      throw new Error("All AI providers failed to generate a response");
    }
  }

  /**
   * Clean up all providers
   */
  async dispose(): Promise<void> {
    const disposePromises = Array.from(this.providers.values()).map((provider) =>
      provider.dispose().catch((error) => {
        console.error(`Error disposing provider ${provider.displayName}:`, error);
      })
    );

    await Promise.all(disposePromises);
    this.providers.clear();
    this.primaryProvider = null;
    this.fallbackProviders = [];
  }
}

/**
 * Create and initialize the global AI provider manager
 */
export async function createProviderManager(config?: Partial<ProviderConfig>): Promise<AIProviderManager> {
  const defaultConfig: ProviderConfig = {
    type: "auto",
    openai: {
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    },
    llamaCpp: {
      modelPath: process.env.LLAMA_MODEL_PATH,
      contextSize: parseInt(process.env.LLAMA_CONTEXT_SIZE || "4096", 10),
      gpuLayers: parseInt(process.env.LLAMA_GPU_LAYERS || "33", 10),
    },
    fallback: {
      enabled: true,
      providers: ["llama-cpp"],
    },
  };

  const finalConfig: ProviderConfig = {
    ...defaultConfig,
    ...config,
  };

  const manager = new AIProviderManager(finalConfig);
  await manager.initialize();
  return manager;
}
