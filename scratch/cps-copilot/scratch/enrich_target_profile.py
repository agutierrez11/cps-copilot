import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv("c:/Users/Antonio/.gemini/antigravity-ide/scratch/radar-comercial/.env")

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")

def fetch_profile_intelligence(profile_url_or_name):
    print(f"[*] Iniciando escaneo de inteligencia con Apify para: {profile_url_or_name}...")
    
    # URL de Apify actor para búsqueda/enriquecimiento de perfiles
    endpoint = f"https://api.apify.com/v2/acts/dev_fusion~linkedin-profile-scraper/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    
    payload = {
        "profileUrls": [profile_url_or_name] if "linkedin.com" in profile_url_or_name else [],
        "searchKeywords": profile_url_or_name if "linkedin.com" not in profile_url_or_name else ""
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(endpoint, json=payload, headers=headers, timeout=60)
        if response.status_code in [200, 201]:
            items = response.json()
            print(f"[OK] Escaneo completado. Encontrados registros en Apify.")
            return items
        else:
            print(f"[ERROR] Apify status code: {response.status_code}")
            return []
    except Exception as e:
        print(f"[ERROR] Error al consultar Apify")
        return []

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "Andres Soler ACI Worldwide"
    data = fetch_profile_intelligence(query)
    output_path = "c:/Users/Antonio/.gemini/antigravity-ide/scratch/cps-copilot/scratch/profile_intelligence.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[FINISHED] Resultado guardado en: {output_path}")
