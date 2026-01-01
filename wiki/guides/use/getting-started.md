
# Getting Started with Assistant Memorial Edition

## Overview
Assistant Memorial Edition is an AI-powered coding assistant that helps you write, understand, and improve your code through an interactive chat interface.

## First Steps

### 1. Starting a Conversation
- Click the chat input at the bottom of the screen
- Type your question or request
- Press **Enter** or click **Send** to submit

### 2. Uploading Files
You can upload code files to provide context to the assistant:
- Click the **Upload** button or drag files into the sidebar
- Supported formats: `.js`, `.ts`, `.py`, `.java`, `.cpp`, and more
- Files appear in the sidebar for easy reference

### 3. Mentioning Files
Use the `@` symbol to reference uploaded files in your messages:
- Type `@` followed by the filename
- Select from the dropdown menu
- The assistant will analyze the file content in context

## Basic Features

### Chat Interface
- **Streaming Responses**: See the assistant's reply appear in real-time
- **Code Blocks**: Code appears with syntax highlighting
- **Copy Code**: Click the copy button on any code block
- **Message History**: Scroll through previous conversations

### File Management
- **View Files**: Click any file card to preview its contents
- **Remove Files**: Click the X button to remove from context
- **File Search**: Use `@` to quickly find files by name

### Keyboard Shortcuts
- **Cmd/Ctrl + Enter**: Send message
- **Cmd/Ctrl + K**: Focus message input
- **Esc**: Clear focus or close dialogs

## Common Use Cases

### Ask Questions
```
How do I read a file in Python?
```

### Code Review
```
@app.js Can you review this code for potential issues?
```

### Debug Help
```
I'm getting a TypeError on line 42 in @server.ts - what's wrong?
```

### Generate Code
```
Create a function that validates email addresses
```

### Refactoring
```
@utils.js Refactor this to use async/await instead of callbacks
```

## Tips for Better Results

1. **Be Specific**: Clearly describe what you need
2. **Provide Context**: Upload relevant files and mention them
3. **Ask Follow-ups**: Refine the assistant's suggestions
4. **Use Examples**: Show what you want with sample input/output
5. **Check Code**: Always review generated code before using it

## Next Steps

- Learn about [Assistant Prompts](assistant-prompts.md) to customize behavior
- Explore [Checkpoints & Rollback](checkpoints-rollback.md) to save your work
- Try [Advanced Features](advanced-features.md) for power users
