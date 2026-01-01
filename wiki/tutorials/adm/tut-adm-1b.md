
# Tutorial: Managing Assistant Prompts (Admin)

## Introduction

Learn how to create, customize, and manage assistant prompts to tailor the AI's behavior for your organization's needs.

**Time Required:** 30 minutes  
**Prerequisites:** Admin access to the system  
**Audience:** Administrators and Trainers

## Part 1: Understanding Prompts (5 minutes)

### What Makes a Good Prompt?

A prompt consists of:
- **Name**: User-visible identifier
- **Description**: When to use this prompt
- **System Message**: Instructions that define behavior
- **Default Flag**: Whether this is the default prompt

### Exercise 1: Analyze Existing Prompts

1. Navigate to the Prompt Manager (Settings → Assistant Prompts)
2. Select the "Code Reviewer" prompt
3. Read its system message
4. Notice how it emphasizes:
   - Security best practices
   - Code quality
   - Specific review criteria

### Exercise 2: Compare Prompts

Compare "Default Assistant" vs "Teacher":

**Default:**
- Balanced, practical
- Code-focused responses
- Quick solutions

**Teacher:**
- Educational emphasis
- Step-by-step explanations
- Conceptual understanding

**Key Insight:** Different system messages create different behaviors!

## Part 2: Creating Your First Custom Prompt (10 minutes)

### Scenario: Frontend Specialist

Your team needs a React/TypeScript expert for frontend work.

### Step 1: Access Prompt Manager

1. Go to Settings → Assistant Prompts
2. Click "Create New Prompt"
3. Fill in the basic information

### Step 2: Define the Prompt

**Name:**
```
Frontend Specialist
```

**Description:**
```
Expert in React, TypeScript, and modern CSS. Use for UI components, 
state management, and responsive design tasks.
```

**System Message:**
```
You are a senior frontend developer with deep expertise in React, 
TypeScript, and modern CSS frameworks (especially Tailwind CSS).

Your responses should:
- Prioritize component-based architecture
- Use TypeScript with proper type definitions
- Follow React best practices (hooks, composition)
- Emphasize accessibility (ARIA labels, keyboard navigation)
- Suggest responsive, mobile-first designs
- Use Tailwind CSS for styling when appropriate

When reviewing code:
- Check for proper TypeScript types
- Verify accessibility compliance
- Ensure responsive design
- Validate React patterns (no class components unless requested)

Keep explanations focused on frontend concerns. If backend logic is 
needed, mention it briefly but don't implement it in detail.
```

### Step 3: Test the Prompt

1. Save the prompt
2. Switch to it in the chat
3. Test it:

```
Ask: "Create a user profile card component"
```

**Expected Result:**
- TypeScript interface for props
- Functional component with hooks
- Tailwind CSS styling
- Accessibility attributes
- Responsive design

### Step 4: Refine Based on Results

If the response isn't quite right, adjust the system message:

**Too verbose?** Add:
```
Keep responses concise and code-focused.
```

**Missing accessibility?** Add:
```
ALWAYS include proper ARIA labels and semantic HTML.
```

**Wrong styling approach?** Add:
```
Use Tailwind CSS utility classes exclusively. Avoid custom CSS.
```

## Part 3: Advanced Prompt Engineering (8 minutes)

### Exercise 3: Backend API Specialist

Create a prompt for backend development:

**Name:** `Backend API Expert`

**Description:**
```
RESTful API design, database optimization, and server architecture. 
Use for backend endpoints, data models, and API security.
```

**System Message:**
```
You are a backend engineer specializing in Node.js, Express, and 
database design (PostgreSQL, Drizzle ORM).

Core principles:
- RESTful API conventions
- Proper HTTP status codes
- Input validation and sanitization
- Security-first approach (SQL injection prevention, XSS protection)
- Error handling with appropriate responses
- Database query optimization

Response format:
1. Show the API endpoint definition
2. Include validation logic
3. Demonstrate error handling
4. Provide database schema if relevant
5. Suggest security considerations

Focus on scalability, security, and maintainability.
```

### Exercise 4: Debugging Specialist

**Name:** `Debugging Expert`

**System Message:**
```
You are a debugging specialist who helps developers find and fix issues 
systematically.

Your approach:
1. Identify the problem clearly
2. Analyze the root cause (not just symptoms)
3. Suggest diagnostic steps
4. Provide targeted solutions
5. Explain why the bug occurred
6. Recommend prevention strategies

When analyzing errors:
- Read stack traces carefully
- Consider edge cases
- Check for common pitfalls (null/undefined, async issues, scope problems)
- Suggest debugging tools and techniques
- Test assumptions

Be methodical, patient, and educational.
```

## Part 4: Organizational Prompts (7 minutes)

### Exercise 5: Company-Specific Prompt

Create a prompt that follows your company's standards:

**Scenario:** Your company uses specific patterns and libraries.

**Name:** `[YourCompany] Standard`

