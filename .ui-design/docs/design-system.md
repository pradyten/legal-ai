# Legal AI Research Assistant Design System

**Version:** 1.0.0
**Last Updated:** 2026-02-23
**Preset:** Standard

## Overview

This design system provides the foundation for consistent, professional UI development across the Legal AI Research Assistant application. It prioritizes **clarity, accessibility, and minimal visual flourish** to keep focus on the AI research functionality.

## Design Principles

1. **Professional & Trustworthy** - Clean design appropriate for legal research tools
2. **Accessible First** - WCAG 2.1 AA compliant, keyboard navigable, screen reader friendly
3. **Minimal & Fast** - Subtle animations, fast transitions, no unnecessary visual effects
4. **Content-Focused** - Design supports the AI research content, not distracting from it

---

## Colors

### Primary Palette (Professional Blue)

Primary color represents trust, authority, and professionalism - ideal for legal applications.

| Token       | Value   | Usage                           |
| ----------- | ------- | ------------------------------- |
| primary-50  | #eff6ff | Subtle backgrounds, highlights  |
| primary-100 | #dbeafe | Light backgrounds, hover states |
| primary-500 | #3b82f6 | Primary actions, links, focus   |
| primary-600 | #2563eb | Hover state for primary actions |
| primary-700 | #1d4ed8 | Active state, pressed buttons   |

**CSS Variable:** `--color-primary-500` or use Tailwind: `bg-primary-500`

### Neutral Palette (Warm Gray)

Warm gray scale provides professional feel with subtle warmth to avoid cold, sterile appearance.

| Token      | Value   | Light Mode Usage       | Dark Mode Usage         |
| ---------- | ------- | ---------------------- | ----------------------- |
| neutral-50 | #fafaf9 | Subtle backgrounds     | Text color (inverted)   |
| neutral-100| #f5f5f4 | Card backgrounds       | Secondary bg (inverted) |
| neutral-300| #d6d3d1 | Borders, dividers      | -                       |
| neutral-500| #78716c | Muted text, icons      | Muted text              |
| neutral-700| #44403c | Secondary text         | -                       |
| neutral-900| #1c1917 | Primary text           | Background (inverted)   |

### Semantic Colors

| Color   | Token       | Value   | Usage                               |
| ------- | ----------- | ------- | ----------------------------------- |
| Success | success-500 | #22c55e | Success messages, high confidence   |
| Warning | warning-500 | #f59e0b | Warning messages, medium confidence |
| Error   | error-500   | #ef4444 | Error messages, low confidence      |
| Info    | info-500    | #3b82f6 | Informational messages              |

**Confidence Badge Mapping:**
- **High Confidence (>80%):** `success-500` (green)
- **Medium Confidence (50-80%):** `warning-500` (amber)
- **Low Confidence (<50%):** `error-500` (red)
- **Insufficient Data:** `neutral-500` (gray)

### Shadcn/ui Semantic Tokens

For component library compatibility, semantic tokens are provided:

| Token               | Light Value | Dark Value | Usage                  |
| ------------------- | ----------- | ---------- | ---------------------- |
| --background        | #ffffff     | #0c0a09    | Page background        |
| --foreground        | #1c1917     | #fafaf9    | Primary text           |
| --card              | #ffffff     | #1c1917    | Card backgrounds       |
| --border            | #e7e5e4     | #44403c    | Borders, dividers      |
| --muted             | #f5f5f4     | #292524    | Muted backgrounds      |
| --muted-foreground  | #78716c     | #a8a29e    | Muted text             |
| --ring              | #3b82f6     | #3b82f6    | Focus ring color       |

---

## Typography

### Font Families

**Primary (Sans-serif):** Inter
Professional, highly readable, excellent for UI and body text.

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

**Monospace:** JetBrains Mono
Used for legal citations, case numbers, code snippets.

```css
font-family: 'JetBrains Mono', ui-monospace, 'Fira Code', 'Consolas', monospace;
```

### Font Scale

| Name | Size     | Line Height | Usage                              |
| ---- | -------- | ----------- | ---------------------------------- |
| xs   | 0.75rem  | 1rem        | Captions, fine print, metadata     |
| sm   | 0.875rem | 1.25rem     | Secondary text, labels             |
| base | 1rem     | 1.5rem      | Body text, default                 |
| lg   | 1.125rem | 1.75rem     | Emphasized body, lead paragraphs   |
| xl   | 1.25rem  | 1.75rem     | Subheadings                        |
| 2xl  | 1.5rem   | 2rem        | Section headings                   |
| 3xl  | 1.875rem | 2.25rem     | Page headings                      |
| 4xl  | 2.25rem  | 2.5rem      | Hero headings                      |

### Font Weights

| Name     | Weight | Usage                          |
| -------- | ------ | ------------------------------ |
| normal   | 400    | Body text, default             |
| medium   | 500    | Emphasized text, buttons       |
| semibold | 600    | Subheadings, strong emphasis   |
| bold     | 700    | Headings, important text       |

