export interface MatchResponse {
  match_id: string;
  match_week: number;

  home_team: {
    name: string;
    image: string;
  };

  away_team: {
    name: string;
    image: string;
  };

  score: {
    home: number;
    away: number;
  };

  events: {
    minute: number;
    player: string;
    type: string;
    team: string;
    is_yellow: number;
    is_red: number;
  }[];
}
