# Address Snapshot Migration Guide

## Problem Fixed
When a saved address was deleted from the profile, it was causing all old orders and maintenance requests to show `null` for the address. This is because they were using a foreign key relationship to the `addresses` table.

## Solution
We now save a snapshot of the address text when creating orders and maintenance requests. This way, even if the address is deleted from saved addresses, old orders/requests will still show the address they were created with.

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20260501000000_add_address_text_columns.sql`
4. Click "Run" to execute the migration

### Option 2: Using Supabase CLI
If you have the Supabase CLI installed:
```bash
cd project
supabase db push
```

### Option 3: Manual SQL Execution
Run this SQL in your Supabase SQL editor:

```sql
-- Add address_text column to orders table to store address snapshot
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_text TEXT;

-- Add address_text column to maintenance_requests table to store address snapshot
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS address_text TEXT;

-- Update existing orders with current address text (if address still exists)
UPDATE orders o
SET address_text = CONCAT(a.address_line1, ', ', a.city, ', ', a.postal_code)
FROM addresses a
WHERE o.address_id = a.id AND o.address_text IS NULL;

-- Update existing maintenance requests with current address text (if address still exists)
UPDATE maintenance_requests mr
SET address_text = CONCAT(a.address_line1, ', ', a.city, ', ', a.postal_code)
FROM addresses a
WHERE mr.address_id = a.id AND mr.address_text IS NULL;
```

## What Changed

### Database Schema
- Added `address_text` column to `orders` table
- Added `address_text` column to `maintenance_requests` table
- Backfilled existing records with their current address text

### Application Code
1. **Order Creation** (`app/dashboard/cart/page.tsx`):
   - Now saves address snapshot when creating an order
   - Format: "Street, City, PostalCode"

2. **Maintenance Request Creation** (`app/dashboard/maintenance/page.tsx`):
   - Now saves address snapshot when creating a request
   - Format: "Street, City, PostalCode"

3. **Orders Display** (`app/dashboard/orders/page.tsx`):
   - Shows `address_text` instead of the relationship
   - Falls back to relationship if `address_text` is not available
   - Shows "Address Deleted" message if neither is available

4. **Requests Display** (`app/dashboard/requests/page.tsx`):
   - Shows `address_text` instead of the relationship
   - Falls back to relationship if `address_text` is not available
   - Shows "Address Deleted" message if neither is available

## Testing
After applying the migration:
1. Create a new order with a saved address
2. Create a new maintenance request with a saved address
3. Delete the saved address from your profile
4. Check that the order and request still show the correct address
5. Future orders will not have access to the deleted address (as expected)
