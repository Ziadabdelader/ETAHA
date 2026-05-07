# Quick Guide: Update Remaining Pages with Currency and Theme

## Pages That Need Updates

1. ✅ **Cart Page** - DONE
2. ⏳ **Parts Catalog** (`app/dashboard/parts/page.tsx`)
3. ⏳ **Orders Page** (`app/dashboard/orders/page.tsx`)
4. ⏳ **Maintenance Page** (`app/dashboard/maintenance/page.tsx`) - if it shows prices
5. ⏳ **Profile Page** (`app/dashboard/profile/page.tsx`) - if it shows prices
6. ⏳ **Requests Page** (`app/dashboard/requests/page.tsx`) - if it shows prices

## Step-by-Step Update Process

### 1. Add Currency Import

At the top of the file:

```typescript
import { formatCurrency } from '@/lib/currency';
```

### 2. Replace Price Displays

Find all instances of price formatting and replace:

```typescript
// ❌ OLD - Dollar formatting
<p>${product.price.toFixed(2)}</p>
<span>${totalAmount.toFixed(2)}</span>
<div>Total: ${order.total_amount.toFixed(2)}</div>

// ✅ NEW - LE formatting
<p>{formatCurrency(product.price)}</p>
<span>{formatCurrency(totalAmount)}</span>
<div>Total: {formatCurrency(order.total_amount)}</div>
```

### 3. Update Color Classes

Replace any remaining hardcoded colors with theme tokens:

```typescript
// ❌ OLD - Hardcoded colors
className="bg-[#17a2b8]"
className="text-[#0d5a7d]"
className="border-slate-200"
className="text-slate-900"
className="bg-slate-50"

// ✅ NEW - Theme tokens
className="bg-primary"
className="text-primary"
className="border-border"
className="text-foreground"
className="bg-muted"
```

### 4. Update Loading Spinners

```typescript
// ❌ OLD
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17a2b8]"></div>

// ✅ NEW
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
```

### 5. Verify Translations

Make sure all text uses translation keys:

```typescript
// ❌ OLD
<h1>Parts Catalog</h1>
<button>Add to Cart</button>
<p>No items found</p>

// ✅ NEW
<h1>{t('parts.title')}</h1>
<button>{t('parts.addToCart')}</button>
<p>{t('parts.noResults')}</p>
```

## Common Patterns

### Product Card with Price

```typescript
<Card>
  <CardContent className="p-4">
    <h3 className="font-semibold text-foreground">{product.name}</h3>
    <p className="text-2xl font-bold text-primary mt-2">
      {formatCurrency(product.price)}
    </p>
    <Button className="w-full mt-4">
      {t('parts.addToCart')}
    </Button>
  </CardContent>
</Card>
```

### Order Total Display

```typescript
<div className="flex justify-between items-center">
  <span className="text-lg font-semibold text-foreground">
    {t('cart.total')}:
  </span>
  <span className="text-2xl font-bold text-primary">
    {formatCurrency(order.total_amount)}
  </span>
</div>
```

### Status Badge

```typescript
<Badge className={
  status === 'pending' ? 'bg-yellow-500' :
  status === 'delivered' ? 'bg-green-500' :
  'bg-muted'
}>
  {t(`orders.statuses.${status}`)}
</Badge>
```

### Empty State

```typescript
<Card>
  <CardContent className="py-16 text-center">
    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-foreground mb-2">
      {t('orders.noOrders')}
    </h3>
    <p className="text-muted-foreground mb-6">
      {t('orders.noOrdersDescription')}
    </p>
    <Button asChild>
      <Link href="/dashboard/parts">{t('cart.browseParts')}</Link>
    </Button>
  </CardContent>
</Card>
```

## Testing Each Page

After updating each page:

1. ✅ Check in English light mode
2. ✅ Check in English dark mode
3. ✅ Check in Arabic light mode
4. ✅ Check in Arabic dark mode
5. ✅ Verify all prices show "LE" not "$"
6. ✅ Verify all colors use theme tokens
7. ✅ Verify all text is translated
8. ✅ Test on mobile viewport
9. ✅ Test all interactive elements

## Quick Test Commands

```bash
# Start dev server
npm run dev

# In browser console:
# Test Arabic
localStorage.setItem('lang', 'ar');
location.reload();

# Test dark mode
localStorage.setItem('theme', 'dark');
location.reload();

# Reset
localStorage.clear();
location.reload();

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

## Common Mistakes to Avoid

❌ Don't forget to import `formatCurrency`
❌ Don't use `$` symbol anywhere
❌ Don't use hardcoded colors like `#17a2b8`
❌ Don't use `bg-white` or `text-slate-900`
❌ Don't forget to translate button text
❌ Don't forget to translate empty states
❌ Don't forget to test in dark mode

✅ Do use `formatCurrency()` for all prices
✅ Do use theme tokens (`bg-primary`, `text-foreground`)
✅ Do use translation keys (`t('key.path')`)
✅ Do test in all 4 combinations (EN/AR × Light/Dark)
✅ Do verify mobile responsiveness

## Estimated Time Per Page

- **Parts Catalog**: 10-15 minutes
- **Orders Page**: 10-15 minutes
- **Maintenance Page**: 5-10 minutes
- **Profile Page**: 5 minutes
- **Requests Page**: 10 minutes

**Total**: ~45-60 minutes for all remaining pages

## Priority Order

1. **Parts Catalog** - Most visible, shows prices
2. **Orders Page** - Shows order totals
3. **Maintenance Page** - May show service prices
4. **Requests Page** - May show service costs
5. **Profile Page** - Least likely to show prices

## Success Checklist

For each page, verify:
- [ ] All prices formatted with `formatCurrency()`
- [ ] All colors use theme tokens
- [ ] All text uses translation keys
- [ ] Loading spinner uses `border-primary`
- [ ] Empty states use proper colors
- [ ] Buttons use proper colors
- [ ] Cards use proper colors
- [ ] Badges use proper colors
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Tested in English
- [ ] Tested in Arabic
- [ ] Tested on mobile
- [ ] No TypeScript errors
- [ ] No console errors

---

**Quick Reference**: See `VISUAL_CHECKOUT_CURRENCY_UPDATE_SUMMARY.md` for complete details
