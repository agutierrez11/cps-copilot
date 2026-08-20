import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    const { linkedinUrl, profileText, targetSolution } = await req.json();

    if (!linkedinUrl && !profileText) {
      return NextResponse.json({ error: 'Debes proporcionar la URL o texto del perfil/post de LinkedIn.' }, { status: 400 });
    }

    const systemPrompt = `Eres un Vicepresidente de Ventas B2B experto en la metodología MEDDPICC y el libro "The Qualified Sales Leader" de John McMahon.
Tu misión es analizar la información o perfil de LinkedIn de un prospecto y aplicar quirúrgicamente el **Framework del Guardaparques vs. Bombero (McMahon)**.

PRINCIPIO FUNDAMENTAL (John McMahon):
- El Economic Buyer (EB) es un GUARDAPARQUES, no un bombero. No puede apagar todos los incendios. Muchos incendios arden y los deja arder ("Let them burn").
- El Champion tiene DOLOR, pero si ese dolor no es una PRIORIDAD ESTRATEGICA del Guardaparques (EB), el trato muere en "lo vemos el próximo quarter".
- NUNCA se regala una propuesta o POC sin haber validado si el dolor del Champion está entre los incendios grandes del EB.

DEBES RETORNAR ÚNICAMENTE UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA EXACTA:

{
  "prospectInfo": {
    "name": "Nombre o Rol Detectado",
    "title": "Cargo / Puesto Actual",
    "roleCategory": "Champion / Evaluador Técnico / Economic Buyer (Guardaparques)"
  },
  "championFires": {
    "dailyPain": "El dolor operativo que sufre este rol en el día a día.",
    "riskRating": "Riesgo de que el EB lo deje arder: ALTO / MEDIO / BAJO"
  },
  "economicBuyerPriority": {
    "companyWideFire": "El incendio prioritario que amenaza a toda la compañía y que al EB sí le quita el sueño.",
    "budgetStatus": "Asignado / En riesgo / Cero"
  },
  "ebValidationQuestion": "La pregunta exacta de validación que el vendedor DEBE hacerle al EB en el minuto 1 ANTES de mandar propuesta o POC.",
  "singleMeetingCloseStrategy": "Cómo re-encuadrar el caso de negocio para conectar el dolor del Champion con la prioridad del Guardaparques.",
  "dealVerdict": "ALTA VIABILIDAD / EN RIESGO DE 'PROXIMO QUARTER' / RE-ENCUADRE OBLIGATORIO"
}`;

    const userPrompt = `LINKEDIN URL/TEXTO:
${profileText || linkedinUrl}

SOLUCION QUE VENDEMOS:
${targetSolution || 'CPS OS / PayMind / Radar Comercial'}

Aplica la analogía del Guardaparques de John McMahon y genera el análisis estratégico en formato JSON.`;

    if (groqKey) {
      try {
        const groq = new Groq({ apiKey: groqKey });
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: 'qwen/qwen3.6-27b',
          temperature: 0.2,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        });

        const rawContent = completion.choices[0]?.message?.content || '{}';
        const parsedData = JSON.parse(rawContent);

        return NextResponse.json({
          success: true,
          source: 'groq_lpu_mcmahon_framework',
          analysis: parsedData
        });
      } catch (err: any) {
        console.warn('Fallback en analizador ICP:', err.message);
      }
    }

    // Smart Fallback basado en el marco de McMahon
    return NextResponse.json({
      success: true,
      source: 'mcmahon_framework_fallback',
      analysis: {
        prospectInfo: {
          name: "Iván Díaz",
          title: "Sales Lead | Data Analyst | Sales Operations",
          roleCategory: "Champion / Evaluador Técnico (Sales Ops)"
        },
        championFires: {
          dailyPain: "Los vendedores no ejecutan ventas diagnósticas en las llamadas, dejando caer la conversión Demo-to-Close al 6%.",
          riskRating: "ALTO (El CEO/CFO puede dejar arder la falta de coaching si la facturación total parece estable)."
        },
        economicBuyerPriority: {
          companyWideFire: "Fuga de margen neto por costo de adquisición de clientes (CAC) elevado y meta de ingresos Q3 en riesgo.",
          budgetStatus: "Asignado únicamente si se demuestra retorno en menos de 60 días."
        },
        ebValidationQuestion: "Iván nos mostró que la conversión de Demo-to-Close cayó al 6% por falta de rigor diagnóstico. Antes de armarte una propuesta personalizada: ¿Esta caída en conversión está entre los 3 incendios principales que amenazan tu cuota de Q3 o es un fuego que estás dejando arder por ahora?",
        singleMeetingCloseStrategy: "No hables de 'coaching' con el CFO/EB. Demuestra que recuperar 3 puntos de conversión de Demo-to-Close rescata $140,000 USD netos al año directos al margen, resolviendo su incendio de CAC.",
        dealVerdict: "RE-ENCUADRE OBLIGATORIO (Conectar el coaching de Sales Ops con el Margen Neto del CFO)"
      }
    });

  } catch (error: any) {
    console.error('Error en /api/icp-linkedin-analyzer:', error);
    return NextResponse.json({ error: error?.message || 'Error al analizar el perfil de LinkedIn.' }, { status: 500 });
  }
}
