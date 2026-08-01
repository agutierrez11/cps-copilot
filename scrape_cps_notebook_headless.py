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
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def main():
    print("🚀 INICIANDO EXTRACCIÓN SILENCIOSA EN SEGUNDO PLANO DE CPS NOTEBOOK...")
    print("⚡ (Cero ventanas abiertas, cero uso de pantalla, tu laptop se mantiene 100% rápida)")
    
    # URL pública de Notion CPS Notebook
    base_url = "https://r.jina.ai/https://cps-notebook.notion.site/CPS-Notebook-81fe17dc15d04e9db085cf7f747d0c16"
    
    try:
        r = httpx.get(base_url, headers=HEADERS, timeout=30)
        content = r.text
        
        index_file = os.path.join(OUTPUT_DIR, "NOTION_CPS_FULL_RAW.md")
        with open(index_file, "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"✅ Extracción completada en segundo plano! Archivo resguardado: {index_file}")
        
        # Extraer secciones y listas
        lines = content.splitlines()
        print(f"📊 Total de líneas extraídas del Notion CPS Notebook: {len(lines)}")
        
        # Copiar al repositorio central
        dst = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\mis-agentes-y-skills\skills\cps-notebook-vault"
        os.makedirs(dst, exist_ok=True)
        with open(os.path.join(dst, "NOTION_CPS_FULL_RAW.md"), "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"📦 Sincronizado en Bóveda Central: {dst}")
        
    except Exception as e:
        print(f"[!] Error descargando Notion en segundo plano: {e}")

if __name__ == "__main__":
    main()
