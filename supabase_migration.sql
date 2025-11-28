-- Run this script in your Supabase SQL Editor

-- 1. Add new columns for trading data
ALTER TABLE links ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'resource';
ALTER TABLE links ADD COLUMN IF NOT EXISTS pair TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS direction TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS outcome TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS pnl NUMERIC;
ALTER TABLE links ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- 2. Create an index on the 'type' column for faster filtering
CREATE INDEX IF NOT EXISTS idx_links_type ON links(type);

-- 3. (Optional) Backfill existing items as 'resource'
UPDATE links SET type = 'resource' WHERE type IS NULL;
