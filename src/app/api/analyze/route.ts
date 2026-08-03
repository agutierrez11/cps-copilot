export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, contextConfig } = body;

    if (!transcript || transcript.trim().length < 20) {
      return NextResponse.json({ insights: [] });
    }

    // Default context if none provided
    const config = contextConfig || {
      mode: 'Reunión Comercial B2B',
      clientRole: 'Prospecto C-Level',
      industry: 'Tecnología/General',
      goal: 'Descubrimiento y Manejo de Objeciones'
    };

    const systemPrompt = `
      Eres el "CPS Copilot", un asistente táctico de ventas en tiempo real.
      ESTE ES TU CONTEXTO COMERCIAL ACTUAL:
      - Modo de Operación: ${config.mode}
      - Perfil del Cliente: ${config.clientRole}
      - Industria del Cliente: ${config.industry}
      - Objetivo del Vendedor: ${config.goal}

      Tu objetivo es analizar la transcripción en vivo de la llamada con este cliente y extraer insights accionables.

      REGLAS ESTRICTAS DE EXTRACCIÓN:
      Analiza el texto y genera un JSON con un arreglo llamado "insights". Cada insight debe tener:
      - "type": "objection" (si el prospecto pone una traba o inquietud) o "cdi" (señales de compra o dolores financieros/operativos).
      - "title": Título corto del hallazgo (ej. "Objeción de Presupuesto", "Dolor Operativo").
      - "text": Resumen de 1 línea de lo que dijo el prospecto.
      - "suggestion": Sugerencia táctica accionable de 1-2 líneas para el vendedor. Adapta tu táctica al contexto comercial provisto. Usa frameworks como Aislamiento, MEDDIC, o cálculo de Cost of Inaction (CDI).

      Solo responde con JSON válido. No incluyas markdown, saludos, ni texto adicional.
      Si no hay objeciones ni dolores claros en el texto, devuelve un arreglo vacío [].
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transcripción reciente de la llamada: "${transcript}"` }
      ],
      model: "llama3-70b-8192", // Fast and capable for zero-shot JSON extraction
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    let parsedData = { insights: [] };
    if (responseContent) {
      parsedData = JSON.parse(responseContent);
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error en Groq API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}