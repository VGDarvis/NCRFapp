-- Create user_seminar_favorites table for authenticated users to save seminars
CREATE TABLE IF NOT EXISTS user_seminar_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seminar_id UUID NOT NULL REFERENCES seminar_sessions(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, seminar_id)
);

-- Enable Row Level Security
ALTER TABLE user_seminar_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for user_seminar_favorites
CREATE POLICY "Users can view their own seminar favorites"
  ON user_seminar_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seminar favorites"
  ON user_seminar_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seminar favorites"
  ON user_seminar_favorites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own seminar favorites"
  ON user_seminar_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_seminar_favorites_user ON user_seminar_favorites(user_id, event_id);
CREATE INDEX idx_seminar_favorites_seminar ON user_seminar_favorites(seminar_id);
CREATE INDEX idx_seminar_favorites_created ON user_seminar_favorites(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_user_seminar_favorites_updated_at
  BEFORE UPDATE ON user_seminar_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();