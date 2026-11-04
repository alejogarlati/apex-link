# Pinned Vertical Scroll Carousel Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the sections below the Hero on the ApexLink landing page (`FeaturesGrid` and `QuickStartSteps`) into pinned vertical scroll carousels matching the trace-studio animation architecture.

**Architecture:** Use GSAP ScrollTrigger with `pin: true`, `pinSpacing: true`, `scrub: 0.6`, and step-based snapping. Transition items vertically along the Y-axis with progressive blur and scaling, synchronized with a continuous M-color progress bar and dynamic spotlight lighting. Hero and TopNav remain completely untouched.

**Tech Stack:** Next.js 16 (App Router), React 19, GSAP 3.15, @gsap/react (useGSAP), Tailwind CSS v4, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-03-pinned-scroll-carousel-landing-design.md`

## Global Constraints
- Do NOT touch the Hero section or TopNav in `web/src/app/page.tsx`.
- Use local `useGSAP` or scoped GSAP contexts to avoid memory leaks or orphaned event listeners.
- Use BMW M palette (`#e22718`, `#0066b1`, `#1c69d4`) and cockpit surfaces for glows and indicators.
- Ensure all Next.js client component rules are satisfied (`"use client"`).

## Review Focus
1. SSR / Window guard: `typeof window !== "undefined"` and `gsap.registerPlugin(ScrollTrigger)` safe under Next.js App Router.
2. Responsive sizing: Ensure the pinned wrapper content does not overflow on mobile screens (`h-[460px] sm:h-[400px]` with flexible wrapping).
3. DOM unmounting: Context cleanup on unmount via `ctx.revert()`.
4. Snap calculation: `snapTo: (v) => Math.round(v / stepFraction) * stepFraction` to avoid getting stuck between steps.
5. Z-index and stacking context: Pinned sections must not clip under or overlap awkwardly with adjacent sections.

---

### Task 1: Transform `QuickStartSteps.tsx` into a Pinned Vertical Scroll Carousel

**Files:**
- Modify: `web/src/components/landing/QuickStartSteps.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` from `@/lib/gsap`
- Produces: `export function QuickStartSteps()` rendering a pinned 3-step vertical carousel

- [ ] **Step 1: Update `QuickStartSteps.tsx` structure and GSAP pinning logic**
  - Setup `pinWrapperRef`, `itemsRef`, `progressBarRef`, `spotlightRef` and `activeStep` state.
  - Initialize items with `gsap.set`: item 0 at `{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", pointerEvents: "auto" }`, items 1..N at `{ opacity: 0, y: 75, scale: 0.96, filter: "blur(6px)", pointerEvents: "none" }`.
  - Create timeline on `pinWrapperRef` with `ScrollTrigger`: `start: "top 20%"`, `end: "+=1800"`, `pin: true`, `scrub: 0.6`, `snap: { snapTo: 1/2 }`.
  - Animate item transitions: current item out (`y: -75, opacity: 0, scale: 0.96, filter: "blur(6px)"`), next item in (`y: 0, opacity: 1, scale: 1, filter: "blur(0px)"`).
  - Add continuous progress bar with 3 dots and glowing dynamic spotlight behind cards.

- [ ] **Step 2: Verify component rendering and TypeScript compilation**
  Run: `npx tsc --noEmit -p web/tsconfig.json`
  Expected: No TypeScript errors in `QuickStartSteps.tsx`.

- [ ] **Step 3: Commit Task 1**
  ```bash
  git add web/src/components/landing/QuickStartSteps.tsx
  git commit -m "feat(landing): convert QuickStartSteps to pinned vertical scroll carousel"
  ```

---

### Task 2: Transform `FeaturesGrid.tsx` into a Pinned Vertical Scroll Carousel

**Files:**
- Modify: `web/src/components/landing/FeaturesGrid.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` from `@/lib/gsap`, telemetry icons (`Gauge`, `Activity`, `LineChart`, `Target`, `Trophy`, `Sliders`)
- Produces: `export function FeaturesGrid()` rendering a pinned 6-feature vertical carousel

- [ ] **Step 1: Update `FeaturesGrid.tsx` to pinned carousel layout**
  - Setup `pinWrapperRef`, `itemsRef`, `progressBarRef`, `spotlightRef`, and `activeStep` state (0 to 5).
  - Setup items: item 0 active, items 1..5 initial hidden at `{ y: 75, opacity: 0, scale: 0.96, filter: "blur(6px)" }`.
  - Timeline on `pinWrapperRef` with `ScrollTrigger`: `start: "top 20%"`, `end: "+=2600"`, `pin: true`, `scrub: 0.6`, `snap: { snapTo: 1/5 }`.
  - Staggered step-by-step vertical carousel transitions across all 6 features with telemetry badge, icon pill, title, description, and technical resolution/highlight box.
  - Progress bar with 6 markers and M-red / M-blue active indicator.

- [ ] **Step 2: Verify component rendering and TypeScript compilation**
  Run: `npx tsc --noEmit -p web/tsconfig.json`
  Expected: No TypeScript errors in `FeaturesGrid.tsx`.

- [ ] **Step 3: Commit Task 2**
  ```bash
  git add web/src/components/landing/FeaturesGrid.tsx
  git commit -m "feat(landing): convert FeaturesGrid to pinned vertical scroll carousel"
  ```

---

### Task 3: Calibrate ScrollTrigger Cascade and Overall Build Verification

**Files:**
- Modify: `web/src/app/page.tsx` (refresh calibration only, without touching Hero or TopNav)

**Interfaces:**
- Consumes: `FeaturesGrid`, `QuickStartSteps`, `CtaBand`, `ScrollTrigger.refresh()`
- Produces: Seamless landing page scroll experience with pinned sections

- [ ] **Step 1: Calibrate ScrollTrigger refresh in `web/src/app/page.tsx`**
  - Ensure window resize / DOM height changes trigger `ScrollTrigger.refresh()` after a small delay.
  - Confirm the Hero and TopNav remain 100% unaltered.

- [ ] **Step 2: Execute Next.js production build**
  Run: `npm --prefix web run build` (or `pnpm --dir web build`)
  Expected: Compiled successfully with zero route errors.

- [ ] **Step 3: Commit Task 3**
  ```bash
  git add web/src/app/page.tsx
  git commit -m "feat(landing): integrate and calibrate pinned scroll triggers"
  ```
