# Fix "Failed to add address" Error

## 🔍 The Problem

You're seeing "Failed to add address" when trying to save an address with a location link.

## ✅ Solution (Choose One)

### Option 1: Run the Database Migration (Recommended)

The database needs the `location_link` column. Follow this guide:

**👉 See `RUN_THIS_MIGRATION_NOW.md`**

Quick version:
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:
```sql
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS location_link text;
```
3. Try adding the address again

---

### Option 2: Check Browser Console for Specific Error

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Try adding the address again
4. Look for red error messages

Common errors and solutions:

#### Error: "column location_link does not exist"
**Solution:** Run the migration (Option 1 above)

#### Error: "null value in column user_id violates not-null constraint"
**Solution:** Make sure you're logged in

#### Error: "permission denied for table addresses"
**Solution:** Check Supabase RLS policies

---

## 🧪 Test if Migration Worked

After running the migration, test it:

1. Go to Supabase Dashboard → Table Editor
2. Click on **"addresses"** table
3. Look at the columns - you should see **"location_link"**
4. Try adding an address again

---

## 📋 What I Fixed

I also fixed a missing translation key that might have caused issues:
- Added `common.requiredFields` translation
- Added error logging to help diagnose issues
- Updated maintenance page to use correct translation key

---

## 🆘 Still Not Working?

### Check These:

1. **Is the migration run?**
   - Go to Supabase → SQL Editor
   - Run: `SELECT column_name FROM information_schema.columns WHERE table_name = 'addresses';`
   - Look for `location_link` in the results

2. **Are you logged in?**
   - Check if you see your name in the navbar
   - Try logging out and back in

3. **Check browser console**
   - Press F12
   - Look for error messages
   - Share the error if you need help

4. **Try without location link**
   - Leave the location link field empty
   - Try saving the address
   - If it works, the issue is with the location_link column

---

## 💡 Quick Debug

Open browser console (F12) and run:

```javascript
// Check if you're logged in
console.log('User:', localStorage.getItem('supabase.auth.token'));

// Check the address data being sent
// (This will show in console when you try to save)
```

---

## ✅ After It Works

Once the address saves successfully:
1. You should see "Address added successfully" message
2. The address should appear in the list
3. The location link should be saved
4. You can click "View on map" to verify

---

## 📞 Need More Help?

Share these details:
1. The exact error message from browser console
2. Screenshot of the error
3. Whether you ran the migration
4. What happens when you check the addresses table in Supabase
