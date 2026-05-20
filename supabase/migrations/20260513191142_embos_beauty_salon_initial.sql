/*
  # EMBOS Beauty Salon - Initial Schema

  1. New Tables
    - `offers` - Promotional offers displayed on the homepage
      - id, title, description, active, created_at
    - `gallery_images` - Gallery images with category filters
      - id, url, description, category, created_at
    - `transformations` - Before/after image pairs
      - id, before_url, after_url, description, created_at

  2. Security
    - RLS enabled on all tables
    - Public can read active offers and gallery images
    - Only authenticated users (admin) can write
*/

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'All',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  before_url text NOT NULL DEFAULT '',
  after_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;

-- Public SELECT policies
CREATE POLICY "Anyone can view active offers"
  ON offers FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Anyone can view gallery images"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view transformations"
  ON transformations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin (authenticated) write policies
CREATE POLICY "Authenticated users can insert offers"
  ON offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update offers"
  ON offers FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete offers"
  ON offers FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert transformations"
  ON transformations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update transformations"
  ON transformations FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete transformations"
  ON transformations FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Seed initial offers
INSERT INTO offers (title, description, active) VALUES
  ('Bridal Special Package', 'Complete bridal makeover including hair, makeup, and skincare — 20% off this season.', true),
  ('Korean Glass Skin Combo', 'Experience our signature Korean Glass Skin facial + brow sculpting at a special introductory price.', true),
  ('Home Service Launch Offer', 'Book any home service this month and get a complimentary mini facial.', true);
