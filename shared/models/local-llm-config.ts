/**
 * Configuration for local LLM integration
 */
export interface LocalLLMConfig {
  /** Whether local LLM is enabled */
  enabled: boolean;

  /** Path to the default model file */
  defaultModel: string;

  /** Directory containing model files */
  modelPath: string;

  /** Number of layers to offload to GPU (0 = CPU only, -1 = auto) */
  gpuLayers?: number;

  /** Context window size in tokens */
  contextSize?: number;

  /** Default temperature for generation (0.0 - 1.0) */
  temperature?: number;

  /** Enable function calling capabilities */
  enableFunctionCalling?: boolean;

  /** Maximum number of concurrent sessions */
  maxSessions?: number;

  /** Auto-unload models after inactivity (minutes) */
  autoUnloadAfter?: number;
}

/**
 * Model information
 */
export interface ModelInfo {
  /** Unique model identifier */
  id: string;

  /** Display name */
  name: string;

  /** Path to model file */
  path: string;

  /** Model size in bytes */
  size: number;

  /** Model architecture (e.g., "llama", "mistral") */
  architecture?: string;

  /** Parameter count (e.g., "7B", "13B") */
  parameters?: string;

  /** Quantization level (e.g., "Q4_K_M", "Q8_0") */
  quantization?: string;

  /** Whether model is currently loaded */
  loaded: boolean;

  /** Estimated RAM/VRAM requirements in GB */
  estimatedMemory?: number;
}

/**
 * Session information
 */
export interface SessionInfo {
  /** Unique session identifier */
  id: string;

  /** Associated model ID */
  modelId: string;

  /** Session creation timestamp */
  createdAt: Date;

  /** Last activity timestamp */
  lastActivity: Date;

  /** Number of messages in session */
  messageCount: number;

  /** Current context usage (tokens) */
  contextUsage: number;

  /** Maximum context size (tokens) */
  contextSize: number;

  /** System prompt (if any) */
  systemPrompt?: string;
}

/**
 * Generation options
 */
export interface GenerationOptions {
  /** Temperature for sampling (0.0 - 1.0) */
  temperature?: number;

  /** Maximum tokens to generate */
  maxTokens?: number;

  /** Top-p sampling parameter */
  topP?: number;

  /** Top-k sampling parameter */
  topK?: number;

  /** Enable streaming response */
  stream?: boolean;

  /** Enable function calling */
  enableFunctionCalling?: boolean;

  /** Allowed functions (if function calling enabled) */
  allowedFunctions?: string[];

  /** JSON schema for structured output */
  jsonSchema?: any;

  /** Stop sequences */
  stopSequences?: string[];
}

/**
 * Generation result
 */
export interface GenerationResult {
  /** Generated text */
  text: string;

  /** Number of tokens generated */
  tokensGenerated: number;

  /** Generation time in milliseconds */
  generationTime: number;

  /** Tokens per second */
  tokensPerSecond: number;

  /** Function calls made (if any) */
  functionCalls?: FunctionCall[];

  /** Whether generation was stopped early */
  stopped: boolean;

  /** Stop reason (if stopped) */
  stopReason?: "max_tokens" | "stop_sequence" | "function_call" | "error";
}

/**
 * Function call information
 */
export interface FunctionCall {
  /** Function name */
  name: string;

  /** Function parameters */
  parameters: Record<string, any>;

  /** Function result */
  result: any;

  /** Execution time in milliseconds */
  executionTime: number;

  /** Whether function call succeeded */
  success: boolean;

  /** Error message (if failed) */
  error?: string;
}

/**
 * Service status
 */
export interface ServiceStatus {
  /** Whether service is initialized */
  initialized: boolean;

  /** Number of models loaded */
  modelsLoaded: number;

  /** Number of active sessions */
  activeSessions: number;

  /** Total memory usage in bytes */
  memoryUsage?: number;

  /** GPU availability */
  gpuAvailable?: boolean;

  /** GPU type (if available) */
  gpuType?: string;

  /** Number of GPU layers in use */
  gpuLayersInUse?: number;
}

/**
 * Hardware capabilities
 */
export interface HardwareCapabilities {
  /** Total system RAM in GB */
  totalRAM: number;

  /** Available RAM in GB */
  availableRAM: number;

  /** GPU availability */
  hasGPU: boolean;

  /** GPU type (Metal, CUDA, Vulkan, or null) */
  gpuType: "metal" | "cuda" | "vulkan" | null;

  /** GPU VRAM in GB (if available) */
  gpuVRAM?: number;

  /** Number of CPU cores */
  cpuCores: number;

  /** CPU architecture */
  cpuArch: string;

  /** Operating system */
  os: string;

  /** Recommended model size */
  recommendedModelSize: "7B" | "13B" | "30B" | "70B";
}
