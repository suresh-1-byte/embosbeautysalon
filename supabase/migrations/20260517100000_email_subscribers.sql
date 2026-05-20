-- Email subscribers table
-- Stores emails of users who opted in via the website popup

CREATE TABLE IF NOT EXISTS email_subscribers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL DEFAULT '',
  email      text        NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert their own email)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role (Edge Function) can read all subscribers
CREATE POLICY "Service role can read subscribers"
  ON email_subscribers FOR SELECT
  TO service_role
  USING (true);

-- Admin (authenticated) can also read
CREATE POLICY "Authenticated can read subscribers"
  ON email_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Admin can delete (unsubscribe)
CREATE POLICY "Authenticated can delete subscribers"
  ON email_subscribers FOR DELETE
  TO authenticated
  USING (true);
