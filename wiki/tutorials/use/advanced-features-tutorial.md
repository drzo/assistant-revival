
# Tutorial: Advanced Features & Power User Techniques

## Introduction

Master advanced features to become highly productive with the Assistant Memorial Edition.

**Time Required:** 30-40 minutes  
**Prerequisites:** All basic tutorials completed

## Part 1: Multi-File Workflows (10 minutes)

### Project Setup

Create a small full-stack project:

**backend/api.js:**
```javascript
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  // TODO: Implement
});

module.exports = app;
```

**backend/database.js:**
```javascript
const users = [];

function getUsers() {
  return users;
}

module.exports = { getUsers };
```

**frontend/app.js:**
```javascript
async function loadUsers() {
  // TODO: Fetch from API
}
```

### Exercise 1: Cross-File Analysis

```
Ask: "@backend/api.js @backend/database.js @frontend/app.js 
Analyze this project structure and identify missing pieces"
```

**Expected Response:**
- API endpoint not implemented
- No connection between API and database
- Frontend fetch not implemented
- Missing error handling
- No CORS configuration

### Exercise 2: Coordinated Changes

```
Ask: "Implement the complete user listing feature across all three files"
```

Watch as the assistant provides coordinated changes for each file!

### Exercise 3: Architecture Discussion

```
Ask: "@backend/api.js @backend/database.js 
Should I separate routes and controllers? Show me how."
```

## Part 2: Efficient Prompting (8 minutes)

### The Focused Question Technique

**Bad:**
```
"Fix my code"
```

**Good:**
```
"@api.js The /users endpoint returns 500 errors when the database is empty. 
How should I handle this edge case?"
```

### Exercise 4: Specificity Ladder

Try progressively specific questions:

**Level 1 - Vague:**
```
"How do I use React?"
```

**Level 2 - Better:**
```
"How do I create a React component?"
```

**Level 3 - Specific:**
```
"How do I create a React functional component with useState hook 
that toggles a boolean value?"
```

**Level 4 - Contextual:**
```
"@components/Toggle.js This component should toggle visibility 
of a sidebar using React hooks. What's the best approach?"
```

### The Context Stack Method

```
1. Upload all relevant files
2. Ask high-level question
3. Narrow down based on response
4. Get specific implementation
5. Request refinements
```

Example:
```
"@app.js @utils.js @config.js My app is slow when loading users"
→ Response identifies database query issue
"Show me how to optimize the database queries in @utils.js"
→ Response provides optimized queries
"Add caching to prevent repeated queries"
→ Response adds caching layer
```

## Part 3: Code Review Mastery (10 minutes)

### Exercise 5: Comprehensive Review

Create `user-service.js`:
```javascript
function createUser(data) {
  const user = {
    id: Math.random(),
    name: data.name,
    email: data.email,
    password: data.password,
    createdAt: new Date()
  };
  users.push(user);
  return user;
}
```

```
[Switch to Code Reviewer prompt]

Ask: "@user-service.js Perform a comprehensive security and quality review"
```

### Exercise 6: Iterative Improvement

```
Step 1: Get initial feedback
Step 2: "How do I fix the security issues?"
Step 3: Apply changes
Step 4: "Review again"
Step 5: Repeat until no critical issues
```

### Exercise 7: Pre-Commit Checklist

```
Before every commit:

1. Create checkpoint
2. Switch to Code Reviewer prompt
3. "@changed-file.js Final review before commit"
4. Address all "Critical" and "High" issues
5. Consider "Medium" suggestions
6. Create checkpoint "Ready for commit"
```

## Part 4: Debugging Workflows (8 minutes)

### The Systematic Debugging Approach

```
[Switch to Debugging Expert prompt]
```

### Exercise 8: Stack Trace Analysis

```
Ask: "I'm getting this error:

TypeError: Cannot read property 'map' of undefined
  at UserList.render (App.js:42)
  at React.Component.render (react-dom.js:1234)
  
@App.js What's wrong?"
```

### Exercise 9: Production Bug Investigation

```
Scenario: "The app works in development but fails in production"

Ask: "@app.js @config.js The app works locally but returns 
500 errors in production. How do I debug this?"
```

### The Debugging Ladder

```
Level 1: Describe symptoms
Level 2: Share error messages  
Level 3: Provide stack trace
Level 4: Include relevant code files
Level 5: Show what you've tried
```

## Part 5: Learning Workflows (6 minutes)

### Exercise 10: Deep Learning Session

