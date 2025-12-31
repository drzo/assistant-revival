/**
 * In-memory database module for Assistant Memorial Edition
 * This provides a lightweight storage solution for assistant prompts
 */

import type { AssistantPrompt } from "@shared/schema";

interface PromptRecord extends AssistantPrompt {
  id: string;
}

let prompts: Map<string, PromptRecord> = new Map();
let nextId = 1;

export const db = {
  // Assistant Prompts
  getPrompt: async (id: string): Promise<PromptRecord | undefined> => {
    return prompts.get(id);
  },

  getAllPrompts: async (): Promise<PromptRecord[]> => {
    return Array.from(prompts.values());
  },

  getDefaultPrompt: async (): Promise<PromptRecord | undefined> => {
    for (const prompt of Array.from(prompts.values())) {
      if (prompt.isDefault) {
        return prompt;
      }
    }
    return undefined;
  },

  createPrompt: async (
    name: string,
    instructions: string,
    isDefault: boolean = false
  ): Promise<PromptRecord> => {
    const id = String(nextId++);
    const now = new Date().toISOString();

    // If this is being set as default, unset all others
    if (isDefault) {
      for (const prompt of Array.from(prompts.values())) {
        prompt.isDefault = false;
      }
    }

    const prompt: PromptRecord = {
      id,
      name,
      instructions,
      description: "",
      isDefault,
      createdAt: now,
      updatedAt: now,
    };

    prompts.set(id, prompt);
    return prompt;
  },

  updatePrompt: async (
    id: string,
    name?: string,
    instructions?: string,
    isDefault?: boolean
  ): Promise<PromptRecord | undefined> => {
    const prompt = prompts.get(id);
    if (!prompt) return undefined;

    if (name !== undefined) prompt.name = name;
    if (instructions !== undefined) prompt.instructions = instructions;
    if (isDefault !== undefined) {
      if (isDefault) {
        // Unset all others
        for (const p of Array.from(prompts.values())) {
          p.isDefault = false;
        }
      }
      prompt.isDefault = isDefault;
    }

    prompt.updatedAt = new Date().toISOString();
    prompts.set(id, prompt);
    return prompt;
  },

  deletePrompt: async (id: string): Promise<void> => {
    prompts.delete(id);
  },

  setDefaultPrompt: async (id: string): Promise<void> => {
    // Unset all others
    for (const prompt of Array.from(prompts.values())) {
      prompt.isDefault = false;
    }

    const prompt = prompts.get(id);
    if (prompt) {
      prompt.isDefault = true;
      prompt.updatedAt = new Date().toISOString();
    }
  },
};
