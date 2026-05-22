-- Add fcm_token column to store Firebase registration tokens
ALTER TABLE push_subscriptions ADD COLUMN IF NOT EXISTS fcm_token text;
