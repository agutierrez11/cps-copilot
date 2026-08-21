import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("c:/Users/Antonio/.gemini/antigravity-ide/scratch/radar-comercial/.env")
token = os.getenv("APIFY_API_TOKEN")

print("[*] Rastreando posts y publicaciones de ACI Worldwide y sus ejecutivos...")

url = f"https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token={token}"

payload = {
    "queries": "\"Alberto Olivares\" \"ACI Worldwide\" post OR opinion OR entrevista OR Conferencia\n\"Javier Garcia Delgado\" \"ACI Worldwide\" Mexico OR payments\n\"ACI Worldwide\" \"dLocal\" SPEI OXXO 2026",
    "maxPagesPerQuery": 1,
    "resultsPerPage": 10,
    "languageCode": "es"
}

headers = {"Content-Type": "application/json"}

try:
    res = requests.post(url, json=payload, headers=headers, timeout=60)
    if res.status_code == 200:
        data = res.json()
        with open("c:/Users/Antonio/.gemini/antigravity-ide/scratch/cps-copilot/scratch/aci_posts_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=True, indent=2)
        print("[OK] Datos de publicaciones extraidos correctamente.")
    else:
        print(f"[ERROR] Status Code: {res.status_code}")
except Exception as e:
    print(f"[ERROR] Exception: {e}")
