# Cloudflare R2 Setup Guide for SarkariJob Forms

## What This Does
Moves your 320MB of application forms (PDFs, JPGs, DOCX) from your Git repository to Cloudflare R2 storage, so your website stays under Vercel's 100MB free tier limit.

## Step 1: Create Cloudflare Account & R2 Bucket

1. **Sign up/Login** at [dash.cloudflare.com](https://dash.cloudflare.com)
   - Use your email (same as domain if you want)
   
2. **Enable R2**:
   - Click "R2" in left sidebar
   - Click "Create bucket"
   - Name: `sarkarijob-forms`
   - Location: Automatic
   - Click "Create bucket"

## Step 2: Get Your API Credentials

1. In R2 dashboard, click **"Manage R2 API tokens"**
2. Click **"Create API token"**
3. Configure token:
   - Name: `sarkarijob-upload`
   - Permissions: **Admin Read & Write** (for upload)
   - TTL: Leave default or set expiry
4. Click **"Create API Token"**
5. **SAVE THESE** (shown only once):
   ```
   Access Key ID: [long string]
   Secret Access Key: [longer string]
   ```
6. Also note your Account ID (in URL or R2 dashboard)

## Step 3: Configure Public Access

1. Go to your bucket `sarkarijob-forms`
2. Click **"Settings"** tab
3. Under **"Public access"**:
   - Click "Allow public access"
   - Add custom domain (optional): `forms.sarkarijobs.cc`

## Step 4: Update Upload Script

Edit `scripts/upload-to-r2.js` and replace:
```javascript
const R2_CONFIG = {
  accountId: 'YOUR_ACCOUNT_ID', // <-- Put your account ID here
  accessKeyId: 'YOUR_ACCESS_KEY_ID', // <-- Put Access Key ID here
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', // <-- Put Secret here
  bucketName: 'sarkarijob-forms'
};
```

## Step 5: Run Upload

```bash
cd /Users/v/code/dreadnought/sarkarijobs.cc
node scripts/upload-to-r2.js
```

This will:
- Upload all 293 files to R2
- Create `public/data/form-urls.json` with new URLs

## Step 6: Update Website Code

The website needs to use R2 URLs instead of local files. The upload script creates a mapping file that the website can use.

## Public URL Options

### Option A: R2.dev Domain (Quick)
Your files will be at:
```
https://[your-account-hash].r2.dev/sarkarijob-forms/filename.pdf
```

### Option B: Custom Domain (Professional)
1. Add subdomain in Cloudflare DNS: `forms.sarkarijobs.cc`
2. Connect to R2 bucket
3. Files will be at: `https://forms.sarkarijobs.cc/filename.pdf`

## Costs

**Your usage (320MB, ~10K downloads/month):**
- Storage: **FREE** (under 10GB free tier)
- Operations: **FREE** (under 1M/month free tier)
- Bandwidth: **FREE** (R2 has no egress fees!)

**Total: $0/month** ✨

## Security Notes

- The Secret Access Key is like a password - never commit it to Git
- After upload, you can delete the API token if not needed
- Files will be publicly readable (that's what we want)

## Questions?

**Q: Which Cloudflare account should I use?**
A: You can use your existing account where sarkarijobs.cc domain is, or create a new free account.

**Q: Is this the same account as my domain?**
A: It can be, but doesn't have to be. Using the same account makes custom domain setup easier.

**Q: What if upload fails?**
A: The script will show which files failed. You can run it again - it will re-upload everything.