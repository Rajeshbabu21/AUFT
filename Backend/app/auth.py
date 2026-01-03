from passlib.context import CryptContext
from app.db import supabase
from app.schemas import Users, UserLogin,TokenData,Token
from fastapi import HTTPException, status,Depends
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from typing import Optional


load_dotenv()
SECRET_KEY = os.getenv("secret_key")
ALGORITHM = os.getenv("algorithm")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("access_token_expire_minutes"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin_login")

def verify_password(plain_password:str, password: str)->bool:
    return pwd_context.verify(plain_password[:72], password)

def get_password_hash(password: str)->str:
    password = password[:72]
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verfiy_token(token:str)->TokenData:
    credentials_exception = HTTPException(
        status_code=401,
        detail="could not validate",
        headers={"WWW-Authenticate":"Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.PyJWTError:
        raise credentials_exception
    return token_data

def current_user(token:str=Depends(oauth2_scheme)):
    token_data = verfiy_token(token)
    response = supabase.table("users").select("*").eq("email",token_data.email).execute()
    user = response.data
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user[0]

def get_current_active_user(current_user: dict = Depends(current_user)):
    return current_user


def current_admin(token:str=Depends(oauth2_scheme)):
    token_data = verfiy_token(token)
    response = supabase.table("users").select("*").eq("email",token_data.email).execute()
    user = response.data
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user[0]

def get_current_active_admin(current_user: dict = Depends(current_admin)):
    return current_admin
