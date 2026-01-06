from fastapi import FastAPI,HTTPException,Depends,status,UploadFile,File,Response
from app.db import supabase
from app.matches import delete_match, fetch_matches
from app.points import delete_points, delete_points, points_table,update_points_table
from app.schemas import TeamCreate, UpdatePoints, Users,UserLogin
from app.auth import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES,get_password_hash,get_current_active_user,current_user,current_admin,get_current_active_admin
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.images import fetch_images,insert_image,get_image,insert_team
from uuid import UUID
from fastapi.middleware.cors import CORSMiddleware
from app.matches import create_match
from app.schemas import CreateMatch

import hashlib


app=FastAPI()
origins = [
    "https://auft.onrender.com/",
    "http://localhost:10000",
    "http://localhost:8000",
      # The default port for Vite React app
    # Add the production URL of your React app here when deploying
]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins= ["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")

async def ping():
    return {"ping": "pong!"}

@app.post("/register_users")
def create_user(users:Users):
    try:
        users.password = get_password_hash(users.password)
        data = users.dict()
        response = supabase.table("users").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="User not created")
        return {
            "message": "User created successfully",
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/user_login")
def login_users(form_data:OAuth2PasswordRequestForm = Depends()):
    response = (
        supabase
        .table("users")
        .select("*")
        .eq("email", form_data.username)
        .execute()

    )
    user = response.data

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user = user[0]
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user["email"], "email": user["email"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    # 5️⃣ Return token
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }



#  admim
@app.post("/register_admin")
def create_user(users:Users):
    try:
        users.password = get_password_hash(users.password)
        data = users.dict()
        response = supabase.table("admin").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Admin not created")
        return {
            "message": "admin created successfully",
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
 
@app.post("/admin_login")
def login_admin(form_data:OAuth2PasswordRequestForm = Depends()):
    response = (
        supabase
        .table("admin")
        .select("*")
        .eq("email", form_data.username)
        .execute()

    )
    user = response.data

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user = user[0]
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user["email"], "email": user["email"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    # 5️⃣ Return token
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }




@app.get("/matches")
# async def get_matches_endpoint(current_user: dict = Depends(get_current_active_user)):
async def get_matches_endpoint():
    """
    Endpoint to get all matches with related team and badge information.
    """
    data = await fetch_matches()
    return data

@app.get("/points-table")
async def get_points_table_endpoint():
    """
    Endpoint to get all points table data with related team and badge information.
    """
    data = await points_table()
    return data
    
@app.get("/images")
async def get_images():
    """
    Endpoint to get all images.
    """
    data = await fetch_images()
    return data

@app.post("/upload-image")
async def upload_image(file:UploadFile= File(...), image_type:str=None):
    """
    Endpoint to upload a new image.
    """
    data = await insert_image(file,image_type)
    return data

@app.get("/images/{image_id}",response_model=None)
async def get_single_image(image_id: UUID):
    """
    Endpoint to fetch a single image by ID.
    """
    data = await get_image(image_id)
    return  data

@app.post("/teams")
async def create_team(team:TeamCreate):
    """
    Endpoint to create a new team.
    """
    data = await insert_team(team)
    return data

@app.put("/points-table/{id}")
async def update_points_table_endpoint(id: UUID, points_update: UpdatePoints):
    """
    Endpoint to update a points table entry by ID.
    """
    data = await update_points_table(id, points_update)
    return data

@app.delete("/points-table/{id}")
async def delete_points_table_endpoint(id: UUID):
    """
    Endpoint to delete a points table entry by ID.
    """
    data = await delete_points(id)
    return data

@app.post("/create_matches")
async def create_match_endpoint(match: CreateMatch):
    """
    Endpoint to create a match and return it with related team and badge info.
    """
    data = await create_match(match)
    return data

@app.delete("/delete_match/{id}")
async def delete_match_endpoint(id:UUID):
    '''
    Endpoint to delete a match by ID.
    '''
    data = await delete_match(id)
    return data

