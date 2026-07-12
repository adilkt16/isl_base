# IDE Prompt: Add Parametric Hand-Rig Component

Copy everything below into Antigravity as a follow-up prompt on the existing ISL platform project.

---

We already have the ISL learning platform scaffolded (Next.js, TypeScript, Tailwind, alphabet + numbers content, curriculum map, lesson view, practice/quiz, progress dashboard). Now add a parametric hand-rig visual component to replace the current placeholder media block in the lesson view.

## Goal

Instead of a static image or a "sign reference pending" placeholder, render each sign as an animated SVG hand built from joint-angle data — no external images or video files. The hand should animate from a neutral rest pose into the target handshape, with a subtle glow/accent-color highlight, matching the existing minimalist design system (reuse the current accent color, don't introduce a new one).

## Data structure

Create a new file `lib/handshape-data.ts`. Define a type describing hand pose as joint angles, not pixel positions, so the same rig can render any handshape:

```ts
type FingerPose = {
  mcp: number; // metacarpophalangeal joint bend, degrees, 0 = straight, ~90 = fully curled
  pip: number; // proximal interphalangeal joint bend
  dip: number; // distal interphalangeal joint bend
  abduction: number; // side-to-side spread from neutral, degrees
};

type HandPose = {
  thumb: FingerPose;
  index: FingerPose;
  middle: FingerPose;
  ring: FingerPose;
  pinky: FingerPose;
  wristRotation: number; // palm-out vs palm-in, degrees
  handOrientation: 'palm-out' | 'palm-in' | 'side';
};

type HandshapeEntry = {
  signId: string; // matches Sign.id from the existing content schema
  hands: 'one' | 'two'; // ISL fingerspelling is two-handed for several letters — flag which
  primary: HandPose;
  secondary?: HandPose; // only if hands === 'two'
};
```

Populate this file with **placeholder values only** — every entry should use an identical neutral/rest pose (e.g. all joints at 0, fingers loosely extended) for every letter A-Z and number 0-9. Do NOT invent distinct "plausible-looking" angle values per letter — that would create the exact problem we're trying to avoid (confidently wrong signs). Leave a clear comment at the top of the file:

```ts
// PLACEHOLDER DATA — every entry currently uses the same neutral rest pose.
// Real per-letter/number joint angles need to be filled in from a verified
// ISL reference (e.g. ISLRTC's ISL dictionary) before this is usable for
// actual learning. Do not treat current values as correct signs.
```

## Rig component

Create `components/HandRig.tsx`:

- Renders an SVG hand built from simple shapes (rounded rects/paths for palm and finger segments), not a photorealistic illustration — this should look like a clean technical diagram, in line with the existing minimalist visual language.
- Takes a `HandshapeEntry` as a prop and animates from a hardcoded rest pose to the target pose on mount (or on a "play" trigger), using CSS transitions or a lightweight animation library already in the project if one exists — otherwise plain CSS transforms are enough, don't add a new dependency for this.
- If `hands === 'two'`, render two rigs side by side, sized and positioned so it reads as one coordinated shape rather than two separate hands.
- Add a small accent-color glow or outline pulse at the moment the hand reaches its target pose, to give a satisfying "lock-in" feel — keep it under ~150ms, subtle, not flashy.
- Add a replay control (small icon button) so the learner can retrigger the animation on demand.
- Since all current data is a placeholder rest pose, every sign will visibly look identical right now — that's expected and correct behavior for this step. Do not fake variation.

## Integration

Replace the current placeholder media block in the lesson view with `<HandRig />`, passing in the matching `HandshapeEntry` by `signId`. Keep the existing "sign reference pending" placeholder logic as a fallback for any `signId` that doesn't yet have a `HandshapeEntry` (there shouldn't be any right now since we're seeding all of them with rest-pose placeholders, but keep the fallback path for safety as content grows later).

## What NOT to do

- Don't generate or fetch any images/video for this.
- Don't invent distinct angle values per letter to "make it look done" — leave them uniform and clearly marked as placeholder, per the data file comment above.
- Don't add new dependencies unless something already in the project can't reasonably do CSS-based joint animation.

## After this is built

The rig and animation system will be fully functional but visually static-looking per letter (same pose every time) until real joint-angle data is filled into `handshape-data.ts`. That data-filling step happens separately, sign by sign, based on a real ISL reference — not something to solve in this prompt.
