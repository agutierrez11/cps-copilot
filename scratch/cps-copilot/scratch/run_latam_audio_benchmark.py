import urllib.request
import json
import time
import os

BASE_URL = "http://localhost:3001"

LATAM_SCENARIOS = [
    {
        "id": 1,
        "region": "México",
        "title": "Objeción de Costo & Petición de Correo Suave",
        "audio_transcript": "Mira Antonio, está súper interesante la pasarela de pagos, pero la verdad ahorita andamos apretados con el presupuesto. Mándamelo por correo y lo checamos la otra semana con el equipo.",
        "expected_intent": "Soft Rejection / Prioridad Baja",
        "expected_dialect": "México"
    },
    {
        "id": 2,
        "region": "Colombia",
        "title": "Validación de Capacidad Técnica & Precio",
        "audio_transcript": "Parce, el equipo de ustedes me parece muy teso para el reintento de cobros, pero el costo de transacción no está nada bacán comparado con el banco local.",
        "expected_intent": "Validación Técnica Alta / Objeción de Tasa",
        "expected_dialect": "Colombia"
    },
    {
        "id": 3,
        "region": "Chile",
        "title": "Objeción de Comisión sobre Impuestos (Gasolineras)",
        "audio_transcript": "Nosotros acá en las estaciones de servicio tenemos el problema de que el adquirente nos cobra la comisión sobre el total del ticket con IEPS e IVA, cachai? Cuánto nos saldría con ustedes?",
        "expected_intent": "Mecanismo de Adquirencia / Cobro sobre Impuestos",
        "expected_dialect": "Chile"
    },
    {
        "id": 4,
        "region": "Argentina",
        "title": "Incertidumbre de Presupuesto & Próximo Quarter",
        "audio_transcript": "Che, la propuesta está bárbara pero con el cierre del trimestre no hay presupuesto asignado. Dejémoslo congelado y lo retomamos el próximo quarter.",
        "expected_intent": "Riesgo de Congelamiento / Validar Economic Buyer",
        "expected_dialect": "Argentina"
    },
    {
        "id": 5,
        "region": "México",
        "title": "Fuga Operativa en Conciliación de Facturación SAT",
        "audio_transcript": "El problema real en las 18 sucursales es que el equipo contable pierde 30 horas a la semana aclarando diferencias de facturación CFDI 4.0 con el banco.",
        "expected_intent": "Fuga Operativa / COI Monetizable",
        "expected_dialect": "México"
    },
    {
        "id": 6,
        "region": "Colombia",
        "title": "Fricción de Retención en Clientes Recurrentes",
        "audio_transcript": "Estamos perdiendo casi un 12 por ciento de suscripciones mensuales porque el banco rechaza las tarjetas de crédito sin avisar al usuario.",
        "expected_intent": "Churn de Suscripciones / Reintento Inteligente",
        "expected_dialect": "Colombia"
    },
    {
        "id": 7,
        "region": "Chile",
        "title": "Validación del Economic Buyer (Guardaparques)",
        "audio_transcript": "A mí me encanta la herramienta po, pero la decisión final del presupuesto y la firma del contrato depende 100 por ciento del Gerente General.",
        "expected_intent": "Champion identificado / Falta validación de Guardaparques",
        "expected_dialect": "Chile"
    },
    {
        "id": 8,
        "region": "México",
        "title": "Ataque Directo de Competidor Bancario",
        "audio_transcript": "Nosotros ya tenemos convenio preferencial con BBVA y nos dan tasa del 1.2 por ciento fija en las terminales físicas.",
        "expected_intent": "Objeción de Competidor / Tasa Promocional",
        "expected_dialect": "México"
    },
    {
        "id": 9,
        "region": "Argentina",
        "title": "Petición de Descuento Agresivo antes de Firmar",
        "audio_transcript": "Mirá, si me bajás la tasa un 20 por ciento te firmo el contrato hoy mismo antes de las 5 de la tarde.",
        "expected_intent": "Presión de Cierre / Negociación de Margen",
        "expected_dialect": "Argentina"
    },
    {
        "id": 10,
        "region": "LATAM Enterprise",
        "title": "Dudas de Seguridad y Privacidad (Zero Storage)",
        "audio_transcript": "Nuestra área legal prohíbe cualquier grabación de audio o almacenamiento de conversaciones en la nube por normativas de compliance.",
        "expected_intent": "Objeción Legal / Presentar Modo Efímero RAM",
        "expected_dialect": "LATAM Enterprise"
    }
]

def run_benchmark():
    print("=== INICIANDO BATERIA AUTONOMA DE PRUEBAS DE AUDIO LATAM EN SEGUNDO PLANO ===")
    print(f"Total de Escenarios a Evaluar: {len(LATAM_SCENARIOS)}")
    print("=" * 60)
    
    results = []
    total_start = time.time()
    
    for item in LATAM_SCENARIOS:
        print(f"[*] Evaluando [{item['id']}/10] {item['region']} - {item['title']}...")
        payload = json.dumps({
            "transcript": item["audio_transcript"],
            "currentRole": "Director Comercial B2B",
            "targetCompanyType": item["region"]
        }).encode('utf-8')
        
        req = urllib.request.Request(
            f"{BASE_URL}/api/analyze",
            data=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        start_time = time.time()
        try:
            with urllib.request.urlopen(req) as response:
                status = response.getcode()
                elapsed = int((time.time() - start_time) * 1000)
                res_data = json.loads(response.read().decode('utf-8'))
                
                results.append({
                    "id": item["id"],
                    "region": item["region"],
                    "title": item["title"],
                    "status": status,
                    "latency_ms": elapsed,
                    "has_insight": bool(res_data.get("interviewerIntent")),
                    "intent": res_data.get("interviewerIntent", "N/A"),
                    "socratic_counter": res_data.get("socraticCounter", "N/A"),
                    "minto_answer": res_data.get("mintoAnswer", [])
                })
                print(f"   [OK] {elapsed}ms - Intencion: {res_data.get('interviewerIntent', '')[:45]}...")
        except Exception as e:
            elapsed = int((time.time() - start_time) * 1000)
            results.append({
                "id": item["id"],
                "region": item["region"],
                "title": item["title"],
                "status": 500,
                "latency_ms": elapsed,
                "error": str(e)
            })
            print(f"   [ERROR] {elapsed}ms: {e}")
            
        time.sleep(1)
            
    total_elapsed = round(time.time() - total_start, 2)
    
    # Guardar reporte en JSON y Markdown
    report_file = os.path.join(os.path.dirname(__file__), "latam_benchmark_report.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump({"total_time_sec": total_elapsed, "results": results}, f, indent=2, ensure_ascii=False)
        
    print("=" * 60)
    print(f"[FINISHED] EVALUACION COMPLETADA EN {total_elapsed}s")
    print(f"Reporte guardado en: {report_file}")

if __name__ == "__main__":
    run_benchmark()
