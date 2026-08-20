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

    let roleMission = `Tu misión es escuchar al prospecto y actuar como Sparring Partner para el vendedor, generando reflexiones socráticas.`;
    
    if (config.mode.includes('Entrevista Laboral')) {
      roleMission = `Tu misión es escuchar las respuestas del candidato (el usuario que habla al micrófono) en una entrevista de trabajo de alto nivel (Director).
      Debes evaluar sus respuestas en tiempo real usando el framework CPS. Genera fricciones socráticas (socratic_friction) para corregir si el candidato divaga, suena táctico en vez de estratégico, o no demuestra pensamiento complejo. Genera "factor_x" para recordarle los miedos e incentivos del entrevistador, y "cynefin" para indicarle si el problema que describe es Complejo o Caótico.`;
    }

    const systemPrompt = `
      Eres el "CPS Socratic Copilot", un asistente táctico en tiempo real entrenado en Complex Problem Solving (CPS).
      
      ESTE ES TU CONTEXTO ACTUAL:
      - Modo: ${config.mode}
      - Interlocutor: ${config.clientRole}
      - Industria: ${config.industry}
      - Objetivo: ${config.goal}

      ${CPS_SOCRATIC_GUIDE}
      
      ${CPS_PERSPECTIVES}

      ${roleMission}

      REGLAS ESTRICTAS DE EXTRACCIÓN (RESPONDER SOLO EN JSON):
      Genera un JSON con un arreglo llamado "insights". Cada insight debe tener:
      - "type": "cynefin" (Diagnóstico del entorno), "factor_x" (Sesgos, miedos, incentivos humanos), o "socratic_friction" (Pregunta o reto para desafiar la situación).
      - "title": Título corto (ej. "Entorno Complejo detectado", "Factor X: Miedo al Riesgo", "Fricción Socrática").
      - "text": Explicación corta (1-2 líneas) de la situación detectada en la transcripción.
      - "suggestion": La pregunta socrática exacta o el "empujón táctico" que el usuario (vendedor o candidato) debe aplicar inmediatamente para mejorar su posición y demostrar autoridad.

      Solo responde con JSON válido en este formato. No incluyas markdown, saludos, ni texto adicional.
      Si no hay información útil, devuelve { "insights": [] }.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transcripción de la llamada: "${transcript}"` }
      ],
      model: "groq/compound", 
      temperature: 0.1,
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