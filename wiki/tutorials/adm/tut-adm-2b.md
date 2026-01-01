
# Tutorial: Training Users Effectively (Admin)

## Introduction

Learn proven strategies to train users on the Assistant Memorial Edition platform, from onboarding to advanced techniques.

**Time Required:** 45 minutes  
**Prerequisites:** Admin access, completed Managing Prompts tutorial  
**Audience:** Administrators, Trainers, Team Leads

## Part 1: Assessment & Planning (10 minutes)

### Exercise 1: Assess Your Users

Before training, understand your audience:

**Create User Profiles:**

```markdown
Profile 1: Junior Developer
- Experience: 0-2 years
- Needs: Step-by-step guidance, explanations
- Fears: Breaking things, looking inexperienced
- Goals: Learn while being productive

Profile 2: Senior Developer
- Experience: 5+ years
- Needs: Efficiency, advanced features
- Fears: Wasting time, wrong tool for job
- Goals: Speed up workflow, maintain quality

Profile 3: Non-Developer (PM/Designer)
- Experience: No coding
- Needs: Understanding code, communication
- Fears: Technical overwhelm
- Goals: Collaborate better with devs
```

### Exercise 2: Define Training Goals

For each profile, set clear objectives:

**Junior Developer Goals:**
- [ ] Can ask clear questions
- [ ] Understands file upload/mention
- [ ] Knows which prompt to use
- [ ] Creates checkpoints before changes
- [ ] Tests AI-generated code

**Senior Developer Goals:**
- [ ] Uses keyboard shortcuts
- [ ] Multi-file workflows
- [ ] Advanced prompting techniques
- [ ] Checkpoint strategies
- [ ] Can train others

## Part 2: Onboarding Session (10 minutes)

### Exercise 3: First 15-Minute Session

Run through this with a new user:

**Minutes 0-3: Welcome & Overview**

```
Script:
"Welcome to Assistant Memorial Edition! This is an AI coding 
assistant that helps you write, review, and debug code. 

Let me show you a quick example..."
```

**Demo:** Ask a simple question live.

**Minutes 3-7: Their First Question**

```
Guide them:
"Now you try. Ask: 'How do I create an array in JavaScript?'"

Watch them:
- Type the question
- Press Enter
- See the response
```

**Minutes 7-12: File Upload**

```
"Let's make it more useful. Upload this sample file..."

Provide: simple.js with a basic function

"Now ask: '@simple.js explain what this does'"

Watch: File mention, contextual response
```

**Minutes 12-15: Quick Wins**

```
"Ask it to improve the code"
"Create a checkpoint"
"Try a different prompt"

Build confidence with successes!
```

### Exercise 4: Create Onboarding Checklist

```markdown
New User Checklist:
- [ ] Account created and logged in
- [ ] Completed first chat interaction
- [ ] Uploaded and mentioned a file
- [ ] Switched between prompts
- [ ] Created first checkpoint
- [ ] Knows where to get help

Time: 15 minutes
Success Criteria: Can complete basic workflow independently
```

## Part 3: Skill-Building Workshops (15 minutes)

### Exercise 5: Workshop Series Design

**Week 1: Basics**

Session 1 - Chat Fundamentals (30 min)
```
- Asking clear questions
- Understanding responses
- Following up
- Practice: 5 question types
```

Session 2 - Files & Context (30 min)
```
- Upload methods
- @ mentions
- Multi-file context
- Practice: Debug with file context
```

**Week 2: Intermediate**

Session 3 - Prompts & Personas (45 min)
```
- Prompt selector
- When to switch
- Comparing responses
- Practice: Same question, different prompts
```

Session 4 - Checkpoints & Safety (45 min)
```
- Creating checkpoints
- Naming conventions
- Rollback workflow
- Practice: Safe experimentation
```

**Week 3: Advanced**

Session 5 - Multi-File Workflows (60 min)
```
- Complex codebases
- Cross-file analysis
- Architecture discussions
- Practice: Refactor across files
```

Session 6 - Power User Techniques (60 min)
```
- Keyboard shortcuts
- Advanced prompting
- Optimization strategies
- Practice: Complete feature development
```

### Exercise 6: Create Practice Scenarios

**Scenario 1: Bug Fix** (Beginner)
```
Provided Files: buggy-calculator.js

Task:
1. Upload the file
2. Ask assistant to find the bug
3. Understand the explanation
4. Apply the fix
5. Test the solution

Time: 10 minutes
Success: Bug identified and fixed
```

**Scenario 2: Code Review** (Intermediate)
```
Provided Files: user-auth.js

Task:
1. Upload file
2. Switch to Code Reviewer prompt
3. Request security review
4. Understand each issue
5. Fix critical problems
6. Create checkpoint

Time: 20 minutes
Success: All critical issues addressed
```

