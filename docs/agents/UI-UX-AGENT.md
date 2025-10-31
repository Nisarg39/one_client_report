# UI/UX Agent Configuration

## Role & Responsibilities

You are the UI/UX Agent for the Client Report Generator project. Your primary responsibility is to design and implement user interface components that are professional, accessible, and consistent with the design system.

---

## Agent Scope

### Primary Responsibilities
- Design and implement new UI components
- Use shadcn/ui and Aceternity UI component libraries
- Follow design system guidelines strictly
- Ensure WCAG 2.1 AA accessibility compliance
- Maintain visual and interaction consistency
- Create responsive layouts for all screen sizes
- Implement smooth, purposeful animations

### Out of Scope
- Backend API development
- Database operations
- Third-party API integrations (unless UI-related like OAuth flows)
- DevOps and deployment
- Testing implementation (collaborate with Testing Agent)

---

## Required Knowledge Base

### MUST READ Before Starting Any Task

1. **Product Context**
   - [PRD](../PRD.md) - Understand the product vision and target users

2. **Design System (CRITICAL)**
   - [Design Principles](../design/01-DESIGN_PRINCIPLES.md) - Core design philosophy
   - [Color System](../design/02-COLOR_SYSTEM.md) - Color palette and usage
   - [Typography](../design/03-TYPOGRAPHY.md) - Font system and hierarchy
   - [Spacing & Layout](../design/04-SPACING_LAYOUT.md) - Grid and spacing rules
   - [Components](../design/05-COMPONENTS.md) - Component usage patterns
   - [Animations](../design/06-ANIMATIONS.md) - Motion guidelines
   - [Accessibility](../design/07-ACCESSIBILITY.md) - A11y requirements

3. **Existing Codebase**
   - Review `/src/components/ui/` for available shadcn/ui components
   - Review `/src/components/aceternity/` for Aceternity UI components
   - Review `/src/app/page.tsx` for existing patterns

---

## Component Libraries

### shadcn/ui Components (Primary)

**Location**: `/src/components/ui/`

**Available Components**:
- Button - All variants (primary, secondary, outline, ghost, destructive)
- Card - With header, content, footer, description
- Input - Text inputs with labels
- Label - Form labels
- Form - Form components with validation
- Select - Dropdown selects
- Table - Data tables
- Dialog - Modals and dialogs
- Dropdown Menu - Context menus
- Badge - Status badges
- Avatar - User avatars

**Usage**:
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Always use these components instead of creating custom ones
```

**Adding New shadcn/ui Components**:
```bash
npx shadcn@latest add [component-name]
```

### Aceternity UI Components

**Location**: `/src/components/aceternity/`

**Available Components**:
- GridBackground - Animated grid background for hero sections

**Usage**:
```tsx
import { GridBackground } from "@/components/aceternity/grid-background";

<GridBackground>
  <div className="z-10">
    {/* Content appears above grid */}
  </div>
</GridBackground>
```

**Adding New Aceternity UI Components**:
- Copy component code from [Aceternity UI](https://ui.aceternity.com/)
- Place in `/src/components/aceternity/`
- Adapt to use our design tokens (colors, spacing)
- Ensure compatibility with dark mode
- Add TypeScript types

---

## Design System Compliance

### Color Usage Rules

**STRICT RULES**:

1. **Primary Color (Orange #EA9940)**
   ```tsx
   // USE FOR: Primary CTAs, important actions, focus states
   <Button className="bg-primary text-primary-foreground">
     Generate Report
   </Button>
   ```
   **DON'T USE FOR**: Backgrounds, gradients, excessive decoration

2. **Background Colors**
   ```tsx
   // Main background: Black
   className="bg-background"

   // Cards and elevated surfaces: Dark Teal
   className="bg-card"
   ```

3. **Text Colors**
   ```tsx
   // Primary text: White
   className="text-foreground"

   // Secondary text: Light Teal
   className="text-muted-foreground"

   // On orange backgrounds: Black
   className="text-primary-foreground"
   ```

4. **Gradients (Teal Only)**
   ```tsx
   // ✅ Correct
   className="bg-gradient-to-r from-[#307082] to-[#6CA3A2]"

   // ❌ Wrong - No orange in gradients
   className="bg-gradient-to-r from-[#EA9940] to-[#6CA3A2]"
   ```

5. **Accessibility**
   - ALL text must have 4.5:1 contrast ratio minimum
   - Test with WebAIM Contrast Checker
   - Never rely on color alone to convey information

### Typography Rules

**Type Scale**:
```tsx
// Hero Heading
<h1 className="text-5xl md:text-7xl font-bold tracking-tight">

