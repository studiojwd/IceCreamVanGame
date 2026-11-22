create table public.leaderboard_scores (
  id uuid primary key,
  player_name varchar(12) not null,
  score integer not null,
  location text not null,
  served smallint not null,
  missed smallint not null default 0,
  mistakes smallint not null default 0,
  takings_pence integer not null default 0,
  created_at timestamptz not null default now(),
  constraint leaderboard_scores_player_name_length
    check (char_length(player_name) between 1 and 12),
  constraint leaderboard_scores_player_name_format
    check (player_name ~ '^[A-Z0-9 ''&-]+$'),
  constraint leaderboard_scores_score_range
    check (score between 1 and 10000000),
  constraint leaderboard_scores_location_allowed
    check (location in ('christmas', 'seaside', 'village', 'football', 'london', 'market', 'sydney')),
  constraint leaderboard_scores_served_range
    check (served between 1 and 1000),
  constraint leaderboard_scores_missed_range
    check (missed between 0 and 1000),
  constraint leaderboard_scores_mistakes_range
    check (mistakes between 0 and 1000),
  constraint leaderboard_scores_takings_range
    check (takings_pence between -1000000 and 1000000)
);

create index leaderboard_scores_rank_idx
  on public.leaderboard_scores (score desc, created_at asc);

alter table public.leaderboard_scores enable row level security;

create policy "Anyone can read leaderboard scores"
  on public.leaderboard_scores
  for select
  to anon
  using (true);

create policy "Anyone can submit leaderboard scores"
  on public.leaderboard_scores
  for insert
  to anon
  with check (true);

revoke all on table public.leaderboard_scores from anon, authenticated;
grant select, insert on table public.leaderboard_scores to anon;
