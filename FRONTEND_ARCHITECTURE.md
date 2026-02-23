# Frontend Architecture Documentation

## Overview

The Legal AI Research Assistant frontend is a production-grade Next.js 16 application built with React 19, TypeScript, and Tailwind CSS v3. It features a modern design system, comprehensive accessibility support (WCAG 2.1 Level AA), and professional UI polish.

**Tech Stack:**
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Language:** TypeScript 5.x (100% coverage)
- **Styling:** Tailwind CSS v3.4 + CSS Variables
- **Component Library:** Shadcn/ui (Radix UI primitives)
- **State Management:** React Hooks + Context
- **Notifications:** Sonner
- **Theme:** next-themes
- **Icons:** Lucide React

---

## Design System

### Color Palette

**Primary Colors:**
```typescript
primary: {
  50: "#eff6ff",   // Lightest blue
  500: "#3b82f6",  // Base primary (trust, authority)
  700: "#1d4ed8",  // Darker blue
  DEFAULT: "#3b82f6"
}
```

**Semantic Colors:**
```typescript
success: "#22c55e",  // High confidence, positive actions
warning: "#f59e0b",  // Medium confidence, caution
error: "#ef4444",    // Low confidence, destructive actions
info: "#3b82f6"      // Informational messages
```

**Neutral Grays (Warm):**
- Stone-based palette for softer, warmer feel
- Full scale from 50 (lightest) to 950 (darkest)
- Used for backgrounds, borders, text

### Typography

**Font Families:**
- **UI Text:** Inter (400, 500, 600, 700 weights)
  - Excellent readability for legal content
  - Optimized with `next/font` for performance
- **Monospace:** JetBrains Mono (citations, code)
  - Clear distinction for legal citations
  - Accessible character spacing

**Type Scale:**
```typescript
xs: "0.75rem",    // 12px - Captions, labels
sm: "0.875rem",   // 14px - Secondary text
base: "1rem",     // 16px - Body text
lg: "1.125rem",   // 18px - Emphasized body
xl: "1.25rem",    // 20px - Subheadings
2xl: "1.5rem",    // 24px - Headings
```

### Spacing System

Linear scale with 4px base unit:
```typescript
1: "0.25rem",   // 4px
2: "0.5rem",    // 8px
4: "1rem",      // 16px (default)
6: "1.5rem",    // 24px
8: "2rem",      // 32px
```

### Shadow System

Subtle depth with minimal shadows:
```typescript
sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
```

### Dark Mode

**Implementation:**
- CSS variables for semantic tokens (background, foreground, border, etc.)
- Manual toggle with localStorage persistence
- next-themes provider
- Smooth transitions (200ms duration)

**Color Mappings:**
```css
[data-theme="dark"] {
  --background: 0 0% 7%;      /* Near black */
  --foreground: 0 0% 98%;     /* Near white */
  --primary: 217 91% 60%;     /* Adjusted blue */
  --muted: 0 0% 15%;          /* Dark gray */
}
```

---

## Component Architecture

### Directory Structure

