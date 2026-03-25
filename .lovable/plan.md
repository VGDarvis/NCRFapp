

# Add Crimson Glowing Flare Effects

## What
Add ambient red/crimson glowing orb flares — the floating, soft, translucent red light effects visible in the reference image. These are purely CSS-driven decorative elements (no JS needed) using radial gradients, blur, and subtle animation.

## Approach
Create reusable CSS utility classes for glowing flares, then add a lightweight `RedFlares` component that renders 3-4 positioned `<div>` elements with these classes. Place them on key pages as background decoration.

## CSS Classes (in `src/index.css`)

**`.flare`** — Base: `position: absolute`, `border-radius: 50%`, `pointer-events: none`, `filter: blur(80px)`, `opacity: 0.3`

**`.flare-red`** — `background: radial-gradient(circle, rgba(212, 25, 32, 0.6), transparent 70%)`

**`.flare-gold`** — `background: radial-gradient(circle, rgba(212, 160, 32, 0.4), transparent 70%)`

**`@keyframes flare-drift`** — Slow position + scale oscillation (~8s infinite) for organic movement

**`.flare-sm`** — `width: 200px; height: 200px`
**`.flare-md`** — `width: 350px; height: 350px`
**`.flare-lg`** — `width: 500px; height: 500px`

## New Component: `src/components/RedFlares.tsx`
A simple presentational component that renders 3-4 absolutely positioned flare divs. Used as a background layer (like `ParticleBackground`). Positions:
- Top-right corner: large red flare
- Bottom-left corner: medium red flare
- Center-right: small gold flare
- Top-left: medium red flare (offset)

Each has a slightly different animation delay for organic feel.

## Integration
Add `<RedFlares />` to:
- `LogoSelectionLanding.tsx` (alongside existing `ParticleBackground`)
- `BCEPrograms.tsx` (hero area)
- `BCEMarketPage.tsx` (hero area)

The flares sit in a `position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none` container so they don't interfere with content.

## Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Add flare utility classes + keyframe |
| `src/components/RedFlares.tsx` | New — renders ambient glow orbs |
| `src/components/LogoSelectionLanding.tsx` | Import + render `<RedFlares />` |
| `src/pages/BCEPrograms.tsx` | Import + render `<RedFlares />` |
| `src/pages/BCEMarketPage.tsx` | Import + render `<RedFlares />` |

~5 files, ~80 lines new code

