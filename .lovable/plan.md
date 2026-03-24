

# UI/UX Polish: Logos, Calendar Image, and Mobile-First Layout

## Changes

### 1. Landing Page — Replace stock icons with actual program logos
**File:** `src/components/LogoSelectionLanding.tsx`

Replace the `icon: GraduationCap` etc. with imported logo images from `src/assets/`:
- College Expo → `logo-green-clean.png`
- STEAM → `logo-steam.png`
- Athlete → `logo-athlete.png`
- Movement → `logo-movement.png`
- Internships → `logo-internships-career.png`

Change the icon rendering from `<Icon className="w-6 h-6" />` to `<img src={logo} className="w-12 h-12 rounded-lg object-contain" />` — larger, circular/rounded logos that match the brand.

### 2. BCE Programs — Add calendar image as clickable reference
**File:** `src/pages/BCEPrograms.tsx`

- Copy the uploaded calendar image to `src/assets/expo-calendar-2026.png`
- Add it in the hero section as a clickable/tappable image that opens full-screen in a dialog (using shadcn `Dialog`) so students can pinch-zoom on mobile
- Display it as a card below the hero text: "View Full 2026 Calendar" with the image as a thumbnail

### 3. Mobile-first aspect ratio fixes across all 3 pages
**Files:** `LogoSelectionLanding.tsx`, `BCEPrograms.tsx`, `BCEMarketPage.tsx`

- **Landing page**: Reduce padding, make program buttons full-width with no max-width constraint on mobile. Ensure vertical scroll fills the screen naturally.
- **BCE Programs**: Change market cards from horizontal row layout to stacked vertical on mobile (date block above city name instead of side-by-side). Remove truncation on venue name so it wraps. Reduce horizontal padding.
- **BCE Market Page**: Make tabs stack vertically on mobile (full-width tab triggers), ensure hero section doesn't use excessive vertical padding. Tab content should be full-bleed on mobile.

## Files Changed

| File | Action |
|------|--------|
| `src/assets/expo-calendar-2026.png` | Copy uploaded image |
| `src/components/LogoSelectionLanding.tsx` | Replace icons with logo images |
| `src/pages/BCEPrograms.tsx` | Add calendar image dialog + mobile layout fixes |
| `src/pages/BCEMarketPage.tsx` | Mobile aspect ratio polish |

## Scope
~4 files, ~120 lines changed

