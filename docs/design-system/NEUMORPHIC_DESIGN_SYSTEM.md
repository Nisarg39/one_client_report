# Neumorphic Design System

## Complete Implementation Guide

This document provides the complete specification for implementing the neumorphic design system across the Client Report Generator application.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Shadow System](#shadow-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Component Library](#component-library)
7. [Interactive States](#interactive-states)
8. [Implementation](#implementation)

> **📱 Important**: For responsive typography and spacing guidelines, see [Mobile-First Design System](./MOBILE_FIRST_DESIGN_SYSTEM.md). This document covers neumorphic shadows, colors, and effects. Always combine these neumorphic styles with mobile-first responsive patterns.

---

## Design Philosophy

### What is Neumorphism?

Neumorphism (or "new skeuomorphism") is a design trend that creates **soft, extruded plastic-looking UI** elements through strategic use of shadows and highlights. Unlike flat design, neumorphic elements appear to emerge from or sink into the background.

### Our Approach

We use a **soft neumorphic style** optimized for:
- **Professional contexts** (not playful or toy-like)
- **Dark theme** (easier on eyes for extended use)
- **Accessibility** (maintaining WCAG AA contrast)
- **Performance** (CSS-based, no heavy graphics)

### Key Characteristics

- **Soft 3D depth** without hard edges
- **Tactile feedback** on all interactions
- **Minimal color** (grays + strategic brand colors)
- **Large border radius** (16-24px) for organic shapes
- **Dual shadow system** creating realistic lighting

---

## Color System

### Background Layers

```
┌─────────────────────────────────────┐
│  Primary Background: #1a1a1a        │  ← Page background
│  ┌───────────────────────────────┐  │
│  │  Raised Element: #1a1a1a      │  │  ← Floats above (same color!)
│  │  (appears raised via shadows) │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Inset Element: #151515       │  │  ← Sunken below (darker)
│  │  (appears pressed in)         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Rule**: Inset = Darker, Raised = Same as background

### Complete Color Palette

```css
/* === Backgrounds === */
--bg-primary: #1a1a1a;        /* Main app background */
--bg-inset: #151515;           /* Pressed/sunken elements */

/* === Brand Colors === */
--orange-start: #FF8C42;       /* Gradient start */
--orange-end: #E67A33;         /* Gradient end */
--orange-pressed: #B3571C;     /* Active state inner shadow */
--teal-primary: #6CA3A2;       /* Secondary actions */
--teal-dark: #5a9493;          /* Teal variations */

/* === Text Hierarchy === */
--text-primary: #f5f5f5;       /* Headings */
--text-secondary: #e5e5e5;     /* Important body */
--text-body: #c0c0c0;          /* Regular body */
--text-muted: #999999;         /* Supporting text */
--text-subtle: #888888;        /* Disabled/minimal */

/* === Shadows (RGBA for layering) === */
--shadow-light: rgba(70, 70, 70, 0.5);   /* Top-left highlight */
--shadow-dark: rgba(0, 0, 0, 0.9);       /* Bottom-right depth */
--shadow-inner-dark: rgba(0, 0, 0, 0.7); /* Inset shadow */
--shadow-inner-light: rgba(60, 60, 60, 0.4); /* Inset highlight */
```

---

## Shadow System

### The Dual Shadow Pattern

Neumorphic depth comes from **two opposing shadows**:

```
Light Source (top-left)
         ↓
    ┌─────────┐
    │ Element │  ← Light shadow (-x, -y)
    │         │
    └─────────┘
         ↓
    Dark shadow (+x, +y)
```

### Standard Shadow Combinations

#### 1. Raised/Floating Elements

```css
box-shadow:
  -10px -10px 24px rgba(70, 70, 70, 0.5),  /* Light from top-left */
  10px 10px 24px rgba(0, 0, 0, 0.9);        /* Shadow to bottom-right */
```

**Use for**: Buttons, cards, badges, floating icons

#### 2. Pressed/Inset Elements

```css
box-shadow:
  inset 8px 8px 16px rgba(0, 0, 0, 0.7),      /* Inner shadow */
  inset -8px -8px 16px rgba(60, 60, 60, 0.4); /* Inner highlight */
```

**Use for**: Form inputs, content panels, pressed buttons

#### 3. Flat/Neutral Elements

```css
box-shadow:
  -6px -6px 16px rgba(70, 70, 70, 0.4),
  6px 6px 16px rgba(0, 0, 0, 0.8);
```

**Use for**: Less prominent UI elements, subtle cards

### Interactive Shadow States

#### Default → Hover → Active

```css
/* Default (Raised) */
.button {
  box-shadow:
    -10px -10px 24px rgba(70, 70, 70, 0.5),
    10px 10px 24px rgba(0, 0, 0, 0.9);
}

/* Hover (Lifts slightly) */
.button:hover {
  box-shadow:
    -8px -8px 20px rgba(70, 70, 70, 0.5),  /* Reduced distance */
    8px 8px 20px rgba(0, 0, 0, 0.9);
}

/* Active (Pressed in) */
.button:active {
  box-shadow:
    inset 8px 8px 16px rgba(0, 0, 0, 0.6),  /* Inverted! */
    inset -8px -8px 16px rgba(60, 60, 60, 0.4);
}
```

---

## Typography

### Font Stack

```css
font-family: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;
```

**Primary Font**: Geist Sans (modern, clean geometric sans-serif)

### Font Weights for Neumorphic Design

Neumorphic design benefits from **heavier typography** to create that tactile, pressed-in feel:

```css
/* Hero Headings (H1) */
font-weight: 800; /* font-extrabold */
letter-spacing: 0; /* tracking-normal */

/* Section Headings (H2, H3) */
font-weight: 700; /* font-bold */
letter-spacing: -0.025em; /* tracking-tight */

/* Body Text */
font-weight: 400; /* font-normal */

/* UI Elements (Buttons, Badges) */
font-weight: 600; /* font-semibold */
```

**Key Principle**: Heavier weights (800+) provide better visual presence on dark neumorphic backgrounds.

### Text Shadows for Depth

All text should have subtle shadows to create embossed appearance:

```css
/* Light text on dark background */
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

/* Hero Headings (dual shadow for embossed effect) */
text-shadow:
  0 2px 4px rgba(0, 0, 0, 0.9),       /* Dark shadow */
  0 1px 0 rgba(255, 255, 255, 0.1);  /* Subtle highlight */

/* Gradient Text (NO shadow) */
text-shadow: none; /* Shadows interfere with text gradients */
```

### Type Scale & Usage

```css
/* Hero Section */
--text-4xl: 2.25rem;     /* 36px - sm screens */
--text-5xl: 3rem;        /* 48px - md screens */
--text-6xl: 3.75rem;     /* 60px - lg screens */
--text-7xl: 4.5rem;      /* 72px - xl screens */

/* Body/Description */
--text-lg: 1.125rem;     /* 18px - base */
--text-xl: 1.25rem;      /* 20px - md screens */

/* UI Elements */
--text-xs: 0.75rem;      /* 12px - badges */
--text-sm: 0.875rem;     /* 14px - small text */
--text-base: 1rem;       /* 16px - buttons */
```

### Typography Hierarchy Examples

#### Hero Heading
```tsx
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl
               font-extrabold tracking-normal text-[#f5f5f5]">
```

#### Description Text
```tsx
<p className="text-lg md:text-xl text-[#c0c0c0] leading-relaxed">
```

#### Gradient Text (e.g., "Minutes")
```tsx
<span className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2]
                 bg-clip-text text-transparent"
      style={{ textShadow: 'none' }}>
  Minutes
</span>
```

---

## Spacing & Layout

### 4px Grid System

```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-12: 48px;
--spacing-16: 64px;
```

**Rule**: All margins, padding, and gaps must be multiples of 4px.

### Border Radius Scale

```css
--radius-sm: 12px;      /* Small elements */
--radius-md: 16px;      /* Medium elements (rounded-2xl) */
--radius-lg: 24px;      /* Large elements (rounded-3xl) */
--radius-xl: 32px;      /* Extra large */
--radius-full: 9999px;  /* Pills/badges */
```

**Default**: Use `rounded-3xl` (24px) for most components.

---

## Component Library

### Buttons

#### Primary Button (Orange CTA)

```tsx
<button className="
  relative overflow-hidden
  px-8 h-14 rounded-3xl
  font-semibold text-base
  bg-gradient-to-br from-[#FF8C42] to-[#E67A33]
  text-white
  shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)]
  hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)]
  active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)]
  transition-all duration-300
