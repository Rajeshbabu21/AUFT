export interface PlayersTableItem {
  id: string;
  player_name: string;
  team_id: string;
  position: string;
  owner?: boolean;
  icon?: boolean;
  is_alumni?: boolean;
}