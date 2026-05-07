# Quick Setup - Google Maps API Key

## 🚀 Fast Setup (5 minutes)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. **IMPORTANT:** At the top of the page, click the project dropdown (it might say "Select a project" or show a project name)
4. In the popup, click **"NEW PROJECT"** button (top right)
5. Enter project name: **"ETAHA"**
6. Click **"CREATE"**
7. **Wait for the notification** that says "Project created" (top right bell icon)
8. **Click on the notification** or use the project dropdown to **SELECT your new project**
9. **Verify** the project name "ETAHA" appears at the top of the page

### Step 2: Enable Maps JavaScript API

1. **Make sure "ETAHA" is selected** at the top of the page
2. Click the **☰ menu** (hamburger icon, top left)
3. Go to **"APIs & Services"** → **"Library"**
4. In the search box, type: **"Maps JavaScript API"**
5. Click on **"Maps JavaScript API"** (the one with the map icon)
6. Click the blue **"ENABLE"** button
7. Wait for it to enable (you'll see "API enabled" message)

### Step 3: Create API Key

1. **Still in the same project**, click **"Credentials"** in the left sidebar
   - Or go to: **☰ menu** → **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"API Key"**
4. Your API key will appear in a popup - **COPY IT!**
   - It looks like: `AIzaSyABC123XYZ...`
5. Click **"CLOSE"** (we'll restrict it later)

### Step 4: Add to Your Project

1. In your project root folder (where `package.json` is), create a file named **`.env.local`**
2. Add this line (replace with your actual key):
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyABC123XYZ...
   ```
3. **Save the file**
4. **Make sure there are no spaces** before or after the `=` sign

### Step 5: Restart Your Server

```bash
# Stop your server (Ctrl+C in the terminal)
# Then restart it:
npm run dev
```

### Step 6: Test It!

1. Go to the maintenance page
2. Click **"Pick on Map"**
3. The map should now load! 🎉

---

## 🔒 Important: Secure Your API Key (Do This After Testing)

### Restrict Your API Key:

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. **Make sure your "ETAHA" project is selected** at the top
3. Go to **☰ menu** → **"APIs & Services"** → **"Credentials"**
4. Click on your API key name
5. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Click **"+ ADD AN ITEM"**
   - Add: `http://localhost:3000/*`
   - Click **"+ ADD AN ITEM"** again
   - Add: `http://localhost:*/*` (for other ports)
   - When you deploy, add your production domain
6. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check only **"Maps JavaScript API"**
7. Click **"SAVE"** at the bottom

---

## 💰 Pricing (Don't Worry, It's Free!)

- **Free Tier:** $200/month credit
- **This covers:** ~28,000 map loads per month
- **Cost after free tier:** $7 per 1,000 additional loads
- **For most apps:** You'll never pay anything!

---

## ❓ Troubleshooting

### "Insufficient permissions to check the enablement status"
- **Solution:** Make sure you've selected your project at the top of the page
  1. Click the project dropdown at the top
  2. Select your "ETAHA" project
  3. The project name should appear at the top
  4. Try enabling the API again

### "This page can't load Google Maps correctly"
- **Solution:** Enable billing in Google Cloud Console
  1. Go to **☰ menu** → **"Billing"**
  2. Click **"Link a billing account"**
  3. Follow the steps to add a credit card
  4. Don't worry - you won't be charged due to the $200 free tier!

### Map still doesn't load
- Check that you copied the API key correctly (no extra spaces)
- Make sure the `.env.local` file is in the project root (same folder as `package.json`)
- Restart your development server completely
- Check browser console (F12) for specific error messages
- Wait 2-3 minutes after creating the API key (it can take time to activate)

### "Invalid API key"
- Make sure you enabled **"Maps JavaScript API"** (not just "Maps API")
- Wait a few minutes after creating the key
- Try creating a new API key
- Make sure you're using the correct project

### Can't find "APIs & Services"
- Click the **☰ hamburger menu** (top left)
- Scroll down to find "APIs & Services"
- If you still can't see it, you might not have the right permissions on your Google account

---

## 📝 Quick Checklist

- [ ] Signed in to Google Cloud Console
- [ ] Created new project "ETAHA"
- [ ] **Selected the "ETAHA" project** (verify at top of page)
- [ ] Enabled "Maps JavaScript API"
- [ ] Created API key
- [ ] Copied the API key
- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`
- [ ] Saved the file
- [ ] Restarted development server
- [ ] Tested the map picker
- [ ] Restricted API key (for security)

---

## 🆘 Still Having Issues?

### Common Mistakes:
1. ❌ Not selecting the project before enabling API
2. ❌ Enabling wrong API (make sure it's "Maps JavaScript API")
3. ❌ Spaces in the `.env.local` file
4. ❌ `.env.local` file in wrong location
5. ❌ Not restarting the server after adding the key

### Need More Help?
- See detailed guide: `GOOGLE_MAPS_API_SETUP.md`
- Check Google's documentation: https://developers.google.com/maps/documentation/javascript/get-api-key
- Check browser console (F12) for error messages
