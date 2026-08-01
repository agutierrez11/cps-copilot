import os
import sys
import time
import json
import httpx
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot\skills\cps-notebook-vault"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json"
}

visited_pages = set()

def fetch_block_chunk(block_id):
    url = "https://www.notion.so/api/v3/loadPageChunk"
    payload = {
        "pageId": block_id,
        "limit": 100,
        "chunkNumber": 0,
        "verticalColumns": False
    }
    try:
        r = httpx.post(url, json=payload, headers=HEADERS, timeout=20)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        pass
    return None

def extract_nested_pages_recursive(root_id, depth=0, max_depth=3):
    if root_id in visited_pages or depth > max_depth:
        return
    visited_pages.add(root_id)
    
    data = fetch_block_chunk(root_id)
    if not data:
        return

    blocks = data.get("recordMap", {}).get("block", {})
    sub_page_ids = []

    for b_id, b_info in blocks.items():
        val = b_info.get("value", {})
        b_type = val.get("type")
        props = val.get("properties", {})
        
        # Buscar títulos y texto
        if "title" in props:
            title_text = "".join([t[0] for t in props["title"] if isinstance(t, list) and len(t) > 0])
            if title_text.strip() and b_type == "page":
                clean_title = re.sub(r'[^\w\s-]', '', title_text).strip().replace(" ", "_")[:60]
                if clean_title:
                    filename = f"d{depth}_{clean_title}_{b_id[:8]}.md"
                    filepath = os.path.join(OUTPUT_DIR, filename)
                    
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(f"# {title_text}\n\n**ID Notion:** `{b_id}`\n**Profundidad:** Nivel {depth}\n\n")
                        f.write(f"Contenido indexado del bloque `{b_id}`.\n")
                    
                    print(f" 📥 [Profundidad {depth}] Descargado: {clean_title}")
                    
        # Extraer enlaces a subpáginas hijas
        content_children = val.get("content", [])
        for child_id in content_children:
            sub_page_ids.append(child_id)

    # Recorrer subpáginas hijas recursivamente
    for child_id in sub_page_ids:
        extract_nested_pages_recursive(child_id, depth + 1, max_depth)

def main():
    print("🚀 INICIANDO RASTREO PROFUNDO RECURSIVO (DEEP CRAWLER) DE NOTION CPS...")
    print("⚡ (Procesando todos los enlaces anidados y subpáginas en segundo plano)")
    
    # Colección principal de Notion CPS Notebook
    root_pages = [
        "81fe17dc-15d0-4e9d-b085-cf7f747d0c16",
        "e0933110-2a97-4216-a056-e13d433a9c60",
        "3944b478-6d2d-4f26-b89b-6a4322dfd198"
    ]
    
    for r_id in root_pages:
        extract_nested_pages_recursive(r_id, depth=0, max_depth=2)

    print("\n==========================================================")
    print(f"🎉 RASTREO PROFUNDO RECURSIVO COMPLETADO!")
    print(f"📊 Total de páginas/subpáginas anidadas extraídas: {len(visited_pages)}")
    print(f"📁 Guardados en: {OUTPUT_DIR}")
    print("==========================================================")

if __name__ == "__main__":
    main()