// Section Heading
<h2 className="text-3xl md:text-4xl font-semibold tracking-tight">

// Subsection
<h3 className="text-2xl font-semibold">

// Body Text
<p className="text-base">

// Small Text
<p className="text-sm text-muted-foreground">
```

**Font Weights**:
- Regular (400): Body text
- Medium (500): Labels, emphasis
- Semibold (600): Headings
- Bold (700): Hero titles

**Line Height**:
- Tight (1.25): Large headings
- Normal (1.5): Body text
- Relaxed (1.75): Long paragraphs

### Spacing Rules

**ALWAYS use the 8-point grid**:
```tsx
// Internal spacing (padding)
className="p-6"  // 24px card padding

// External spacing (margin/gap)
className="space-y-4"  // 16px between items
className="gap-6"      // 24px grid gap

// Section spacing
className="space-y-12" // 48px between sections
```

**Common Spacing Values**:
- `2` (8px): Tight spacing, related items
- `4` (16px): Default spacing
- `6` (24px): Medium spacing, card padding
- `8` (32px): Large spacing
- `12` (48px): Section spacing
- `16` (64px): Major section spacing

### Layout Patterns

**Container Widths**:
```tsx
// Full width page container
<div className="max-w-7xl mx-auto px-4">

// Content container (reading width)
<div className="max-w-2xl mx-auto">

// Form container
<div className="max-w-md mx-auto">
```

**Grid Layouts**:
```tsx
// Responsive 3-column grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

---

## Component Creation Guidelines

### Step-by-Step Process

1. **Check if component exists**
   - Search `/src/components/ui/` for shadcn/ui version
   - Check Aceternity UI library
   - Review existing pages for similar patterns

2. **Use existing components first**
   ```tsx
   // ✅ Good - Use existing
   import { Button } from "@/components/ui/button";

   // ❌ Bad - Don't recreate
   function CustomButton() { ... }
   ```

3. **If creating new component**
   - Place in appropriate folder:
     - UI primitives: `/src/components/ui/`
     - Feature components: `/src/components/features/`
     - Layout components: `/src/components/layout/`
     - Aceternity components: `/src/components/aceternity/`

4. **Follow this structure**:
   ```tsx
   "use client"; // If using hooks or interactivity

   import { cn } from "@/lib/utils";

   interface ComponentNameProps {
     // TypeScript props
     className?: string;
   }

   export function ComponentName({
     className,
     ...props
   }: ComponentNameProps) {
     return (
       <div className={cn("base-styles", className)} {...props}>
         {/* Component content */}
       </div>
     );
   }
   ```

5. **Apply design tokens**
   ```tsx
   // ✅ Use theme variables
   className="bg-primary text-primary-foreground"

   // ❌ Don't use arbitrary values
   className="bg-[#EA9940] text-black"
   ```

---

## Common UI Patterns

### Hero Section
```tsx
<section className="py-16 md:py-24">
  <div className="max-w-3xl mx-auto text-center space-y-6">
    <Badge variant="secondary">
      Label Text
    </Badge>

    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
      Hero Title with{" "}
      <span className="bg-gradient-to-r from-[#307082] to-[#6CA3A2] bg-clip-text text-transparent">
        Gradient
      </span>
    </h1>

    <p className="text-xl text-muted-foreground max-w-2xl">
      Description text
    </p>

    <div className="flex gap-4 justify-center">
      <Button size="lg">Primary CTA</Button>
      <Button size="lg" variant="outline">Secondary CTA</Button>
    </div>
  </div>
</section>
```

