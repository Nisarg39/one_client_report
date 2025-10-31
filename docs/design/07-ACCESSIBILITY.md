# Accessibility Guidelines

## Overview

Accessibility (a11y) ensures our product is usable by everyone, including people with disabilities. We follow WCAG 2.1 Level AA standards.

---

## WCAG 2.1 Principles

### 1. Perceivable
Users must be able to perceive the information being presented.

### 2. Operable
Users must be able to operate the interface.

### 3. Understandable
Users must be able to understand the information and interface.

### 4. Robust
Content must be robust enough to work with current and future technologies.

---

## Color & Contrast

### Contrast Ratios (WCAG AA)

| Text Type | Minimum Ratio | Our Standard |
|-----------|---------------|--------------|
| Normal text (< 18px) | 4.5:1 | 4.5:1+ |
| Large text (≥ 18px or bold ≥ 14px) | 3:1 | 4.5:1+ |
| Interactive components | 3:1 | 3:1+ |
| Graphics and UI components | 3:1 | 3:1+ |

### Verified Color Combinations

✅ **Passing Combinations**:
- White (#FAFAFA) on Black (#000000) - 21:1
- White (#FAFAFA) on Dark Teal (#12212E) - 14.2:1
- White (#FAFAFA) on Teal (#307082) - 5.8:1
- Black (#000000) on Orange (#EA9940) - 8.4:1
- White (#FAFAFA) on Light Teal (#6CA3A2) - 4.2:1

### Testing Contrast
```bash
# Use browser DevTools Accessibility panel
# Or online tools:
# - https://webaim.org/resources/contrastchecker/
# - https://colorable.jxnblk.com/
```

### Don't Rely on Color Alone
```tsx
// ❌ Bad - Color only
<span className="text-destructive">Error</span>

// ✅ Good - Color + icon + text
<div className="flex items-center gap-2 text-destructive">
  <AlertCircle className="h-4 w-4" />
  <span>Error: Please check your input</span>
</div>
```

---

## Keyboard Navigation

### Focus Management

All interactive elements must be keyboard accessible:

```tsx
// ✅ Proper focus indicator
<Button className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Click me
</Button>

// ✅ Custom interactive element
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  className="focus:ring-2 focus:ring-primary"
>
  Custom button
</div>
```

### Tab Order

Ensure logical tab order:

```tsx
// ✅ Natural DOM order
<form>
  <input tabIndex={0} /> {/* First */}
  <input tabIndex={0} /> {/* Second */}
  <button tabIndex={0}>Submit</button> {/* Third */}
</form>

// ❌ Avoid positive tabIndex (breaks natural order)
<input tabIndex={5} />
```

### Skip Links

Provide skip links for keyboard users:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
>
  Skip to main content
</a>
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift + Tab | Move to previous focusable element |
| Enter | Activate button/link |
| Space | Activate button, toggle checkbox |
| Esc | Close modal/dropdown |
| Arrow keys | Navigate within components (dropdowns, tabs) |

---

## Semantic HTML

### Use Proper HTML Elements

```tsx
// ✅ Good - Semantic HTML
<button onClick={handleClick}>Click me</button>
<a href="/page">Link</a>
<nav>Navigation</nav>
<main>Main content</main>
<article>Article content</article>

// ❌ Bad - Non-semantic
<div onClick={handleClick}>Click me</div>
<div className="link">Link</div>
```

### Heading Hierarchy

```tsx
// ✅ Correct hierarchy
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

// ❌ Skipping levels
<h1>Page Title</h1>
  <h3>Subsection</h3> {/* Skipped h2 */}
```

### Landmarks

```tsx
<body>
  <header>
    <nav aria-label="Main navigation">
      {/* Navigation */}
    </nav>
  </header>

  <main>
    <h1>Page Title</h1>
    {/* Main content */}
  </main>

  <aside aria-label="Sidebar">
    {/* Sidebar content */}
  </aside>

  <footer>
    {/* Footer content */}
  </footer>
</body>
```

---

## ARIA Attributes

### When to Use ARIA

1. When semantic HTML is insufficient
2. For dynamic content changes
3. For custom interactive components

**First Rule of ARIA**: Don't use ARIA if semantic HTML works.

### Common ARIA Patterns

#### Labels
```tsx
// Input with visible label
<Label htmlFor="email">Email</Label>
<Input id="email" />

// Input with aria-label (no visible label)
<Input aria-label="Search" placeholder="Search..." />

// Input with aria-labelledby
<h2 id="section-title">Contact Information</h2>
<Input aria-labelledby="section-title" />
```

#### Descriptions
```tsx
<Input
  aria-describedby="email-help"
/>
<p id="email-help" className="text-sm text-muted-foreground">
  We'll never share your email.
</p>
```

#### States
```tsx
// Expanded/Collapsed
<button
  aria-expanded={isOpen}
  onClick={() => setIsOpen(!isOpen)}
>
  Toggle
</button>

// Disabled
<Button disabled aria-disabled="true">
  Disabled
</Button>

// Checked
<input
  type="checkbox"
  checked={isChecked}
  aria-checked={isChecked}
/>
```

#### Live Regions
```tsx
// Announce changes to screen readers
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>

// Urgent announcements
<div
  role="alert"
  aria-live="assertive"
>
  {errorMessage}
</div>
```

#### Dialogs
```tsx
<Dialog open={isOpen}>
  <DialogContent
    role="dialog"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogTitle id="dialog-title">
      Confirm Action
    </DialogTitle>
    <DialogDescription id="dialog-description">
      Are you sure you want to continue?
    </DialogDescription>
  </DialogContent>
</Dialog>
```

---

## Forms & Inputs

### Labels
```tsx
// ✅ Always associate labels with inputs
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" />
</div>
```

### Error Messages
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <p id="email-error" className="text-sm text-destructive" role="alert">
      Please enter a valid email address
    </p>
  )}
</div>
```

### Required Fields
```tsx
<Label htmlFor="email">
  Email <span className="text-destructive">*</span>
</Label>
<Input
  id="email"
  required
  aria-required="true"
/>
```

### Field Instructions
```tsx
<Label htmlFor="password">Password</Label>
<Input
  id="password"
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint" className="text-sm text-muted-foreground">
  Must be at least 8 characters
</p>
```

---

## Images & Media

### Alternative Text
```tsx
// ✅ Informative images
<img src="/chart.png" alt="Sales increased by 23% in Q4" />

// ✅ Decorative images
<img src="/decoration.png" alt="" />
// or
<img src="/decoration.png" role="presentation" />

// ❌ Missing alt
<img src="/important.png" />
```

### Icons
```tsx
// Icon with text (decorative)
<Button>
  <PlusCircle className="mr-2" aria-hidden="true" />
  Add Item
</Button>

// Icon button (needs label)
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>
```

### Videos
```tsx
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/captions.vtt"
    srcLang="en"
    label="English"
  />
</video>
```

---

## Touch Targets

### Minimum Size
- Touch targets should be at least **44x44px**
- Provide adequate spacing between interactive elements

```tsx
// ✅ Adequate touch target
<Button className="h-11 px-4">
  Click me
</Button>

// ❌ Too small
<button className="h-6 px-2">
  Tiny
</button>
```

---

## Screen Reader Support

### Visually Hidden Text
```tsx
// Include text for screen readers
<button>
  <span className="sr-only">Delete item</span>
  <Trash2 className="h-4 w-4" />
</button>
```

### Screen Reader Only Utility
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only.focus:not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Announcements
```tsx
// Announce dynamic content changes
function StatusMessage() {
  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
```

---

## Motion & Animation

### Reduced Motion
```tsx
// Respect user preferences
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        x: shouldReduceMotion ? 0 : 100,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.3
        }
      }}
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

## Testing Accessibility

### Automated Testing

```bash
# Install axe DevTools browser extension
# Or use automated tools:

npm install --save-dev @axe-core/react
```

### Manual Testing Checklist

- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast ratios
- [ ] Verify all images have alt text
- [ ] Ensure forms have proper labels
- [ ] Test with browser zoom at 200%
- [ ] Verify focus indicators are visible
- [ ] Check for motion sensitivity

### Screen Readers

- **Windows**: NVDA (free), JAWS
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca
- **Mobile**: TalkBack (Android), VoiceOver (iOS)

### Browser Extensions

- axe DevTools
- WAVE Evaluation Tool
- Lighthouse (Chrome DevTools)
- Color Contrast Analyzer

---

## Common Accessibility Patterns

### Accessible Button
```tsx
<Button
  onClick={handleClick}
  aria-label="Add new report"
  disabled={isLoading}
  aria-disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      <span>Loading...</span>
    </>
  ) : (
    <>
      <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
      <span>Add Report</span>
    </>
  )}
</Button>
```

### Accessible Modal
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogHeader>
      <DialogTitle id="dialog-title">
        Delete Report
      </DialogTitle>
      <DialogDescription id="dialog-description">
        This action cannot be undone. Are you sure?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Accessible Tabs
```tsx
<Tabs defaultValue="overview">
  <TabsList role="tablist" aria-label="Report sections">
    <TabsTrigger
      value="overview"
      role="tab"
      aria-selected={activeTab === "overview"}
      aria-controls="overview-panel"
    >
      Overview
    </TabsTrigger>
  </TabsList>
  <TabsContent
    value="overview"
    role="tabpanel"
    id="overview-panel"
    aria-labelledby="overview-tab"
  >
    Content
  </TabsContent>
</Tabs>
```

---

## Do's and Don'ts

### ✅ Do

- Use semantic HTML elements
- Provide text alternatives for images
- Ensure sufficient color contrast
- Make all functionality keyboard accessible
- Provide visible focus indicators
- Use ARIA when semantic HTML is insufficient
- Test with screen readers
- Respect user motion preferences

### ❌ Don't

- Rely on color alone
- Use positive tabIndex values
- Remove focus outlines without replacement
- Use div/span for interactive elements
- Forget alt text on images
- Skip heading levels
- Ignore keyboard navigation
- Auto-play videos with sound

---

## Accessibility Checklist

Before shipping:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All images have appropriate alt text
- [ ] Forms have proper labels and error messages
- [ ] Heading hierarchy is correct
- [ ] ARIA attributes are used correctly
- [ ] Tested with screen reader
- [ ] Tested with keyboard only
- [ ] Respects reduced motion preference
- [ ] Touch targets are at least 44x44px
- [ ] No accessibility errors in axe DevTools

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
