
import { db } from "../../db";
import { creditUsage } from "@shared/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export interface IEditRequestStorage {
  recordEditRequest(userId: string, cost: number): Promise<void>;
  getMonthlyUsage(userId: string): Promise<number>;
  getRemainingCredits(userId: string, monthlyAllowance: number): Promise<number>;
}

export const editRequestStorage: IEditRequestStorage = {
  async recordEditRequest(userId: string, cost: number) {
    if (!db) return;

    await db.insert(creditUsage).values({
      userId,
      action: 'edit_request',
      creditsUsed: cost,
    });
  },

  async getMonthlyUsage(userId: string) {
    if (!db) return 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [result] = await db
      .select({ total: sql<number>`sum(${creditUsage.creditsUsed})` })
      .from(creditUsage)
      .where(
        and(
          eq(creditUsage.userId, userId),
          gte(creditUsage.createdAt, startOfMonth)
        )
      );

    return result?.total || 0;
  },

  async getRemainingCredits(userId: string, monthlyAllowance: number) {
    const used = await this.getMonthlyUsage(userId);
    return Math.max(0, monthlyAllowance - used);
  },
};
