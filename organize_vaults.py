import os
import sys
import shutil

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_REPO = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\mis-agentes-y-skills\skills"
SRC_VAULT = r"c:\Users\Antonio\.gemini\antigravity-ide\scratch\cps-copilot\skills\cps-books-vault"

# 1. Bóveda CPS Metodología
cps_dir = os.path.join(BASE_REPO, "cps-methodology-vault")
os.makedirs(cps_dir, exist_ok=True)

# 2. Bóveda NERV × Galileo
nerv_dir = os.path.join(BASE_REPO, "nerv-galileo-vault")
os.makedirs(nerv_dir, exist_ok=True)

# 3. Bóveda OnlyPayments
only_dir = os.path.join(BASE_REPO, "onlypayments-vault")
os.makedirs(only_dir, exist_ok=True)

def main():
    print("🚀 REORGANIZANDO BÓVEDAS EN CARPETAS MODULARES POR PROYECTO...")

    # Mover archivos de CPS
    for f in ["CPS_Libro_Maestro.md", "CPS_Entrenamiento.md", "CPS_CST_Decisiones.md"]:
        sp = os.path.join(SRC_VAULT, f)
        if os.path.exists(sp):
            shutil.copy2(sp, os.path.join(cps_dir, f))
            print(f" 📦 Copiado a CPS Methodology Vault: {f}")

    # Mover NERV Galileo
    sp = os.path.join(SRC_VAULT, "NERV_Battlecards_Galileo.md")
    if os.path.exists(sp):
        shutil.copy2(sp, os.path.join(nerv_dir, "NERV_Battlecards_Galileo.md"))
        print(f" 📦 Copiado a NERV Galileo Vault: NERV_Battlecards_Galileo.md")

    # Mover OnlyPayments
    sp = os.path.join(SRC_VAULT, "Dossier_OnlyPayments_2026.md")
    if os.path.exists(sp):
        shutil.copy2(sp, os.path.join(only_dir, "Dossier_OnlyPayments_2026.md"))
        print(f" 📦 Copiado a OnlyPayments Vault: Dossier_OnlyPayments_2026.md")

    print("\n✅ ORGANIZACIÓN COMPLETADA CON ÉXITO!")

if __name__ == "__main__":
    main()
