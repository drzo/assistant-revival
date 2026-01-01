
# Mastra Integration

## Overview

Mastra is an AI agent framework integrated into this assistant to provide specialized, multi-agent capabilities. It enables orchestrated collaboration between different AI agents, each optimized for specific development tasks.

## Architecture

### Core Components

1. **Mastra Instance** (`server/replit_integrations/mastra/config.ts`)
   - Central orchestrator managing multiple specialized agents
   - Configures agent models and behaviors
   - Handles tool routing and execution

2. **Specialized Agents**
   - **Assistant Agent**: General-purpose coding help
   - **Code Reviewer Agent**: Code quality and best practices
   - **Debugger Agent**: Problem diagnosis and troubleshooting

3. **Tools System** (`server/replit_integrations/mastra/tools.ts`)
   - File operations (read, search, list)
   - Code analysis tools
   - Integration points for external capabilities

## Agent Profiles

### Assistant Agent
**Purpose**: General coding assistance and development support

**Capabilities**:
- Writing and understanding code
- Debugging issues
- Explaining programming concepts
- Proposing code changes
- Answering technical questions

**Model**: GPT-4 Turbo Preview with automatic tool selection

**Use Cases**:
- Initial feature implementation
- Code generation from descriptions
- General programming questions
- API integration guidance

---

### Code Reviewer Agent
**Purpose**: Code quality assurance and optimization

**Capabilities**:
- Code quality analysis
- Security vulnerability detection
- Performance optimization suggestions
- Maintainability assessment
- Testing coverage recommendations

**Model**: GPT-4 Turbo Preview with automatic tool selection

**Use Cases**:
- Pull request reviews
- Refactoring planning
- Best practices enforcement
- Security audits

---

### Debugger Agent
**Purpose**: Systematic problem-solving and root cause analysis

**Capabilities**:
- Root cause identification
- Execution flow tracing
- Stack trace analysis
- Fix suggestions with explanations
- Prevention strategies

**Model**: GPT-4 Turbo Preview with automatic tool selection

**Use Cases**:
- Production issue investigation
- Complex bug diagnosis
- Performance bottleneck identification
- Error pattern analysis

## Available Tools

The Mastra agents have access to specialized tools:

1. **`readFile`** - Read file contents from the codebase
2. **`searchFiles`** - Search across files using patterns
3. **`listFiles`** - List files in directories
4. **`analyzeCode`** - Perform static code analysis

## API Endpoints

### Chat with Agent
```
POST /api/mastra/chat
```

**Request Body**:
```json
{
  "message": "Review this authentication function for security issues",
  "agentName": "codeReviewerAgent",
  "tools": ["readFile", "analyzeCode"]
}
```

**Response**:
```json
{
  "response": "Detailed agent response...",
  "toolCalls": [
    {
      "tool": "readFile",
      "args": { "path": "server/auth.ts" },
      "result": "..."
    }
  ],
  "agentName": "codeReviewerAgent"
}
```

### Get Available Agents
```
GET /api/mastra/agents
```

**Response**:
```json
{
  "agents": [
    {
      "name": "assistantAgent",
      "description": "General purpose coding assistant"
    },
    {
      "name": "codeReviewerAgent",
      "description": "Code quality and best practices reviewer"
    },
    {
      "name": "debuggerAgent",
      "description": "Debugging and problem-solving specialist"
    }
  ]
}
```

### Get Available Tools
```
GET /api/mastra/tools
```

**Response**:
```json
{
  "tools": [
    {
      "name": "readFile",
      "description": "Read contents of a file"
    },
    {
      "name": "searchFiles",
      "description": "Search files by pattern"
    }
  ]
}
```

## Client Integration

### React Hook (`client/src/hooks/use-mastra.ts`)

```typescript
import { useMastra } from '@/hooks/use-mastra';

function MyComponent() {
  const { agents, tools, chat, isLoading, error } = useMastra();

  const handleChat = async () => {
    const response = await chat({
      message: "Debug this error: TypeError at line 42",
      agentName: "debuggerAgent",
      tools: ["readFile", "analyzeCode"]
    });
    
    console.log(response.response);
  };

  return (
    <div>
      <select>
        {agents.map(agent => (
          <option key={agent.name} value={agent.name}>
            {agent.description}
          </option>
        ))}
      </select>
      <button onClick={handleChat} disabled={isLoading}>
        Ask Agent
      </button>
    </div>
  );
}
```

