from fastapi import APIRouter, HTTPException, Depends
from app.db import supabase
from app.schemas import UpdateTeam
from typing import List


async def get_teams():
    """
    Fetch all teams from the database.
    """
    try:
        response = supabase.table("teams").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def update_team(team_id: str, data: UpdateTeam):
    try:
        updated = data.dict(exclude_unset=True)
        allowed_fields = {"team_code", "team_name"}

        fliterd = {
            key: value
            for key, value in updated.items()
            if key in allowed_fields
        }
        if not fliterd:
            raise HTTPException(status_code=400, detail="No valid fields to update.")
        
        response = supabase.table("teams").update(fliterd).eq("id", team_id).execute()
        return {
            "message": "Team updated successfully",
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))