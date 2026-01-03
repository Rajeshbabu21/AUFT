import os


# from h11 import Response
from fastapi import FastAPI,File, UploadFile,HTTPException,Response
import base64
from app.db import supabase
from app.schemas import Image,TeamCreate
import uuid
from uuid import UUID

async def fetch_images():
    """
    Fetch all images from the images table.
    """
    try:
        response = supabase.table("images").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching images: {e}")
        return []
    
async def insert_image(file: UploadFile = File(...), image_type: str = None):
    """
    insert a new image into the images table.
    """
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise ValueError("Invalid image type. Only JPEG, PNG, and GIF are allowed.")
    ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{ext}"
    content = await file.read()
    encoded_content = base64.b64encode(content).decode("utf-8")  # convert to string

    result = supabase.table("images").insert({
        "image_data": encoded_content,
        "image_type": image_type
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to insert image")
    return ({
        "id": result.data[0]["id"],
        "image_url": f"/images/{result.data[0]['id']}",
        "image_type": image_type
    })

async def get_image(image_id: UUID):
    # Convert UUID to string for Supabase query
    image_id_str = str(image_id)

    result = supabase.table("images") \
        .select("image_data, image_type") \
        .eq("id", image_id_str) \
        .single() \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_data = result.data.get("image_data")
    image_type = result.data.get("image_type") or "image/jpeg"

    if not image_data:
        raise HTTPException(status_code=404, detail="Image data is empty")

    # Make sure Base64 string is clean
    image_data = image_data.strip()  # remove whitespace/newlines

    # Fix padding
    def fix_base64_padding(b64_string: str) -> str:
        return b64_string + "=" * ((4 - len(b64_string) % 4) % 4)
    
    try:
        image_bytes = base64.b64decode(fix_base64_padding(image_data), validate=True)
    except Exception as e:
        # Log the original string length and first few characters for debugging
        print(f"Failed to decode Base64. Length: {len(image_data)}, Start: {image_data[:30]}")
        raise HTTPException(status_code=500, detail="Error decoding image data")

    return Response(
        content=image_bytes,
        media_type=image_type
    )


async def insert_team(team: TeamCreate):
    """
    insert a new team into the teams table.
    """
    result = supabase.table("teams").insert(
            {
                "team_code": team.team_code,
                "team_name": team.team_name,
                "logo_url": team.logo_url,
                "badge_image_id": str(team.badge_image_id)
            }
        ).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create team")
    
    return result.data[0]

    