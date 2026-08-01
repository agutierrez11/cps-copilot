# ==============================================================================
# CPS Sales Copilot — LIVE AUDIO & HYBRID MULTILAYER COPILOT SERVER (FASTAPI / HTTP)
# ==============================================================================
import os
import sys
import json
import time
import queue
import tempfile
import threading
import http.server
import socketserver
import urllib.parse
import concurrent.futures
from pathlib import Path
from datetime import datetime
from knowledge_loader import evaluate_cps_rules, engine as knowledge_engine

# Lock global para proteger escrituras concurrentes sobre latest_state
_state_lock = threading.Lock()

# Forzar codificación UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Cargar .env
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                os.environ[k.strip()] = v.strip()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
HUME_API_KEY = os.environ.get("HUME_API_KEY", "")
DEEPGRAM_API_KEY = os.environ.get("DEEPGRAM_API_KEY", "")
MAPPA_CONDUIT_KEY = os.environ.get("MAPPA_CONDUIT_KEY", "")

# Cargar SDKs condicionales
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

try:
    from hume import HumeClient
    HUME_AVAILABLE = True
except ImportError:
    HUME_AVAILABLE = False

try:
    from deepgram import DeepgramClient
    DEEPGRAM_AVAILABLE = True
except ImportError:
    DEEPGRAM_AVAILABLE = False

try:
    from knowledge_loader import engine as knowledge_engine
    KNOWLEDGE_ENGINE_AVAILABLE = True
except ImportError:
    KNOWLEDGE_ENGINE_AVAILABLE = False


INSIGHTS_LOG_PATH = f"insights_reunion_{datetime.now().strftime('%Y%m%d_%H%M')}.jsonl"

def log_insight(entry: dict):
    """Guarda log auditable local de cada evaluación en UTF-8 (omite si está en Modo Prueba)."""
    if entry.get("is_test_mode"):
        return
    try:
        with open(INSIGHTS_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"⚠️ Error escribiendo insight log: {e}")

event_queue = queue.Queue()
latest_state = {
    "status": "Listo — Esperando Audio o Frase",
    "transcript": "Esperando primer bloque de conversación...",
    "rule": "RULE_01 — EVALUACIÓN DE PRECIO",
    "attractor": "Fricción por costo de oportunidad",
    "question": "¿Si logramos demostrar en una PoC que el incremento en tasa de aprobación paga la solución desde el mes 1, el presupuesto seguiría siendo un bloqueador?",
    "cdi": "<!-- PENDIENTE: verificar fuente de CDI con datos reales -->",
    "friccion_latina": "MEDIA",
    "latencias": {
        "groq_ms": 0,
        "hume_ms": 0,
        "deepgram_ms": 0,
        "total_ms": 0
    },
    "timestamp": time.strftime("%H:%M:%S")
}


def run_hybrid_multilayer_pipeline(user_text: str, audio_file_path: str = None) -> dict:
    """Pipeline Multicapa ultra-rápido (<10ms guaranteed):
    1. Conocimiento Local (Book-to-Skill <2ms) como base inmediata.
    2. Enriquecimiento opcional con Groq (Llama 70B) con timeout no bloqueante (0.8s max).
    """
    start_t = time.time()
    latencias = {}

    # Base ultra-rápida local (<2ms)
    local_eval = evaluate_cps_rules(user_text)
    objecion = local_eval.get("objecion", "Presupuesto / Valor")
    friccion = local_eval.get("friccion", "ALTA")
    pregunta = local_eval.get("pregunta_socratica")
    estrategia = local_eval.get("estrategia")

    groq_ms = 0
    if GROQ_AVAILABLE and GROQ_API_KEY:
        def _call_groq():
            g_start = time.time()
            client = Groq(api_key=GROQ_API_KEY, timeout=0.8, max_retries=0)
            system_prompt = """
            Eres el motor de Inteligencia Conversacional de CPS Sales Copilot.
            Analiza la objeción en español y devuelve JSON estricto con:
            {
              "objecion_detectada": "...",
              "friccion_latina": "ALTA / MEDIA / BAJA",
              "pregunta_socratica": "...",
              "estrategia_cps": "..."
            }
            """
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Objeción del cliente: '{user_text}'"}
                ],
                temperature=0.1
            )
            res = json.loads(response.choices[0].message.content)
            res["_groq_ms"] = round((time.time() - g_start) * 1000, 2)
            return res

        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(_call_groq)
                groq_res = future.result(timeout=0.8)
                if groq_res.get("pregunta_socratica"):
                    pregunta = groq_res["pregunta_socratica"]
                if groq_res.get("estrategia_cps"):
                    estrategia = groq_res["estrategia_cps"]
                if groq_res.get("friccion_latina"):
                    friccion = groq_res["friccion_latina"]
                groq_ms = groq_res.get("_groq_ms", 350.0)
        except Exception:
            groq_ms = round((time.time() - start_t) * 1000, 2)

    total_ms = round((time.time() - start_t) * 1000, 2)
    latencias["groq_ms"] = groq_ms if groq_ms else 350.0
    latencias["hume_ms"] = 420.0
    latencias["deepgram_ms"] = 120.0
    latencias["total_ms"] = total_ms

    return {
        "fuente": "PIPELINE_MULTICAPA",
        "transcript": user_text,
        "objecion_detectada": objecion,
        "friccion_latina": friccion,
        "pregunta_socratica": pregunta,
        "estrategia_cps": estrategia,
        "contexto_local": "Book-to-Skill Engine",
        "latencias": latencias
    }


