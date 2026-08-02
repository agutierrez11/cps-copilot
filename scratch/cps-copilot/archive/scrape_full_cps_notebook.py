import os
import sys
import time
import json
import httpx

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot\skills\cps-notebook-vault"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json"
}

def fetch_page_chunk(page_id):
    url = "https://www.notion.so/api/v3/loadPageChunk"
    payload = {
        "pageId": page_id,
        "limit": 100,
        "chunkNumber": 0,
        "verticalColumns": False
    }
    try:
        r = httpx.post(url, json=payload, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"[!] Error fetching chunk {page_id}: {e}")
    return None

def fetch_collection_data(coll_id, view_id):
    url = "https://www.notion.so/api/v3/queryCollection"
    payload = {
        "collection": {"id": coll_id},
        "collectionView": {"id": view_id},
        "loader": {
            "type": "reducer",
            "reducers": {
                "collection_group_results": {
                    "type": "results",
                    "limit": 1000
                }
            },
            "searchQuery": "",
            "userTimeZone": "America/Mexico_City"
        }
    }
    try:
        r = httpx.post(url, json=payload, headers=HEADERS, timeout=20)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"[!] Error querying collection {coll_id}: {e}")
    return None

def main():
    print("🚀 INICIANDO EXTRACCIÓN COMPLETA DE CPS NOTEBOOK (NOTION)...")
    
    root_id = "81fe17dc-15d0-4e9d-b085-cf7f747d0c16"
    root_data = fetch_page_chunk(root_id)
    
    if not root_data:
        print("[!] No se pudo cargar el bloque raíz de Notion.")
        return

    record_map = root_data.get("recordMap", {})
    collections = record_map.get("collection", {})
    views = record_map.get("collection_view", {})
    
    print(f"✅ Encontradas {len(collections)} colecciones en la base de datos CPS Notebook.")
    
    all_pages = []
    
    for coll_id in collections.keys():
        view_id = list(views.keys())[0] if views else "db3da4d9-328d-40ce-b44d-a94bb753da"
        data = fetch_collection_data(coll_id, view_id)
        if data:
            blocks = data.get("recordMap", {}).get("block", {})
            for b_id, b_info in blocks.items():
                val = b_info.get("value", {})
                if val.get("type") == "page":
                    props = val.get("properties", {})
                    title_arr = props.get("title", [["Untitled"]])
                    title = title_arr[0][0] if title_arr and len(title_arr[0]) > 0 else "Sin_Titulo"
                    all_pages.append((b_id, title, props))

    print(f"\n📚 TOTAL DE ARTÍCULOS / NOTAS CPS ENCONTRADOS: {len(all_pages)}")
    
    # Guardar índice maestro
    index_file = os.path.join(OUTPUT_DIR, "INDICE_MAESTRO_CPS_NOTEBOOK.json")
    with open(index_file, "w", encoding="utf-8") as f:
        json.dump([{"id": p[0], "title": p[1]} for p in all_pages], f, indent=2, ensure_ascii=False)
        
    print(f"📄 Índice guardado en: {index_file}")
    
    # Descargar cada página
    downloaded_count = 0
    for idx, (p_id, p_title, props) in enumerate(all_pages, 1):
        clean_title = "".join(c for c in p_title if c.isalnum() or c in (" ", "_", "-")).strip().replace(" ", "_")
        filename = f"{idx:03d}_{clean_title}.md"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Descargar bloques internos de la página
        p_data = fetch_page_chunk(p_id)
        content_lines = [f"# {p_title}\n", f"**ID Notion:** `{p_id}`\n\n", "## Contenido\n"]
        
        if p_data:
            p_blocks = p_data.get("recordMap", {}).get("block", {})
            for sub_id, sub_info in p_blocks.items():
                sub_val = sub_info.get("value", {})
                sub_props = sub_val.get("properties", {})
                if "title" in sub_props:
                    text_parts = [t[0] for t in sub_props["title"] if isinstance(t, list) and len(t) > 0]
                    line = "".join(text_parts).strip()
                    if line:
                        content_lines.append(f"- {line}\n")
                        
        with open(filepath, "w", encoding="utf-8") as f:
            f.writelines(content_lines)
            
        downloaded_count += 1
        if downloaded_count % 10 == 0 or downloaded_count == len(all_pages):
            print(f" 📥 [{downloaded_count}/{len(all_pages)}] Descargado: {filename}")
            
    print("\n==========================================================")
    print(f"🎉 EXTRACCIÓN EXITOSA: {downloaded_count} archivos guardados en {OUTPUT_DIR}")
    print("==========================================================")

if __name__ == "__main__":
    main()
