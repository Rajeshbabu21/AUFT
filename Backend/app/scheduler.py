from datetime import datetime, timedelta
from app.db import supabase
from app.email_service import send_match_email

def check_and_send_reminders():
    now = datetime.now()
    target = now + timedelta(minutes=5)

    matches = supabase.table("matches") \
        .select("*") \
        .eq("conduction_date", target.date().isoformat()) \
        .eq("mail_sent", False) \
        .execute()

    for match in matches.data:
        if match["match_time"][:5] == target.strftime("%H:%M"):
            home = supabase.table("teams").select("team_name").eq("id", match["home_team_id"]).execute()
            away = supabase.table("teams").select("team_name").eq("id", match["away_team_id"]).execute()

            # Fetch all users from the database
            users = supabase.table("users").select("email").execute()

            # Send email to ALL Users in the database
            sent_count = 0
            if users.data:
                print(f"Sending match reminders to {len(users.data)} users...")
                for user in users.data:
                    if user.get("email"):
                        success = send_match_email(
                            user["email"],
                            home.data[0]["team_name"],
                            away.data[0]["team_name"],
                            match["conduction_date"],
                            match["match_time"],
                            match.get("match_week")
                        )
                        if success:
                            sent_count += 1
            
            print(f"Emails sent successfully: {sent_count}/{len(users.data) if users.data else 0}")

            if sent_count > 0:
                supabase.table("matches") \
                    .update({"mail_sent": True}) \
                    .eq("id", match["id"]) \
                    .execute()
