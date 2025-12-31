# AI Provider Integration Guide

## Overview

The Assistant Revival application now supports multiple AI providers with automatic fallback capabilities:

- **OpenAI API** - Cloud-based AI (existing)
- **node-llama-cpp** - Local LLM inference (new)
- **Automatic Fallback** - Seamlessly switches between providers

## Features

### ✨ Multi-Provider Support

- **OpenAI Provider**: Use GPT models via API
- **Local LLM Provider**: Run models locally with node-llama-cpp
- **Automatic Selection**: Choose the best available provider
- **Fallback Mechanism**: Automatically switch if primary fails

### 🔄 Intelligent Fallback

The system automatically falls back to alternative providers:

1. **Primary provider fails** → Try fallback provider
2. **All providers fail** → Return error message
3. **Seamless transition** → User doesn't notice the switch

### 🎯 Provider Modes

#### Auto Mode (Recommended)
```env
AI_PROVIDER=auto
```
- Tries OpenAI first (fast, high quality)
- Falls back to local LLM if OpenAI unavailable
- Best for production use

#### OpenAI Only
```env
AI_PROVIDER=openai
```
- Uses OpenAI API exclusively
- Requires API key
- Fast and reliable

#### Local LLM Only
```env
AI_PROVIDER=llama-cpp
```
- Uses local model exclusively
- No API key required
- Privacy-focused, offline capable

## Installation

### 1. Install Dependencies

Already installed with:
```bash
npm install
```

The `node-llama-cpp` package is now included in dependencies.

### 2. Download a Model (for Local LLM)

Create models directory:
```bash
mkdir -p models
```

Download a GGUF model from HuggingFace:

**Recommended Models:**

- **Llama-2-7B-Chat** (Good for general use)
  ```bash
  wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
    -O models/llama-2-7b-chat.Q4_K_M.gguf
  ```

- **Mistral-7B-Instruct** (Better quality)
  ```bash
  wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf \
    -O models/mistral-7b-instruct-v0.2.Q4_K_M.gguf
  ```

- **Phi-3-Mini** (Smaller, faster)
  ```bash
  wget https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf \
    -O models/phi-3-mini-4k-instruct-q4.gguf
  ```

### 3. Configure Environment

Copy the AI configuration example:
```bash
cat .env.example.ai >> .env
```

Edit `.env` to configure your providers:

```env
# Auto mode with fallback (Recommended)
AI_PROVIDER=auto
AI_INTEGRATIONS_OPENAI_API_KEY=your_key_here
LLAMA_MODEL_PATH=./models/llama-2-7b-chat.Q4_K_M.gguf
AI_FALLBACK_ENABLED=true
```

## Configuration Options

### Provider Selection

| Variable | Values | Description |
|----------|--------|-------------|
| `AI_PROVIDER` | `auto`, `openai`, `llama-cpp` | Which provider to use |

### OpenAI Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_INTEGRATIONS_OPENAI_API_KEY` | - | Your OpenAI API key |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | `https://api.openai.com/v1` | API endpoint |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model to use |

### node-llama-cpp Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `LLAMA_MODEL_PATH` | `./models/model.gguf` | Path to GGUF model |
| `LLAMA_CONTEXT_SIZE` | `4096` | Context window size |
| `LLAMA_GPU_LAYERS` | `33` | GPU layers (0 = CPU only) |

### Fallback Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_FALLBACK_ENABLED` | `true` | Enable automatic fallback |

## Usage Examples

### Example 1: OpenAI with Local Fallback

Perfect for production - fast responses with offline backup.

```env
AI_PROVIDER=auto
AI_INTEGRATIONS_OPENAI_API_KEY=sk-proj-...
LLAMA_MODEL_PATH=./models/llama-2-7b-chat.Q4_K_M.gguf
AI_FALLBACK_ENABLED=true
```

**Behavior:**
1. Uses OpenAI for all requests
2. If OpenAI fails → switches to local LLM
3. User experience is seamless

### Example 2: Local LLM Only

Privacy-focused, no external API calls.

```env
AI_PROVIDER=llama-cpp
LLAMA_MODEL_PATH=./models/mistral-7b-instruct-v0.2.Q4_K_M.gguf
LLAMA_CONTEXT_SIZE=8192
LLAMA_GPU_LAYERS=33
```

**Behavior:**
1. All inference happens locally
2. No data sent to external servers
3. Works offline

### Example 3: OpenAI Only

Simple setup, cloud-based.

```env
AI_PROVIDER=openai
AI_INTEGRATIONS_OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
```

**Behavior:**
1. Uses OpenAI exclusively
2. No local model needed
3. Fast and reliable

## API Endpoints

### Get Provider Status

```bash
GET /api/ai/providers
```

**Response:**
```json
{
  "primary": "openai",
  "providers": [
    {
      "name": "openai",
      "displayName": "OpenAI",
      "available": true,
      "initialized": true
    },
    {
      "name": "llama-cpp",
      "displayName": "Local LLM (llama.cpp)",
      "available": true,
      "initialized": true
    }
  ]
}
```

### Chat Completion (Existing Endpoint)

The existing chat endpoint now uses the AI provider system:

```bash
POST /api/conversations/:id/messages
Content-Type: application/json

{
  "content": "Hello, how are you?"
}
```

**Streaming Response:**
```
data: {"content":"I'm"}
data: {"content":" doing"}
data: {"content":" well"}
data: {"done":true}
```

## Architecture

### Provider Interface

All providers implement the `AIProvider` interface:

