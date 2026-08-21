import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("c:/Users/Antonio/.gemini/antigravity-ide/scratch/radar-comercial/.env")
token = os.getenv("APIFY_API_TOKEN")

print("[*] Verificando ejecuciones recientes en la cuenta de Apify...")
url = f"https://api.apify.com/v2/actor-runs?token={token}&limit=3"

res = requests.get(url)
if res.status_code == 200:
    runs = res.json()["data"]["items"]
    for r in runs:
        print(f"Run ID: {r['id']}, Status: {r['status']}, DatasetId: {r['defaultDatasetId']}")
        if r['status'] == 'SUCCEEDED':
            dataset_url = f"https://api.apify.com/v2/datasets/{r['defaultDatasetId']}/items?token={token}"
            items_res = requests.get(dataset_url)
            if items_res.status_code == 200:
                items = items_res.json()
                print(f"   --> Encontrados {len(items)} items en el dataset!")
                with open(f"c:/Users/Antonio/.gemini/antigravity-ide/scratch/cps-copilot/scratch/apify_dataset_{r['id']}.json", "w", encoding="utf-8") as f:
                    json.dump(items, f, ensure_ascii=True, indent=2)
else:
    print(f"Error fetching runs: {res.status_code}")
