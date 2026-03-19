

# Replace Mock Data with Real, Owner-Focused Dashboard Stats

## Current Problem
- `MOCK_DATA_CONFIG` in `useExpoStats.ts` inflates "Total App Users" by +1000 and "QR Scans Today" by +75
- The dashboard metrics (QR Scans, Total Users, Active Now, Popular Booths) are generic and low-value for an owner trying to showcase impact
- Real data: 3 events, 133 booths across 3 cities, 106 unique colleges, 20 guest sessions, 29 seminars, 3 scholarship booklets

## Plan

### 1. Disable mock data offsets in `useExpoStats.ts`
- Set `MOCK_DATA_CONFIG.enabled = false`

### 2. Redesign `MetricsGrid.tsx` — Show owner-impact stats across ALL events
Replace current 4 cards with stats that matter to an owner showcasing value:

| Metric | Source | Why it matters |
|--------|--------|----------------|
| **Total Expos Hosted** | `events` count | Shows organizational reach |
| **College Partners** | `COUNT(DISTINCT org_name)` from `booths` | Proves network size |
| **Total Booths Managed** | `booths` count | Operational scale |
| **Seminar Sessions** | `seminar_sessions` count | Educational impact |
| **Guest Interactions** | `guest_sessions` count | Digital engagement proof |
| **Scholarship Booklets** | `scholarship_booklets` where published | Value delivered |

This gives the owner 6 cards showing real, cross-event impact numbers — not per-event vanity metrics.

### 3. Keep per-event stats in `EventManagementPanel`
The current event panel already shows booth count and seminar count for the active event. This stays as-is — it's the right place for event-specific data.

### 4. Remove `QuickActionsPanel` from imports (already not rendered)
It's imported nowhere in the dashboard layout currently — no change needed, just confirming.

## Files Changed
- `src/hooks/useExpoStats.ts` — disable mock offsets
- `src/components/admin/dashboard/MetricsGrid.tsx` — rewrite to query real cross-event stats

## Scope
~2 files, ~60 lines changed

