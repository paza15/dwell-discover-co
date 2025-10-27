-- Add image_urls column to properties table
ALTER TABLE public.properties
ADD COLUMN image_urls text[] DEFAULT NULL;