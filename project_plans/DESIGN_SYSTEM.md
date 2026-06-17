# SnehoAyu Design System & UI Constitution
**Version:** 2.0.0  
**Scope:** Mobile-First Progressive Web App (PWA) for Pediatric & Neonatal Care  

---

## 1. DESIGN PHILOSOPHY

### 1.1. Brand Personality
SnehoAyu's brand personality resides at the intersection of **Affectionate Care** (স্নেহ - affection) and **Scientific Longevity** (আয়ু - longevity). It is characterized by three core pillars:
*   **The Gentle Guide:** Approached as a supportive, empathetic companion rather than a sterile medical machine.
*   **Clinical Precision:** Scientific, rigorous, and accurate, instilling absolute trust in medical data.
*   **Minimalist Calm:** Clutter-free and quiet, respecting the high-stress, sleep-deprived reality of neonatal parents.

```
                  [ EMOTIONAL BALANCE ]
       Affectionate Care  ◄─────────►  Clinical Precision
       (Warmth, Empathy,               (Rigorous, Trustworthy,
        Calming Visuals)                Structured Data)
```

### 1.2. Emotional Goals
Our target users (mothers of preterm infants, nurses, and researchers) operate in high-anxiety environments. The UI must actively lower cognitive load and heart rate.

| User State Before Using App | Target State After Using App | Visual / Interaction Enablers |
| :--- | :--- | :--- |
| **Anxious & Panicked** | **Calm & In Control** | Generous whitespace, soft green/teal tones, clear hierarchy |
| **Overwhelmed by Data** | **Confident & Directed** | Standardized biometrics cards, single primary action per screen |
| **Sleepless & Fatigued** | **Supported & Connected** | Dark mode optimization, high-contrast text sizes, large touch zones |
| **Isolated / Alone** | **Empowered & Guided** | Friendly Bengali-first copy, supportive micro-interactions |

### 1.3. Design Principles
1.  **Calm by Default:** Every layout choice should reduce noise. If a detail does not actively assist the user, omit it.
2.  **Human First, Clinical Second:** Use biological, organic rounded shapes (24px corner radii, smooth curves) instead of rigid clinical corners.
3.  **Radical Clarity:** Critical health statuses (breathing, temperature, feeding) must be recognizable within 500 milliseconds from 1 meter away.
4.  **Bengali-First Inclusivity:** The system is optimized around the curves and line heights of Bengali script, ensuring hindi and english fallbacks scale naturally without layout breaks.

### 1.4. Interaction Principles
*   **No Accidental Triggers:** Critical actions (like log submissions or phone dials) require confirmation sheets or slide-to-act gestures.
*   **Generous Target Forgiveness:** Preterm mothers often operate the app one-handed while holding their baby. Active regions must be larger than standard guidelines.
*   **Immediate Reassurance:** Every backend write or status modification must trigger a subtle haptic-aligned micro-interaction or transition, indicating the system is watching out for them.

---

## 2. VISUAL DIRECTION

### 2.1. Overall Design Language
Our visual direction is termed **Soft Precision**. It combines flat, visual-noise-free, solid minimalist card designs with the high-contrast readability of *Linear* and *Apple Health*, using a soft, life-affirming color palette.

```
┌────────────────────────────────────────────────────────┐
│  SOFT PRECISION VISUAL STACK                            │
├────────────────────────────────────────────────────────┤
│  1. Surface Base: Solid White / Slate 950 (No Blurs)   │
│  2. Borders: Fine 1px Slate 200 / Slate 800            │
│  3. Flat Geometry: Fluid, high-radius curves (12-24px) │
│  4. Zero Mud: Flat layouts optimize readability       │
└────────────────────────────────────────────────────────┘
```

### 2.2. Modern Minimalism Rules
*   **No Glassmorphism:** To prevent visual noise, glare, and rendering delay for sleep-deprived mothers in dark hospital rooms, transparency overlays and glassmorphic blurs are forbidden. Card backgrounds must be solid.
*   **Max 2 Font Weights Per View:** Use only *Regular* and *Bold* (or *Semibold*). Omit light or medium variants in text blocks to maintain a high contrast ratio.
*   **Structural Division:** Never use dark background blocks to divide content. Use fine 1px borders or whitespace.
*   **No Muddy Shadows:** Shadows must be extremely light or replaced entirely with flat borders to prioritize contrast and crisp readability.

