
# Tutorial: Managing Assistant Prompts (Admins)

## Introduction

Learn how to create, customize, and manage assistant prompts for your team or organization.

**Time Required:** 35 minutes  
**Prerequisites:** Admin access to the platform  
**Audience:** Admins, Trainers, Team Leads

## What You'll Learn

1. ✅ Creating custom assistant prompts
2. ✅ Organizing a prompt library
3. ✅ Testing and iterating on prompts
4. ✅ Deploying prompts to users
5. ✅ Collecting and acting on feedback

## Part 1: Creating Your First Custom Prompt (10 minutes)

### Step 1: Access Prompt Management

1. Navigate to **Settings** > **Assistant Prompts**
2. Click **Create New Prompt**
3. You'll see the prompt creation form

### Step 2: Define a Frontend Specialist

Let's create a prompt for frontend developers:

**Name:**
```
Frontend Specialist
```

**Description:**
```
Expert in React, CSS, and UI/UX development. Focuses on component-based architecture, accessibility, and responsive design.
```

**System Instructions:**
```
You are a frontend development expert specializing in React, modern CSS, and user experience. 

EXPERTISE:
- React components and hooks
- Tailwind CSS and modern styling
- Accessibility (WCAG compliance)
- Responsive, mobile-first design
- Performance optimization

RESPONSE STYLE:
- Provide component-based solutions
- Include accessibility considerations
- Suggest responsive patterns
- Use Tailwind CSS for styling
- Prioritize user experience

CODE STANDARDS:
- TypeScript for type safety
- Functional components with hooks
- Proper prop typing
- Semantic HTML
- ARIA labels where needed
```

**Constraints:**
```
- Avoid backend implementation details
- Focus on client-side solutions only
- Do not suggest server-side rendering without context
- Prioritize browser compatibility
- Always consider mobile devices
```

### Step 3: Save and Test

1. Click **Save Prompt**
2. Switch to chat interface
3. Select your new "Frontend Specialist" prompt
4. Test with: `"Create a responsive navigation bar with mobile menu"`

**Expected Behavior:**
- Tailwind CSS solution
- Mobile-first approach
- Accessibility features
- Component-based code

## Part 2: Creating Specialized Prompts (10 minutes)

### Exercise 1: Backend API Expert

**Name:** `Backend API Expert`

**System Instructions:**
```
You are a backend development expert focused on RESTful API design, database optimization, and server architecture.

EXPERTISE:
- Node.js and Express
- RESTful API design
- Database design and optimization
- Authentication and authorization
- Error handling and validation

RESPONSE STYLE:
- Security-first approach
- Scalable solutions
- Proper HTTP status codes
- RESTful conventions
- Database best practices

CODE STANDARDS:
- Input validation
- Error handling middleware
- Proper status codes
- SQL injection prevention
- Rate limiting considerations
```

### Exercise 2: Python Data Science Expert

**Name:** `Python Data Scientist`

**System Instructions:**
```
You are a data science expert specializing in Python, pandas, numpy, and machine learning.

EXPERTISE:
- Data analysis with pandas
- Statistical computing with numpy
- Visualization (matplotlib, seaborn)
- Machine learning (scikit-learn)
- Data cleaning and preprocessing

RESPONSE STYLE:
- Explain statistical concepts
- Show data exploration steps
- Include visualization examples
- Discuss model selection
- Provide performance metrics

CODE STANDARDS:
- Vectorized operations
- Memory-efficient code
- Reproducible results (random seeds)
- Clear variable names
- Documented assumptions
```

### Exercise 3: Debugging Expert

**Name:** `Debugging Specialist`

**System Instructions:**
```
You are a debugging expert focused on systematic problem-solving and root cause analysis.

EXPERTISE:
- Error analysis and interpretation
- Stack trace reading
- Debugging techniques
- Testing strategies
- Performance profiling

RESPONSE STYLE:
- Systematic approach
- Ask clarifying questions
- Explain root causes
- Suggest preventive measures
- Provide debugging steps

DEBUGGING PROCESS:
1. Understand the symptom
2. Identify the error location
3. Analyze the root cause
4. Propose a fix
5. Suggest tests to prevent recurrence
```

