# 🚀 Quick Fix - "Failed to add address" Error

## ⚡ 2-Minute Solution

### The Problem
Your database is missing the `location_link` column.

### The Solution
Run one SQL command in Supabase.

---

## 📝 Step-by-Step (With Pictures)

### 1️⃣ Open Supabase
- Go to: **https://supabase.com/dashboard**
- Sign in
- Click your project

### 2️⃣ Open SQL Editor
- Left sidebar → Click **"SQL Editor"**
- Top right → Click **"New Query"**

### 3️⃣ Paste This SQL
```sql
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS location_link text;
```

### 4️⃣ Run It
- Click **"Run"** button
- Or press **Ctrl + Enter**

### 5️⃣ Success!
You should see: **"Success. No rows returned"**

---

## ✅ Test It

1. Go to your website
2. Go to Profile → Add New Address
3. Fill in the address details
4. Click "Pick on Map"
5. Select a location
6. Click "Confirm"
7. Click "Add New Address"
8. **It should work!** ✅

---

## 🎯 What I Fixed in the Code

I already fixed 3 bugs in your code:

1. ✅ **Checkout flow** - Now sends location link to database
2. ✅ **Cart page** - Now saves location link properly
3. ✅ **TypeScript** - Added location_link to interfaces

**You just need to run the SQL migration above!**

---

## ❓ Still Not Working?

### Check if migration worked:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'addresses';
```

You should see `location_link` in the list.

### Check browser console:
1. Press **F12**
2. Click **Console** tab
3. Try adding address
4. Look for red errors
5. Share the error message

---

## 🎉 After This Works

You'll be able to:
- ✅ Add addresses with location picker
- ✅ Save Google Maps links
- ✅ View locations on map
- ✅ Use location picker in Profile, Cart, and Maintenance pages

---

## 📞 Need Help?

If you see any errors:
1. Check browser console (F12)
2. Share the error message
3. I'll help you fix it!

---

**That's it! Just run the SQL and you're done!** 🚀
