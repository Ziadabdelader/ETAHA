# ETAHA - Internationalization & Dark Mode Implementation

## 📖 Overview

This document provides a complete guide to the i18n (internationalization) and dark mode implementation for the ETAHA vehicle parts and maintenance platform.

## 🎯 Features Implemented

### Language Support
- ✅ **English (EN)** - Default language
- ✅ **Arabic (AR)** - Modern Standard Arabic with full RTL support
- ✅ **Persistent Selection** - Language choice saved in localStorage
- ✅ **Automatic HTML Updates** - `lang` and `dir` attributes update automatically
- ✅ **Toggle Button** - Shows "AR" in English, "EN" in Arabic

### Theme Support
- ✅ **Light Mode** - Default theme
- ✅ **Dark Mode** - Full dark theme with proper contrast
- ✅ **Persistent Selection** - Theme choice saved in localStorage
- ✅ **No FOUC** - Before-hydration script prevents flash
- ✅ **Toggle Button** - Shows Moon icon in light mode, Sun icon in dark mode

### RTL (Right-to-Left) Support
- ✅ **Automatic Layout Flip** - Entire layout mirrors for Arabic
- ✅ **Logical Properties** - Uses `ms-*`, `me-*`, `ps-*`, `pe-*` for spacing
- ✅ **Icon Positioning** - Icons automatically position correctly
- ✅ **Text Alignment** - Text aligns correctly based on direction

## 📁 Project Structure

```
project/
├── public/
│   └── locales/
│       ├── en/
│       │   └── translation.json    # English translations
│       └── ar/
│           └── translation.json    # Arabic translations
├── lib/
│   ├── i18n.ts                     # i18n configuration
│   └── i18n-provider.tsx           # React provider wrapper
├── components/
│   ├── preference-toggles.tsx      # Language & theme toggles
│   ├── site-navbar.tsx             # Public site navigation
│   └── dashboard-layout.tsx        # Dashboard navigation
├── app/
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Home page
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Register page
│   └── dashboard/
│       ├── page.tsx                # Dashboard home
│       ├── parts/page.tsx          # Parts catalog (needs update)
│       ├── cart/page.tsx           # Shopping cart (needs update)
│       ├── maintenance/page.tsx    # Maintenance (needs update)
│       ├── orders/page.tsx         # Orders (needs update)
│       ├── requests/page.tsx       # Requests (needs update)
│       └── profile/page.tsx        # Profile (needs update)
└── docs/
    ├── IMPLEMENTATION_STATUS.md    # Detailed status
    ├── QUICK_UPDATE_GUIDE.md       # Step-by-step guide
    ├── IMPLEMENTATION_SUMMARY.md   # Overview
    ├── COMPLETION_CHECKLIST.md     # Task checklist
    └── I18N_DARK_MODE_README.md    # This file
```

## 🚀 Quick Start

### For Users

1. **Change Language:**
   - Click the language button in the navbar
   - Shows "AR" when in English, "EN" when in Arabic
   - Page reloads with new language and RTL layout

2. **Change Theme:**
   - Click the theme button in the navbar
   - Shows Moon icon in light mode, Sun icon in dark mode
   - Theme changes instantly

3. **Preferences Persist:**
   - Your choices are saved automatically
   - They persist across page refreshes and browser sessions

### For Developers

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Test Language Switch:**
   ```javascript
   // In browser console
   localStorage.setItem('lang', 'ar');
   location.reload();
   ```

4. **Test Theme Switch:**
   ```javascript
   // In browser console
   localStorage.setItem('theme', 'dark');
   location.reload();
   ```

5. **Reset Preferences:**
   ```javascript
   // In browser console
   localStorage.clear();
   location.reload();
   ```

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `IMPLEMENTATION_STATUS.md` | Detailed status, known issues, testing checklist | Developers |
| `QUICK_UPDATE_GUIDE.md` | Step-by-step guide for updating pages | Developers |
| `IMPLEMENTATION_SUMMARY.md` | High-level overview and progress | Project Managers |
| `COMPLETION_CHECKLIST.md` | Task-by-task checklist | Developers |
| `I18N_DARK_MODE_README.md` | User and developer guide | Everyone |

