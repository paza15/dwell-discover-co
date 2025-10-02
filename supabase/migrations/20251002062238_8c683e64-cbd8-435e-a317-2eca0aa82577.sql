-- Create properties table for real estate listings
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  beds INTEGER NOT NULL,
  baths INTEGER NOT NULL,
  sqft INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('For Sale', 'For Rent', 'Sold', 'Rented')),
  image_url TEXT,
  property_type TEXT DEFAULT 'House',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view properties)
CREATE POLICY "Anyone can view properties"
  ON public.properties
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_price ON public.properties(price);

-- Insert sample properties
INSERT INTO public.properties (title, price, location, description, beds, baths, sqft, status, image_url, property_type) VALUES
  ('Modern Luxury Villa', 850000.00, 'Beverly Hills, CA', 'Stunning modern villa with panoramic views, gourmet kitchen, and luxurious master suite', 4, 3, 3200, 'For Sale', 'property-1.jpg', 'House'),
  ('Charming Family Home', 525000.00, 'Austin, TX', 'Beautiful family home with spacious backyard, updated kitchen, and close to top schools', 3, 2, 2400, 'For Sale', 'property-2.jpg', 'House'),
  ('Downtown Luxury Condo', 3200.00, 'Seattle, WA', 'Modern condo in the heart of downtown with stunning city views and premium amenities', 2, 2, 1800, 'For Rent', 'property-3.jpg', 'Condo'),
  ('Elegant Waterfront Estate', 1250000.00, 'Miami, FL', 'Breathtaking waterfront property with private dock, infinity pool, and designer finishes', 5, 4, 4500, 'For Sale', 'property-1.jpg', 'House'),
  ('Cozy Suburban Home', 425000.00, 'Portland, OR', 'Well-maintained home in quiet neighborhood with modern updates and beautiful landscaping', 3, 2, 1900, 'For Sale', 'property-2.jpg', 'House'),
  ('Luxury High-Rise Apartment', 4500.00, 'New York, NY', 'Spectacular high-rise living with concierge service, gym, and rooftop terrace', 2, 2, 1500, 'For Rent', 'property-3.jpg', 'Apartment');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();