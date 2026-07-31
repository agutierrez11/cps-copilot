import os
import shutil
import re
from pathlib import Path

src_dir = Path(r"C:\Users\Antonio\.gemini\antigravity-ide\scratch\CPS Sales Copilot")
dst_dir = Path(r"C:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot")

files_to_copy = {
    "copilot.html": "copilot.html",
    "black_ops_copilot.html": "black_ops_copilot.html",
    "app_copilot_server.py": "app_copilot_server.py",
    "app_live_audio.py": "app_live_audio.py",
    "app_copilot_cps.py": "app_copilot_cps.py",
    "llm_council.py": "llm_council.py",
    "cps_database.py": "cps_database.py",
    "app.js": "app.js",
    "styles.css": "styles.css",
    "tablero.html": "tablero.html",
    "estrategias_fuera_de_la_caja.html": "estrategias_fuera_de_la_caja.html",
    "README.md": "README.md",
    "SALES_COPILOT_AND_OBSIDIAN_BRAIN.md": "SALES_COPILOT_AND_OBSIDIAN_BRAIN.md",
    "DELIBERACION_OFICIAL_LLM_COUNCIL.md": "DELIBERACION_OFICIAL_LLM_COUNCIL.md"
}

print("--- FASE 1: COPIANDO ARCHIVOS ---")
for src_name, dst_name in files_to_copy.items():
    s_path = src_dir / src_name
    d_path = dst_dir / dst_name
    if s_path.exists():
        shutil.copyfile(s_path, d_path)
        print(f"Copiado: {src_name} -> {dst_name}")
    else:
        print(f"Advertencia: No existe {s_path}")

print("\n--- FASE 1: SANITIZANDO MARCA 'CPS Sales Copilot' ---")
# Reemplazar CPS Sales Copilot por cps-copilot / CPS Sales Copilot conservando la inteligencia B2B
replacements = [
    (re.compile(r'black_ops_CPS Sales Copilot\.html', re.IGNORECASE), 'black_ops_copilot.html'),
    (re.compile(r'CPS Sales Copilot', re.IGNORECASE), 'CPS Sales Copilot'),
    (re.compile(r'CPS Sales Copilot', re.IGNORECASE), 'CPS Sales Copilot'),
    (re.compile(r'CPS Sales Copilot', re.IGNORECASE), 'cps-copilot')
]

for dst_file in dst_dir.glob("*"):
    if dst_file.is_file() and dst_file.suffix in ['.html', '.py', '.js', '.md', '.json', '.css']:
        try:
            content = dst_file.read_text(encoding='utf-8')
            modified = content
            for pattern, repl in replacements:
                modified = pattern.sub(repl, modified)
            if modified != content:
                dst_file.write_text(modified, encoding='utf-8')
                print(f"Sanitizado: {dst_file.name}")
        except Exception as e:
            print(f"Error procesando {dst_file.name}: {e}")

print("\nFase 1 completada con éxito.")
