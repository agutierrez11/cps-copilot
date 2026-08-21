import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("c:/Users/Antonio/.gemini/antigravity-ide/scratch/radar-comercial/.env")
token = os.getenv("APIFY_API_TOKEN")

print("[*] Ejecutando rastreador Apify de noticias recientes de ACI Worldwide en México y LATAM...")

url = f"https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token={token}"

payload = {
    "queries": "ACI Worldwide Mexico OR LATAM pagos 2026",
    "maxPagesPerQuery": 1,
    "resultsPerPage": 10,
    "languageCode": "es"
}

headers = {"Content-Type": "application/json"}

try:
    res = requests.post(url, json=payload, headers=headers, timeout=60)
    if res.status_code == 200:
        data = res.json()
        output_file = "c:/Users/Antonio/.gemini/antigravity-ide/scratch/cps-copilot/scratch/aci_apify_news.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=True, indent=2)
        print("[OK] Noticia extraida con exito en json")
    else:
        print(f"[ERROR] Status: {res.status_code} - {res.text}")
except Exception as e:
    print(f"[ERROR] Exception: {e}")
