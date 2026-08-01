import os
import sys
import json
import httpx
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot\skills\cps-notebook-vault"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Content-Type": "application/json",
    "Notion-Client-Version": "23.13.0.12"
}

def query_notion_collection(collection_id, space_id):
    url = "https://www.notion.so/api/v3/queryCollection"
    payload = {
        "collection": {"id": collection_id, "spaceId": space_id},
        "collectionView": {"id": "db3da4d9-328d-40ce-b2b4-4da94bb753da", "spaceId": space_id},
        "loader": {"type": "reducer", "reducers": {"collection_group_results": {"type": "results", "limit": 100}}},
        "highAccuracyOptions": None
    }
    try:
        r = httpx.post(url, json=payload, headers=HEADERS, timeout=20)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"[!] Error querying collection: {e}")
    return None

def main():
    print("🔍 AUDITANDO Y REVERTIDO DE PRUEBA: EXTRACCIÓN DIRECTA NOTION API...")
    
    # IDs de la base de datos de CPS Notebook Notion
    collection_id = "3944b478-6d2d-4f26-b89b-6a4322dfd198"
    space_id = "08d6f312-d812-4ee4-8cb3-b1d6db7965bd"
    
    res = query_notion_collection(collection_id, space_id)
    if res:
        blocks = res.get("recordMap", {}).get("block", {})
        print(f"✅ ¡ÉXITO DE ACCESO DIRECTO! Se obtuvieron {len(blocks)} bloques reales de Notion.")
        
        articles = []
        for b_id, b_val in blocks.items():
            val = b_val.get("value", {})
            props = val.get("properties", {})
            if "title" in props:
                title = "".join([t[0] for t in props["title"] if isinstance(t, list) and len(t) > 0])
                if title.strip():
                    articles.append({"id": b_id, "title": title})
                    
        print(f"📚 Artículos encontrados en la colección de CPS Notebook: {len(articles)}")
        
        index_path = os.path.join(OUTPUT_DIR, "INDICE_NOTION_CPS_REAL.json")
        with open(index_path, "w", encoding="utf-8") as f:
            json.dump(articles, f, indent=2, ensure_ascii=False)
            
        print(f"💾 Guardado índice verificado: {index_path}")
    else:
        print("⚠️ Notion API directa requirió parámetros adicionales.")

if __name__ == "__main__":
    main()
