-- Phase 5: Auto-link booths to floor plans for Houston event
-- This ensures existing booths are linked to their floor plan for better data integrity

UPDATE booths
SET floor_plan_id = (
  SELECT fp.id 
  FROM floor_plans fp
  JOIN events e ON e.venue_id = fp.venue_id
  WHERE e.id = booths.event_id
  ORDER BY fp.created_at DESC
  LIMIT 1
)
WHERE event_id = '82380224-9e0b-45fc-a395-61117e0af6a5'
AND floor_plan_id IS NULL;