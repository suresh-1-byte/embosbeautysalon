-- Web Push subscriptions (no Firebase)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint    text        NOT NULL UNIQUE,
  p256dh      text        NOT NULL,
  auth        text        NOT NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Any visitor can subscribe
CREATE POLICY "Anyone can insert push subscription"
  ON push_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow upsert (update on conflict)
CREATE POLICY "Anyone can update their subscription"
  ON push_subscriptions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Only service role (Edge Function) can read all subscriptions
CREATE POLICY "Service role can read subscriptions"
  ON push_subscriptions FOR SELECT
  TO service_role
  USING (true);

-- Allow cleanup of expired subscriptions
CREATE POLICY "Service role can delete subscriptions"
  ON push_subscriptions FOR DELETE
  TO service_role
  USING (true);