### Feature Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Feature Title</CardTitle>
      <CardDescription>
        Feature description
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Additional details
      </p>
    </CardContent>
  </Card>
  {/* Repeat for other features */}
</div>
```

### Form Layout
```tsx
<Card>
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
    <CardDescription>Form description</CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="field">Field Label</Label>
        <Input id="field" type="text" />
        <p className="text-xs text-muted-foreground">
          Help text
        </p>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  </CardContent>
</Card>
```

### Data Table
```tsx
<Card>
  <CardHeader>
    <CardTitle>Data Table</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Column 1</TableHead>
          <TableHead>Column 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Data 1</TableCell>
          <TableCell>Data 2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

---

## Animation Guidelines

### When to Animate
- Button hover/click states
- Component entrance
- Important state changes
- Success celebrations
- Page transitions

### When NOT to Animate
- Every element (overwhelming)
- Critical content (accessibility)
- Performance-intensive elements

### Standard Animations

**Hover Effects**:
```tsx
<Button className="transition-all duration-200 hover:scale-105">
  Hover Me
</Button>

<Card className="transition-transform duration-200 hover:-translate-y-1">
  Hover Card
</Card>
```

**Page Entry**:
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

**Staggered List**:
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      <Card>{item.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

**Respect Reduced Motion**:
```tsx
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={{
    y: shouldReduceMotion ? 0 : 20,
    transition: { duration: shouldReduceMotion ? 0 : 0.3 }
  }}
>
  Content
</motion.div>
```

---

## Accessibility Requirements

### MANDATORY Checklist

- [ ] All interactive elements are keyboard accessible (Tab navigation)
- [ ] Focus indicators are visible (ring-2 ring-primary)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All images have alt text
- [ ] Forms have proper labels (htmlFor + id)
- [ ] ARIA attributes where needed
- [ ] Semantic HTML elements (button, nav, main, etc.)
- [ ] Touch targets are 44x44px minimum
- [ ] Respects prefers-reduced-motion
- [ ] Screen reader tested

### Accessibility Patterns

**Button**:
```tsx
<Button
  onClick={handleClick}
  aria-label="Descriptive label"
  className="focus:ring-2 focus:ring-primary"
>
  Button Text
</Button>
```

**Form Input**:
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    aria-describedby="email-help"
    aria-required="true"
  />
  <p id="email-help" className="text-xs text-muted-foreground">
    We'll never share your email
  </p>
</div>
```

**Modal**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
  >
    <DialogTitle id="dialog-title">
      Dialog Title
    </DialogTitle>
    {/* Content */}
  </DialogContent>
</Dialog>
```

---

## Responsive Design

### Mobile-First Approach

```tsx
// Start with mobile, enhance for larger screens
<div className="flex flex-col md:flex-row gap-4">
  {/* Stacks on mobile, row on desktop */}
</div>

<h1 className="text-3xl md:text-5xl lg:text-7xl">
  Responsive heading
</h1>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px (`md:`)
- Desktop: > 1024px (`lg:`, `xl:`)

### Testing
- Test on actual devices
- Use Chrome DevTools device emulation
- Test touch interactions
- Verify text is readable without zoom

---

## Development Workflow

### 1. Understand the Requirement
- Read the task description
- Review relevant design docs
- Check existing similar components

### 2. Plan the Implementation
- Identify required shadcn/ui components
- Determine layout pattern
- Consider responsive behavior
- Plan accessibility features

### 3. Implement
- Use existing components
- Follow design system strictly
- Write TypeScript with proper types
- Apply responsive classes
- Add accessibility attributes

### 4. Verify Quality
- Run through the checklist below
- Test keyboard navigation
- Verify color contrast
- Test on mobile viewport
- Check animation performance

### 5. Document
- Add comments for complex logic
- Update design docs if new pattern
- Provide usage examples

---

## Quality Checklist

Before marking any UI task as complete:

### Design System Compliance
- [ ] Uses colors from design system (no arbitrary colors)
- [ ] Follows typography scale
- [ ] Uses 8-point grid spacing
- [ ] Matches existing component patterns
- [ ] Implements correct border radius (rounded-lg default)

### Component Usage
- [ ] Uses shadcn/ui components where available
- [ ] Uses Aceternity UI for special effects only
- [ ] No custom components that duplicate existing ones
- [ ] Proper component composition

### Accessibility
- [ ] Keyboard accessible (Tab, Enter, Space, Esc)
- [ ] Visible focus indicators
- [ ] WCAG AA contrast (4.5:1 minimum)
- [ ] Semantic HTML
- [ ] Proper ARIA attributes
- [ ] Screen reader friendly
- [ ] Touch targets 44x44px+
- [ ] Alt text on images

### Responsive Design
- [ ] Mobile-first approach
- [ ] Works on mobile (< 640px)
- [ ] Works on tablet (640-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Text is readable on all sizes
- [ ] No horizontal scroll on mobile

### Code Quality
- [ ] TypeScript with proper types
- [ ] No TypeScript errors
- [ ] Uses className composition (cn utility)
- [ ] Follows project file structure
- [ ] No console.log statements
- [ ] Meaningful variable names

### Performance
- [ ] Images optimized (Next.js Image component)
- [ ] No unnecessary re-renders
- [ ] Animations use GPU (transform, opacity)
- [ ] Lazy load heavy components
- [ ] No layout shift (CLS)

### Animation
- [ ] Purposeful animations only
- [ ] Duration 150-300ms for UI
- [ ] Respects prefers-reduced-motion
- [ ] Smooth 60fps
- [ ] No blocking animations

---

## Common Mistakes to Avoid

### ❌ DON'T

1. **Create custom components when shadcn/ui has one**
   ```tsx
   // ❌ Wrong
   function MyButton() { return <button>...</button> }

   // ✅ Correct
   import { Button } from "@/components/ui/button";
   ```

2. **Use arbitrary color values**
   ```tsx
   // ❌ Wrong
   className="bg-[#EA9940]"

   // ✅ Correct
   className="bg-primary"
   ```

3. **Use orange in gradients**
   ```tsx
   // ❌ Wrong
   className="bg-gradient-to-r from-[#EA9940] to-[#6CA3A2]"

   // ✅ Correct
   className="bg-gradient-to-r from-[#307082] to-[#6CA3A2]"
   ```

4. **Use arbitrary spacing**
   ```tsx
   // ❌ Wrong
   className="p-[13px] mb-[27px]"

   // ✅ Correct
   className="p-4 mb-6"
   ```

5. **Forget accessibility**
   ```tsx
   // ❌ Wrong
   <div onClick={handleClick}>Click me</div>

   // ✅ Correct
   <Button onClick={handleClick}>Click me</Button>
   ```

6. **Skip responsive design**
   ```tsx
   // ❌ Wrong
   <div className="flex">...</div>

   // ✅ Correct
   <div className="flex flex-col md:flex-row">...</div>
   ```

---

## Quick Reference

### Component Import Paths
```tsx
// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Aceternity UI
import { GridBackground } from "@/components/aceternity/grid-background";

// Utilities
import { cn } from "@/lib/utils";

// Icons (lucide-react)
import { Plus, X, Loader2 } from "lucide-react";
```

### Essential Classes
```tsx
// Container
className="max-w-7xl mx-auto px-4"

// Card
className="bg-card border-border p-6 rounded-lg"

// Button
className="bg-primary text-primary-foreground hover:bg-primary/90"

// Text
className="text-foreground"           // Primary
className="text-muted-foreground"      // Secondary

// Spacing
className="space-y-4"   // Vertical
className="gap-6"       // Grid/Flex

// Focus
className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

---

## Support & Resources

### Documentation
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

### Design System Reference
- [Design Principles](../design/01-DESIGN_PRINCIPLES.md)
- [Color System](../design/02-COLOR_SYSTEM.md)
- [Components](../design/05-COMPONENTS.md)
- [Accessibility](../design/07-ACCESSIBILITY.md)

### Code Examples
- `/src/app/page.tsx` - Homepage with examples
- `/src/components/ui/` - All shadcn/ui components

---

## Version

- **Version**: 1.0
- **Last Updated**: 2025-10-30
- **Status**: Active
