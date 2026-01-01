
# Advanced Features

## File Management

### Batch File Operations
Upload multiple files at once:
- Drag an entire folder into the sidebar
- Select multiple files in file picker
- All files become available for `@` mentions

### File Context Strategy
Optimize which files to include:
- **Focused**: Mention only relevant files (faster, more precise)
- **Comprehensive**: Include all related files (better context)
- **Iterative**: Start focused, add files as needed

### File Organization
Keep your workspace tidy:
- Remove unused files from context
- Group related files together
- Use clear file names

## Code Actions

### Applying Code Suggestions
When the assistant suggests code changes:
1. Review the proposed change
2. Click "Apply" if it looks good
3. Edit manually if you need adjustments
4. Test before committing

### Code Blocks
Work efficiently with generated code:
- **Copy**: Click copy button on any code block
- **Preview**: See syntax highlighting automatically
- **Diff View**: Compare old vs. new code
- **Select All**: Triple-click to select entire block

### Multi-File Changes
Handle changes across multiple files:
1. Review each file's proposed changes
2. Apply changes individually
3. Verify consistency across files
4. Run tests before finalizing

## Conversation Management

### Message History
Navigate your conversation:
- Scroll to review previous messages
- Use search (when implemented) to find specific topics
- Reference earlier solutions in new questions

### Context Awareness
The assistant remembers:
- Previous questions in the conversation
- Files you've mentioned
- Code it has generated
- Problems you've discussed

### Multi-Turn Conversations
Build complex solutions iteratively:
```
You: Create a user class
Assistant: [Creates basic User class]

You: Add email validation
Assistant: [Adds validation method]

You: Now add password hashing
Assistant: [Adds secure password handling]
```

## Productivity Tips

### Keyboard Shortcuts
Master these for efficiency:
- `Cmd/Ctrl + Enter`: Send message
- `Cmd/Ctrl + K`: Focus input
- `Cmd/Ctrl + O`: Open file picker
- `Esc`: Close dialogs

### Effective Prompting

**Be Specific:**
```
❌ "Fix my code"
✅ "@server.js Fix the authentication error on line 42"
```

**Provide Context:**
```
❌ "How do I connect to a database?"
✅ "How do I connect to PostgreSQL in Node.js using the pg library?"
```

**Show Examples:**
```
❌ "Format this data"
✅ "Format this JSON data to display as a table like:
| Name | Age |
|------|-----|
| John | 30  |"
```

### Iterative Refinement
Get better results through conversation:
1. Start with general request
2. Review initial response
3. Ask for specific improvements
4. Refine until satisfied

## Working with Different Languages

### Language Detection
The assistant automatically detects:
- Programming language from file extensions
- Code syntax in messages
- Context from your questions

### Language-Specific Features
Different languages get appropriate handling:
- **Python**: Indentation-aware
- **JavaScript**: Modern ES6+ syntax
- **TypeScript**: Type definitions
- **CSS**: Framework-aware (Tailwind, etc.)

### Polyglot Projects
Working with multiple languages:
- Mention files in different languages
- Assistant understands cross-language patterns
- Get integration advice between languages

## Debugging Workflows

### Systematic Debugging
1. Describe the problem clearly
2. Include error messages
3. Mention relevant files with `@`
4. Show what you've tried
5. Ask for specific debugging steps

### Error Analysis
Share complete error information:
```
@app.ts I'm getting this error:
TypeError: Cannot read property 'map' of undefined
  at UserList.render (app.ts:42)
  at ...
```

### Step-by-Step Resolution
Work through problems methodically:
- Isolate the issue
- Test assumptions
- Verify each fix
- Understand the root cause

## Integration Patterns

### API Development
Build APIs effectively:
- Define endpoints clearly
- Request validation examples
- Error handling patterns
- Testing strategies

### Frontend Development
UI/UX implementation:
- Component structure
- State management
- Event handling
- Responsive design

### Full-Stack Workflows
Connect frontend and backend:
- API integration
- Data flow
- Authentication
- Deployment considerations

## Performance Optimization

### Response Quality
Get better answers:
- Provide complete context
- Ask one question at a time
- Be patient with complex requests
- Clarify when needed

### Faster Iterations
Work efficiently:
- Create checkpoints before big changes
- Keep relevant files loaded
- Use specific prompts for tasks
- Batch related questions

### Resource Management
Keep the system responsive:
- Remove unused files
- Clear old conversations when done
- Don't upload unnecessarily large files
- Focus context on current task
