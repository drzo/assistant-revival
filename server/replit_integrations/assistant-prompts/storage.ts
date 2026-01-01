
import { db } from "../../db";
import { assistantPrompts } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export interface IAssistantPromptStorage {
  getPrompt(id: number): Promise<typeof assistantPrompts.$inferSelect | undefined>;
  getAllPrompts(): Promise<(typeof assistantPrompts.$inferSelect)[]>;
  getDefaultPrompt(): Promise<typeof assistantPrompts.$inferSelect | undefined>;
  createPrompt(name: string, instructions: string, isDefault?: boolean): Promise<typeof assistantPrompts.$inferSelect>;
  updatePrompt(id: number, name?: string, instructions?: string, isDefault?: boolean): Promise<typeof assistantPrompts.$inferSelect | undefined>;
  deletePrompt(id: number): Promise<void>;
  setDefaultPrompt(id: number): Promise<void>;
}

// In-memory fallback storage when database is not available
const inMemoryPrompts: Map<number, typeof assistantPrompts.$inferSelect> = new Map();
let nextPromptId = 1;
let initialized = false;

function initializeFromSeedFile() {
  if (initialized) return;
  initialized = true;
  
  const seedPath = join(process.cwd(), 'server/data/prompts-seed.json');
  if (existsSync(seedPath)) {
    try {
      const data = JSON.parse(readFileSync(seedPath, 'utf-8'));
      let maxId = 0;
      for (const prompt of data) {
        const p = {
          ...prompt,
          createdAt: new Date(prompt.createdAt),
          updatedAt: new Date(prompt.updatedAt),
        };
        inMemoryPrompts.set(p.id, p);
        if (p.id > maxId) maxId = p.id;
      }
      nextPromptId = maxId + 1;
      console.log('Loaded ' + data.length + ' prompts from seed file');
    } catch (error) {
      console.error('Error loading prompts seed file:', error);
    }
  }
}

export const assistantPromptStorage: IAssistantPromptStorage = {
  async getPrompt(id: number) {
    if (!db) {
      initializeFromSeedFile();
      return inMemoryPrompts.get(id);
    }
    const [prompt] = await db.select().from(assistantPrompts).where(eq(assistantPrompts.id, id));
    return prompt;
  },

  async getAllPrompts() {
    if (!db) {
      initializeFromSeedFile();
      return Array.from(inMemoryPrompts.values()).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return db.select().from(assistantPrompts).orderBy(desc(assistantPrompts.createdAt));
  },

  async getDefaultPrompt() {
    if (!db) {
      initializeFromSeedFile();
      return Array.from(inMemoryPrompts.values()).find(p => p.isDefault);
    }
    const [prompt] = await db.select().from(assistantPrompts).where(eq(assistantPrompts.isDefault, true));
    return prompt;
  },

  async createPrompt(name: string, instructions: string, isDefault = false) {
    if (!db) {
      initializeFromSeedFile();
      if (isDefault) {
        inMemoryPrompts.forEach(p => p.isDefault = false);
      }
      const prompt = {
        id: nextPromptId++,
        name,
        instructions,
        isDefault,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as typeof assistantPrompts.$inferSelect;
      inMemoryPrompts.set(prompt.id, prompt);
      return prompt;
    }
    try {
      if (isDefault) {
        await db.update(assistantPrompts).set({ isDefault: false });
      }
      const [prompt] = await db.insert(assistantPrompts).values({ 
        name, 
        instructions, 
        isDefault 
      }).returning();
      return prompt;
    } catch (error) {
      console.error("Error creating prompt in database:", error);
      throw error;
    }
  },

  async updatePrompt(id: number, name?: string, instructions?: string, isDefault?: boolean) {
    if (!db) {
      initializeFromSeedFile();
      const prompt = inMemoryPrompts.get(id);
      if (!prompt) return undefined;
      if (name !== undefined) prompt.name = name;
      if (instructions !== undefined) prompt.instructions = instructions;
      if (isDefault !== undefined) {
        if (isDefault) {
          inMemoryPrompts.forEach(p => p.isDefault = false);
        }
        prompt.isDefault = isDefault;
      }
      prompt.updatedAt = new Date();
      return prompt;
    }
    const updates: any = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (instructions !== undefined) updates.instructions = instructions;
    if (isDefault !== undefined) {
      if (isDefault) {
        await db.update(assistantPrompts).set({ isDefault: false });
      }
      updates.isDefault = isDefault;
    }
    const [prompt] = await db.update(assistantPrompts).set(updates).where(eq(assistantPrompts.id, id)).returning();
    return prompt;
  },

  async deletePrompt(id: number) {
    if (!db) {
      initializeFromSeedFile();
      inMemoryPrompts.delete(id);
      return;
    }
    await db.delete(assistantPrompts).where(eq(assistantPrompts.id, id));
  },

  async setDefaultPrompt(id: number) {
    if (!db) {
      initializeFromSeedFile();
      inMemoryPrompts.forEach(p => p.isDefault = false);
      const prompt = inMemoryPrompts.get(id);
      if (prompt) prompt.isDefault = true;
      return;
    }
    await db.update(assistantPrompts).set({ isDefault: false });
    await db.update(assistantPrompts).set({ isDefault: true }).where(eq(assistantPrompts.id, id));
  },
};
