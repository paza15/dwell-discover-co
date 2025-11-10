-- Add bilingual columns for properties
ALTER TABLE public.properties 
ADD COLUMN title_en TEXT,
ADD COLUMN title_al TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN description_al TEXT;

-- Copy existing title and description to English columns
UPDATE public.properties 
SET title_en = title,
    description_en = description;

-- Set default values for Albanian columns if needed
UPDATE public.properties 
SET title_al = title_en,
    description_al = description_en
WHERE title_al IS NULL OR description_al IS NULL;