**Scenario 3: Feature Development** (Advanced)
```
Provided Files: app/ folder (multiple files)

Task:
1. Analyze existing structure
2. Plan new feature with assistant
3. Implement across multiple files
4. Review implementation
5. Debug any issues
6. Final checkpoint

Time: 45 minutes
Success: Working feature implemented
```

## Part 4: Handling Common Challenges (10 minutes)

### Exercise 7: Troubleshooting Guide

**Challenge 1: "It doesn't understand my question"**

```
Problem: Vague or ambiguous questions

Solution:
Before: "Fix my code"
After: "@app.js Line 42 throws TypeError, help me fix it"

Training: Show before/after examples
```

**Challenge 2: "The code doesn't work"**

```
Problem: Not testing AI suggestions

Solution:
1. Always review code before applying
2. Test in safe environment
3. Use checkpoints before major changes

Training: Emphasize verification workflow
```

**Challenge 3: "Too much information/Not enough"**

```
Problem: Wrong prompt for the task

Solution:
- Learning → Teacher prompt
- Quick answer → Default prompt
- Detailed review → Code Reviewer

Training: Prompt selection guide
```

**Challenge 4: "I broke everything"**

```
Problem: No checkpoints created

Solution:
1. Restore last checkpoint
2. Review what went wrong
3. Learn checkpoint habits

Training: Checkpoint best practices
```

### Exercise 8: Create FAQ Document

```markdown
# Frequently Asked Questions

## Getting Started
Q: How do I upload a file?
A: Click Upload button or drag file into sidebar

Q: What does @ do?
A: References a file in your question for context

## Features
Q: Which prompt should I use?
A: [Decision tree diagram]

Q: How do checkpoints work?
A: [Step-by-step guide with screenshots]

## Troubleshooting
Q: My file won't upload
A: [Checklist of common issues]

Q: The assistant seems confused
A: [Tips for better questions]
```

## Part 5: Measuring Success (5 minutes)

### Exercise 9: Define Success Metrics

**Quantitative Metrics:**
```
- Active users per week
- Average session duration
- Features used (checkpoints, prompts, etc.)
- Questions asked per session
- Checkpoint creation frequency
```

**Qualitative Metrics:**
```
- User satisfaction scores
- Confidence level self-assessment
- Feature usefulness ratings
- Open-ended feedback
```

### Exercise 10: Create Assessment

**Basic Level Test:**
```
Task: Upload a file and ask the assistant to explain it
Time: 5 minutes
Pass: Completes independently

Task: Create a checkpoint and restore it
Time: 5 minutes
Pass: Successful restoration
```

**Intermediate Level Test:**
```
Task: Use Code Reviewer to find 3 issues in provided code
Time: 15 minutes
Pass: Identifies issues and applies fixes

Task: Switch between 3 prompts and compare responses
Time: 10 minutes
Pass: Explains differences
```

**Advanced Level Test:**
```
Task: Refactor multi-file project with checkpoints
Time: 30 minutes
Pass: Working refactor with proper checkpoint trail

Task: Teach a basic concept to another user
Time: 15 minutes
Pass: Clear explanation, user succeeds
```

## Training Resources to Create

### 1. Quick Start Guide (1-page PDF)
```
- 5-step getting started
- Essential keyboard shortcuts
- Common questions examples
- Where to get help
```

### 2. Video Series
```
- "Your First Question" (3 min)
- "Working with Files" (4 min)
- "Choosing Prompts" (5 min)
- "Checkpoints Explained" (6 min)
- "Advanced Techniques" (10 min)
```

### 3. Interactive Tutorials
```
- Guided first session
- Checkpoint practice
- Multi-file workflow
- Prompt comparison
```

### 4. Cheat Sheets
```
- Keyboard shortcuts card
- Prompt selection flowchart
- File mention guide
- Checkpoint best practices
```

## What You've Learned

1. ✅ User assessment and profiling
2. ✅ Effective onboarding process
3. ✅ Workshop structure and content
4. ✅ Common challenges and solutions
5. ✅ Success measurement
6. ✅ Resource creation strategy

## Next Steps

- **Guide:** [Managing Prompts](../../guides/adm/managing-prompts.md)
- **Tutorial:** [Extending Features](../dev/extending-features-tutorial.md)
- **Reference:** [Architecture Guide](../../guides/dev/architecture.md)

## Training Session Template

```markdown
# Session: [Topic]

**Duration:** [X minutes]
**Level:** Beginner/Intermediate/Advanced
**Prerequisites:** [List]

## Objectives
- [ ] Objective 1
- [ ] Objective 2

## Materials Needed
- Sample files
- Presentation slides
- Handouts

## Session Outline
1. Introduction (X min)
2. Demonstration (X min)
3. Hands-on Practice (X min)
4. Q&A (X min)

## Practice Exercise
[Detailed instructions]

## Assessment
[How to verify learning]

## Follow-up
[Next steps for participants]
```
