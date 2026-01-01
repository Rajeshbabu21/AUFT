from fastapi import FastAPI
from app.db import supabase
from app.matches import fetch_matches
from app.points import points_table

app=FastAPI()
@app.get("/ping")

async def ping():
    return {"ping": "pong!"}

@app.get("/matches")
async def get_matches_endpoint():
    """
    Endpoint to get all matches with related team and badge information.
    """
    data = fetch_matches()
    return data

@app.get("/points-table")
async def get_points_table_endpoint():
    """
    Endpoint to get all points table data with related team and badge information.
    """
    data = points_table()
    return data
    
