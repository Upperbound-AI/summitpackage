-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste this → Run

-- Create the slots table
CREATE TABLE IF NOT EXISTS slots (
  id        INT PRIMARY KEY DEFAULT 1,
  remaining INT NOT NULL DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the starting record (10 spots)
INSERT INTO slots (id, remaining)
VALUES (1, 10)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access (so the course page can fetch the count)
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read slots"
  ON slots FOR SELECT
  USING (true);

-- Only service role can update (our Netlify function)
CREATE POLICY "Service role can update slots"
  ON slots FOR UPDATE
  USING (true);

-- Verify it worked
SELECT * FROM slots;
