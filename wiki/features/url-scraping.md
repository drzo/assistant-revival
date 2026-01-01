
# URL Scraping & Screenshots

## Overview
Automatically scrape web page content or capture screenshots from URLs mentioned in chat, providing instant context from external sources.

## Key Features

### 1. Automatic URL Detection
- **Pattern Matching**: Detects URLs in messages
- **Action Suggestions**: Offers scrape or screenshot options
- **One-Click Processing**: Quick content extraction

### 2. Web Scraping
- **HTML Extraction**: Pull page content and structure
- **Text Parsing**: Extract readable text from pages
- **Metadata Capture**: Titles, descriptions, meta tags

### 3. Screenshot Capture
- **Visual Preview**: Capture page appearance
- **Full Page**: Screenshot entire page or viewport
- **Image Integration**: Screenshots appear in chat

## Technical Implementation

### URL Detection
```typescript
const urlPattern = /(https?:\/\/[^\s]+)/g;
const urls = message.match(urlPattern);
```

### Scraping Flow
1. Detect URL in user message
2. Offer scrape/screenshot options
3. Fetch and parse content
4. Extract relevant information
5. Display in chat context

### Screenshot Service
```typescript
interface ScreenshotRequest {
  url: string;
  fullPage?: boolean;
  viewport?: { width: number; height: number };
}
```

## Use Cases

### 1. Documentation Reference
- Scrape API documentation
- Extract code examples
- Reference technical articles

### 2. Design Inspiration
- Screenshot design examples
- Capture UI patterns
- Visual references for development

### 3. Content Analysis
- Analyze competitor websites
- Extract article content
- Research material gathering

## Integration Points

### Chat Integration
- Paste URL in message
- AI automatically offers actions
- Content added to conversation context

### File System
- Save scraped content as files
- Store screenshots in project
- Reference in future conversations

## Configuration

### Scraping Options
```typescript
{
  followRedirects: true,
  timeout: 10000,
  userAgent: 'AssistantBot/1.0',
  maxContentLength: 5242880  // 5MB
}
```

### Screenshot Options
```typescript
{
  format: 'png',
  fullPage: false,
  viewport: { width: 1280, height: 720 },
  quality: 80
}
```

## Best Practices

### Performance
- Cache frequently accessed URLs
- Set reasonable timeouts
- Limit content size

### Privacy & Security
- Respect robots.txt
- Handle authentication carefully
- Avoid scraping sensitive data

### Error Handling
- Handle 404 and network errors
- Timeout long-running requests
- Provide fallback options
