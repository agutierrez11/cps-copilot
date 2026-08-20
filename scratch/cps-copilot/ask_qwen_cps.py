import urllib.request
import json
import sys
import os

DISIER_URL = "https://llm.disier.net/v1/chat/completions"
API_KEY = "Bearer sk-0MINhr9-vEmzYLUFx-OvjQ"

CPS_SYSTEM_PROMPT = """Eres el motor táctico de Complex Problem Solving (CPS), basado en la metodología de Javier Recuenco (Singular Solving) y el pensamiento estructurado MECE (Arnaud Chevallier / Minto).

Tu objetivo es analizar situaciones empresariales, objeciones comerciales y fricciones organizacionales complejas.

Para cada caso que te proporcione el usuario, debes entregar un análisis con esta estructura exacta:

1. 🎯 DIAGNÓSTICO CYNEFIN (Simple, Complicado, Complejo o Caótico)
   - Explicación de por qué cae en este dominio y cómo abordarlo.

2. 👥 FACTOR X & PSICOLOGÍA DE LOS DECISORES
   - Miedos, incentivos desalineados, aversión al riesgo o presencia del "listo" en la organización.

3. 🌳 ÁRBOL DE PROBLEMAS MECE (Mutuamente Excluyente y Colectivamente Exhaustivo)
   - Rama A: Causa técnica / de producto.
   - Rama B: Causa económica / financiera (incluyendo Costo de la Inacción - COI).
   - Rama C: Causa política / humana.

4. ⚡ DICTAMEN EJECUTIVO BLUF (Bottom Line Up Front)
   - Párrafo quirúrgico de 3 puntos listo para copiar y enviar al CFO/CEO para desatascar la decisión.
"""

def query_qwen(user_query: str):
    payload = {
        "model": "Qwen/Qwen3.8-27B",
        "messages": [
            {"role": "system", "content": CPS_SYSTEM_PROMPT},
            {"role": "user", "content": user_query}
        ],
        "max_tokens": 1500,
        "temperature": 0.3
    }
    
    headers = {
        "Authorization": API_KEY,
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(DISIER_URL, data=json.dumps(payload).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            res = json.loads(response.read().decode('utf-8'))
            msg = res['choices'][0]['message']
            content = msg.get('content') or msg.get('reasoning_content') or ''
            return content.strip()
    except Exception as e:
        return f"Error consultando Qwen: {e}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = "El cliente nos dice: 'Tu solución suena muy bien pero en este momento no tenemos presupuesto y lo evaluaremos hasta el Q1 del próximo año'."
        
    print(f"\n[CPS QWEN 27B] Analizando caso: '{query}'...\n")
    response = query_qwen(query)
    print("=" * 60)
    print(response)
    print("=" * 60)
