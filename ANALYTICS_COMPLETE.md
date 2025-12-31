# Umami Analytics - Integration Complete 🎉

## Summary

Umami analytics has been fully integrated into your IDeal.ie car marketplace. The tracking code is ready to go - you just need to deploy Umami and configure environment variables.

---

## ✅ What's Been Done

### 1. **Tracking Script** ([frontend/src/app/layout.tsx](frontend/src/app/layout.tsx))
```tsx
{/* Umami Analytics */}
{process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
  <Script
    async
    src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
    data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
    strategy="afterInteractive"
  />
)}
```

### 2. **Analytics Utility** ([frontend/src/utils/analytics.ts](frontend/src/utils/analytics.ts))
Type-safe wrapper functions for custom event tracking:
- `trackSearch()` - Tracks search with filters (make, model, price, county, seller)
- `trackListingView()` - Tracks listing page views
- `trackMessageSent()` - Tracks messages sent to sellers
- `trackListingCreated()` - Tracks new listings created (with price range bucketing)
- `trackPhotoUpload()` - Tracks photo uploads
- `trackAuth()` - Tracks login/signup events

### 3. **Event Tracking Integrated**

| Page | Events Tracked | Metadata |
|------|---------------|----------|
| [Search](frontend/src/app/search/page.tsx) | `search` | make, model, minPrice, maxPrice, county, seller, filterCount |
| [Listing Detail](frontend/src/app/listing/[id]/page.tsx) | `view-listing`, `message-sent` | carId, make, model, recipientId, listingId |
| [Create Listing](frontend/src/app/listing/create/page.tsx) | `create-listing`, `photo-upload` | make, model, priceRange, photoCount |
| [Login](frontend/src/app/auth/login/page.tsx) | `auth-login` | - |
| [Signup](frontend/src/app/auth/signup/page.tsx) | `auth-signup` | - |

### 4. **Environment Configuration** ([frontend/.env.example](frontend/.env.example))
Template for required environment variables:
```env
NEXT_PUBLIC_UMAMI_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

---

## 📋 Next Steps (You Need to Do This)

### Step 1: Deploy Umami to Railway

**Option A: Railway Template (Recommended - 5 minutes)**
1. Visit: https://railway.app/template/umami
2. Click **"Deploy Now"**
3. Railway will create a new Umami service with PostgreSQL
4. Wait for deployment (~2-3 minutes)
5. Go to service → Settings → Networking → **"Generate Domain"**
6. Copy your Umami URL (e.g., `https://umami-production-abc123.up.railway.app`)

**Option B: Manual CLI Deployment**
```bash
railway login
railway link
railway service create umami
railway service add postgres
# Follow Railway CLI prompts
```

### Step 2: Initial Umami Setup

1. Open your Umami URL (from Step 1)
2. Login with default credentials:
   - Username: `admin`
   - Password: `umami`
3. **IMPORTANT**: Change the admin password immediately!
4. Go to **Settings** → **Websites** → **Add website**
5. Enter:
   - Name: `IDeal.ie`
   - Domain: Your production domain (e.g., `ideal-ie.up.railway.app` or custom domain)
6. Click **"Save"**
7. Copy the **Website ID** (looks like: `01234567-89ab-cdef-0123-456789abcdef`)

### Step 3: Configure Frontend Environment Variables

1. Add to your Railway frontend service environment variables:
   ```env
   NEXT_PUBLIC_UMAMI_URL=https://your-umami-url.up.railway.app
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=01234567-89ab-cdef-0123-456789abcdef
   ```

2. Also add to `frontend/.env.local` for local development:
   ```env
   NEXT_PUBLIC_UMAMI_URL=https://your-umami-url.up.railway.app
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=01234567-89ab-cdef-0123-456789abcdef
   ```

3. Redeploy your frontend or restart local dev server

### Step 4: Verify Tracking

1. **Test Locally**:
   ```bash
   cd frontend
   npm run dev
   ```
   - Open browser DevTools → Network tab
   - Visit http://localhost:3000
   - Look for request to `/script.js` from your Umami URL
   - Navigate around site, search, view listings
   - Check Umami dashboard for real-time visitors

2. **Test in Production**:
   - Visit your deployed site
   - Perform actions (search, view listing, send message)
   - Check Umami dashboard → Real-time → See live activity

3. **Verify Custom Events**:
   - In Umami dashboard → Events
   - Should see: `search`, `view-listing`, `message-sent`, `create-listing`, `photo-upload`, `auth-login`, `auth-signup`

