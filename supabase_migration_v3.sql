-- Enable RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Add user_id column
ALTER TABLE links ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create policy: Users can only see their own links
CREATE POLICY "Users can view own links"
  ON links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own links"
  ON links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
  ON links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
  ON links FOR DELETE
  USING (auth.uid() = user_id);
