# Animation Guidelines

## Overview

Animations enhance user experience by providing visual feedback, guiding attention, and creating delight. We use Framer Motion for advanced animations and Tailwind for simple transitions.

---

## Animation Principles

### 1. Purpose-Driven
Every animation must serve a purpose:
- **Feedback**: Confirm user actions
- **Attention**: Draw focus to important changes
- **Continuity**: Connect related UI states
- **Delight**: Create memorable moments

### 2. Subtle & Professional
- Animations should enhance, not distract
- Prefer subtle over flashy
- Maintain professional aesthetic
- Avoid gimmicky effects

### 3. Fast & Responsive
- Animations should feel instant, not sluggish
- Respect user's motion preferences
- Optimize for 60fps
- Use hardware-accelerated properties

---

## Animation Timing

### Duration Guidelines

```tsx
// Micro-interactions (hover, focus, small transitions)
duration-150  // 150ms - Instant feel

// Standard transitions (component appearance, state changes)
duration-200  // 200ms - Default

// Medium transitions (modal open/close, page transitions)
duration-300  // 300ms - Noticeable but quick

// Slow transitions (major state changes, celebrations)
duration-500  // 500ms - Deliberate, important
```

### Easing Functions

```tsx
// Default (ease-in-out) - Most common
transition ease-in-out duration-200

// Ease-out - Entering elements
transition ease-out duration-200

// Ease-in - Exiting elements
transition ease-in duration-200

// Linear - Loading bars, spinners
transition linear duration-1000
```

---

## Common Animations

### Hover Effects

#### Button Hover
```tsx
<Button className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
  Hover Me
</Button>
```

#### Card Hover
```tsx
<Card className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
  <CardContent>Hover card</CardContent>
</Card>
```

#### Link Hover
```tsx
<a className="transition-colors duration-150 hover:text-primary">
  Hover link
</a>
```

### Focus States

```tsx
<Button className="focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150">
  Focus Me
</Button>
```

### Loading Animations

#### Spinner
```tsx
import { Loader2 } from "lucide-react";

<Loader2 className="h-6 w-6 animate-spin" />
```

#### Pulse
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-muted rounded mb-2" />
  <div className="h-4 bg-muted rounded w-3/4" />
</div>
```

#### Progress Bar
```tsx
<div className="w-full bg-muted rounded-full h-2">
  <div
    className="bg-primary h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## Framer Motion Animations

### Fade In
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Slide In
```tsx
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>
```

### Scale In
```tsx
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### Staggered List
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Modal Animation
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  <Dialog>
    {/* Modal content */}
  </Dialog>
</motion.div>
```

---

## Page Transitions

### Fade Between Pages
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  <PageContent />
</motion.div>
```

### Slide Between Pages
```tsx
<motion.div
  initial={{ x: 300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: -300, opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
  <PageContent />
</motion.div>
```

---

## Interactive Animations

### Drag and Drop
```tsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1 }}
>
  Drag me
</motion.div>
```

### Click Animation
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>
```

### Gesture Animation
```tsx
<motion.div
  whileHover={{ rotate: 5 }}
  whileTap={{ rotate: -5 }}
>
  Interactive element
</motion.div>
```

---

## Success/Celebration Animations

### Checkmark Animation
```tsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20
  }}
>
  <CheckCircle className="h-12 w-12 text-green-500" />
</motion.div>
```

### Confetti on Success
```tsx
<motion.div
  initial={{ y: 0 }}
  animate={{ y: [0, -10, 0] }}
  transition={{
    repeat: Infinity,
    duration: 2,
    ease: "easeInOut"
  }}
>
  🎉
</motion.div>
```

---

## Accessibility

### Respect Motion Preferences
```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

### CSS Media Query
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimization

### Use Hardware-Accelerated Properties
✅ **Fast** (GPU-accelerated):
- `transform` (translate, scale, rotate)
- `opacity`
- `filter`

❌ **Slow** (causes reflow):
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`

### Optimize Animations
```tsx
// ✅ Good - Uses transform
<motion.div
  animate={{ x: 100 }}
>
  Content
</motion.div>

// ❌ Bad - Causes reflow
<motion.div
  animate={{ left: 100 }}
>
  Content
</motion.div>
```

### Lazy Load Heavy Animations
```tsx
import { lazy, Suspense } from "react";

const HeavyAnimation = lazy(() => import("./HeavyAnimation"));

<Suspense fallback={<div>Loading...</div>}>
  <HeavyAnimation />
</Suspense>
```

---

## Animation Catalog

### Component Entry
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

<motion.div {...fadeInUp}>
  Component
</motion.div>
```

### Component Exit
```tsx
const fadeOut = {
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

<motion.div {...fadeOut}>
  Component
</motion.div>
```

### Attention Seeker
```tsx
const wiggle = {
  animate: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  }
};

<motion.div {...wiggle}>
  Look at me!
</motion.div>
```

---

## Common Patterns

### Animated Card Grid
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div
  className="grid md:grid-cols-3 gap-6"
  variants={container}
  initial="hidden"
  animate="show"
>
  {cards.map(card => (
    <motion.div key={card.id} variants={cardVariant}>
      <Card>{card.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

### Notification Toast
```tsx
<motion.div
  initial={{ x: 300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 300, opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className="fixed top-4 right-4"
>
  <Card>
    <CardContent className="flex items-center gap-2 p-4">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <span>Action completed!</span>
    </CardContent>
  </Card>
</motion.div>
```

---

## Do's and Don'ts

### ✅ Do

- Use animations to provide feedback
- Keep animations subtle and professional
- Respect user motion preferences
- Use hardware-accelerated properties
- Test on actual devices
- Provide loading states
- Celebrate important moments

### ❌ Don't

- Animate everything (overwhelming)
- Use long duration (feels sluggish)
- Ignore reduced motion preference
- Animate width/height (poor performance)
- Block interactions during animations
- Use animations without purpose
- Make critical actions depend on animations

---

## Animation Checklist

Before shipping:

- [ ] Animation has clear purpose
- [ ] Duration feels appropriate
- [ ] Respects reduced motion preference
- [ ] Uses GPU-accelerated properties
- [ ] Tested on mobile devices
- [ ] Doesn't block user interactions
- [ ] Provides appropriate feedback
- [ ] Maintains 60fps

---

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind Animation Utilities](https://tailwindcss.com/docs/animation)
- [Motion Design Principles](https://material.io/design/motion)
