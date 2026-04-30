create table activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  scheduled_date date not null,
  type text not null,
  title text not null,
  intent_node_id text,
  duration_minutes integer,
  "order" integer not null default 0,
  created_at timestamptz default now()
);

alter table activities enable row level security;

create policy "Users can manage their own activities"
  on activities for all using (auth.uid() = user_id);
