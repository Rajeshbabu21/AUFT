from app.db import supabase
import json
import time
from datetime import datetime

match_id = "75f23f6f-54a6-4138-b920-564f77d589a7"

print(f"Starting polling for match: {match_id}")
print("=" * 60)

try:
    while True:
        match = supabase.table('matches').select('*').eq('id', match_id).execute()
        
        if match.data:
            data = match.data[0]
            timestamp = datetime.now().strftime('%H:%M:%S')
            print(f"\n[{timestamp}] Match Status:")
            print(f"  ID: {data['id']}")
            print(f"  Status: {data['status']}")
            print(f"  Mail Sent: {data['mail_sent']}")
            print(f"  Conduction Date: {data['conduction_date']}")
            print(f"  Match Time: {data['match_time']}")
            print("-" * 60)
        else:
            print("Match not found!")
            break
        
        time.sleep(5)  # Poll every 5 seconds
        
except KeyboardInterrupt:
    print("\n\nPolling stopped.")
