# Cart Persistence Testing Guide

This guide provides step-by-step instructions for manually testing the guest cart persistence feature.

## Prerequisites

1. Start the development server: `npm run dev`
2. Open browser in incognito/private mode (to start fresh)
3. Open browser DevTools → Application → Local Storage
4. Navigate to the app (e.g., http://localhost:3000)

---

## Test 1: Guest Cart Persists After Sign-Up ✅

**Goal**: Verify that items added as guest are preserved when user signs up.

### Steps:
1. **As Guest**: Navigate to Parts/Products page (`/dashboard/parts`)
2. **Add Items**: Add 2-3 different products to cart
3. **Verify Guest Cart**: 
   - Check DevTools → Application → Local Storage → `etaha_guest_cart`
   - Should see array with product IDs and quantities
4. **Go to Cart**: Navigate to `/dashboard/cart`
5. **Checkout**: Click "Checkout" button
6. **Expected**: Redirected to `/login?redirect=cart`
7. **Sign Up**: Click "Sign Up" link
8. **Expected**: Redirected to `/register?redirect=cart`
9. **Complete Sign-Up**: Fill form and submit
10. **Expected**: 
    - Redirected to `/dashboard/cart`
    - All items from guest cart are visible
    - Local storage `etaha_guest_cart` is cleared/empty

### Success Criteria:
- ✅ Guest cart items visible in authenticated cart
- ✅ Quantities preserved correctly
- ✅ Guest cart localStorage cleared after merge
- ✅ Can proceed to checkout with merged cart

---

## Test 2: Guest Cart Persists After Login (Existing Feature) ✅

**Goal**: Verify existing login flow still works.

### Steps:
1. **As Guest**: Add 2-3 products to cart
2. **Verify Guest Cart**: Check local storage has items
3. **Go to Cart**: Navigate to `/dashboard/cart`
4. **Checkout**: Click "Checkout" button
5. **Expected**: Redirected to `/login?redirect=cart`
6. **Login**: Enter credentials and log in (use existing account)
7. **Expected**:
    - Redirected to `/dashboard/cart`
    - All guest cart items are in cart
    - If user had existing items, quantities are merged (added together)

### Success Criteria:
- ✅ Guest cart merged with user's existing cart
- ✅ Quantities combined correctly (not replaced)
- ✅ Guest cart localStorage cleared
- ✅ Existing login behavior unchanged

---

## Test 3: Guest Cart Cleared After Logout ✅

**Goal**: Verify that logging out clears the guest cart.

### Steps:
1. **Add Items as Guest**: Add products to cart
2. **Sign Up/Login**: Authenticate and merge cart
3. **Verify Authenticated Cart**: Items visible in `/dashboard/cart`
4. **Logout**: Click logout from navbar/profile menu
5. **Expected**: Redirected to home page
6. **Check Local Storage**: DevTools → Local Storage → `etaha_guest_cart`
7. **Expected**: Guest cart key is removed/empty
8. **Navigate to Cart**: Go to `/dashboard/cart` (as guest)
9. **Expected**: Cart is empty

### Success Criteria:
- ✅ Local storage cleared on logout
- ✅ Guest cart empty after logout
- ✅ No old items reappear
- ✅ Fresh start for guest shopping

---

## Test 4: Redirect Parameter Preserved Between Login/Register ✅

**Goal**: Verify redirect parameter is maintained when switching between login and register.

### Steps:
1. **Add Items as Guest**: Add products to cart
2. **Go to Cart**: Navigate to `/dashboard/cart`
3. **Checkout**: Click "Checkout"
4. **Expected**: URL is `/login?redirect=cart`
5. **Switch to Register**: Click "Sign Up" link
6. **Expected**: URL is `/register?redirect=cart` (redirect parameter preserved)
7. **Switch Back to Login**: Click "Sign In" link
8. **Expected**: URL is `/login?redirect=cart` (redirect parameter preserved)
9. **Complete Login**: Log in
10. **Expected**: Redirected to `/dashboard/cart` (not `/dashboard`)

### Success Criteria:
- ✅ Redirect parameter preserved when switching pages
- ✅ After auth, redirected to correct page (cart)
- ✅ Cart items still visible after redirect

---

## Test 5: Cart Merge with Existing Items ✅

**Goal**: Verify that guest cart items merge correctly with user's existing cart items.

### Setup:
1. Create a test account if you don't have one
2. Log in and add 2 items (e.g., Product A: qty 2, Product B: qty 1)
3. Log out

### Steps:
1. **As Guest**: Add items to cart:
   - Product A: qty 3 (same as in authenticated cart)
   - Product C: qty 1 (new product)
2. **Login**: Log in with the test account
3. **Expected**:
   - Product A: qty 5 (2 + 3 = merged)
   - Product B: qty 1 (existing item preserved)
   - Product C: qty 1 (new item added)

### Success Criteria:
- ✅ Duplicate items have quantities combined
- ✅ Existing items preserved
- ✅ New items added
- ✅ No items lost or duplicated

---

## Test 6: Edge Cases

### 6.1: Empty Guest Cart
**Steps:**
1. Don't add any items as guest
2. Go to login/register
3. Complete authentication
4. **Expected**: No errors, empty cart shown

### 6.2: Sign Up Without Checkout Redirect
**Steps:**
1. Add items as guest
2. Navigate directly to `/register` (not via checkout)
3. Complete sign-up
4. **Expected**: 
   - Redirected to `/dashboard` (default)
   - Guest cart still merged
   - Cart items accessible

### 6.3: Multiple Sign-Up Attempts
**Steps:**
1. Add items as guest
2. Start sign-up with invalid email
3. Fix and retry sign-up
4. **Expected**: Cart items still present after successful sign-up

### 6.4: Browser Refresh During Guest Shopping
**Steps:**
1. Add items to cart as guest
2. Refresh page (F5)
3. **Expected**: Guest cart items persist (localStorage)
4. Navigate to cart
5. **Expected**: Items still visible

---

## Test 7: Stock Validation During Merge

**Goal**: Verify cart merge respects product stock limits.

### Steps:
1. **As Admin/Database**: Set a product stock to 5 units
2. **As Guest**: Add 3 units to cart
3. **Login as User**: User already has 3 units in cart
4. **Expected**: 
   - Cart merge attempts 3 + 3 = 6 units
   - System should either:
     - Limit to 5 units (max stock), OR
     - Allow merge and show error at checkout
5. **Try Checkout**: Verify stock validation works

### Success Criteria:
- ✅ Cart merge doesn't create impossible quantities
- ✅ Stock validation happens at merge or checkout
- ✅ User sees clear error message if needed

---

## Test 8: Cross-Browser Persistence

**Goal**: Verify guest cart is browser-specific (localStorage).

### Steps:
1. **Browser 1**: Add items as guest
2. **Browser 2**: Navigate to app as guest
3. **Expected**: Browser 2 has empty cart (localStorage is per-browser)
4. **Browser 1**: Login
5. **Expected**: Items merged to user account
6. **Browser 2**: Login with same account
7. **Expected**: Items from Browser 1 merge are visible

---

## Debugging Tips

### Check Local Storage
```javascript
// In browser console
localStorage.getItem('etaha_guest_cart')
// Should return JSON array or null
```

### Check Database (Supabase)
```sql
-- Check user's cart items
SELECT * FROM cart_items WHERE user_id = '<user-uuid>';

-- Check product stock
SELECT id, name, stock_quantity FROM products;
```

### Check Network Requests
- Open DevTools → Network tab
- Filter: XHR/Fetch
- Look for:
  - `cart_items` INSERT/UPDATE requests during merge
  - `cart_items` SELECT requests when loading cart

### Check Console Errors
- Open DevTools → Console tab
- Look for:
  - "Error merging guest cart: ..." (should be silent to user)
  - Any Supabase/database errors
  - Any React errors

---

## Automated Testing Commands

### Run Type Check
```bash
npm run typecheck
```

### Run Build (validates everything)
```bash
npm run build
```

### Run Development Server
```bash
npm run dev
```

---

## Known Behaviors (Not Bugs)

1. **Silent Cart Merge**: Cart merge happens in background, no loading spinner shown to user
2. **Error Handling**: If cart merge fails, user still gets authenticated (cart items may be lost)
3. **Stock Validation**: Stock validation happens at checkout, not during cart merge
4. **Guest Cart Expiration**: Guest cart persists indefinitely in localStorage (until cleared)

---

## Report Issues

If you find issues, please document:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Console errors (if any)
6. Network requests (if relevant)
7. Screenshots/videos if possible

---

## Quick Smoke Test (5 minutes)

For a quick validation, run these steps:

1. ✅ Add item as guest
2. ✅ Sign up via checkout
3. ✅ Verify item in cart
4. ✅ Add another item
5. ✅ Logout
6. ✅ Verify cart is empty
7. ✅ Login again
8. ✅ Verify previously added items are there

If all steps pass, the feature is working correctly! 🎉
