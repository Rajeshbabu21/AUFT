import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from app.db import supabase

def send_match_email(to_email, home, away, date, time, match_week=None):
    # Fetch team details from database to get images
    home_team = supabase.table("teams").select("team_code, badge_image_id").eq("team_name", home).execute()
    away_team = supabase.table("teams").select("team_code, badge_image_id").eq("team_name", away).execute()
    
    home_image = None
    away_image = None
    home_code = home
    away_code = away
    
    # Get home team image
    if home_team.data:
        home_code = home_team.data[0].get("team_code", home)
        badge_id = home_team.data[0].get("badge_image_id")
        if badge_id:
            image_data = supabase.table("images").select("image_url").eq("id", badge_id).execute()
            if image_data.data:
                home_image = image_data.data[0].get("image_url")
    
    # Get away team image
    if away_team.data:
        away_code = away_team.data[0].get("team_code", away)
        badge_id = away_team.data[0].get("badge_image_id")
        if badge_id:
            image_data = supabase.table("images").select("image_url").eq("id", badge_id).execute()
            if image_data.data:
                away_image = image_data.data[0].get("image_url")
    
    # Convert 24-hour time to 12-hour format
    time_parts = time.split(":")
    hour = int(time_parts[0])
    minute = time_parts[1]
    am_pm = "AM" if hour < 12 else "PM"
    hour_12 = hour if hour <= 12 else hour - 12
    if hour == 0:
        hour_12 = 12
    time_12hr = f"{hour_12}:{minute} {am_pm}"
    
    # Create a multipart email (for HTML content)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "⚽ Match Starting Soon"
    msg["From"] = os.getenv("SMTP_USER")
    msg["To"] = to_email

    # HTML content with CSS styling - Dark theme matching website
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            body {{
                font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #0f172a;
                line-height: 1.6;
            }}
            .container {{
                max-width: 650px;
                width: 100%;
                margin: 20px auto;
                background-color: #1e293b;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                overflow: hidden;
                border: 1px solid #334155;
            }}
            .header {{
                background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                padding: 25px 20px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                gap: 15px;
            }}
            .header img {{
                width: 60px;
                height: 60px;
                border-radius: 8px;
                object-fit: cover;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }}
            .header-title {{
                flex: 1;
                text-align: center;
                color: white;
            }}
            .header-title h1 {{
                font-size: 24px;
                font-weight: 700;
                margin: 0;
                letter-spacing: 0.5px;
            }}
            .content {{
                padding: 35px 25px;
            }}
            .section-title {{
                text-align: center;
                margin-bottom: 5px;
            }}
            .match-week {{
                background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                color: white;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                display: inline-block;
                margin-bottom: 12px;
            }}
            .match-date {{
                color: #f1f5f9;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 20px;
            }}
            .match-container {{
                background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%);
                border: 2px solid #0ea5e9;
                border-radius: 12px;
                padding: 28px 20px;
                margin-bottom: 25px;
            }}
            .teams-row {{
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 12px;
                align-items: center;
            }}
            .team {{
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }}
            .team-badge {{
                width: 75px;
                height: 75px;
                border-radius: 10px;
                border: 3px solid #0ea5e9;
                object-fit: cover;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
            }}
            .team-badge-placeholder {{
                width: 75px;
                height: 75px;
                border-radius: 10px;
                border: 3px solid #0ea5e9;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0ea5e9;
                font-weight: 700;
                font-size: 20px;
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
            }}
            .team-name {{
                color: #e0f2fe;
                font-size: 13px;
                font-weight: 600;
                text-align: center;
            }}
            .team-code {{
                color: #7dd3fc;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }}
            .vs-box {{
                text-align: center;
            }}
            .vs-text {{
                color: #0ea5e9;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 6px;
            }}
            .match-time {{
                color: #0ea5e9;
                font-size: 24px;
                font-weight: 700;
            }}
            .reminder-section {{
                background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%);
                border: 2px solid #0ea5e9;
                border-radius: 10px;
                padding: 22px 18px;
                text-align: center;
                margin-bottom: 25px;
            }}
            .reminder-icon {{
                font-size: 36px;
                margin-bottom: 8px;
            }}
            .reminder-title {{
                color: #e0f2fe;
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: 0.5px;
            }}
            .countdown {{
                color: #0ea5e9;
                font-size: 32px;
                font-weight: 700;
                margin: 8px 0;
            }}
            .reminder-text {{
                color: #7dd3fc;
                font-size: 12px;
                line-height: 1.5;
            }}
            .footer {{
                background-color: #0f172a;
                padding: 20px;
                text-align: center;
                color: #64748b;
                font-size: 11px;
                border-top: 1px solid #334155;
            }}
            .footer-text {{
                margin: 3px 0;
            }}
            .footer-text strong {{
                color: #cbd5e1;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://ik.imagekit.io/4uskfr8sji/new%20logo.png?updatedAt=1770060279701" alt="Ligue 26">
                <div class="header-title">
                    <h1>⚽ Match Reminder</h1>
                </div>
                <img src="https://ik.imagekit.io/4uskfr8sji/logo%20coloured.png?updatedAt=1770060279670" alt="AUFT">
            </div>

            <div class="content">
                <div class="section-title">
                    {f'<div class="match-week">WEEK {match_week}</div>' if match_week else '<div class="match-week">MATCH DAY</div>'}
                    <div class="match-date">{date}</div>
                </div>

                <div class="match-container">
                    <div class="teams-row">
                        <div class="team team-home">
                            {f'<img src="{home_image}" alt="{home}" class="team-badge">' if home_image else f'<div class="team-badge-placeholder">{home_code}</div>'}
                            <div>
                                <div class="team-name">{home}</div>
                                <div class="team-code">{home_code}</div>
                            </div>
                        </div>

                        <div class="vs-box">
                            <div class="vs-text">VS</div>
                            <div class="match-time">{time_12hr}</div>
                        </div>

                        <div class="team team-away">
                            {f'<img src="{away_image}" alt="{away}" class="team-badge">' if away_image else f'<div class="team-badge-placeholder">{away_code}</div>'}
                            <div>
                                <div class="team-name">{away}</div>
                                <div class="team-code">{away_code}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="reminder-section">
                    <div class="reminder-icon">⏰</div>
                    <div class="reminder-title">MATCH STARTING SOON</div>
                    <div class="countdown">30 MINUTES</div>
                    <div class="reminder-text">Get ready! The match will begin shortly. Make sure you're prepared!</div>
                </div>
            </div>

            <div class="footer">
                <div class="footer-text"><strong>Anna University Football Team</strong></div>
                <div class="footer-text">Presents: AUFT (AU Football Tournament)</div>
                <div class="footer-text" style="margin-top: 8px; color: #475569;">© 2026 AUFT. All rights reserved.</div>
            </div>
        </div>
    </body>
    </html>
    """

    # Attach HTML content to the email
    msg.attach(MIMEText(html_content, "html"))

    # Send the email
    try:
        smtp_server = os.getenv("SMTP_SERVER") or os.getenv("SMTP_HOST")
        smtp_port = os.getenv("SMTP_PORT")
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD") or os.getenv("SMTP_PASS")

        missing = [
            name for name, value in [
                ("SMTP_SERVER", smtp_server),
                ("SMTP_PORT", smtp_port),
                ("SMTP_USER", smtp_user),
                ("SMTP_PASSWORD", smtp_password),
            ]
            if not value
        ]

        if missing:
            print(f"SMTP config missing: {', '.join(missing)}")
            return False

        smtp_server = smtp_server.strip()
        if smtp_server.startswith("."):
            smtp_server = smtp_server.lstrip(".")
        if not smtp_server:
            print("SMTP config invalid: SMTP_SERVER/SMTP_HOST is empty")
            return False

        print(f"Sending email to {to_email} via {smtp_server}:{smtp_port} as {smtp_user}")

        port = int(smtp_port)
        use_ssl = port == 465
        print(f"SMTP connect: host={smtp_server}, port={port}, ssl={use_ssl}")

        if use_ssl:
            server = smtplib.SMTP_SSL()
            server.connect(smtp_server, port)
            server.ehlo()
        else:
            server = smtplib.SMTP()
            server.connect(smtp_server, port)
            server.ehlo()
            server._host = smtp_server
            server.starttls(context=ssl.create_default_context())
            server.ehlo()

        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_test_email(to_email):
    """Send a test match reminder email to a single recipient with hardcoded match data"""
    return send_match_email(
        to_email=to_email,
        home="Tackling Titans",
        away="Juggling Giants",
        date="February 15, 2026",
        time="15:30",
        match_week=5
    )
