from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class matches(BaseModel):
        id:int
        home_team_id: int
        away_team_id: int
        ground_id: int
        match_date:date
        match_time:time
        status:str
        match_week:int

class Users(BaseModel):
        name:str
        email:str
        password:str
        team:str
        is_active:Optional[bool]=True

class Token(BaseModel):
        access_token: str
        token_type: str

class TokenData(BaseModel):
        email: Optional[str] = None

class UserLogin(BaseModel):
        email: str
        password: str