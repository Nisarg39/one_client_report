# Spacing & Layout

## Overview

Consistent spacing creates visual harmony and improves readability. We use an 8-point grid system based on Tailwind's default spacing scale.

---

## Spacing Scale

### Base Unit: 4px (0.25rem)

All spacing values are multiples of 4px:

| Token | Pixels | Rem | Tailwind | Usage |
|-------|--------|-----|----------|--------|
| `0` | 0px | 0 | `0` | Reset |
| `1` | 4px | 0.25rem | `1` | Hairline spacing |
| `2` | 8px | 0.5rem | `2` | Tight spacing |
| `3` | 12px | 0.75rem | `3` | Small spacing |
| `4` | 16px | 1rem | `4` | Default spacing |
| `5` | 20px | 1.25rem | `5` | Medium spacing |
| `6` | 24px | 1.5rem | `6` | Large spacing |
| `8` | 32px | 2rem | `8` | Extra large |
| `10` | 40px | 2.5rem | `10` | XXL spacing |
| `12` | 48px | 3rem | `12` | Section spacing |
| `16` | 64px | 4rem | `16` | Large section |
| `20` | 80px | 5rem | `20` | Extra large section |
| `24` | 96px | 6rem | `24` | Hero spacing |

---

## Spacing Usage Guidelines

### Internal Component Spacing

#### Buttons
```tsx
// Padding: 12px vertical, 32px horizontal
<Button className="px-8 py-3">
  Button Text
</Button>

// Large button
<Button size="lg" className="px-8 py-4">
  Large Button
</Button>
```

#### Cards
```tsx
// Standard card padding: 24px
<Card className="p-6">
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

#### Inputs
```tsx
// Input padding: 8px vertical, 12px horizontal
<Input className="px-3 py-2" />
```

---

### Component Spacing (Gap Between Elements)

#### Tight Spacing (4-8px)
```tsx
// For closely related items
<div className="space-y-2"> {/* 8px */}
  <Label>Email</Label>
  <Input />
</div>
```

**Use for**:
- Label and input pairs
- Icon and text in buttons
- Related list items

#### Default Spacing (16px)
```tsx
// For standard component spacing
<div className="space-y-4"> {/* 16px */}
  <FormField />
  <FormField />
</div>
```

**Use for**:
- Form fields
- Card content items
- List items with descriptions

#### Medium Spacing (24px)
```tsx
// For distinct sections within a component
<div className="space-y-6"> {/* 24px */}
  <Section1 />
  <Section2 />
</div>
```

**Use for**:
- Sections within a card
- Feature blocks
- Content groups

#### Large Spacing (48px)
```tsx
// For major page sections
<div className="space-y-12"> {/* 48px */}
  <HeroSection />
  <FeaturesSection />
</div>
```

**Use for**:
- Page sections
- Major content blocks
- Hero to content transition

---

## Layout Patterns

### Container Widths

```tsx
// Full width
<div className="w-full">

// Max width with centering
<div className="max-w-7xl mx-auto px-4">

// Prose (optimal reading width)
<div className="max-w-2xl">
```

**Standard Max Widths**:
- `max-w-sm` - 384px - Narrow content
- `max-w-md` - 448px - Forms, dialogs
- `max-w-lg` - 512px - Single column content
- `max-w-xl` - 576px - Reading width
- `max-w-2xl` - 672px - Optimal prose width
- `max-w-4xl` - 896px - Wide content
- `max-w-5xl` - 1024px - Dashboard
- `max-w-7xl` - 1280px - Full page width

---

### Grid Layouts

#### Two Column Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>Column 1</Card>
  <Card>Column 2</Card>
</div>
```

#### Three Column Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card>Column 1</Card>
  <Card>Column 2</Card>
  <Card>Column 3</Card>
</div>
```

#### Responsive Grid (Auto-fit)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</div>
```

---

### Flex Layouts

#### Horizontal Stack
```tsx
// Items in a row with spacing
<div className="flex gap-4">
  <Button>First</Button>
  <Button>Second</Button>
</div>
```

#### Vertical Stack
```tsx
// Items in a column with spacing
<div className="flex flex-col gap-4">
  <Card>First</Card>
  <Card>Second</Card>
</div>
```

#### Space Between
```tsx
// Items pushed to edges
<div className="flex justify-between items-center">
  <h2>Title</h2>
  <Button>Action</Button>
</div>
```

#### Centered Content
```tsx
// Center both horizontally and vertically
<div className="flex items-center justify-center min-h-screen">
  <Card>Centered Content</Card>
</div>
```

---

## Page Layout Structure

### Standard Page Layout
```tsx
<div className="min-h-screen bg-background">
  {/* Navigation - if needed */}
  <nav className="border-b border-border">
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Nav content */}
    </div>
  </nav>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 py-16">
    {/* Hero Section */}
    <section className="space-y-6 mb-12">
      <h1>Page Title</h1>
      <p>Description</p>
    </section>

    {/* Content Sections */}
    <section className="space-y-12">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Content */}
      </div>
    </section>
  </main>

  {/* Footer - if needed */}
  <footer className="border-t border-border mt-20">
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Footer content */}
    </div>
  </footer>
</div>
```

