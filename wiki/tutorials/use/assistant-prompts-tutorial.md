
# Tutorial: Mastering Assistant Prompts

## Introduction

Learn how to use different assistant prompts to get the best results for different tasks. Prompts are like personalities - each one is optimized for specific scenarios.

**Time Required:** 20 minutes  
**Prerequisites:** Complete [Getting Started Tutorial](getting-started-tutorial.md)

## Understanding Prompts

### What Are Prompts?

Prompts define:
- **Expertise level** - General vs. specialized knowledge
- **Communication style** - Technical vs. beginner-friendly
- **Focus areas** - Code quality, education, debugging, etc.

### Available Prompts

1. **Default Assistant** - General-purpose helper
2. **Code Reviewer** - Quality and best practices
3. **Teacher** - Educational explanations
4. **Debugging Expert** - Problem-solving focus

## Part 1: Default Assistant (5 minutes)

### When to Use
- General coding questions
- Quick answers
- Balanced help

### Exercise 1: General Question

```
[Select: Default prompt from dropdown]

Ask: "How do I read a JSON file in Python?"
```

**Expected Result:** Clear, straightforward answer with code example.

### Exercise 2: Code Generation

```
Ask: "Create a function that validates email addresses"
```

**Notice:** Code-focused response with practical examples.

## Part 2: Code Reviewer (5 minutes)

### When to Use
- Before committing code
- Quality assurance
- Learning best practices

### Exercise 3: Upload Code for Review

Create `user-auth.js`:
```javascript
function login(username, password) {
  if (username == "admin" && password == "password123") {
    return true;
  }
  return false;
}
```

```
[Switch to: Code Reviewer prompt]

Ask: "@user-auth.js Please review this authentication code"
```

**Expected Feedback:**
- Security issues (hardcoded credentials, == vs ===)
- Missing validation
- No error handling
- Suggests improvements

### Exercise 4: Iterate on Feedback

```
Ask: "How should I fix the security issues you mentioned?"
```

Watch how the Code Reviewer provides production-ready solutions!

## Part 3: Teacher Prompt (5 minutes)

### When to Use
- Learning new concepts
- Understanding "why" not just "how"
- Step-by-step explanations

### Exercise 5: Conceptual Learning

```
[Switch to: Teacher prompt]

Ask: "What are JavaScript closures and why do we use them?"
```

**Expected Result:**
- Beginner-friendly explanation
- Multiple examples progressing in complexity
- Real-world use cases
- Common pitfalls

### Exercise 6: Follow-Up for Depth

```
Ask: "Can you show me a practical example where closures solve a real problem?"
```

**Notice:** More detailed, educational approach compared to Default prompt.

## Part 4: Debugging Expert (5 minutes)

### When to Use
- Troubleshooting errors
- Performance issues
- Understanding failures

### Exercise 7: Debug an Error

Create `buggy-code.js`:
```javascript
const users = null;

function displayUsers() {
  users.map(user => console.log(user.name));
}

displayUsers();
```

```
[Switch to: Debugging Expert prompt]

Ask: "@buggy-code.js This crashes with 'Cannot read property map of null'. Help me debug it."
```

**Expected Response:**
- Root cause analysis
- Step-by-step debugging approach
- Prevention strategies
- Testing recommendations

### Exercise 8: Complex Debugging

```
Ask: "The app works locally but fails in production. How do I troubleshoot?"
```

**Notice:** Systematic debugging methodology!

## Part 5: Comparing Prompts

### Exercise 9: Same Question, Different Prompts

Ask this question with EACH prompt:

```
"Explain async/await in JavaScript"
```

**Default:** Quick, code-focused explanation  
**Teacher:** Detailed, conceptual breakdown  
**Code Reviewer:** Best practices and common mistakes  
**Debugging Expert:** Error handling and troubleshooting

### Observations

| Prompt | Focus | Best For |
|--------|-------|----------|
| Default | Balanced | General tasks |
| Code Reviewer | Quality | Pre-commit checks |
| Teacher | Understanding | Learning |
| Debugging Expert | Problems | Troubleshooting |

## Best Practices

### Prompt Selection Strategy

**Start of Project:**
- Use **Default** for initial code generation
- Switch to **Teacher** when learning new concepts

**Development:**
- Use **Default** for quick questions
- Use **Debugging Expert** when stuck

**Before Commit:**
- Switch to **Code Reviewer** for quality check
- Address all suggestions

**After Errors:**
- Use **Debugging Expert** to understand failures
- Use **Teacher** to learn why it failed

### Switching Prompts Mid-Conversation

You can switch prompts at any time:

```
[Start with Default]
"Create a React component for user login"

[Get basic component]

[Switch to Code Reviewer]
"Review the security of this component"

[Get security feedback]

[Switch to Teacher]
"Explain why these security measures are important"
```

## Practice Scenarios

### Scenario 1: Building a Feature

1. **Default**: "Create a REST API endpoint for user registration"
2. **Code Reviewer**: "@api.js Review this endpoint"
3. **Debugging Expert**: "It returns 500 errors, help debug"
4. **Teacher**: "Explain the security best practices used here"

### Scenario 2: Learning + Implementing

1. **Teacher**: "Explain React hooks"
2. **Default**: "Create a custom hook for API calls"
3. **Code Reviewer**: "Review my custom hook implementation"
4. **Debugging Expert**: "The hook causes infinite re-renders, why?"

## Advanced Tips

### Combining Prompts with File Context

```
[Code Reviewer prompt]
"Review @backend.js @frontend.js and check if they communicate correctly"
```

### Prompt + Checkpoint Workflow

1. Create checkpoint "Before review"
2. Switch to Code Reviewer
3. Get feedback
4. Implement changes
5. If issues, restore checkpoint

## What You've Learned

1. ✅ Four main prompt types and their purposes
2. ✅ When to use each prompt
3. ✅ How to switch prompts mid-conversation
4. ✅ Combining prompts for complex workflows
5. ✅ Comparing responses across prompts

## Next Steps

- **Tutorial:** [Checkpoints & Rollback](checkpoints-rollback-tutorial.md)
- **Tutorial:** [Advanced Features](advanced-features-tutorial.md)
- **Guide:** [Managing Prompts](../guides/adm/managing-prompts.md) (for admins)

## Quick Reference

```
General Questions → Default
Code Review → Code Reviewer
Learning → Teacher
Debugging → Debugging Expert
```
