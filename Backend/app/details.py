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
    try:
        response = (
            supabase
            .table("players")
            .select("player_name, teams(team_name)")
            .eq("teams.team_name", team_name)
            .execute()
        )

        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching players: {str(e)}"
        )
    
