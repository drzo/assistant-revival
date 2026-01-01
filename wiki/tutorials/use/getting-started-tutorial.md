
# Tutorial: Getting Started with Assistant Memorial Edition

## Introduction

Welcome to the Assistant Memorial Edition! This tutorial will walk you through your first session with the AI-powered coding assistant, from basic chat to working with files.

**Time Required:** 15-20 minutes  
**Prerequisites:** None - this is for complete beginners!

## Part 1: Your First Conversation (5 minutes)

### Step 1: Starting the Application

1. The application should already be running in your browser
2. You'll see a chat interface with an input box at the bottom
3. The sidebar on the left shows navigation and file management

### Step 2: Asking Your First Question

Let's start with a simple programming question:

```
Type: "What is the difference between let and const in JavaScript?"
Press: Enter or click Send
```

**What happens:**
- Your message appears on the right side
- The assistant's response streams in on the left
- Code examples appear with syntax highlighting

### Step 3: Follow-Up Questions

The assistant remembers context, so ask a follow-up:

```
Type: "Can you show me an example where const would cause an error?"
```

**Notice how** the assistant builds on the previous conversation!

## Part 2: Working with Files (5 minutes)

### Step 4: Upload Your First File

1. Look for the **Upload** button in the sidebar
2. Click it and select a code file (or create a simple `test.js` file with this content):

```javascript
function greet(name) {
  return "Hello " + name;
}

console.log(greet("World"));
```

3. The file appears in the sidebar as a card

### Step 5: Ask About Your File

Now reference your file using the `@` symbol:

```
Type: "@test.js Can you explain what this function does?"
```

**Key Concept:** The `@` symbol tells the assistant to look at specific files!

### Step 6: Get Code Suggestions

```
Type: "@test.js Refactor this to use template literals and arrow functions"
```

Watch as the assistant provides modernized code:

```javascript
const greet = (name) => `Hello ${name}`;

console.log(greet("World"));
```

## Part 3: Multiple Files (5 minutes)

### Step 7: Upload Related Files

Create and upload two more files:

**math.js:**
```javascript
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}
```

**app.js:**
```javascript
const result1 = add(5, 3);
const result2 = multiply(4, 7);
console.log(result1, result2);
```

### Step 8: Multi-File Question

```
Type: "@app.js @math.js Why isn't this code working?"
```

The assistant will notice that `add` and `multiply` aren't imported/exported!

### Step 9: Get a Complete Solution

```
Type: "How do I fix this using ES6 modules?"
```

## Part 4: Practice Exercises

### Exercise 1: Code Review
Upload a file with intentional mistakes and ask:
```
"@myfile.js Please review this code for bugs and improvements"
```

### Exercise 2: Learning
```
"Explain how async/await works in JavaScript with examples"
```

### Exercise 3: Debugging
Paste an error message:
```
"I'm getting this error: 'TypeError: Cannot read property 'map' of undefined'. What does it mean?"
```

## Tips for Success

### Do's ✅
- Be specific in your questions
- Upload relevant files before asking about them
- Use `@filename` to reference files
- Ask follow-up questions to refine answers
- Experiment with different prompts

### Don'ts ❌
- Don't ask vague questions like "fix my code"
- Don't forget to mention which file you're asking about
- Don't copy code without understanding it
- Don't upload unrelated files

## What You've Learned

1. ✅ How to start a conversation with the assistant
2. ✅ How to upload and reference files with `@`
3. ✅ How to ask follow-up questions
4. ✅ How to get code reviews and suggestions
5. ✅ How to work with multiple files

## Next Steps

- **Tutorial:** [Using Assistant Prompts](assistant-prompts-tutorial.md) - Learn to customize assistant behavior
- **Tutorial:** [Checkpoints & Rollback](checkpoints-rollback-tutorial.md) - Save your progress safely
- **Guide:** [Advanced Features](../guides/use/advanced-features.md) - Power user techniques

## Common Questions

**Q: How do I delete a file from the sidebar?**  
A: Click the X button on the file card.

**Q: Can I upload folders?**  
A: Yes! Drag a folder into the sidebar to upload all files.

**Q: Does the assistant remember previous conversations?**  
A: Yes, within the same session. The conversation history is maintained.

**Q: What file types are supported?**  
A: Most code files (.js, .py, .java, .cpp, .html, .css, etc.)

## Troubleshooting

**Problem:** Assistant doesn't see my file  
**Solution:** Make sure you used `@` before the filename

**Problem:** Response is too technical  
**Solution:** Ask "Explain that in simpler terms" or switch to Teacher prompt

**Problem:** Code doesn't work  
**Solution:** Always test code before using it in production
