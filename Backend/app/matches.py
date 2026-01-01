import os
from fastapi import FastAPI
from app.db import supabase


def fetch_matches():
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

def insert_match():
    """
    Insert a new match into the matches table.
    """
    response = supabase.table("matches").insert().execute()
    return response.data