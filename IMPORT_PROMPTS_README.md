# Assistant Prompts Import Guide

This guide explains how to import the 181 custom assistant prompts into the Assistant Revival application.

## Overview

The import process has been automated with the following generated files:

- **`import_prompts.sql`** - Direct SQL import file for PostgreSQL
- **`server/replit_integrations/assistant-prompts/seed-all.ts`** - TypeScript seed function for app-level import
- **`import_prompts.py`** - Python script that generated the above files

## Imported Prompts Summary

- **Total Prompts**: 181
- **Unique Names**: 180 (1 duplicate was renamed with a suffix)
- **Default Prompts**: 1 (Default Assistant)
- **Notable Prompts**:
  - ✨Unicorn✨🦄✨ (Unicorn Hyper-Forest Council)
  - Deep Tree Echo (Cognitive Architecture)
  - VM Daemon GitHub Skills
  - OpenHands Agent (CodeActAgent)
  - zonecog (OpenCog folder partitions)
  - And 176 more specialized prompts

## Import Methods

### Method 1: Application-Level Import (Recommended)

This method uses the TypeScript seed function and integrates with the existing application logic.

**Steps:**

1. Edit `server/index.ts` and uncomment lines 77-78:

```typescript
// Seed all assistant prompts from imported data (run once)
const { seedAllPrompts } = await import("./replit_integrations/assistant-prompts/seed-all");
await seedAllPrompts();
```

2. Start the application:

```bash
npm run dev
```

3. The prompts will be imported automatically on startup. Check the console for import progress.

4. After successful import, **comment out the lines again** to prevent re-importing on every restart.

**Advantages:**
- Respects existing application logic
- Handles duplicates gracefully (skips existing prompts)
- Provides detailed import statistics
- No direct database access required

### Method 2: Direct SQL Import

This method directly imports prompts into the PostgreSQL database.

**Steps:**

1. Ensure your database is running and you have connection credentials.

2. Run the SQL import:

```bash
psql -h <hostname> -U <username> -d <database> -f import_prompts.sql
```

Or if using a connection URL:

```bash
psql <DATABASE_URL> < import_prompts.sql
```

3. Restart the application to see the new prompts.

**Advantages:**
- Fast bulk import
- No application restart needed during import
- Useful for production deployments

**Disadvantages:**
- Requires direct database access
- May create duplicates if prompts already exist

## Verification

After importing, verify the prompts were added:

### Via Application UI

1. Open the application in your browser
2. Click the settings/prompts icon in the chat interface
3. You should see all 181 prompts in the prompt selector

### Via API

```bash
curl http://localhost:5000/api/assistant-prompts
```

### Via Database

```sql
SELECT COUNT(*) FROM assistant_prompts;
-- Should return 181 (or more if you had existing prompts)

SELECT name FROM assistant_prompts ORDER BY name LIMIT 10;
-- Should show prompt names
```

## Prompt Categories

The imported prompts cover various domains:

1. **Coding Assistants**: Default Assistant, Detailed & Thorough, Quick & Concise
2. **Specialized AI Agents**: OpenHands, Aider, Cline, Windsurf
3. **Cognitive Architectures**: Deep Tree Echo, UniCog, zonecog
4. **Creative Systems**: Unicorn Dreams, Unicorn Hyper-Forest
5. **Development Tools**: VM Daemon GitHub Skills, GitHub Actions workflows
6. **Domain-Specific**: Mastra Cloud, Supabase, Cloudflare, Stripe integrations
7. **And many more...**

## Troubleshooting

### Import Fails with "Duplicate Key" Error

The TypeScript seed function handles duplicates automatically by skipping them. If using SQL import and you get duplicate key errors:

1. The SQL file includes a statement to unset existing defaults
2. Remove the duplicate prompts manually or truncate the table first:

```sql
-- Backup first!
CREATE TABLE assistant_prompts_backup AS SELECT * FROM assistant_prompts;

-- Then truncate
TRUNCATE assistant_prompts RESTART IDENTITY CASCADE;
```

### Prompts Not Showing in UI

1. Clear browser cache and localStorage
2. Restart the application
3. Check browser console for errors
4. Verify database connection

### Import Seems Incomplete

Check the import logs:

```bash
# If using app-level import
npm run dev | grep "Import Summary"

# If using SQL import
psql <DATABASE_URL> -c "SELECT COUNT(*) FROM assistant_prompts;"
```

## Customization

### Adding More Prompts

1. Edit `assistant_prompts.json` to add new prompts
2. Re-run the Python script:

```bash
python3 import_prompts.py
```

3. Import using either method above

### Modifying Existing Prompts

Use the application UI or API to update prompts after import:

```bash
curl -X PATCH http://localhost:5000/api/assistant-prompts/<id> \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name", "instructions": "New instructions"}'
```

## File Structure

```
assistant-revival/
├── assistant_prompts.json              # Source data (181 prompts)
├── import_prompts.py                   # Generator script
├── import_prompts.sql                  # Generated SQL import
├── IMPORT_PROMPTS_README.md           # This file
└── server/
    └── replit_integrations/
        └── assistant-prompts/
            ├── seed.ts                 # Original default seed
            └── seed-all.ts             # Generated bulk seed (181 prompts)
```

## Next Steps

After successful import:

1. **Test the prompts**: Try different prompts in the chat interface
2. **Set your default**: Choose a default prompt that fits your workflow
3. **Customize**: Edit or create new prompts as needed
4. **Share**: Export your favorite prompts to share with others

## Support

For issues or questions:

1. Check the application logs
2. Review the database state
3. Verify the generated files are correct
4. Re-run the Python script if needed

---

**Generated**: 2025-12-31
**Prompts Imported**: 181
**Status**: Ready for deployment ✅
