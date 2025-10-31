# Typography

## Overview

Typography plays a crucial role in creating a professional, readable interface. The Client Report Generator uses Geist fonts for a modern, clean appearance.

---

## Font Families

### Primary Font: Geist Sans
```css
font-family: var(--font-geist-sans);
```

**Usage**: All UI text, headings, body copy, buttons

**Characteristics**:
- Clean, modern sans-serif
- Excellent readability at all sizes
- Optimized for screens
- Wide character support

### Monospace Font: Geist Mono
```css
font-family: var(--font-geist-mono);
```

**Usage**: Code snippets, API keys, numeric data, tables

**Characteristics**:
- Fixed-width characters
- Clear distinction between similar characters (0 vs O, 1 vs l)
- Professional coding aesthetic

---

## Type Scale

### Headings

#### H1 - Page Title
```tsx
<h1 className="text-5xl md:text-7xl font-bold tracking-tight">
  Beautiful Reports in 5 Minutes
</h1>
```
- **Mobile**: 48px (3rem / text-5xl)
- **Desktop**: 72px (4.5rem / text-7xl)
- **Weight**: Bold (700)
- **Line Height**: Tight (1.25)
- **Usage**: Hero headings, main page titles

#### H2 - Section Title
```tsx
<h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
  Section Title
</h2>
```
- **Mobile**: 30px (1.875rem / text-3xl)
- **Desktop**: 36px (2.25rem / text-4xl)
- **Weight**: Semibold (600)
- **Line Height**: Tight (1.25)
- **Usage**: Major section headings

#### H3 - Subsection Title
```tsx
<h3 className="text-2xl font-semibold">
  Subsection Title
</h3>
```
- **Size**: 24px (1.5rem / text-2xl)
- **Weight**: Semibold (600)
- **Line Height**: Normal (1.5)
- **Usage**: Card titles, subsections

#### H4 - Component Title
```tsx
<h4 className="text-xl font-medium">
  Component Title
</h4>
```
- **Size**: 20px (1.25rem / text-xl)
- **Weight**: Medium (500)
- **Line Height**: Normal (1.5)
- **Usage**: Component headings, dialog titles

#### H5 - Small Heading
```tsx
<h5 className="text-lg font-medium">
  Small Heading
</h5>
```
- **Size**: 18px (1.125rem / text-lg)
- **Weight**: Medium (500)
- **Line Height**: Normal (1.5)
- **Usage**: Small section titles

---

### Body Text

#### Large Body
```tsx
<p className="text-xl">
  Large body text for emphasis
</p>
```
- **Size**: 20px (1.25rem / text-xl)
- **Weight**: Regular (400)
- **Line Height**: Relaxed (1.75)
- **Usage**: Hero descriptions, important copy

#### Regular Body
```tsx
<p className="text-base">
  Regular body text
</p>
```
- **Size**: 16px (1rem / text-base)
- **Weight**: Regular (400)
- **Line Height**: Normal (1.5)
- **Usage**: Most body copy, descriptions

#### Small Body
```tsx
<p className="text-sm">
  Small body text
</p>
```
- **Size**: 14px (0.875rem / text-sm)
- **Weight**: Regular (400)
- **Line Height**: Normal (1.5)
- **Usage**: Secondary information, captions, form help text

#### Extra Small / Caption
```tsx
<p className="text-xs">
  Caption or meta information
</p>
```
- **Size**: 12px (0.75rem / text-xs)
- **Weight**: Regular (400)
- **Line Height**: Normal (1.5)
- **Usage**: Timestamps, metadata, fine print

---

## Font Weights

```tsx
// Light (300) - Rarely used
className="font-light"

// Regular (400) - Body text
className="font-normal"

// Medium (500) - Emphasis, labels
className="font-medium"

// Semibold (600) - Headings, buttons
className="font-semibold"

// Bold (700) - Strong emphasis, main headings
className="font-bold"
```

**Guidelines**:
- Use **Regular (400)** for most body text
- Use **Medium (500)** for labels and subtle emphasis
- Use **Semibold (600)** for headings and important UI elements
- Use **Bold (700)** for main page titles and strong emphasis
- Avoid **Light (300)** on dark backgrounds (poor contrast)

---

## Line Height

