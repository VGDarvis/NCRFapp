

# Redesign Landing Page + New BCE Programs/Markets Routing

## Overview
Replace the rotating circle landing page with a clean vertical program list. When users click "Black College Expo," they go to a new `/bce-programs` page showing all 2026 expo markets (from the calendar image). Each market is clickable, leading to a market-specific homepage with vendors, floor plan, and scholarship info.

## Changes

### 1. Simplify Landing Page (`LogoSelectionLanding.tsx`)
- Remove `RotatingLogoCircle` component and `VideoSection` component
- Replace with a vertical list of programs, each showing its logo + name
- Black College Expo listed first at the top, prominently
- Other programs (STEAM, Athlete, Movement, Internships) listed below with "Coming Soon" badges
- BCE click navigates to `/bce-programs` (instead of `/auth/college-expo`)
- Keep the NCRF title header, particle background, admin/shop buttons

### 2. Create New Page: `BCEPrograms.tsx` at `/bce-programs`
A page listing all 2026 expo markets from the calendar image. Each market is a clickable card showing:
- City name
- Venue/address
- Date
- Event type badge (BCE, HBCU Caravan, etc.)

**2026 Expo Calendar Data (from image):**

| City | Venue | Date | Type |
|------|-------|------|------|
| Miami | William H. Turner Technical Arts High School | Jan 24, 2026 | BCE |
| Bakersfield USD | Bakersfield College | Mon Feb 2, 2026 | HBCU Caravan |
| Fresno | Fresno Convention Center - Valdez Hall | Tue Feb 3, 2026 | BCE |
| Monterey Peninsula USD | Oldmeyer Community Ctr | Wed Feb 4, 2026 | HBCU Caravan |
| Mount Diablo USD | Mount Diablo High School | Thu Feb 5, 2026 | HBCU Caravan |
| Stockton USD | Stagg High School (Library) | Thu Feb 5, 2026 | BCE |
| Oakland USD | Oakland Technical High School | Fri Feb 6, 2026 | HBCU Caravan |
| Pomona USD | Garey High School | Tue Feb 10, 2026 | HBCU Caravan |
| Oakland | Oakland Marriott City Center | Feb 7, 2026 | BCE |
| San Diego | Bayview Church | Feb 12, 2026 | BCE |
| Los Angeles | Pomona Fairplex | Feb 14, 2026 | BCE |
| North Carolina | Johnson C. Smith | Mar 5, 2026 | BCE |
| Atlanta | Cobb Galleria | Mar 7, 2026 | BCE |
| DC/Maryland | Walter E. Washington Convention Center | Mar 28, 2026 | BCE |
| Chicago | Chicago State University | Apr 4, 2026 | BCE |

Each card clicks through to `/bce-programs/:marketSlug` (e.g., `/bce-programs/houston`, `/bce-programs/miami`).

### 3. Create Market Homepage: `BCEMarketPage.tsx` at `/bce-programs/:marketSlug`
Each market gets a dedicated page with:
- **Hero section** with city name, venue, date, and event status (past/upcoming)
- **Vendors/Participants tab** -- booths for that event (reuses existing `VendorsTabV2` logic, filtered by event)
- **Floor Plan tab** -- if a floor plan exists for that venue (reuses `FloorPlanTabWrapper`)
- **Scholarships tab** -- scholarship booklets linked to that event/region
- **Sign Up button** -- links to `/auth/college-expo` for registration

This page queries the `events` table by matching city/name to find the event ID, then renders existing components filtered to that event.

### 4. Move Video to Donors Tab (`DonorsTab.tsx`)
- Import and render `VideoSection` at the top of the Donors tab, before the hero image
- Remove VideoSection import from `LogoSelectionLanding.tsx`

### 5. Update Routing (`App.tsx`)
Add two new routes:
```
/bce-programs → BCEPrograms page (all markets list)
/bce-programs/:marketSlug → BCEMarketPage (individual market homepage)
```

### 6. Wire existing DB events to market slugs
- For markets already in the `events` table (Houston, Dallas, Seattle), the market page will show real booth/seminar data
- For new markets not yet in DB, the page shows the venue info from hardcoded calendar data with a "Details Coming Soon" state and a registration CTA

## Files

| File | Action |
|------|--------|
| `src/components/LogoSelectionLanding.tsx` | Rewrite -- vertical program list, no circle/video |
| `src/pages/BCEPrograms.tsx` | New -- 2026 expo calendar grid |
| `src/pages/BCEMarketPage.tsx` | New -- individual market homepage with tabs |
| `src/components/dashboard/college-expo/DonorsTab.tsx` | Add VideoSection at top |
| `src/App.tsx` | Add 2 new routes |

## Scope
~5 files, ~400 lines of new/changed code

