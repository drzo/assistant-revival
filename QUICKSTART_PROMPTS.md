# Quick Start: Import Assistant Prompts

## 🚀 Fast Track (5 Minutes)

### Option 1: Application Import (Recommended)

1. **Edit the server file**:
   ```bash
   # Open server/index.ts and uncomment lines 77-78
   nano server/index.ts
   ```

2. **Start the application**:
   ```bash
   npm install  # if not already done
   npm run dev
   ```

3. **Watch the import**:
   ```
   ✓ Imported 10 prompts...
   ✓ Imported 20 prompts...
   ...
   ✅ Successfully imported: 181
   ```

4. **Comment out the import lines** (after successful import):
   ```typescript
   // const { seedAllPrompts } = await import("./replit_integrations/assistant-prompts/seed-all");
   // await seedAllPrompts();
   ```

5. **Done!** Open the app and select from 181 prompts.

### Option 2: SQL Import (Fastest)

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Import
psql $DATABASE_URL < import_prompts.sql

# Done! Restart your app
npm run dev
```

## 🎯 What You Get

- **181 Custom Prompts** ready to use
- **Specialized AI Agents**: OpenHands, Aider, Cline, Windsurf
- **Cognitive Systems**: Deep Tree Echo, UniCog, zonecog
- **Creative Prompts**: Unicorn Hyper-Forest, Unicorn Dreams
- **Development Tools**: GitHub Skills, VM Daemon, Cloud integrations
- **And much more...**

## ✅ Verify Import

### In the UI
1. Open http://localhost:5000
2. Click the settings/prompts icon
3. See all 181 prompts in the dropdown

### Via API
```bash
curl http://localhost:5000/api/assistant-prompts | jq 'length'
# Should output: 181 (or more)
```

### In Database
```sql
SELECT COUNT(*) FROM assistant_prompts;
-- Should return: 181 (or more)
```

## 🎨 Try These Prompts

### For Coding
- **Default Assistant** - General coding help
- **Detailed & Thorough** - In-depth explanations
- **Quick & Concise** - Fast answers

### For AI/ML
- **Deep Tree Echo** - Cognitive architecture design
- **UniCog** - OpenCog with AtomSpace
- **zonecog** - Programming paradigm organization

### For Fun
- **✨Unicorn✨🦄✨** - Whimsical creative assistant
- **Unicorn Dreams** - Aspirational synthesis

### For DevOps
- **VM Daemon GitHub Skills** - GitHub Actions automation
- **Mastra Cloud** - Cloud integration
- **Cloudflare** - Edge computing

## 🔧 Troubleshooting

**Prompts not showing?**
- Clear browser cache
- Restart the application
- Check console for errors

**Import failed?**
- Check database connection
- Verify file paths
- Review error messages

**Duplicates?**
- App import skips duplicates automatically
- SQL import may create duplicates (use app import instead)

## 📚 More Info

- **Full Guide**: See `IMPORT_PROMPTS_README.md`
- **Technical Details**: See `PROMPTS_IMPLEMENTATION_SUMMARY.md`
- **Source Data**: See `assistant_prompts.json`

## 🎉 You're Ready!

Start chatting with your new AI assistants. Try different prompts to find your favorites!

---

**Need Help?** Check the full documentation or review the implementation summary.
