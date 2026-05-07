# Van Position Adjustment Guide

## Current Van Code Location
File: `project/app/page.tsx` (around line 35-43)

## Current Van Code
```tsx
{/* VAN */}
<div className="absolute inset-x-0 bottom-12 z-10 flex justify-center md:justify-start md:left-[10%] pointer-events-none overflow-visible px-4 md:px-8">
  <Image
    src="/opened-van.png"
    alt="Van"
    width={1289}
    height={1221}
    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 58vw, 700px"
    className="h-auto w-full max-w-[92vw] md:max-w-[700px] object-contain object-bottom"
    priority
  />
</div>
```

## How to Adjust Van Position

### 1. **Vertical Position (Up/Down)**

Change the `bottom-X` value in the container div:

```tsx
bottom-0   → Van at the very bottom (touching bottom edge)
bottom-4   → Van 16px from bottom
bottom-8   → Van 32px from bottom
bottom-12  → Van 48px from bottom (current)
bottom-16  → Van 64px from bottom
bottom-20  → Van 80px from bottom
bottom-24  → Van 96px from bottom
```

**Example - Move van higher:**
```tsx
<div className="absolute inset-x-0 bottom-20 z-10 ...">
```

**Example - Move van to very bottom:**
```tsx
<div className="absolute inset-x-0 bottom-0 z-10 ...">
```

### 2. **Horizontal Position (Left/Right)**

#### On Mobile (all screens < 768px):
Change `justify-center` to:
- `justify-start` → Van on left side
- `justify-center` → Van centered (current)
- `justify-end` → Van on right side

#### On Desktop (screens ≥ 768px):
Change `md:justify-start md:left-[10%]` to:

**Left side positions:**
```tsx
md:justify-start md:left-[0%]    → Far left edge
md:justify-start md:left-[5%]    → Slightly from left
md:justify-start md:left-[10%]   → Current position
md:justify-start md:left-[15%]   → More to the right
```

**Center position:**
```tsx
md:justify-center                 → Centered on desktop
```

**Right side positions:**
```tsx
md:justify-end md:right-[0%]     → Far right edge
md:justify-end md:right-[5%]     → Slightly from right
md:justify-end md:right-[10%]    → More to the left
```

### 3. **Van Size**

Change the `max-w-` values in the Image className:

```tsx
max-w-[92vw] md:max-w-[500px]   → Smaller van
max-w-[92vw] md:max-w-[600px]   → Medium-small van
max-w-[92vw] md:max-w-[700px]   → Current size
max-w-[92vw] md:max-w-[800px]   → Larger van
max-w-[92vw] md:max-w-[900px]   → Very large van
```

### 4. **Complete Examples**

#### Example 1: Van on far right, at bottom
```tsx
<div className="absolute inset-x-0 bottom-0 z-10 flex justify-center md:justify-end pointer-events-none overflow-visible px-4 md:px-8">
```

#### Example 2: Van centered, higher up
```tsx
<div className="absolute inset-x-0 bottom-24 z-10 flex justify-center pointer-events-none overflow-visible px-4 md:px-8">
```

#### Example 3: Van on left, medium height, smaller size
```tsx
<div className="absolute inset-x-0 bottom-16 z-10 flex justify-center md:justify-start md:left-[5%] pointer-events-none overflow-visible px-4 md:px-8">
  <Image
    src="/opened-van.png"
    alt="Van"
    width={1289}
    height={1221}
    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 58vw, 600px"
    className="h-auto w-full max-w-[92vw] md:max-w-[600px] object-contain object-bottom"
    priority
  />
</div>
```

## Quick Reference Table

| Position | Vertical | Horizontal (Desktop) | Code |
|----------|----------|---------------------|------|
| **Bottom Right** | `bottom-0` | `md:justify-end` | Default original |
| **Bottom Center** | `bottom-0` | `md:justify-center` | Centered |
| **Bottom Left** | `bottom-0` | `md:justify-start md:left-[0%]` | Far left |
| **Mid Right** | `bottom-12` | `md:justify-end` | Raised right |
| **Mid Center** | `bottom-12` | `md:justify-center` | Raised center |
| **Mid Left** | `bottom-12` | `md:justify-start md:left-[10%]` | **Current** |
| **High Right** | `bottom-24` | `md:justify-end` | High right |
| **High Center** | `bottom-24` | `md:justify-center` | High center |
| **High Left** | `bottom-24` | `md:justify-start md:left-[5%]` | High left |

## Tips

1. **Test on different screen sizes**: Use browser dev tools to test mobile, tablet, and desktop views
2. **Adjust incrementally**: Change values by small amounts (4, 8, 12) to fine-tune
3. **Keep mobile centered**: Usually best to keep `justify-center` for mobile and only change desktop position
4. **Watch for text overlap**: Make sure the van doesn't cover important text
5. **Consider the buttons**: The "Get Started" and "Learn More" buttons are positioned at `left-[75%] bottom-[200px]`

## Current Settings Summary

- **Vertical**: `bottom-12` (48px from bottom)
- **Horizontal Mobile**: `justify-center` (centered)
- **Horizontal Desktop**: `md:justify-start md:left-[10%]` (left side, 10% from edge)
- **Size**: `max-w-[700px]` on desktop
- **Image**: `opened-van.png` (high resolution)
