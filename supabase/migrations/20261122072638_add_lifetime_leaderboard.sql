create or replace view public.leaderboard_lifetime
with (security_invoker = true)
as
select
  upper(btrim(player_name)) as player_name,
  sum(score)::bigint as lifetime_score,
  count(*)::bigint as shifts,
  max(score)::integer as best_run,
  max(created_at) as last_played_at
from public.leaderboard_scores
where btrim(player_name) <> ''
group by upper(btrim(player_name));

comment on view public.leaderboard_lifetime is
  'Worldwide leaderboard totals grouped by normalized driver name.';

revoke all on public.leaderboard_lifetime from public;
grant select on public.leaderboard_lifetime to anon;

insert into public.leaderboard_scores
  (id, player_name, score, location, served, missed, mistakes, takings_pence, created_at)
values
  ('10000000-0000-4000-8000-000000000001', 'MINTY',    1480, 'christmas', 8, 1, 1, 2600, '2026-11-19T09:14:00Z'),
  ('10000000-0000-4000-8000-000000000002', 'MINTY',     210, 'seaside',   3, 2, 2,  800, '2026-11-04T12:33:00Z'),
  ('10000000-0000-4000-8000-000000000003', 'SCOOPZ',   1375, 'village',   7, 1, 0, 2400, '2026-11-18T15:47:00Z'),
  ('10000000-0000-4000-8000-000000000004', 'SCOOPZ',    330, 'christmas', 4, 2, 1, 1100, '2026-11-02T08:21:00Z'),
  ('10000000-0000-4000-8000-000000000005', 'BLUEBELL', 1260, 'seaside',   7, 2, 1, 2300, '2026-11-17T11:05:00Z'),
  ('10000000-0000-4000-8000-000000000006', 'BLUEBELL',  125, 'christmas', 2, 3, 2,  600, '2026-11-06T17:42:00Z'),
  ('10000000-0000-4000-8000-000000000007', 'FROSTY',   1195, 'christmas', 7, 1, 2, 2500, '2026-11-20T18:26:00Z'),
  ('10000000-0000-4000-8000-000000000008', 'FROSTY',    405, 'seaside',   4, 1, 2, 1200, '2026-11-07T10:18:00Z'),
  ('10000000-0000-4000-8000-000000000009', 'VANMAN',   1080, 'village',   6, 2, 1, 2100, '2026-11-16T13:39:00Z'),
  ('10000000-0000-4000-8000-000000000010', 'VANMAN',    245, 'seaside',   3, 2, 3,  900, '2026-11-01T16:54:00Z'),
  ('10000000-0000-4000-8000-000000000011', 'SUNDAE',    965, 'football',  6, 3, 1, 2000, '2026-11-15T14:12:00Z'),
  ('10000000-0000-4000-8000-000000000012', 'SUNDAE',    180, 'christmas', 2, 2, 2,  700, '2026-11-05T09:36:00Z'),
  ('10000000-0000-4000-8000-000000000013', 'LUCY99',    850, 'seaside',   5, 2, 0, 1800, '2026-11-14T19:03:00Z'),
  ('10000000-0000-4000-8000-000000000014', 'LUCY99',    390, 'village',   4, 2, 1, 1300, '2026-11-03T11:49:00Z'),
  ('10000000-0000-4000-8000-000000000015', 'CHIPPY',    740, 'london',    5, 3, 2, 1700, '2026-11-13T08:57:00Z'),
  ('10000000-0000-4000-8000-000000000016', 'CHIPPY',    275, 'seaside',   3, 2, 1, 1000, '2026-11-08T16:28:00Z'),
  ('10000000-0000-4000-8000-000000000017', 'WHIPPY',    635, 'christmas', 4, 3, 1, 1500, '2026-11-12T12:44:00Z'),
  ('10000000-0000-4000-8000-000000000018', 'WHIPPY',    160, 'village',   2, 3, 3,  600, '2026-11-09T15:11:00Z'),
  ('10000000-0000-4000-8000-000000000019', 'MR CONE',   520, 'seaside',   4, 3, 2, 1400, '2026-11-11T10:07:00Z'),
  ('10000000-0000-4000-8000-000000000020', 'MR CONE',   360, 'christmas', 3, 2, 1, 1100, '2026-11-10T18:52:00Z')
on conflict (id) do nothing;
