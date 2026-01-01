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
# Tutorial: Mastering Assistant Prompts

  

## Introduction

  

Learn how to use different assistant prompts to get the best results for different tasks. Prompts are like personalities - each one is optimized for specific scenarios.

  

\*\*Time Required:\*\* 20 minutes

\*\*Prerequisites:\*\* Complete \[Getting Started Tutorial\](getting-started-tutorial.md)

  

## Understanding Prompts

  

### What Are Prompts?

  

Prompts define:

\- \*\*Expertise level\*\* - General vs. specialized knowledge

\- \*\*Communication style\*\* - Technical vs. beginner-friendly

\- \*\*Focus areas\*\* - Code quality, education, debugging, etc.

  

### Available Prompts

  

1. \*\*Default Assistant\*\* - General-purpose helper

2. \*\*Code Reviewer\*\* - Quality and best practices

3. \*\*Teacher\*\* - Educational explanations

4. \*\*Debugging Expert\*\* - Problem-solving focus

  

## Part 1: Default Assistant (5 minutes)

  

### When to Use

\- General coding questions

\- Quick answers

\- Balanced help

  

### Exercise 1: General Question

  

\`\`\`

\[Select: Default prompt from dropdown\]

  

Ask: "How do I read a JSON file in Python?"

\`\`\`

  

\*\*Expected Result:\*\* Clear, straightforward answer with code example.

  

### Exercise 2: Code Generation

  

\`\`\`

Ask: "Create a function that validates email addresses"

\`\`\`

  

\*\*Notice:\*\* Code-focused response with practical examples.

  

## Part 2: Code Reviewer (5 minutes)

  

### When to Use

\- Before committing code

\- Quality assurance

\- Learning best practices

  

### Exercise 3: Upload Code for Review

  

Create \`user-auth.js\`:

\`\`\`javascript

function login(username, password) {

if (username \== "admin" && password \== "password123") {

return true;

}

return false;

}

\`\`\`

  

\`\`\`

\[Switch to: Code Reviewer prompt\]

  

Ask: "@user-auth.js Please review this authentication code"

\`\`\`

  

\*\*Expected Feedback:\*\*

\- Security issues (hardcoded credentials, == vs ===)

\- Missing validation

\- No error handling

\- Suggests improvements

  

### Exercise 4: Iterate on Feedback

  

\`\`\`

Ask: "How should I fix the security issues you mentioned?"