

# Add Booth Directory Below Map + Expo-Specific Filtering for Colleges Tab

## Two Changes

### 1. Add scrollable booth directory below the map in FloorPlanTab

**What**: Below the interactive map on the Maps tab, render the full `BoothList` component so students can scroll down to browse all booths by number/name. Clicking a booth in the list scrolls back up and highlights it on the map, plus opens the `BoothDetailDrawer`.

**File**: `src/components/dashboard/college-expo/FloorPlanTab.tsx`
- After the map view `TabsContent`, always render a section titled "All Booths" with a count badge
- Reuse the existing `BoothList` component (already built and imported)
- Wire `onBoothClick` to set `selectedBoothId` and scroll to the map
- Remove the sidebar favorites panel on mobile to keep it clean — the full list replaces it
- Add a divider and heading like "📋 All Booths (42)" between map and list

### 2. Show active event name + add expo selector on VendorsTabV2 (Colleges tab)

**What**: The Colleges tab currently pulls booths from `useActiveEvent` silently — users have no idea which expo they're viewing. Add the event name as a visible header and, when multiple events exist, a dropdown to switch between them.

**Files**:
- `src/components/dashboard/college-expo/VendorsTabV2.tsx`
  - Query all events (not just active) so we can populate a selector
  - Add an event name badge/header: "Houston College Expo 2025"
  - Add a `Select` dropdown when there are multiple events, letting users switch which expo's booths they see
  - When user picks a different event, update the `eventId` used for booth queries
  - Show event date and status badge (past/upcoming) next to event name

## Technical Details

- `BoothList` component already exists at `src/components/dashboard/college-expo/floor-plan/BoothList.tsx` — no new component needed
- For the expo selector, query `events` table ordered by `event_date desc` using a simple Supabase select
- Use `useActiveEvent` as default selection, allow override via local state
- ~80 lines of changes across 2 files

