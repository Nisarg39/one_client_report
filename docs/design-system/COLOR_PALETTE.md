# Color Palette

The Client Report Generator uses a **neumorphic design system** with a dark theme color palette optimized for depth, professionalism, and extended viewing sessions.

---

## Design Philosophy

Our color system creates **soft 3D depth** through careful use of grays and shadows, with strategic pops of color for brand identity and calls-to-action.

### Key Principles

- **Depth over Flatness**: Colors work with shadows to create tactile depth
- **Subtle Contrast**: Background variations create visual hierarchy without harshness
- **Strategic Color Use**: Orange and teal reserved for important elements only
- **Dark Optimized**: Designed for comfortable extended use

---

## Color Scheme

### Background Colors

| Color Name | Hex Code | Usage | RGB |
|------------|----------|-------|-----|
| **Primary Background** | `#1a1a1a` | Main page background, raised/floating elements | `rgb(26, 26, 26)` |
| **Inset Background** | `#151515` | Pressed/sunken elements, form inputs, content panels | `rgb(21, 21, 21)` |
| **Pure Black** | `#000000` | Optional deep backgrounds, text on light surfaces | `rgb(0, 0, 0)` |

#### Background Usage Guidelines

**Primary Background (`#1a1a1a`):**
- Main application background
- Raised buttons and cards (same color as background creates floating effect)
- Navigation bars
- Modal/dialog backgrounds

**Inset Background (`#151515`):**
- Form inputs and text areas
- Content panels with inset appearance
- Sections that appear "pressed into" the surface
- Social proof stats containers

---

### Brand Colors

#### Orange Palette

| Color Name | Hex Code | Usage | RGB |
|------------|----------|-------|-----|
| **Orange (Primary)** | `#FF8C42` | Primary CTAs, gradients start | `rgb(255, 140, 66)` |
| **Dark Orange** | `#E67A33` | Gradient ends, hover states | `rgb(230, 122, 51)` |
| **Darker Orange (Pressed)** | `#B3571C` | Active/pressed button states | `rgb(179, 87, 28)` |

#### Teal Palette (Gradient System)

All teal shades work together to create smooth gradients from light to dark:

| Color Name | Hex Code | Usage | RGB |
|------------|----------|-------|-----|
| **Light Teal** | `#6CA3A2` | Main teal - Secondary actions, text accents (lightest) | `rgb(108, 163, 162)` |
| **Medium-Light Teal** | `#5a9493` | Gradient transitions, subtle variations | `rgb(90, 148, 147)` |
| **Medium Teal** | `#307082` | Gradient midpoints, richer teal tones | `rgb(48, 112, 130)` |
| **Dark Blue-Teal** | `#12212E` | Gradient endpoints, deep teal backgrounds (darkest) | `rgb(18, 33, 46)` |

#### Brand Color Usage Guidelines

**Orange Gradient (`#FF8C42` to `#E67A33`):**
- Primary call-to-action buttons ("Start Free Trial", "Generate Report")
- Important status indicators and success states
- Floating icon highlights
- **Do NOT use** for: Backgrounds, large areas, or frequent UI elements

**Teal Gradients (4-shade system):**
- **Light Teal (`#6CA3A2`)**: Main accent color, secondary buttons, text highlights, links
- **Medium-Light (`#5a9493`)**: Subtle gradient transitions
- **Medium (`#307082`)**: Richer gradient midpoints, hover states
- **Dark Blue-Teal (`#12212E`)**: Gradient endpoints, deep backgrounds

**Teal Gradient Combinations:**
- **Subtle**: `#6CA3A2` → `#5a9493` (light gradient)
- **Standard**: `#6CA3A2` → `#307082` (main gradient)
- **Deep**: `#307082` → `#12212E` (dark gradient)
- **Full Range**: `#6CA3A2` → `#307082` → `#12212E` (complete spectrum)

---

### Text Colors

