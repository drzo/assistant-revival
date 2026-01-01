
# Tutorial: Managing Assistant Prompts (Admins/Trainers)

## Introduction

Learn how to create, customize, and manage assistant prompts to optimize AI behavior for your organization's needs.

**Time Required:** 30-35 minutes  
**Prerequisites:** Admin access to prompt management  
**Target Audience:** Administrators, Trainers, Team Leads

## Part 1: Understanding Prompts (5 minutes)

### What Are Prompts?

Assistant prompts are pre-configured instruction sets that define:
- **Expertise**: Domain knowledge and specialization
- **Tone**: Communication style (formal, casual, technical)
- **Behavior**: Response patterns and priorities
- **Constraints**: What to avoid or emphasize

### The Default Prompts

Review the built-in prompts:

1. **Default Assistant** - General-purpose helper
2. **Code Reviewer** - Quality-focused analysis
3. **Teacher** - Educational explanations
4. **Debugging Expert** - Problem-solving specialist

**Exercise 1:** Test Each Default Prompt

```
Ask the same question with each prompt:
"How do I handle errors in JavaScript?"

Notice the differences:
- Default: Balanced, practical answer
- Teacher: Conceptual, educational approach
- Code Reviewer: Best practices focus
- Debugging: Troubleshooting emphasis
```

## Part 2: Creating Your First Custom Prompt (10 minutes)

### Scenario: Frontend Specialist for React Team

**Step 1: Access Prompt Manager**

1. Navigate to Settings/Admin panel
2. Click "Assistant Prompts"
3. Click "Create New Prompt"

**Step 2: Define the Prompt**

```yaml
Name: React Specialist
Description: Expert in React development with focus on modern patterns
```

**Step 3: Write System Instructions**

```
You are a React development specialist with deep expertise in modern React patterns, hooks, and component architecture. Your responses should:

1. Prioritize functional components and hooks over class components
2. Suggest React best practices and performance optimizations
3. Include accessibility considerations (a11y)
4. Use TypeScript for type safety when applicable
5. Recommend testing approaches with React Testing Library

Communication style:
- Clear and practical code examples
- Explain the "why" behind recommendations
- Reference official React documentation
- Consider component reusability

Code standards:
- Use arrow functions for components
- Destructure props for clarity
- Include prop-types or TypeScript interfaces
- Follow React naming conventions
```

**Step 4: Add Constraints**

```
Constraints:
- Do not suggest class components unless specifically requested
- Avoid deprecated lifecycle methods
- Focus on React 18+ features
- Prioritize maintainability over cleverness
- Always consider mobile responsiveness
```

**Step 5: Save and Test**

```
1. Click "Save"
2. Select your new "React Specialist" prompt
3. Test with: "@component.jsx Review this React component"
```

## Part 3: Advanced Prompt Engineering (8 minutes)

### Creating Domain-Specific Prompts

**Exercise 2: Backend API Specialist**

```yaml
Name: API Architect
Description: RESTful API design and Node.js backend expert

System Instructions:
You are a backend API specialist focusing on Node.js, Express, and RESTful design principles. 

Core competencies:
- RESTful API architecture and best practices
- Express.js middleware and routing
- Database design and optimization (SQL and NoSQL)
- Authentication and authorization (JWT, OAuth)
- Error handling and validation
- API documentation (OpenAPI/Swagger)

Response format:
- Include proper HTTP status codes
- Show error handling patterns
- Consider security implications
- Suggest scalability approaches
- Include request/response examples

Standards:
- Follow REST conventions
- Use async/await for asynchronous code
- Implement proper validation
- Include security headers
- Consider rate limiting
```

**Exercise 3: Security Auditor**

```yaml
Name: Security Auditor
Description: Security-focused code review and vulnerability detection

System Instructions:
You are a security specialist who reviews code for vulnerabilities, security best practices, and compliance requirements.

Focus areas:
- Input validation and sanitization
- Authentication and authorization flaws
- SQL injection and XSS prevention
- CSRF protection
- Secure session management
- Cryptography best practices
- Dependency vulnerabilities

Review approach:
- Identify security risks by severity (Critical, High, Medium, Low)
- Explain potential attack vectors
- Provide secure code examples
- Reference OWASP Top 10
- Suggest security testing approaches

Standards:
- Assume hostile input
- Apply principle of least privilege
- Follow defense in depth
- Recommend security headers
- Check for exposed secrets
```

## Part 4: Prompt Testing & Validation (7 minutes)

### Test Suite for Prompts

**Step 1: Create Test Scenarios**

For the React Specialist prompt, test with:

```
Scenario 1: Component Review
Upload a React component with issues and ask:
"@BadComponent.jsx Review this component"

Expected: Focus on React patterns, hooks usage, performance

Scenario 2: Implementation Request
"Create a custom hook for fetching user data with loading and error states"

Expected: Modern hook pattern, error handling, TypeScript types

Scenario 3: Debugging Help
"This component re-renders infinitely. @Component.jsx Help debug."

Expected: Identify dependency array issues, suggest fixes
```

**Step 2: Evaluate Responses**

Check if responses include:
- [ ] Appropriate technical depth
- [ ] Correct React patterns
- [ ] TypeScript when applicable
- [ ] Accessibility considerations
- [ ] Performance optimization suggestions

