# Making Your Railway App Publicly Accessible

Railway automatically provides a public domain, but you need to generate it. Here's how:

## Steps to Get a Public Domain on Railway

### 1. Generate Public Domain

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in and select your project

2. **Navigate to Your Service**
   - Click on your service (the one running your app)

3. **Go to Settings**
   - Click on **"Settings"** tab (or the gear icon)

4. **Generate Public Domain**
   - Scroll down to **"Networking"** section
   - Look for **"Generate Domain"** or **"Public Domain"** button
   - Click **"Generate Domain"**
   - Railway will create a domain like: `your-app-name.up.railway.app`

### 2. Alternative: Via Service Settings

If you don't see the domain option:

1. Click on your **service** in the Railway dashboard
2. Look for **"Networking"** or **"Domains"** section
3. Click **"Generate Domain"** or **"Create Public Domain"**
4. Railway will assign a domain automatically

### 3. Verify Domain is Active

Once generated:
- ✅ The domain will be shown in your service settings
- ✅ It will be publicly accessible (HTTPS enabled automatically)
- ✅ You can copy the URL and share it

## Domain Format

Railway domains follow this format:
```
https://your-service-name.up.railway.app
```

Example:
```
https://quran-memorise-production.up.railway.app
```

## Troubleshooting

### Domain Not Showing Up

1. **Check Service Status**
   - Make sure your service is deployed and running
   - Check the "Deployments" tab for successful deployments

2. **Check Service Type**
   - Make sure it's a web service (not a database or other service type)
   - Railway only provides domains for web services

3. **Regenerate Domain**
   - If domain was deleted, you can regenerate it
   - Go to Settings → Networking → Generate Domain

### Domain Not Accessible

1. **Check Service is Running**
   - Verify the service shows "Active" status
   - Check logs for any errors

2. **Check Port Configuration**
   - Railway automatically handles port mapping
   - Your app should listen on the PORT environment variable

3. **Check Build Status**
   - Make sure the latest deployment succeeded
   - Check build logs for errors

## Custom Domain (Optional)

To use your own domain:

1. Go to **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Enter your domain name (e.g., `quran-memorise.com`)
4. Railway will provide DNS records to add:
   - CNAME record pointing to Railway's domain
   - Or A record with Railway's IP
5. Railway automatically provisions SSL certificate

## Quick Checklist

- [ ] Service is deployed and running
- [ ] Generated public domain in Railway settings
- [ ] Domain is shown in Networking section
- [ ] Service status is "Active"
- [ ] Latest deployment succeeded

---

**Note:** Railway automatically provides HTTPS/SSL for all domains, so your app will be secure by default!

