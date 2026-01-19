# Admin Backend API - Match Events & Scores

## Overview
This guide shows how to insert match events and scores for scheduled matches using the admin backend.

## API Endpoints

### 1. Create/Update Match Details with Events and Scores

**Endpoint:** `POST /update_match-details`

**Description:** Creates or updates match results including scores and events (goals, cards, etc.)

**Request Body:**
```json
{
  "match_id": "071facdf-46c0-497d-bcc6-b00ce0df3edd",
  "home_score": 1,
  "away_score": 2,
  "events": [
    {
      "team_id": "uuid-of-soccer-hooligans",
      "player_name": "Diwakar",
      "event_minute": 21,
      "event_type": "goal",
      "is_yellow": 0,
      "is_red": 0
    },
    {
      "team_id": "uuid-of-netbusters",
      "player_name": "Player Name",
      "event_minute": 45,
      "event_type": "goal",
      "is_yellow": 0,
      "is_red": 0
    },
    {
      "team_id": "uuid-of-netbusters",
      "player_name": "Player Name",
      "event_minute": 78,
      "event_type": "goal",
      "is_yellow": 0,
      "is_red": 0
    },
    {
      "team_id": "uuid-of-soccer-hooligans",
      "player_name": "Player Name",
      "event_minute": 35,
      "event_type": "yellow_card",
      "is_yellow": 1,
      "is_red": 0
    },
    {
      "team_id": "uuid-of-netbusters",
      "player_name": "Player Name",
      "event_minute": 89,
      "event_type": "red_card",
      "is_yellow": 0,
      "is_red": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Match details created successfully.",
  "match_id": "071facdf-46c0-497d-bcc6-b00ce0df3edd",
  "events_count": 5
}
```

---

### 2. Get Match Details

**Endpoint:** `GET /match-details/{match_id}`

**Description:** Retrieves match results and all events for a specific match

**Example:**
```
GET /match-details/071facdf-46c0-497d-bcc6-b00ce0df3edd
```

**Response:**
```json
{
  "match_id": "071facdf-46c0-497d-bcc6-b00ce0df3edd",
  "home_score": 1,
  "away_score": 2,
  "matchweek": 2,
  "events": [
    {
      "match_id": "071facdf-46c0-497d-bcc6-b00ce0df3edd",
      "team_id": "uuid-of-team",
      "player_name": "Diwakar",
      "event_minute": 21,
      "event_type": "goal",
      "is_yellow": 0,
      "is_red": 0
    }
  ]
}
```

---

### 3. Get All Match Results

**Endpoint:** `GET /get-match-results`

**Description:** Retrieves all match results with team info and events

**Response:**
```json
[
  {
    "match_id": "071facdf-46c0-497d-bcc6-b00ce0df3edd",
    "matchweek": 2,
    "home_team": {
      "name": "Soccer Hooligans",
      "image": "https://ik.imagekit.io/4uskfr8sji/sh.png"
    },
    "away_team": {
      "name": "Netbusters",
      "image": "https://ik.imagekit.io/4uskfr8sji/nb.png"
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "events": [
      {
        "minute": 21,
        "player": "Diwakar",
        "type": "goal",
        "is_yellow": 0,
        "is_red": 0,
        "team": "Soccer Hooligans"
      }
    ]
  }
]
```

---

### 4. Delete Match Result

**Endpoint:** `DELETE /match-details/{match_id}`

**Description:** Deletes match result and all associated events

**Example:**
```
DELETE /match-details/071facdf-46c0-497d-bcc6-b00ce0df3edd
```

**Response:**
```json
{
  "message": "Match result deleted successfully"
}
```

---

## Event Types

The `event_type` field can be:
- `"goal"` - A goal scored
- `"yellow_card"` - Yellow card shown
- `"red_card"` - Red card shown
- `"substitution"` - Player substitution (if needed)
- `"penalty"` - Penalty kick (if needed)

## Important Notes

### 1. **Getting Team IDs**
To insert events, you need the team UUID. You can get this from:

**Endpoint:** `GET /teams`

This returns all teams with their IDs:
```json
[
  {
    "id": "uuid-here",
    "team_name": "Soccer Hooligans",
    "team_code": "SH",
    "badge_image_id": "..."
  }
]
```

### 2. **Event Flags**
- For **goals**: `event_type: "goal"`, `is_yellow: 0`, `is_red: 0`
- For **yellow cards**: `event_type: "yellow_card"`, `is_yellow: 1`, `is_red: 0`
- For **red cards**: `event_type: "red_card"`, `is_yellow: 0`, `is_red: 1`

### 3. **Updating Existing Results**
The endpoint uses `upsert`, so:
- If a match result exists, it will be **updated**
- All existing events are **deleted** and replaced with new ones
- This prevents duplicate events

### 4. **Database Structure**
The backend automatically:
- Fetches `matchweek` from the `matches` table
- Links events to teams via `team_id`
- Maintains referential integrity

---

## Example: Complete Workflow

### Step 1: Get Team IDs
```bash
curl -X GET "http://localhost:8000/teams"
```

### Step 2: Insert Match Results
```bash
curl -X POST "http://localhost:8000/update_match-details" \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": "071facdf-46c0-497d-bcc6-b00ce0df3edd",
    "home_score": 1,
    "away_score": 2,
    "events": [
      {
        "team_id": "team-uuid-here",
        "player_name": "Diwakar",
        "event_minute": 21,
        "event_type": "goal",
        "is_yellow": 0,
        "is_red": 0
      }
    ]
  }'
```

### Step 3: Verify Results
```bash
curl -X GET "http://localhost:8000/get-match-results"
```

---

## Troubleshooting

### Events not showing in frontend?
1. ✅ Check `matchweek` vs `match_week` property names match
2. ✅ Verify `event_type` field is included
3. ✅ Ensure team_id is correct UUID
4. ✅ Check browser console for API errors
5. ✅ Verify database has `event_type` column in `match_events` table

### Common Errors
- **404 Match not found**: The match_id doesn't exist in `matches` table
- **500 Server error**: Check if database schema matches (columns exist)
- **Duplicate events**: Events are deleted first, then inserted fresh each time
