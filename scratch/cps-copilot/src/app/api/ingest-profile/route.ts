import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, websiteUrl, documentText, notes } = body;

    if (!companyName && !documentText && !notes) {
      return NextResponse.json({ error: 'Debes proporcionar al menos el nombre, notas o documento.' }, { status: 400 });
    }

    const contextCombined = `
EMPRESA / PROYECTO: ${companyName || 'No especificado'}
SITIO WEB: ${websiteUrl || 'No especificado'}
DOCUMENTO / DECK / PITCH: ${documentText || 'No especificado'}
NOTAS / QUÉ VENDEMOS Y A QUIÉN: ${notes || 'No especificado'}
    `.trim();

    const systemPrompt = `
Eres el "CPS Business Engine Architect", un consultor estratégico de primer nivel entrenado en Complex Problem Solving, RevOps y análisis cuantitativo de valor.

Tu objetivo es leer el contexto de una empresa, producto o servicio (que puede ser una web, un deck de ventas o notas) y extraer un PERFIL ESTRUCTURADO completo para simular su Caso de Negocio y secuencias de prospección.

DEBES RESPONDER EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA EXACTA:
{
  "id": "slug_unico_sin_espacios",
  "name": "Nombre de la Empresa o Solución",
  "tagline": "Propuesta de valor de 1 línea enfocada en impacto financiero",
  "industry": "Industria / Nicho",
  "currency": "USD" o "MXN",
  "regulations": [
    "Ley o Norma 1 aplicable al nicho (ej. NOM, SAT, Ley Federal, etc.)",
    "Estándar o regulación de mercado 2"
  ],
  "variables": [
    {
      "id": "var1",
      "label": "Etiqueta entendible (ej. Empleados, Camiones, Facturación Mensual, etc.)",
      "min": 10,
      "max": 500,
      "default": 50,
      "step": 5,
      "unit": "unidades/mes"
    },
    {
      "id": "var2",
      "label": "Métrica de Costo o Fuga Unitaria",
      "min": 100,
      "max": 5000,
      "default": 1000,
      "step": 50,
      "unit": "$/unidad"
    },
    {
      "id": "var3",
      "label": "Tasa de Ineficiencia / Fricción (%)",
      "min": 5,
      "max": 30,
      "default": 15,
      "step": 1,
      "unit": "%"
    }
  ],
  "outreach_emails": [
    {
      "step": "Email 1 (Día 1) — El Gancho de la Fuga Oculta",
      "subject": "fuga en [Proceso Clave] de [Empresa]",
      "body": "Texto del correo con gancho cuantificado y pregunta socrática..."
    },
    {
      "step": "Email 2 (Día 4) — Cita Regulatoria o Riesgo de Mercado",
      "subject": "[Regulación/Norma] y continuidad operativa",
      "body": "Texto del correo citando la regulación..."
    },
    {
      "step": "Email 3 (Día 8) — Caso de Éxito & Demostración",
      "subject": "cómo [Empresa Similar] optimizó [Dolor]",
      "body": "Texto del caso de éxito..."
    },
    {
      "step": "Email 4 (Día 12) — Break-up con Costo de Inacción",
      "subject": "¿cerramos el expediente?",
      "body": "Texto de cierre con cálculo del Costo de Inacción..."
    }
  ]
}

Responde ÚNICAMENTE con el objeto JSON válido. No agregues explicaciones, ni etiquetas markdown \`\`\`json.
`;

    const completion = await groq.chat.completions.create({
      model: 'groq/compound',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analiza este contexto y genera el perfil comercial cuantitativo:\n\n${contextCombined}` }
      ],
      temperature: 0.2,
    });

    let raw = completion.choices[0]?.message?.content || '{}';
    raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    const parsedProfile = JSON.parse(raw);
    return NextResponse.json({ profile: parsedProfile });

  } catch (error: any) {
    console.error('Error en /api/ingest-profile:', error);
    return NextResponse.json({ error: error?.message || 'Error al procesar el contexto con IA.' }, { status: 500 });
  }
}
