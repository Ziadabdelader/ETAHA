-- Add location_link column to addresses table
ALTER TABLE addresses
ADD COLUMN IF NOT EXISTS location_link text;

-- Add comment to explain the column
COMMENT ON COLUMN addresses.location_link IS 'Google Maps link to the pinned location';
