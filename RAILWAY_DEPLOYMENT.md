# Railway Deployment Guide

This app is fully configured and ready to deploy on Railway.

## Prerequisites

- GitHub account with the repository pushed
- Railway account (free tier available)

## Deployment Steps

### 1. Connect Repository to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose `moh-dev-stack/quran-memorise`
6. Railway will automatically detect the Dockerfile

### 2. Automatic Configuration

Railway will automatically:
- ✅ Detect the Dockerfile
- ✅ Build the Docker image
- ✅ Set PORT environment variable (defaults to 3000)
- ✅ Deploy the application

### 2a. Generate Public Domain

**Important:** Railway doesn't automatically generate a public domain. You need to do this manually:

1. Go to your **service** in Railway dashboard
2. Click on **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"** button
5. Railway will create a public domain like: `your-app-name.up.railway.app`

Your app will then be publicly accessible at this URL!

### 3. Verify Deployment

Once deployed:
- Railway will show build logs
- The app will be available at `https://your-app-name.up.railway.app`
- You can check logs in Railway dashboard

### 4. Custom Domain (Optional)

1. Go to your project settings in Railway
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Railway will provide DNS instructions

## Configuration Files

### Dockerfile
- Uses Node.js 22 Alpine (lightweight)
- Multi-stage build for optimization
- Sets production environment variables
- Exposes port 3000
- Uses `npm start` which respects PORT env variable

### railway.json
- Configures Railway to use Dockerfile
- Sets restart policy for reliability
- No manual start command needed (uses Dockerfile CMD)

### Environment Variables

Railway automatically sets:
- `PORT` - Port number (Railway assigns this)
- `NODE_ENV=production` - Set in Dockerfile

No additional environment variables required!

## Troubleshooting

### Build Fails
- Check Railway build logs
- Verify Dockerfile syntax
- Ensure all dependencies are in package.json

### App Won't Start
- Check Railway logs
- Verify PORT is being used correctly
- Check that `npm start` command works

### Port Issues
- Railway automatically sets PORT
- Dockerfile uses `${PORT:-3000}` fallback
- No manual configuration needed

## Monitoring

Railway provides:
- Real-time logs
- Build history
- Deployment status
- Resource usage

## Support

If you encounter issues:
1. Check Railway build/deploy logs
2. Verify Dockerfile builds locally (if Docker available)
3. Check Railway status page
4. Review Next.js production documentation

---

**Ready to deploy!** Just connect your GitHub repo to Railway and it will automatically build and deploy.

