# README Update for AI Provider Integration

## Add this section to README.md after the "Features" section:

---

## 🤖 AI Provider Options

Assistant Revival now supports multiple AI providers with automatic fallback:

### Supported Providers

- **OpenAI API** - Fast, high-quality cloud-based AI (existing)
- **Local LLM (node-llama-cpp)** - Privacy-focused, offline-capable local inference (new)
- **Automatic Fallback** - Seamlessly switches between providers if one fails

### Quick Setup

**Option 1: OpenAI Only**
```bash
export AI_INTEGRATIONS_OPENAI_API_KEY="your-key"
npm run dev
```

**Option 2: Local LLM Only**
```bash
# Download a model (one-time, ~4GB)
mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
  -O models/llama-2-7b-chat.Q4_K_M.gguf

# Configure and run
export AI_PROVIDER="llama-cpp"
export LLAMA_MODEL_PATH="./models/llama-2-7b-chat.Q4_K_M.gguf"
npm run dev
```

**Option 3: Auto Mode with Fallback (Recommended)**
```bash
export AI_PROVIDER="auto"
export AI_INTEGRATIONS_OPENAI_API_KEY="your-key"
export LLAMA_MODEL_PATH="./models/llama-2-7b-chat.Q4_K_M.gguf"
npm run dev
```

### Documentation

- **Quick Start**: [AI_PROVIDER_QUICKSTART.md](./AI_PROVIDER_QUICKSTART.md)
- **Full Guide**: [AI_PROVIDER_INTEGRATION.md](./AI_PROVIDER_INTEGRATION.md)
- **Configuration**: [.env.example.ai](./.env.example.ai)

---

## Update the "Environment Variables" section:

### AI Provider Configuration

```bash
# Provider Selection (auto, openai, or llama-cpp)
AI_PROVIDER=auto

# OpenAI Configuration
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Local LLM Configuration (node-llama-cpp)
LLAMA_MODEL_PATH=./models/llama-2-7b-chat.Q4_K_M.gguf
LLAMA_CONTEXT_SIZE=4096
LLAMA_GPU_LAYERS=33

# Fallback Configuration
AI_FALLBACK_ENABLED=true
```

See [.env.example.ai](./.env.example.ai) for more details.

---

## Update the "API Endpoints" section:

### AI Provider Status
- `GET /api/ai/providers` - Get status of all AI providers

Example response:
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

---

## Update the "Key Design Decisions" section:

### 5. **Multi-Provider AI System**
The application supports multiple AI providers with automatic fallback:
- Abstracted provider interface for easy extensibility
- OpenAI and node-llama-cpp implementations
- Automatic failover between providers
- Seamless user experience regardless of provider

Benefits:
- Flexibility to choose between cloud and local AI
- Resilience through automatic fallback
- Privacy option with local inference
- Cost optimization (use free local models)

---
