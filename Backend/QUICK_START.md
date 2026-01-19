# Quick Start Guide: Admin Backend for Match Events & Scores

## What's Been Updated

### 1. **Schema Changes** ([schemas.py](Backend/app/schemas.py))
- Added `event_type` field to `Event` class
- Now supports: `"goal"`, `"yellow_card"`, `"red_card"`, etc.

### 2. **Enhanced Details Module** ([details.py](Backend/app/details.py))
- ✅ `create_match_detailsep()` - Create/update match results with events
- ✅ `get_match_details()` - Get details for a specific match
- ✅ `delete_match_result()` - Delete match result and events
- Automatically fetches `matchweek` from matches table
- Prevents duplicate events (deletes old ones before inserting)
- Better error handling

### 3. **API Endpoints** ([app.py](Backend/app/app.py))
- `POST /update_match-details` - Create/update match results
- `GET /match-details/{match_id}` - Get specific match details
- `DELETE /match-details/{match_id}` - Delete match result
- `GET /get-match-results` - Get all match results (already existed)

### 4. **Frontend Type Fix** ([Results.tsx](src/@types/Results.tsx))
- Changed `match_week` → `matchweek` to match API response

---

## How to Use

### Quick Example - Insert Match Result with Events

```python
import requests

# 1. Get team IDs first
teams = requests.get("http://localhost:8000/teams").json()

# 2. Insert match result
data = {
    "match_id": "071facdf-46c0-497d-bcc6-b00ce0df3edd",
    "home_score": 1,
    "away_score": 2,
    "events": [
        {
            "team_id": "uuid-of-team",
            "player_name": "Diwakar",
            "event_minute": 21,
            "event_type": "goal",
            "is_yellow": 0,
            "is_red": 0
        }
    ]
}

response = requests.post(
    "http://localhost:8000/update_match-details",
    json=data
)
print(response.json())
```

### Using the Test Script

```bash
cd Backend
python test_match_events.py
```

This will:
1. Fetch all teams
2. Create a sample match result with events
3. Display all match results to verify

---

## Database Tables Used

### `match_results`
Stores match scores:
- `match_id` (PK, FK to matches)
- `matchweek`
- `home_team_id` (FK to teams)
- `away_team_id` (FK to teams)
- `home_score`
- `away_score`

### `match_events`
Stores individual events:
- `match_id` (FK to matches)
- `team_id` (FK to teams)
- `player_name`
- `event_minute`
- `event_type` (goal, yellow_card, red_card, etc.)
- `is_yellow`
- `is_red`

---

## Key Improvements Made

### Before (Issues):
- ❌ Missing `event_type` field
- ❌ No automatic `matchweek` fetching
- ❌ Could create duplicate events
- ❌ Property name mismatch (`match_week` vs `matchweek`)
- ❌ No way to retrieve or delete match results

### After (Fixed):
- ✅ `event_type` field added and used
- ✅ Automatically fetches `matchweek` from matches
- ✅ Deletes old events before inserting new ones
- ✅ Property names match between frontend and backend
- ✅ Full CRUD operations available
- ✅ Better error handling with descriptive messages

---

## Testing Checklist

- [ ] Backend is running (`uvicorn app.app:app --reload`)
- [ ] Teams exist in database
- [ ] Matches exist in database
- [ ] Get team IDs using `GET /teams`
- [ ] Insert match result using `POST /update_match-details`
- [ ] Verify in frontend - events should now display
- [ ] Check goals count, yellow cards, red cards display correctly

---

## Troubleshooting

### Events not showing?
1. Check browser console for errors
2. Verify `matchweek` property name in frontend
3. Ensure `event_type` is included in request
4. Check database has all required columns

### Team ID errors?
- Use `GET /teams` endpoint to get correct UUIDs
- Don't hardcode team IDs - fetch them dynamically

### Duplicate events?
- The endpoint now deletes existing events before inserting
- Each call replaces all events for that match

---

## Next Steps

1. **Test the endpoints** using the test script
2. **Update your admin UI** to use these endpoints
3. **Add authentication** (currently missing from these endpoints)
4. **Consider adding**:
   - Pagination for match results
   - Filtering by matchweek
   - Search functionality
   - Event validation (e.g., minute must be 0-120)

---

## Files Created/Modified

### Created:
- [Backend/API_USAGE_EXAMPLES.md](Backend/API_USAGE_EXAMPLES.md) - Detailed API documentation
- [Backend/test_match_events.py](Backend/test_match_events.py) - Test script
- [Backend/QUICK_START.md](Backend/QUICK_START.md) - This file

### Modified:
- [Backend/app/schemas.py](Backend/app/schemas.py) - Added `event_type`
- [Backend/app/details.py](Backend/app/details.py) - Enhanced with new functions
- [Backend/app/app.py](Backend/app/app.py) - Added new endpoints
- [src/@types/Results.tsx](src/@types/Results.tsx) - Fixed property name
- [src/admin/components/MatchResults.tsx](src/admin/components/MatchResults.tsx) - Fixed property name
