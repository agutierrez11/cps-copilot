import os
import sys
import json
import httpx
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot\skills\cps-turrero-vault"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def main():
    print("🚀 INICIANDO EXTRACCIÓN DE EL TURRERO POST (JAVIER G. RECUENCO)...")
    url = "https://turrero.vercel.app/"
    
    try:
        r = httpx.get(url, headers=HEADERS, timeout=20)
        html = r.text
        
        # Encontrar todas las turras (enlaces a /turra/...)
        matches = re.findall(r'href="(/turra/(\d+))"[^>]*>(.*?)</a>', html)
        print(f"✅ Encontradas {len(matches)} turras/hilos de Recuenco en El Turrero Post.")
        
        turras = []
        for path, t_id, title in matches:
            clean_title = re.sub(r'<[^>]+>', '', title).strip()
            turras.append({"id": t_id, "url": f"https://turrero.vercel.app{path}", "title": clean_title})
            
        # Eliminar duplicados
        unique_turras = {t["id"]: t for t in turras}.values()
        unique_turras = list(unique_turras)
        print(f"📊 Turras únicas identificadas: {len(unique_turras)}")
        
        index_file = os.path.join(OUTPUT_DIR, "INDICE_TURRAS_RECUENCO.json")
        with open(index_file, "w", encoding="utf-8") as f:
            json.dump(unique_turras, f, indent=2, ensure_ascii=False)
            
        print(f"📄 Índice de turras guardado en: {index_file}")
        
        # Guardar las 25 turras principales en archivos Markdown
        for idx, t in enumerate(unique_turras[:30], 1):
            clean_name = "".join(c for c in t["title"] if c.isalnum() or c in (" ", "_", "-")).strip().replace(" ", "_")[:50]
            filename = f"turra_{idx:02d}_{clean_name}.md"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            # Descargar contenido individual de la turra
            t_url = f"https://r.jina.ai/{t['url']}"
            content = f"# {t['title']}\n\n**ID:** `{t['id']}`\n**URL:** {t['url']}\n\n"
            try:
                t_resp = httpx.get(t_url, headers=HEADERS, timeout=15)
                if t_resp.status_code == 200:
                    content += t_resp.text
            except Exception as ex:
                content += f"Error descargando contenido: {ex}"
                
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
                
            print(f" 📥 [{idx}/{min(30, len(unique_turras))}] Descargada turra: {t['title'][:40]}...")
            
        print("\n==========================================================")
        print(f"🎉 EXTRACCIÓN DE EL TURRERO COMPLETADA EXITOSAMENTE EN {OUTPUT_DIR}")
        print("==========================================================")
        
    except Exception as e:
        print(f"[!] Error extrayendo Turrero Post: {e}")

if __name__ == "__main__":
    main()
