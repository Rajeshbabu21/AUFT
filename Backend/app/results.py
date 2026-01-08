from app.db import supabase
from fastapi import HTTPException
from uuid import UUID


async def get_all_match_results():
    try:
        results_res = (
            supabase.table("match_results")
            .select("""
                match_id,
                home_score,
                away_score,
                matchweek,
                updated_at,
                home_team:teams!match_results_home_team_id_fkey(
                    team_name,
                    badge_image_id(image_url)
                ),
                away_team:teams!match_results_away_team_id_fkey(
                    team_name,
                    badge_image_id(image_url)
                )
            """)
            .execute()
        )

        if not results_res.data:
            return []

        match_results = []

        for match in results_res.data:
            events_res = (
                supabase.table("match_events")
                .select("""
                    event_minute,
                    event_type,
                    player_name,
                    is_yellow,
                    is_red,
                    teams(team_name)
                """)
                .eq("match_id", match["match_id"])
                .order("event_minute")
                .execute()
            )

            match_results.append({
                "match_id": match["match_id"],

                "matchweek": match["matchweek"],

                "home_team": {
                    "name": match["home_team"]["team_name"] if match.get("home_team") else None,
                    "image": (
                        match["home_team"]["badge_image_id"]["image_url"]
                        if match.get("home_team") and match["home_team"].get("badge_image_id")
                        else None
                    )
                },

                "away_team": {
                    "name": match["away_team"]["team_name"] if match.get("away_team") else None,
                    "image": (
                        match["away_team"]["badge_image_id"]["image_url"]
                        if match.get("away_team") and match["away_team"].get("badge_image_id")
                        else None
                    )
                },

                "score": {
                    "home": match["home_score"],
                    "away": match["away_score"]
                },

                "events": [
                    {
                        "minute": e["event_minute"],
                        "player": e["player_name"],
                        "type": e["event_type"],
                        "is_yellow": e["is_yellow"],
                        "is_red": e["is_red"],
                        "team": (
                            e["teams"]["team_name"]
                            if e.get("teams") else None
                        )
                    }
                    for e in (events_res.data or [])
                ]
            })

        return match_results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


