import os
import time
from groq import Groq

groq_api_key = os.environ.get("GROQ_API_KEY", "")

def test_socratic_reframe(api_key, user_objection_text):
    """
    Toma la objeción latina del cliente (transcrita por Groq Whisper V3)
    y genera el re-encuadre socrático en tiempo real con Groq Llama-3.3-70B.
    """
    client = Groq(api_key=api_key)

    system_prompt = """
    Eres el motor de Inteligencia Conversacional de CPS Sales Copilot.
    Tu objetivo es analizar objeciones evasivas de compradores en América Latina 
    (ej: 'ahorita', 'deja lo checo con mi socio', 'luego te aviso', 'mándame la info').

    INSTRUCCIONES:
    1. Identifica el tipo de Fricción / Objeción Oculta.
    2. Genera una Pregunta Socrática DIPLOMÁTICA para romper la cortesía sin agredir y descubrir la intención real.
    3. Responde en formato JSON con la siguiente estructura:
       {
         "friccion_detectada": "...",
         "nivel_de_riesgo": "ALTO / MEDIO / BAJO",
         "pregunta_socratica": "...",
         "razonamiento_cps": "..."
       }
    """

    start_time = time.time()
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"El cliente acaba de decir en la llamada: '{user_objection_text}'"}
        ],
        temperature=0.2
    )

    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    print(f"\n⚡ [RESPUESTA DE GROQ EN {elapsed_ms} ms]:")
    print(response.choices[0].message.content)

if __name__ == "__main__":
    print("🚀 === TEST DE PRUEBA EN VIVO - CPS SALES COPILOT CON GROQ ===")
    objecion_demo = "Mira Antonio, suena bien pero deja lo checo con mi socio y ahorita te aviso."
    print(f"🎙️ Objeción simulada en español: '{objecion_demo}'")
    
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        print("\n[!] Ingresa tu GROQ_API_KEY para ejecutar la prueba en vivo:")
        key = input("API Key (gsk_...): ").strip()
    
    if key:
        test_socratic_reframe(key, objecion_demo)