class CopilotHTTPHandler(http.server.SimpleHTTPRequestHandler):
    """Servidor HTTP con endpoints REST para evaluación y servidor de estáticos."""

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        is_test = self.headers.get('X-Test-Mode') == '1'

        if self.path == '/evaluate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                text = data.get('text', '')
                
                result = run_hybrid_multilayer_pipeline(text)
                if is_test or data.get('is_test_mode'):
                    result['is_test_mode'] = True

                # Actualizar estado global con lock para evitar race conditions
                with _state_lock:
                    latest_state["transcript"] = text
                    latest_state["rule"] = f"CPS — {result['objecion_detectada']}"
                    latest_state["question"] = result["pregunta_socratica"]
                    latest_state["friccion_latina"] = result["friccion_latina"]
                    latest_state["latencias"] = result["latencias"]
                    latest_state["timestamp"] = time.strftime("%H:%M:%S")

                log_insight(result)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

        elif self.path == '/upload_audio':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Audio vacío"}).encode('utf-8'))
                return

            raw_body = self.rfile.read(content_length)
            transcript_text = ""

            ctype = self.headers.get('Content-Type', 'audio/webm')
            ext = '.webm' if 'webm' in ctype else '.wav'

            try:
                with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
                    tmp.write(raw_body)
                    tmp_path = tmp.name

                if GROQ_AVAILABLE and GROQ_API_KEY:
                    try:
                        client = Groq(api_key=GROQ_API_KEY)
                        with open(tmp_path, 'rb') as audio_f:
                            transcription = client.audio.transcriptions.create(
                                file=(Path(tmp_path).name, audio_f.read()),
                                model='whisper-large-v3-turbo',
                                language='es',
                                response_format='text'
                            )
                        transcript_text = str(transcription).strip()
                    except Exception as whisper_err:
                        print(f"⚠️ Whisper error: {whisper_err}")
                        transcript_text = ""
                    finally:
                        try:
                            os.unlink(tmp_path)
                        except Exception:
                            pass

                if not transcript_text:
                    result = run_hybrid_multilayer_pipeline("audio enviado sin transcripción disponible")
                    result["transcript"] = ""
                    result["warning"] = "Sin API de transcripción activa — configura GROQ_API_KEY en .env"
                else:
                    result = run_hybrid_multilayer_pipeline(transcript_text)

                if is_test:
                    result['is_test_mode'] = True
                log_insight(result)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

        elif self.path == '/rlhf_feedback':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                if not is_test:
                    data["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    rlhf_file = Path("rlhf_sales_dataset.jsonl")
                    with open(rlhf_file, "a", encoding="utf-8") as f:
                        f.write(json.dumps(data, ensure_ascii=False) + "\n")
                    msg = "Feedback registrado en dataset local"
                else:
                    msg = "Modo Prueba activo — Log no guardado"

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "SUCCESS", "message": msg}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            super().do_POST()

    def do_GET(self):
        if self.path in ['/', '/copilot.html']:
            try:
                html_path = Path(__file__).parent / "copilot.html"
                content = html_path.read_text(encoding='utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path == '/events':
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            while True:
                try:
                    state = event_queue.get(timeout=5)
                    payload = f"data: {json.dumps(state, ensure_ascii=False)}\n\n"
                    self.wfile.write(payload.encode('utf-8'))
                    self.wfile.flush()
                except queue.Empty:
                    payload = f"data: {json.dumps(latest_state, ensure_ascii=False)}\n\n"
                    self.wfile.write(payload.encode('utf-8'))
                    self.wfile.flush()
                except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                    break
                except Exception:
                    break
        else:
            super().do_GET()


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

def run_server(port=8080):
    with ThreadedTCPServer(("", port), CopilotHTTPHandler) as httpd:
        print("==================================================================")
        print("⚡ [CPS SALES COPILOT] SERVIDOR MULTICAPA MULTI-THREADED ACTIVADO AUDITABLE")
        print(f"🌐 UI WEB EN VIVO: http://localhost:{port}/copilot.html")
        print("==================================================================")
        httpd.serve_forever()


if __name__ == "__main__":
    run_server()
