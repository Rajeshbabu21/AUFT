export interface Matches {
  id: string; // UUID
  match_week: number;
  match_date: string; // ISO date string
  match_time: string; // "15:30:00"

  home_team: Team;
  away_team: Team;
}

export interface Team {
  team_name: string;
  badge: {
    image_url: string;
  };
}
