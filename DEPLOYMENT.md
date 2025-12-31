# Deployment Guide - Assistant Memorial Edition

## Quick Deploy to Railway

Railway is the recommended platform for deploying this application. It's simple, affordable, and perfect for personal projects.

### Prerequisites
- GitHub account
- Railway account (free tier available)
- OpenAI API key (from Replit AI Integrations)

### Step 1: Push to GitHub

```bash
cd /home/ubuntu/assistant-revival

# Add all files
git add .

# Commit
git commit -m "Initial commit: Assistant Memorial Edition"

# Create a new repository on GitHub
# Then push (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/assistant-revival.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `assistant-revival` repository
6. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to your project
2. Click **"Variables"** tab
3. Add these environment variables:

```
NODE_ENV=production
PORT=5000
AI_INTEGRATIONS_OPENAI_API_KEY=your_api_key_here
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.replit.com/openai/v1
```

### Step 4: Deploy

1. Click **"Deploy"** button
2. Railway will build and deploy automatically
3. Once deployed, you'll get a public URL

### Step 5: Access Your App

- Railway provides a free domain: `your-project.railway.app`
- Your app is now live and accessible 24/7!

## Custom Domain (Optional)

To use your own domain:

1. In Railway dashboard, go to **Settings**
2. Click **"Custom Domain"**
3. Enter your domain name
4. Update your domain's DNS records to point to Railway
5. Railway will provide the DNS values

## Monitoring & Logs

In Railway dashboard:

- **Logs**: View real-time application logs
- **Metrics**: Monitor CPU, memory, and network usage
- **Deployments**: View deployment history and rollback if needed

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI base URL | `https://api.replit.com/openai/v1` |

## Troubleshooting

### Build Fails
- Check that `npm install` and `npm run build` work locally
- Verify Node.js version compatibility (18+)
- Check build logs in Railway dashboard

### App Crashes After Deploy
- Check environment variables are set correctly
- View logs in Railway dashboard for error messages
- Ensure OpenAI API key is valid

### Slow Performance
- Railway free tier has limited resources
- Consider upgrading to paid tier for better performance
- Check application logs for bottlenecks

## Costs

**Railway Free Tier:**
- $5 monthly credit (usually covers small projects)
- Perfect for personal use
- No credit card required to start

**Paid Plans:**
- Pay-as-you-go pricing
- Only pay for what you use
- Scales automatically

## Backup & Data

Since the app uses in-memory storage:
- Data is reset when the app restarts
- To persist data, implement a database (PostgreSQL recommended)
- Consider adding database backup strategy

## Next Steps

1. **Add Custom Domain**: Set up your own domain name
2. **Enable HTTPS**: Railway provides free SSL/TLS
3. **Set Up Monitoring**: Configure alerts for downtime
4. **Optimize Performance**: Monitor and optimize as needed

## Support

For Railway support: [railway.app/docs](https://railway.app/docs)

For application issues: Check logs and refer to README.md

---

**Your Assistant Memorial Edition is now live and accessible 24/7! 🚀**
