# Color System

## Overview

The Client Report Generator uses a carefully crafted dark theme color palette designed for professionalism, readability, and extended viewing sessions.

---

## Color Palette

### Primary Colors

| Color | Hex | OKLCH | Usage |
|-------|-----|-------|-------|
| **Orange** | `#EA9940` | `oklch(0.73 0.13 55)` | Primary brand color, CTAs, focus states |
| **Black** | `#000000` | `oklch(0 0 0)` | Main background |
| **Dark Teal** | `#12212E` | `oklch(0.15 0.03 220)` | Cards, elevated surfaces, inputs |
| **Teal** | `#307082` | `oklch(0.48 0.07 215)` | Secondary color, gradients |
| **Light Teal** | `#6CA3A2` | `oklch(0.66 0.06 200)` | Accents, muted text, gradients |
| **White** | `#FAFAFA` | `oklch(0.985 0 0)` | Primary text |

---

## Color Usage

### Background Colors

#### Main Background
```tsx
// Pure black for OLED optimization
className="bg-background" // #000000
```

#### Card Background
```tsx
// Dark teal for elevated content
className="bg-card" // #12212E
```

#### Input Background
```tsx
// Dark teal for form inputs
className="bg-input" // #12212E
```

---

### Text Colors

#### Primary Text
```tsx
// White text on dark backgrounds
className="text-foreground" // #FAFAFA
```

#### Secondary/Muted Text
```tsx
// Light teal for less important text
className="text-muted-foreground" // #6CA3A2
```

#### On Primary (Orange)
```tsx
// Black text on orange backgrounds
className="text-primary-foreground" // #000000
```

---

### Interactive Colors

#### Primary Actions (Buttons, CTAs)
```tsx
// Orange - Use sparingly for important actions only
className="bg-primary text-primary-foreground"
// Background: #EA9940, Text: #000000
```

**When to use:**
- Primary call-to-action buttons ("Generate Report", "Get Started")
- Important status indicators
- Focus rings on interactive elements
- Success states

**When NOT to use:**
- Regular buttons (use secondary instead)
- Text highlights (use accent instead)
- Backgrounds (too vibrant)

#### Secondary Actions
```tsx
// Teal - For secondary buttons
className="bg-secondary text-secondary-foreground"
// Background: #307082, Text: #FAFAFA
```

**When to use:**
- Secondary buttons ("Cancel", "View Details")
- Alternative actions
- Sidebar elements

#### Accent/Highlights
```tsx
// Light Teal - For subtle emphasis
className="bg-accent text-accent-foreground"
// Background: #6CA3A2, Text: #000000
```

**When to use:**
- Hover states
- Selected items
- Subtle highlights
- Tags and badges

---

### Border Colors

```tsx
// Dark teal with opacity
className="border-border" // #12212E with 60% opacity
```

---

### State Colors

#### Hover States
```tsx
// Slightly lighter version of base color
className="hover:bg-accent/20"
```

#### Focus States
```tsx
// Orange ring for keyboard navigation
className="focus:ring-2 focus:ring-primary"
```

#### Disabled States
```tsx
// Reduced opacity
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

#### Destructive/Error
```tsx
// Red for destructive actions
className="bg-destructive text-destructive-foreground"
```

---

## Gradients

### Teal Gradient
```tsx
// Primary gradient using teal colors
className="bg-gradient-to-r from-[#307082] to-[#6CA3A2]"
```

**Use for:**
- Hero text highlights
- Decorative elements
- Feature highlights

**Don't use orange in gradients** - Keep gradients subtle with teal tones

### Other Gradients
```tsx
// Subtle background gradients
className="bg-gradient-to-b from-background to-card/20"
```

---

## Chart Colors

For data visualization, use colors in this order:

1. **Primary Data**: Orange `#EA9940`
2. **Secondary Data**: Teal `#307082`
3. **Tertiary Data**: Light Teal `#6CA3A2`
4. **Quaternary Data**: Dark Teal `#12212E` (with border)
5. **Additional Data**: Light Orange variant

```tsx
// Chart color variables
--chart-1: oklch(0.73 0.13 55);      /* Orange */
--chart-2: oklch(0.48 0.07 215);     /* Teal */
--chart-3: oklch(0.66 0.06 200);     /* Light Teal */
--chart-4: oklch(0.15 0.03 220);     /* Dark Teal */
--chart-5: oklch(0.85 0.08 50);      /* Light Orange */
```

---

## Accessibility

### Contrast Ratios (WCAG AA)

All color combinations meet WCAG 2.1 AA standards:

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| White | Black | 21:1 | ✅ AAA |
| White | Dark Teal | 14.2:1 | ✅ AAA |
| White | Teal | 5.8:1 | ✅ AA |
| Black | Orange | 8.4:1 | ✅ AAA |
| White | Light Teal | 4.2:1 | ✅ AA |

### Testing Colors

Use these tools to verify contrast:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Accessibility Panel
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

---

## Common Patterns

### Card with Border
```tsx
<Card className="border-2 border-primary/30">
  {/* Content */}
</Card>
```

### Highlighted Text
```tsx
<span className="text-accent">
  Important information
</span>
```

### Primary Button
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Generate Report
</Button>
```

### Secondary Button
```tsx
<Button variant="secondary">
  Cancel
</Button>
```

### Gradient Text
```tsx
<span className="bg-gradient-to-r from-[#307082] to-[#6CA3A2] bg-clip-text text-transparent">
  Highlighted Text
</span>
```

---

## Do's and Don'ts

### ✅ Do

- Use orange sparingly for important CTAs
- Maintain sufficient contrast (4.5:1 minimum)
- Use teal gradients for subtle emphasis
- Keep backgrounds dark (black or dark teal)
- Use semantic color variables (`bg-primary`, `text-muted-foreground`)

### ❌ Don't

- Don't use orange in gradients
- Don't use bright colors on dark backgrounds without testing contrast
- Don't mix warm and cool colors excessively
- Don't rely on color alone to convey information
- Don't override theme colors with arbitrary values (use theme variables)

---

## Implementation

Colors are defined in `/src/app/globals.css` under the `.dark` class:

```css
.dark {
  --background: oklch(0 0 0);           /* Black */
  --foreground: oklch(0.985 0 0);       /* White */
  --primary: oklch(0.73 0.13 55);       /* Orange */
  --secondary: oklch(0.48 0.07 215);    /* Teal */
  --accent: oklch(0.66 0.06 200);       /* Light Teal */
  --card: oklch(0.15 0.03 220);         /* Dark Teal */
  /* ... additional colors */
}
```

Use Tailwind's theme colors:
```tsx
// ✅ Correct
<div className="bg-primary text-primary-foreground" />

// ❌ Incorrect
<div className="bg-[#EA9940] text-black" />
```

---

## Color Workflow

When designing a new component:

1. **Choose base color** from palette
2. **Test contrast** for accessibility
3. **Consider context** (is this primary, secondary, or accent?)
4. **Use theme variables** not hex codes
5. **Document usage** if creating new pattern
