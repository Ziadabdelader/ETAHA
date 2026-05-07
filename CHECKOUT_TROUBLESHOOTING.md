# Checkout Troubleshooting Guide

## Issue: "Failed to place order" Error

### Root Cause
The `orders` table in the database doesn't have a `payment_method` column, but the code was trying to insert it.

### Solution Applied
✅ **Fixed in `app/dashboard/cart/page.tsx`**
- Removed `payment_method` field from the database insert
- Payment method information is now stored in the `notes` field
- Added better error logging to help diagnose future issues

### How It Works Now

```typescript
// Payment method is appended to notes
const fullNotes = data.notes 
  ? `${data.notes}\n\nPayment Method: ${data.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}`
  : `Payment Method: ${data.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}`;

// Insert order without payment_method field
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert([
    {
      user_id: user?.id,
      address_id: data.addressId,
      total_amount: totalAmount,
      status: 'pending',
      notes: fullNotes,  // Payment method stored here
    },
  ])
  .select()
  .single();
```

## Testing the Fix

1. **Add items to cart**
   - Go to Parts catalog
   - Add some items to cart

2. **Go to cart page**
   - Click on cart icon or navigate to `/dashboard/cart`

3. **Start checkout**
   - Click "Proceed to Checkout"

4. **Complete all steps**
   - Step 1: Review cart items
   - Step 2: Select or add delivery address
   - Step 3: Select payment method (Cash on Delivery)
   - Step 4: Review and confirm

5. **Place order**
   - Click "Confirm and Place Order"
   - Should see success message with order number
   - Cart should be cleared
   - Should be able to view order in Orders page

## Common Issues and Solutions

### Issue: "Please select a delivery address"
**Cause**: No address selected in Step 2
**Solution**: 
- Select an existing address, OR
- Click "Add New Address" and fill in all required fields:
  - Street address
  - City
  - Postal code
  - Phone number

### Issue: Order succeeds but cart not cleared
**Cause**: Cart clear operation failed
**Solution**: 
- Refresh the page
- Cart should be empty after refresh
- Check browser console for errors

### Issue: Can't see order in Orders page
**Cause**: Orders page not loading correctly
**Solution**:
- Check that you're logged in
- Navigate to `/dashboard/orders`
- Check browser console for errors

## Debugging Tips

### Check Browser Console
Open browser developer tools (F12) and check the Console tab for errors:

```javascript
// Look for these error messages:
"Order creation error:" - Problem creating order record
"Order items error:" - Problem creating order items
"Cart clear error:" - Problem clearing cart
"Order placement error:" - General error
```

### Check Network Tab
Open browser developer tools (F12) and check the Network tab:

1. Filter by "Fetch/XHR"
2. Look for requests to Supabase
3. Check response status codes:
   - 200/201 = Success
   - 400 = Bad request (check request body)
   - 401 = Unauthorized (check authentication)
   - 500 = Server error (check Supabase logs)

### Check Supabase Logs
If you have access to Supabase dashboard:

1. Go to your Supabase project
2. Navigate to "Logs" section
3. Look for errors related to:
   - `orders` table inserts
   - `order_items` table inserts
   - `cart_items` table deletes

## Database Schema Reference

### Orders Table
```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  address_id uuid REFERENCES addresses(id),
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  notes text,  -- Payment method stored here
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id uuid PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## Future Enhancement: Add payment_method Column

If you want to add a dedicated `payment_method` column to the database:

### Step 1: Create Migration
Create a new file: `supabase/migrations/YYYYMMDDHHMMSS_add_payment_method.sql`

```sql
-- Add payment_method column to orders table
ALTER TABLE orders 
ADD COLUMN payment_method text DEFAULT 'cash';

-- Add check constraint for valid payment methods
ALTER TABLE orders
ADD CONSTRAINT valid_payment_method 
CHECK (payment_method IN ('cash', 'online'));

-- Add comment
COMMENT ON COLUMN orders.payment_method IS 'Payment method: cash or online';
```

### Step 2: Update Code
In `app/dashboard/cart/page.tsx`, change:

```typescript
// FROM:
notes: fullNotes,

// TO:
notes: data.notes,
payment_method: data.paymentMethod,
```

### Step 3: Apply Migration
Run the migration in your Supabase project:
```bash
supabase db push
```

## Testing Checklist

After fixing the issue, verify:

- [ ] Can add items to cart
- [ ] Can view cart with correct prices (LE format)
- [ ] Can start checkout flow
- [ ] Can navigate through all 4 steps
- [ ] Can select existing address
- [ ] Can add new address
- [ ] Can select Cash on Delivery
- [ ] Online Payment is disabled
- [ ] Can add order notes
- [ ] Can review order details in Step 4
- [ ] Can place order successfully
- [ ] See success message with order number
- [ ] Cart is cleared after order
- [ ] Can view order in Orders page
- [ ] Order shows correct total amount
- [ ] Order shows correct address
- [ ] Order shows payment method in notes

## Error Messages Reference

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Failed to place order" | General order creation failure | Check browser console for details |
| "Please select a delivery address" | No address selected | Select or add an address |
| "Order failed: [error]" | Specific database error | Check error message for details |
| "Failed to load cart" | Can't fetch cart items | Check authentication and database |
| "Failed to add to cart" | Can't add item to cart | Check product availability |

## Support

If the issue persists:

1. Check all console errors
2. Verify Supabase connection
3. Verify user is authenticated
4. Check database permissions (RLS policies)
5. Verify all required fields are filled
6. Try with a different browser
7. Clear browser cache and cookies

---

**Status**: Issue Fixed ✅
**Last Updated**: 2026-04-30
**Fix Applied**: Removed payment_method field from database insert
