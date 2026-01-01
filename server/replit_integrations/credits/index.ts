
import { db } from "../../db";
import { creditUsage, type InsertCreditUsage } from "@shared/models/credit-usage";
import { eq, sum, and, gte, desc } from "drizzle-orm";

export const CREDIT_COSTS = {
  chat_message: 1,
  image_generation: 10,
  screenshot: 2,
  url_scraping: 3,
  file_upload: 1,
};

export async function trackCreditUsage(data: InsertCreditUsage): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  await db.insert(creditUsage).values(data);
}

export async function getUserCreditUsage(userId: string, days: number = 30): Promise<number> {
  if (!db) return 0;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const result = await db
    .select({ total: sum(creditUsage.creditsUsed) })
    .from(creditUsage)
    .where(and(
      eq(creditUsage.userId, userId),
      gte(creditUsage.createdAt, cutoffDate)
    ));

  return Number(result[0]?.total || 0);
}

export async function getCreditHistory(userId: string, limit: number = 50) {
  if (!db) return [];
  return db
    .select()
    .from(creditUsage)
    .where(eq(creditUsage.userId, userId))
    .orderBy(desc(creditUsage.createdAt))
    .limit(limit);
}
