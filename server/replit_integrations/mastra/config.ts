import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

const model = openai('gpt-4-turbo-preview') as any;

function createAssistantAgent(): Agent {
  return new Agent({
    name: 'Assistant Agent',
    instructions: `You are a helpful AI coding assistant. You help users with:
- Writing and understanding code
- Debugging issues
- Explaining programming concepts
- Proposing code changes
- Answering technical questions

Always provide clear, practical solutions with code examples when relevant.`,
    model,
  });
}

function createCodeReviewerAgent(): Agent {
  return new Agent({
    name: 'Code Reviewer Agent',
    instructions: `You are an expert code reviewer. Focus on:
- Code quality and best practices
- Security vulnerabilities
- Performance optimizations
- Maintainability and readability
- Testing coverage

Provide specific, actionable feedback with examples.`,
    model,
  });
}

function createDebuggerAgent(): Agent {
  return new Agent({
    name: 'Debugger Agent',
    instructions: `You are a debugging specialist. Help users:
- Identify root causes of errors
- Trace execution flow
- Analyze stack traces
- Suggest fixes with explanations
- Prevent similar issues

Be systematic and thorough in your analysis.`,
    model,
  });
}

const agents = {
  assistantAgent: createAssistantAgent(),
  codeReviewerAgent: createCodeReviewerAgent(),
  debuggerAgent: createDebuggerAgent(),
};

export const mastra = new Mastra({
  agents,
});

export function getAgent(agentName: string = 'assistantAgent'): Agent {
  const agent = agents[agentName as keyof typeof agents];
  if (!agent) {
    throw new Error(`Agent ${agentName} not found`);
  }
  return agent;
}
