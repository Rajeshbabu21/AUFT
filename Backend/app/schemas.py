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

        