### 2.3. Healthcare-Specific Design Rules
*   **De-escalate Red Alert Statuses:** Do not use screaming red screens for alert states. Use soft amber or warning layouts with clear instructions, preventing immediate panic.
*   **No Standalone Icons for Biometrics:** Any biometric metric (e.g., heart rate, oxygen levels) must display its metric value, its unit (e.g., bpm, %), and a textual evaluation (e.g., "Normal", "Requires Attention"). Never rely on icons alone.

### 2.4. Whitespace Philosophy
*   Whitespace is an active design element, not "unused space."
*   **The 60-30-10 Rule:**
    *   **60%** of the screen area must be allocated to whitespace, background grids, and separation margins.
    *   **30%** is allocated to content, data displays, and typography.
    *   **10%** is allocated to focal interactive elements (buttons, primary forms).

### 2.5. Information Density
*   **Consumer/Mother Screens:** Extremely low density. Max 3 interactive components or data widgets per viewport.
*   **Nurse/Researcher Screens:** Medium density. Allow structured data tables with fine borders, but enforce page scrolling over horizontally condensed grids.

---

## 3. COLOR SYSTEM

We utilize semantic color tokens that automatically adapt based on light and dark mode selectors, eliminating manual dark prefix classes.

### 3.1. Core Brand Colors
*   **Primary (Teal - Clinical Care):** Represents medical professionalism, calm, and security.
*   **Secondary (Rose - Neonatal Love):** Represents the mother-baby connection, breastmilk feeding, and skin-to-skin care.

```
 Primary (Teal)               Secondary (Rose)
 ┌──────────────┐             ┌──────────────┐
 │   #0f766e    │             │   #f43f5e    │
 └──────────────┘             └──────────────┘
```

### 3.2. Semantic Tokens Configuration
These tokens are defined inside the Tailwind v4 theme block. In dark mode, their raw hex values swap automatically.

| CSS Variable | Light Mode Hex | Dark Mode Hex | Functional Description |
| :--- | :--- | :--- | :--- |
| `--color-background` | `#f8fafc` | `#090d16` | App background |
| `--color-surface` | `#ffffff` | `#0e1526` | Card and sheet surface |
| `--color-border` | `#e2e8f0` | `#1e293b` | 1px borders and dividers |
| `--color-text` | `#0f172a` | `#f8fafc` | Titles and primary body copy |
| `--color-text-muted` | `#64748b` | `#94a3b8` | Subtitles, helper text, captions |
| `--color-primary` | `#0f766e` | `#14b8a6` | Core interactive actions (Teal) |
| `--color-primary-foreground`| `#ffffff`| `#090d16` | Text on primary brand items |
| `--color-secondary` | `#f43f5e` | `#fb7185` | Specialized highlights, feed tracking (Rose) |
| `--color-secondary-foreground`| `#ffffff`| `#090d16`| Text on secondary brand items |
| `--color-success` | `#059669` | `#34d399` | Normal status checks (Emerald) |
| `--color-warning` | `#d97706` | `#fbbf24` | Review metrics (Amber) |
| `--color-error` | `#dc2626` | `#f87171` | Warning, critical vitals (Red) |
| `--color-info` | `#2563eb` | `#60a5fa` | Educational updates (Blue) |

---

## 4. TYPOGRAPHY SYSTEM

We restrict loading to two fonts to optimize load times over slow or unstable Indian mobile networks:
1.  **Hind Siliguri** (Primary Font): Covers both Bengali and Latin (English) characters elegantly, ensuring a unified sans-serif face for headlines, prose, and navigation.
2.  **Inter** (Technical/Number Font): High legibility grid face, used exclusively for technical logs, numeric biometrics, and tabular data.

### 4.1. Fonts Configuration
```css
--font-sans: "Hind Siliguri", system-ui, -apple-system, sans-serif;
--font-mono: "Inter", monospace;
```

### 4.2. Typography Scale
Enforced line heights are 10-15% higher than standard to accommodate Bengali vowel signs (যেমন: ি, ী, ু, ূ) without text clipping.