---

## Responsive Spacing

### Mobile-First Approach
```tsx
// Start with mobile spacing, increase for larger screens
<div className="space-y-6 md:space-y-12">
  <Section />
  <Section />
</div>

// Responsive padding
<div className="px-4 md:px-8 lg:px-16">
  <Content />
</div>
```

### Breakpoint-Specific Spacing
```tsx
// Different spacing at different breakpoints
<div className="py-8 md:py-12 lg:py-16">
  <Content />
</div>
```

---

## Common Spacing Patterns

### Card Layout
```tsx
<Card className="p-6">
  <CardHeader className="space-y-2">
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent className="pt-6 space-y-4">
    {/* Content with 16px spacing */}
  </CardContent>
  <CardFooter className="pt-6">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Layout
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label>Field Label</Label>
    <Input />
    <p className="text-sm text-muted-foreground">Help text</p>
  </div>

  <div className="space-y-2">
    <Label>Another Field</Label>
    <Input />
  </div>

  <Button className="w-full">Submit</Button>
</form>
```

### Hero Section
```tsx
<section className="py-16 md:py-24">
  <div className="max-w-3xl mx-auto text-center space-y-6">
    <Badge>Label</Badge>
    <h1>Hero Title</h1>
    <p className="text-xl">Description</p>
    <div className="flex gap-4 justify-center">
      <Button>Primary CTA</Button>
      <Button variant="outline">Secondary CTA</Button>
    </div>
  </div>
</section>
```

### Feature Grid
```tsx
<section className="py-16">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-12 space-y-4">
      <h2>Features</h2>
      <p>Description</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <Card>Feature 1</Card>
      <Card>Feature 2</Card>
      <Card>Feature 3</Card>
    </div>
  </div>
</section>
```

---

## White Space Principles

### Use White Space to:
1. **Create Hierarchy** - More space around important elements
2. **Group Content** - Less space between related items
3. **Improve Readability** - Generous line height and paragraph spacing
4. **Guide Attention** - Space draws the eye

### White Space Guidelines:
- **Don't be afraid of white space** - Crowded layouts feel unprofessional
- **Increase spacing between major sections** - At least 48px-96px
- **Decrease spacing within components** - 8px-24px for related items
- **Use consistent spacing** - Stick to the scale

---

## Border Radius

Consistent border radius creates visual cohesion:

```tsx
// Small - Inputs, badges
className="rounded-md"      // 6px

// Default - Buttons, cards
className="rounded-lg"      // 10px (var(--radius))

// Large - Modals, prominent cards
className="rounded-xl"      // 16px

// Full - Avatars, pills
className="rounded-full"    // 999px
```

**Configured radius**: `--radius: 0.625rem` (10px)

---

## Z-Index Layers

Maintain consistent z-index for layering:

| Layer | z-index | Usage |
|-------|---------|-------|
| Base | 0 | Default layer |
| Dropdown | 10 | Dropdown menus |
| Sticky | 20 | Sticky headers |
| Fixed | 30 | Fixed elements |
| Modal Backdrop | 40 | Modal backgrounds |
| Modal | 50 | Modal dialogs |
| Popover | 60 | Popovers, tooltips |
| Toast | 70 | Toast notifications |

```tsx
// Modal
<div className="fixed inset-0 z-50">
  <Dialog />
</div>
```

---

## Do's and Don'ts

### ✅ Do

- Use spacing scale values (4, 8, 16, 24, 32, etc.)
- Increase spacing between major sections
- Use consistent spacing throughout
- Provide generous white space around content
- Use responsive spacing (smaller on mobile)

### ❌ Don't

- Use arbitrary spacing values (13px, 27px, etc.)
- Cram too much content in small spaces
- Use same spacing for all relationships
- Forget mobile spacing considerations
- Mix spacing patterns inconsistently

---

## Spacing Checklist

Before shipping:

- [ ] Using spacing scale values
- [ ] Appropriate spacing for content relationships
- [ ] Consistent spacing across similar components
- [ ] Responsive spacing for mobile
- [ ] Generous white space (not cramped)
- [ ] Proper alignment across elements
- [ ] Consistent border radius

---

## Tools

### Tailwind Spacing Utilities

```tsx
// Padding
p-{size}   // All sides
px-{size}  // Horizontal (left & right)
py-{size}  // Vertical (top & bottom)
pt-{size}  // Top
pr-{size}  // Right
pb-{size}  // Bottom
pl-{size}  // Left

// Margin
m-{size}   // All sides
mx-{size}  // Horizontal
my-{size}  // Vertical
mt-{size}  // Top
mr-{size}  // Right
mb-{size}  // Bottom
ml-{size}  // Left

// Gap (for flex/grid)
gap-{size}      // Both directions
gap-x-{size}    // Horizontal
gap-y-{size}    // Vertical

// Space (for stacks)
space-x-{size}  // Horizontal
space-y-{size}  // Vertical
```
