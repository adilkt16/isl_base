# IDE Prompt: Indian Sign Language Learning Platform (Phase 1 — Alphabet + Numbers)

Copy everything below into your IDE / coding agent.

---

Build a web platform for learning Indian Sign Language (ISL). Next.js (App Router), TypeScript, Tailwind CSS. No backend, no database, no login/signup — this is fully client-side, using localStorage for progress. No auth flows anywhere, not even optional ones.

**Scope for this build: Alphabet and Numbers only.** Words, Sentences, and Grammar are planned but come later. Build the architecture so those can be added as new content categories without restructuring anything — but don't build placeholder pages or nav entries for them yet. Ship a complete, polished experience for just these two categories first.

## Design direction — read this before writing any UI code

The whole point is that this does NOT look AI-generated or "vibe coded." Concretely that means:

- No generic gradient hero sections, no glassmorphism, no purple-to-blue AI-startup look, no emoji-as-icons.
- Pick a real, restrained design system: one accent color, a clear type scale, consistent spacing units (4/8px grid). Suggest a warm off-white background instead of pure white, dark charcoal text instead of pure black, and one confident accent color (not violet/indigo — pick something like a deep amber, teal, or terracotta that doesn't scream "AI template").
- Typography does the heavy lifting. Use a distinct pairing (e.g. a serif or slightly characterful display font for headings, clean sans for body) rather than defaulting to Inter everywhere.
- Generous whitespace. Minimal borders/shadows. Avoid boxing everything in identical cards — vary layout rhythm.
- Motion should be minimal and purposeful (a subtle fade/slide on lesson transitions), not decorative animation everywhere.
- Every icon should be from a single consistent icon set (lucide-react), used sparingly.

Before generating any component, think about the layout as a designer would — what's the hierarchy, what's the one thing on this screen that matters most — rather than assembling a stack of default component patterns.

## Content scope

Two categories only, treated as parallel, independent entry points (neither is a prerequisite for the other):

1. **Alphabet** — A-Z. ISL fingerspelling is two-handed, unlike ASL — reflect that in the data and descriptions.
2. **Numbers** — 0-9, plus a few common two-digit number patterns if there's a clean way to show how they compose from single digits.

Write real, well-considered text content for every entry (label, description, usage note where relevant — e.g. a note on handshapes that look similar and how to tell them apart). This text content should be complete and good, not placeholder.

## Data model

```ts
type Sign = {
  id: string;
  label: string;
  category: 'alphabet' | 'number';
  mediaType: 'video' | 'image-sequence' | 'placeholder';
  mediaSrc: string | null; // null = placeholder, clearly marked
  description: string;
  usageNote?: string;
};
```

Design the schema so `category` is just a string union that's trivial to extend later (adding `'word' | 'sentence' | 'grammar'` down the line shouldn't touch any existing logic).

For `mediaSrc`, leave it `null` and render a clearly labeled placeholder component (bordered box, hand icon, "sign reference pending" text) instead of faking a video/image. Add a `SIGN_MEDIA_TODO.md` file listing every sign ID that needs real media.

Do not attempt to AI-generate sign images/videos as if they were accurate references — flag them as placeholders instead. (When you're ready to source real media, ISLRTC's ISL dictionary is the most authoritative reference to pull from.)

Populate the full A-Z and 0-9 datasets now — that's only ~36 entries, so there's no excuse for stubbing it out.

## Core pages / flows

- **Home** — what ISL is, why it matters, a "continue where you left off" block (from localStorage), two clear entry points: Alphabet and Numbers.
- **Curriculum map (interactive, roadmap-style)** — see dedicated section below. With only two categories, this will be a small, tight map — resist the urge to pad it with fake structure to make it look bigger than it is. Two clear starting nodes are fine.
- **Lesson view** — one sign at a time, description, usage note, placeholder media, "mark as learned" toggle, prev/next navigation within that category.
- **Practice mode** — flashcard-style, self-graded, scoped to whichever category the person entered from (or a mixed alphabet+number mode if they want to combine).
- **Quiz mode** — multiple choice (match label to description, or sign to correct letter/number), scored, no login needed to see results.
- **Progress dashboard** — simple, honest, localStorage-only view of what's completed across both categories. No streaks/gamification pressure.

## Interactive curriculum map (the roadmap.sh-style piece)

Even at this small scope, build the real thing — not a placeholder version to "upgrade later." The architecture needs to support many more nodes eventually, so build it properly now.

- SVG-based node graph, not an image or iframe.
- Two main nodes to start: Alphabet and Numbers, each expandable or linking into their respective lesson lists. Since there are only two, don't force an artificial spine connecting them — show them as two independent starting points, side by side, both reachable from a shared "start here" origin node.
- Node states reflect real progress from localStorage: not-started / in-progress / completed, shown through fill color and a subtle icon (reuse the one accent color at different opacities rather than introducing new colors per state).
- Support pan and zoom on desktop (scroll/drag) and vertical scroll on mobile, even though the map is small right now — this way it doesn't need rebuilding when more nodes are added later.
- Hovering (desktop) or tapping (mobile) a node shows a short preview (title, sign count, progress) before opening it.
- Motion: nodes/paths can animate in on first load (e.g. stroke-dasharray path drawing) — keep it under ~800ms, skip on repeat visits.
- Build the layout algorithm/positioning logic generically (e.g. based on a simple x/y or tree-depth field in the data) rather than hardcoding two nodes' pixel positions — so that adding Words/Sentences/Grammar later is a data change, not a rewrite.

## UX requirements

- Fully keyboard navigable.
- Mobile-first responsive.
- High contrast, legible at a glance.
- No modal-heavy flows, no cookie-banner clutter, no signup nags anywhere.
- Fast — should feel instant.

## Tech setup

- Next.js App Router + TypeScript
- Tailwind CSS (custom theme config, not default palette)
- lucide-react for icons
- localStorage utility module for progress tracking (typed, structured so it's easy to extend to more categories later)
- No external UI kit that imposes its own visual identity (avoid default shadcn look unless heavily restyled)

## Build order

1. Scaffold project + content schema + full A-Z and 0-9 seed data (real text content, placeholder media).
2. Home + Lesson view first — these establish the visual language.
3. Curriculum map.
4. Practice mode, then Quiz mode.
5. Progress dashboard last.
