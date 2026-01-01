# Node-Llama-CPP Integration - Quick Start Guide

## What's Been Integrated

This integration adds **local LLM execution** capabilities to Assistant Revival, enabling:

1. **Local Model Execution** - Run AI models on your machine with GPU acceleration
2. **Function Calling** - AI can invoke workspace tools (file operations, shell commands, etc.)
3. **Streaming Responses** - Real-time token-by-token generation
4. **JSON Schema Enforcement** - Guarantee structured output formats

## Files Added

### Core Service Layer
- `server/replit_integrations/local-llm/index.ts` - Main service class
- `server/replit_integrations/local-llm/functions.ts` - Function calling definitions
- `server/replit_integrations/local-llm/routes.ts` - Express API routes

### Type Definitions
- `shared/models/local-llm-config.ts` - TypeScript interfaces and types

### Documentation
- `LOCAL_LLM_INTEGRATION.md` - Comprehensive integration guide
- `NODE_LLAMA_CPP_INTEGRATION_README.md` - This file

## Files Modified

- `package.json` - Added `node-llama-cpp` and `glob` dependencies
- `server/routes.ts` - Registered local LLM routes

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `node-llama-cpp@^3.6.0` - Local LLM execution engine
- `glob@^11.0.0` - File pattern matching for function calling

### 2. Download a Model

Choose a model based on your hardware:

**For 8GB RAM (Development)**:
```bash
npx node-llama-cpp pull bartowski/Llama-3.2-3B-Instruct-GGUF
```

**For 16GB+ RAM (Production)**:
```bash
npx node-llama-cpp pull bartowski/Meta-Llama-3.1-8B-Instruct-GGUF
```

Models will be downloaded to `~/.cache/node-llama-cpp/models/`

### 3. Configure Environment

Add to your `.env` file:

```env
# Local LLM Configuration
LOCAL_LLM_ENABLED=true
LOCAL_LLM_MODEL_PATH=/path/to/your/model.gguf
LOCAL_LLM_GPU_LAYERS=-1
LOCAL_LLM_CONTEXT_SIZE=4096
LOCAL_LLM_TEMPERATURE=0.7
LOCAL_LLM_FUNCTION_CALLING=true
```

Replace `/path/to/your/model.gguf` with the actual path to your downloaded model.

### 4. Start the Server

```bash
npm run dev
```

## Testing the Integration

### 1. Initialize the Service

```bash
curl -X POST http://localhost:5000/api/local-llm/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "modelPath": "/path/to/model.gguf",
    "gpuLayers": -1,
    "contextSize": 4096,
    "temperature": 0.7,
    "enableFunctionCalling": true
  }'
```

### 2. Load a Model

```bash
curl -X POST http://localhost:5000/api/local-llm/models/load \
  -H "Content-Type: application/json" \
  -d '{
    "modelPath": "/path/to/model.gguf",
    "gpuLayers": -1
  }'
```

### 3. Create a Session

```bash
curl -X POST http://localhost:5000/api/local-llm/sessions/create \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "model.gguf",
    "systemPrompt": "You are a helpful coding assistant."
  }'
```

### 4. Generate a Response

```bash
curl -X POST http://localhost:5000/api/local-llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "model.gguf-1234567890",
    "prompt": "Write a Python function to calculate fibonacci numbers",
    "options": {
      "temperature": 0.7,
      "maxTokens": 500
    }
  }'
```

### 5. Test Function Calling

```bash
curl -X POST http://localhost:5000/api/local-llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "model.gguf-1234567890",
    "prompt": "List all TypeScript files in the current directory",
    "options": {
      "enableFunctionCalling": true,
      "allowedFunctions": ["listDirectory", "searchFiles"]
    }
  }'
```

## Available Functions

The integration provides these built-in functions that the AI can call:

1. **readFile** - Read file contents
2. **writeFile** - Write content to files
3. **listDirectory** - List directory contents
4. **executeShell** - Execute shell commands
5. **searchFiles** - Search files by glob pattern
6. **getFileInfo** - Get file metadata
7. **createDirectory** - Create directories
8. **deleteFileOrDir** - Delete files/directories
9. **searchInFiles** - Search text within files

## API Endpoints

### Service Management
- `POST /api/local-llm/initialize` - Initialize the service
- `GET /api/local-llm/status` - Get service status
- `GET /api/local-llm/functions` - List available functions

### Model Management
- `POST /api/local-llm/models/load` - Load a model
- `POST /api/local-llm/models/unload` - Unload a model

### Session Management
- `POST /api/local-llm/sessions/create` - Create a chat session
- `POST /api/local-llm/sessions/destroy` - Destroy a session

### Generation
- `POST /api/local-llm/generate` - Generate response (non-streaming)
- `POST /api/local-llm/generate/stream` - Generate response (streaming)

## Hardware Requirements

### Minimum
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 2GB per model

### Recommended
- **CPU**: 8+ cores
- **RAM**: 16GB+
- **GPU**: Metal (Mac), CUDA (NVIDIA), or Vulkan
- **Storage**: SSD

## Model Recommendations

| Use Case | Model | Size | RAM | Quality |
|----------|-------|------|-----|---------|
| Development | Llama-3.2-3B-Instruct-Q4_K_M | 2GB | 4-6GB | Good |
| Production | Llama-3.1-8B-Instruct-Q4_K_M | 5GB | 6-8GB | Excellent |
| High Quality | Mistral-7B-Instruct-v0.3-Q8_0 | 8GB | 10-12GB | Outstanding |

## Troubleshooting

### Model Not Loading
- Verify model path is correct
- Check file permissions
- Ensure model is in GGUF format

### Out of Memory
- Use smaller model or lower quantization
- Reduce context size
- Enable GPU acceleration
- Close other applications

### Slow Generation
- Enable GPU acceleration (`gpuLayers: -1`)
- Use smaller model
- Reduce context size

### Function Calling Not Working
- Ensure `enableFunctionCalling: true`
- Use models trained for function calling (Llama 3.1+)
- Check function parameter schemas

## Next Steps

1. **Read Full Documentation**: See `LOCAL_LLM_INTEGRATION.md` for comprehensive details
2. **Explore Function Calling**: Test different workspace operations
3. **Optimize Performance**: Tune GPU layers and context size
4. **Add Custom Functions**: Extend `functions.ts` with your own tools
5. **Build UI Integration**: Create frontend components for local LLM

## Benefits

### Privacy
- Keep sensitive code and data local
- No external API calls
- Complete data control

### Cost Savings
- Eliminate per-token API costs
- Unlimited local inference
- One-time model download

### Performance
- Hardware-accelerated inference
- Low latency with GPU
- Offline capability

### Flexibility
- Support multiple models
- Custom function calling
- Fine-grained control

## Resources

- [Full Integration Guide](./LOCAL_LLM_INTEGRATION.md)
- [node-llama-cpp Documentation](https://node-llama-cpp.withcat.ai)
- [Model Analysis](../node-llama-cpp-analysis.md)
- [Hugging Face GGUF Models](https://huggingface.co/models?library=gguf)

## Support

For issues or questions:
1. Check `LOCAL_LLM_INTEGRATION.md` troubleshooting section
2. Review node-llama-cpp documentation
3. Open an issue on GitHub

---

**Integration Version**: 1.0.0  
**Date**: December 31, 2024  
**Status**: Ready for Testing
