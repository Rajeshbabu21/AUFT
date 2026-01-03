import os


from h11 import Response
from fastapi import FastAPI,File, UploadFile
from app.db import supabase
from app.schemas import Image
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

    result = supabase.table("images").insert({
        "image_data": content,
        "image_type": image_type
    }).execute()
    image = result.data[0]

    return {
        "id": image["id"],
        "image_type": image["image_type"]
    }

async def get_image(image_id: UUID): # type: ignore
    result = supabase.table("images") \
        .select("image_data, image_type") \
        .eq("id", image_id) \
        .single() \
        .execute()

    return Response(
        content=result.data["image_data"],
        media_type=result.data["image_type"] or "image/jpeg"
    )

        

    


    

