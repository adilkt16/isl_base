# IDE Prompt: Fix Broken Hand Rendering (Abduction Bug + Text Mismatch)

Copy this into Antigravity on the isl_base project.

---

There are two separate bugs causing inaccurate-looking hand signs on the site.

## Bug 1: Corrupted abduction values distort the rig

In `src/lib/handshape-data.ts`, the `abduction` field on many entries has extreme, anatomically impossible values (some over ±100 degrees — real finger abduction should stay roughly within ±40 degrees). This happened because the value was computed with a less reliable method than the `mcp`/`pip`/`dip` flexion angles, which are solid.

In `src/components/HandRig.tsx`, the `getFingerJoints` function uses `f_pose.abduction` directly as a raw rotation offset:

```ts
const a1 = (baseAngle + fPose.abduction * sideMultiplier + fPose.mcp * bendSign) * d2r;
```

Fix this defensively at the rig level (don't touch the data file) by clamping abduction to a safe range before using it:

```ts
const MAX_ABDUCTION = 35; // degrees -- real finger spread rarely exceeds this
const clampedAbduction = Math.max(-MAX_ABDUCTION, Math.min(MAX_ABDUCTION, fPose.abduction));
```

Use `clampedAbduction` everywhere `fPose.abduction` currently appears inside `getFingerJoints` (all three angle calculations: `a1`, `a2`, `a3`). This protects the rendering regardless of what's in the data file, including any future entries.

After this fix, re-render every letter A-Z and number 0-9 and visually confirm no finger flies off at an unnatural angle. Flag any that still look wrong even after clamping — that would point to a deeper issue in the `mcp`/`pip`/`dip` values themselves, not abduction.

## Bug 2: Text descriptions don't match the actual computed handshape data

The lesson text content (in `src/data/signs.ts` or wherever `Sign.description`/`usageNote` live) was written before the real dataset was integrated, and in at least one case (letter A) it describes a completely different handshape than what the real data actually shows (data shows a two-handed closed fist; the text describes a fingertip-touching pose).

Do a pass over every letter/number's text content and check it against what `handshape-data.ts` actually encodes for that sign (two-handed vs one-handed, roughly how curled each finger is). Where they conflict:
- If you're not confident what the correct real-world description is, rewrite the text to be accurate to what the *data* shows structurally (e.g. "a closed two-handed fist shape" rather than inventing specific finger-touch claims that aren't grounded in anything) rather than leaving a specific wrong claim in place.
- Add a short inline comment or TODO flag next to any description you're unsure about, so it's easy to find and verify against a real ISL reference later.

Don't invent new specific claims (like which exact fingertip touches which) unless they're grounded in the real data or a verified source — a vaguer-but-correct description is better than a specific-but-wrong one.
