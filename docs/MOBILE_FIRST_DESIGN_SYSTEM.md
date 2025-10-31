# Mobile-First Responsive Design System

## Overview

This document defines the mobile-first responsive design system for the One Client Report application. All components should follow these patterns to ensure consistent, accessible, and beautiful experiences across all screen sizes.

## Core Principles

1. **Mobile-First**: Start with mobile styles, then enhance for larger screens
2. **Progressive Enhancement**: Add complexity as screen size increases
3. **Touch-Friendly**: Minimum 44px touch targets on mobile
4. **Readable**: Appropriate font sizes for each screen size
5. **Consistent**: Use the same responsive patterns throughout the app

---

## Breakpoints

Tailwind CSS default breakpoints (mobile-first):

| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| `(default)` | 0px | Mobile phones |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Small laptops, large tablets |
| `xl:` | 1280px | Laptops, desktops |
| `2xl:` | 1536px | Large desktops |

---

## Typography System

### Hero Headings (H1)

**Pattern**: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`

```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black sm:font-extrabold tracking-normal text-[#f5f5f5] leading-tight">
  Your Hero Heading Here
</h1>
```

**Scale**:
- Mobile: `text-3xl` (30px / 1.875rem)
- Small: `text-4xl` (36px / 2.25rem)
- Medium: `text-5xl` (48px / 3rem)
- Large: `text-6xl` (60px / 3.75rem)
- Extra Large: `text-7xl` (72px / 4.5rem)

**Font Weight**:
- Mobile: `font-black` (900) - Heavier for better readability on small screens
- Desktop (sm+): `font-extrabold` (800) - Slightly lighter for refined look

**Additional Styles**:
- `leading-tight` - Tight line height for impact
- `tracking-normal` - Normal letter spacing

---

### Section Headings (H2)

**Pattern**: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`

```tsx
<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#f5f5f5]">
  Section Heading
</h2>
```

**Scale**:
- Mobile: `text-2xl` (24px / 1.5rem)
- Small: `text-3xl` (30px / 1.875rem)
- Medium: `text-4xl` (36px / 2.25rem)
- Large: `text-5xl` (48px / 3rem)

---

### Subheadings (H3)

**Pattern**: `text-xl sm:text-2xl md:text-3xl`

```tsx
<h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e5e5e5]">
  Subheading
</h3>
```

**Scale**:
- Mobile: `text-xl` (20px / 1.25rem)
- Small: `text-2xl` (24px / 1.5rem)
- Medium: `text-3xl` (30px / 1.875rem)

---

### Body Text (Paragraphs)

**Pattern**: `text-sm sm:text-base md:text-lg lg:text-xl`

```tsx
<p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c0c0c0] leading-relaxed">
  Body text with comfortable reading size across all devices.
</p>
```

**Scale**:
- Mobile: `text-sm` (14px / 0.875rem)
- Small: `text-base` (16px / 1rem)
- Medium: `text-lg` (18px / 1.125rem)
- Large: `text-xl` (20px / 1.25rem)

**Additional Styles**:
- `leading-relaxed` - Comfortable line height for readability

---

### Small Text (Captions, Labels)

**Pattern**: `text-xs sm:text-sm`

```tsx
<span className="text-xs sm:text-sm text-[#999999]">
  Caption or label text
</span>
```

**Scale**:
- Mobile: `text-xs` (12px / 0.75rem)
- Small+: `text-sm` (14px / 0.875rem)

---

### Badges and Tags

**Pattern**: `text-xs sm:text-sm`

```tsx
<div className="text-xs sm:text-sm font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-full">
  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 inline-block" />
  Badge Text
</div>
```

**Scale**:
- Mobile: `text-xs` (12px), `px-4 py-2`, icon `w-3 h-3`
- Small+: `text-sm` (14px), `px-6 py-3`, icon `w-3.5 h-3.5`

---

## Spacing System

### Section Padding

**Vertical Padding Pattern**: `py-12 sm:py-16 md:py-24`

```tsx
<section className="py-12 sm:py-16 md:py-24">
  {/* Section content */}
</section>
```

**Scale**:
- Mobile: `py-12` (48px / 3rem)
- Small: `py-16` (64px / 4rem)
- Medium+: `py-24` (96px / 6rem)

---

### Container Spacing

**Vertical Spacing Between Elements**: `space-y-4 sm:space-y-6 md:space-y-8`

```tsx
<div className="space-y-4 sm:space-y-6 md:space-y-8">
  <div>Element 1</div>
  <div>Element 2</div>
  <div>Element 3</div>
</div>
```

**Scale**:
- Mobile: `space-y-4` (16px / 1rem)
- Small: `space-y-6` (24px / 1.5rem)
- Medium+: `space-y-8` (32px / 2rem)

---

### Heading Internal Spacing

**Pattern**: `space-y-2 sm:space-y-4`

```tsx
<div className="space-y-2 sm:space-y-4">
  <h1>Main Heading</h1>
  <span className="block">Subtext or multi-line heading</span>
</div>
```

**Scale**:
- Mobile: `space-y-2` (8px / 0.5rem)
- Small+: `space-y-4` (16px / 1rem)

---

### Element Margins

**Top Margin Pattern**: `mt-1 sm:mt-2`

```tsx
<span className="block mt-1 sm:mt-2">
  Second line of text
</span>
```

**Scale**:
- Mobile: `mt-1` (4px / 0.25rem)
- Small+: `mt-2` (8px / 0.5rem)

---

## Button System

### Button Heights

**Pattern**: `h-11 sm:h-14`

```tsx
<button className="h-11 sm:h-14 px-4 sm:px-8">
  Button Text
</button>
```

**Scale**:
- Mobile: `h-11` (44px) - Minimum touch target size
- Small+: `h-14` (56px) - More comfortable on larger screens

---

### Button Padding

**Horizontal Padding Pattern**: `px-4 sm:px-8`

```tsx
<button className="px-4 sm:px-8 h-11 sm:h-14 text-sm sm:text-base">
  Click Me
</button>
```

**Scale**:
- Mobile: `px-4` (16px / 1rem)
- Small+: `px-8` (32px / 2rem)

---

### Button Text Size

**Pattern**: `text-sm sm:text-base`

```tsx
<button className="text-sm sm:text-base font-semibold">
  Button Text
</button>
```

**Scale**:
- Mobile: `text-sm` (14px / 0.875rem)
- Small+: `text-base` (16px / 1rem)

---

### Button Icons

**Pattern**: Icon size and margin should scale

```tsx
<ArrowRight className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
```

**Scale**:
- Mobile: `h-3.5 w-3.5` (14px), `ml-1` (4px)
- Small+: `h-4 w-4` (16px), `ml-2` (8px)

---

### Button Container Gap

**Pattern**: `gap-2 sm:gap-4`

```tsx
<div className="flex flex-row gap-2 sm:gap-4">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

**Scale**:
- Mobile: `gap-2` (8px / 0.5rem)
- Small+: `gap-4` (16px / 1rem)

---

## Complete Component Examples

### Hero Section

```tsx
<section className="relative min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-24 bg-[#1a1a1a]">
  <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
    <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8">

      {/* Badge */}
      <div className="inline-block">
        <div className="text-xs sm:text-sm font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-[#1a1a1a] text-[#e5e5e5]">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 inline-block" />
          AI-Powered Reporting Platform
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black sm:font-extrabold tracking-normal text-[#f5f5f5] leading-tight">
          Generate Beautiful{" "}
          <span className="block mt-1 sm:mt-2">
            Client Reports in{" "}
            <span className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent">
              Minutes
            </span>
          </span>
        </h1>
      </div>

      {/* Description */}
      <div className="max-w-2xl mx-auto px-2 sm:px-0">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c0c0c0] leading-relaxed">
          Save 90% of your reporting time with AI-powered insights.
          Built for freelance marketers and small agencies.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center pt-4">
        <button className="text-sm sm:text-base px-4 sm:px-8 h-11 sm:h-14 rounded-3xl font-semibold">
          <span className="flex items-center justify-center">
            Start Free Trial
            <ArrowRight className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        </button>
        <button className="text-sm sm:text-base px-4 sm:px-8 h-11 sm:h-14 rounded-3xl font-semibold">
          View Live Demo
        </button>
      </div>

    </div>
  </div>
</section>
```

---

### Content Section

```tsx
<section className="py-12 sm:py-16 md:py-24 bg-[#1a1a1a]">
  <div className="max-w-7xl mx-auto px-4">
    <div className="space-y-4 sm:space-y-6 md:space-y-8">

      {/* Section Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#f5f5f5] text-center">
        Section Heading
      </h2>

      {/* Subheading */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e5e5e5] text-center">
        Optional Subheading
      </h3>

      {/* Body Content */}
      <div className="max-w-3xl mx-auto">
        <p className="text-sm sm:text-base md:text-lg text-[#c0c0c0] leading-relaxed">
          Your body content here with comfortable reading size.
        </p>
      </div>

    </div>
  </div>
</section>
```

---

### Card Component

```tsx
<div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 md:space-y-6 bg-[#151515] rounded-2xl">
  {/* Card Title */}
  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#f5f5f5]">
    Card Title
  </h3>

  {/* Card Description */}
  <p className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed">
    Card description with responsive text sizing.
  </p>

  {/* Card Action */}
  <button className="text-sm sm:text-base px-4 sm:px-6 h-10 sm:h-12 rounded-xl font-medium">
    Learn More
  </button>
</div>
```

---

## Quick Reference Table

### Typography Scale

| Element | Mobile | Small (640px+) | Medium (768px+) | Large (1024px+) | XL (1280px+) |
|---------|--------|----------------|-----------------|-----------------|--------------|
| Hero H1 | text-3xl (30px) | text-4xl (36px) | text-5xl (48px) | text-6xl (60px) | text-7xl (72px) |
| Section H2 | text-2xl (24px) | text-3xl (30px) | text-4xl (36px) | text-5xl (48px) | - |
| Subheading H3 | text-xl (20px) | text-2xl (24px) | text-3xl (30px) | - | - |
| Body Text | text-sm (14px) | text-base (16px) | text-lg (18px) | text-xl (20px) | - |
| Small Text | text-xs (12px) | text-sm (14px) | - | - | - |

### Spacing Scale

| Element | Mobile | Small (640px+) | Medium (768px+) |
|---------|--------|----------------|-----------------|
| Section Padding Y | py-12 (48px) | py-16 (64px) | py-24 (96px) |
| Container Space Y | space-y-4 (16px) | space-y-6 (24px) | space-y-8 (32px) |
| Heading Space Y | space-y-2 (8px) | space-y-4 (16px) | - |
| Button Gap | gap-2 (8px) | gap-4 (16px) | - |

### Button Scale

| Property | Mobile | Small (640px+) |
|----------|--------|----------------|
| Height | h-11 (44px) | h-14 (56px) |
| Padding X | px-4 (16px) | px-8 (32px) |
| Text Size | text-sm (14px) | text-base (16px) |
| Icon Size | h-3.5 w-3.5 (14px) | h-4 w-4 (16px) |

---

## Best Practices

### 1. Always Start Mobile-First

```tsx
// ✅ Good - Mobile first
className="text-sm sm:text-base md:text-lg"

// ❌ Bad - Desktop first (harder to maintain)
className="text-lg md:text-base sm:text-sm"
```

### 2. Ensure Touch Targets

Minimum 44px height for interactive elements on mobile:

```tsx
// ✅ Good - 44px minimum touch target
className="h-11 sm:h-14"

// ❌ Bad - Too small for mobile
className="h-8 sm:h-10"
```

### 3. Scale Proportionally

Keep font weight heavier on mobile for readability:

```tsx
// ✅ Good - Heavier on mobile
className="font-black sm:font-extrabold"

// ❌ Bad - Same weight on all screens
className="font-extrabold"
```

### 4. Add Horizontal Padding on Mobile

Prevent text from touching screen edges:

```tsx
// ✅ Good - Padding on mobile, removed on larger screens
className="px-2 sm:px-0 max-w-2xl mx-auto"

// ❌ Bad - Text might touch edges
className="max-w-2xl mx-auto"
```

### 5. Reduce Spacing on Mobile

Use tighter spacing on mobile to fit more content:

```tsx
// ✅ Good - Progressive spacing increase
className="space-y-4 sm:space-y-6 md:space-y-8"

// ❌ Bad - Too much space on mobile
className="space-y-8"
```

### 6. Adjust Line Heights

Use appropriate line heights for readability:

```tsx
// ✅ Good - Tight for headings, relaxed for body
<h1 className="leading-tight">Heading</h1>
<p className="leading-relaxed">Body text</p>

// ❌ Bad - Default line height for everything
<h1>Heading</h1>
<p>Body text</p>
```

---

## Testing Checklist

When implementing responsive components, test at these breakpoints:

- [ ] **375px** - iPhone SE (small mobile)
- [ ] **390px** - iPhone 12/13/14 Pro (standard mobile)
- [ ] **428px** - iPhone 14 Pro Max (large mobile)
- [ ] **768px** - iPad Mini (small tablet)
- [ ] **1024px** - iPad Pro (large tablet)
- [ ] **1280px** - Laptop
- [ ] **1920px** - Desktop

### Visual Testing

- [ ] Text is readable at all sizes
- [ ] Buttons are easily tappable (min 44px)
- [ ] Content doesn't touch screen edges
- [ ] Spacing feels balanced at each breakpoint
- [ ] Images scale appropriately
- [ ] No horizontal overflow

---

## Migration Guide

### Converting Existing Components

1. **Identify current desktop styles**
2. **Determine appropriate mobile size** (usually 1-2 sizes smaller)
3. **Add responsive classes** following patterns above
4. **Test on multiple devices**

Example conversion:

```tsx
// Before (desktop-only)
<h1 className="text-7xl font-extrabold">
  Heading
</h1>

// After (mobile-first)
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black sm:font-extrabold leading-tight">
  Heading
</h1>
```

---

## Related Documentation

- [Color Palette](./COLOR_PALETTE.md) - Color system and usage
- [Neumorphic Design System](./NEUMORPHIC_DESIGN_SYSTEM.md) - Shadow and depth effects
- [Hero Section Checklist](./HERO_SECTION_CHECKLIST.md) - Implementation guidelines

---

## Questions?

When in doubt:
1. Start with mobile styles (smallest screen)
2. Add breakpoints as needed (sm:, md:, lg:, xl:)
3. Test on real devices
4. Prioritize readability and accessibility

Last Updated: October 31, 2025