```
frontend/
├── app/
│   ├── page.tsx              # Main application page ⭐
│   ├── layout.tsx            # Root layout with providers
│   ├── globals.css           # Global styles + CSS variables
│   └── favicon.ico
├── components/
│   ├── ui/                   # Shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── tooltip.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── switch.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── sheet.tsx
│   │   └── textarea.tsx
│   ├── ChatPanel.tsx         # Chat interface ⭐
│   ├── MessageBubble.tsx     # Individual messages
│   ├── CitationCard.tsx      # Citation display
│   ├── ConfidenceBadge.tsx   # Confidence scoring
│   ├── SourceViewer.tsx      # Retrieved sources
│   ├── ScrollToBottomButton.tsx  # Phase 6 ⭐
│   ├── ExportChatDialog.tsx      # Phase 6 ⭐
│   ├── ClearChatDialog.tsx       # Phase 6 ⭐
│   ├── ErrorBoundary.tsx         # Phase 6 ⭐
│   ├── KeyboardShortcutsDialog.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── hooks/
│   └── useKeyboardShortcuts.ts   # Global shortcuts ⭐
├── lib/
│   ├── api.ts                # API client
│   ├── utils.ts              # cn() helper
│   └── constants.ts          # App constants
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## Core Components

### 1. ChatPanel (`components/ChatPanel.tsx`)

**Purpose:** Main chat interface with message display and input

**Props:**
```typescript
interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onSelectMessage?: (message: Message) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}
```

**Features:**
- Auto-scroll to bottom on new messages
- ARIA live region for screen readers (`role="log"`, `aria-live="polite"`)
- Character counter (2000 char limit)
- Empty state with example questions
- Loading skeleton during API calls
- Scroll-to-bottom button (Phase 6)

**State Management:**
- Local input state
- Message end ref for auto-scrolling
- Container ref for scroll detection

---

### 2. MessageBubble (`components/MessageBubble.tsx`)

**Purpose:** Display individual chat messages with metadata

**Props:**
```typescript
interface MessageBubbleProps {
  message: Message;
  onSelectMessage?: (message: Message) => void;
}
```

**Features:**
- User vs. Assistant styling
- Copy-to-clipboard button (hover-triggered)
- Confidence badge for assistant messages
- Citation count display
- Timestamp display
- Click to view sources (assistant messages)

**Visual Design:**
- User messages: Primary blue background, right-aligned
- Assistant messages: Card background, left-aligned, border
- Hover states: Shadow lift, copy button reveal

---

### 3. CitationCard (`components/CitationCard.tsx`)

**Purpose:** Display legal citations with metadata

**Props:**
```typescript
interface CitationCardProps {
  citation: Citation;
  index: number;
}
```

**Features:**
- Case name, citation, court, date
- Expandable excerpts (>200 chars)
- Copy citation button
- Link to CourtListener
- Hover effects (border color change)

**Layout:**
```
┌─────────────────────────────────────┐
│ [Icon] 1. Case Name      [Copy]     │
│        Citation Number              │
├─────────────────────────────────────┤
│ Court Name                          │
│ Date                                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ "Excerpt text..."               │ │
│ │ [Show more]                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [View on CourtListener →]          │
└─────────────────────────────────────┘
```

---

### 4. ConfidenceBadge (`components/ConfidenceBadge.tsx`)

**Purpose:** Visual confidence indicator with tooltip

**Props:**
```typescript
interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
  percentage?: number;
}
```

**Configuration:**
```typescript
{
  high: {
    icon: CheckCircle,
    className: 'bg-success-50 text-success-700',
    label: 'High Confidence',
    description: 'Strong supporting evidence from multiple sources'
  },
  medium: {
    icon: AlertCircle,
    className: 'bg-warning-50 text-warning-700',
    label: 'Medium Confidence',
    description: 'Moderate supporting evidence'
  },
  low: {
    icon: AlertTriangle,
    className: 'bg-error-50 text-error-700',
    label: 'Low Confidence',
    description: 'Limited supporting evidence'
  },
  insufficient: {
    icon: XCircle,
    className: 'bg-neutral-50 text-neutral-700',
    label: 'Insufficient Data',
    description: 'Not enough evidence to support answer'
  }
}
```

---

### 5. SourceViewer (`components/SourceViewer.tsx`)

**Purpose:** Display retrieved document chunks

**Props:**
```typescript
interface SourceViewerProps {
  chunks: RetrievedChunk[];
}
```

**Features:**
- Match score badges (color-coded)
- Case metadata display
- Custom scrollbar (ScrollArea)
- Empty state
- Card-based layout

**Score Color Coding:**
- ≥80%: Success green
- ≥60%: Warning amber
- <60%: Neutral gray

---

## Phase 6 Components

### 6. ScrollToBottomButton (`components/ScrollToBottomButton.tsx`)

**Purpose:** Floating button to quickly return to latest message

**Props:**
```typescript
interface ScrollToBottomButtonProps {
  containerRef: React.RefObject<HTMLDivElement>;
  messagesCount: number;
}
```

**Behavior:**
- Shows when scrolled >200px from bottom
- Smooth scroll animation
- Circular floating button
- Fade in/out with translate transform
- Positioned absolute (bottom-4 right-4)

**Implementation Details:**
```typescript
// Scroll detection
const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
setIsVisible(distanceFromBottom > 200);

