from fastapi import APIRouter, Depends, HTTPException
from app.db import supabase
from app.schemas import Update_Match_Details,Event
from typing import List
from uuid import UUID


async def create_match_detailsep(details: Update_Match_Details):
    """
    Create or update match details including scores and events.
    """
    try:
        # Get matchweek from matches table
        match_data = (
            supabase.table("matches")
            .select("match_week, home_team_id, away_team_id")
            .eq("id", str(details.match_id))
            .single()
            .execute()
        )
        
        if not match_data.data:
            raise HTTPException(status_code=404, detail="Match not found")
        
        # Upsert match results with matchweek, home_team_id, and away_team_id
        result = supabase.table("match_results").upsert(
            {
                "match_id": str(details.match_id),
                "home_score": details.home_score,
                "away_score": details.away_score,
                "matchweek": match_data.data["match_week"],
                "home_team_id": match_data.data["home_team_id"],
                "away_team_id": match_data.data["away_team_id"],
            },
            on_conflict="match_id"
        ).execute()

        # Delete existing events for this match (to avoid duplicates)
        supabase.table("match_events").delete().eq("match_id", str(details.match_id)).execute()

        # Insert new events
        if details.events:
            events_to_insert = [
                {
                    "match_id": str(details.match_id),
                    "team_id": str(event.team_id),
                    "event_minute": event.event_minute,
                    "player_name": event.player_name,
                    "event_type": event.event_type,
                    "is_yellow": event.is_yellow,
                    "is_red": event.is_red
                }
                for event in details.events
            ]
            supabase.table("match_events").insert(events_to_insert).execute()

        return {
            "message": "Match details created successfully.",
            "match_id": str(details.match_id),
            "events_count": len(details.events) if details.events else 0
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating match details: {str(e)}")


async def get_match_details(match_id: UUID):
    """
    Get match details including scores and events for a specific match.
    """
    try:
        # Get match result
        result = (
            supabase.table("match_results")
            .select("*")
            .eq("match_id", str(match_id))
            .single()
            .execute()
        )
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Match result not found")
        
        # Get events
        events = (
            supabase.table("match_events")
            .select("*")
            .eq("match_id", str(match_id))
            .order("event_minute")
            .execute()
        )
        
        return {
            "match_id": result.data["match_id"],
            "home_score": result.data["home_score"],
            "away_score": result.data["away_score"],
            "matchweek": result.data.get("matchweek"),
            "events": events.data or []
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching match details: {str(e)}")


async def delete_match_result(match_id: UUID):
    """
    Delete match result and all associated events.
    """
    try:
        # Delete events first (foreign key constraint)
        supabase.table("match_events").delete().eq("match_id", str(match_id)).execute()
        
        # Delete match result
        result = supabase.table("match_results").delete().eq("match_id", str(match_id)).execute()
        
        return {"message": "Match result deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting match result: {str(e)}")
    

async def playersget(team_name: str):
    """
    Get all players for a specific team by team name.
    Returns a list of players with their details including owner, icon, and is_alumni flags.
    """
    try:
        print(f"[DEBUG] Fetching players for team: {team_name}")
        
        # First, get the team_id and team_code for the given team_name
        team_response = (
            supabase
            .table("teams")
            .select("id, team_name, team_code")
            .eq("team_name", team_name)
            .execute()
        )
        
        print(f"[DEBUG] Team response: {team_response.data}")
        
        if not team_response.data or len(team_response.data) == 0:
            print(f"[ERROR] Team '{team_name}' not found in database")
            raise HTTPException(status_code=404, detail=f"Team '{team_name}' not found")
        
        team_id = team_response.data[0]["id"]
        team_code = team_response.data[0]["team_code"]
        print(f"[DEBUG] Found team_id: {team_id}, team_code: {team_code}")
        
        # Get players from players table
        players_response = (
            supabase
            .table("players")
            .select("id, player_name, position, team_id")
            .eq("team_id", team_id)
            .execute()
        )
        
        print(f"[DEBUG] Players response: {players_response.data}")
        
        # Get users data with owner, icon, is_alumni flags
        # Get ALL users and match by normalized team name
        users_response = supabase.table("users").select("name, team, owner, icon, is_alumni, position").execute()
        
        print(f"[DEBUG] All users fetched: {len(users_response.data) if users_response.data else 0} users")
        
        # Normalize team_name for matching (lowercase, replace spaces with hyphens)
        normalized_team_name = team_name.lower().replace(' ', '-')
        
        print(f"[DEBUG] Normalized team name: {normalized_team_name}")
        
        # Merge player and user data
        merged_data = []
        for player in players_response.data:
            # Get player name and clean it (trim whitespace, lowercase for matching)
            player_name = player.get("player_name", "").strip()
            player_name_lower = player_name.lower()
            
            # Find matching user by name and team (case-insensitive and trimmed)
            matching_user = None
            if users_response and users_response.data:
                matching_user = next(
                    (u for u in users_response.data 
                     if u.get("name", "").strip().lower() == player_name_lower and 
                        u.get("team", "").lower().replace(' ', '-') == normalized_team_name),
                    None
                )
            
            print(f"[DEBUG] Player: '{player_name}' (original: '{player.get('player_name')}') - Matched user: {matching_user.get('name') if matching_user else 'None'}")
            if matching_user:
                print(f"[DEBUG]   Flags: owner={matching_user.get('owner')}, icon={matching_user.get('icon')}, is_alumni={matching_user.get('is_alumni')}")
            
            # Create merged record
            merged_player = {
                "id": player.get("id"),
                "player_name": player.get("player_name"),
                "position": player.get("position"),
                "team_id": player.get("team_id"),
                "owner": matching_user.get("owner", False) if matching_user else False,
                "icon": matching_user.get("icon", False) if matching_user else False,
                "is_alumni": matching_user.get("is_alumni", False) if matching_user else False,
            }
            merged_data.append(merged_player)
        
        print(f"[DEBUG] Merged data being returned: {merged_data}")
        return merged_data

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Exception in playersget: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching players: {str(e)}"
        )
    
