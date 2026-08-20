import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dealId, companyName, coiMonthly, coiAnnual, paybackMonths, dictumText } = body;

    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;

    const noteBody = `🎯 DICTAMEN DIAGNÓSTICO CPS OS (Ventas Consultivas)
--------------------------------------------------
Empresa / Cuenta: ${companyName || 'Prospecto B2B'}
Fuga Mensual Rescatable (COI): $${(coiMonthly || 0).toLocaleString()} USD
Impacto Anual Neto: $${(coiAnnual || 0).toLocaleString()} USD
Periodo de Amortización (Payback): ${paybackMonths || 'N/A'} meses

📋 Dictamen Ejecutivo BLUF:
${dictumText || 'Sin dictamen'}

Sincronizado automáticamente por CPS OS v2.4`;

    // Si el usuario ya configuró un token real de HubSpot Private App
    if (hubspotToken) {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            hs_timestamp: new Date().toISOString(),
            hs_note_body: noteBody,
          },
          associations: dealId ? [
            {
              to: { id: dealId },
              types: [
                {
                  associationCategory: 'HUBSPOT_DEFINED',
                  associationTypeId: 214 // Nota a Deal
                }
              ]
            }
          ] : []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al comunicarse con la API de HubSpot.');
      }

      const data = await response.json();
      return NextResponse.json({
        success: true,
        mode: 'live_hubspot_api',
        noteId: data.id,
        message: 'Nota y dictamen diagnóstico sincronizados en vivo con HubSpot CRM.'
      });
    }

    // Modo Sandbox / Demo (Si aún no se ha pegado el token de HubSpot en .env.local)
    return NextResponse.json({
      success: true,
      mode: 'sandbox_demo',
      simulatedDealId: dealId || 'DEAL-HS-84920',
      simulatedNoteId: `NOTE-${Math.floor(100000 + Math.random() * 900000)}`,
      payload: {
        companyName,
        coiMonthly,
        coiAnnual,
        paybackMonths,
        dictumTextSnippet: dictumText?.substring(0, 100) + '...'
      },
      message: 'Dictamen estructurado para HubSpot CRM (Modo Sandbox activo. Agrega HUBSPOT_ACCESS_TOKEN en .env.local para sync en vivo).'
    });

  } catch (error: any) {
    console.error('Error en /api/hubspot-sync:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al sincronizar con HubSpot.' },
      { status: 500 }
    );
  }
}
