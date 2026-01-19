from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time
import uuid
from uuid import UUID

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

class adminLogin(BaseModel):
        name: str
        password: str

# for images
class Image(BaseModel):
        id: UUID
        image_url: str
        image_type:Optional[str] = None
        image_data: Optional[str] = None

class TeamCreate(BaseModel):
        team_code:str
        team_name: str
        logo_url: Optional[str] = None
        badge_image_id: UUID

class UpdatePoints(BaseModel):
        matches_played: Optional[int] = None
        wins: Optional[int] = None
        draws: Optional[int] = None
        losses: Optional[int] = None
        points: Optional[int] = None
        position: Optional[int] = None
        qualified: Optional[bool] = None
        goal_Diif: Optional[int] = None

class  CreateMatch(BaseModel):
        match_week:int
        match_time:time
        conduction_date:date
        home_team_name:str
        away_team_name:str

class UpdateMatch(BaseModel):
        match_week:Optional[int]=None
        conduction_date:Optional[date]=None
        match_time:Optional[time]=None
        home_team_name:Optional[str]=None
        away_team_name:Optional[str]=None
        status:Optional[str]=None

class UpdateTeam(BaseModel):
        team_code:Optional[str]=None
        team_name: Optional[str] = None
        logo_url: Optional[str] = None
        badge_image_id: Optional[UUID] = None

class Event(BaseModel):
        team_id:UUID
        player_name:str
        event_minute:int
        event_type:str  # "goal", "yellow_card", "red_card", etc.
        is_yellow:int
        is_red:int
        


class Update_Match_Details(BaseModel):
        match_id:UUID
        home_score:int
        away_score:int
        events:List[Event]