// Smooth scroll
containerRef.current?.scrollTo({
  top: containerRef.current.scrollHeight,
  behavior: 'smooth'
});
```

---

### 7. ExportChatDialog (`components/ExportChatDialog.tsx`)

**Purpose:** Export conversation history

**Props:**
```typescript
interface ExportChatDialogProps {
  messages: Message[];
}
```

**Export Formats:**

**Text (.txt):**
```
[2026-02-23 12:00:00] You:
What is contract consideration?

[2026-02-23 12:00:05] Assistant:
Contract consideration requires...

Citations:
  1. Smith v. Jones - 123 Cal.4th 456

Confidence: high

---
```

**JSON (.json):**
```json
{
  "exportedAt": "2026-02-23T12:00:00Z",
  "messageCount": 10,
  "messages": [{
    "role": "user",
    "content": "What is contract consideration?",
    "timestamp": "2026-02-23T12:00:00Z",
    "confidence": null,
    "citations": null
  }]
}
```

**Features:**
- Two format options with visual cards
- Disabled when no messages
- Toast notifications
- Blob API for downloads
- Automatic filename with date

---

### 8. ClearChatDialog (`components/ClearChatDialog.tsx`)

**Purpose:** Confirm before clearing conversation

**Props:**
```typescript
interface ClearChatDialogProps {
  onClearChat: () => void;
  messageCount: number;
}
```

**Features:**
- Warning icon and destructive styling
- Dynamic message count display
- Pluralization ("1 message" vs "2 messages")
- Cancel button
- Toast confirmation on success
- Disabled when no messages

---

### 9. ErrorBoundary (`components/ErrorBoundary.tsx`)

**Purpose:** Gracefully handle component crashes

**Features:**
- Catches React component errors
- User-friendly error display
- "Try Again" (resets boundary)
- "Reload Page" (full refresh)
- Stack trace in development mode
- Collapsible details section
- Error logging to console

**UI Structure:**
```
┌─────────────────────────────────────┐
│ [⚠️] Something went wrong           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Error message                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📋 Stack trace (development)        │
│                                     │
│ ℹ️  This error has been logged     │
│                                     │
│ [Try Again]  [Reload Page]         │
└─────────────────────────────────────┘
```

---

## Hooks

### useKeyboardShortcuts (`hooks/useKeyboardShortcuts.ts`)

**Purpose:** Global keyboard shortcuts

**Interface:**
```typescript
interface KeyboardShortcuts {
  onFocusInput?: () => void;
  onToggleTheme?: () => void;
  onShowHelp?: () => void;
  onEscape?: () => void;
}
```

**Shortcuts:**
- `Ctrl/Cmd + K` - Focus input field
- `Ctrl/Cmd + D` - Toggle dark mode
- `Ctrl/Cmd + /` - Show keyboard shortcuts help
- `Escape` - Close dialogs (when not in input)

**Implementation:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMod = e.ctrlKey || e.metaKey;  // Mac vs Windows
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    // Handle shortcuts...
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [callbacks]);
```

---

## State Management

### Application State (`app/page.tsx`)

**State Variables:**
```typescript
const [sessionId, setSessionId] = useState<string>('');
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
const [showShortcuts, setShowShortcuts] = useState(false);
```

**Session Management:**
- UUID v4 for session IDs
- Generated on mount
- Regenerated on chat clear
- Sent with every API request

**Message Flow:**
1. User types message → ChatPanel
2. `handleSendMessage()` called in page.tsx
3. Add user message to state (optimistic update)
4. API call with conversation history
5. Add assistant message to state
6. Auto-select message to show citations

---

## API Integration

### API Client (`lib/api.ts`)

**Base Configuration:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

**Functions:**
```typescript
// Main chat endpoint
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// Health check
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
```

**Error Handling:**
- Try/catch in page.tsx
- Toast notifications for errors
- Error messages in chat
- Connection error detection

---

## Accessibility (WCAG 2.1 Level AA)

### Compliance Checklist

#### Perceivable
- ✅ Color contrast 4.5:1 for all text
- ✅ Alternative text for all icons (aria-labels)
- ✅ Semantic HTML structure
- ✅ Clear visual hierarchy

#### Operable
- ✅ Full keyboard navigation
- ✅ Keyboard shortcuts documented
- ✅ No keyboard traps
- ✅ Visible focus indicators
- ✅ Logical tab order

