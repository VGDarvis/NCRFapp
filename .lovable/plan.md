# Wire Up "View on Map" Button to Navigate to Floor Plan

## Problem

The "View on Map" button on vendor cards calls `onSwitchToFloorPlan?.(boothId)`, but this prop is **never passed** to `VendorsTabV2`. The button currently does nothing when clicked.

## Solution

Wire up tab switching in `CollegeExpoDashboard` so clicking "View on Map" switches to the floor plan tab with the specific booth pre-selected and highlighted. The floor plan viewer will auto-scroll/zoom to that booth.

## Changes

### 1. `CollegeExpoDashboard.tsx` — Add state for selected booth + pass props

- Add `selectedBoothId` state
- When rendering `VendorsTabV2`, pass `onSwitchToFloorPlan` that sets the booth ID and switches `activeTab` to the floor plan tab (currently under "explore" or needs a dedicated tab)
- Pass `selectedBoothId` to the floor plan component so it auto-selects on mount

### 2. Use existing (Explore tab)

- Currently there's no dedicated floor plan tab in the guest dashboard's bottom nav. The floor plan lives inside `ExploreTab` or `FloorPlanTabWrapper`. We'll check if the Explore tab already contains the floor plan, and if so, switch to it with the booth pre-selected.
- If needed, add a direct floor plan tab to the bottom nav for quicker access.

### 3. `FloorPlanTab.tsx` — Accept and use `initialBoothId` prop

- Accept an optional `initialBoothId` prop
- On mount, if set, auto-select that booth (opens the `BoothDetailDrawer`) and scroll the floor plan to center on it
- Show a brief toast like "Showing Booth #42 — Howard University" so the user knows exactly where to look

### 4. `VendorCard.tsx` — Small UX polish

- Show the booth number on the button: "View Booth #42 on Map" instead of generic "View on Map"
- Makes it clearer what will happen

## Technical Detail

- The tab switching mechanism already exists via `setActiveTab` in `CollegeExpoDashboard`
- `FloorPlanViewer` already accepts `onBoothClick` and `highlightedBoothIds` — we just need to feed the selected booth into these
- No database changes needed

## Scope

~4 files, ~40 lines changed

GOAL:

allow users to quicly find their booths and location on the map when the admin assign them. If the booth isnt on the map, then it will just take them to the respective map and they can visually see