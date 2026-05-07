# Quick Update Guide for Remaining Dashboard Pages

## Step-by-Step Process for Each Page

### 1. Add Translation Hook

At the top of the component, after other hooks:

```typescript
import { useTranslation } from 'react-i18next';

export default function YourPage() {
  const { t } = useTranslation();
  // ... rest of component
}
```

### 2. Replace Text Strings

| Original | Replace With |
|----------|-------------|
| `"Parts Catalog"` | `{t('parts.title')}` |
| `"Search..."` | `{t('parts.search')}` |
| `"Add to Cart"` | `{t('parts.addToCart')}` |
| `"Shopping Cart"` | `{t('cart.title')}` |
| `"Checkout"` | `{t('cart.checkout')}` |
| `"Schedule Service"` | `{t('maintenance.schedule')}` |
| `"My Orders"` | `{t('orders.title')}` |
| `"Service Requests"` | `{t('requests.title')}` |
| `"My Profile"` | `{t('profile.title')}` |
| `"Loading..."` | `{t('common.loading')}` |
| `"Save"` | `{t('common.save')}` |
| `"Cancel"` | `{t('common.cancel')}` |

### 3. Replace Colors with Theme Tokens

#### Backgrounds
```typescript
// Before
className="bg-white"
className="bg-slate-50"
className="bg-slate-100"
className="bg-[#17a2b8]"
className="bg-[#0d5a7d]"

// After
className="bg-background"
className="bg-muted"
className="bg-card"
className="bg-primary"
className="bg-secondary"
```

#### Text Colors
```typescript
// Before
className="text-slate-900"
className="text-slate-700"
className="text-slate-600"
className="text-slate-500"
className="text-[#0d5a7d]"
className="text-red-600"

// After
className="text-foreground"
className="text-card-foreground"
className="text-muted-foreground"
className="text-muted-foreground"
className="text-primary"
className="text-destructive"
```

#### Borders
```typescript
// Before
className="border-slate-200"
className="border-slate-300"
className="border-gray-200"

// After
className="border-border"
className="border-border"
className="border-border"
```

### 4. Fix Spacing for RTL

```typescript
// Before
className="mr-2"
className="ml-4"
className="space-x-4"
className="pl-6"
className="pr-6"

// After
className="me-2"  // margin-end (right in LTR, left in RTL)
className="ms-4"  // margin-start (left in LTR, right in RTL)
className="gap-4" // works in both directions
className="ps-6"  // padding-start
className="pe-6"  // padding-end
```

### 5. Add Dark Mode Variants (If Needed)

Most components will work automatically, but for custom styles:

```typescript
// Before
className="shadow-lg"
className="bg-white border"

// After
className="shadow-lg dark:shadow-2xl"
className="bg-background dark:bg-card border"
```

### 6. Update Toast Messages

```typescript
// Before
toast.success('Item added to cart');
toast.error('Failed to add item');

// After
toast.success(t('parts.addedToCart'));
toast.error(t('parts.addToCartError'));
```

### 7. Update Form Placeholders

```typescript
// Before
<Input placeholder="Search parts..." />
<Input placeholder="Enter your email" />

// After
<Input placeholder={t('parts.searchPlaceholder')} />
<Input placeholder={t('auth.login.emailPlaceholder')} />
```

### 8. Update Status Badges

```typescript
// Before
{order.status === 'pending' && <Badge>Pending</Badge>}
{order.status === 'delivered' && <Badge>Delivered</Badge>}

// After
{order.status === 'pending' && <Badge>{t('orders.statuses.pending')}</Badge>}
{order.status === 'delivered' && <Badge>{t('orders.statuses.delivered')}</Badge>}
```

### 9. Update Service Type Labels

```typescript
// Before
const serviceTypes = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
];

// After
const serviceTypes = [
  { value: 'oil_change', label: t('maintenance.services.oil_change') },
  { value: 'tire_rotation', label: t('maintenance.services.tire_rotation') },
];
```

### 10. Update Empty States

```typescript
// Before
<div>
  <p>No items found</p>
  <p>Try adjusting your search</p>
</div>

// After
<div>
  <p>{t('parts.noResults')}</p>
  <p>{t('parts.noResultsDescription')}</p>
</div>
```

## Common Patterns

### Loading State
```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
```

### Empty State
```typescript
<Card>
  <CardContent className="flex flex-col items-center justify-center p-12">
    <Package className="h-16 w-16 text-muted-foreground mb-4" />
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

### Status Badge with Colors
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

<Badge className={getStatusColor(order.status)}>
  {t(`orders.statuses.${order.status}`)}
</Badge>
```

## Testing Each Page

After updating each page:

1. ✅ Check in English light mode
2. ✅ Check in English dark mode
3. ✅ Check in Arabic light mode
4. ✅ Check in Arabic dark mode
5. ✅ Verify all text is translated
6. ✅ Verify layout flips correctly in RTL
7. ✅ Verify all colors are readable
8. ✅ Test on mobile viewport
9. ✅ Test all interactive elements (buttons, forms, etc.)
10. ✅ Verify toast messages are translated

## Quick Test Commands

```bash
# Start dev server
npm run dev

# In browser console, test language switch:
localStorage.setItem('lang', 'ar');
location.reload();

# Test dark mode:
localStorage.setItem('theme', 'dark');
location.reload();

# Reset:
localStorage.clear();
location.reload();
```

## Common Mistakes to Avoid

❌ Don't use `mr-*` or `ml-*` - use `me-*` or `ms-*`
❌ Don't use `space-x-*` - use `gap-*`
❌ Don't hardcode colors like `bg-white` - use `bg-background`
❌ Don't forget to translate placeholder text
❌ Don't forget to translate toast messages
❌ Don't forget to translate button text
❌ Don't forget to translate empty state messages
❌ Don't forget to add dark mode variants for custom colors

✅ Do use logical properties (`ms-*`, `me-*`, `gap-*`)
✅ Do use theme tokens (`bg-background`, `text-foreground`)
✅ Do translate all user-facing text
✅ Do test in all 4 combinations (EN/AR × Light/Dark)
✅ Do verify RTL layout looks correct
✅ Do check mobile responsiveness
