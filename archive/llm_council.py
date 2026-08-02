import requests
import json
import sys
import os
import pyperclip

# Configuration
GEMINI_KEY = "AIzaSyBR_oEOiFqIr-Rw1b1V_dNRkolKl-piRME"
ANTHROPIC_KEY = "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"
GROQ_KEY = "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"

# Setup stdout for Windows unicode printing
if sys.platform.startswith('win'):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def call_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_KEY}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    r = requests.post(url, json=payload, timeout=20)
    if r.status_code == 200:
        return r.json()['candidates'][0]['content']['parts'][0]['text'].strip()
    else:
        raise Exception(f"Gemini Error ({r.status_code}): {r.text}")

def call_anthropic(prompt):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    data = {
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 1500,
        "messages": [{"role": "user", "content": prompt}]
    }
    r = requests.post(url, headers=headers, json=data, timeout=20)
    if r.status_code == 200:
        return r.json()['content'][0]['text'].strip()
    else:
        raise Exception(f"Anthropic Error ({r.status_code}): {r.text}")

def call_groq(prompt):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json"
    }
    # Try llama-3.3-70b-versatile first, fallback to llama-3.1-8b-instant
    for model in ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]:
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }
        try:
            r = requests.post(url, headers=headers, json=payload, timeout=20)
            if r.status_code == 200:
                return r.json()["choices"][0]["message"]["content"].strip()
        except Exception:
            continue
    raise Exception("Groq failed on both models.")

