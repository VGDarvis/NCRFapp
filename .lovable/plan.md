

# Dark Premium Color Scheme + Program Logos on All Pages

## Inspiration
The reference image shows a **dark, luxurious UI**: near-black backgrounds (#0D0D0D), deep charcoal cards with subtle glass borders, **crimson/red primary** buttons with glow, **gold accent** text, and warm red ambient lighting. Very premium, app-like feel.

## Part 1: Color Scheme Update

### `src/index.css` — Rewrite all CSS variables

**New palette:**

| Role | New Value |
|------|-----------|
| Background | `0 0% 5%` (#0D0D0D near-black) |
| Foreground | `0 0% 95%` (#F2F2F2 off-white) |
| Card | `0 0% 9%` (#171717 dark charcoal) |
| Primary | `0 85% 45%` (#D41920 crimson red) |
| Secondary | `0 0% 13%` (#212121 dark gray) |
| Accent | `40 80% 55%` (#D4A020 warm gold) |
| Muted | `0 0% 12%` (#1F1F1F) |
| Border | `0 0% 16%` (#292929 subtle) |

- Update all glass classes to use dark semi-transparent backgrounds (`rgba(20,20,20,0.7)`)
- Glow effects become red/crimson glows
- Gradients shift to dark-to-darker with red/gold accent sweeps
- Body background: solid near-black, no gradient
- Remove `.dark` selector duplication (the default IS dark now)

### `tailwind.config.ts` — Update keyframe glow HSL values
- `glow-pulse` → crimson red HSL
- `neon-glow` → red + gold HSL

## Part 2: Program Logos Instead of Stock Icons

These dashboards still use Lucide icons for tab navigation. Replace with actual program logo images:

### `src/components/CollegeExpoDashboard.tsx`
- Already imports `logoGreenClean` — use it as a small icon in the "Colleges" tab instead of `GraduationCap`

### `src/components/AthleteDashboard.tsx`
- Import `logo-athlete.png`, use in header area. Tab icons (Home, Sports, etc.) are generic navigation — those stay as Lucide icons since they represent actions not programs.

### `src/components/SteamDashboard.tsx`, `InternshipsDashboard.tsx`, `MovementDashboard.tsx`, `EsportsDashboard.tsx`
- Each already passes its logo to `DashboardHeader` — confirm and ensure the header logo is visible. Tab icons for navigation actions (Home, Stats, etc.) remain as Lucide since they describe function, not program identity.

### `src/pages/BCEPrograms.tsx` and `src/pages/BCEMarketPage.tsx`
- Add the BCE logo (`logo-green-clean.png`) in the top-left corner as a brand identifier on these pages

## What does NOT change
- All layouts, sections, routing, and component logic remain identical
- Only color tokens, glass utility colors, and logo placement change

## Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Full CSS variable rewrite to dark premium palette |
| `tailwind.config.ts` | Keyframe glow colors to red/gold |
| `src/pages/BCEPrograms.tsx` | Add BCE logo in header corner |
| `src/pages/BCEMarketPage.tsx` | Add BCE logo in header corner |
| `src/components/AthleteDashboard.tsx` | Import + show athlete logo in header |

~5 files, ~150 lines changed

