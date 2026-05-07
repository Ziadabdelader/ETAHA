# Google Maps Location Picker Feature

## Overview
This feature allows users to **click directly on an interactive map** to pin their exact location. The map appears in a dialog/popup within the website, and when the user confirms their selection, it automatically generates and saves a Google Maps link.

## ✨ Key Features

- 🗺️ **Interactive embedded map** - No external tabs, map opens in a dialog
- 📍 **Click to select** - Users click anywhere on the map to set their location
- 🎯 **Draggable marker** - Fine-tune position by dragging the marker
- 📱 **Auto-detect location** - Automatically centers on user's current location (with permission)
- 🔗 **Auto-generate link** - Creates Google Maps link automatically from selected coordinates
- ✏️ **Manual input option** - Users can also paste a link manually if preferred
- 🌍 **Bilingual** - Full support for English and Arabic

## Database Migration

### Step 1: Run the Migration
You need to run the migration to add the `location_link` column to your Supabase database:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the content from: `supabase/migrations/20260507000000_add_location_link_to_addresses.sql`
4. Click **"Run"** or press **Ctrl+Enter**

The migration SQL:
```sql
-- Add location_link column to addresses table
ALTER TABLE addresses
ADD COLUMN IF NOT EXISTS location_link text;

-- Add comment to explain the column
COMMENT ON COLUMN addresses.location_link IS 'Google Maps link to the pinned location';
```

## Google Maps API Setup

**IMPORTANT:** You need a Google Maps API key for this feature to work.

### Quick Setup:

1. Follow the detailed guide in `GOOGLE_MAPS_API_SETUP.md`
2. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
3. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
4. Update `components/location-picker.tsx` line 44 to use the environment variable:
   ```typescript
   script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
   ```

**Note:** Google Maps offers $200/month free credit (covers ~28,000 map loads/month).

## Where the Feature is Available

The Google Maps location picker is now available in **3 places**:

### 1. **Profile Page** (`/dashboard/profile`)
- When adding a new address in the "Saved Addresses" section
- Users can save addresses with location links for future use

### 2. **Cart Checkout Flow** (`/dashboard/cart`)
- When proceeding to checkout and adding a new delivery address
- The location link helps delivery drivers find the exact location

### 3. **Maintenance Request Page** (`/dashboard/maintenance`)
- When scheduling a maintenance service and adding a service location
- Technicians can use the location link to navigate to the exact service location

## How It Works

### For Users:

1. **Click "Pick on Map" button**
   - A dialog opens with an interactive Google Map

2. **Select Location:**
   - **Option A:** Click anywhere on the map to place the marker
   - **Option B:** Drag the marker to adjust the position
   - **Option C:** The map auto-centers on your current location (if you grant permission)

3. **Confirm Selection:**
   - See the selected coordinates displayed
   - Click "Confirm" button
   - The Google Maps link is automatically generated and saved

4. **Alternative - Manual Input:**
   - Users can also paste a Google Maps link directly in the input field
   - Useful if they already have a link

5. **View Location:**
   - Click "View on map" link to open the location in Google Maps
   - Opens in a new tab for verification

### User Interface:

```
┌─────────────────────────────────────────────────────┐
│ 📍 Location Pin (Google Maps) (Optional)           │
├─────────────────────────────────────────────────────┤
│ [Input field with link]  [X]  [📍 Pick on Map]     │
│ 🔗 View on map                                      │
└─────────────────────────────────────────────────────┘

When "Pick on Map" is clicked:
┌─────────────────────────────────────────────────────┐
│ Select Your Location                           [X]  │
├─────────────────────────────────────────────────────┤
│ Click on the map or drag the marker to select      │
│ your exact location                                 │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │                                             │   │
│ │         [Interactive Google Map]            │   │
│ │              with marker 📍                 │   │
│ │                                             │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ Selected coordinates: 30.044420, 31.235712          │
│                                                     │
│              [Cancel]  [Confirm]                    │
└─────────────────────────────────────────────────────┘
```

## Component Usage

```tsx
import { LocationPicker } from '@/components/location-picker';

<LocationPicker
  value={address.location_link}
  onChange={(link) => setAddress({ ...address, location_link: link })}
  label="Custom Label (optional)"
  placeholder="Custom placeholder (optional)"
/>
```

