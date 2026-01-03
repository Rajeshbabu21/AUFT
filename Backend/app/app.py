from fastapi import FastAPI,HTTPException,Depends,status,UploadFile
from app.db import supabase
from app.matches import fetch_matches
from app.points import points_table
from app.schemas import Users,UserLogin
from app.auth import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES,get_password_hash,get_current_active_user,current_user,current_admin,get_current_active_admin
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.images import fetch_images,insert_image,get_image
from click import UUID


app=FastAPI()
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
    
@app.post("/admin_users")
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
        .eq("name", form_data.username)
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
async def get_matches_endpoint(current_user: dict = Depends(get_current_active_user)):
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
    
@app.get("/images")
async def get_images():
    """
    Endpoint to get all images.
    """
    data = fetch_images()
    return data

@app.get("/upload-image")
def upload_image(file:UploadFile,image_type:str=None):
    """
    Endpoint to upload a new image.
    """
    data = insert_image(file,image_type)
    return data