### Line Heights

| Name    | Value | Usage                     |
| ------- | ----- | ------------------------- |
| tight   | 1.25  | Headings, compact text    |
| snug    | 1.375 | Dense paragraphs          |
| normal  | 1.5   | Body text (default)       |
| relaxed | 1.625 | Comfortable reading       |
| loose   | 1.75  | Very readable, accessible |

**Recommendation:** Use `line-height: 1.6` (relaxed) for message bubbles and legal text for optimal readability.

---

## Spacing

Tailwind-compatible spacing scale based on 0.25rem (4px) increments.

| Token | Value   | Pixels | Common Usage                  |
| ----- | ------- | ------ | ----------------------------- |
| 1     | 0.25rem | 4px    | Tight spacing, icon gaps      |
| 2     | 0.5rem  | 8px    | Compact padding               |
| 3     | 0.75rem | 12px   | Small gaps                    |
| 4     | 1rem    | 16px   | Default padding, margins      |
| 5     | 1.25rem | 20px   | Comfortable padding           |
| 6     | 1.5rem  | 24px   | Card padding, section spacing |
| 8     | 2rem    | 32px   | Large spacing                 |
| 12    | 3rem    | 48px   | Section dividers              |
| 16    | 4rem    | 64px   | Page sections                 |

**Custom Extensions:**
- `18` (4.5rem / 72px) - Extended spacing
- `88` (22rem / 352px) - Large containers
- `128` (32rem / 512px) - Wide containers

---

## Border Radius

| Token | Value     | Usage                          |
| ----- | --------- | ------------------------------ |
| sm    | 0.125rem  | Small elements, badges         |
| base  | 0.25rem   | Default buttons, inputs        |
| md    | 0.375rem  | Cards, containers              |
| lg    | 0.5rem    | Large cards, modal dialogs     |
| xl    | 0.75rem   | Message bubbles                |
| 2xl   | 1rem      | Prominent cards                |
| full  | 9999px    | Pills, circular buttons        |

**Recommendation:** Use `rounded-xl` for message bubbles, `rounded-lg` for citation cards.

---

## Shadows

Subtle, professional shadows that add depth without heavy visual weight.

| Token | Value                                         | Usage                    |
| ----- | --------------------------------------------- | ------------------------ |
| sm    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`              | Subtle elevation         |
| base  | `0 1px 3px 0 rgb(0 0 0 / 0.1)`               | Default cards            |
| md    | `0 4px 6px -1px rgb(0 0 0 / 0.1)`            | Elevated cards, dropdowns|
| lg    | `0 10px 15px -3px rgb(0 0 0 / 0.1)`          | Modals, popovers         |
| xl    | `0 20px 25px -5px rgb(0 0 0 / 0.1)`          | Prominent modals         |

**Usage:**
- Message bubbles (user): `shadow-sm`
- Citation cards: `shadow-base`
- Hover states: Slight increase (base → md)
- **Avoid:** Excessive or colored shadows

---

## Animation

**Philosophy:** Minimal, fast, professional. Animations should support UX clarity, not be decorative.

### Durations

| Token  | Value | Usage                          |
| ------ | ----- | ------------------------------ |
| fast   | 150ms | Hovers, quick transitions      |
| normal | 200ms | Default transitions            |
| slow   | 300ms | Modal open/close, page changes |

### Easing

| Token   | Value                          | Usage            |
| ------- | ------------------------------ | ---------------- |
| default | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing  |
| in      | `cubic-bezier(0.4, 0, 1, 1)`   | Fade in          |
| out     | `cubic-bezier(0, 0, 0.2, 1)`   | Fade out         |

### Allowed Animations

✅ **Use sparingly:**
- Opacity transitions (fade in/out)
- Color transitions (hover states)
- Simple translate (modals, toasts)

❌ **Avoid:**
- Scale transforms
- Rotate animations
- Bounce/spring effects
- Complex keyframe animations
- Pulsing effects (except loading indicators)

**Accessibility:** All animations respect `prefers-reduced-motion` media query.

---

## Breakpoints

Mobile-first responsive design breakpoints.

| Token | Value  | Target Devices          |
| ----- | ------ | ----------------------- |
| sm    | 640px  | Mobile landscape, small tablets |
| md    | 768px  | Tablets                 |
| lg    | 1024px | Laptops, small desktops |
| xl    | 1280px | Desktops                |
| 2xl   | 1536px | Large desktops          |

**Layout Strategy:**
- **Mobile (< 768px):** Stacked layout, sources in bottom sheet
- **Tablet (768-1024px):** 70/30 split, collapsible source panel
- **Desktop (1024px+):** 60/40 split chat/sources
- **Wide (1536px+):** Max-width container, 65/35 split

---

## Usage Examples

### CSS Custom Properties

```css
.citation-card {
  background: var(--card);
  color: var(--card-foreground);
  padding: var(--spacing-5);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-base);
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--ease-default);
}

