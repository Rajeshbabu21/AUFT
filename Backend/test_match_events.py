"""
Test script for inserting match events and scores
Run this to test the admin backend endpoints
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"  # Change if your backend runs on different port

def get_teams():
    """Get all teams to find team IDs"""
    response = requests.get(f"{BASE_URL}/teams")
    if response.status_code == 200:
        teams = response.json()
        print("Available Teams:")
        for team in teams:
            print(f"  - {team['team_name']}: {team['id']}")
        return teams
    else:
        print(f"Error getting teams: {response.status_code}")
        return []

def create_match_result(match_id, home_score, away_score, events):
    """Create or update match result with events"""
    data = {
        "match_id": match_id,
        "home_score": home_score,
        "away_score": away_score,
        "events": events
    }
    
    print(f"\n📤 Sending match result...")
    print(json.dumps(data, indent=2))
    
    response = requests.post(
        f"{BASE_URL}/update_match-details",
        json=data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Success: {result['message']}")
        print(f"   Events inserted: {result['events_count']}")
        return result
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"   {response.text}")
        return None

def get_match_results():
    """Get all match results"""
    response = requests.get(f"{BASE_URL}/get-match-results")
    if response.status_code == 200:
        results = response.json()
        print(f"\n📊 Found {len(results)} match results")
        for result in results:
            print(f"\nMatchweek {result['matchweek']}: {result['home_team']['name']} {result['score']['home']}-{result['score']['away']} {result['away_team']['name']}")
            print(f"  Events: {len(result['events'])}")
            for event in result['events']:
                print(f"    {event['minute']}' - {event['player']} ({event['type']}) - {event['team']}")
        return results
    else:
        print(f"Error getting results: {response.status_code}")
        return []

# Example usage
if __name__ == "__main__":
    print("=" * 60)
    print("MATCH EVENTS API TEST")
    print("=" * 60)
    
    # Step 1: Get teams
    print("\n1️⃣ Fetching teams...")
    teams = get_teams()
    
    if not teams:
        print("⚠️  No teams found. Please create teams first.")
        exit()
    
    # Step 2: Create sample match result
    print("\n2️⃣ Creating match result...")
    
    # Find team IDs (adjust team names to match your database)
    soccer_hooligans = next((t for t in teams if "Soccer Hooligans" in t['team_name']), None)
    netbusters = next((t for t in teams if "Netbusters" in t['team_name']), None)
    
    if not soccer_hooligans or not netbusters:
        print("⚠️  Teams 'Soccer Hooligans' or 'Netbusters' not found.")
        print("   Please update team names in the script or create these teams.")
        exit()
    
    # Sample match data
    match_id = "071facdf-46c0-497d-bcc6-b00ce0df3edd"  # Replace with actual match ID
    
    events = [
        {
            "team_id": soccer_hooligans['id'],
            "player_name": "Diwakar",
            "event_minute": 21,
            "event_type": "goal",
            "is_yellow": 0,
            "is_red": 0
        },
        {
            "team_id": netbusters['id'],
            "player_name": "Player A",
            "event_minute": 45,
            "event_type": "goal",
            "is_yellow": 0,
            "is_red": 0
        },
        {
            "team_id": netbusters['id'],
            "player_name": "Player B",
            "event_minute": 78,
            "event_type": "goal",
            "is_yellow": 0,
            "is_red": 0
        },
        {
            "team_id": soccer_hooligans['id'],
            "player_name": "Player C",
            "event_minute": 35,
            "event_type": "yellow_card",
            "is_yellow": 1,
            "is_red": 0
        }
    ]
    
    create_match_result(match_id, 1, 2, events)
    
    # Step 3: Verify results
    print("\n3️⃣ Fetching all match results...")
    get_match_results()
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