```tsx
// Tight (1.25) - Large headings
className="leading-tight"

// Snug (1.375) - Medium headings
className="leading-snug"

// Normal (1.5) - Body text
className="leading-normal"

// Relaxed (1.75) - Large body text
className="leading-relaxed"

// Loose (2) - Decorative text
className="leading-loose"
```

**Guidelines**:
- Use **tight** for large headings (saves space)
- Use **normal** for most body text (readable)
- Use **relaxed** for large paragraphs (improves readability)

---

## Letter Spacing (Tracking)

```tsx
// Tight (-0.025em) - Large headings
className="tracking-tight"

// Normal (0) - Body text
className="tracking-normal"

// Wide (0.025em) - Labels, buttons
className="tracking-wide"
```

**Guidelines**:
- Use **tight** for large headings (optical balance)
- Use **normal** for body text
- Use **wide** for all-caps text, buttons, labels

---

## Text Colors

### Primary Text
```tsx
className="text-foreground"  // White on dark background
```

### Secondary/Muted Text
```tsx
className="text-muted-foreground"  // Light teal
```

### Accent Text
```tsx
className="text-accent"  // Light teal for highlights
```

### Primary Brand Text
```tsx
className="text-primary"  // Orange - use sparingly
```

---

## Common Patterns

### Hero Heading
```tsx
<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
  Beautiful Reports in{" "}
  <span className="bg-gradient-to-r from-[#307082] to-[#6CA3A2] bg-clip-text text-transparent">
    5 Minutes
  </span>
</h1>
```

### Hero Subheading
```tsx
<p className="text-xl text-muted-foreground max-w-2xl">
  Simple, affordable marketing reports for freelancers and small agencies.
</p>
```

### Card Title
```tsx
<CardTitle className="text-2xl font-semibold">
  90% Time Savings
</CardTitle>
```

### Card Description
```tsx
<CardDescription className="text-sm text-muted-foreground">
  From 6-10 hours to 30 minutes per month
</CardDescription>
```

### Button Text
```tsx
<Button className="text-lg font-semibold">
  Get Started Free
</Button>
```

### Form Label
```tsx
<Label className="text-sm font-medium">
  Email Address
</Label>
```

### Help Text
```tsx
<p className="text-xs text-muted-foreground">
  We'll never share your email with anyone else.
</p>
```

### Monospace (Code/Data)
```tsx
<code className="font-mono text-sm bg-card px-2 py-1 rounded">
  API_KEY_12345
</code>
```

---

## Responsive Typography

Use responsive text sizes for important headings:

```tsx
// Mobile: text-3xl, Desktop: text-5xl
<h2 className="text-3xl md:text-5xl font-bold">
  Responsive Heading
</h2>

// Mobile: text-base, Desktop: text-lg
<p className="text-base md:text-lg">
  Responsive body text
</p>
```

**Breakpoints**:
- `md:` (768px and up) - Tablet and desktop

---

## Accessibility

### Readable Font Sizes
- Minimum body text: **16px** (1rem)
- Minimum interactive text: **14px** (0.875rem)
- Optimal line length: **45-75 characters**

### Contrast
- Maintain 4.5:1 contrast ratio for body text (WCAG AA)
- Maintain 3:1 contrast ratio for large text (18px+)

### Line Height
- Body text: minimum **1.5** (WCAG guideline)
- Headings: minimum **1.25**

---

## Do's and Don'ts

### ✅ Do

- Use Geist Sans for all UI text
- Maintain consistent type scale
- Use appropriate font weights for hierarchy
- Ensure sufficient contrast
- Use responsive text sizes for headings
- Limit line length for readability (max 75ch)
- Use monospace font for code/data

### ❌ Don't

- Don't mix multiple font families
- Don't use font sizes outside the type scale
- Don't use light weights on dark backgrounds
- Don't center-align long paragraphs
- Don't use all-caps for long text
- Don't use font sizes smaller than 12px

---

## Typography Checklist

Before shipping a new design:

- [ ] Font size from type scale
- [ ] Appropriate font weight
- [ ] Sufficient contrast (4.5:1 minimum)
- [ ] Proper line height (1.5+ for body)
- [ ] Responsive on mobile
- [ ] Semantic HTML (h1-h6, p, etc.)
- [ ] Accessible to screen readers

---

## Implementation

Fonts are loaded in `/src/app/layout.tsx`:

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

Applied globally via CSS variables:
```css
body {
  font-family: var(--font-geist-sans);
}
```
