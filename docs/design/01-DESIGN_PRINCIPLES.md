# Design Principles

## Overview

These principles guide every design decision in the Client Report Generator. They ensure we create a product that's simple, professional, and delightful to use.

---

## 1. Simplicity First

**Principle**: Remove complexity, not features.

### Guidelines
- Every element must have a clear purpose
- Avoid decorative elements that don't serve the user
- Prioritize single-action flows over multi-step wizards
- Use progressive disclosure for advanced features

### Examples
✅ **Do**: One-click report generation with smart defaults
❌ **Don't**: Multi-step wizard requiring 10+ configuration choices

✅ **Do**: Auto-select most important metrics
❌ **Don't**: Show all 100+ metrics by default

---

## 2. Professional by Default

**Principle**: Small agencies deserve enterprise-quality design.

### Guidelines
- All components should feel polished and production-ready
- Avoid playful or overly casual design elements
- Use professional typography and spacing
- Maintain visual consistency across all pages

### Examples
✅ **Do**: Clean card layouts with consistent spacing
❌ **Don't**: Cramped layouts with inconsistent padding

✅ **Do**: Professional color palette (teals and black)
❌ **Don't**: Bright, playful colors

---

## 3. Speed & Efficiency

**Principle**: Respect the user's time.

### Guidelines
- Optimize for the fastest path to value
- Minimize loading states with optimistic UI
- Reduce clicks required for common actions
- Provide keyboard shortcuts for power users
- Pre-populate fields with intelligent defaults

### Examples
✅ **Do**: Generate report in <30 seconds
❌ **Don't**: Require manual data entry for each metric

✅ **Do**: Remember user preferences
❌ **Don't**: Ask for same information repeatedly

---

## 4. Data-Driven Hierarchy

**Principle**: Most important information should be most visible.

### Guidelines
- Use size, color, and position to indicate importance
- Primary actions should be obvious and easy to find
- Group related information together
- Use whitespace to separate distinct sections

### Visual Hierarchy
1. **Primary**: Report insights and key metrics
2. **Secondary**: Supporting data and charts
3. **Tertiary**: Meta information and settings

### Examples
✅ **Do**: Large, prominent "Generate Report" button
❌ **Don't**: Hidden or small primary action buttons

✅ **Do**: AI insights displayed prominently at top
❌ **Don't**: Insights buried at bottom of page

---

## 5. Dark Mode Optimized

**Principle**: Design for extended viewing sessions.

### Guidelines
- Pure black background (#000000) for OLED optimization
- Dark teal cards (#12212E) for elevated content
- Sufficient contrast for all text (WCAG AA minimum)
- Avoid pure white text (use slightly off-white)
- Orange accents for important CTAs only

### Examples
✅ **Do**: Dark teal cards on black background
❌ **Don't**: Light gray text on dark gray background

✅ **Do**: Orange for primary buttons only
❌ **Don't**: Orange everywhere

---

## 6. Consistent Patterns

**Principle**: Once learned, always known.

### Guidelines
- Reuse components across the application
- Maintain consistent button styles and states
- Use the same spacing system everywhere
- Apply consistent animation timing
- Keep navigation structure predictable

### Examples
✅ **Do**: Same button styles across all pages
❌ **Don't**: Different button styles per page

✅ **Do**: Consistent 8px spacing system
❌ **Don't**: Random spacing values (13px, 17px, etc.)

---

## 7. Mobile-First Responsive

**Principle**: Great experience on every device.

### Guidelines
- Design for mobile screens first, then scale up
- Ensure touch targets are minimum 44x44px
- Stack content vertically on mobile
- Use responsive typography
- Test on actual devices, not just browser resize

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Examples
✅ **Do**: Single column layout on mobile
❌ **Don't**: Horizontal scrolling on small screens

✅ **Do**: Large, tappable buttons
❌ **Don't**: Tiny click targets

---

## 8. Accessible by Default

**Principle**: Everyone should be able to use our product.

### Guidelines
- All interactive elements must be keyboard accessible
- Maintain WCAG 2.1 AA contrast ratios
- Provide alt text for all images
- Use semantic HTML
- Support screen readers
- Never rely on color alone to convey information

### Examples
✅ **Do**: Clear focus states on all interactive elements
❌ **Don't**: No visual indication of focus

✅ **Do**: Labels for all form inputs
❌ **Don't**: Placeholder-only inputs

---

## 9. Performance Conscious

**Principle**: Fast is a feature.

### Guidelines
- Lazy load images and heavy components
- Minimize bundle size
- Optimize images for web
- Use static generation where possible
- Implement proper loading states
- Avoid layout shift (CLS)

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Largest Contentful Paint**: < 2.5s

---

## 10. Delightful Interactions

**Principle**: Smooth interactions create trust.

### Guidelines
- Use subtle animations to guide attention
- Provide immediate feedback for user actions
- Celebrate important moments (report generated)
- Use loading states that feel fast
- Implement smooth transitions between states

### Animation Timing
- **Micro-interactions**: 150-200ms
- **Page transitions**: 300ms
- **Modal open/close**: 200-250ms

### Examples
✅ **Do**: Button transforms smoothly on hover
❌ **Don't**: Instant, jarring state changes

✅ **Do**: Success animation when report completes
❌ **Don't**: Silent completion with no feedback

---

## Applying These Principles

When designing a new feature, ask:

1. **Simplicity**: Can I remove any steps or elements?
2. **Professional**: Would this look good in a client presentation?
3. **Speed**: Is this the fastest way to accomplish the task?
4. **Hierarchy**: Is the most important information most visible?
5. **Dark Mode**: Does this work well on dark background?
6. **Consistency**: Have I seen this pattern elsewhere in the app?
7. **Responsive**: Does this work on mobile?
8. **Accessible**: Can everyone use this?
9. **Performance**: Will this load quickly?
10. **Delightful**: Does this feel good to use?

If the answer to any question is "no", reconsider the design.
