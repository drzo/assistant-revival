
import type { AssistantPrompt } from "@shared/schema";

export interface ModeContext {
  messageContent: string;
  hasMultipleFiles: boolean;
  fileCount: number;
  hasErrorMessage: boolean;
  hasTypeError: boolean;
  requestsFeature: boolean;
  requestsRefactor: boolean;
}

export function detectSuggestedPrompt(
  context: ModeContext,
  availablePrompts: AssistantPrompt[]
): AssistantPrompt | null {
  // Fast Mode triggers
  const isFastMode = 
    !context.hasMultipleFiles &&
    (context.hasErrorMessage || context.hasTypeError) &&
    !context.requestsFeature;

  if (isFastMode) {
    if (context.hasTypeError) {
      return availablePrompts.find(p => p.name === "Fast Mode - Type Safety") || null;
    }
    if (context.hasErrorMessage) {
      return availablePrompts.find(p => p.name === "Fast Mode - Bug Fixer") || null;
    }
    return availablePrompts.find(p => p.name === "Fast Mode - Quick Edits") || null;
  }

  // Agent Mode triggers
  const isAgentMode =
    context.hasMultipleFiles ||
    context.requestsFeature ||
    context.requestsRefactor ||
    context.fileCount > 3;

  if (isAgentMode) {
    if (context.requestsFeature) {
      return availablePrompts.find(p => p.name === "Agent Mode - Feature Builder") || null;
    }
    if (context.requestsRefactor) {
      return availablePrompts.find(p => p.name === "Agent Mode - Refactoring") || null;
    }
    return availablePrompts.find(p => p.name === "Agent Mode - Deep Debugger") || null;
  }

  return null;
}

export function analyzeMessageContext(message: string, fileCount: number): ModeContext {
  const lower = message.toLowerCase();
  
  return {
    messageContent: message,
    hasMultipleFiles: /@\S+/.test(message) && (message.match(/@/g) || []).length > 1,
    fileCount,
    hasErrorMessage: /error|exception|fail|crash|bug/i.test(message),
    hasTypeError: /type\s+error|cannot\s+find|property.*does\s+not\s+exist/i.test(message),
    requestsFeature: /add|create|build|implement|feature|new/i.test(message),
    requestsRefactor: /refactor|improve|optimize|clean.*up|reorganize/i.test(message),
  };
}
