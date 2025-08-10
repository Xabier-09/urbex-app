-- ==========================================
-- URBEX APP DATABASE UPDATES
-- Add missing fields for explored status and color
-- ==========================================

-- Add new columns to user_saved_locations table
ALTER TABLE user_saved_locations 
ADD COLUMN IF NOT EXISTS explored BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS color VARCHAR(20) DEFAULT 'blue';

-- Update existing records to have default values
UPDATE user_saved_locations 
SET explored = false, color = 'blue' 
WHERE explored IS NULL OR color IS NULL;

-- Create index for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_user_saved_locations_explored ON user_saved_locations(explored);
CREATE INDEX IF NOT EXISTS idx_user_saved_locations_color ON user_saved_locations(color);
CREATE INDEX IF NOT EXISTS idx_user_saved_locations_category ON user_saved_locations(category);