## 🔧 How It Works

### Language Switching

1. User clicks language button
2. `PreferenceToggles` component calls `i18n.changeLanguage()`
3. i18n updates `localStorage.lang`
4. i18n event handler updates `<html lang>` and `<html dir>`
5. i18n mirrors value to cookie for server-side hint
6. All `t()` calls re-render with new language

### Theme Switching

1. User clicks theme button
2. `PreferenceToggles` component updates state
3. Component updates `localStorage.theme`
4. Component adds/removes `dark` class on `<html>`
5. Tailwind CSS applies dark mode styles
6. All components re-render with new theme

### Preventing FOUC (Flash of Unstyled Content)

1. Before React hydrates, inline script runs
2. Script reads `localStorage.theme` and `localStorage.lang`
3. Script immediately applies `dark` class, `lang`, and `dir` to `<html>`
4. React hydrates with correct theme/language already applied
5. No flash or layout shift occurs

## 🎨 Using Translations

### In Components

```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <p>{t('page.description')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Available Translation Keys

See `public/locales/en/translation.json` for all available keys:

- `nav.*` - Navigation items
- `home.*` - Home page
- `auth.login.*` - Login page
- `auth.register.*` - Register page
- `dashboard.*` - Dashboard
- `parts.*` - Parts catalog
- `cart.*` - Shopping cart
- `maintenance.*` - Maintenance
- `orders.*` - Orders
- `requests.*` - Service requests
- `profile.*` - Profile
- `common.*` - Common UI elements
- `aria.*` - Accessibility labels

### Adding New Translations

1. Add key to `public/locales/en/translation.json`
2. Add corresponding Arabic translation to `public/locales/ar/translation.json`
3. Use in component with `t('your.new.key')`

## 🎨 Using Theme Tokens

### Color Classes

Instead of hardcoded colors, use theme tokens:

```typescript
// ❌ Don't use hardcoded colors
<div className="bg-white text-slate-900 border-slate-200">

// ✅ Use theme tokens
<div className="bg-background text-foreground border-border">
```

### Available Tokens

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `background` | White | Dark gray | Page backgrounds |
| `foreground` | Black | White | Main text |
| `card` | White | Dark gray | Card backgrounds |
| `card-foreground` | Black | White | Card text |
| `primary` | Brand color | Brand color | Primary buttons |
| `primary-foreground` | White | White | Text on primary |
| `secondary` | Light gray | Dark gray | Secondary buttons |
| `muted` | Light gray | Dark gray | Muted backgrounds |
| `muted-foreground` | Gray | Light gray | Muted text |
| `destructive` | Red | Red | Error/danger |
| `border` | Light gray | Dark gray | Borders |

### Custom Dark Mode Styles

If needed, add explicit dark mode variants:

```typescript
<div className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-2xl">
```

## 🌍 RTL Support

### Logical Properties

Use logical properties instead of directional ones:

```typescript
// ❌ Don't use directional properties
<div className="mr-4 ml-2 pl-6">

// ✅ Use logical properties
<div className="me-4 ms-2 ps-6">
```

| Directional | Logical | Meaning |
|-------------|---------|---------|
| `ml-*` | `ms-*` | Margin start (left in LTR, right in RTL) |
| `mr-*` | `me-*` | Margin end (right in LTR, left in RTL) |
| `pl-*` | `ps-*` | Padding start |
| `pr-*` | `pe-*` | Padding end |
| `space-x-*` | `gap-*` | Gap (works in both directions) |

### Testing RTL

1. Switch to Arabic: `localStorage.setItem('lang', 'ar'); location.reload();`
2. Verify layout flips correctly
3. Verify icons position correctly
4. Verify text aligns correctly
5. Verify forms work correctly

## 🧪 Testing

### Manual Testing Checklist

For each page, test all 4 combinations:

1. ✅ English + Light Mode
2. ✅ English + Dark Mode
3. ✅ Arabic + Light Mode
4. ✅ Arabic + Dark Mode

### What to Check

- [ ] All text is translated
- [ ] All text is readable (good contrast)
- [ ] Layout looks correct
- [ ] Icons position correctly
- [ ] Forms work correctly
- [ ] Buttons work correctly
- [ ] Modals/dialogs work correctly
- [ ] Toast messages are translated
- [ ] Empty states are translated
- [ ] Loading states work
- [ ] Mobile responsive

### Build Commands

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# If build fails due to Google Fonts timeout, retry
npm run build
```