## Part 3: Organizing Your Prompt Library (5 minutes)

### Naming Convention

Use this pattern:
```
[Category] - [Specialty] - [Level]
```

**Examples:**
- `JavaScript - React Developer - Intermediate`
- `Python - Data Science - Beginner`
- `General - Code Reviewer - Advanced`
- `DevOps - Docker Specialist - Intermediate`

### Categories to Create

**By Language:**
- JavaScript/TypeScript
- Python
- Java
- C++/C
- Go
- Rust

**By Role:**
- Frontend Developer
- Backend Developer
- Full Stack Developer
- DevOps Engineer
- Data Scientist
- Security Expert

**By Task:**
- Code Review
- Debugging
- Learning/Teaching
- Optimization
- Refactoring

**By Level:**
- Beginner (learning focus)
- Intermediate (best practices)
- Advanced (architecture, optimization)

## Part 4: Testing Prompts (5 minutes)

### Test Scenarios

For each prompt, test with:

**1. Common Use Case:**
```
[Frontend Specialist selected]
Ask: "Create a form with validation"
```

**2. Edge Case:**
```
Ask: "What if the user submits while offline?"
```

**3. Skill Level Test:**
```
Ask: "Explain how state management works"
```

### Evaluation Checklist

- [ ] Response matches expected expertise
- [ ] Tone is appropriate for target audience
- [ ] Code quality meets standards
- [ ] Explanations are clear
- [ ] Constraints are respected

### A/B Testing

Compare responses:

```
Test Query: "Optimize this slow database query"

1. Select "Default Assistant" → Note response
2. Select "Backend API Expert" → Note response
3. Compare:
   - Technical depth
   - Specific recommendations
   - Code examples
   - Best practices mentioned
```

## Part 5: Deployment Strategy (5 minutes)

### Pilot Testing

**Phase 1: Internal Testing (1 week)**
- Admin team tests prompts
- Document issues
- Iterate on instructions

**Phase 2: Small Group (1 week)**
- Deploy to 5-10 users
- Collect feedback
- Monitor usage patterns

**Phase 3: Team Rollout (2 weeks)**
- Deploy to full team
- Provide training
- Track adoption

**Phase 4: Refinement (Ongoing)**
- Analyze usage data
- Update based on feedback
- Add new prompts as needed

### Communication Plan

**Announcement Email:**
```
Subject: New AI Assistant Prompts Available

We've added specialized AI assistant prompts to help you work more efficiently:

🎨 Frontend Specialist - React, CSS, UI/UX
⚙️ Backend API Expert - Node.js, databases, APIs
📊 Python Data Scientist - Data analysis, ML
🐛 Debugging Specialist - Problem solving

How to use:
1. Click the dropdown at top of chat
2. Select the prompt that matches your task
3. Ask your question

Try them out and let us know what you think!
```

## Part 6: Collecting Feedback (5 minutes)

### Feedback Mechanisms

**1. Quick Rating:**
```
After using a prompt, ask:
"Was this prompt helpful? 👍 👎"
```

**2. Detailed Survey:**
```
Weekly survey:
- Which prompts did you use?
- What worked well?
- What could be improved?
- What prompts are missing?
```

**3. Usage Analytics:**
Track:
- Prompt selection frequency
- Session duration per prompt
- User satisfaction scores
- Feature requests

### Iteration Process

**Monthly Review:**
1. Analyze usage data
2. Review feedback
3. Identify patterns
4. Plan improvements
5. Test changes
6. Deploy updates

**Example Iteration:**

**Original:** "You are a Python expert"
**Feedback:** "Too general, not enough focus on my use case"
**Updated:** "You are a Python web development expert specializing in Django and Flask, focusing on RESTful APIs and database optimization"

## Advanced Techniques

### Template Variables

Create flexible prompts:

```
You are a {LANGUAGE} expert specializing in {FRAMEWORK}.

Your focus is on {PRIMARY_GOAL} while maintaining {STANDARDS}.

Respond with:
- {RESPONSE_STYLE_1}
- {RESPONSE_STYLE_2}
- {RESPONSE_STYLE_3}
```

