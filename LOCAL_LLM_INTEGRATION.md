# Local LLM Integration for Assistant Revival

## Overview

This integration adds **local Large Language Model (LLM) execution** capabilities to Assistant Revival using [node-llama-cpp](https://node-llama-cpp.withcat.ai). This enables running AI models directly on your machine with hardware acceleration, providing privacy, cost savings, and offline functionality.

## Key Features

### 1. **Local Model Execution**
- Run LLMs locally without external API calls
- Automatic hardware acceleration (Metal, CUDA, Vulkan)
- Support for GGUF quantized models
- Efficient memory management

### 2. **Function Calling**
- AI can invoke workspace tools and operations
- Type-safe function definitions with parameter validation
- Built-in functions for file operations, shell commands, and more
- Extensible function registry

### 3. **Streaming Responses**
- Real-time token-by-token streaming
- Improved user experience with immediate feedback
- Cancellable generation

### 4. **JSON Schema Enforcement**
- Force model output to conform to specific schemas
- Guaranteed parseable responses
- Useful for structured data extraction and API integration

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Assistant Revival                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Local LLM Service Layer                    │  │
│  │  - Model loading and caching                          │  │
│  │  - Session management                                 │  │
│  │  - Generation orchestration                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Function Calling Integration                  │  │
│  │  - File operations (read, write, list)                │  │
│  │  - Shell command execution                            │  │
│  │  - Directory management                               │  │
│  │  - Content search                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              node-llama-cpp                           │  │
│  │  - Hardware-accelerated inference                     │  │
│  │  - Context management                                 │  │
│  │  - Grammar-based constraints                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              llama.cpp (Native)                       │  │
│  │  - GPU acceleration (Metal/CUDA/Vulkan)               │  │
│  │  - Optimized inference engine                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Installation

### 1. Install Dependencies

Add node-llama-cpp to package.json:

```bash
npm install node-llama-cpp
```

### 2. Download a Model

Download a GGUF model from Hugging Face. Recommended models:

**For Development (4-8GB RAM)**:
- [Llama-3.2-3B-Instruct-Q4_K_M](https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF)
- [Qwen2.5-3B-Instruct-Q4_K_M](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF)

**For Production (16GB+ RAM)**:
- [Llama-3.1-8B-Instruct-Q4_K_M](https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF)
- [Mistral-7B-Instruct-v0.3-Q4_K_M](https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.3-GGUF)

**Using CLI**:
```bash
npx node-llama-cpp pull bartowski/Llama-3.2-3B-Instruct-GGUF
```

### 3. Configure Environment

Add to `.env`:

```env
# Local LLM Configuration
LOCAL_LLM_ENABLED=true
LOCAL_LLM_MODEL_PATH=./models/Llama-3.2-3B-Instruct-Q4_K_M.gguf
LOCAL_LLM_GPU_LAYERS=-1
LOCAL_LLM_CONTEXT_SIZE=4096
LOCAL_LLM_TEMPERATURE=0.7
LOCAL_LLM_FUNCTION_CALLING=true
```

## API Reference

### Initialize Service

```typescript
POST /api/local-llm/initialize

Body:
{
  "enabled": true,
  "modelPath": "./models/model.gguf",
  "gpuLayers": -1,
  "contextSize": 4096,
  "temperature": 0.7,
  "enableFunctionCalling": true
}

Response:
{
  "success": true,
  "status": {
    "initialized": true,
    "modelsLoaded": 0,
    "activeSessions": 0
  }
}
```

### Load Model

```typescript
POST /api/local-llm/models/load

Body:
{
  "modelPath": "./models/model.gguf",
  "gpuLayers": -1,
  "contextSize": 4096
}

Response:
{
  "success": true,
  "modelId": "model.gguf",
  "message": "Model loaded successfully"
}
```

### Create Session

```typescript
POST /api/local-llm/sessions/create

Body:
{
  "modelId": "model.gguf",
  "contextSize": 4096,
  "systemPrompt": "You are a helpful coding assistant."
}

Response:
{
  "success": true,
  "sessionId": "model.gguf-1234567890",
  "message": "Session created successfully"
}
```

### Generate Response

```typescript
POST /api/local-llm/generate

Body:
{
  "sessionId": "model.gguf-1234567890",
  "prompt": "Write a Python function to calculate fibonacci numbers",
  "options": {
    "temperature": 0.7,
    "maxTokens": 500,
    "enableFunctionCalling": true
  }
}

Response:
{
  "success": true,
  "response": "Here's a Python function...",
  "sessionId": "model.gguf-1234567890"
}
```

### Stream Response

```typescript
POST /api/local-llm/generate/stream

Body:
{
  "sessionId": "model.gguf-1234567890",
  "prompt": "Explain how async/await works in JavaScript",
  "options": {
    "temperature": 0.7,
    "enableFunctionCalling": false
  }
}

Response: (Server-Sent Events)
data: {"chunk": "Async"}
data: {"chunk": "/await"}
data: {"chunk": " is"}
...
data: {"done": true}
```

## Function Calling

### Available Functions

The integration provides these built-in functions:

1. **readFile** - Read file contents
2. **writeFile** - Write content to a file
3. **listDirectory** - List directory contents
4. **executeShell** - Execute shell commands
5. **searchFiles** - Search files by pattern
6. **getFileInfo** - Get file metadata
7. **createDirectory** - Create directories
8. **deleteFileOrDir** - Delete files or directories
9. **searchInFiles** - Search text within files

### Example Usage

```typescript
// Enable function calling in generation
const response = await fetch("/api/local-llm/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "session-id",
    prompt: "List all TypeScript files in the src directory",
    options: {
      enableFunctionCalling: true,
      allowedFunctions: ["listDirectory", "searchFiles"]
    }
  })
});
```

The model will automatically call the appropriate functions and incorporate results into its response.

### Adding Custom Functions

Define new functions in `server/replit_integrations/local-llm/functions.ts`:

```typescript
export const assistantFunctions = {
  // ... existing functions ...

  myCustomFunction: defineChatSessionFunction({
    description: "Description of what this function does",
    params: {
      type: "object",
      properties: {
        paramName: {
          type: "string",
          description: "Parameter description"
        }
      }
    },
    async handler(params: { paramName: string }) {
      // Implementation
      return {
        success: true,
        result: "function result"
      };
    }
  })
};
```

## Configuration Options

### GPU Acceleration

```typescript
{
  gpuLayers: -1  // Auto-detect and use all available GPU layers
  gpuLayers: 0   // CPU only (no GPU)
  gpuLayers: 35  // Use 35 GPU layers (hybrid CPU/GPU)
}
```

### Context Size

```typescript
{
  contextSize: 2048   // Small context (faster, less memory)
  contextSize: 4096   // Standard context
  contextSize: 8192   // Large context (slower, more memory)
  contextSize: 32768  // Very large context (requires significant RAM)
}
```

### Temperature

```typescript
{
  temperature: 0.0   // Deterministic (same output every time)
  temperature: 0.7   // Balanced (recommended)
  temperature: 1.0   // Creative (more varied output)
  temperature: 1.5   // Very creative (may be incoherent)
}
```

## Hardware Requirements

### Minimum Requirements
- **CPU**: 4 cores, x86_64 or ARM64
- **RAM**: 8GB (for 3B models with Q4 quantization)
- **Storage**: 2GB per model
- **OS**: macOS, Linux, or Windows

### Recommended Requirements
- **CPU**: 8+ cores
- **RAM**: 16GB+ (for 7B models)
- **GPU**: Metal (Mac), CUDA (NVIDIA), or Vulkan compatible
- **Storage**: SSD for faster model loading

### Model Size Guide

| Model Size | Quantization | RAM Required | Speed | Quality |
|------------|--------------|--------------|-------|---------|
| 3B | Q4_K_M | 4-6 GB | Fast | Good |
| 7B | Q4_K_M | 6-8 GB | Medium | Very Good |
| 7B | Q8_0 | 10-12 GB | Medium | Excellent |
| 13B | Q4_K_M | 10-12 GB | Slow | Excellent |
| 30B | Q4_K_M | 20-24 GB | Very Slow | Outstanding |

## Performance Optimization

### 1. Model Selection
- Use Q4_K_M quantization for best balance of quality and speed
- Smaller models (3B-7B) for interactive use
- Larger models (13B+) for complex reasoning tasks

### 2. GPU Acceleration
- Enable GPU layers for significant speedup
- Metal (Mac), CUDA (NVIDIA), or Vulkan (AMD/Intel)
- Hybrid CPU/GPU for models larger than VRAM

### 3. Context Management
- Use smaller context sizes when possible
- Implement context pruning for long conversations
- Consider context shift for very long sessions

### 4. Batching
- Batch multiple requests when possible
- Reuse sessions for related queries
- Implement session pooling for high concurrency

## Troubleshooting

### Model Loading Fails

**Issue**: "Failed to load model: File not found"

**Solution**: 
- Verify model path is correct
- Ensure model file is in GGUF format
- Check file permissions

### Out of Memory

**Issue**: "Failed to allocate memory for model"

**Solution**:
- Use smaller model or lower quantization
- Reduce context size
- Enable GPU acceleration
- Close other applications

### Slow Generation

**Issue**: Generation is very slow

**Solution**:
- Enable GPU acceleration (`gpuLayers: -1`)
- Use smaller model
- Reduce context size
- Check system resources

### Function Calling Not Working

**Issue**: Model doesn't call functions

**Solution**:
- Ensure `enableFunctionCalling: true`
- Use models trained for function calling (Llama 3.1+)
- Provide clear function descriptions
- Check function parameter schemas

## Security Considerations

### 1. Function Permissions
- Limit allowed functions based on user role
- Validate all function parameters
- Sanitize file paths to prevent directory traversal
- Restrict shell command execution

### 2. Resource Limits
- Set maximum context size
- Limit concurrent sessions
- Implement generation timeouts
- Monitor memory usage

### 3. Model Safety
- Use trusted model sources only
- Verify model checksums
- Scan models for malicious content
- Keep models updated

## Future Enhancements

### Phase 2: Advanced Features
- [ ] Embedding generation for semantic search
- [ ] Reranking for improved retrieval
- [ ] Context shift and pruning strategies
- [ ] Batch processing optimization

### Phase 3: Model Management
- [ ] Model browser and downloader UI
- [ ] Resource estimation and recommendations
- [ ] LoRA adapter support
- [ ] Model performance benchmarking

### Phase 4: Enterprise Features
- [ ] Multi-user session management
- [ ] Usage analytics and monitoring
- [ ] Model fine-tuning integration
- [ ] Distributed inference support

## References

- [node-llama-cpp Documentation](https://node-llama-cpp.withcat.ai)
- [llama.cpp GitHub](https://github.com/ggml-org/llama.cpp)
- [Hugging Face GGUF Models](https://huggingface.co/models?library=gguf)
- [Function Calling Guide](https://node-llama-cpp.withcat.ai/guide/function-calling)

## Support

For issues or questions:
1. Check the [troubleshooting section](#troubleshooting)
2. Review [node-llama-cpp documentation](https://node-llama-cpp.withcat.ai)
3. Open an issue on GitHub
4. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: December 31, 2024  
**Status**: Production Ready
