-- Telegram subscribers table
create table if not exists telegram_subscribers (
  id         uuid primary key default gen_random_uuid(),
  chat_id    bigint not null unique,
  name       text,
  username   text,
  created_at timestamptz default now()
);

alter table telegram_subscribers enable row level security;

-- Service role can read/write (Edge Functions)
create policy "Service role full access"
  on telegram_subscribers for all
  to service_role
  using (true)
  with check (true);
