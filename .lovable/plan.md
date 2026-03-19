

# Allow Guests to View Past Event Data

## Problem
Once an event's status changes from "upcoming" to "completed", the entire guest dashboard goes blank. All tabs depend on `useActiveEvent` which only returns future upcoming events.

## Solution
Update the event resolution logic to use a **fallback chain**: show the current/upcoming event if one exists, otherwise show the most recently completed event. This way guests always see relevant content.

## Changes

### 1. Update `useActiveEvent.ts` — Add fallback to most recent event
Modify the query logic:
- First, try to find an `in_progress` event (currently happening)
- Then, try `upcoming` events (next scheduled)
- Finally, fall back to the most recent `completed` event

This single change cascades to all tabs since they all use `useActiveEvent` for the event ID.

### 2. Update `WelcomeTab.tsx` — Same fallback for featured event
The WelcomeTab has its own direct query filtering by `status: "upcoming"`. Apply the same fallback logic so the welcome hero card shows the most recent event when no upcoming one exists.

### 3. Update `SeminarsTabWrapper.tsx` — Same fallback
This component also independently queries for `status: "upcoming"`. Apply the same pattern.

### 4. Add a "Past Event" indicator badge
When displaying a completed event, show a subtle badge (e.g., "Past Event — For Reference") so users understand they're viewing historical data, not a live event. This appears on the WelcomeTab hero and potentially the header.

## What stays the same
- No database changes needed
- No new tables or migrations
- All existing tabs (Vendors, Schedule, Floor Plan, Donors) automatically work since they consume `eventId` from `useActiveEvent`

## Estimated scope
4 files modified, ~60 lines changed total.