```
Scale Hierarchy
┌──────────────────────────────────────────────┐
│  DISPLAY (36px / LH 1.3)                     │
├──────────────────────────────────────────────┤
│  HEADING 1 (28px / LH 1.35)                  │
├──────────────────────────────────────────────┤
│  HEADING 2 (22px / LH 1.4)                   │
├──────────────────────────────────────────────┤
│  HEADING 3 (18px / LH 1.45)                  │
├──────────────────────────────────────────────┤
│  BODY LARGE (16px / LH 1.6)                  │
├──────────────────────────────────────────────┤
│  BODY REGULAR (14px / LH 1.6)                │
├──────────────────────────────────────────────┤
│  CAPTION (12px / LH 1.5)                     │
└──────────────────────────────────────────────┘
```

| Token | Size (px) | Size (rem) | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `font-display` | 36px | 2.25rem | 1.3 | 800 (ExtraBold) | Biometric value displays, heroes |
| `font-h1` | 28px | 1.75rem | 1.35 | 700 (Bold) | Main screen titles, header roots |
| `font-h2` | 22px | 1.375rem | 1.4 | 600 (SemiBold) | Card titles, group section headers |
| `font-h3` | 18px | 1.125rem | 1.45 | 600 (SemiBold) | Small card titles, fields headers |
| `font-body-lg`| 16px | 1.0rem | 1.6 | 400 (Regular) | Introductory summaries, descriptions |
| `font-body` | 14px | 0.875rem | 1.6 | 400 (Regular) | Primary inputs, main text paragraphs |
| `font-caption`| 12px | 0.75rem | 1.5 | 500 (Medium) | Small metadata, secondary labels |
| `font-micro` | 10px | 0.625rem | 1.4 | 600 (SemiBold) | Fine-print timestamps, table headers |

---

## 5. SPACING SYSTEM

We run on a strict **4px Grid System**. Every spacing scale value must be a multiple of 4.

```
4px Grid Building Blocks
█   [4px]
██  [8px]
████[16px]
████████[32px]
```

### 5.1. Spacing Scale

| Value | Rem Equivalent | Token Name | Application |
| :--- | :--- | :--- | :--- |
| **4px** | `0.125rem` | `space-1` | Micro adjustments, card border-offset |
| **8px** | `0.25rem` | `space-2` | Inner button elements, label-to-input gap |
| **12px** | `0.375rem` | `space-3` | Tight lists, icon and text pairings |
| **16px** | `0.5rem` | `space-4` | Card inner margins, component-to-component stack |
| **20px** | `0.625rem` | `space-5` | Medium container padding, list item gaps |
| **24px** | `0.75rem` | `space-6` | Main screen padding, card-to-card gaps |
| **32px** | `1.0rem` | `space-8` | Outer desktop wrappers, hero sections |
| **48px** | `1.5rem` | `space-12` | Bottom sheet spacers, empty state cushions |
| **64px** | `2.0rem` | `space-16` | Header height spacer, auth screen cushions |

### 5.2. Spacing Rules
*   **Screen Padding:** Mobile screens MUST use exactly `space-5` (20px) or `space-6` (24px) for left/right margins. Do not use 16px (feels crowded) or 32px (wasteful on small panels).
*   **Card Internal Padding:** MUST be `space-4` (16px) for small detail cards, and `space-5` (20px) for parent dashboards.
*   **Form Stack Spacing:** Vertical gap between input fields must be exactly `space-5` (20px).

---

## 6. COMPONENT SYSTEM (SHADCN/UI & VAUL INTEGRATION)

Rather than writing components from scratch, we configure, extend, and override **shadcn/ui** default mappings.

### 6.1. CSS Variable Overrides
Include this in your `src/index.css` root declaration to bind shadcn/ui components (`Button`, `Input`, `Card`, `Dialog`) directly to our semantic color tokens:

```css
:root {
  --radius: 0.75rem; /* 12px input border-radius */
  
  --background: var(--color-background);
  --foreground: var(--color-text);
  
  --card: var(--color-surface);
  --card-foreground: var(--color-text);
  
  --popover: var(--color-surface);
  --popover-foreground: var(--color-text);
  
  --primary: var(--color-primary);
  --primary-foreground: var(--color-primary-foreground);
  
  --secondary: var(--color-secondary);
  --secondary-foreground: var(--color-secondary-foreground);
  
  --muted: var(--color-background);
  --muted-foreground: var(--color-text-muted);
  
  --accent: var(--color-background);
  --accent-foreground: var(--color-primary);
  
  --destructive: var(--color-error);
  --destructive-foreground: #ffffff;
  
  --border: var(--color-border);
  --input: var(--color-border);
  --ring: var(--color-primary);
}
```

