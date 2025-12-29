# Cloudinary Image Upload Setup Guide

This guide walks you through setting up Cloudinary for image uploads in the IDeal Car Marketplace application.

## Step 1: Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Fill in your details and create an account
4. Verify your email

## Step 2: Get Your Credentials

1. After signing in, you'll be on the Dashboard
2. Look for the "Account Details" section (usually on the right side)
3. You'll see three pieces of information:
   - **Cloud Name** - A unique identifier for your account
   - **API Key** - Your public API key
   - **API Secret** - Your secret key (keep this private!)

## Step 3: Configure Environment Variables

### For Local Development:

1. Open `backend/.env`
2. Update these lines with your Cloudinary credentials:

```dotenv
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### For Production (Railway):

1. Go to your Railway project
2. Go to the Backend service
3. Click on "Variables"
4. Add the same three environment variables with your Cloudinary credentials

## Step 4: Test the Integration

1. Start the backend: `npm run dev`
2. Start the frontend: `npm run dev`
3. Go to "Create Listing" page
4. Try uploading a photo
5. If successful, you should see the photo URL appear in your Cloudinary account

## How It Works

### Upload Flow:

1. **Frontend**: User selects image files from their computer
2. **Frontend**: Files are sent to `/api/upload/upload` endpoint
3. **Backend**: Cloudinary SDK uploads files to your Cloudinary account
4. **Backend**: Returns public URLs for the uploaded images
5. **Backend**: URLs are saved to database as part of the car listing
6. **Frontend**: Redirects to dashboard after successful upload

### Storage:

- All images are stored in your Cloudinary account
- They're organized in a folder called `ideal-carmarket`
- Public URLs are used to display images throughout the app
- Images are automatically optimized and cached on Cloudinary's CDN

## Pricing & Free Tier

**Cloudinary Free Plan Includes:**
- 25 GB storage
- 25 GB monthly bandwidth
- Unlimited transformations (resizing, cropping, etc.)

**After exceeding free tier:**
- Storage: $0.50/GB per month
- Bandwidth: $0.10-0.12/GB per month

This is more than enough for a new marketplace!

## Troubleshooting

### "Failed to upload photos" error

Check that your `.env` variables are correct:
- Make sure you're using the right Cloud Name, API Key, and API Secret
- Restart the backend after changing `.env`

### Photos not appearing in Cloudinary Dashboard

- Wait a few seconds after upload
- Refresh your Cloudinary dashboard
- Check that your API Secret is correct

### File size errors

Maximum file size is 10MB per image. This should be fine for most car photos.

## Security Notes

- **API Secret**: Never expose this in frontend code or client-side JavaScript
- The upload always happens server-to-server (backend to Cloudinary)
- Users can only upload images through the authenticated endpoint
