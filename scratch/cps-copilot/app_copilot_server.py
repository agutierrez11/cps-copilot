# ==============================================================================
# CPS Sales Copilot — LIVE AUDIO COPILOT WEB SERVER & PWA DASHBOARD (SSE & CORS FIX)
# ==============================================================================
import json
import time
import queue
import threading
import http.server
import socketserver
import requests
import numpy as np
import sounddevice as sd
from local_transcriber import transcribe_local
from datetime import datetime

# ==============================================================================
# LOG DE INSIGHTS (solo texto — el audio NUNCA se escribe a disco en este script)
# ==============================================================================
INSIGHTS_LOG_PATH = f"insights_reunion_{datetime.now().strftime('%Y%m%d_%H%M')}.jsonl"


def log_insight(entry: dict):
    """Guarda transcripción + análisis CPS en un archivo local de texto plano.
    NUNCA guarda audio — solo el texto ya transcrito y el análisis."""
    with open(INSIGHTS_LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


event_queue = queue.Queue()
latest_state = {
    "status": "Escuchando voz...",
    "transcript": "Esperando primer bloque de conversación...",
    "rule": "RULE_01 — FALSA TRACCIÓN",
    "attractor": "Evitación de compromiso en comité",
    "question": "¿Cuál es el principal riesgo que ve su socio para autorizar la compra esta semana?",
    "cdi": "$6,869.86 MXN / día",
    "timestamp": time.strftime("%H:%M:%S")
}

# Importar motor de conocimiento local Book-to-Skill (0ms latencia externa)
try:
    from knowledge_loader import engine as knowledge_engine
    KNOWLEDGE_ENGINE_AVAILABLE = True
except Exception as e:
    print(f"Advertencia: no se pudo cargar knowledge_engine: {e}")
    KNOWLEDGE_ENGINE_AVAILABLE = False

def evaluate_cps_rules(text):
    """Motor de Reglas Determinísticas CPS + Conocimiento Local Book-to-Skill (<5ms)"""
    text_lower = text.lower()
    
    # Consulta socrática local instantánea (<5ms) desde las carpetas knowledge/
    socratic_reframing = ""
    if KNOWLEDGE_ENGINE_AVAILABLE:
        hits = knowledge_engine.query(text_lower, category_filter="socratic_sales", top_k=1)
        if hits:
            socratic_reframing = hits[0]["content"]

    if "cotización" in text_lower or "correo" in text_lower or "demo" in text_lower or "socio" in text_lower or "precio" in text_lower:
        return {
            "rule": "RULE_01 — FALSA TRACCIÓN / EVALUACIÓN DE PRECIO",
            "attractor": "Evitación de compromiso / Enfoque en costo por transacción",
            "question": "¿Si logramos demostrar en una PoC que el incremento en tasa de aprobación paga la solución desde el mes 1, el presupuesto seguiría siendo un bloqueador?",
            "reframing": socratic_reframing[:300] if socratic_reframing else ""
        }
    elif "proveedor" in text_lower or "sistema" in text_lower or "actual" in text_lower or "ti" in text_lower:
        return {
            "rule": "RULE_02 — INERCIA COMERCIAL & BLOQUEADOR DE TI",
            "attractor": "Autoprotección política de TI por parches internos",
            "question": "¿Estarías abierto a probar un enrutamiento del 5% del tráfico excedente para comparar la tasa de aprobación real en vivo?",
            "reframing": socratic_reframing[:300] if socratic_reframing else ""
        }
    elif "cnbv" in text_lower or "cumplimiento" in text_lower or "multa" in text_lower or "auditoría" in text_lower:
        return {
            "rule": "RULE_03 — OFICIAL DE CUMPLIMIENTO / RIESGO SLA",
            "attractor": "Pánico regulatorio a multas y auditorías SITI PLD",
            "question": "¿Qué pasaría si la CNBV audita hoy tu matriz de riesgo PLD sin el módulo automatizado?",
            "reframing": socratic_reframing[:300] if socratic_reframing else ""
        }
    else:
        # Fallback instantáneo al motor socrático Book-to-Skill local
        return {
            "rule": "RULE_04 — DIAGNÓSTICO SOCRÁTICO EN VIVO",
            "attractor": "Atractor Cognitivo Detectado (Analizando Dolor Core)",
            "question": "¿Cuál es el principal motivo por el que evaluarían un cambio estratégico esta semana?",
            "reframing": socratic_reframing[:300] if socratic_reframing else ""
        }

def audio_worker():
    """Hilo de segundo plano para captura de audio con Maono PM461"""
    global latest_state
    fs = 16000
    window_duration = 30

    selected_device = None
    try:
        devices = sd.query_devices()
        usb_mics = [idx for idx, dev in enumerate(devices) if dev['max_input_channels'] > 0 and ("USB Condenser" in dev['name'] or "Maono" in dev['name'])]
        if usb_mics:
            selected_device = usb_mics[0]
            print(f"🎙️ [AUDIO ENGINE] Maono PM461 Detectado en índice [{selected_device}]")
    except Exception as e:
        print(f"⚠️ Error detectando micrófonos: {e}")

    block_count = 1
    while True:
        try:
            recording = sd.rec(int(window_duration * fs), samplerate=fs, channels=1, dtype='int16', device=selected_device)
            sd.wait()

            text = transcribe_local(recording, language="es")
            # 'recording' (el audio crudo) nunca se guarda ni se referencia de nuevo
            # a partir de aquí: se descarta solo al final de esta iteración del loop.

            if text:
                latest_state["transcript"] = text

                eval_result = evaluate_cps_rules(text)
                latest_state["rule"] = eval_result["rule"]
                latest_state["attractor"] = eval_result["attractor"]
                latest_state["question"] = eval_result["question"]
                latest_state["timestamp"] = time.strftime("%H:%M:%S")

                event_queue.put(latest_state)

                # Insight persistido en disco (texto). Audio: descartado, no persistido.
                log_insight({
                    "timestamp": latest_state["timestamp"],
                    "block": block_count,
                    "transcript": text,
                    "rule": eval_result["rule"],
                    "attractor": eval_result["attractor"],
                    "question": eval_result["question"],
                })

            block_count += 1
            time.sleep(1)
        except Exception as e:
            print(f"Error procesando audio: {e}")
            time.sleep(2)

class SSEHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/evaluate':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                text = data.get('text', '')
                eval_result = evaluate_cps_rules(text)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                self.wfile.write(json.dumps(eval_result).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
        else:
            super().do_POST()

    def do_GET(self):
        if self.path == '/events':
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            while True:
                try:
                    state = event_queue.get(timeout=15)
                    payload = f"data: {json.dumps(state)}\n\n"
                    self.wfile.write(payload.encode('utf-8'))
                    self.wfile.flush()
                except queue.Empty:
                    payload = f"data: {json.dumps(latest_state)}\n\n"
                    self.wfile.write(payload.encode('utf-8'))
                    self.wfile.flush()
                except Exception:
                    break
        else:
            super().do_GET()

def run_server():
    t = threading.Thread(target=audio_worker, daemon=True)
    t.start()

    PORT = 8080
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SSEHandler) as httpd:
        print("==================================================================")
        print(f"🌐 DASHBOARD PWA DEL COPILOT SERVIDO EN: http://localhost:{PORT}/copilot.html")
        print("==================================================================")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