### 6.2. Buttons (shadcn button extension)
*   **Purpose:** Action triggers.
*   **Sizing:** Mobile touch-target is locked to height `h-13` (52px). On desktop it can scale to `h-10` (40px).
*   **Variants Mapping:**
    *   `default` / `primary`: Teal solid (`bg-primary text-primary-foreground`).
    *   `secondary`: Rose solid (`bg-secondary text-secondary-foreground`).
    *   `outline`: Bordered gray/teal (`border border-border bg-transparent text-text`).
*   **States:** Default transition enabled, active tap scales down slightly (`active:scale-[0.99]`). Focus visible ring outline.

### 6.3. Inputs
*   **Purpose:** Freeform or number data entry.
*   **Sizing:** Height locked to `h-13` (52px), rounded `rounded-xl` (12px).
*   **Focus Ring:** Border transitions to teal with a soft shadow: `focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10`.

### 6.4. Mobile Bottom Sheets (Vaul Integration)
For mobile dropdown triggers, modals, option selectors, and biometrics forms, we use **Vaul** (built by the shadcn author).

*   **Implementation Rules:**
    *   Must attach a drag grab handle: centered, `w-10 h-1 rounded-full bg-border` (40px x 4px).
    *   Transition easing must follow `--animate-sheet-up` (`slide-up 250ms cubic-bezier(0.16, 1, 0.3, 1)`).
    *   Must implement the background scaling animation (`vaul-scale-background`) to push the parent viewport back slightly when the sheet is active.
    *   Accessibility: Ensure focus lock remains inside the sheet when active, and backdrop overlay opacity matches `bg-black/40`.

*   **React Implementation Sample:**
    ```jsx
    import { Drawer } from 'vaul';

    export const MobileSheet = ({ trigger, title, children }) => (
      <Drawer.Root shouldScaleBackground>
        <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-surface border-t border-border flex flex-col rounded-t-[24px] h-fit max-h-[85vh] fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto outline-none">
            <div className="p-4 bg-surface rounded-t-[24px] flex-1">
              {/* Drag grab handle */}
              <div className="mx-auto w-10 h-1 rounded-full bg-border mb-6" />
              <Drawer.Title className="text-h2 font-semibold mb-2">{title}</Drawer.Title>
              <div className="mt-4">{children}</div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
    ```

---

## 7. MOBILE-FIRST RULES

Since SnehoAyu targets mothers and clinical staff, all UI components must be optimized for active mobile environments.

```
                [ MOBILE COMFORT ZONE ]
          ┌──────────────────────────────────┐
          │  Top Zone (20%):                 │
          │  Status only (Hard to reach)     │
          ├──────────────────────────────────┤
          │  Middle Zone (40%):              │
          │  Data Displays, Informational    │
          ├──────────────────────────────────┤
          │  Comfort Zone (40%):             │
          │  PRIMARY ACTIONS, Inputs,        │
          │  Tabs, Submit Buttons            │
          └──────────────────────────────────┘
```

### 7.1. Tap & Touch Specifications
*   **Touch Targets:** Every interactive element must possess a bounding zone of at least **48px x 48px** to support fast or distracted tapping.
*   **Gap Threshold:** Adjacent touch targets must be separated by a minimum of 8px to prevent double-tap misfires.

### 7.2. Viewport Layout Constraints
*   **Width Boundaries:** The layout is locked to a centered wrapper of `max-w-md` (448px) on desktop viewports. This matches the exact visual density of mobile screens and preserves layout architecture.
*   **Safe Areas:** Elements mounted at the absolute top or bottom of the screen must include CSS safe-area-insets to ensure content is not clipped by device notches:
    ```css
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    ```

---

## 8. ACCESSIBILITY RULES (WCAG 2.2 COMPLIANT)

### 8.1. Contrast & Sizing
*   **Contrast Ratios:** 
    *   Body text and titles must maintain a contrast ratio of at least **4.5:1** against backgrounds.
    *   Vitals and health alerts must maintain at least **7.0:1** (WCAG AAA) for maximum visibility in dark wards or direct sunlight.
*   **Minimum Font Sizes:**
    *   No UI text may scale below **12px**.
    *   Body copy must be at least **14px**.

