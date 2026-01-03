from uuid import UUID
from app.db import supabase
from app.schemas import UpdatePoints
async def points_table():
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

async def update_points_table(id:UUID,points_update:UpdatePoints):
    """
    Update points table entry by ID.
    """
    try:
        data = points_update.dict(exclude_unset=True)
        response = supabase.table("points_table").update(data).eq("id", id).execute()
        
        if not response.data:
            raise ValueError("No entry found with the given ID.")
        return (
            {
            "message": "Points table updated successfully",
            "data": response.data
            }
        )
    
    except Exception as e:
        raise ValueError(f"Error updating points table: {e}")
    
async def delete_points(id:UUID):
    """
    delete points table entry by ID.
    """
    try:
        response = supabase.table("points_table").delete().eq("id", id).execute()
        if not response.data:
            raise ValueError("No entry found with the given ID.")
        return {
            "message": "Points table entry deleted successfully"
        }
    
    except Exception as e:
        raise ValueError(f"Error deleting points table entry: {e}")
    
    