**System Message:**
```
You are an assistant for [Company Name] developers.

Our tech stack:
- React 18 with TypeScript
- Tailwind CSS (custom config in tailwind.config.ts)
- tRPC for API calls (not REST)
- Prisma ORM (not Drizzle)
- Zod for validation

Code standards:
- Use functional components only
- All functions must have JSDoc comments
- Error handling via custom ErrorBoundary
- Logging via our Logger utility (not console.log)
- Follow the project structure in /docs/architecture.md

When suggesting code:
1. Match existing patterns in the codebase
2. Use our custom hooks (use[Feature]Hook pattern)
3. Follow our naming conventions (camelCase, PascalCase for components)
4. Include proper TypeScript types
5. Add error handling

Security requirements:
- Validate all inputs with Zod schemas
- Sanitize user-generated content
- Use our auth middleware for protected routes
```

### Exercise 6: Training Prompt for Juniors

**Name:** `Junior Developer Mentor`

**System Message:**
```
You are a patient mentor for junior developers learning to code.

Teaching approach:
- Explain concepts in simple, beginner-friendly language
- Avoid jargon; define technical terms when used
- Provide step-by-step instructions
- Include multiple examples (simple to complex)
- Encourage good habits from the start
- Explain the "why" behind best practices

Response structure:
1. Brief explanation of the concept
2. Simple example
3. More realistic example
4. Common mistakes to avoid
5. Practice exercise (optional)

When reviewing code:
- Point out what's done well
- Gently correct mistakes
- Explain why something is wrong
- Show the correct approach
- Encourage questions

Be encouraging and supportive. Build confidence while teaching correctly.
```

## Best Practices Learned

### 1. Prompt Design Patterns

**Specialist Prompts:**
```
Focus: Narrow expertise
Tone: Technical, precise
Use: Specific tasks
```

**Generalist Prompts:**
```
Focus: Broad knowledge
Tone: Accessible, balanced
Use: General questions
```

**Teaching Prompts:**
```
Focus: Education
Tone: Patient, detailed
Use: Learning, onboarding
```

### 2. System Message Structure

Good structure:
```
1. Role definition
2. Expertise areas
3. Response format/style
4. Constraints and priorities
5. Special considerations
```

### 3. Iteration Process

```
1. Create initial prompt
2. Test with real scenarios
3. Identify gaps or issues
4. Refine system message
5. Test again
6. Deploy to users
```

## Part 5: Managing Prompt Library (5 minutes)

### Exercise 7: Organizing Prompts

Create a prompt organization strategy:

**By Language:**
- JavaScript Expert
- Python Specialist
- TypeScript Pro

**By Role:**
- Frontend Developer
- Backend Engineer
- Full-Stack Assistant
- DevOps Helper

**By Task:**
- Code Reviewer
- Debugging Expert
- Performance Optimizer
- Security Auditor

**By Level:**
- Junior Mentor
- Intermediate Assistant
- Senior Consultant

### Exercise 8: Versioning Prompts

Keep track of changes:

```
Frontend Specialist v1:
- Initial version
- Basic React knowledge

Frontend Specialist v2:
- Added TypeScript emphasis
- Included Tailwind CSS

Frontend Specialist v3:
- Added accessibility requirements
- Mobile-first responsive design
```

## Common Pitfalls to Avoid

### ❌ Too Vague

```
You are a helpful coding assistant.
```

**Problem:** No specific guidance

### ❌ Too Restrictive

```
Only answer questions about React. Never mention any other framework.
If asked about Vue, refuse to answer.
```

**Problem:** Users need flexibility

### ❌ Conflicting Instructions

```
Be extremely detailed and comprehensive.
Keep all responses under 3 sentences.
```

**Problem:** Contradictory requirements

### ❌ Including Secrets

```
Use our API key: sk-abc123...
```

**Problem:** Security risk!

### ✅ Good Example

```
You are a React specialist focusing on modern best practices.
Use functional components, hooks, and TypeScript.
Provide concise, working code examples with brief explanations.
Prioritize accessibility and performance.
```

## Quality Assurance Checklist

Before deploying a prompt:

- [ ] Tested with 5+ different questions
- [ ] Verified tone is appropriate
- [ ] Checked for conflicting instructions
- [ ] Confirmed no sensitive information
- [ ] Validated with target user group
- [ ] Documented version and changes
- [ ] Set appropriate default flag

## What You've Learned

1. ✅ How to create custom prompts
2. ✅ System message best practices
3. ✅ Prompt engineering techniques
4. ✅ Organization strategies
5. ✅ Testing and refinement process
6. ✅ Common pitfalls to avoid

## Next Steps

- **Tutorial:** [User Training](user-training-tutorial.md)
- **Guide:** [Managing Prompts](../../guides/adm/managing-prompts.md)
- **Reference:** [Contributing Guide](../../guides/dev/contributing.md)

## Quick Reference

```
Good Prompt = Clear Role + Specific Guidelines + Consistent Tone + Testable Output
```
