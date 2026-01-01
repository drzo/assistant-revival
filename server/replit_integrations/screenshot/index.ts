
import type { Express } from "express";
import puppeteer from 'puppeteer';

export interface ScreenshotOptions {
  url: string;
  fullPage?: boolean;
  viewport?: {
    width: number;
    height: number;
  };
}

export async function captureScreenshot(options: ScreenshotOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    if (options.viewport) {
      await page.setViewport(options.viewport);
    }

    await page.goto(options.url, { waitUntil: 'networkidle2' });
    
    const screenshot = await page.screenshot({
      fullPage: options.fullPage ?? false,
      type: 'png'
    });

    return screenshot as Buffer;
  } finally {
    await browser.close();
  }
}

export function registerScreenshotRoutes(app: Express): void {
  app.post("/api/screenshot", async (req, res) => {
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
    } catch (error) {
      console.error("Screenshot error:", error);
      res.status(500).json({ 
        error: "Failed to capture screenshot",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
}
