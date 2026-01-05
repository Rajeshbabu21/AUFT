export interface PointsTableItem {
id: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  position: number;
  qualified: boolean;
  goal_Diif: number;
teams: {
    team_name: string;
    team_code: string;
    images: {
      image_url: string;
    };
  };
}


  