## Agent Selection Guidelines

### When to Use Each Agent

**Assistant Agent**:
- Feature requests
- Code generation
- General questions
- Learning new concepts
- API integration

**Code Reviewer Agent**:
- Before merging code
- During refactoring
- Security audits
- Performance reviews
- Best practices validation

**Debugger Agent**:
- Production errors
- Test failures
- Performance issues
- Unexpected behavior
- Complex bugs

## Multi-Agent Workflows

### Example: Full Feature Development

1. **Planning** (Assistant Agent)
   - Understand requirements
   - Design approach
   - Plan file structure

2. **Implementation** (Assistant Agent)
   - Generate initial code
   - Create files
   - Set up integrations

3. **Review** (Code Reviewer Agent)
   - Analyze code quality
   - Check security
   - Suggest optimizations

4. **Debug** (Debugger Agent)
   - Investigate test failures
   - Fix edge cases
   - Optimize performance

## Configuration

### Adding New Agents

Edit `server/replit_integrations/mastra/config.ts`:

```typescript
function createCustomAgent(): Agent {
  return new Agent({
    name: 'Custom Agent',
    instructions: `Your specialized instructions...`,
    model: {
      provider: 'openai',
      name: 'gpt-4-turbo-preview',
      toolChoice: 'auto',
    } as ModelConfig,
  });
}
```

Register in Mastra instance:

```typescript
export const mastra = new Mastra({
  agents: {
    assistantAgent: createAssistantAgent(),
    codeReviewerAgent: createCodeReviewerAgent(),
    debuggerAgent: createDebuggerAgent(),
    customAgent: createCustomAgent(), // New agent
  },
});
```

### Adding New Tools

Edit `server/replit_integrations/mastra/tools.ts`:

```typescript
export const myCustomTool = {
  description: 'Tool description',
  parameters: z.object({
    param1: z.string(),
  }),
  execute: async ({ param1 }: { param1: string }) => {
    // Tool implementation
    return result;
  },
};
```

## Best Practices

1. **Choose the Right Agent**
   - Match task to agent expertise
   - Don't use debugger for feature requests
   - Don't use assistant for code reviews

2. **Tool Selection**
   - Only request tools the agent needs
   - More tools = slower responses
   - Essential tools for context

3. **Message Clarity**
   - Provide specific context
   - Include error messages
   - Reference file paths

4. **Iterative Refinement**
   - Start with assistant for exploration
   - Move to reviewer for quality
   - Use debugger for issues

## Integration with Main Assistant

Mastra agents complement the main assistant:

- **Main Assistant**: Conversational, context-aware, file operations
- **Mastra Agents**: Specialized, task-focused, tool-enhanced

The main assistant can delegate specific tasks to Mastra agents for optimal results.

## Performance Considerations

- **Agent Response Time**: 2-10 seconds depending on tools
- **Tool Execution**: Adds 100-500ms per tool call
- **Parallel Execution**: Not currently supported
- **Caching**: Tool results not cached between requests

## Future Enhancements

- [ ] Custom agent creation via UI
- [ ] Multi-agent collaboration on single task
- [ ] Tool result caching
- [ ] Streaming responses
- [ ] Agent conversation history
- [ ] Fine-tuned models for specific domains
- [ ] Integration with org-persona system
- [ ] Workflow automation with agents

## Troubleshooting

### Agent Not Responding
- Check OpenAI API key configuration
- Verify network connectivity
- Review server logs for errors

### Tool Execution Failures
- Ensure file paths are correct
- Check file permissions
- Verify tool parameters

### Unexpected Agent Behavior
- Review agent instructions
- Check tool selection
- Validate message format

## Related Documentation

- [AI Integration](wiki/features/ai-integration.md)
- [Assistant Prompts](wiki/features/assistant-prompts.md)
- [Org Persona System](org-persona.md)
- [Chat System](wiki/features/chat-system.md)
