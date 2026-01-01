
# Tutorial: Training Users on the Assistant (Admins)

## Introduction

Learn how to effectively train users on the Assistant Memorial Edition, from onboarding beginners to empowering advanced users.

**Time Required:** 45 minutes (to complete tutorial) + ongoing training time  
**Prerequisites:** Admin access, familiarity with all features  
**Audience:** Admins, Trainers, Team Leads

## What You'll Learn

1. ✅ Structuring training programs
2. ✅ Creating training materials
3. ✅ Running effective workshops
4. ✅ Assessing user competency
5. ✅ Providing ongoing support

## Part 1: Planning Your Training Program (10 minutes)

### Assess Your Audience

**Questions to Answer:**
- What's their coding experience level?
- Have they used AI assistants before?
- What are their primary use cases?
- How much time can they dedicate to training?

### Define Learning Objectives

**Beginner Level (Week 1-2):**
- [ ] Navigate the interface
- [ ] Send messages and get responses
- [ ] Upload and reference files
- [ ] Select appropriate prompts

**Intermediate Level (Week 3-4):**
- [ ] Use checkpoints effectively
- [ ] Conduct code reviews
- [ ] Debug systematically
- [ ] Manage multi-file projects

**Advanced Level (Week 5+):**
- [ ] Optimize workflows
- [ ] Apply advanced patterns
- [ ] Train others
- [ ] Create custom processes

### Create a Timeline

**Week 1: Basics**
- Day 1: Platform tour & first questions
- Day 2: File management
- Day 3: Assistant prompts
- Day 4: Practice exercises
- Day 5: Review & Q&A

**Week 2: Building Skills**
- Day 1: Checkpoints introduction
- Day 2: Code review workflow
- Day 3: Debugging techniques
- Day 4: Real project work
- Day 5: Assessment

## Part 2: Creating Training Materials (10 minutes)

### Quick Start Guide

Create a 1-page PDF:

```markdown
# Quick Start Guide

## 1. Ask a Question
Type your question and press Enter
Example: "How do I read a JSON file in Python?"

## 2. Upload Files
Click 📎 or drag files into chat
Reference with @filename

## 3. Choose Your Assistant
Click dropdown to select:
- Default: General help
- Code Reviewer: Quality checks
- Teacher: Learning focus
- Debugging: Problem solving

## 4. Create Checkpoints
Save your progress:
Settings → Create Checkpoint

## Tips
- Be specific in questions
- Include file context
- Use checkpoints before big changes
- Try different prompts
```

### Video Script: "Your First 5 Minutes"

**Script:**
```
[0:00] Welcome! Let's get started.

[0:10] This is the chat interface. Type any coding question here.

[0:20] Let me ask: "What is a React hook?"

[0:30] See how the AI responds? It explains concepts clearly.

[0:45] Now let's upload a file. Click the paperclip icon.

[1:00] I'll upload example.js. Now I can reference it.

[1:15] Watch: "@example.js explain this function"

[1:30] The AI analyzes my specific code!

[1:45] Try different assistants using this dropdown.

[2:00] Each one has different expertise.

[2:15] That's it! Start asking questions and exploring.

[END]
```

### Exercise Workbook

**Exercise 1: First Question**
```
Task: Ask the assistant to explain a programming concept

Steps:
1. Think of a concept you're unsure about
2. Type your question clearly
3. Read the response
4. Ask a follow-up question

Example:
Q: "What are JavaScript promises?"
Q: "Show me an example with error handling"
```

**Exercise 2: File Upload**
```
Task: Upload code and get feedback

Steps:
1. Find a code file on your computer
2. Upload it using the 📎 button
3. Ask: "@yourfile.js review this code"
4. Read the suggestions

Practice:
- Upload 3 different file types
- Reference each in questions
- Remove one, upload again
```

