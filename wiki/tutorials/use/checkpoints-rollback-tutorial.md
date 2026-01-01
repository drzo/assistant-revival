
# Tutorial: Safe Experimentation with Checkpoints

## Introduction

Learn to use checkpoints and rollback features to experiment fearlessly, protect your work, and recover from mistakes.

**Time Required:** 25 minutes  
**Prerequisites:** [Getting Started Tutorial](getting-started-tutorial.md)

## What You'll Build

In this tutorial, you'll:
- Refactor code with safety nets
- Experiment with different approaches
- Recover from breaking changes
- Build a checkpoint workflow

## Part 1: Your First Checkpoint (5 minutes)

### Step 1: Create Working Code

Upload `calculator.js`:
```javascript
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
```

### Step 2: Create Your First Checkpoint

1. Look for the **Checkpoints** section in sidebar
2. Click **Create Checkpoint**
3. Name it: `"Working calculator - basic operations"`
4. Click **Save**

**Success!** You've created a restore point.

### Step 3: Verify the Checkpoint

1. Check the checkpoints list
2. You should see your checkpoint with:
   - Name: "Working calculator - basic operations"
   - Timestamp
   - Files included: calculator.js

## Part 2: Safe Refactoring (7 minutes)

### Step 4: Make Changes

```
Ask: "@calculator.js Refactor this to use a Calculator class"
```

Apply the suggested changes. Your code might now look like:

```javascript
class Calculator {
  add(a, b) {
    return a + b;
  }
  
  subtract(a, b) {
    return a - b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3));
console.log(calc.subtract(10, 4));
```

### Step 5: Create Checkpoint After Refactor

```
Create checkpoint: "Calculator class refactor"
```

### Step 6: Break Something Intentionally

```
Ask: "Add multiplication and division methods"
```

Now **manually introduce a bug**:
```javascript
// In the Calculator class
multiply(a, b) {
  return a + b; // WRONG! Should be a * b
}
```

### Step 7: Test and Realize the Mistake

```
Ask: "Test the multiply function"
```

You'll notice it's broken!

### Step 8: Rollback to Previous Checkpoint

1. Open checkpoints panel
2. Find "Calculator class refactor"
3. Click **Restore**
4. Confirm the action

**Result:** Your code returns to the working state before the bug!

## Part 3: Comparing Approaches (8 minutes)

### Step 9: Approach 1 - Functional Style

Starting from your class-based calculator:

```
Create checkpoint: "Class-based approach"

Ask: "@calculator.js Convert this to functional programming style"
```

You'll get something like:

```javascript
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

export { add, subtract, multiply, divide };
```

### Step 10: Test Approach 1

```
Create checkpoint: "Functional approach"
```

### Step 11: Approach 2 - Module Pattern

```
Restore checkpoint: "Class-based approach"

Ask: "@calculator.js Use the module pattern instead"
```

You'll get:

```javascript
const Calculator = (() => {
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  
  return { add, subtract };
})();

console.log(Calculator.add(5, 3));
```

### Step 12: Create Checkpoint

```
Create checkpoint: "Module pattern approach"
```

### Step 13: Compare Approaches

Now you have three checkpoints to compare:
1. Class-based approach
2. Functional approach  
3. Module pattern approach

Restore each one and note the differences!

## Part 4: Real-World Workflow (5 minutes)

### Scenario: Adding a New Feature

**Current State:** Working calculator

**Task:** Add memory functions (store, recall, clear)

### Step 14: Checkpoint Before Feature

```
Create checkpoint: "Before memory feature"
```

### Step 15: Implement Feature

```
Ask: "Add memory functions: store current result, recall stored value, clear memory"
```

### Step 16: Test Implementation

If it works:
```
Create checkpoint: "Memory feature complete"
```

If it breaks:
```
Restore checkpoint: "Before memory feature"
Ask: "Add memory functions with better error handling"
```

### Step 17: Iterative Development

