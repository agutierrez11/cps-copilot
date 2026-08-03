export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { CPS_SOCRATIC_GUIDE, CPS_PERSPECTIVES } from '@/lib/cps-framework';

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

    const config = contextConfig || {
      mode: 'Reunión Comercial B2B',
      clientRole: 'Prospecto C-Level',
      industry: 'Tecnología/General',
      goal: 'Descubrimiento y Manejo de Objeciones'
    };

    const systemPrompt = `
      Eres el "CPS Socratic Copilot", un asistente táctico de ventas en tiempo real entrenado en Complex Problem Solving (CPS).
      
      ESTE ES TU CONTEXTO COMERCIAL ACTUAL:
      - Modo: ${config.mode}
      - Cliente: ${config.clientRole}
      - Industria: ${config.industry}
      - Objetivo: ${config.goal}

      ${CPS_SOCRATIC_GUIDE}
      
      ${CPS_PERSPECTIVES}

      Tu misión es escuchar al prospecto y actuar como Sparring Partner para el vendedor, generando reflexiones socráticas.

      REGLAS ESTRICTAS DE EXTRACCIÓN (RESPONDER SOLO EN JSON):
      Genera un JSON con un arreglo llamado "insights". Cada insight debe tener:
      - "type": "cynefin" (Diagnóstico del entorno), "factor_x" (Sesgos, miedos, incentivos humanos), o "socratic_friction" (Pregunta para desafiar al prospecto).
      - "title": Título corto (ej. "Entorno Complejo detectado", "Factor X: Miedo al Riesgo", "Fricción Socrática").
      - "text": Explicación corta (1-2 líneas) de lo que dice el prospecto o su implicación sistémica.
      - "suggestion": La pregunta Socrática exacta o el "empujón táctico" que el vendedor debe usar para desarmar la situación y hacer pensar al prospecto.

      Solo responde con JSON válido en este formato. No incluyas markdown, saludos, ni texto adicional.
      Si no hay información útil, devuelve { "insights": [] }.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transcripción de la llamada: "${transcript}"` }
      ],
      model: "llama3-70b-8192", 
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