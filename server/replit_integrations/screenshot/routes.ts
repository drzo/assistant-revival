
import { Router } from "express";
import { captureScreenshot } from "./index";

const router = Router();

router.post("/screenshot", async (req, res) => {
  try {
    const { url, fullPage, viewport } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const screenshot = await captureScreenshot({
      url,
      fullPage,
      viewport
    });

    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error: any) {
    console.error("Screenshot error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
