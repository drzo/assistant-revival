# Deploy to Render.com - Step by Step

## Why Render?

- ✅ **Free Tier**: Perfect for personal projects
- ✅ **Easy Setup**: Deploy from GitHub in minutes
- ✅ **Automatic Deploys**: Push to GitHub = auto-deploy
- ✅ **Free SSL**: HTTPS included
- ✅ **No Credit Card**: Free tier doesn't require payment info

## Quick Deploy (5 Minutes)

### Step 1: Go to Render
Visit: https://render.com

### Step 2: Sign Up/Sign In
- Click "Get Started for Free"
- Sign in with GitHub
- Authorize Render to access your repositories

### Step 3: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub account if not already connected
4. Find and select "drzo/assistant-revival"

### Step 4: Configure Service
Render will auto-detect the configuration from `render.yaml`, but verify:

- **Name**: assistant-revival (or customize)
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free

### Step 5: Add Environment Variables
Click "Advanced" and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Your OpenAI API key |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | `https://api.replit.com/openai/v1` |

### Step 6: Deploy
1. Click "Create Web Service"
2. Render will:
   - Clone your repository
   - Install dependencies
   - Build the application
   - Deploy it live
3. Wait 3-5 minutes for first deployment

### Step 7: Access Your App
Once deployed, you'll get a URL like:
```
https://assistant-revival.onrender.com
```

Your Assistant Memorial Edition is now live! 🎉

## Features

### Automatic Deployments
- Push to GitHub → Render auto-deploys
- No manual steps needed
- Rollback available if needed

### Free SSL/HTTPS
- Automatic HTTPS certificate
- Secure by default
- No configuration needed

### Monitoring
- View logs in real-time
- Monitor resource usage
- Set up alerts

### Custom Domain (Optional)
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records
4. Render handles SSL automatically

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify `package.json` scripts are correct
- Ensure all dependencies are listed

### App Crashes
- Check application logs
- Verify environment variables are set
- Test locally first: `npm run build && npm start`

### Slow Cold Starts
- Free tier spins down after inactivity
- First request after idle takes ~30 seconds
- Upgrade to paid tier for always-on

## Costs

### Free Tier
- 750 hours/month (enough for 1 service 24/7)
- Spins down after 15 minutes of inactivity
- Perfect for personal projects
- No credit card required

### Paid Tiers
- Starter: $7/month (always-on)
- Standard: $25/month (more resources)
- Pro: Custom pricing

## Monitoring & Maintenance

### View Logs
```
Dashboard → Your Service → Logs
```

### Check Status
```
Dashboard → Your Service → Events
```

### Redeploy
```
Dashboard → Your Service → Manual Deploy → Deploy latest commit
```

### Rollback
```
Dashboard → Your Service → Events → Rollback to previous deploy
```

## Next Steps

1. ✅ Deploy to Render (follow steps above)
2. ✅ Test all features
3. ✅ Add custom domain (optional)
4. ✅ Set up monitoring
5. ✅ Share your app!

## Support

- **Render Docs**: https://render.com/docs
- **GitHub Repo**: https://github.com/drzo/assistant-revival
- **Status Page**: https://status.render.com

---

**Your Assistant Memorial Edition will be live at:**
`https://assistant-revival.onrender.com`

**Deployment Time**: ~5 minutes
**Cost**: $0 (Free tier)
**Uptime**: 24/7 (with cold starts on free tier)

🚀 **Ready to deploy!**
