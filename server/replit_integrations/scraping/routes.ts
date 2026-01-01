
import type { Express, Request, Response } from "express";

function extractTitleFromHTML(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : 'Untitled';
}

export function registerScrapingRoutes(app: Express): void {
  // Scrape URL content
  app.post("/api/scrape", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ReplitAssistant/1.0)',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `Failed to fetch URL: ${response.statusText}` 
        });
      }

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      // Basic HTML content extraction
      let extractedText = text;
      if (contentType.includes('text/html')) {
        // Remove script and style tags
        extractedText = text
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      res.json({
        url,
        content: extractedText,
        contentType,
        title: extractTitleFromHTML(text),
      });
    } catch (error) {
      console.error("Error scraping URL:", error);
      res.status(500).json({ error: "Failed to scrape URL", details: error instanceof Error ? error.message : String(error) });
    }
  });
}
