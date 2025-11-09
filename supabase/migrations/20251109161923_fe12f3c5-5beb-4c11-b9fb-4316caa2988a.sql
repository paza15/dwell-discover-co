-- Add new property attributes
ALTER TABLE public.properties 
ADD COLUMN floor INTEGER,
ADD COLUMN living_rooms INTEGER DEFAULT 1,
ADD COLUMN kitchen INTEGER DEFAULT 1,
ADD COLUMN balcony INTEGER DEFAULT 0;

-- Rename beds column to bedrooms for clarity (keeping the column, just semantic change in display)
COMMENT ON COLUMN public.properties.beds IS 'Number of bedrooms';