-- Allow anyone to upload to gallery bucket
insert into storage.policies (name, bucket_id, operation, definition)
values
  ('Allow public uploads to gallery', 'gallery', 'INSERT', 'true'),
  ('Allow public uploads to offers', 'offers', 'INSERT', 'true'),
  ('Allow public uploads to sticky-notes', 'sticky-notes', 'INSERT', 'true'),
  ('Allow public uploads to google-reviews', 'google-reviews', 'INSERT', 'true'),
  ('Allow public delete from gallery', 'gallery', 'DELETE', 'true'),
  ('Allow public delete from offers', 'offers', 'DELETE', 'true'),
  ('Allow public delete from sticky-notes', 'sticky-notes', 'DELETE', 'true'),
  ('Allow public delete from google-reviews', 'google-reviews', 'DELETE', 'true')
on conflict do nothing;