```
1. Checkpoint: "Memory feature v1"
2. Add error handling
3. Checkpoint: "Memory feature v2"
4. Add input validation
5. Checkpoint: "Memory feature v3 - production ready"
```

## Best Practices Learned

### Checkpoint Naming Convention

**Good Names:**
- ✅ "Login feature working - before styling"
- ✅ "Database schema v2 - tested"
- ✅ "Before API refactor"

**Poor Names:**
- ❌ "Checkpoint 1"
- ❌ "Backup"
- ❌ "Save"

### When to Create Checkpoints

**Always:**
- Before major refactoring
- After completing a feature
- Before experimental changes
- At end of work session

**Consider:**
- After fixing a bug
- Before applying AI suggestions
- When switching approaches

**Rarely:**
- During active debugging
- After every small change
- When nothing has changed

### Checkpoint Workflow Patterns

#### Pattern 1: Safety Net
```
1. Create checkpoint
2. Make risky change
3. Test
4. If success: Create new checkpoint
5. If failure: Restore previous
```

#### Pattern 2: Exploration
```
1. Create checkpoint "Baseline"
2. Try Approach A → Checkpoint "A"
3. Restore "Baseline"
4. Try Approach B → Checkpoint "B"
5. Compare and choose
```

#### Pattern 3: Incremental
```
1. Checkpoint "Feature start"
2. Build part 1 → Checkpoint "Part 1"
3. Build part 2 → Checkpoint "Part 2"
4. Build part 3 → Checkpoint "Complete"
```

## Advanced Techniques

### Checkpoint + Prompts

```
1. Checkpoint with Default prompt
2. Switch to Code Reviewer
3. Get feedback
4. If too complex: Restore checkpoint
5. Try different approach
```

### Checkpoint Before Large Changes

```
Before asking:
"@file1.js @file2.js @file3.js Refactor entire architecture"

Create checkpoint: "Before architecture refactor"
```

### Recovery Strategies

**Scenario:** Made changes 30 minutes ago, now broken

```
1. Check checkpoint list
2. Find last working checkpoint
3. Restore it
4. Re-implement changes more carefully
```

## Practice Exercises

### Exercise 1: Bug Fix Recovery

1. Create working code
2. Checkpoint "Working state"
3. Introduce a bug
4. Try to fix it (make it worse)
5. Restore checkpoint
6. Fix properly

### Exercise 2: Style Comparison

1. Create a React component
2. Checkpoint "Functional component"
3. Ask to convert to class component
4. Checkpoint "Class component"
5. Compare both approaches
6. Keep the better one

### Exercise 3: Safe Optimization

1. Working but slow code
2. Checkpoint "Before optimization"
3. Ask for performance improvements
4. Test performance
5. If slower: Restore
6. If faster: New checkpoint

## Troubleshooting

### Problem: Can't Find Checkpoint

**Solution:** Checkpoints are shown in reverse chronological order (newest first)

### Problem: Restore Doesn't Work

**Solution:** 
- Refresh the page
- Check if checkpoint still exists
- Ensure you confirmed the restore action

### Problem: Too Many Checkpoints

**Solution:**
- Delete old, unneeded checkpoints
- Keep only meaningful restore points
- Use descriptive names to identify keepers

## What You've Learned

1. ✅ Creating and naming checkpoints
2. ✅ Restoring previous states
3. ✅ Safe experimentation workflows
4. ✅ Comparing multiple approaches
5. ✅ Recovery from mistakes
6. ✅ Checkpoint best practices

## Next Steps

- **Tutorial:** [Advanced Features](advanced-features-tutorial.md)
- **Guide:** [Advanced Features Guide](../guides/use/advanced-features.md)
- **Tutorial:** [Code Review Workflow](code-review-tutorial.md)

## Quick Reference Card

```
Before Risky Change → Checkpoint
After Success → Checkpoint
Made Mistake → Restore
Comparing Options → Multiple Checkpoints
End of Session → Final Checkpoint
```
