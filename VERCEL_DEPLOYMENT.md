# Deploying sarkarijobs.cc to Vercel

## Steps to Deploy

### 1. Login to Vercel CLI
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account.

### 2. Deploy the Project
```bash
vercel --prod
```

When prompted:
- Set up and deploy: `Y`
- Which scope: Choose your account
- Link to existing project? `N` (if first time) or `Y` (if updating)
- Project name: `sarkarijob-cc`
- Directory: `./` (current directory)
- Override settings? `N`

### 3. Add Custom Domain

#### Option A: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your `sarkarijob-cc` project
3. Go to Settings → Domains
4. Add `sarkarijobs.cc`
5. Add `www.sarkarijobs.cc`

#### Option B: Via CLI
```bash
vercel domains add sarkarijobs.cc
```

### 4. Configure DNS in Cloudflare

Since you bought the domain in Cloudflare, configure DNS:

1. Log into Cloudflare Dashboard
2. Select `sarkarijobs.cc` domain
3. Go to DNS settings
4. Add these records:

```
Type: CNAME
Name: @ (or sarkarijobs.cc)
Target: cname.vercel-dns.com
Proxy: OFF (DNS only)

Type: CNAME  
Name: www
Target: cname.vercel-dns.com
Proxy: OFF (DNS only)
```

**Important**: Make sure Cloudflare proxy (orange cloud) is OFF for Vercel to work properly.

### 5. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:
```
NODE_ENV=production
```

(R2 credentials are not needed since PDFs are publicly accessible)

### 6. Verify Deployment

After DNS propagation (5-30 minutes):
- Visit https://sarkarijobs.cc
- Visit https://www.sarkarijobs.cc
- Test a job detail page
- Test downloading an application form

## Automatic Deployments

Your project is connected to GitHub. Every push to `main` branch will trigger automatic deployment.

## Build Settings (Already Configured)

The project already has proper build settings in `package.json`:
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `npm run dev`

## Troubleshooting

### If build fails:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### If domain doesn't work:
1. Check DNS propagation: https://dnschecker.org
2. Verify CNAME records in Cloudflare
3. Ensure Cloudflare proxy is OFF
4. Check domain configuration in Vercel dashboard

### If PDFs don't load:
1. Verify R2 bucket is public
2. Check R2 URLs are correct
3. Test direct R2 URL access

## Quick Deploy Command

After initial setup, deploy updates with:
```bash
git add .
git commit -m "Update"
git push origin main
```

Vercel will automatically deploy from GitHub.