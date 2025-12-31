
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const assistantPrompts = pgTable("assistant_prompts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  instructions: text("instructions").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertAssistantPromptSchema = createInsertSchema(assistantPrompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AssistantPrompt = typeof assistantPrompts.$inferSelect;
export type InsertAssistantPrompt = z.infer<typeof insertAssistantPromptSchema>;