## Database Schema

The `location_link` column in the `addresses` table:
- **Type:** `text`
- **Nullable:** Yes (optional field)
- **Purpose:** Stores Google Maps link to the exact location
- **Format:** `https://www.google.com/maps?q=30.044420,31.235712`

## Translations

The feature supports both English and Arabic with the following keys:

### English (`public/locales/en/translation.json`):
```json
"address": {
  "locationLink": "Location Pin (Google Maps)",
  "pickLocation": "Pick on Map",
  "selectLocation": "Select Your Location",
  "mapInstructions": "Click on the map or drag the marker to select your exact location",
  "selectedCoordinates": "Selected coordinates",
  "locationLinkPlaceholder": "Paste Google Maps link here or use the map picker",
  "viewOnMap": "View on map"
}
```

### Arabic (`public/locales/ar/translation.json`):
```json
"address": {
  "locationLink": "تحديد الموقع (خرائط جوجل)",
  "pickLocation": "اختر على الخريطة",
  "selectLocation": "حدد موقعك",
  "mapInstructions": "انقر على الخريطة أو اسحب العلامة لتحديد موقعك بالضبط",
  "selectedCoordinates": "الإحداثيات المحددة",
  "locationLinkPlaceholder": "الصق رابط خرائط جوجل هنا أو استخدم منتقي الخريطة",
  "viewOnMap": "عرض على الخريطة"
}
```

## Technical Implementation

### Files Created/Modified:

1. **`components/location-picker.tsx`** - Main component with embedded map
2. **`types/google-maps.d.ts`** - TypeScript declarations for Google Maps
3. **`supabase/migrations/20260507000000_add_location_link_to_addresses.sql`** - Database migration
4. **`app/dashboard/profile/page.tsx`** - Added location picker
5. **`components/checkout-flow.tsx`** - Added location picker
6. **`app/dashboard/maintenance/page.tsx`** - Added location picker
7. **Translation files** - Added new keys

### Map Features:

- **Default Center:** Cairo, Egypt (30.0444, 31.2357) - can be changed
- **Zoom Level:** 13 (city level)
- **Marker:** Draggable with drop animation
- **Click Handler:** Updates marker position on map click
- **Geolocation:** Attempts to get user's current location
- **Link Format:** `https://www.google.com/maps?q=LAT,LNG`

## Benefits

1. ✅ **User-Friendly:** No need to copy/paste links from external tabs
2. ✅ **Accurate:** Users can pinpoint exact location visually
3. ✅ **Fast:** Embedded map loads instantly in a dialog
4. ✅ **Flexible:** Supports both map picking and manual link input
5. ✅ **Mobile-Friendly:** Works on all devices
6. ✅ **Auto-Location:** Detects user's current position automatically
7. ✅ **Bilingual:** Full Arabic and English support

## Testing

1. **Setup Google Maps API key** (see `GOOGLE_MAPS_API_SETUP.md`)
2. **Run the database migration** in Supabase
3. **Restart your development server**:
   ```bash
   npm run dev
   ```
4. **Test the feature:**
   - Go to Profile → Add new address → Click "Pick on Map"
   - Map should open in a dialog
   - Click on the map to select a location
   - Drag the marker to adjust
   - Click "Confirm"
   - Verify the link is saved in the input field
   - Click "View on map" to verify it opens correctly

## Troubleshooting

### Map doesn't load
- Check that you've added your Google Maps API key
- Verify the API key is correct in the environment variable
- Check browser console for errors
- Ensure Maps JavaScript API is enabled in Google Cloud Console

### "This page can't load Google Maps correctly"
- Enable billing in Google Cloud Console (free $200/month credit applies)
- Check API key restrictions

### Location not detected
- User must grant location permission
- If denied, map uses default location (Cairo)
- This is normal and doesn't affect functionality

## Cost Estimate

- **Free Tier:** $200/month credit = ~28,000 map loads
- **After Free Tier:** $7 per 1,000 additional loads
- **Typical Usage:** Most small-medium apps stay within free tier

## Notes

- The location link is **optional** - users can save addresses without it
- The field is clearly marked as "(Optional)" in the UI
- Map loads only when the dialog is opened (performance optimization)
- Google Maps script is loaded dynamically (not on initial page load)
- The component is fully responsive and works on mobile devices