**Step 3: Iterate and Improve**

If responses are off-target:

```
Too technical? → Adjust tone: "Use beginner-friendly explanations"
Missing context? → Add: "Always explain why you recommend a pattern"
Wrong focus? → Refine: "Prioritize performance over brevity"
```

## Part 5: Organizing Prompt Library (5 minutes)

### Categorization Strategy

**By Role:**
```
- Junior Developer Mentor
- Senior Code Reviewer
- Tech Lead Advisor
- Architecture Consultant
```

**By Technology:**
```
- Python Specialist
- JavaScript Expert
- Database Architect
- DevOps Engineer
```

**By Task:**
```
- Bug Hunter
- Performance Optimizer
- Security Auditor
- Documentation Writer
```

**Exercise 4: Create a Naming Convention**

```
Format: [Category] - [Specialty] - [Level]

Examples:
✅ "Frontend - React - Intermediate"
✅ "Backend - Node.js API - Advanced"
✅ "General - Code Reviewer - All Levels"
✅ "Learning - Python Teacher - Beginner"

❌ "Prompt 1"
❌ "React Help"
❌ "Backend"
```

## Part 6: Deployment & User Assignment (5 minutes)

### Rolling Out Prompts

**Step 1: Pilot Testing**

```
1. Select 2-3 team members
2. Assign new prompt
3. Collect feedback for 1 week
4. Iterate based on feedback
```

**Step 2: Team Rollout**

```
1. Announce new prompt in team meeting
2. Provide usage examples
3. Share when to use vs. other prompts
4. Monitor adoption metrics
```

**Step 3: Set Defaults**

For different user groups:

```
Beginners → Teacher prompts
Developers → Balanced/Specialist prompts  
Reviewers → Code Reviewer/Security Auditor
```

### Exercise 5: User Training Plan

Create a 15-minute training session:

```
1. Introduction (3 min)
   - What are prompts?
   - Why they matter
   
2. Demo (5 min)
   - Show same question, different prompts
   - Highlight differences
   
3. Hands-on (5 min)
   - Users try new prompts
   - Ask questions
   
4. Best Practices (2 min)
   - When to switch prompts
   - How to choose
```

## Best Practices Summary

### Prompt Design

**Do:**
- ✅ Be specific about expertise
- ✅ Define clear communication style
- ✅ Include concrete examples
- ✅ Set explicit constraints
- ✅ Test with real scenarios

**Don't:**
- ❌ Be vague or generic
- ❌ Create overlapping prompts
- ❌ Skip testing phase
- ❌ Ignore user feedback
- ❌ Make prompts too restrictive

### Maintenance

**Weekly:**
- Review usage statistics
- Collect user feedback
- Identify issues

**Monthly:**
- Test all prompts
- Update based on feedback
- Archive unused prompts

**Quarterly:**
- Comprehensive review
- Add new prompts for emerging needs
- Sunset obsolete prompts

## Common Challenges & Solutions

### Challenge 1: Prompt Overlap

**Problem:** Multiple prompts do similar things

**Solution:**
```
1. Audit all prompts
2. Identify overlaps
3. Merge or differentiate clearly
4. Update descriptions to clarify use cases
```

### Challenge 2: Low Adoption

**Problem:** Users stick to default prompt

**Solution:**
```
1. Demonstrate value with examples
2. Make switching easy (dropdown)
3. Set contextual defaults
4. Share success stories
```

### Challenge 3: Inconsistent Quality

**Problem:** Prompt gives varying quality responses

**Solution:**
```
1. Add more specific constraints
2. Include response format templates
3. Test with edge cases
4. Refine system instructions
```

## Advanced Techniques

### Contextual Prompts

Create prompts that adapt based on:

```yaml
Name: Adaptive Code Reviewer

System Instructions:
Review code with depth appropriate to the context:

- For @test files: Focus on test coverage and assertions
- For @api files: Emphasize security and error handling  
- For @component files: Check accessibility and performance
- For @config files: Verify security and best practices

Adjust technical depth based on:
- File complexity
- Potential impact
- Security implications
```

### Multi-Stage Prompts

Guide users through workflows:

```yaml
Name: Feature Developer

System Instructions:
Guide users through feature development:

Stage 1 - Planning: Discuss architecture and approach
Stage 2 - Implementation: Provide code examples
Stage 3 - Review: Check quality and best practices
Stage 4 - Testing: Suggest test cases
Stage 5 - Documentation: Help document the feature

Remind users of current stage and next steps.
```

## What You've Learned

1. ✅ Understanding prompt components
2. ✅ Creating custom prompts
3. ✅ Testing and validating prompts
4. ✅ Organizing prompt libraries
5. ✅ Deploying prompts to teams
6. ✅ Maintenance and iteration

## Next Steps

- **Practice:** Create 2-3 prompts for your team's needs
- **Deploy:** Pilot with a small group
- **Iterate:** Refine based on feedback
- **Train:** Teach your team to use prompts effectively

## Resources

- [Managing Prompts Guide](../../guides/adm/managing-prompts.md)
- [User Training Guide](../../guides/adm/user-training.md)
- [Extending Features](../../guides/dev/extending-features.md)
