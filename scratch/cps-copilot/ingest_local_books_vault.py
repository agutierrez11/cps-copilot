import os
import sys
import json
import re
from pypdf import PdfReader

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot\skills\cps-books-vault"
os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGET_FILES = [
    ("CPS_Libro_Maestro", r"C:\Users\Antonio\Desktop\Materiales_CPS\CPS.pdf"),
    ("CPS_Entrenamiento", r"C:\Users\Antonio\Desktop\Materiales_CPS\Complex Problem Solving y Entrenamiento.pdf"),
    ("CPS_CST_Decisiones", r"C:\Users\Antonio\Desktop\Materiales_CPS\CSTDecisiones.pdf"),
    ("CPS_Enlaces_Lista", r"C:\Users\Antonio\Desktop\Materiales_CPS\Listado_de_Enlaces_CPS_(con_icono_?).pdf")
]

def extract_pdf_to_md(name, pdf_path):
    print(f" 📥 Extrayendo libro/material: {name} ({pdf_path})...")
    try:
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
        print(f"    📖 Total de páginas: {total_pages}")
        
        full_text = [f"# {name}\n", f"**Fuente:** `{pdf_path}`\n", f"**Total Páginas:** {total_pages}\n\n"]
        
        # Extraer texto página por página
        for idx, page in enumerate(reader.pages, 1):
            text = page.extract_text()
            if text and text.strip():
                full_text.append(f"## Página {idx}\n\n{text.strip()}\n\n---\n")
                
        out_filename = f"{name}.md"
        out_path = os.path.join(OUTPUT_DIR, out_filename)
        
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(full_text))
            
        print(f" ✅ Resguardado en Markdown: {out_path} ({len(full_text)} secciones)")
        return out_filename
    except Exception as e:
        print(f"[!] Error procesando {pdf_path}: {e}")
        return None

def main():
    print("🚀 INICIANDO INGESTIÓN VIVA DE LIBROS Y MATERIALES LOCALES EN SEGUNDO PLANO...")
    
    extracted_manifest = []
    
    for name, path in TARGET_FILES:
        if os.path.exists(path):
            if path.endswith(".pdf"):
                fname = extract_pdf_to_md(name, path)
                if fname:
                    extracted_manifest.append({"name": name, "file": fname, "type": "pdf"})
            elif path.endswith(".md"):
                # Copiar archivo md directamente
                with open(path, "r", encoding="utf-8", errors="ignore") as in_f:
                    c = in_f.read()
                out_path = os.path.join(OUTPUT_DIR, f"{name}.md")
                with open(out_path, "w", encoding="utf-8") as out_f:
                    out_f.write(c)
                print(f" ✅ Copiado Markdown directo: {out_path}")
                extracted_manifest.append({"name": name, "file": f"{name}.md", "type": "md"})
        else:
            print(f"⚠️ Archivo no encontrado en disco: {path}")

    # Guardar Manifiesto
    manifest_path = os.path.join(OUTPUT_DIR, "MANIFEST_LIBROS_LOCALES.json")
    with open(manifest_path, "w", encoding="utf-8") as mf:
        json.dump(extracted_manifest, mf, indent=2, ensure_ascii=False)
        
    print("\n==========================================================")
    print("🎉 INGESTIÓN DE LIBROS COMPLETADA!")
    print(f"📁 Bóveda de Libros en: {OUTPUT_DIR}")
    print("==========================================================")

    # Copiar a Bóveda Central
    dst = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\mis-agentes-y-skills\skills\cps-books-vault"
    os.makedirs(dst, exist_ok=True)
    for fn in os.listdir(OUTPUT_DIR):
        sf_p = os.path.join(OUTPUT_DIR, fn)
        df_p = os.path.join(dst, fn)
        if os.path.isfile(sf_p):
            with open(sf_p, "r", encoding="utf-8") as sf:
                content = sf.read()
            with open(df_p, "w", encoding="utf-8") as df:
                df.write(content)
                
    print(f"📦 Bóveda Central actualizada en: {dst}")

if __name__ == "__main__":
    main()