">
  Button Text
</button>
```

**Style**: `0 2px 4px rgba(0,0,0,0.3)`

#### Secondary Button (Neumorphic)

```tsx
<button className="
  px-8 h-14 rounded-3xl
  font-semibold text-base
  bg-[#1a1a1a] text-[#6CA3A2]
  shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9)]
  hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)]
  active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)]
  transition-all duration-300
">
  Button Text
</button>
```

**Text Shadow**: `0 1px 2px rgba(0,0,0,0.5)`

### Cards

#### Floating Card

```tsx
<div className="
  bg-[#1a1a1a] rounded-3xl p-6
  shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)]
">
  <!-- Content -->
</div>
```

#### Inset Panel

```tsx
<div className="
  bg-[#151515] rounded-3xl p-8
  shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(60,60,60,0.4)]
">
  <!-- Content -->
</div>
```

### Form Inputs

```tsx
<input className="
  w-full px-4 py-3 rounded-2xl
  bg-[#151515] text-[#c0c0c0]
  placeholder:text-[#888888]
  shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)]
  focus:outline-none
  focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3),0_0_0_2px_rgba(108,163,162,0.5)]
  transition-shadow duration-200
" />
```

### Badges

```tsx
<div className="
  inline-block px-6 py-3 rounded-full
  bg-[#1a1a1a] text-[#e5e5e5]
  text-sm font-medium
  shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8),inset_2px_2px_4px_rgba(0,0,0,0.2)]
