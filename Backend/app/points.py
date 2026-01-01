from app.db import supabase

def points_table():
    """
    Fetch all points table data with related team and badge info.
    """
    response = (supabase.table("points_table")
                .select(
            """
            position,
            points,
            matches_played,
            wins,
            draws,
            losses,
            qualified,
            teams:team_id(
            team_name,
            images:badge_image_id(
            image_url)
            )"""))\
    .order("position").execute()
    return response.data
