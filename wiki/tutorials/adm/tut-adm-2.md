
# Tutorial: Training Users on Assistant Memorial Edition

## Introduction

Learn effective strategies to train users of all skill levels on the Assistant Memorial Edition platform.

**Time Required:** 45-60 minutes  
**Prerequisites:** Admin/trainer access, familiarity with all features  
**Target Audience:** Trainers, Team Leads, HR/Learning & Development

## Part 1: Preparing for Training (10 minutes)

### Understanding Your Audience

**Exercise 1: User Assessment**

Categorize your users:

```
Beginners:
- Little to no AI assistant experience
- Basic programming knowledge
- Need hand-holding

Intermediate:
- Some AI tool experience
- Comfortable with IDEs
- Need feature overview

Advanced:
- Power users
- Want efficiency tips
- Need advanced workflows
```

### Setting Up Training Materials

**Step 1: Create Sample Files**

Prepare demonstration files:

**sample.js** (with intentional issues):
```javascript
function login(user, pass) {
  if (user == "admin" && pass == "password") {
    return true;
  }
  return false;
}

var users = [];

function addUser(name) {
  users.push(name);
  console.log(users);
}
```

**Step 2: Prepare Checkpoints**

Create checkpoints for demonstrations:
```
1. "Clean starting point"
2. "After refactoring"
3. "With bug introduced"
4. "Bug fixed"
```

**Step 3: Set Up Environment**

```
1. Clear previous conversations
2. Load sample files
3. Set Default prompt
4. Have extra browser tab ready
```

## Part 2: Beginner Training Session (15 minutes)

### Session Structure

**Introduction (3 minutes)**

```
"Welcome to Assistant Memorial Edition!

This is an AI coding assistant that helps you:
- Understand code
- Fix bugs
- Learn programming concepts
- Get code suggestions

Today you'll learn to:
1. Ask questions
2. Upload files
3. Get help with code"
```

**Demo 1: First Question (5 minutes)**

Live demonstration:

```
Instructor: "Let's ask a simple question"

Type: "What's the difference between let and const in JavaScript?"

[Show response streaming]

Explain:
- Response appears on left
- Your question on right
- Code examples are highlighted
- You can copy code blocks
```

**Demo 2: Working with Files (7 minutes)**

Step-by-step:

```
1. "Let's upload a file"
   - Click Upload button
   - Select sample.js
   - File appears in sidebar

2. "Now let's ask about it"
   Type: "@sample.js What does this code do?"
   
   Explain:
   - @ symbol references files
   - AI reads the file content
   - Gives context-aware answers

3. "Let's find issues"
   Type: "@sample.js Are there any problems with this code?"
   
   Point out:
   - Security issues found
   - Best practice violations
   - Helpful suggestions
```

**Hands-On Practice (remainder)**

Give trainees tasks:

```
Task 1: Upload your own file
Task 2: Ask what it does
Task 3: Ask for improvements

Circulate and help!
```

## Part 3: Intermediate Training Session (12 minutes)

### Session Structure

**Introduction (2 minutes)**

```
"Now that you know the basics, let's learn:
- Assistant Prompts
- Checkpoints for safety
- Multi-file workflows"
```

**Demo 3: Assistant Prompts (5 minutes)**

Live demonstration:

```
"Prompts customize the AI's behavior"

1. Show dropdown: "See these different prompts?"

2. Ask with Default:
   "@sample.js Review this code"
   
3. Switch to Code Reviewer:
   "@sample.js Review this code"
   
Compare responses:
   - Default: General feedback
   - Code Reviewer: Detailed, best practices focus
   
"Choose the right tool for the job!"

When to use each:
- Default → General questions
- Code Reviewer → Before committing
- Teacher → Learning concepts
- Debugging Expert → When stuck
```

**Demo 4: Checkpoints (5 minutes)**

Safety net demonstration:

```
1. "Create a checkpoint before changes"
   - Click "Create Checkpoint"
   - Name: "Before refactoring"
   
2. "Make changes"
   Ask: "@sample.js Refactor to use modern JavaScript"
   Apply changes
   
3. "Oops, let's break something"
   Manually introduce a bug
   
4. "Restore the checkpoint!"
   - Open checkpoints panel
   - Click "Restore" on "Before refactoring"
   - Code returns to working state
   
Key lesson: "Checkpoints = save points in video games"
```

**Practice Exercise**

```
Task: Safe Experimentation

1. Create checkpoint "Starting point"
2. Ask AI to modify your code
3. Test the changes
4. If bad → Restore checkpoint
5. If good → Create new checkpoint

Time: 5 minutes
```

## Part 4: Advanced Training Session (10 minutes)

### Power User Techniques

**Demo 5: Multi-File Workflows**

Advanced demonstration:

```
Setup: Upload related files
- api.js
- database.js  
- frontend.js

Show: "@api.js @database.js @frontend.js 
       How do these files work together?"

Explain:
"AI sees all mentioned files and analyzes their relationships"

Advanced question:
"How should I refactor this to separate concerns better?"
```

**Demo 6: Debugging Workflow**

Systematic approach:

```
1. Switch to Debugging Expert prompt

2. "Provide context-rich questions"
   
   Bad: "It's broken"
   
   Good: "@api.js The /users endpoint returns 500 errors.
          Error: TypeError: Cannot read property 'map' of undefined
          This happens when the database is empty.
          How do I fix this?"

3. "Follow AI's debugging steps"
   
4. "Understand the solution, don't just copy"
```

**Advanced Patterns**

Share workflow patterns:

