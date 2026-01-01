
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const creditUsage = pgTable("credit_usage", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  conversationId: integer("conversation_id"),
  action: text("action").notNull(), // chat, image_generation, screenshot, etc.
  creditsUsed: integer("credits_used").notNull(),
  metadata: text("metadata"), // JSON string with additional context
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertCreditUsageSchema = createInsertSchema(creditUsage).omit({
  id: true,
  createdAt: true,
});

export type CreditUsage = typeof creditUsage.$inferSelect;
export type InsertCreditUsage = z.infer<typeof insertCreditUsageSchema>;