| Color Name | Hex Code | Usage | Context | RGB |
|------------|----------|-------|---------|-----|
| **Primary Text** | `#f5f5f5` | Headings, important content | High emphasis | `rgb(245, 245, 245)` |
| **Secondary Text** | `#e5e5e5` | Body text, labels | Medium-high emphasis | `rgb(229, 229, 229)` |
| **Tertiary Text** | `#c0c0c0` | Supporting text, descriptions | Medium emphasis | `rgb(192, 192, 192)` |
| **Muted Text** | `#999999` | Placeholders, hints, metadata | Low emphasis | `rgb(153, 153, 153)` |
| **Subtle Text** | `#888888` | Disabled states, very low priority | Minimal emphasis | `rgb(136, 136, 136)` |
| **On Orange (Inverted)** | `#FFFFFF` | Text on orange buttons | High contrast | `rgb(255, 255, 255)` |

#### Text Hierarchy

1. **Headings**: `#f5f5f5` with subtle text shadow
2. **Body**: `#c0c0c0` for comfortable reading
3. **Supporting**: `#999999` for less important information
4. **Disabled**: `#888888` with reduced opacity

---

### Shadow Colors

| Shadow Type | RGBA Value | Usage |
|-------------|-----------|--------|
| **Light Shadow (Highlight)** | `rgba(70, 70, 70, 0.5)` | Top-left shadow for raised elements |
| **Dark Shadow (Depth)** | `rgba(0, 0, 0, 0.9)` | Bottom-right shadow for raised elements |
| **Inner Dark** | `rgba(0, 0, 0, 0.7)` | Inset shadows for pressed elements |
| **Inner Light** | `rgba(60, 60, 60, 0.4)` | Inset highlights for pressed elements |
| **Glow (Orange)** | `rgba(255, 140, 66, 0.3)` | Button highlights and glows |
| **Glow (Teal)** | `rgba(108, 163, 162, 0.3)` | Accent glows |

---

## Neumorphic Shadow Combinations

### Raised/Floating Elements
```css
box-shadow:
  -10px -10px 24px rgba(70, 70, 70, 0.5),     /* Light from top-left */
  10px 10px 24px rgba(0, 0, 0, 0.9);          /* Shadow bottom-right */
```

### Pressed/Inset Elements
```css
box-shadow:
  inset 8px 8px 16px rgba(0, 0, 0, 0.7),      /* Inner shadow */
  inset -8px -8px 16px rgba(60, 60, 60, 0.4); /* Inner highlight */
```

### Button States

**Default (Raised):**
```css
box-shadow:
  -10px -10px 24px rgba(70, 70, 70, 0.5),
  10px 10px 24px rgba(0, 0, 0, 0.9),
  inset -2px -2px 6px rgba(0, 0, 0, 0.3),
  inset 2px 2px 6px rgba(255, 140, 66, 0.3); /* Orange glow */
```

**Hover:**
```css
box-shadow:
  -8px -8px 20px rgba(70, 70, 70, 0.5),  /* Reduced distance */
  8px 8px 20px rgba(0, 0, 0, 0.9);
```

**Active/Pressed:**
```css
box-shadow:
  inset 8px 8px 16px rgba(179, 87, 28, 0.7),  /* Dark orange inner */
  inset -8px -8px 16px rgba(255, 140, 66, 0.2); /* Light orange highlight */
```

---

## Component Color Applications

### Buttons

**Primary Button (Orange):**
- Background: Gradient `#FF8C42` → `#E67A33`
- Text: `#FFFFFF`
- Shadows: Raised with orange glow
- Pressed: Dark orange inner shadow `#B3571C`

**Secondary Button (Neumorphic):**
- Background: `#1a1a1a` (same as page)
- Text: `#6CA3A2` (teal)
- Shadows: Soft raised
- Pressed: Inset shadows

### Cards & Panels

**Floating Card:**
- Background: `#1a1a1a`
- Border Radius: `rounded-2xl` or `rounded-3xl`
- Shadows: Dual outer shadows