```
Pattern 1: The Review Pipeline
1. Write code (Default prompt)
2. Create checkpoint
3. Switch to Code Reviewer
4. Apply suggestions
5. Checkpoint "Reviewed version"

Pattern 2: Learning Loop
1. Teacher: Learn concept
2. Default: Implement it
3. Code Reviewer: Get feedback
4. Teacher: Understand mistakes
5. Repeat

Pattern 3: Debugging Protocol
1. Debugging Expert: Analyze error
2. Default: Implement fix
3. Code Reviewer: Verify solution
4. Test thoroughly
```

## Part 5: Hands-On Workshop (8 minutes)

### Group Exercise: Build a Feature

**Scenario:** Add input validation to a login form

**Groups of 2-3:**

```
1. Assign roles:
   - Driver (types)
   - Navigator (guides)
   - Recorder (takes notes)

2. Task breakdown:
   - Upload login form code
   - Ask for validation requirements
   - Implement validation
   - Review for security
   - Test edge cases

3. Use checkpoints at each step

4. Present solutions (2 min per group)
```

**Debrief:**

```
Questions:
- What prompts did you use?
- Did you create checkpoints?
- What worked well?
- What was challenging?
- What would you do differently?
```

## Part 6: Common Pitfalls & Solutions (5 minutes)

### Issue 1: Vague Questions

**Example of Poor Question:**
```
❌ "Fix my code"
```

**Improved Version:**
```
✅ "@login.js The password validation isn't working.
    It should require 8+ characters but accepts shorter passwords.
    How do I fix this?"
```

**Training Tip:**
```
Template for good questions:
1. Which file? → Use @
2. What's wrong? → Be specific
3. What should happen? → Expected behavior
4. What's happening? → Actual behavior
```

### Issue 2: Not Using Checkpoints

**Problem:**
Users make changes without safety nets

**Solution:**
```
Create "Checkpoint Before Everything" habit:

Before:
- Major refactoring
- Trying new approaches
- Applying AI suggestions
- Ending work session

Show this workflow in training repeatedly!
```

### Issue 3: Wrong Prompt Selection

**Common Mistake:**
Using Default for everything

**Training Exercise:**
```
Match the prompt to the task:

1. Learning how promises work → ?
2. Reviewing code before commit → ?
3. App crashes with error → ?
4. Quick code question → ?

Answers:
1. Teacher
2. Code Reviewer
3. Debugging Expert
4. Default
```

## Training Resources Checklist

### Before Training

- [ ] Sample code files prepared
- [ ] Checkpoints created
- [ ] Prompts tested
- [ ] Browser tabs ready
- [ ] Handouts printed
- [ ] Practice exercises ready

### During Training

- [ ] Welcome and introductions
- [ ] Set expectations
- [ ] Live demonstrations
- [ ] Hands-on practice
- [ ] Q&A time
- [ ] Feedback collection

### After Training

- [ ] Share recordings (if applicable)
- [ ] Distribute reference materials
- [ ] Send follow-up resources
- [ ] Schedule office hours
- [ ] Create feedback survey

## Assessment Methods

### Knowledge Check

Quick quiz after training:

```
1. How do you reference a file in your question?
   Answer: Use @ symbol before filename

2. Which prompt is best for learning?
   Answer: Teacher

3. What's a checkpoint?
   Answer: A save point for your code/conversation

4. When should you create checkpoints?
   Answer: Before major changes, after working states

5. Name three assistant prompts
   Answer: Default, Code Reviewer, Teacher, Debugging Expert
```

### Practical Assessment

Observe trainees:

```
Can they:
- [ ] Upload a file
- [ ] Use @ to mention files
- [ ] Switch prompts appropriately
- [ ] Create and restore checkpoints
- [ ] Ask clear, specific questions
- [ ] Apply code suggestions safely
```

## Ongoing Support Plan

### Week 1: Hand-Holding

```
- Daily check-ins
- Quick help sessions
- Answer all questions
- Share tips in chat
```

### Week 2-4: Guided Practice

```
- Weekly office hours
- Share best practices
- Collect feedback
- Create FAQ document
```

### Month 2+: Independence

```
- Monthly tips newsletter
- Advanced workshops
- Peer mentoring program
- Success stories sharing
```

## Creating Training Materials

### Quick Reference Card

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━
ASSISTANT QUICK START
━━━━━━━━━━━━━━━━━━━━━━━━━

📤 Upload Files
   Click Upload or drag & drop

🔍 Reference Files
   Type @ before filename

🎭 Change Behavior
   Select prompt from dropdown

💾 Save Progress
   Create Checkpoint

⏮️ Undo Changes
   Restore Checkpoint

⌨️ Shortcuts
   Cmd/Ctrl + Enter → Send
   Cmd/Ctrl + K → Focus input

━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Video Script Template

```
[0:00-0:30] Introduction
- What is this tool?
- What you'll learn

[0:30-2:00] Basic Features
- Uploading files
- Asking questions
- Reading responses

[2:00-4:00] File Mentions
- Using @ symbol
- Why it matters
- Demo example

[4:00-5:30] Wrap-up
- Key takeaways
- Next steps
- Resources
```

## What You've Learned

1. ✅ Assessing user skill levels
2. ✅ Preparing training materials
3. ✅ Delivering beginner training
4. ✅ Teaching intermediate concepts
5. ✅ Advanced power user techniques
6. ✅ Handling common issues
7. ✅ Creating ongoing support

## Next Steps

- **Customize:** Adapt training to your organization
- **Pilot:** Run training with small group
- **Iterate:** Improve based on feedback
- **Scale:** Train more users
- **Support:** Establish ongoing help resources

## Resources

- [Managing Prompts Tutorial](managing-prompts-tutorial.md)
- [User Training Guide](../../guides/adm/user-training.md)
- [Getting Started Guide](../../guides/use/getting-started.md)
- [All User Tutorials](../use/)