### 8.2. Interactive Announcers
*   **Focus Rings:** Enforce a highly visible border focus outline. Invisible focus is a critical UI violation.
*   **Screen Readers:** Maintain logical heading hierarchies (`<h1>` -> `<h2>` -> `<h3>`). Do not use headings for styling purposes.
*   **Low-Literacy & Clinical Scenarios:**
    *   Do not rely on color alone to communicate state. Combine colors with clear icon markers (e.g., a green checkmark for normal, an orange caution triangle for warnings).
    *   Display numeric biometrics alongside clear text statuses (যেমন: "স্বাভাবিক" / "Normal").

---

## 9. MOTION SYSTEM

Motion must feel smooth and light, never distracting or delayed.

### 9.1. Transitions & Easings
We use custom transition timings for UI actions to achieve Stripe/Linear-like responsiveness:

```javascript
// Timing Configurations
const DURATION_FAST = '150ms';  // Micro-interactions, checkboxes, taps
const DURATION_NORMAL = '250ms'; // Sheets sliding up, page route entries
const DURATION_SLOW = '400ms';   // Complex onboarding slide decks

// Easing Eases
const EASE_ENTRANCE = 'cubic-bezier(0.16, 1, 0.3, 1)';  // Linear-out, fast start
const EASE_EXIT = 'cubic-bezier(0.7, 0, 0.84, 0)';       // Linear-in, fast end
```

### 9.2. Forbidden Animations
*   **No Infinite Spins:** Loading icons must not spin indefinitely. Use gentle pulsing animations.
*   **No Heavy Bounces:** Elements must not bounce, shake, or perform layout-shifting translations.
*   **No Auto-Scrolls:** The page view must never scroll programmatically without explicit user input.

---

## 10. PAGE TEMPLATES

To maintain strict visual layout structures, use the following layout wireframes.

### 10.1. Onboarding & Registration Layout
```
┌──────────────────────────────────────────┐
│  [Back Arrow]             [Progress Bar] │
├──────────────────────────────────────────┤
│                                          │
│  (Large Heading)                         │
│  How old is your baby?                   │
│                                          │
│  (Calming Input Field)                   │
│  [ Enter Weeks ... ]                     │
│                                          │
│                                          │
│                                          │
│  [Primary Action Button]                 │
└──────────────────────────────────────────┘
```

### 10.2. Dashboard Layout
```
┌──────────────────────────────────────────┐
│  [Patient Selector]     [Status Indicator]│
├──────────────────────────────────────────┤
│  Welcome back, Maya                      │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ PRIMARY METRIC CARD (Weight)       │  │
│  │ 1.85 kg  (Normal Gain)             │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌──────────────────┐ ┌────────────────┐  │
│  │ Secondary Metric │ │ Secondary Metric│  │
│  │ Temp: 36.8°C     │ │ Feed: 2 hrs ago│  │
│  └──────────────────┘ └────────────────┘  │
│                                          │
│  [🔔 Action Alert: Next Vaccine Due]    │
├──────────────────────────────────────────┤
│  [🏠 Home]    [📊 Logs]     [⚙️ Settings]│
└──────────────────────────────────────────┘
```

### 10.3. Emergency Screen Layout
```
┌──────────────────────────────────────────┐
│  [Close Screen Button]                   │
├──────────────────────────────────────────┤
│                                          │
│  🚨 Warning Alert                        │
│  Low Oxygen Level Detected               │
│  (54% / Under normal levels)             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ EMERGENCY CALL ACTION              │  │
│  │ Call Neonatal Specialist           │  │
│  │ [ +91 XXXXX XXXXX ]                │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Step 1: Lay the baby flat          │  │
│  │ Step 2: Clear breathing airway     │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 11. AI DEVELOPMENT RULES

Future AI coding agents modifying SnehoAyu must comply with this UI constitution.

### 11.1. Core Directives
1.  **Never Use Hardcoded Color Hex Codes:** Every color class must reference Tailwind theme tokens (e.g., use `bg-primary` or `text-error`, never `#0f766e` or `#dc2626`).
2.  **Never Use Arbitrary Spacing:** Do not write custom margins or paddings using raw pixels (e.g., `margin-left: 17px` is forbidden). Always map to the nearest spacing scale (e.g., `ml-4` for 16px).
3.  **Strict Button Limit:** Never implement more than three button classes. Do not create inline variations.
4.  **Always Define `lang` and Font Classes:** Components rendering text must wrap Bengali under `font-bengali` to ensure correct line heights.
5.  **Always Provide Focus states:** Every element possessing `onClick` or custom user interaction must explicitly define a focus ring class (`focus-visible:ring-2 focus-visible:ring-offset-2`).