## 🐛 Troubleshooting

### Language Not Changing

1. Check browser console for errors
2. Verify `localStorage.lang` is set: `localStorage.getItem('lang')`
3. Clear localStorage and try again: `localStorage.clear(); location.reload();`
4. Check that translation files exist in `public/locales/`

### Theme Not Changing

1. Check browser console for errors
2. Verify `localStorage.theme` is set: `localStorage.getItem('theme')`
3. Check that `<html>` has `dark` class in dark mode
4. Verify Tailwind config has `darkMode: ['class']`

### FOUC (Flash of Unstyled Content)

1. Verify inline script in `app/layout.tsx` is present
2. Check that script runs before React hydration
3. Verify `suppressHydrationWarning` is on `<html>`

### RTL Layout Issues

1. Verify `<html dir>` attribute is set correctly
2. Check that logical properties are used (`ms-*`, `me-*`)
3. Avoid using `space-x-*`, use `gap-*` instead
4. Test in Arabic mode to see layout flip

### Build Failures

1. **Google Fonts Timeout:** Retry the build, it's a network issue
2. **TypeScript Errors:** Run `npm run typecheck` to see details
3. **ESLint Errors:** Run `npm run lint` to see details
4. **Missing Dependencies:** Run `npm install`

## 📊 Current Status

### Completed (60%)
- ✅ Infrastructure (100%)
- ✅ Navigation (100%)
- ✅ Public Pages (100%)
- ✅ Dashboard Home (100%)

### In Progress (40%)
- ⏳ Parts Page
- ⏳ Cart Page
- ⏳ Maintenance Page
- ⏳ Orders Page
- ⏳ Requests Page
- ⏳ Profile Page

### Estimated Time to Complete
- **Per Page:** 15-20 minutes
- **Total Remaining:** 1.5-2 hours

## 🎓 Best Practices

### Do's ✅
- Use `t()` for all user-facing text
- Use theme tokens for colors
- Use logical properties for spacing
- Test in all 4 combinations
- Add aria-labels to interactive elements
- Translate toast messages
- Translate empty states
- Translate form placeholders

### Don'ts ❌
- Don't hardcode text strings
- Don't use hardcoded colors
- Don't use directional properties (`ml-*`, `mr-*`)
- Don't use `space-x-*` (use `gap-*`)
- Don't forget to translate error messages
- Don't forget to test RTL layout
- Don't forget to test dark mode

## 🤝 Contributing

When adding new features:

1. Add translation keys to both language files
2. Use theme tokens for colors
3. Use logical properties for spacing
4. Test in all 4 combinations
5. Update documentation if needed

## 📞 Support

For questions or issues:

1. Check this README
2. Check `IMPLEMENTATION_STATUS.md` for known issues
3. Check `QUICK_UPDATE_GUIDE.md` for patterns
4. Review completed pages for examples
5. Check browser console for errors

## 🎉 Success Criteria

The implementation is complete when:

- ✅ All pages are translated
- ✅ All pages support dark mode
- ✅ All pages support RTL
- ✅ No FOUC on page load
- ✅ Preferences persist across sessions
- ✅ All tests pass
- ✅ Build succeeds
- ✅ No console errors

---

**Version:** 1.0
**Last Updated:** 2026-04-30
**Status:** In Progress (60% Complete)
**Next Milestone:** Complete all dashboard pages
