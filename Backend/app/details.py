from fastapi import APIRouter, Depends, HTTPException
from app.db import supabase
from app.schemas import Update_Match_Details,Event
from typing import List


async def create_match_detailsep(details: Update_Match_Details):
    """
    Create match details including scores and events.
    """
    try:
        supabase.table("match_results") \
            .upsert(
                {
                "match_id": str(details.match_id),
                "home_score": details.home_score,
                "away_score": details.away_score,
            },
            on_conflict="match_id"
            ).execute()

        # Insert events
        for event in details.events:
            supabase.table("match_events").upsert(
                {
                    "match_id": str(details.match_id),
                    "team_id": str(event.team_id),
                    "event_minute": event.event_minute,
                    "player_name": event.player_name,
                    "is_yellow": event.is_yellow,
                    "is_red": event.is_red
                },
                on_conflict="match_id,team_id,event_minute"
            ).execute()

        return {"message": "Match details created successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
