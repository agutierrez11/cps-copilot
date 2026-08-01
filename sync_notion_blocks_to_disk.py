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
    "Content-Type": "application/json"
}

def main():
    print("🚀 CONSULTANDO LA BASE DE DATOS DE NOTION CPS NOTEBOOK VIA API...")
    url = "https://www.notion.so/api/v3/queryCollection"
    payload = {
        "collection": {"id": "3944b478-6d2d-4f26-b89b-6a4322dfd198", "spaceId": "08d6f312-d812-4ee4-8cb3-b1d6db7965bd"},
        "collectionView": {"id": "db3da4d9-328d-40ce-b2b4-4da94bb753da", "spaceId": "08d6f312-d812-4ee4-8cb3-b1d6db7965bd"},
        "loader": {"type": "reducer", "reducers": {"collection_group_results": {"type": "results", "limit": 500}}}
    }
    
    r = httpx.post(url, json=payload, headers=HEADERS, timeout=30)
    if r.status_code != 200:
        print(f"Error: {r.status_code}")
        return

    data = r.json()
    blocks = data.get("recordMap", {}).get("block", {})
    print(f"✅ Se obtuvieron {len(blocks)} bloques en total de Notion!")

    index_items = []
    saved_count = 0
    
    for b_id, b_val in blocks.items():
        val = b_val.get("value", {})
        props = val.get("properties", {})
        b_type = val.get("type", "")
        
        title = ""
        if "title" in props:
            title = "".join([t[0] for t in props["title"] if isinstance(t, list) and len(t) > 0])
            
        if title.strip():
            clean_title = re.sub(r'[^\w\s-]', '', title).strip().replace(" ", "_")[:60]
            if not clean_title:
                clean_title = f"notion_item_{b_id[:8]}"
                
            fname = f"{clean_title}.md"
            fpath = os.path.join(OUTPUT_DIR, fname)
            
            with open(fpath, "w", encoding="utf-8") as out:
                out.write(f"# {title}\n\n")
                out.write(f"**ID Notion:** `{b_id}`\n")
                out.write(f"**Tipo de Bloque:** `{b_type}`\n\n")
                
                # Extraer propiedades adicionales si existen
                for p_key, p_val in props.items():
                    if p_key != "title":
                        val_str = str(p_val)
                        out.write(f"- **{p_key}:** {val_str}\n")
                        
            index_items.append({"id": b_id, "title": title, "file": fname})
            saved_count += 1

    print(f"🎉 ¡SE EXTRAJERON Y GUARDARON {saved_count} ARTÍCULOS EN MARKDOWN EN DISCO!")
    
    # Guardar índice JSON
    idx_path = os.path.join(OUTPUT_DIR, "INDICE_NOTION_CPS_FULL.json")
    with open(idx_path, "w", encoding="utf-8") as f:
        json.dump(index_items, f, indent=2, ensure_ascii=False)
        
    # Copiar a Bóveda Central
    dst = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\mis-agentes-y-skills\skills\cps-notebook-vault"
    os.makedirs(dst, exist_ok=True)
    for fn in os.listdir(OUTPUT_DIR):
        src_p = os.path.join(OUTPUT_DIR, fn)
        dst_p = os.path.join(dst, fn)
        if os.path.isfile(src_p):
            with open(src_p, "r", encoding="utf-8") as sf:
                c = sf.read()
            with open(dst_p, "w", encoding="utf-8") as df:
                df.write(c)

    print(f"📦 Bóveda Central actualizada en: {dst}")

if __name__ == "__main__":
    main()
