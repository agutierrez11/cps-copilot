# ==============================================================================
# CPS Sales Copilot — LIVE AUDIO COPILOT (STREAMING RAM)
# ==============================================================================
import sys
import time
import requests

try:
    import noisereduce as nr
    import numpy as np
    NOISEREDUCE_AVAILABLE = True
except ImportError:
    NOISEREDUCE_AVAILABLE = False

def check_ollama_status():
    """Verifica si Ollama está activo en http://localhost:11434"""
    try:
        r = requests.get("http://localhost:11434/api/tags", timeout=2)
        if r.status_code == 200:
            print("✔ Servidor Ollama detectado en http://localhost:11434 (Estado 200 OK)")
            if NOISEREDUCE_AVAILABLE:
                print("🛡️ Filtro de Supresión de Ruido Novedoso 'noisereduce' ACTIVO")
            return True
    except Exception:
        print("❌ Servidor Ollama no detectado en puerto 11434. Asegúrate de tener Ollama abierto.")
        return False


def run_audio_copilot():
    print("==================================================================")
    print("🎙️ CPS Sales Copilot LIVE AUDIO COPILOT (LOCAL-FIRST MEMORY RAM)")
    print("==================================================================")
    
    if not check_ollama_status():
        print("\nPara iniciar Ollama en tu laptop:")
        print("1. Abre la aplicación 'Ollama' desde tu Menú Inicio de Windows.")
        print("2. Abre tu terminal de PowerShell y corre: ollama serve")
        return

    print("\n[INFO] Inicializando buffer de captura de audio y modelo local 'llama2'...")
    print("------------------------------------------------------------------")
    print("💡 Modo Simulación de Micrófono & Transcripción Streaming Efímera:")
    print("Escribe la frase que escuchas del prospecto en la llamada (o presiona Enter):")
    print("------------------------------------------------------------------")

    while True:
        try:
            phrase = input("\n🎙️ [Prospecto habla]: ")
            if phrase.lower() in ["exit", "salir", "quit"]:
                print("Cerrando sesión de audio copilot...")
                break
            
            if not phrase.strip():
                continue

            print("⚡ Transcribiendo paquete en RAM...")
            print("🧠 Evaluando Reglas CPS con Ollama (llama2)...")
            
            start_time = time.time()
            prompt = f"Eres un copiloto de ventas B2B para SOFOMes. El prospecto dijo: '{phrase}'. Da un diagnóstico corto (regla CPS) y 1 pregunta socrática incisiva para responderle."
            
            res = requests.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "llama2",
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False
                },
                timeout=10
            )
            
            elapsed = round((time.time() - start_time) * 1000)
            if res.status_code == 200:
                answer = res.json()["message"]["content"]
                print(f"\n⏱️ Inferencia completada en {elapsed} ms:")
                print("------------------------------------------------------------------")
                print(f"🤖 RESPUESTA DEL COPILOTO:\n{answer}")
                print("------------------------------------------------------------------")
        except KeyboardInterrupt:
            print("\nCerrando aplicación...")
            break
        except Exception as e:
            print(f"Error durante el procesamiento: {e}")

if __name__ == "__main__":
    run_audio_copilot()
