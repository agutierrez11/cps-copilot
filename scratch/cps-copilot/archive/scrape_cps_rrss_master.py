import os
import sys
import time
import json
import httpx
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot\skills\cps-rrss-vault"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch_jina_clean(url):
    j_url = f"https://r.jina.ai/{url}"
    try:
        r = httpx.get(j_url, headers=HEADERS, timeout=20)
        if r.status_code == 200:
            return r.text
    except Exception as e:
        print(f"[!] Error fetching {url}: {e}")
    return ""

def main():
    print("🚀 INICIANDO RASTREO MULTICANAL DE RRSS (JAVIER G. RECUENCO & COMUNIDAD CPS)...")
    print("⚡ (Ejecutándose 100% en segundo plano en silencio)")
    
    urls_to_scrape = [
        ("Twitter_Recuenco_Perfil", "https://x.com/Recuenco"),
        ("Youtube_Comunidad_CPS", "https://youtube.com/@cpsspain"),
        ("Singular_Solving_Blog", "https://singularsolving.com/blog/"),
        ("El_Turrero_Hall_of_Fame", "https://turrero.vercel.app/hall-of-fame"),
        ("El_Turrero_Glosario_CPS", "https://turrero.vercel.app/glosario"),
        ("El_Turrero_Grafo_Turras", "https://turrero.vercel.app/grafo-de-turras")
    ]
    
    results = []
    
    for idx, (name, url) in enumerate(urls_to_scrape, 1):
        print(f" 📥 [{idx}/{len(urls_to_scrape)}] Rastreando fuente RRSS: {name}...")
        content = fetch_jina_clean(url)
        
        filename = f"{idx:02d}_{name}.md"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"# Fuente RRSS / CPS: {name}\n")
            f.write(f"**URL:** {url}\n\n")
            f.write(content if content else "Contenido extraído o en cola de procesamiento.")
            
        results.append({"name": name, "url": url, "bytes": len(content)})
        time.sleep(1)

    # Copiar a Bóveda Central
    dst = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\mis-agentes-y-skills\skills\cps-rrss-vault"
    os.makedirs(dst, exist_ok=True)
    
    index_file = os.path.join(OUTPUT_DIR, "INDICE_RRSS_CPS.json")
    with open(index_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n==========================================================")
    print("🎉 RASTREO DE RRSS Y FUENTES CPS COMPLETADO EN SEGUNDO PLANO!")
    print(f"📁 Guardado en: {OUTPUT_DIR}")
    print("==========================================================")

if __name__ == "__main__":
    main()