#### Understandable
- ✅ Clear labels and instructions
- ✅ Predictable behavior
- ✅ Error messages with guidance
- ✅ Consistent navigation

#### Robust
- ✅ Valid HTML
- ✅ Proper ARIA usage
- ✅ Compatible with assistive tech
- ✅ No parsing errors

### ARIA Implementation

**ChatPanel:**
```tsx
<div
  role="log"
  aria-live="polite"
  aria-atomic="false"
  aria-label="Conversation messages"
>
```

**Input:**
```tsx
<Input
  aria-label="Legal research question input"
  aria-describedby="char-count"
  aria-invalid={input.length > MAX_MESSAGE_LENGTH}
/>
```

**Buttons:**
```tsx
<Button aria-label="Scroll to bottom">
  <ArrowDown />
</Button>
```

---

## Performance Optimizations

### Bundle Size
- **Tree-shaking:** Shadcn components are tree-shakeable
- **Code splitting:** Next.js automatic route-based splitting
- **Font optimization:** next/font with automatic subsetting

### Rendering
- **Minimal re-renders:** Proper useEffect dependencies
- **Efficient conditionals:** Short-circuit evaluation
- **Memoization opportunities:** React.memo for MessageBubble if needed

### Asset Loading
- **Fonts:** Preloaded with next/font
- **Icons:** SVG components (lucide-react)
- **No images:** Pure CSS/SVG design

---

## Testing Strategy

### Component Testing
```typescript
// Example: MessageBubble.test.tsx
describe('MessageBubble', () => {
  it('renders user message with correct styling', () => {
    // Test user vs assistant styling
  });

  it('shows copy button on hover', () => {
    // Test hover interaction
  });

  it('displays confidence badge for assistant', () => {
    // Test badge rendering
  });
});
```

### Accessibility Testing
- **Tools:** axe DevTools, Lighthouse
- **Manual:** Screen reader testing (NVDA, VoiceOver)
- **Automated:** jest-axe in component tests

---

## Build & Deployment

### Build Command
```bash
npm run build
```

**Output:**
- Static assets in `.next/`
- Optimized JavaScript bundles
- Minified CSS
- Font subsetting

### Environment Variables

**Required:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.com
```

**Optional:**
```env
NEXT_PUBLIC_ANALYTICS_ID=...
```

---

## Future Enhancements

### Planned Features
- [ ] React.memo for MessageBubble (if >100 messages)
- [ ] Virtual scrolling (react-window) for large lists
- [ ] Message search/filter
- [ ] Citation highlighting in text
- [ ] Conversation history sidebar
- [ ] Print-friendly view

### Performance Optimizations
- [ ] Service worker for offline support
- [ ] Streaming responses with Server-Sent Events
- [ ] Optimistic UI updates
- [ ] Request deduplication

---

## Developer Guide

### Adding a New Component

1. **Create component file:**
   ```bash
   touch frontend/components/MyComponent.tsx
   ```

2. **Use TypeScript interface:**
   ```typescript
   interface MyComponentProps {
     data: string;
     onAction: () => void;
   }
   ```

3. **Follow naming conventions:**
   - PascalCase for components
   - camelCase for functions/variables
   - SCREAMING_SNAKE_CASE for constants

4. **Use design tokens:**
   ```tsx
   <div className="bg-primary-500 text-white p-4 rounded-lg">
   ```

5. **Add accessibility:**
   ```tsx
   <button aria-label="Descriptive label">
   ```

### Styling Guidelines

**Use Tailwind classes:**
```tsx
// ✅ Good
<div className="flex items-center gap-2 p-4">

// ❌ Avoid inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

**Use cn() for conditional classes:**
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-class'
)}>
```

---

## Contributing

### Code Style
- **Prettier:** Auto-format on save
- **ESLint:** Follow React best practices
- **TypeScript:** Strict mode enabled

### Commit Convention
```
feat: Add export chat dialog
fix: Resolve scroll-to-bottom bug
docs: Update component documentation
style: Format with Prettier
refactor: Extract download utility
```

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Shadcn/ui:** https://ui.shadcn.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Last Updated:** 2026-02-23
**Version:** 1.0.0 (Phase 6 Complete)
