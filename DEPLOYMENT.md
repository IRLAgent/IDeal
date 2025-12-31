# Deployment Guide for i-deal.ie

This guide covers deploying the CarMarket.ie application to production with your custom domain `i-deal.ie`.

## Prerequisites

- Domain `i-deal.ie` registered with Blacknight Hosting
- GitHub account with repository access
- Vercel account (free tier works)
- Backend deployed on Railway (already done)

## Part 1: Deploy Frontend to Vercel

### 1.1 Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 1.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 1.3 Deploy Frontend

```bash
cd frontend
vercel
```

When prompted:
- **Set up and deploy**: `Y`
- **Which scope**: Select your account
- **Link to existing project**: `N` (first time)
- **What's your project's name**: `i-deal-ie` or `carmarket-ie`
- **In which directory is your code located**: `./`
- **Want to override settings**: `N`

Vercel will build and deploy your app. Note the deployment URL (e.g., `https://i-deal-ie.vercel.app`).

### 1.4 Deploy to Production

```bash
vercel --prod
```

## Part 2: Configure Environment Variables in Vercel

### 2.1 Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project (`i-deal-ie`)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for **Production**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.railway.app/api` |
| `NEXT_PUBLIC_UMAMI_URL` | `https://umami-production-fa82.up.railway.app` |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | `189300f6-9499-4e12-a5c7-0013a5d152ee` |

5. Click **Save**
6. Go to **Deployments** tab and click **Redeploy** on the latest deployment

### 2.2 Via CLI (Alternative)

```bash
cd frontend
vercel env add NEXT_PUBLIC_API_URL production
# Paste your backend URL when prompted

vercel env add NEXT_PUBLIC_UMAMI_URL production
# Paste Umami URL when prompted

vercel env add NEXT_PUBLIC_UMAMI_WEBSITE_ID production
# Paste Website ID when prompted
```

## Part 3: Add Custom Domain in Vercel

### 3.1 Add Domain

1. In Vercel dashboard, go to your project
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `i-deal.ie`
5. Click **Add**
6. Repeat steps 3-5 for: `www.i-deal.ie`

### 3.2 Note DNS Configuration

Vercel will display the required DNS configuration. It will look like:

**For i-deal.ie:**
- Type: `A` (or `CNAME` if supported)
- Name: `@`
- Value: `76.76.21.21` (and other IPs) or `cname.vercel-dns.com`

**For www.i-deal.ie:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

## Part 4: Configure DNS in Blacknight Hosting

### 4.1 Login to Blacknight

1. Go to https://www.blacknight.com
2. Login to your account
3. Navigate to **Domains** → **Manage DNS**
4. Select `i-deal.ie`

### 4.2 Remove Conflicting Records FIRST

**IMPORTANT**: Delete existing records before adding new ones to avoid "conflicts with preexisting rrset" error.

**Delete these if they exist:**
1. Any `A` records for `@` (root domain)
2. Any `CNAME` records for `@`
3. Any `A` records for `www`
4. Any `CNAME` records for `www`
5. Any `AAAA` records (IPv6) for `@` or `www`

**DO NOT DELETE:**
- `MX` records (email)
- `TXT` records (SPF, DKIM, domain verification)
- `NS` records (nameservers)

### 4.3 Add New DNS Records

**Option A: If Blacknight supports CNAME/ALIAS for root domain (Recommended)**

Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` or `ALIAS` | `@` | `cname.vercel-dns.com` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

**Option B: If only A records are supported for root domain**

Add these records **one at a time**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | `76.76.21.21` | 3600 |
| `A` | `@` | `76.76.21.98` | 3600 |
| `A` | `@` | `76.76.21.142` | 3600 |
| `A` | `@` | `76.76.21.164` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

**Note**: Multiple `A` records for the same name are allowed and provide redundancy.

### 4.4 Save Changes

Save the DNS configuration and wait for propagation.

## Part 5: Verify Deployment

### 5.1 DNS Propagation Check

DNS changes can take 5 minutes to 48 hours. Check status:

```bash
nslookup i-deal.ie
nslookup www.i-deal.ie
```

Or use online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

### 5.2 Verify in Vercel

1. Go to Vercel dashboard → Your project → **Domains**
2. Wait for checkmarks next to both domains
3. Vercel will automatically provision SSL certificates

### 5.3 Test Your Site

Once DNS propagates, visit:
- https://i-deal.ie
- https://www.i-deal.ie

Both should load your site with HTTPS (SSL).

## Part 6: Update Backend CORS Settings

### 6.1 Add Domain to Backend

In your backend code, update CORS to allow your domain:

**File: `backend/src/index.ts`**

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://i-deal.ie',
    'https://www.i-deal.ie',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

### 6.2 Deploy Backend Changes

```bash
cd backend
git add .
git commit -m "feat: add production domain to CORS"
git push
```

Railway will automatically redeploy.

## Part 7: Continuous Deployment

### 7.1 Connect GitHub (Recommended)

1. In Vercel dashboard → Project → **Settings** → **Git**
2. Connect to GitHub repository
3. Enable automatic deployments for `main` branch

Now every push to `main` will automatically deploy to production.

### 7.2 Manual Deployment

If not using Git integration:

```bash
cd frontend
vercel --prod
```

## Troubleshooting

### Domain Not Working

**Problem**: Domain shows "Domain Not Found" or doesn't load

**Solutions**:
1. Check DNS propagation (can take up to 48 hours)
2. Verify DNS records are correct in Blacknight
3. Check Vercel dashboard shows green checkmarks
4. Clear browser cache / try incognito mode

### SSL Certificate Issues

**Problem**: "Not Secure" warning or SSL errors

**Solutions**:
1. Wait for Vercel to provision SSL (automatic, takes 5-10 minutes after DNS propagates)
2. In Vercel: Settings → Domains → click Refresh on domain
3. Ensure DNS is pointing correctly

### API Calls Failing

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Verify backend CORS allows your domain
3. Check backend is running on Railway
4. View browser console for specific errors

### Build Failures

**Problem**: Vercel deployment fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Custom domain added in Vercel
- [ ] DNS configured in Blacknight
- [ ] DNS propagated (green checkmarks in Vercel)
- [ ] HTTPS/SSL working
- [ ] Backend CORS updated
- [ ] Test user registration
- [ ] Test car listing creation
- [ ] Test image uploads
- [ ] Test search functionality
- [ ] Test messaging
- [ ] Analytics tracking working
- [ ] Mobile responsiveness verified
- [ ] Performance optimized

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy latest
vercel --prod

# Check DNS
nslookup i-deal.ie

# Test API endpoint
curl https://your-backend-url.railway.app/api/health
```

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Blacknight Support**: https://www.blacknight.com/support
- **Railway Docs**: https://docs.railway.app

## Next Steps

After deployment is complete:

1. **Set up monitoring**: Consider adding error tracking (Sentry)
2. **Configure backups**: Regular database backups on Railway
3. **Performance optimization**: Run Lighthouse audits
4. **SEO optimization**: Add meta tags, sitemap.xml
5. **Security review**: Enable rate limiting, validate inputs
6. **User testing**: Gather feedback and iterate

---

**Last Updated**: December 31, 2025
**Domain**: i-deal.ie
**Frontend**: Vercel (Next.js)
**Backend**: Railway (Node.js/Express)
**Database**: PostgreSQL (Railway)
