# Documentation Index

Welcome to the Client Report Generator documentation! This directory contains all design systems, guidelines, and specifications for building the application.

## 📱 Design Systems

### [Mobile-First Design System](./MOBILE_FIRST_DESIGN_SYSTEM.md)
**Start here for component development!**

Complete guide to responsive design patterns including:
- Typography scale (mobile → desktop)
- Spacing system (progressive enhancement)
- Button sizing and patterns
- Component examples
- Quick reference tables
- Best practices

**Use this when:**
- Building new components
- Making components responsive
- Implementing typography
- Setting up spacing and layout

---

### [Neumorphic Design System](./NEUMORPHIC_DESIGN_SYSTEM.md)
Complete specification for the neumorphic (soft 3D) visual design:
- Shadow systems (raised, inset, pressed)
- Color palette
- Interactive states
- Component library
- Implementation guidelines

**Use this when:**
- Adding depth/shadows to components
- Creating interactive states
- Implementing brand colors
- Building tactile UI elements

---

### [Color Palette](./COLOR_PALETTE.md)
Comprehensive color system documentation:
- Background colors
- Brand colors (Orange, Teal)
- Text hierarchy
- Shadow colors
- Usage guidelines

**Use this when:**
- Choosing colors for new elements
- Ensuring brand consistency
- Checking color contrast
- Understanding color meanings

---

## 📋 Implementation Guides

### [Hero Section Checklist](./HERO_SECTION_CHECKLIST.md)
Detailed compliance checklist for the hero section component:
- Design system compliance verification
- Typography implementation
- Spacing patterns
- Responsive design testing
- Accessibility verification
- Performance optimization

**Use this as:**
- Reference implementation example
- Quality checklist for new components
- Mobile-first pattern guide

---

## 📄 Product Documentation

### [PRD (Product Requirements Document)](./PRD.md)
Complete product specification including:
- Market analysis
- Feature requirements
- Technical requirements
- Design system overview
- Roadmap

**Use this for:**
- Understanding product vision
- Feature prioritization
- Market context
- Business requirements

---

## 🚀 Quick Start Guide

### For Developers Building New Components:

1. **Read [Mobile-First Design System](./MOBILE_FIRST_DESIGN_SYSTEM.md)** first
   - Understand typography patterns
   - Learn spacing system
   - Review component examples

2. **Check [Neumorphic Design System](./NEUMORPHIC_DESIGN_SYSTEM.md)** for styling
   - Shadow patterns
   - Color usage
   - Interactive states

3. **Reference [Hero Section Checklist](./HERO_SECTION_CHECKLIST.md)** as example
   - See mobile-first patterns in action
   - Use as quality checklist

4. **Verify colors with [Color Palette](./COLOR_PALETTE.md)**
   - Ensure brand consistency
   - Check contrast requirements

---

## 📐 Design Principles

### Mobile-First
Always start with mobile styles and progressively enhance:
```tsx
// ✅ Good - Mobile first
className="text-3xl sm:text-4xl md:text-5xl"

// ❌ Bad - Desktop first
className="text-5xl md:text-4xl sm:text-3xl"
```

### Progressive Enhancement
Add complexity as screen size increases:
- Smaller text → Larger text
- Tighter spacing → More generous spacing
- Heavier fonts → Lighter fonts
- Simple layouts → Complex layouts

### Touch-Friendly
Minimum 44px touch targets on mobile:
```tsx
// ✅ Good - 44px minimum
className="h-11 sm:h-14"

// ❌ Bad - Too small
className="h-8"
```

### Accessible
- Proper contrast ratios (WCAG AA)
- Semantic HTML
- Keyboard navigation
- Screen reader support

---

## 🎨 Design Tokens Quick Reference

### Typography Scale
| Element | Mobile | Desktop |
|---------|--------|---------|
| Hero H1 | 30px (text-3xl) | 72px (text-7xl) |
| Section H2 | 24px (text-2xl) | 48px (text-5xl) |
| Body | 14px (text-sm) | 20px (text-xl) |
| Button | 14px (text-sm) | 16px (text-base) |

### Spacing Scale
| Element | Mobile | Desktop |
|---------|--------|---------|
| Section Padding | 48px (py-12) | 96px (py-24) |
| Container Space | 16px (space-y-4) | 32px (space-y-8) |
| Button Gap | 8px (gap-2) | 16px (gap-4) |

### Button Scale
| Property | Mobile | Desktop |
|----------|--------|---------|
| Height | 44px (h-11) | 56px (h-14) |
| Padding | 16px (px-4) | 32px (px-8) |

---

## 🔍 Finding What You Need

### "How do I make text responsive?"
→ [Mobile-First Design System - Typography](./MOBILE_FIRST_DESIGN_SYSTEM.md#typography-system)

### "What shadows should I use?"
→ [Neumorphic Design System - Shadow System](./NEUMORPHIC_DESIGN_SYSTEM.md#shadow-system)

### "What colors are available?"
→ [Color Palette](./COLOR_PALETTE.md)

### "How should buttons look on mobile?"
→ [Mobile-First Design System - Button System](./MOBILE_FIRST_DESIGN_SYSTEM.md#button-system)

### "What spacing should I use?"
→ [Mobile-First Design System - Spacing System](./MOBILE_FIRST_DESIGN_SYSTEM.md#spacing-system)

### "How do I make it accessible?"
→ [Hero Section Checklist - Accessibility](./HERO_SECTION_CHECKLIST.md#accessibility)

---

## 📦 Directory Structure

```
docs/
├── README.md                          # This file - Start here!
├── MOBILE_FIRST_DESIGN_SYSTEM.md     # 📱 Responsive patterns & spacing
├── NEUMORPHIC_DESIGN_SYSTEM.md       # 🎨 Shadows & visual effects
├── COLOR_PALETTE.md                   # 🎨 Colors & usage
├── HERO_SECTION_CHECKLIST.md         # ✅ Reference implementation
├── PRD.md                            # 📄 Product requirements
├── agents/                           # AI agent prompts
└── design/                           # Design assets
```

---

## 🤝 Contributing to Docs

When adding new components or patterns:

1. **Update Mobile-First Design System** if you create new responsive patterns
2. **Update Neumorphic Design System** if you create new shadow/effect patterns
3. **Update Color Palette** if you add new colors
4. **Create a checklist** like Hero Section Checklist for major components
5. **Update this README** with links to new documentation

---

## 📞 Questions?

If you can't find what you need:
1. Check the [Mobile-First Design System](./MOBILE_FIRST_DESIGN_SYSTEM.md) first (most comprehensive)
2. Look at [Hero Section](./HERO_SECTION_CHECKLIST.md) for a working example
3. Review the [PRD](./PRD.md) for product context

---

Last Updated: October 31, 2025
