export interface PlayerStat {
  player_id: string;
  player_name: string;
  goals: number;
  team_id: string;
  team_name: string;
  team_image: string;
  player_position?: string | null;
}
