# 🔧 Fix "Failed to add address" Error - Quick Solution

## The Problem

You're seeing **"Failed to add address"** because the database is missing the `location_link` column.

---

## ✅ The Solution (Takes 2 Minutes)

### Step 1: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Sign in to your account
3. Click on your project

### Step 2: Open SQL Editor

1. Look at the left sidebar
2. Click on **"SQL Editor"** (it has a database icon)
3. Click the **"New Query"** button at the top

### Step 3: Copy and Paste This SQL

```sql
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS location_link text;
```

### Step 4: Run It

1. Click the **"Run"** button (or press `Ctrl + Enter`)
2. You should see: **"Success. No rows returned"**

### Step 5: Test It

1. Go back to your website
2. Try adding an address again
3. It should work now! ✅

---

## 🎯 That's It!

The error should be gone. You can now:
- Add addresses with location pins
- Use the map picker to select locations
- Save addresses successfully

---

## ❓ Still Getting the Error?

### Check if the migration worked:

Run this SQL in Supabase SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'addresses';
```

You should see `location_link` with type `text` in the results.

### If you don't see it:

1. Make sure you're in the correct project
2. Make sure you ran the SQL command above
3. Check for any error messages in red

---

## 🐛 Debug Mode

If it still doesn't work, open your browser console:

1. Press **F12** on your keyboard
2. Click the **"Console"** tab
3. Try adding an address again
4. Look for red error messages
5. Share the error message if you need more help

---

## ✨ What This Does

This adds a new column called `location_link` to your `addresses` table. This column stores the Google Maps link when you use the map picker feature.

Without this column, the database rejects the address because it doesn't know where to store the location link.

---

## 📝 Summary

**Problem:** Database missing `location_link` column  
**Solution:** Run the SQL command above in Supabase  
**Time:** 2 minutes  
**Result:** Address saving works perfectly ✅