def run_council(user_prompt):
    print("\n" + "="*50)
    print("🤖 INICIANDO CONSEJO DE LLMS (LLM COUNCIL)")
    print("="*50)
    print(f"Instrucción original: {user_prompt[:150]}...")
    
    # ------------------ STAGE 1: FIRST DRAFTS ------------------
    print("\n[Etapa 1/3] Generando borradores iniciales...")
    
    # Persona 1: Gemini (Estructura clara, racional, directa)
    p_gemini = f"""Genera una versión o borrador para la siguiente solicitud: "{user_prompt}"
Requisitos: Sé directo, claro y profesional. Evita palabras vacías, emojis exagerados o introducciones corporativas falsas."""
    
    # Persona 2: Claude (Vulnerable, empático, estilo Sandler/Monge Malo, conversacional)
    p_claude = f"""Genera una versión o borrador para la siguiente solicitud: "{user_prompt}"
Requisitos: Escribe con un tono sumamente humano, conversacional y directo. Usa frases cortas. Evita a toda costa sonar a inteligencia artificial (no uses ganchos genéricos, ni emojis, ni exclamaciones exageradas). Sé un poco escéptico o informal, como si le escribieras a un amigo de confianza."""
    
    # Persona 3: Groq/Llama (Corto, audaz, al grano)
    p_groq = f"""Genera una versión o borrador para la siguiente solicitud: "{user_prompt}"
Requisitos: Sé extremadamente conciso, audaz y ve directo al grano. Elimina cualquier introducción. Entrega la idea en el menor número de palabras posible."""

    try:
        draft_gemini = call_gemini(p_gemini)
        print("  ✓ Borrador Gemini generado.")
    except Exception as e:
        draft_gemini = f"(Error en Gemini: {e})"
        print("  ✗ Error en Gemini.")

    try:
        draft_claude = call_anthropic(p_claude)
        print("  ✓ Borrador Claude generado.")
    except Exception as e:
        draft_claude = f"(Error en Claude: {e})"
        print("  ✗ Error en Claude.")

    try:
        draft_groq = call_groq(p_groq)
        print("  ✓ Borrador Groq generado.")
    except Exception as e:
        draft_groq = f"(Error en Groq: {e})"
        print("  ✗ Error en Groq.")

    # ------------------ STAGE 2: CROSS REVIEW ------------------
    print("\n[Etapa 2/3] Realizando revisión cruzada anónima...")
    
    review_prompt = f"""Aquí tienes tres borradores diferentes (Borrador A, Borrador B, Borrador C) escritos por distintos modelos para resolver: "{user_prompt}"

Borrador A:
{draft_gemini}

Borrador B:
{draft_claude}

Borrador C:
{draft_groq}

Analiza críticamente los tres borradores:
1. Señala cuál suena más a Inteligencia Artificial (clichés, estructura obvia, exageraciones, emojis).
2. Cuál es el más humano y persuasivo.
3. Sugiere mejoras específicas para pulirlos y combinarlos en la versión perfecta."""

    try:
        review_claude = call_anthropic(f"Actúa como un crítico de redacción implacable y experto en copy.\n{review_prompt}")
        print("  ✓ Crítica de Claude completada.")
    except Exception as e:
        review_claude = f"(Error en crítica de Claude: {e})"
        print("  ✗ Error en crítica de Claude.")

    try:
        review_gemini = call_gemini(f"Actúa como un analista de comunicación directo y racional.\n{review_prompt}")
        print("  ✓ Crítica de Gemini completada.")
    except Exception as e:
        review_gemini = f"(Error en crítica de Gemini: {e})"
        print("  ✗ Error en crítica de Gemini.")

    # ------------------ STAGE 3: CHAIRMAN RESOLUTION ------------------
    print("\n[Etapa 3/3] Redactando versión definitiva (Chairman)...")
    
    chairman_prompt = f"""Actúa como el Presidente del Consejo de LLMs (Chairman). Tu objetivo es entregar la versión definitiva y perfecta para la solicitud del usuario: "{user_prompt}"

Aquí tienes los borradores generados:
- Borrador A:
{draft_gemini}

- Borrador B:
{draft_claude}

- Borrador C:
{draft_groq}

Aquí están las revisiones críticas realizadas por el consejo:
Revisión 1:
{review_claude}

Revisión 2:
{review_gemini}

Por favor, redacta el texto final. Debe ser humano, directo, conversacional, con frases cortas y contundentes. Cero relleno corporativo o de IA. Presenta únicamente el texto final listo para copiar y pegar (no agregues introducciones ni explicaciones de lo que hiciste, ve directo al texto)."""

    try:
        final_text = call_anthropic(chairman_prompt)
        print("  ✓ Versión definitiva lista.")
    except Exception as e:
        print("  ✗ Error al generar versión definitiva con Claude, intentando con Gemini...")
        try:
            final_text = call_gemini(chairman_prompt)
            print("  ✓ Versión definitiva lista (Gemini).")
        except Exception as e2:
            final_text = f"Error total al generar resolución final: {e2}"
            print("  ✗ Error total.")

    # Save session details
    session_file = r"C:\Users\Antonio\.gemini\antigravity-ide\scratch\llm_council_last_session.txt"
    with open(session_file, "w", encoding="utf-8") as f:
        f.write(f"SOLICITUD:\n{user_prompt}\n\n")
        f.write(f"=== BORRADOR A (Gemini) ===\n{draft_gemini}\n\n")
        f.write(f"=== BORRADOR B (Claude) ===\n{draft_claude}\n\n")
        f.write(f"=== BORRADOR C (Groq) ===\n{draft_groq}\n\n")
        f.write(f"=== CRÍTICA CLAUDE ===\n{review_claude}\n\n")
        f.write(f"=== CRÍTICA GEMINI ===\n{review_gemini}\n\n")
        f.write(f"=== PROPUESTA FINAL ===\n{final_text}\n")

    # Copy to clipboard
    pyperclip.copy(final_text)
    
    print("\n" + "="*50)
    print("🏆 RESULTADO FINAL (COPIADO AL PORTAPAPELES)")
    print("="*50)
    print(final_text)
    print("="*50)
    print(f"Detalles guardados en: {session_file}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
    else:
        # Check clipboard
        clip = pyperclip.paste().strip()
        if clip:
            print(f"Contenido del portapapeles detectado:\n{clip[:100]}...\n")
            ans = input("¿Quieres procesar el texto del portapapeles? (S/N): ").strip().lower()
            if ans == 's' or ans == '':
                prompt = clip
            else:
                prompt = input("Ingresa tu instrucción o borrador: ").strip()
        else:
            prompt = input("Ingresa tu instrucción o borrador: ").strip()
            
    if not prompt:
        print("No se ingresó ninguna instrucción. Abortando.")
        sys.exit(0)
        
    run_council(prompt)