---

## 📊 Analytics You'll Collect

### Automatic Page Views
- Homepage visits
- Search page views
- Listing detail views
- Dashboard, messages, auth pages
- Geographic location (country/city)
- Device type (mobile/desktop)
- Browser and OS
- Referrer sources

### Custom Events with Metadata

**Search Events**
```json
{
  "event": "search",
  "data": {
    "filterCount": 3,
    "make": "BMW",
    "model": "3 Series",
    "minPrice": 5000,
    "maxPrice": 15000,
    "county": "Dublin"
  }
}
```

**Listing View Events**
```json
{
  "event": "view-listing",
  "data": {
    "carId": "abc123",
    "make": "Toyota",
    "model": "Corolla"
  }
}
```

**Message Sent Events**
```json
{
  "event": "message-sent",
  "data": {
    "recipientId": "user456",
    "listingId": "car789"
  }
}
```

**Create Listing Events**
```json
{
  "event": "create-listing",
  "data": {
    "make": "Ford",
    "model": "Focus",
    "priceRange": "10k-20k"
  }
}
```

---

## 🔍 Key Insights You Can Track

1. **Most Popular Makes/Models**: See which cars users search for most
2. **Price Ranges**: Understand buyer budget preferences (under-5k, 5k-10k, etc.)
3. **Geographic Patterns**: Which counties get most searches/views
4. **Conversion Funnel**:
   - Homepage → Search → Listing View → Message Sent
   - Signup → Create Listing → Photo Upload
5. **Traffic Sources**: Where users come from (direct, social, search engines)
6. **Device Usage**: Mobile vs desktop preference
7. **Peak Times**: When users are most active

---

## 💰 Cost Breakdown

- **Umami Service**: ~$2-3/month (Railway compute)
- **PostgreSQL Database**: ~$2-3/month (Railway database, shared with backend or separate)
- **Total**: ~$5/month

Compare to:
- Google Analytics 4: Free (but complex GDPR, no data ownership)
- Plausible: €9/month (~$10/month)

---

## 🔐 Privacy & GDPR

✅ **GDPR Compliant by Default**:
- No cookies used
- No personal data collection
- Anonymous visitor tracking
- User IDs are hashed
- Data owned by you (self-hosted)
- Can add privacy policy: "We use privacy-friendly analytics to improve user experience"

---

## 🛠️ Troubleshooting

### Script Not Loading
- Check browser console for errors
- Verify `NEXT_PUBLIC_UMAMI_URL` is correct (with https://)
- Verify `NEXT_PUBLIC_UMAMI_WEBSITE_ID` matches Umami dashboard
- Check Railway deployment logs for frontend service

### Events Not Appearing
- Events may take 1-2 minutes to appear in dashboard
- Use Real-time view for immediate feedback
- Check browser console: `window.umami` should be defined
- Verify custom event names match exactly

### Domain Mismatch
- In Umami dashboard → Settings → Websites → Edit website
- Update domain to match your actual domain (without http/https)
- Can add multiple domains (e.g., localhost:3000, production domain)

---

## 📚 Additional Resources

- **Umami Documentation**: https://umami.is/docs
- **Railway Umami Template**: https://railway.app/template/umami
- **Custom Events API**: https://umami.is/docs/track-events
- **Umami Demo Dashboard**: https://analytics.umami.is/share/8rmHaheU/umami.is

---

## ✨ Future Enhancements (Optional)

1. **Goals/Funnels**: Track conversion rates (signup → create listing)
2. **A/B Testing**: Test different UI variations
3. **Dashboards**: Create custom views for specific metrics
4. **API Integration**: Pull analytics data into admin panel
5. **Alerts**: Get notified of traffic spikes or issues
6. **Reports**: Schedule weekly/monthly email reports

---

## 🎯 Quick Start Checklist

- [ ] Deploy Umami to Railway
- [ ] Generate domain for Umami service
- [ ] Login and change admin password
- [ ] Add website in Umami dashboard
- [ ] Copy Website ID
- [ ] Add environment variables to frontend (Railway + local)
- [ ] Redeploy frontend or restart dev server
- [ ] Test locally in browser DevTools
- [ ] Visit production site and verify tracking
- [ ] Check Umami dashboard for events

---

**Estimated Setup Time**: 15-20 minutes

**Technical Support**: See [UMAMI_SETUP.md](UMAMI_SETUP.md) for detailed deployment steps.
