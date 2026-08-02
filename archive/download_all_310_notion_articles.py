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
    index_file = os.path.join(OUTPUT_DIR, "INDICE_NOTION_CPS_REAL.json")
    if not os.path.exists(index_file):
        print("No index file found!")
        return

    with open(index_file, "r", encoding="utf-8") as f:
        articles = json.load(f)

    print(f"🚀 INICIANDO DESCARGA DE CONTENIDO COMPLETO DE LOS {len(articles)} ARTÍCULOS DE NOTION CPS...")

    count = 0
    for item in articles:
        b_id = item["id"]
        title = item["title"]
        clean_title = re.sub(r'[^\w\s-]', '', title).strip().replace(" ", "_")[:50]
        if not clean_title:
            clean_title = f"articulo_{b_id[:8]}"

        url = "https://www.notion.so/api/v3/loadPageChunk"
        payload = {"pageId": b_id, "limit": 100, "chunkNumber": 0, "verticalColumns": False}
        
        try:
            r = httpx.post(url, json=payload, headers=HEADERS, timeout=15)
            if r.status_code == 200:
                data = r.json()
                blocks = data.get("recordMap", {}).get("block", {})
                
                content_lines = [f"# {title}\n", f"**ID Notion:** `{b_id}`\n\n"]
                for sub_id, sub_val in blocks.items():
                    val = sub_val.get("value", {})
                    props = val.get("properties", {})
                    if "title" in props:
                        t_str = "".join([t[0] for t in props["title"] if isinstance(t, list) and len(t) > 0])
                        if t_str.strip() and t_str != title:
                            content_lines.append(f"- {t_str}")

                filepath = os.path.join(OUTPUT_DIR, f"{clean_title}.md")
                with open(filepath, "w", encoding="utf-8") as out_f:
                    out_f.write("\n".join(content_lines))
                    
                count += 1
                if count % 20 == 0:
                    print(f" 📥 Descargados {count}/{len(articles)} artículos completos...")
        except Exception as e:
            pass

    print(f"\n✅ ¡DESCARGA FINALIZADA! {count} artículos en Markdown guardados en: {OUTPUT_DIR}")

    # Copiar a Bóveda Central
    dst = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\mis-agentes-y-skills\skills\cps-notebook-vault"
    os.makedirs(dst, exist_ok=True)
    for fname in os.listdir(OUTPUT_DIR):
        if fname.endswith(".md") or fname.endswith(".json"):
            with open(os.path.join(OUTPUT_DIR, fname), "r", encoding="utf-8") as sf:
                c = sf.read()
            with open(os.path.join(dst, fname), "w", encoding="utf-8") as df:
                df.write(c)

    print(f"📦 Todos los artículos sincronizados a la Bóveda Central: {dst}")

if __name__ == "__main__":
    main()