### Cheat Sheet

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEYBOARD SHORTCUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ctrl/Cmd + Enter → Send message
Ctrl/Cmd + K → New conversation
Ctrl/Cmd + / → Command palette
Esc → Cancel current action

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE MENTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
@file.js → Reference file
@folder/file.py → Nested file
Multiple: @app.js @test.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Default → General coding help
Code Reviewer → Quality & bugs
Teacher → Learning focused
Debugging → Problem solving
```

## Part 3: Running Training Sessions (10 minutes)

### Workshop 1: Platform Basics (1 hour)

**Agenda:**

**Introduction (10 min)**
```
- Welcome & introductions
- Goals for today
- How AI assistants work
- What makes this one special
```

**Live Demo (20 min)**
```
1. Simple question → Show response
2. Upload file → Show @ mention
3. Switch prompts → Compare responses
4. Create checkpoint → Show restoration
```

**Hands-On Practice (20 min)**
```
Exercise 1: Ask 3 different questions
Exercise 2: Upload and reference a file
Exercise 3: Try all four prompts
Exercise 4: Create a checkpoint
```

**Q&A (10 min)**
```
- Address common questions
- Troubleshoot issues
- Share tips and tricks
```

### Workshop 2: Effective Prompting (1.5 hours)

**Part 1: Theory (15 min)**
```
Good Prompts Are:
✅ Specific: "Add error handling to login function"
✅ Contextual: "@auth.js add validation"
✅ Clear: Include expected behavior

Bad Prompts Are:
❌ Vague: "Fix this"
❌ Ambiguous: "Make it better"
❌ No context: Missing file references
```

**Part 2: Examples (20 min)**

Show before/after:

**Before:**
```
"This doesn't work"
```

**After:**
```
"@api.js The fetchUsers function returns undefined. 
I expect it to return an array of user objects. 
Here's the error: [paste error]"
```

**Part 3: Practice (40 min)**

**Exercise 1: Improve These Prompts**
```
Bad: "Help with code"
Good: ____________________

Bad: "Error in file"
Good: ____________________

Bad: "How to do this?"
Good: ____________________
```

**Exercise 2: Real Code**
```
1. Upload your own code
2. Write a vague question
3. Write a specific question
4. Compare the responses
5. Discuss with group
```

**Part 4: Review (15 min)**
```
- Share best examples
- Discuss patterns
- Create team guidelines
```

### Workshop 3: Advanced Workflows (2 hours)

**Checkpoint Strategies (30 min)**
```
Demo:
1. Start project checkpoint
2. Implement feature
3. Feature complete checkpoint
4. Break something
5. Restore previous checkpoint
6. Discuss when to checkpoint
```

**Multi-File Projects (30 min)**
```
Demo:
1. Upload related files
2. Ask cross-file questions
3. Request coordinated changes
4. Review and apply changes
```

**Prompt Combinations (30 min)**
```
Demo the workflow:
1. Teacher: Learn concept
2. Default: Implement feature
3. Code Reviewer: Get feedback
4. Debugging: Fix issues
5. Code Reviewer: Final check
```

**Practice Project (30 min)**
```
Build a simple feature:
- Plan with Teacher prompt
- Implement with Default
- Review with Code Reviewer
- Use checkpoints throughout
```

## Part 4: Assessment & Certification (5 minutes)

### Basic Certification Test

**Practical Exam (15 minutes):**

```
Scenario: You have a buggy function

Tasks:
1. Upload the provided file
2. Identify the bug using the assistant
3. Get help fixing it
4. Verify the solution
5. Create a checkpoint of working code

Evaluation:
✅ Successfully uploaded file
✅ Used @ mention correctly
✅ Selected appropriate prompt
✅ Fixed the bug
✅ Created named checkpoint
```

### Intermediate Certification Test

**Practical Exam (30 minutes):**

```
Scenario: Review and improve a React component

Tasks:
1. Upload component file
2. Request code review
3. Understand all suggestions
4. Create "before improvements" checkpoint
5. Implement improvements
6. Create "after improvements" checkpoint

Evaluation:
✅ Comprehensive review requested
✅ Demonstrates understanding
✅ Proper checkpoint workflow
✅ Code quality improved
✅ Can explain changes made
```

### Advanced Certification Test

**Practical Exam (60 minutes):**

```
Scenario: Refactor a multi-file application

Tasks:
1. Upload complete project (3+ files)
2. Analyze architecture issues
3. Create refactoring plan with checkpoints
4. Implement changes across files
5. Verify functionality
6. Document the process

Evaluation:
✅ Multi-file context used effectively
✅ Strategic checkpoint usage
✅ Appropriate prompt selection
✅ Code quality improved
✅ Process documented
✅ Can train others
```

## Part 5: Ongoing Support (10 minutes)

### Office Hours

**Weekly Drop-In Sessions:**

```
Schedule: Every Wednesday 2-3 PM

Format:
- Open Q&A
- Live problem solving
- Best practice sharing
- Feature demonstrations

