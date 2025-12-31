# Quick Start Guide - Assistant Memorial Edition

Get up and running with Assistant Memorial Edition in 5 minutes!

## 🚀 Installation

```bash
# Clone or extract the project
cd assistant-revival

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5000`

## 📝 First Steps

### 1. Start a Chat Session
- Click **"New Chat"** in the left sidebar
- You'll see the welcome screen with quick actions

### 2. Upload a Code File
- Click **"Upload a file"** or use the upload button
- Select any `.js`, `.ts`, `.tsx`, `.py`, `.java`, etc.
- The file appears in the sidebar under your session

### 3. Ask the AI for Help
- Type a message in the chat input
- Mention files with `@filename` (e.g., `@app.tsx`)
- Press Enter or click Send
- Watch the AI response stream in real-time

### 4. Review Proposed Changes
- If the AI suggests code changes, they appear in the **Diff Viewer**
- Review the before/after comparison
- Click **"Apply Changes"** to save or **"Reject"** to discard

### 5. Manage Checkpoints
- Each applied change creates a checkpoint
- View checkpoints in the sidebar
- Click any checkpoint to restore files to that state

## 🎨 Customizing Your Experience

### Switch to Light Mode
- Click the **theme toggle** in the top-right corner
- Choose between dark and light themes

### Create Custom Prompts
- Click the **Settings icon** (⚙️) in the chat header
- Enter a prompt name and custom instructions
- Set it as default to use for all new chats

### Organize Sessions
- Each chat is a separate session
- Sessions persist in your browser
- Delete old sessions to clean up

## 💡 Pro Tips

### File Mentions
```
@app.tsx Can you add TypeScript types to this component?
@utils.ts How can I optimize this function?
```

### Multi-File Context
```
@app.tsx @styles.css Can you make sure the styling is applied correctly?
```

### Code Review
```
@api.ts Please review this code for security issues and suggest improvements.
```

### Quick Edits
```
@config.json Update the API endpoint to the production server
```

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process if needed
kill -9 <PID>

# Try again
npm run dev
```

### Files not uploading
- Check file size (should be < 10MB)
- Ensure file format is supported
- Check browser console for errors

### AI responses not working
- Verify OpenAI API key is set
- Check server logs for errors
- Ensure model is supported (gpt-4.1-mini, gpt-4.1-nano, gemini-2.5-flash)

## 📚 Learn More

- See [README.md](./README.md) for full documentation
- Check [design_guidelines.md](./design_guidelines.md) for design system details
- Review [replit.md](./replit.md) for architecture overview

## 🎯 Next Steps

1. **Explore Features**: Try different file types and prompts
2. **Create Prompts**: Build custom prompts for your workflow
3. **Save Sessions**: Keep important conversations for reference
4. **Share Feedback**: Report issues or suggest improvements

---

**Happy coding! 🚀**
