
# Using Assistant Prompts

## What are Assistant Prompts?

Assistant Prompts let you customize how the AI assistant behaves by defining specific roles, expertise, and communication styles. Think of them as personality presets for different tasks.

## Accessing Prompts

### Prompt Selector
1. Look for the dropdown menu at the top of the chat
2. Click to see available prompts
3. Select a prompt to activate it
4. The assistant will now follow that prompt's guidelines

### Default Prompts

The system comes with several built-in prompts:

**Default Assistant**
- Balanced, helpful coding assistant
- Clear explanations in simple language
- Suitable for most general tasks

**Code Reviewer**
- Focuses on code quality and best practices
- Identifies bugs and security issues
- Suggests improvements

**Teacher**
- Educational explanations
- Step-by-step guidance
- Conceptual understanding focus

**Debugging Expert**
- Systematic problem-solving approach
- Detailed error analysis
- Root cause identification

## Using Different Prompts

### For Learning
Select the **Teacher** prompt when:
- Learning a new programming language
- Understanding complex concepts
- Getting step-by-step tutorials

Example:
```
[Teacher prompt selected]
Explain how async/await works in JavaScript
```

### For Code Review
Select the **Code Reviewer** prompt when:
- Reviewing code before deployment
- Checking for bugs or vulnerabilities
- Ensuring best practices

Example:
```
[Code Reviewer prompt selected]
@api-handler.js Please review this code
```

### For Debugging
Select the **Debugging Expert** prompt when:
- Troubleshooting errors
- Finding performance issues
- Understanding stack traces

Example:
```
[Debugging Expert prompt selected]
My app crashes with "Cannot read property 'map' of undefined"
```

## Prompt Effectiveness

### What Makes a Good Prompt?

Good prompts define:
- **Role**: What expertise the assistant should have
- **Tone**: How to communicate (formal, casual, technical)
- **Focus**: What to prioritize (speed, accuracy, education)
- **Constraints**: What to avoid or emphasize

### When to Switch Prompts

Switch prompts when your task changes:
- From coding → Switch to **Code Reviewer** before committing
- From debugging → Switch to **Teacher** to understand why it failed
- From learning → Switch to **Default** for quick answers

## Tips

1. **Choose the Right Prompt**: Match the prompt to your current task
2. **Stay Consistent**: Keep the same prompt for related questions
3. **Experiment**: Try different prompts to see which works best
4. **Combine with File Context**: Mention files regardless of prompt
5. **Provide Clear Input**: Prompts enhance, but clarity still matters

## Limitations

- Prompts guide behavior but don't add new capabilities
- The assistant still has the same knowledge base
- Complex tasks may require switching prompts mid-conversation
- Prompts work best with specific, focused requests
