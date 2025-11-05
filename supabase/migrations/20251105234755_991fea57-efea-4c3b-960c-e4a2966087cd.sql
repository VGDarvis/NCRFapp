-- Update Houston event status to completed
UPDATE events 
SET status = 'completed' 
WHERE id = '82380224-9e0b-45fc-a395-61117e0af6a5';

-- Create function to automatically update event statuses based on dates
CREATE OR REPLACE FUNCTION update_event_statuses()
RETURNS void AS $$
BEGIN
  -- Mark events as in_progress if start_at <= now < end_at
  UPDATE events 
  SET status = 'in_progress'
  WHERE start_at <= NOW() 
    AND end_at > NOW() 
    AND status = 'upcoming';

  -- Mark events as completed if end_at < now
  UPDATE events 
  SET status = 'completed'
  WHERE end_at < NOW() 
    AND status IN ('upcoming', 'in_progress');
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run this function periodically (optional - can be called manually or via cron)
COMMENT ON FUNCTION update_event_statuses() IS 'Automatically updates event statuses based on start_at and end_at dates. Call this function periodically or when loading event pages.';