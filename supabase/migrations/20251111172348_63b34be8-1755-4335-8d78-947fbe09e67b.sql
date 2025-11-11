-- Add price columns for Euro and Lek to properties table
ALTER TABLE public.properties
ADD COLUMN price_eur TEXT,
ADD COLUMN price_lek TEXT;

-- Update existing properties to have both prices (copy from existing price field)
UPDATE public.properties
SET price_eur = price,
    price_lek = price;

-- Add slug column to blog_posts table for SEO-friendly URLs
ALTER TABLE public.blog_posts
ADD COLUMN slug TEXT UNIQUE;

-- Generate slugs from titles for existing blog posts
UPDATE public.blog_posts
SET slug = lower(
  regexp_replace(
    regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
);

-- Make slug NOT NULL after populating existing rows
ALTER TABLE public.blog_posts
ALTER COLUMN slug SET NOT NULL;