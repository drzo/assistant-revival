---
title: "Assistant Revival"
source: "https://replit.com/t/unicorn/repls/Assistant-Revival"
author:
  - "[[replit]]"
published:
created: 2025-12-31
description: "Build and deploy software collaboratively with the power of AI without spending a second on setup."
tags:
  - "clippings"
---
# Tutorial: Safe Experimentation with Checkpoints

  

## Introduction

  

Learn to use checkpoints and rollback features to experiment fearlessly, protect your work, and recover from mistakes.

  

\*\*Time Required:\*\* 25 minutes

\*\*Prerequisites:\*\* \[Getting Started Tutorial\](getting-started-tutorial.md)

  

## What You'll Build

  

In this tutorial, you'll:

\- Refactor code with safety nets

\- Experiment with different approaches

\- Recover from breaking changes

\- Build a checkpoint workflow

  

## Part 1: Your First Checkpoint (5 minutes)

  

### Step 1: Create Working Code

  

Upload \`calculator.js\`:

\`\`\`javascript

function add(a, b) {

return a + b;

}

  

function subtract(a, b) {

return a \- b;

}

  

console.log(add(5, 3)); // 8

console.log(subtract(10, 4)); // 6

\`\`\`

  

### Step 2: Create Your First Checkpoint

  

1. Look for the \*\*Checkpoints\*\* section in sidebar

2. Click \*\*Create Checkpoint\*\*

3. Name it: \`"Working calculator - basic operations"\`

4. Click \*\*Save\*\*

  

\*\*Success!\*\* You've created a restore point.

  

### Step 3: Verify the Checkpoint

  

1. Check the checkpoints list

2. You should see your checkpoint with:

\- Name: "Working calculator - basic operations"

\- Timestamp

\- Files included: calculator.js

  

## Part 2: Safe Refactoring (7 minutes)

  

### Step 4: Make Changes

  

\`\`\`

Ask: "@calculator.js Refactor this to use a Calculator class"

\`\`\`

  

Apply the suggested changes. Your code might now look like:

  

\`\`\`javascript

class Calculator {

add(a, b) {

return a + b;

}

subtract(a, b) {

return a \- b;

}

}

  

const calc \= new Calculator();

console.log(calc.add(5, 3));

console.log(calc.subtract(10, 4));

\`\`\`

  

### Step 5: Create Checkpoint After Refactor

  

\`\`\`