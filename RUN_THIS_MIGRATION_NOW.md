# ⚠️ IMPORTANT: Run This Migration First!

## The Problem

You're seeing "Failed to add address" because the database doesn't have the `location_link` column yet.

## The Solution (2 Minutes)

### Step 1: Go to Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project

### Step 2: Open SQL Editor

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### Step 3: Run This SQL

Copy and paste this SQL code:

```sql
-- Add location_link column to addresses table
ALTER TABLE addresses
ADD COLUMN IF NOT EXISTS location_link text;

-- Add comment to explain the column
COMMENT ON COLUMN addresses.location_link IS 'Google Maps link to the pinned location';
```

### Step 4: Execute

1. Click the **"Run"** button (or press Ctrl+Enter)
2. You should see: **"Success. No rows returned"**

### Step 5: Verify

To verify it worked, run this query:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'addresses';
```

You should see `location_link` in the list with type `text`.

---

## ✅ Done!

Now try adding an address again - it should work! 🎉

---

## Still Getting Errors?

### Check Browser Console

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Try adding an address again
4. Look for error messages (they'll be red)
5. Share the error message if you need help

### Common Issues:

**"column location_link does not exist"**
- Solution: Run the migration above

**"permission denied"**
- Solution: Make sure you're signed in to Supabase with the correct account

**"relation addresses does not exist"**
- Solution: Your database schema might not be set up. Run the initial migrations first.

---

## Need the Initial Migrations?

If your database is completely new, you might need to run the initial schema first.

Check if you have these files:
- `supabase/migrations/20260316192521_create_initial_schema.sql`
- `supabase/migrations/20260316193147_seed_sample_data.sql`

Run them in order before running the location_link migration.
