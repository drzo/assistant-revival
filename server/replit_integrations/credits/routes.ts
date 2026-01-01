
import { Router } from "express";
import { getUserCreditUsage, getCreditHistory } from "./index";

const router = Router();

router.get("/usage/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const total = await getUserCreditUsage(userId, days);

    res.json({ userId, days, totalCredits: total });
  } catch (error: any) {
    console.error("Credit usage error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const history = await getCreditHistory(userId, limit);

    res.json({ history });
  } catch (error: any) {
    console.error("Credit history error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
