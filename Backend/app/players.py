from fastapi import APIRouter, HTTPException
from app.db import supabase

async def users_as_player(team:str):
    try:
        response = supabase.table("users").select("*").eq("team", team).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
