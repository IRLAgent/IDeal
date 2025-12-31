# Umami Analytics Setup Guide

## Overview

**Frontend Integration: ✅ COMPLETE**

The tracking code has already been added to your application. You just need to:
1. Deploy Umami to Railway
2. Add environment variables to your frontend
3. Verify tracking is working

**What's Already Integrated:**
- ✅ Tracking script in layout.tsx
- ✅ Analytics utility functions (search, view-listing, message-sent, create-listing, photo-upload, auth)
- ✅ Event tracking on all key pages
- ✅ Custom events with metadata

---

## Step 1: Deploy Umami on Railway

### Option A: Using Railway Template (Easiest)

1. Go to: https://railway.app/template/umami
2. Click **"Deploy Now"**
3. Connect to your Railway account (if not already)
4. Configure environment variables:
   - `DATABASE_URL`: Use your existing PostgreSQL database URL from Railway
   - Railway will auto-generate other variables
5. Click **"Deploy"**
6. Wait for deployment to complete (~2-3 minutes)
7. Click on your new Umami service → **"Settings"** → **"Networking"** → **"Generate Domain"**
8. Copy your Umami URL (e.g., `umami-production.up.railway.app`)

### Option B: Manual Deployment

```bash
# 1. Login to Railway
railway login

# 2. In your project
railway link

# 3. Add new service
railway service create umami

# 4. Add environment variables
railway variables set DATABASE_URL=<your-postgres-url>
railway variables set APP_SECRET=<generate-random-secret>

# 5. Deploy Umami
railway up
```

## Step 2: Initial Umami Setup

1. Visit your Umami URL (e.g., `https://umami-production.up.railway.app`)
2. Default login:
   - Username: `admin`
   - Password: `umami`
3. **Immediately change the password!** (Settings → Profile → Change Password)
4. Go to **Settings** → **Websites** → **Add Website**
5. Enter:
   - Name: `CarMarket IE`
   - Domain: `yourdomain.ie` (or `localhost:3000` for testing)
6. Click **Save**
7. Copy the **Website ID** (looks like: `a1b2c3d4-5678-90ab-cdef-1234567890ab`)

## Step 3: Add Environment Variables

Add to your `.env.local` file:

```bash
# Umami Analytics
NEXT_PUBLIC_UMAMI_URL=https://your-umami-url.railway.app
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-from-step-2
```

## Step 4: Update Frontend Code

The tracking script has already been added to `layout.tsx`.

Just update the environment variables and restart your dev server:

```bash
cd frontend
npm run dev
```

## Step 5: Verify It's Working

1. Visit your site: `http://localhost:3000`
2. Browse a few pages
3. Go to your Umami dashboard
4. Click on your website
5. You should see realtime page views appearing!

## Step 6: Deploy to Production

Once verified locally:

1. Add the environment variables to your production deployment (Vercel/Railway)
2. Deploy your updated frontend
3. Update the Umami website domain to your production domain

## Custom Events Already Configured

The following events are automatically tracked:
- `search` - When users search for cars
- `view-listing` - When users view a car listing
- `message-sent` - When users send a message
- `create-listing` - When sellers create a listing
- `photo-upload` - When sellers upload photos

## Viewing Analytics

**Dashboard Access:** Your Umami URL + `/settings/websites`

**What you'll see:**
- Realtime visitors
- Page views
- Top pages
- Traffic sources
- Browser/Device breakdown
- Geographic data
- Custom events

## Troubleshooting

**Not seeing data?**
1. Check browser console for errors
2. Verify environment variables are set
3. Ensure Umami service is running on Railway
4. Check that Website ID matches your Umami dashboard
5. Try in incognito mode (ad blockers might block tracking)

**Database issues?**
- Umami creates its own tables in your PostgreSQL database
- Check Railway logs for Umami service
- Ensure DATABASE_URL has proper permissions

## Cost

Expected additional Railway costs: **~$3-5/month** for the Umami service.

## Security

- Change default admin password immediately
- Use strong APP_SECRET
- Keep Umami updated (check for updates monthly)
- Consider adding authentication middleware if exposing publicly

## Updates

Update Umami periodically:

```bash
railway service
# Select umami
railway up --detach
```

Or redeploy from the Railway dashboard.