">
  Badge Text
</div>
```

### Icons (Floating)

```tsx
<div className="
  bg-[#1a1a1a] rounded-2xl p-3
  shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8),inset_-1px_-1px_3px_rgba(0,0,0,0.2)]
">
  <Icon className="w-6 h-6" style={{ color: '#6CA3A2' }} />
</div>
```

---

## Interactive States

### State Matrix

| Element Type | Default | Hover | Active | Focus | Disabled |
|--------------|---------|-------|--------|-------|----------|
| **Primary Button** | Raised | Lift slightly | Press in | Ring glow | Opacity 50% |
| **Secondary Button** | Raised | Lift slightly | Press in | Ring glow | Opacity 50% |
| **Input** | Inset | — | — | Teal ring | Opacity 50% |
| **Card** | Raised | Lift (optional) | — | — | — |

### Transition Timing

```css
/* Standard interaction */
transition: all 300ms ease-in-out;

/* Quick feedback */
transition: all 200ms ease-in-out;

/* Slow, deliberate */
transition: all 400ms ease-in-out;
```

**Default**: Use 300ms for most interactions.

---

## Implementation

### Tailwind Configuration

Add to `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a1a1a',
        'bg-inset': '#151515',
        'orange': {
          start: '#FF8C42',
          DEFAULT: '#E67A33',
          pressed: '#B3571C',
        },
        'teal': {
          DEFAULT: '#6CA3A2',
          dark: '#5a9493',
        }
      },
      boxShadow: {
        'neu-raised': '-10px -10px 24px rgba(70,70,70,0.5), 10px 10px 24px rgba(0,0,0,0.9)',
        'neu-inset': 'inset 8px 8px 16px rgba(0,0,0,0.7), inset -8px -8px 16px rgba(60,60,60,0.4)',
        'neu-flat': '-6px -6px 16px rgba(70,70,70,0.4), 6px 6px 16px rgba(0,0,0,0.8)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    }
  }
}
```

### Global CSS

Add to `globals.css`:

```css
:root {
  /* Backgrounds */
  --bg-primary: #1a1a1a;
  --bg-inset: #151515;

  /* Brand */
  --orange-start: #FF8C42;
  --orange-end: #E67A33;
  --teal: #6CA3A2;

  /* Text */
  --text-primary: #f5f5f5;
  --text-body: #c0c0c0;
  --text-muted: #999999;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-body);
}
```

### Reusable Component Classes

Create utility classes for common patterns:

```css
/* Raised element */
.neu-raised {
  box-shadow: -10px -10px 24px rgba(70,70,70,0.5), 10px 10px 24px rgba(0,0,0,0.9);
}

/* Inset element */
.neu-inset {
  box-shadow: inset 8px 8px 16px rgba(0,0,0,0.7), inset -8px -8px 16px rgba(60,60,60,0.4);
}

/* Text depth */
.text-depth {
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
```

---

## Best Practices

### Do's ✅

- Always use dual shadow system for depth
- Maintain consistent border radius (prefer rounded-3xl)
- Test interactive states in browser
- Use CSS variables for colors
- Add smooth transitions to all state changes
- Reserve orange for primary CTAs only
- Ensure WCAG AA contrast for all text

### Don'ts ❌

- Don't use flat shadows (single shadow)
- Don't skip hover/active states
- Don't use arbitrary gray values
- Don't overuse orange color
- Don't create instant state changes (always transition)
- Don't use pure white (#fff) for body text
- Don't rely on shadows alone for accessibility

---

## Quick Reference

### Common Component Recipes

```tsx
// Primary CTA
className="px-8 h-14 rounded-3xl bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-neu-raised"

// Secondary Button
className="px-8 h-14 rounded-3xl bg-[#1a1a1a] text-[#6CA3A2] shadow-neu-raised"

// Form Input
className="px-4 py-3 rounded-2xl bg-[#151515] text-[#c0c0c0] shadow-neu-inset"

// Floating Card
className="p-6 rounded-3xl bg-[#1a1a1a] shadow-neu-flat"

// Badge
className="px-6 py-3 rounded-full bg-[#1a1a1a] text-[#e5e5e5] shadow-neu-flat"
```

---

## Testing Checklist

Before shipping a component:

- [ ] Shadows create clear depth perception
- [ ] Hover state is visually distinct
- [ ] Active/press state feels tactile
- [ ] Focus state is keyboard-accessible
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Transitions are smooth (300ms)
- [ ] Works on all breakpoints (mobile, tablet, desktop)
- [ ] Component matches design system colors exactly

---

**Version**: 1.0
**Last Updated**: October 31, 2025
**Maintained by**: Design Team
