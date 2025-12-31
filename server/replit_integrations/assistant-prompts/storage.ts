
import { db } from "../../db";
import type { AssistantPrompt } from "@shared/schema";

export interface IAssistantPromptStorage {
  getPrompt(id: string): Promise<AssistantPrompt | undefined>;
  getAllPrompts(): Promise<AssistantPrompt[]>;
  getDefaultPrompt(): Promise<AssistantPrompt | undefined>;
  createPrompt(name: string, instructions: string, isDefault?: boolean): Promise<AssistantPrompt>;
  updatePrompt(id: string, name?: string, instructions?: string, isDefault?: boolean): Promise<AssistantPrompt | undefined>;
  deletePrompt(id: string): Promise<void>;
  setDefaultPrompt(id: string): Promise<void>;
}

export const assistantPromptStorage: IAssistantPromptStorage = {
  async getPrompt(id: string) {
    return await db.getPrompt(id);
  },

  async getAllPrompts() {
    return await db.getAllPrompts();
  },

  async getDefaultPrompt() {
    return await db.getDefaultPrompt();
  },

  async createPrompt(name: string, instructions: string, isDefault = false) {
    return await db.createPrompt(name, instructions, isDefault);
  },

  async updatePrompt(id: string, name?: string, instructions?: string, isDefault?: boolean) {
    return await db.updatePrompt(id, name, instructions, isDefault);
  },

  async deletePrompt(id: string) {
    await db.deletePrompt(id);
  },

  async setDefaultPrompt(id: string) {
    await db.setDefaultPrompt(id);
  },
};
