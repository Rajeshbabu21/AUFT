from fastapi import APIRouter, HTTPException
from app.db import supabase

async def users_as_player(team:str):
    try:
        response = supabase.table("users").select("*").eq("team", team).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def player_stats():
    """
    Fetch player goal statistics including team name and team image.
    """
    try:
        # Query the view
        response = (
            supabase
            .from_("player_goal_stats")
            .select("*")        # you can also select specific columns
            .order("goals", desc=True)
            .execute()
        )
        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching player stats: {str(e)}"
        )

    

