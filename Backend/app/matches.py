from email.policy import HTTP
import os
from uuid import UUID
from fastapi import FastAPI,HTTPException
from app.db import supabase
from app.schemas import CreateMatch


async def fetch_matches():
    """
    Fetch all matches with related team and badge info.
    """
    response = (supabase.table("matches").select("""
        id,
        match_week,
        match_date,
        match_time,
        home_team:home_team_id (
            team_name,
            badge:badge_image_id (
                image_url
            )
        ),
        away_team:away_team_id (
            team_name,
            badge:badge_image_id (
                image_url
            )
        )
    """).execute()
    )
    return response.data


async def create_match(data: CreateMatch):
    """
    Create a match using team names and return match with badge images.
    """

    # 1️⃣ Get home team id
    home_team = (
        supabase.table("teams")
        .select("id")
        .eq("team_name", data.home_team_name)
        .single()
        .execute()
    )

    # 2️⃣ Get away team id
    away_team = (
        supabase.table("teams")
        .select("id")
        .eq("team_name", data.away_team_name)
        .single()
        .execute()
    )

    # 3️⃣ Insert match using IDs
    insert_response = (
        supabase.table("matches")
        .insert({
            "match_week": data.match_week,
            "match_date": str(data.match_date),
            "match_time": str(data.match_time),
            "home_team_id": home_team.data["id"],
            "away_team_id": away_team.data["id"]
        })
        .execute()
    )

    match_id = insert_response.data[0]["id"]

    # 4️⃣ Fetch match (same format as fetch_matches)
    response = (
        supabase.table("matches")
        .select("""
            id,
            match_week,
            match_date,
            match_time,
            home_team:home_team_id (
                team_name,
                badge:badge_image_id (
                    image_url
                )
            ),
            away_team:away_team_id (
                team_name,
                badge:badge_image_id (
                    image_url
                )
            )
        """)
        .eq("id", match_id)
        .single()
        .execute()
    )

    return response.data


def insert_match():
    """
    Insert a new match into the matches table.
    """
    response = supabase.table("matches").insert().execute()
    return response.data

async def delete_match(id:UUID):
    '''
    Docstring for delete_match
    '''
    try:
        response = supabase.table("matches").delete().eq("id",id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
