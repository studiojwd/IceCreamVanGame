revoke insert on table public.leaderboard_scores from anon;
grant insert (
  id,
  player_name,
  score,
  location,
  served,
  missed,
  mistakes,
  takings_pence
) on table public.leaderboard_scores to anon;
