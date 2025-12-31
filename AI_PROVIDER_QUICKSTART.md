# AI Provider Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: OpenAI Only (Easiest)

**No model download required!**

1. **Set environment variable**:
   ```bash
   export AI_INTEGRATIONS_OPENAI_API_KEY="your-api-key"
   export AI_PROVIDER="openai"
   ```

2. **Start the app**:
   ```bash
   npm run dev
   ```

3. **Done!** Open http://localhost:5000 and start chatting.

---

### Option 2: Local LLM Only (Privacy-Focused)

**Run AI completely offline!**

1. **Download a model** (one-time, ~4GB):
   ```bash
   mkdir -p models
   wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
     -O models/llama-2-7b-chat.Q4_K_M.gguf
   ```

2. **Set environment variable**:
   ```bash
   export AI_PROVIDER="llama-cpp"
   export LLAMA_MODEL_PATH="./models/llama-2-7b-chat.Q4_K_M.gguf"
   ```

3. **Start the app**:
   ```bash
   npm run dev
   ```

4. **Done!** Open http://localhost:5000 and start chatting.

---

### Option 3: Auto Mode with Fallback (Recommended)

**Best of both worlds - fast cloud AI with offline backup!**

1. **Download a model** (for fallback):
   ```bash
   mkdir -p models
   wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
     -O models/llama-2-7b-chat.Q4_K_M.gguf
   ```

2. **Set environment variables**:
   ```bash
   export AI_PROVIDER="auto"
   export AI_INTEGRATIONS_OPENAI_API_KEY="your-api-key"
   export LLAMA_MODEL_PATH="./models/llama-2-7b-chat.Q4_K_M.gguf"
   export AI_FALLBACK_ENABLED="true"
   ```

3. **Start the app**:
   ```bash
   npm run dev
   ```

4. **Done!** The app will use OpenAI by default and automatically fall back to local LLM if needed.

---

## 🧪 Testing the Integration

### Test Provider Status

Check which providers are available:

```bash
curl http://localhost:5000/api/ai/providers | jq
```

**Expected output:**
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

### Test Chat Completion

Send a test message:

```bash
# 1. Create a conversation
CONV_ID=$(curl -X POST http://localhost:5000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Chat"}' | jq -r '.id')

# 2. Send a message
curl -X POST http://localhost:5000/api/conversations/$CONV_ID/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello! Can you tell me a joke?"}' \
  --no-buffer
```

You should see streaming responses!

### Test Fallback

To test the fallback mechanism:

1. **Start with auto mode** (both providers configured)
2. **Disable OpenAI** by setting invalid API key:
   ```bash
   export AI_INTEGRATIONS_OPENAI_API_KEY="invalid"
   ```
3. **Restart the app**
4. **Send a message** - it should automatically use local LLM

---

## 📊 Performance Comparison

| Provider | Speed | Quality | Cost | Privacy |
|----------|-------|---------|------|---------|
| **OpenAI** | ⚡⚡⚡ Fast | ⭐⭐⭐ Excellent | 💰 Paid | ⚠️ Cloud |
| **Local LLM (Q4)** | ⚡⚡ Medium | ⭐⭐ Good | 🆓 Free | ✅ Private |
| **Local LLM (Q8)** | ⚡ Slow | ⭐⭐⭐ Excellent | 🆓 Free | ✅ Private |

---

## 🎯 Recommended Models

### For General Use
- **Llama-2-7B-Chat-Q4_K_M** (4GB) - Good balance
- **Mistral-7B-Instruct-Q4_K_M** (4GB) - Better quality

### For Low RAM Systems
- **Phi-3-Mini-Q4** (2GB) - Smaller, faster
- **TinyLlama-Q4** (600MB) - Minimal resource usage

### For Best Quality
- **Llama-2-7B-Chat-Q8_0** (7GB) - Highest quality
- **Mistral-7B-Instruct-Q8_0** (7GB) - Best results

---

## 🔧 Troubleshooting

### "No AI providers available"

**Solution:** Configure at least one provider:
```bash
# For OpenAI
export AI_INTEGRATIONS_OPENAI_API_KEY="your-key"

# OR for local LLM
export LLAMA_MODEL_PATH="./models/model.gguf"
```

### "Model file not found"

**Solution:** Download a model:
```bash
mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
  -O models/llama-2-7b-chat.Q4_K_M.gguf
```

### Slow responses with local LLM

**Solution:** Enable GPU acceleration:
```bash
export LLAMA_GPU_LAYERS=33  # Use GPU
```

Or use a smaller model:
```bash
# Download Phi-3-Mini (smaller, faster)
wget https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf \
  -O models/phi-3-mini-4k-instruct-q4.gguf
export LLAMA_MODEL_PATH="./models/phi-3-mini-4k-instruct-q4.gguf"
```

---

## 📚 Next Steps

1. **Read the full guide**: [AI_PROVIDER_INTEGRATION.md](./AI_PROVIDER_INTEGRATION.md)
2. **Configure your environment**: Copy `.env.example.ai` to `.env`
3. **Explore different models**: Try various quantizations and sizes
4. **Monitor performance**: Use the `/api/ai/providers` endpoint
5. **Optimize settings**: Adjust context size and GPU layers

---

## 🎉 You're Ready!

The AI provider system is now integrated and ready to use. Choose the mode that works best for you:

- **Fast & Easy**: OpenAI only
- **Private & Offline**: Local LLM only
- **Best of Both**: Auto mode with fallback

Happy chatting! 🚀
