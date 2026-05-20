-- ─────────────────────────────────────────────────────────────────────────────
-- EMBOS Beauty Salon — Bookings & Reviews tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Bookings table (customer appointments)
CREATE TABLE IF NOT EXISTS bookings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL DEFAULT '',
  phone       text        NOT NULL DEFAULT '',
  email       text        NOT NULL DEFAULT '',
  service     text        NOT NULL DEFAULT '',
  location    text        NOT NULL DEFAULT 'salon',
  date        text        NOT NULL DEFAULT '',
  time_slot   text        NOT NULL DEFAULT '',
  notes       text        NOT NULL DEFAULT '',
  status      text        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','confirmed','cancelled')),
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone (customer) can insert a booking
CREATE POLICY "Anyone can insert booking"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admin can read all bookings
CREATE POLICY "Authenticated can read bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admin can update booking status
CREATE POLICY "Authenticated can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated admin can delete bookings
CREATE POLICY "Authenticated can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Reviews table (customer testimonials)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL DEFAULT '',
  service     text        NOT NULL DEFAULT '',
  rating      integer     NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  message     text        NOT NULL DEFAULT '',
  approved    boolean     NOT NULL DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a review
CREATE POLICY "Anyone can insert review"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Admin can read all reviews
CREATE POLICY "Authenticated can read all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

-- Admin can approve / update reviews
CREATE POLICY "Authenticated can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin can delete reviews
CREATE POLICY "Authenticated can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- Seed a few approved reviews
INSERT INTO reviews (name, service, rating, message, approved) VALUES
  ('Priya S.', 'Korean Glass Skin Facial', 5, 'Absolutely loved the Korean facial! My skin has never felt this smooth and glowing. Hemavathy is so skilled and professional.', true),
  ('Divya R.', 'Bridal Makeup', 5, 'EMBOS made my wedding day perfect. The bridal makeup was flawless and lasted all day. Highly recommend!', true),
  ('Anitha K.', 'Hair Botox', 5, 'The hair botox treatment transformed my frizzy hair completely. So silky and manageable now!', true),
  ('Meena T.', 'Nail Art', 4, 'Beautiful nail art designs. Very hygienic and professional setup. Will definitely come back!', true);
