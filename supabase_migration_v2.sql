-- Run this script in your Supabase SQL Editor to fix the "column does not exist" errors

-- Add missing columns for extended trade data that are present in the types but not in the DB
ALTER TABLE links ADD COLUMN IF NOT EXISTS entry_price NUMERIC;
ALTER TABLE links ADD COLUMN IF NOT EXISTS exit_price NUMERIC;
ALTER TABLE links ADD COLUMN IF NOT EXISTS quantity NUMERIC;
ALTER TABLE links ADD COLUMN IF NOT EXISTS fees NUMERIC;
ALTER TABLE links ADD COLUMN IF NOT EXISTS stop_loss NUMERIC;
ALTER TABLE links ADD COLUMN IF NOT EXISTS take_profit NUMERIC;
ALTER TABLE links ADD COLUMN IF NOT EXISTS entry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE links ADD COLUMN IF NOT EXISTS exit_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE links ADD COLUMN IF NOT EXISTS notes TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'links';