---

## 12. TAILWIND IMPLEMENTATION

The following theme definition is optimized for **Tailwind CSS v4** syntax. Paste this config directly into your main stylesheets.

### 12.1. Tailwind v4 `@theme` Configuration
File: [src/index.css](file:///Users/aryankinha/Documents/AGENCY/SnehoAYU/last of us/shenhoAYU/frontend/src/index.css)
```css
@import "tailwindcss";

@theme {
  /* Font Family Definitions */
  --font-sans: "Hind Siliguri", system-ui, -apple-system, sans-serif;
  --font-technical: "Inter", monospace;
  --font-bengali: "Hind Siliguri", system-ui, sans-serif;

  /* Spacing Scale - 4px Grid Alignment */
  --spacing-space-1: 4px;
  --spacing-space-2: 8px;
  --spacing-space-3: 12px;
  --spacing-space-4: 16px;
  --spacing-space-5: 20px;
  --spacing-space-6: 24px;
  --spacing-space-8: 32px;
  --spacing-space-12: 48px;
  --spacing-space-16: 64px;

  /* Semantic Color Tokens - Auto Swapped via css variables in base layers */
  --color-background: var(--color-background);
  --color-surface: var(--color-surface);
  --color-border: var(--color-border);
  --color-text: var(--color-text);
  --color-text-muted: var(--color-text-muted);
  
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-foreground);
  --color-secondary: var(--color-secondary);
  --color-secondary-foreground: var(--color-secondary-foreground);
  
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-error: var(--color-error);
  --color-info: var(--color-info);

  /* Motion & Animations */
  --animate-pulse-slow: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-sheet-up: slide-up 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  
  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}

/* Custom Base Application Layer & Dark Mode Semantic Swap */
@layer base {
  :root {
    --color-background: #f8fafc;
    --color-surface: #ffffff;
    --color-border: #e2e8f0;
    --color-text: #0f172a;
    --color-text-muted: #64748b;
    
    --color-primary: #0f766e;
    --color-primary-foreground: #ffffff;
    --color-secondary: #f43f5e;
    --color-secondary-foreground: #ffffff;
    
    --color-success: #059669;
    --color-warning: #d97706;
    --color-error: #dc2626;
    --color-info: #2563eb;
    
    /* shadcn/ui custom variable bridges */
    --radius: 0.75rem;
    --background: var(--color-background);
    --foreground: var(--color-text);
    --card: var(--color-surface);
    --card-foreground: var(--color-text);
    --popover: var(--color-surface);
    --popover-foreground: var(--color-text);
    --primary: var(--color-primary);
    --primary-foreground: var(--color-primary-foreground);
    --secondary: var(--color-secondary);
    --secondary-foreground: var(--color-secondary-foreground);
    --muted: var(--color-background);
    --muted-foreground: var(--color-text-muted);
    --accent: var(--color-background);
    --accent-foreground: var(--color-primary);
    --destructive: var(--color-error);
    --destructive-foreground: #ffffff;
    --border: var(--color-border);
    --input: var(--color-border);
    --ring: var(--color-primary);
  }

  .dark {
    --color-background: #090d16;
    --color-surface: #0e1526;
    --color-border: #1e293b;
    --color-text: #f8fafc;
    --color-text-muted: #94a3b8;
    
    --color-primary: #14b8a6;
    --color-primary-foreground: #090d16;
    --color-secondary: #fb7185;
    --color-secondary-foreground: #090d16;
    
    --color-success: #34d399;
    --color-warning: #fbbf24;
    --color-error: #f87171;
    --color-info: #60a5fa;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-sans);
    transition: background-color 250ms ease, color 250ms ease;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Define global transitions and focus state enhancements for touch-friendly accessibility */
  button:focus-visible, 
  a:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
}

/* Custom scrollbar matching clean care aesthetics */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

### 12.2. Folder Structure Recommendations
For scalable development across large engineering teams, map custom UI modules inside separate feature clusters:

```text
src/
└── design-system/
    ├── tokens/              # Enforced CSS layouts, typography structures
    ├── components/          # Stateless atomic units (Buttons, Inputs, Badges)
    │   ├── Button/
    │   │   ├── Button.jsx
    │   │   └── Button.stories.js
    │   └── Input/
    └── layout/              # Shared screen shells (TabBars, Headers, Shell)
```
