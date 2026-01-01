import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Organization Persona - The collective identity and knowledge of an organization
export const orgPersonas = pgTable("org_personas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  systemPrompt: text("system_prompt").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Organization Memory - Stores collective knowledge, decisions, and context
export const orgMemories = pgTable("org_memories", {
  id: serial("id").primaryKey(),
  personaId: integer("persona_id").references(() => orgPersonas.id).notNull(),
  category: text("category").notNull(), // e.g., "decision", "knowledge", "pattern", "context"
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  importance: integer("importance").default(5).notNull(), // 1-10 scale
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Organization Artifacts - Reusable patterns, templates, and code snippets
export const orgArtifacts = pgTable("org_artifacts", {
  id: serial("id").primaryKey(),
  personaId: integer("persona_id").references(() => orgPersonas.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., "template", "pattern", "snippet", "config"
  content: text("content").notNull(),
  language: text("language"),
  tags: text("tags").array(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Organization Skillsets - Capabilities and expertise areas
export const orgSkillsets = pgTable("org_skillsets", {
  id: serial("id").primaryKey(),
  personaId: integer("persona_id").references(() => orgPersonas.id).notNull(),
  domain: text("domain").notNull(), // e.g., "frontend", "backend", "devops", "security"
  skills: text("skills").array().notNull(),
  proficiencyLevel: integer("proficiency_level").default(5).notNull(), // 1-10 scale
  resources: text("resources").array(), // Links to documentation, tutorials, etc.
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Zod schemas for validation
export const insertOrgPersonaSchema = createInsertSchema(orgPersonas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrgMemorySchema = createInsertSchema(orgMemories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrgArtifactSchema = createInsertSchema(orgArtifacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrgSkillsetSchema = createInsertSchema(orgSkillsets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// TypeScript types
export type OrgPersona = typeof orgPersonas.$inferSelect;
export type InsertOrgPersona = z.infer<typeof insertOrgPersonaSchema>;

export type OrgMemory = typeof orgMemories.$inferSelect;
export type InsertOrgMemory = z.infer<typeof insertOrgMemorySchema>;

export type OrgArtifact = typeof orgArtifacts.$inferSelect;
export type InsertOrgArtifact = z.infer<typeof insertOrgArtifactSchema>;

export type OrgSkillset = typeof orgSkillsets.$inferSelect;
export type InsertOrgSkillset = z.infer<typeof insertOrgSkillsetSchema>;