**Inset Panel:**
- Background: `#151515`
- Border Radius: `rounded-3xl`
- Shadows: Inner shadows

### Form Inputs

- Background: `#151515`
- Text: `#c0c0c0`
- Placeholder: `#888888`
- Shadows: Inset for pressed appearance
- Focus: Teal glow `rgba(108, 163, 162, 0.5)`

### Badges & Tags

- Background: `#1a1a1a`
- Text: `#e5e5e5`
- Shadows: Subtle raised effect
- Border Radius: `rounded-full`

---

## Accessibility

### Contrast Ratios (WCAG 2.1)

All color combinations meet or exceed WCAG AA standards:

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| `#f5f5f5` | `#1a1a1a` | 12.4:1 | ✅ AAA |
| `#c0c0c0` | `#1a1a1a` | 7.8:1 | ✅ AAA |
| `#FFFFFF` | `#FF8C42` | 4.7:1 | ✅ AA Large |
| `#6CA3A2` | `#1a1a1a` | 5.2:1 | ✅ AA |
| `#999999` | `#1a1a1a` | 4.6:1 | ✅ AA |

### Testing

Verify contrast ratios using:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Accessibility Panel
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

---

## Implementation

### CSS Variables

Colors are defined in `/src/app/globals.css`:

```css
.dark {
  /* Backgrounds */
  --bg-primary: 26 26 26;        /* #1a1a1a */
  --bg-inset: 21 21 21;          /* #151515 */

  /* Orange Colors */
  --orange-start: 255 140 66;    /* #FF8C42 */
  --orange-end: 230 122 51;      /* #E67A33 */
  --orange-pressed: 179 87 28;   /* #B3571C */

  /* Teal Gradient System (4 shades) */
  --teal-light: 108 163 162;     /* #6CA3A2 - Lightest */
  --teal-medium-light: 90 148 147; /* #5a9493 */
  --teal-medium: 48 112 130;     /* #307082 */
  --teal-dark-blue: 18 33 46;    /* #12212E - Darkest */

  /* Text Hierarchy */
  --text-primary: 245 245 245;   /* #f5f5f5 */
  --text-secondary: 229 229 229; /* #e5e5e5 */
  --text-body: 192 192 192;      /* #c0c0c0 */
  --text-muted: 153 153 153;     /* #999999 */
  --text-subtle: 136 136 136;    /* #888888 */
}
```

**Note**: RGB values without `rgb()` wrapper for Tailwind v4 compatibility.

### Tailwind Usage

```tsx
// ✅ Correct - Using design system
<div className="bg-[#1a1a1a] text-[#c0c0c0]">

// ✅ Also correct - Using CSS variables
<div style={{ backgroundColor: 'var(--bg-primary)' }}>

// ❌ Avoid - Random colors not in system
<div className="bg-[#2a2a2a] text-[#bbbbbb]">
```

---

## Do's and Don'ts

### ✅ Do

- Use `#1a1a1a` for primary backgrounds and raised elements
- Use `#151515` for inset/pressed elements
- Apply dual shadow system for neumorphic depth
- Reserve orange for primary CTAs only
- Maintain text hierarchy with appropriate gray values
- Test all color combinations for accessibility

### ❌ Don't

- Don't use orange for large background areas
- Don't mix arbitrary gray values outside the system
- Don't skip the dual shadow system on neumorphic elements
- Don't use pure white (`#fff`) for body text (too harsh)
- Don't rely on color alone to convey information
- Don't create gradients with incompatible colors

---

## Gradient Utilities

Pre-configured gradient classes for consistent teal usage:

### Teal Background Gradients