Fill in for different teams:
- Web Team: JavaScript, React, performance, best practices
- Data Team: Python, pandas, analysis, reproducibility

### Contextual Prompts

Adapt based on detected context:

```
IF project_has_file("package.json"):
    framework = detect_framework()
    "You are a {framework} expert..."
ELIF project_has_file("requirements.txt"):
    "You are a Python expert..."
```

### Chain Prompting

Guide users through workflows:

```
Step 1: Use "Code Reviewer" for initial analysis
Step 2: Use "Debugging Expert" for issues found
Step 3: Use "Default" for implementation
Step 4: Use "Code Reviewer" for final check
```

## Common Challenges & Solutions

### Challenge 1: Inconsistent Responses

**Problem:** Same question gets different answers

**Solution:**
```
Add explicit rules:
"ALWAYS include error handling"
"ALWAYS use TypeScript"
"NEVER use deprecated APIs"
```

### Challenge 2: Too Technical for Beginners

**Problem:** Beginners can't understand responses

**Solution:**
```
Create beginner-specific prompts:

"You are a patient teacher for beginners.

RULES:
- Explain concepts before code
- Use simple analogies
- Avoid jargon without explanation
- Break down complex ideas
- Encourage questions"
```

### Challenge 3: Scope Creep

**Problem:** Prompt tries to do too much

**Solution:**
```
Be specific in constraints:

"Focus ONLY on:
- React components
- CSS styling
- Client-side logic

Do NOT include:
- Backend code
- Database queries
- API implementation"
```

### Challenge 4: Low Adoption

**Problem:** Users stick to default prompt

**Solution:**
- Provide clear examples
- Show before/after comparisons
- Integrate into training
- Set defaults by project type
- Make switching easy

## Best Practices Checklist

### Prompt Creation
- [ ] Clear, descriptive name
- [ ] Specific expertise defined
- [ ] Communication style specified
- [ ] Explicit constraints
- [ ] Use case examples

### Testing
- [ ] Multiple test scenarios
- [ ] Edge cases covered
- [ ] Different skill levels
- [ ] Comparison with other prompts
- [ ] Real-world usage

### Deployment
- [ ] Pilot testing completed
- [ ] Documentation prepared
- [ ] Training materials ready
- [ ] Feedback mechanism in place
- [ ] Rollback plan defined

### Maintenance
- [ ] Regular usage review
- [ ] Feedback collection
- [ ] Quarterly updates
- [ ] Deprecation of unused prompts
- [ ] Version control

## Measuring Success

### Key Metrics

**Adoption:**
- % of users using custom prompts
- Average prompts per user
- Frequency of switching

**Satisfaction:**
- User ratings
- Feedback sentiment
- Support ticket reduction

**Effectiveness:**
- Task completion rate
- Code quality improvement
- Time savings reported

### Success Criteria

**After 1 Month:**
- [ ] 50%+ users tried custom prompts
- [ ] Average rating 4+/5
- [ ] Positive feedback themes

**After 3 Months:**
- [ ] 80%+ active usage
- [ ] Established favorites identified
- [ ] Reduced basic questions

**After 6 Months:**
- [ ] Custom prompts preferred over default
- [ ] Measurable productivity gains
- [ ] User-requested prompts implemented

## What You've Accomplished

1. ✅ Created multiple specialized prompts
2. ✅ Organized a prompt library
3. ✅ Tested prompts thoroughly
4. ✅ Deployed with a strategy
5. ✅ Established feedback loops
6. ✅ Planned for maintenance

## Next Steps

- **Tutorial:** [User Training](user-training-tutorial.md)
- **Guide:** [Managing Prompts](../../guides/adm/managing-prompts.md)
- **Advanced:** Create team-specific prompt collections

## Resources

**Templates:**
- Prompt creation template
- Testing checklist
- Deployment plan
- Feedback survey

**Examples:**
- Language-specific prompts
- Role-based prompts
- Task-focused prompts
- Level-appropriate prompts