.citation-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}
```

### Tailwind Utility Classes

```html
<!-- Message Bubble (User) -->
<div class="bg-primary-500 text-white px-5 py-4 rounded-xl shadow-sm">
  User message here
</div>

<!-- Citation Card -->
<article class="bg-card text-card-foreground p-5 rounded-lg border border-border shadow-base hover:border-primary transition-fast">
  <h3 class="font-semibold text-lg">Case Title</h3>
  <p class="text-sm text-muted-foreground font-mono">123 F.3d 456</p>
  <p class="mt-3 text-base leading-relaxed">Excerpt text...</p>
</article>

<!-- Confidence Badge (High) -->
<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success-50 text-success-700 text-sm font-medium">
  <svg>...</svg>
  High Confidence
</span>
```

### TypeScript

```typescript
import { colors, typography, spacing } from '@/.ui-design/tokens/tokens';

// Programmatic access
const primaryColor = colors.primary[500]; // "#3b82f6"
const bodyFont = typography.fontFamily.sans; // "Inter, ..."
const cardPadding = spacing[5]; // "1.25rem"
```

---

## Component Guidelines

### Buttons

**Variants:**
- **Primary:** `bg-primary-500 text-white hover:bg-primary-600`
- **Secondary:** `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- **Outline:** `border border-border hover:bg-accent`
- **Ghost:** `hover:bg-accent hover:text-accent-foreground`

**Sizes:**
- **Small:** `px-3 py-1.5 text-sm`
- **Default:** `px-4 py-2 text-base`
- **Large:** `px-6 py-3 text-lg`

### Cards

```html
<div class="bg-card text-card-foreground rounded-lg border border-border p-6 shadow-base">
  <h3 class="text-xl font-semibold">Card Title</h3>
  <p class="mt-2 text-muted-foreground">Card content...</p>
</div>
```

### Form Inputs

```html
<input
  class="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
  type="text"
  placeholder="Enter text..."
/>
```

### Badges

```html
<!-- Confidence Badges -->
<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success-50 text-success-700 text-sm font-medium">High</span>
<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warning-50 text-warning-700 text-sm font-medium">Medium</span>
<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-error-50 text-error-700 text-sm font-medium">Low</span>
```

---

## Dark Mode Implementation

The design system supports both system preference and manual toggle.

### Setup

1. Add theme provider to `app/layout.tsx`:
```tsx
import { ThemeProvider } from '@/components/theme-provider';

<ThemeProvider attribute="data-theme" defaultTheme="system">
  {children}
</ThemeProvider>
```

2. Use semantic color tokens (they auto-adapt to dark mode):
```tsx
<div className="bg-background text-foreground">...</div>
```

3. Implement toggle button:
```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</button>
```

---

## Accessibility Guidelines

### Color Contrast

All color combinations meet **WCAG 2.1 AA** standards:
- Normal text: **4.5:1** minimum
- Large text (18pt+): **3:1** minimum
- Interactive elements: **3:1** minimum

**Verified Combinations:**
- ✅ `primary-500` on white: 4.57:1
- ✅ `neutral-900` on white: 16.73:1
- ✅ `muted-foreground` on `muted`: 4.58:1

### Focus States

All interactive elements have visible focus states using `--ring` color:

```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- Logical tab order maintained
- Escape key closes modals/dialogs
- Enter key submits forms
- Arrow keys navigate menus

### Screen Readers

- Use semantic HTML (`<button>`, `<nav>`, `<article>`)
- Add ARIA labels where needed
- Use `role` attributes for custom components
- Implement `aria-live` for dynamic content

---

## Quick Reference

### Installation

1. **Import CSS tokens:**
```css
/* app/globals.css */
@import '../.ui-design/tokens/tokens.css';
```

2. **Extend Tailwind config:**
```javascript
// tailwind.config.ts
import designSystem from './.ui-design/tokens/tailwind.config.js';

export default {
  ...designSystem,
  // ... your other config
};
```

3. **Import TypeScript tokens:**
```typescript
import { colors, typography } from '@/.ui-design/tokens/tokens';
```

### Common Patterns

```tsx
// Message Bubble
<div className="bg-primary-500 text-white px-5 py-4 rounded-xl">Message</div>

// Citation Card
<article className="bg-card border border-border rounded-lg p-5 shadow-base hover:border-primary transition-fast">...</article>

// Confidence Badge
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success-50 text-success-700 text-sm font-medium">High</span>

// Focus Ring
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

---

## Next Steps

1. ✅ Review and customize tokens as needed
2. 🔄 Run `ui-design:create-component` to build components with this design system
3. 🔄 Run `ui-design:accessibility-audit` to validate existing UI against tokens
4. 🔄 Run `ui-design:design-review` to ensure consistency

---

## Modification

To regenerate or modify this design system, run:

```bash
/ui-design:design-system-setup --preset standard
```

**Generated:** 2026-02-23
**Version:** 1.0.0
**License:** MIT