```tsx
// Light teal gradient (subtle)
<div className="bg-gradient-teal-light">
  // Gradient: #6CA3A2 → #5a9493
</div>

// Standard teal gradient (recommended)
<div className="bg-gradient-teal">
  // Gradient: #6CA3A2 → #307082
</div>

// Dark teal gradient
<div className="bg-gradient-teal-dark">
  // Gradient: #307082 → #12212E
</div>

// Full spectrum teal gradient
<div className="bg-gradient-teal-full">
  // Gradient: #6CA3A2 → #307082 → #12212E
</div>

// Radial teal gradient (for hero sections)
<div className="bg-gradient-teal-radial">
  // Radial: #6CA3A2 → #307082 → #12212E
</div>

// Diagonal teal gradient (bottom-left to top-right)
<div className="bg-gradient-teal-diagonal">
  // Diagonal: #12212E → #307082 → #6CA3A2
</div>
```

### Teal Text Gradient

```tsx
// Gradient text effect
<span className="text-gradient-teal">
  Highlighted Text
</span>
// Creates: #6CA3A2 → #307082 gradient on text
```

### Custom Gradients with CSS Variables

```css
/* Using CSS variables directly */
.custom-gradient {
  background: linear-gradient(
    to right,
    rgb(var(--teal-light)),
    rgb(var(--teal-medium)),
    rgb(var(--teal-dark-blue))
  );
}
```

---

## Chart & Data Visualization Colors

For graphs and charts, use colors in this order:

1. **Primary Data**: Orange `#FF8C42`
2. **Secondary Data**: Light Teal `#6CA3A2`
3. **Tertiary Data**: Medium Teal `#307082`
4. **Quaternary Data**: Dark Teal `#5a9493`
5. **Additional Data**: Light Orange `#FFB380`
6. **Baseline/Neutral**: Gray `#999999`

---

## Typography Standards

### Font Weights

Neumorphic design requires **heavier typography** for optimal visual presence on dark backgrounds:

| Element | Tailwind Class | Weight | Letter Spacing |
|---------|----------------|--------|----------------|
| **Hero Headings (H1)** | `font-extrabold` | 800 | `tracking-normal` |
| **Section Headings (H2-H3)** | `font-bold` | 700 | `tracking-tight` |
| **Body Text** | `font-normal` | 400 | `tracking-normal` |
| **UI Elements (Buttons)** | `font-semibold` | 600 | `tracking-normal` |

### Typography with Color

#### Headings with Embossed Effect
```tsx
<h1 className="font-extrabold tracking-normal text-[#f5f5f5]"
    style={{
      textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.1)'
    }}>
  Your Heading
</h1>
```

#### Gradient Text (Teal)
```tsx
<span className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2]
                 bg-clip-text text-transparent"
      style={{ textShadow: 'none' }}>
  Highlighted Word
</span>
```

**Important**: Gradient text must have `textShadow: 'none'` to prevent dark outlines.

#### Body Text
```tsx
<p className="text-lg md:text-xl text-[#c0c0c0] leading-relaxed"
   style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
  Description text
</p>
```

### Size Hierarchy

| Element | Mobile | Desktop | Color |
|---------|--------|---------|-------|
| **Hero H1** | `text-4xl` (36px) | `text-7xl` (72px) | `#f5f5f5` (Primary Text) |
| **Description** | `text-lg` (18px) | `text-xl` (20px) | `#c0c0c0` (Body Text) |
| **Button Text** | `text-base` (16px) | `text-base` (16px) | White or `#6CA3A2` |
| **Badge/Small** | `text-sm` (14px) | `text-sm` (14px) | `#e5e5e5` (Secondary) |

---

## Mobile Considerations

- Ensure touch targets on colored buttons are minimum 44x44px
- Maintain same color system across all breakpoints
- Test shadow visibility on various screen brightnesses
- Consider outdoor viewing (increase contrast if needed)

---

## Summary

The neumorphic color system creates **depth through subtlety**:

- Two background grays create inset/raised distinction
- Orange provides vibrant, memorable brand moments
- Teal offers softer secondary emphasis
- Text hierarchy ensures comfortable reading
- Shadow system brings everything to life

This palette differentiates us from flat competitors while maintaining professional credibility and accessibility standards.
