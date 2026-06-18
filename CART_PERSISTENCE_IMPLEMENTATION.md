# Guest Cart Persistence Implementation

## Overview
This document describes the implementation of guest cart persistence across login, sign-up, and logout flows.

## Requirements Implemented

### ✅ 1. Guest Cart Persists After Sign-Up
- Guest users can add items to cart without authentication
- When proceeding to checkout, they can choose to sign up instead of log in
- All items added before signing up are preserved and merged into their authenticated cart
- Implementation mirrors the existing login flow for consistency

### ✅ 2. Existing Login Flow Preserved
- No changes to the working login cart restoration flow
- Login continues to merge guest cart items with user's existing cart
- Redirect flow from cart to login and back works as expected

### ✅ 3. Guest Cart Cleared After Logout
- When a user logs out, the guest cart (localStorage) is cleared
- This prevents old guest cart items from reappearing after logout
- Logged-out users see an empty cart, as expected

### ✅ 4. Redirect Parameter Flow
- Both login and register pages now support `?redirect=cart` parameter
- When switching between login ↔ register, the redirect parameter is preserved
- Users can seamlessly move between authentication flows without losing context

## Technical Implementation

### Files Modified

#### 1. `app/register/page.tsx`
**Changes:**
- Added Suspense boundary wrapper (required for `useSearchParams`)
- Added `useRouter` and `useSearchParams` hooks
- Implemented `mergeGuestCart()` function (identical to login implementation)
- Added redirect logic after successful sign-up
- Preserved redirect parameter when linking to login page

**Key Functions:**
```typescript
const mergeGuestCart = async () => {
  const guestCart = getGuestCart();
  if (guestCart.length === 0) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  for (const guestItem of guestCart) {
    // Check if item already exists in user's cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', guestItem.productId)
      .maybeSingle();

    if (existing) {
      // Merge quantities
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + guestItem.quantity })
        .eq('id', existing.id);
    } else {
      // Insert new item
      await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: guestItem.productId,
          quantity: guestItem.quantity
        });
    }
  }

  clearGuestCart();
  window.dispatchEvent(new Event('cart-updated'));
};
```

#### 2. `app/login/page.tsx`
**Changes:**
- Updated register link to preserve redirect parameter
- Ensures seamless flow between login and register pages

**Before:**
```tsx
<Link href="/register">
```

