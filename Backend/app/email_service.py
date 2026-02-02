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

    # Prepare dynamic HTML snippets for the template
    # Light Theme Colors: Background #ffffff, Text #0f172a / #334155
    week_badge = f"""
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="display:inline-block;">
        <tr>
            <td style="background:#0ea5e9;background:linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);color:#ffffff;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                WEEK {match_week}
            </td>
        </tr>
    </table>
    """ if match_week else """
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="display:inline-block;">
        <tr>
            <td style="background:#0ea5e9;background:linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);color:#ffffff;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                MATCH DAY
            </td>
        </tr>
    </table>
    """

    if home_image:
        home_token = f'<img src="{home_image}" alt="{home}" width="75" height="75" style="display:block;width:75px;height:75px;border-radius:10px;border:3px solid #0ea5e9;object-fit:cover;background-color:#ffffff;">'
    else:
        home_token = f'<div style="width:75px;height:75px;border-radius:10px;border:3px solid #0ea5e9;background-color:#ffffff;color:#0ea5e9;font-weight:700;font-size:20px;line-height:75px;text-align:center;font-family:sans-serif;">{home_code}</div>'

    if away_image:
        away_token = f'<img src="{away_image}" alt="{away}" width="75" height="75" style="display:block;width:75px;height:75px;border-radius:10px;border:3px solid #0ea5e9;object-fit:cover;background-color:#ffffff;">'
    else:
        away_token = f'<div style="width:75px;height:75px;border-radius:10px;border:3px solid #0ea5e9;background-color:#ffffff;color:#0ea5e9;font-weight:700;font-size:20px;line-height:75px;text-align:center;font-family:sans-serif;">{away_code}</div>'

    # Optimized Email HTML Template (Pure White Theme, Enforced Light Mode)
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>⚽ Match Starting Soon</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            :root {{
                color-scheme: light;
                supported-color-schemes: light;
            }}
            table, td, div, h1, p {{font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;}}
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
            
            /* Reset styles */
            body {{margin: 0; padding: 0; word-spacing: normal; background-color: #ffffff;}}
            table {{border-collapse: collapse;}}
            
            /* Mobile Responsive Styles */
            @media screen and (max-width: 530px) {{
                .mobile-full-width {{width: 100% !important; max-width: 100% !important;}}
                .mobile-padding {{padding-left: 15px !important; padding-right: 15px !important;}}
                .team-badge-img {{width: 50px !important; height: 50px !important;}}
                .team-name-text {{font-size: 12px !important;}}
                .vs-text {{font-size: 10px !important;}}
                .match-time-text {{font-size: 18px !important;}}
            }}
        </style>
    </head>
    <body style="margin:0;padding:0;background-color:#ffffff;color:#0f172a;">
        <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#ffffff;">
            
            <!-- Main Wrapper -->
            <table role="presentation" style="width:100%;border:0;border-spacing:0;background-color:#ffffff;">
                <tr>
                    <td align="center" style="padding:20px 0;">
                        
                        <!-- Container -->
                        <!--[if mso]>
                        <table role="presentation" align="center" style="width:600px;">
                        <tr><td style="padding:0;">
                        <![endif]-->
                        <table role="presentation" class="mobile-full-width" style="width:100%;max-width:650px;border-spacing:0;text-align:center;background-color:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;margin:0 auto;box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            
                            <!-- Header -->
                            <tr>
                                <td style="background:#0ea5e9;background:linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);padding:25px 20px;">
                                    <table role="presentation" style="width:100%;border-spacing:0;">
                                        <tr>
                                            <td align="left" style="width:60px;vertical-align:middle;">
                                                <img src="https://ik.imagekit.io/4uskfr8sji/new%20logo.png?updatedAt=1770060279701" alt="Ligue 26" width="60" style="display:block;width:60px;height:auto;border-radius:8px;">
                                            </td>
                                            <td align="center" style="vertical-align:middle;color:#ffffff;">
                                                <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:0.5px;color:#ffffff;font-family:'Outfit', sans-serif;">⚽ Match Reminder</h1>
                                            </td>
                                            <td align="right" style="width:60px;vertical-align:middle;">
                                                <img src="https://ik.imagekit.io/4uskfr8sji/logo%20coloured.png?updatedAt=1770060279670" alt="AUFT" width="60" style="display:block;width:60px;height:auto;border-radius:8px;">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Body Content -->
                            <tr>
                                <td class="mobile-padding" style="padding:35px 25px;">
                                    
                                    <!-- Week & Date -->
                                    <table role="presentation" style="width:100%;border-spacing:0;margin-bottom:25px;">
                                        <tr>
                                            <td align="center">
                                                {week_badge}
                                                <div style="font-family:'Outfit', sans-serif;color:#0f172a;font-size:28px;font-weight:700;margin-top:12px;text-align:center;">{date}</div>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Match Card (Horizontal Layout) -->
                                    <table role="presentation" style="width:100%;border-spacing:0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:25px;">
                                        <tr>
                                            <td style="padding:20px 10px;">
                                                <table role="presentation" style="width:100%;border-spacing:0;">
                                                    <tr>
                                                        <!-- Home Team (Left) -->
                                                        <td align="center" style="width:35%;vertical-align:top;">
                                                            <table role="presentation" style="width:100%;border-spacing:0;">
                                                                <tr>
                                                                    <td align="center">
                                                                        {home_token}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="padding-top:8px;">
                                                                        <div class="team-name-text" style="font-family:'Outfit', sans-serif;color:#0f172a;font-size:14px;font-weight:600;line-height:1.3;">{home}</div>
                                                                        <div style="font-family:'Outfit', sans-serif;color:#64748b;font-size:11px;font-weight:700;margin-top:2px;">{home_code}</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>

                                                        <!-- VS (Center) -->
                                                        <td align="center" style="width:30%;vertical-align:middle;">
                                                            <div class="vs-text" style="font-family:'Outfit', sans-serif;color:#0ea5e9;font-size:12px;font-weight:700;letter-spacing:2px;margin-bottom:4px;">VS</div>
                                                            <div class="match-time-text" style="font-family:'Outfit', sans-serif;color:#0f172a;font-size:22px;font-weight:700;white-space:nowrap;">{time_12hr}</div>
                                                        </td>

                                                        <!-- Away Team (Right) -->
                                                        <td align="center" style="width:35%;vertical-align:top;">
                                                            <table role="presentation" style="width:100%;border-spacing:0;">
                                                                <tr>
                                                                    <td align="center">
                                                                        {away_token}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="padding-top:8px;">
                                                                        <div class="team-name-text" style="font-family:'Outfit', sans-serif;color:#0f172a;font-size:14px;font-weight:600;line-height:1.3;">{away}</div>
                                                                        <div style="font-family:'Outfit', sans-serif;color:#64748b;font-size:11px;font-weight:700;margin-top:2px;">{away_code}</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Alert Box -->
                                    <table role="presentation" style="width:100%;border-spacing:0;background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;">
                                        <tr>
                                            <td style="padding:22px 18px;text-align:center;">
                                                <div style="font-size:36px;line-height:1;margin-bottom:12px;">⏰</div>
                                                <div style="font-family:'Outfit', sans-serif;color:#0369a1;font-size:14px;font-weight:700;letter-spacing:0.5px;margin-bottom:5px;">MATCH STARTING SOON</div>
                                                <div style="font-family:'Outfit', sans-serif;color:#0ea5e9;font-size:32px;font-weight:700;margin:10px 0;">30 MINUTES</div>
                                                <div style="font-family:'Outfit', sans-serif;color:#334155;font-size:12px;line-height:1.5;">Get ready! The match will begin shortly.</div>
                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color:#f8fafc;padding:25px 20px;text-align:center;border-top:1px solid #e2e8f0;">
                                    <table role="presentation" width="100%" style="border-spacing:0;">
                                        <tr>
                                            <td align="center">
                                                <p style="font-family:'Outfit', sans-serif;margin:0 0 5px 0;color:#475569;font-size:11px;font-weight:bold;">Anna University Football Team</p>
                                                <p style="font-family:'Outfit', sans-serif;margin:0 0 10px 0;color:#64748b;font-size:11px;">Presents: AUFT (AU Football Tournament)</p>
                                                <p style="font-family:'Outfit', sans-serif;margin:0;color:#94a3b8;font-size:11px;">&copy; 2026 AUFT. All rights reserved.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <!--[if mso]>
                        </td></tr>
                        </table>
                        <![endif]-->
                        
                    </td>
                </tr>
            </table>
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