```typescript
interface AIProvider {
  name: string;
  displayName: string;
  isAvailable(): Promise<boolean>;
  initialize(): Promise<void>;
  chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult>;
  chatCompletionStream(options: ChatCompletionOptions, onChunk: (chunk: ChatCompletionChunk) => void): Promise<void>;
  dispose(): Promise<void>;
}
```

### Provider Manager

The `AIProviderManager` handles:
- Provider initialization
- Availability checking
- Automatic fallback
- Resource management

### File Structure

```
server/
├── ai/
│   ├── types.ts                      # Interface definitions
│   ├── provider-manager.ts           # Provider manager
│   ├── providers/
│   │   ├── openai-provider.ts        # OpenAI implementation
│   │   └── llama-cpp-provider.ts     # node-llama-cpp implementation
│   └── index.ts                      # Exports
└── replit_integrations/
    └── chat/
        ├── routes.ts                 # Legacy routes (OpenAI only)
        └── routes-new.ts             # New routes (multi-provider)
```

## Performance Considerations

### Model Quantization

Choose the right quantization for your needs:

| Quantization | Quality | Speed | RAM Usage |
|--------------|---------|-------|-----------|
| Q4_K_M | Good | Fast | Low (4-6GB) |
| Q5_K_M | Better | Medium | Medium (6-8GB) |
| Q8_0 | Best | Slow | High (10-14GB) |

### GPU Acceleration

Enable GPU acceleration for faster inference:

```env
LLAMA_GPU_LAYERS=33  # Use GPU
LLAMA_GPU_LAYERS=0   # CPU only
```

**GPU Support:**
- **Metal** (macOS): Automatic
- **CUDA** (NVIDIA): Automatic if drivers installed
- **Vulkan** (AMD/Intel): Automatic if drivers installed

### Context Size

Adjust context size based on available RAM:

```env
LLAMA_CONTEXT_SIZE=2048   # Low RAM (4GB)
LLAMA_CONTEXT_SIZE=4096   # Medium RAM (8GB)
LLAMA_CONTEXT_SIZE=8192   # High RAM (16GB+)
```

## Troubleshooting

### Provider Not Available

**Symptom:** "No AI providers available" error

**Solutions:**
1. Check if model file exists:
   ```bash
   ls -lh models/*.gguf
   ```

2. Verify OpenAI API key:
   ```bash
   echo $AI_INTEGRATIONS_OPENAI_API_KEY
   ```

3. Check provider status:
   ```bash
   curl http://localhost:5000/api/ai/providers
   ```

### Model Loading Fails

**Symptom:** "Failed to initialize llama.cpp provider"

**Solutions:**
1. Verify model path is correct
2. Check file permissions:
   ```bash
   chmod 644 models/*.gguf
   ```
3. Ensure enough RAM available
4. Try a smaller model or quantization

### Slow Inference

**Symptom:** Responses take too long

**Solutions:**
1. Enable GPU acceleration:
   ```env
   LLAMA_GPU_LAYERS=33
   ```

2. Use a smaller model:
   - Phi-3-Mini (3.8B parameters)
   - TinyLlama (1.1B parameters)

3. Reduce context size:
   ```env
   LLAMA_CONTEXT_SIZE=2048
   ```

4. Use lower quantization (Q4_K_M instead of Q8_0)

### Out of Memory

**Symptom:** Process crashes or "Out of memory" error

**Solutions:**
1. Reduce context size:
   ```env
   LLAMA_CONTEXT_SIZE=2048
   ```

2. Use CPU instead of GPU:
   ```env
   LLAMA_GPU_LAYERS=0
   ```

3. Use a smaller model
4. Use lower quantization (Q4_K_M)

## Migration Guide

### From Legacy OpenAI-Only

The system automatically uses the new provider system. No code changes needed!

**Old behavior:**
- Uses OpenAI only
- Fails if OpenAI unavailable

**New behavior:**
- Uses OpenAI by default
- Falls back to local LLM if configured
- Seamless transition

### Backward Compatibility

The new system is fully backward compatible:

1. **No changes required** to existing code
2. **Environment variables** work as before
3. **API endpoints** remain the same
4. **Fallback** is automatic and transparent

## Best Practices

### Production Deployment

1. **Use Auto Mode** with fallback enabled
2. **Configure both** OpenAI and local LLM
3. **Monitor** provider status endpoint
4. **Set up alerts** for provider failures

### Development

1. **Use Local LLM** to avoid API costs
2. **Test fallback** by disabling providers
3. **Profile performance** with different models
4. **Optimize** context size and GPU layers

### Privacy & Security

1. **Local LLM** for sensitive data
2. **No logging** of API keys
3. **Secure storage** of models
4. **Audit** API calls

## Future Enhancements

Planned features for future releases:

- [ ] Support for more providers (Anthropic, Cohere, etc.)
- [ ] Model auto-download on first run
- [ ] Provider health monitoring
- [ ] Load balancing across multiple providers
- [ ] Custom provider plugins
- [ ] Provider-specific prompt optimization
- [ ] Cost tracking and analytics
- [ ] A/B testing between providers

## Support

### Getting Help

1. Check this documentation
2. Review error logs
3. Test provider status endpoint
4. Verify environment configuration

### Reporting Issues

When reporting issues, include:

1. Provider configuration (without API keys)
2. Model information (name, quantization)
3. Error messages from logs
4. System specs (RAM, GPU)

---

**Implementation Date**: 2025-12-31
**Version**: 1.0.0
**Status**: ✅ Complete and Ready for Testing