**After:**
```tsx
<Link href={`/register${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}>
```

#### 3. `lib/auth-context.tsx`
**Changes:**
- Added `clearGuestCart` import
- Updated `signOut` function to clear guest cart on logout

**Implementation:**
```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  // Clear guest cart on logout to prevent old guest items from reappearing
  clearGuestCart();
  
  router.push('/');
};
```

## User Flow Examples

### Scenario 1: Guest → Sign Up → Cart Preserved
1. User browses products without logging in
2. User adds items to cart (stored in localStorage)
3. User clicks "Checkout"
4. System redirects to `/login?redirect=cart`
5. User clicks "Sign Up" → redirects to `/register?redirect=cart`
6. User completes sign-up
7. System merges guest cart items into user's database cart
8. System redirects to `/dashboard/cart`
9. ✅ All items are still in cart

### Scenario 2: Guest → Login → Cart Preserved (Existing)
1. User adds items to cart as guest
2. User clicks "Checkout" → redirected to `/login?redirect=cart`
3. User logs in
4. System merges guest cart into user's cart
5. System redirects to `/dashboard/cart`
6. ✅ All items are still in cart

### Scenario 3: Authenticated → Logout → Empty Cart
1. User is logged in with items in cart (from guest or added while authenticated)
2. User clicks "Logout"
3. System clears authentication session
4. System clears guest cart (localStorage)
5. System redirects to home page
6. ✅ If user views cart without logging in, it's empty

### Scenario 4: Switch Between Login/Register
1. User adds items as guest
2. User clicks "Checkout" → `/login?redirect=cart`
3. User decides to sign up instead → clicks "Sign Up" link
4. System redirects to `/register?redirect=cart` (preserves redirect)
5. User changes mind → clicks "Sign In" link
6. System redirects to `/login?redirect=cart` (preserves redirect)
7. ✅ Redirect context maintained throughout

## Code Consistency

### Design Principles
1. **DRY (Don't Repeat Yourself)**: The cart merge logic is identical in both login and register flows
2. **Existing Patterns**: Register flow now matches login flow exactly
3. **Error Handling**: Cart merge failures are logged but don't block authentication (same as login)
4. **User Experience**: Silent cart merge - users don't see merge process, just see their items preserved

### Shared Logic Pattern
Both `app/login/page.tsx` and `app/register/page.tsx` use the same:
- `mergeGuestCart()` function implementation
- `getGuestCart()` and `clearGuestCart()` utilities
- Redirect parameter handling
- Success toast and navigation logic

## Testing Checklist

### Manual Testing Scenarios

- [x] ✅ Build succeeds without errors
- [x] ✅ TypeScript compilation passes
- [ ] Guest cart persists after sign-up
- [ ] Guest cart persists after login (existing behavior)
- [ ] Guest cart is empty after logout
- [ ] Redirect parameter preserved between login/register
- [ ] Cart items merge correctly (quantities add up)
- [ ] Cart merge works when user already has items in cart
- [ ] Cart merge handles duplicate items correctly
- [ ] Error in cart merge doesn't break authentication

### Automated Testing (Recommended)

While not implemented in this PR, here are recommended test cases:

```typescript
describe('Guest Cart Persistence', () => {
  describe('Sign-up Flow', () => {
    it('should preserve guest cart items after sign-up', async () => {
      // Add items to guest cart
      // Complete sign-up
      // Verify items are in authenticated cart
    });

    it('should merge guest cart with existing user cart', async () => {
      // Add items to guest cart
      // Sign up
      // Add more items while authenticated
      // Log out and log in
      // Verify all items are present
    });

    it('should handle redirect parameter from cart to register', async () => {
      // Add items to guest cart
      // Navigate to cart
      // Click checkout → should redirect to login with ?redirect=cart
      // Click sign up → should redirect to register with ?redirect=cart
      // Complete sign-up → should redirect to cart
    });
  });

  describe('Login Flow', () => {
    it('should preserve existing cart merge behavior', async () => {
      // Verify login cart merge still works
    });
  });

  describe('Logout Flow', () => {
    it('should clear guest cart on logout', async () => {
      // Log in with guest cart items
      // Log out
      // Verify localStorage guest cart is empty
    });

    it('should show empty cart after logout', async () => {
      // Log in
      // Add items to cart
      // Log out
      // Navigate to cart
      // Verify cart is empty (as guest)
    });
  });
});
```

## Deployment Checklist

- [x] Code changes implemented
- [x] TypeScript compilation passes
- [x] Production build succeeds
- [x] Changes committed to Git
- [x] Changes pushed to GitHub
- [ ] Manual testing in staging/development
- [ ] User acceptance testing
- [ ] Deploy to production

## Notes

### localStorage Usage
- Guest cart is stored in `localStorage` under key `etaha_guest_cart`
- Format: `Array<{ productId: string, quantity: number }>`
- Automatically cleared on logout
- Persists across browser sessions until cleared

### Security Considerations
- Guest cart only stores product IDs and quantities (no sensitive data)
- Cart merge happens after successful authentication
- Database operations use authenticated user session
- No risk of cart injection or manipulation between users

### Performance
- Cart merge is async and doesn't block UI
- Errors in cart merge are logged but don't affect authentication
- `cart-updated` event triggers UI refresh automatically
- Minimal impact on sign-up/login performance

## Future Enhancements

1. **Cart Expiration**: Add expiration to guest cart items (e.g., 30 days)
2. **Cart Size Limits**: Implement max items/quantity limits for guest carts
3. **Analytics**: Track guest → authenticated conversion rates
4. **Conflict Resolution**: Add UI for handling stock issues during merge
5. **Cart Sync**: Consider real-time cart sync for multi-device support
