-- Update Dallas event status to completed
UPDATE events 
SET status = 'completed'
WHERE title LIKE '%Dallas%Fort Worth%'
  AND start_at < NOW();