Topics:
Week 1: Effective prompting
Week 2: Checkpoint strategies
Week 3: Multi-file workflows
Week 4: Advanced techniques
```

### Help Resources

**Create Documentation Hub:**

```
/help/
  ├── quick-start.pdf
  ├── cheat-sheet.pdf
  ├── video-tutorials/
  │   ├── getting-started.mp4
  │   ├── file-management.mp4
  │   └── checkpoints.mp4
  ├── examples/
  │   ├── good-prompts.md
  │   ├── workflow-patterns.md
  │   └── common-issues.md
  └── faq.md
```

### Community Building

**Internal Slack/Teams Channel:**

```
#assistant-tips

Purpose:
- Share success stories
- Ask questions
- Share prompt techniques
- Announce new features

Weekly:
- "Tip of the Week"
- User spotlight
- Best prompt contest
```

### Continuous Improvement

**Monthly Metrics Review:**

```
Track:
- Active users
- Feature adoption
- Support tickets
- Satisfaction scores
- Time savings

Actions:
- Update training materials
- Address common issues
- Celebrate wins
- Iterate on program
```

## Common Training Challenges

### Challenge 1: "I don't trust AI"

**Approach:**
```
1. Acknowledge concern
2. Explain it's a tool, not replacement
3. Demo with verification steps
4. Start with low-risk tasks
5. Build confidence gradually

Example:
"Let's use it to explain code you already understand.
You can verify if the explanation is accurate."
```

### Challenge 2: "It's too complicated"

**Approach:**
```
1. Simplify initial training
2. Focus on one feature at a time
3. Use familiar analogies
4. Provide templates
5. Celebrate small wins

Start with:
- Just asking questions (Day 1)
- Then file uploads (Day 2)
- Then prompts (Day 3)
```

### Challenge 3: "I can Google faster"

**Approach:**
```
1. Show context-aware responses
2. Demo file-specific analysis
3. Highlight learning aspect
4. Compare time with complex tasks
5. Show cumulative benefits

Demo:
"Google: generic solutions
Assistant: solutions for YOUR code"
```

### Challenge 4: Over-Reliance

**Approach:**
```
1. Emphasize understanding over copying
2. Require explanations
3. Use Teacher prompt more
4. Code review exercises
5. Test comprehension

Rule:
"Before applying code, explain what it does"
```

## Best Practices for Trainers

### Do's

✅ **Start simple** - Build complexity gradually  
✅ **Show, don't tell** - Live demos are powerful  
✅ **Practice immediately** - Hands-on after each concept  
✅ **Encourage questions** - Create safe learning environment  
✅ **Celebrate progress** - Acknowledge improvements  
✅ **Provide resources** - Documentation and examples  
✅ **Follow up** - Check in after training

### Don'ts

❌ **Don't overwhelm** - Too many features at once  
❌ **Don't assume knowledge** - Explain basics  
❌ **Don't rush** - Let concepts sink in  
❌ **Don't skip practice** - Theory alone doesn't work  
❌ **Don't ignore struggles** - Address difficulties  
❌ **Don't forget context** - Show real-world use  
❌ **Don't stop supporting** - Ongoing help needed

## Measuring Training Success

### Short-Term (1 month)

**Engagement:**
- [ ] 80%+ completed basic training
- [ ] 50%+ using daily
- [ ] Average 3+ features used per person

**Competency:**
- [ ] 70%+ passed basic certification
- [ ] Can complete simple tasks independently
- [ ] Asking better questions

### Medium-Term (3 months)

**Adoption:**
- [ ] 90%+ active users
- [ ] Advanced features being used
- [ ] Reduced basic support tickets

**Impact:**
- [ ] Measurable time savings
- [ ] Improved code quality
- [ ] Positive feedback

### Long-Term (6+ months)

**Mastery:**
- [ ] Users training others
- [ ] Custom workflows developed
- [ ] Feature requests from users
- [ ] Productivity gains

**Culture:**
- [ ] AI assistance normalized
- [ ] Best practices shared
- [ ] Innovation with tool
- [ ] Continuous learning

## What You've Accomplished

1. ✅ Planned comprehensive training program
2. ✅ Created training materials
3. ✅ Designed effective workshops
4. ✅ Established assessment criteria
5. ✅ Set up ongoing support
6. ✅ Prepared for challenges

## Next Steps

- **Start:** Run first training workshop
- **Create:** Your team's training materials
- **Schedule:** Office hours and support
- **Tutorial:** [Managing Prompts](managing-prompts-tutorial.md)

## Resources

**Templates:**
- Training agenda template
- Exercise workbook template
- Assessment rubrics
- Feedback surveys

**Examples:**
- Slide decks
- Demo scripts
- Practice exercises
- Certification tests
