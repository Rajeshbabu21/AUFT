from fastapi import FastAPI,HTTPException,Depends,status,UploadFile,File,Response
from app.players import users_as_player
from app.db import supabase
from app.matches import delete_match, fetch_matches
from app.points import delete_points, delete_points, points_table,update_points_table
from app.schemas import TeamCreate, UpdateMatch, UpdatePoints, Users,UserLogin
from app.auth import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES,get_password_hash,get_current_active_user,current_user,current_admin,get_current_active_admin
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.images import fetch_images,insert_image,get_image,insert_team
from uuid import UUID
from fastapi.middleware.cors import CORSMiddleware
from app.matches import create_match,update_points,get_home_away_teams
from app.schemas import CreateMatch,UpdateTeam,Update_Match_Details,Player,RegisterRequest
from app.results import get_all_match_results
from app.teams import update_team,get_teams,team_stats
from app.details import create_match_detailsep, get_match_details, delete_match_result,playersget
from app.players import player_stats
import hashlib
from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel
import os
from typing import Optional

class GoogleSignupData(BaseModel):
    team: str
    position: str
    name: Optional[str] = None
    email: Optional[str] = None # User entered email
    password: Optional[str] = None # User entered password
    owner: bool = False
    icon: bool = False
    is_alumni: bool = False

class GoogleLoginRequest(BaseModel):
    token: str
    signup_data: Optional[GoogleSignupData] = None

app=FastAPI()
origins = [
    "https://auft.vercel.app",
    "http://localhost:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/google_login")
async def google_login(request: GoogleLoginRequest):
    try:
        user_info = None
        email = None
        name = None

        # 1. Try verifying as ID Token
        try:
             idinfo = id_token.verify_oauth2_token(request.token, requests.Request(), GOOGLE_CLIENT_ID)
             # Check for Google issuer
             if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
             email = idinfo['email']
             name = idinfo.get('name', '')
        except Exception:
            # 2. If ID Token fails, try as Access Token (UserInfo endpoint)
            try:
                resp = http_requests.get(
                    f"https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {request.token}"}
                )
                if resp.status_code != 200:
                    raise ValueError(f"Invalid Access Token: {resp.text}")
                
                user_info = resp.json()
                email = user_info.get('email')
                name = user_info.get('name', '')
                
                if not email:
                     raise ValueError("Email not found in Google response")

            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")

        
        # Check if user exists in Supabase
        response = supabase.table("users").select("*").eq("email", email).execute()
        
        user_id = None
        user_data = None

        if response.data:
            # User exists
            if request.signup_data:
                 # If user tries to sign up but account exists
                 raise HTTPException(status_code=400, detail="User already exists with this email. Please Login.")
            
            user_data = response.data[0]
            user_id = user_data['id']
        else:
            # User does NOT exist
            if not request.signup_data:
                # Login attempt but no account
                 raise HTTPException(status_code=404, detail="Account not found. Please Sign Up first.")
            
            # Create new user with supplied Details
            signup_details = request.signup_data
            
            # 1. Verify Email Match
            if signup_details.email and signup_details.email.lower() != email.lower():
                 raise HTTPException(status_code=400, detail=f"Google Email ({email}) does not match entered Email ({signup_details.email})")

            # 2. Determine Password (User provided or validation)
            final_password = "google_auth_placeholder"
            if signup_details.password:
                final_password = signup_details.password
            
            # Use name from form if provided, else Google name
            final_name = signup_details.name if signup_details.name else name
            
            new_user = {
                "name": final_name,
                "email": email,
                "password": get_password_hash(final_password), 
                "team": signup_details.team,
                "owner": signup_details.owner,
                "icon": signup_details.icon,
                "is_alumni": signup_details.is_alumni,
                "is_active": True,
                "position": signup_details.position
            }
            user_res = supabase.table("users").insert(new_user).execute()
            if not user_res.data:
                 raise HTTPException(status_code=500, detail="Failed to create user")
            user_data = user_res.data[0]
            user_id = user_data['id']
            
            # Create player entry
            team_id = None
            try:
                # Resolve team ID
                all_teams = supabase.table("teams").select("id, team_code, team_name").execute()
                if all_teams.data:
                     for team in all_teams.data:
                        if (team.get('team_code', '').upper() == signup_details.team.upper() or 
                            team.get('team_name', '').upper() == signup_details.team.upper()):
                            team_id = team['id']
                            break
            except Exception as e:
                print(f"Error resolving team: {e}")

            player_data = {
                "player_name": final_name,
                "position": signup_details.position,
                "team_id": team_id 
            }
            
            try:
                  supabase.table("players").insert(player_data).execute()
            except Exception as e:
                print(f"Error creating player for google user: {e}")


        # Generate JWT
        access_token = create_access_token(
            data={"sub": email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_data
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Google login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ping")

async def ping():
    return {"ping": "pong!"}

@app.get("/temname")
async def get_team_name():
    response = supabase.table("teams").select("team_name").execute()

    return response.data

@app.post("/register_users")
# def create_user(users:Users):
#     try:
#         users.password = get_password_hash(users.password)
#         data = users.dict()
#         response = supabase.table("users").insert(data).execute()
#         if not response.data:
#             raise HTTPException(status_code=400, detail="User not created")
#         return {
#             "message": "User created successfully",
#             "data": response.data
#         }
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))