```
[Switch to Teacher prompt]

1. "Explain JavaScript promises"
2. "Show me examples of common mistakes"
3. "How do promises compare to async/await?"
4. "Give me practice exercises"
5. Implement exercises
6. Ask for feedback on your implementations
```

### The Concept → Practice → Review Loop

```
1. Teacher: Learn concept
2. Default: Implement it
3. Code Reviewer: Get feedback
4. Teacher: Understand mistakes
5. Repeat
```

## Advanced Patterns

### Pattern 1: The Refactoring Pipeline

```
1. Checkpoint "Before refactor"
2. Code Reviewer: "Identify code smells in @old-code.js"
3. Default: "Refactor based on the suggestions"
4. Code Reviewer: "Review the refactored code"
5. Debugging Expert: "Are there any potential breaking changes?"
6. If safe → Checkpoint "After refactor"
7. If issues → Restore and try different approach
```

### Pattern 2: Feature Development Cycle

```
1. Teacher: "Explain best practices for [feature]"
2. Default: "Implement [feature] in @file.js"
3. Checkpoint: "Feature implementation v1"
4. Code Reviewer: "Review the implementation"
5. Default: Apply suggestions
6. Debugging Expert: "What could go wrong?"
7. Default: Add error handling
8. Checkpoint: "Feature complete"
```

### Pattern 3: Performance Optimization

```
1. Default: "Profile @slow-component.js"
2. Debugging Expert: "Identify performance bottlenecks"
3. Default: "Optimize the bottlenecks"
4. Checkpoint: "After optimization"
5. Test: Measure improvements
6. If worse → Restore checkpoint
7. If better → Keep changes
```

## Keyboard Efficiency

### Essential Shortcuts

```
Cmd/Ctrl + Enter → Send message
Cmd/Ctrl + K → Focus input
@ → Trigger file mention
Esc → Cancel/close
```

### Rapid File Mention Workflow

```
1. Type @
2. Start typing filename
3. Arrow keys to select
4. Enter to confirm
5. Continue question
```

## Multi-Session Strategies

### End-of-Session Routine

```
1. Create checkpoint "End of session [date]"
2. Note what you were working on in chat
3. Ask: "Summarize what we accomplished today"
4. Save the summary for next session
```

### Start-of-Session Routine

```
1. Review last session's summary
2. Restore last checkpoint if needed
3. Ask: "Based on our last conversation, what should we work on next?"
```

## Expert Tips

### Tip 1: Context Management

```
Don't upload everything → Upload what's relevant
Remove unused files → Keep sidebar clean
Group related questions → More coherent context
```

### Tip 2: Prompt Switching Strategy

```
Exploration → Default or Teacher
Implementation → Default
Quality Check → Code Reviewer
Problems → Debugging Expert
```

### Tip 3: The Two-Checkpoint Rule

```
Always have:
1. "Last known working state"
2. "Current experimental state"

This gives you safe rollback + progress tracking
```

### Tip 4: Iterative Refinement

```
Don't expect perfect first response
Ask follow-ups to refine
Build on previous answers
Clarify ambiguities
```

## Practice Projects

### Project 1: Build a Todo App

```
1. Use Teacher to learn best practices
2. Use Default to implement
3. Use Code Reviewer before each feature completion
4. Use Debugging Expert when stuck
5. Create checkpoints at each milestone
```

### Project 2: Refactor Legacy Code

```
1. Upload old code
2. Code Reviewer: Identify issues
3. Create checkpoint "Before refactor"
4. Default: Implement changes incrementally
5. Code Reviewer: Review after each change
6. Checkpoint at each successful step
```

### Project 3: Add Authentication

```
1. Teacher: Learn auth best practices
2. Default: Implement basic auth
3. Code Reviewer: Security review
4. Debugging Expert: Test failure scenarios
5. Default: Add improvements
6. Final Code Reviewer check
```

## What You've Learned

1. ✅ Multi-file workflow coordination
2. ✅ Advanced prompting techniques
3. ✅ Code review mastery
4. ✅ Systematic debugging
5. ✅ Learning workflows
6. ✅ Keyboard efficiency
7. ✅ Multi-session strategies
8. ✅ Expert patterns

## Next Steps

- **Admin Tutorial:** [Managing Prompts](../adm/managing-prompts-tutorial.md)
- **Dev Tutorial:** [Extending Features](../dev/extending-features-tutorial.md)
- **Guide:** [Contributing](../../guides/dev/contributing.md)
