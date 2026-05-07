# Google Maps API Setup Guide

## Overview
The location picker feature uses Google Maps JavaScript API to display an interactive map where users can click to select their exact location.

## Getting Your Google Maps API Key

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click **"New Project"**
5. Enter a project name (e.g., "ETAHA Maps")
6. Click **"Create"**

### Step 2: Enable Google Maps JavaScript API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Maps JavaScript API"**
3. Click on it
4. Click **"Enable"**

### Step 3: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Your API key will be created and displayed
4. **Copy the API key** - you'll need it in the next step

### Step 4: Restrict Your API Key (Important for Security)

1. Click on the API key you just created
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add your website URLs:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)
     - `https://*.yourdomain.com/*` (for subdomains)
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"Maps JavaScript API"**
4. Click **"Save"**

### Step 5: Add API Key to Your Project

1. Open `components/location-picker.tsx`
2. Find this line:
   ```typescript
   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
   ```
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
   ```typescript
   script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyABC123XYZ...&libraries=places`;
   ```

**OR** (Better for security) - Use environment variables:

1. Create/update `.env.local` file in your project root:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyABC123XYZ...
   ```

2. Update the component to use the environment variable:
   ```typescript
   script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
   ```

3. Add `.env.local` to your `.gitignore` file (it should already be there)

## Pricing Information

Google Maps offers a **$200 monthly credit** which covers:
- **28,000+ map loads per month** (free)
- After that: $7 per 1,000 additional loads

For most small to medium applications, you'll stay within the free tier.

## Testing the Feature

1. **Add your API key** as described above
2. **Restart your development server**:
   ```bash
   npm run dev
   ```
3. Navigate to any page with the location picker:
   - Profile page → Add new address
   - Cart → Checkout → Add new address
   - Maintenance → Add service location
4. Click **"Pick on Map"** button
5. The map should load with a marker
6. Click anywhere on the map or drag the marker
7. Click **"Confirm"** to save the location

## Troubleshooting

### Map doesn't load
- Check that your API key is correct
- Verify that Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for error messages
- Make sure you've added your domain to the API key restrictions

### "This page can't load Google Maps correctly"
- Your API key might not have billing enabled
- Go to Google Cloud Console → Billing → Enable billing
- The $200 monthly credit will cover most usage

### Map loads but location is wrong
- The default location is set to Cairo, Egypt (30.0444, 31.2357)
- You can change this in `components/location-picker.tsx`:
  ```typescript
  const defaultLocation = { lat: YOUR_LAT, lng: YOUR_LNG };
  ```

### User location not detected
- User must grant location permission in their browser
- If denied, the map will use the default location
- This is normal behavior and doesn't affect functionality

## Features of the Map Picker

✅ **Interactive Map**: Users can click anywhere to select location
✅ **Draggable Marker**: Marker can be dragged for precise positioning
✅ **Current Location**: Automatically detects user's location (with permission)
✅ **Coordinates Display**: Shows selected latitude and longitude
✅ **Auto-generate Link**: Creates Google Maps link automatically
✅ **Manual Input**: Users can also paste a link manually
✅ **Bilingual**: Full support for English and Arabic

## Security Best Practices

1. ✅ **Always restrict your API key** to specific domains
2. ✅ **Use environment variables** for API keys (don't commit them)
3. ✅ **Enable only required APIs** (Maps JavaScript API)
4. ✅ **Monitor usage** in Google Cloud Console
5. ✅ **Set up billing alerts** to avoid unexpected charges

## Alternative: Free Option (No API Key Required)

If you don't want to use Google Maps API, you can use OpenStreetMap with Leaflet (free, no API key needed). Let me know if you'd like me to implement this alternative!