def create_user(payload: RegisterRequest):
    try:
        print(f"Received payload: {payload}")
        print(f"User data: name={payload.user.name}, email={payload.user.email}, team={payload.user.team}")
        print(f"Player data: player_name={payload.player.player_name}, position={payload.player.position}")
        
        hashed_password = get_password_hash(payload.user.password)
        user_data = {
            "name": payload.user.name,
            "email": payload.user.email,
            "password": hashed_password,
            "team": payload.user.team,
            "owner": payload.user.owner,
            "position": payload.user.position,
            "icon": payload.user.icon,
            "is_alumni":payload.user.is_alumni,
            "is_active": payload.user.is_active
        }
        print(f"Inserting user: {user_data}")
        user_response = supabase.table("users").insert(user_data).execute()
        print(f"User response: {user_response.data}")

        if not user_response.data:
            raise HTTPException(status_code=400, detail="User not created")
        user_id = user_response.data[0]["id"]

        # Resolve team_id if not provided
        team_id = payload.player.team_id
        if not team_id:
            try:
                print(f"Looking up team with: {payload.user.team}")
                # First, get all teams to see what we have
                all_teams = supabase.table("teams").select("id, team_code, team_name").execute()
                print(f"All teams in database: {all_teams.data}")
                
                # Find team by matching team_code (case-insensitive) or team_name (case-insensitive)
                if all_teams.data:
                    for team in all_teams.data:
                        if (team.get('team_code', '').upper() == payload.user.team.upper() or 
                            team.get('team_name', '').upper() == payload.user.team.upper()):
                            team_id = team['id']
                            print(f"Found team_id: {team_id} for team: {team.get('team_name')}")
                            break
                
                if not team_id:
                    print(f"No team found for: {payload.user.team}")
            except Exception as e:
                print(f"Error resolving team: {e}")
                import traceback
                traceback.print_exc()
                team_id = None

        player_data = {
            "player_name": payload.player.player_name,
            "position": payload.player.position,
            "team_id": str(team_id) if team_id else None,
        }

        print(f"Inserting player: {player_data}")
        player_response = supabase.table("players").insert(player_data).execute()
        print(f"Player response: {player_response.data}")

        if not player_response.data:
            raise HTTPException(status_code=400, detail="Player creation failed")

        access_token = create_access_token(
            data={"sub": user_response.data[0]["email"]},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "message": "User & Player registered successfully",
            "user": user_response.data[0],
            "player": player_response.data[0],
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Exception in create_user: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    

@app.post("/user_login")
def login_users(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        response = (
            supabase
            .table("users")
            .select("*")
            .eq("email", form_data.username)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        user = response.data[0]

        if not verify_password(form_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        access_token = create_access_token(
            data={"sub": user["email"]},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except Exception as e:
        print("LOGIN ERROR:", e)
        raise HTTPException(status_code=500, detail="Login failed")


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



import requests as http_requests

@app.post("/google_login")
async def google_login(request: GoogleLoginRequest):
    try:
        user_info = None
        email = None
        name = None

        # 1. Try verifying as ID Token
        try:
             idinfo = id_token.verify_oauth2_token(request.token, requests.Request(), GOOGLE_CLIENT_ID)
             # Check for Google issuer
             if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
             email = idinfo['email']
             name = idinfo.get('name', '')
        except Exception:
            # 2. If ID Token fails, try as Access Token (UserInfo endpoint)
            try:
                resp = http_requests.get(
                    f"https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {request.token}"}
                )
                if resp.status_code != 200:
                    raise ValueError(f"Invalid Access Token: {resp.text}")
                
                user_info = resp.json()
                email = user_info.get('email')
                name = user_info.get('name', '')
                
                if not email:
                     raise ValueError("Email not found in Google response")

            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")

        
        # Check if user exists in Supabase
        
        # Check if user exists in Supabase
        response = supabase.table("users").select("*").eq("email", email).execute()
        
        user_id = None
        user_data = None

        if response.data:
            # User exists
            if request.signup_data:
                 # If user tries to sign up but account exists
                 raise HTTPException(status_code=400, detail="User already exists with this email. Please Login.")
            
            user_data = response.data[0]
            user_id = user_data['id']
        else:
            # User does NOT exist
            if not request.signup_data:
                # Login attempt but no account
                 raise HTTPException(status_code=404, detail="Account not found. Please Sign Up first.")
            
            # Create new user with supplied Details
            signup_details = request.signup_data
            
            # Use name from form if provided, else Google name
            final_name = signup_details.name if signup_details.name else name
            
            new_user = {
                "name": final_name,
                "email": email,
                "password": get_password_hash("google_auth_placeholder"), # Placeholder password
                "team": signup_details.team,
                "owner": signup_details.owner,
                "icon": signup_details.icon,
                "is_alumni": signup_details.is_alumni,
                "is_active": True,
                "position": signup_details.position
            }
            user_res = supabase.table("users").insert(new_user).execute()
            if not user_res.data:
                 raise HTTPException(status_code=500, detail="Failed to create user")
            user_data = user_res.data[0]
            user_id = user_data['id']
            
            # Create player entry
            team_id = None
            try:
                # Resolve team ID
                all_teams = supabase.table("teams").select("id, team_code, team_name").execute()
                if all_teams.data:
                     for team in all_teams.data:
                        if (team.get('team_code', '').upper() == signup_details.team.upper() or 
                            team.get('team_name', '').upper() == signup_details.team.upper()):
                            team_id = team['id']
                            break
                
                # If team not found by name, stick with None or handle error
            except Exception as e:
                print(f"Error resolving team: {e}")

            player_data = {
                "player_name": final_name,
                "position": signup_details.position,
                "team_id": team_id 
            }
            
            try:
                 supabase.table("players").insert(player_data).execute()
            except Exception as e:
                print(f"Error creating player for google user: {e}")


        # Generate JWT
        access_token = create_access_token(
            data={"sub": email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_data
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Google login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/matches")
# async def get_matches_endpoint(current_user: dict = Depends(get_current_active_user)):
async def get_matches_endpoint():
    """
    Endpoint to get all matches with related team and badge information.
    """
    data = await fetch_matches()
    return data

@app.post("/create_matches")
async def create_match_endpoint(match: CreateMatch):
    """
    Endpoint to create a match and return it with related team and badge info.
    """
    data = await create_match(match)
    return data

@app.put("/update_points/{id}")
async def update_match_endpoint(id:UUID,match:UpdateMatch):
    '''
    Endpoint to update match details by ID.
    '''
    data = await update_points(id,match)
    return data

@app.delete("/delete_match/{id}")
async def delete_match_endpoint(id:UUID):
    '''
    Endpoint to delete a match by ID.
    '''
    data = await delete_match(id)
    return data

@app.get("/points-table")
async def get_points_table_endpoint():
    """
    Endpoint to get all points table data with related team and badge information.
    """
    data = await points_table()
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



@app.get("/users-as-players/{team}")
async def get_users_as_players_by_team(team:str):
    """
    Endpoint to get all users who are players for a specific team.
    """
    data = await users_as_player(team)
    return data


@app.get("/players/{team_name}")
async def get_players_endpoint(team_name: str):
    """
    Endpoint to get all players from the players table for a specific team.
    """
    return await playersget(team_name)


@app.get("/match-details")
async def get_match_details_endpoint():
    """
    Endpoint to get detailed information about a specific match.
    """
      # Import here to avoid circular imports
    data = await get_all_match_results()
    return data

@app.get("/home-away-teams")
async def get_home_away_teams_endpoint():
    """
    Endpoint to get all home and away teams.
    """
    data = await get_home_away_teams()
    return data

@app.get("/getteams")
async def get_teams_endpoint():
    """
    Endpoint to fetch all teams.
    """
    data = await get_teams()
    return data

@app.put("/teams/{team_id}")
async def update_team_endpoint(team_id: str, team: UpdateTeam):
    """
    Endpoint to update a team's information.
    """
    data = await update_team(team_id, team)
    return data



@app.post("/update_match-details")
async def create_match_details_endpoint(details: Update_Match_Details):
    """Create or update match details including scores and events"""
    return await create_match_detailsep(details)


@app.get("/match-details/{match_id}")
async def get_match_details_endpoint(match_id: UUID):
    """Get match details for a specific match"""
    return await get_match_details(match_id)


@app.delete("/match-details/{match_id}")
async def delete_match_result_endpoint(match_id: UUID):
    """Delete match result and all associated events"""
    return await delete_match_result(match_id)


@app.get("/debug/users")
async def debug_users():
    """Debug endpoint to see all users with their team and flags"""
    try:
        response = supabase.table("users").select("name, email, team, owner, icon, is_alumni, position").execute()
        return {"users": response.data, "count": len(response.data)}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/teamstats")
async def get_team_stats_endpoint():
    """
    Endpoint to fetch goals scored, conceded, and goal difference for all teams.
    """
    data = await team_stats()
    return data

@app.get("/player-stats")
async def get_player_stats_endpoint():
    """
    Endpoint to fetch player goal statistics including team name and team image.
    """
    data = await player_stats()
    return data