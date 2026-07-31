document.addEventListener('DOMContentLoaded', () => {
  // --- 1. DYNAMICORE COMPARISON CALCULATOR ---
  const rentaSlider = document.getElementById('rentaSlider');
  const rentaValue = document.getElementById('rentaValue');
  
  const setupCPS Sales Copilot = document.getElementById('setupCPS Sales Copilot');
  const rentaAnualCPS Sales Copilot = document.getElementById('rentaAnualCPS Sales Copilot');
  const tcoCPS Sales Copilot = document.getElementById('tcoCPS Sales Copilot');
  
  const setupDynamicore = document.getElementById('setupDynamicore');
  const rentaAnualDynamicore = document.getElementById('rentaAnualDynamicore');
  const extrasDynamicore = document.getElementById('extrasDynamicore');
  const tcoDynamicore = document.getElementById('tcoDynamicore');
  
  const savingsAmount = document.getElementById('savingsAmount');
  const savingsPercent = document.getElementById('savingsPercent');

  function formatCurrency(val) {
    return '$' + val.toLocaleString('es-MX') + ' MXN';
  }

  function updateCalculator() {
    if (!rentaSlider) return;
    const renta = parseInt(rentaSlider.value, 10);
    if (rentaValue) rentaValue.textContent = '$' + renta.toLocaleString('es-MX');

    const setupInt = renta * 2;
    const rentaAnualInt = renta * 12;
    const totalInt = setupInt + rentaAnualInt;

    const setupDyn = 350000;
    const rentaAnualDyn = Math.round(renta * 1.2) * 12;
    const extrasDyn = 200000;
    const totalDyn = setupDyn + rentaAnualDyn + extrasDyn;

    const ahorro = totalDyn - totalInt;
    const porcentaje = ((ahorro / totalDyn) * 100).toFixed(1);

    if (setupCPS Sales Copilot) setupCPS Sales Copilot.textContent = formatCurrency(setupInt);
    if (rentaAnualCPS Sales Copilot) rentaAnualCPS Sales Copilot.textContent = formatCurrency(rentaAnualInt);
    if (tcoCPS Sales Copilot) tcoCPS Sales Copilot.textContent = formatCurrency(totalInt);

    if (setupDynamicore) setupDynamicore.textContent = formatCurrency(setupDyn);
    if (rentaAnualDynamicore) rentaAnualDynamicore.textContent = formatCurrency(rentaAnualDyn);
    if (extrasDynamicore) extrasDynamicore.textContent = formatCurrency(extrasDyn);
    if (tcoDynamicore) tcoDynamicore.textContent = formatCurrency(totalDyn);

    if (savingsAmount) savingsAmount.textContent = formatCurrency(ahorro);
    if (savingsPercent) savingsPercent.textContent = `(${porcentaje}% de Ahorro Real)`;
  }

  if (rentaSlider) {
    rentaSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // --- 2. REVOPS CAPACITY & ARR/MRR KISS CALCULATOR (SECTION 4) ---
  const calcSliderClientes = document.getElementById('calcSliderClientes');
  const calcSliderMeses = document.getElementById('calcSliderMeses');
  const calcSliderAEs = document.getElementById('calcSliderAEs');
  const calcSliderTicket = document.getElementById('calcSliderTicket');
  const calcSliderSetup = document.getElementById('calcSliderSetup');

  const calcValClientes = document.getElementById('calcValClientes');
  const calcValMeses = document.getElementById('calcValMeses');
  const calcValAEs = document.getElementById('calcValAEs');
  const calcValTicket = document.getElementById('calcValTicket');
  const calcValSetup = document.getElementById('calcValSetup');

  const calcKpiRitmoEmpresa = document.getElementById('calcKpiRitmoEmpresa');
  const calcKpiCuotaAE = document.getElementById('calcKpiCuotaAE');
  const calcKpiMrrTotal = document.getElementById('calcKpiMrrTotal');
  const calcKpiArrTotal = document.getElementById('calcKpiArrTotal');
  const calcKpiSetupTotal = document.getElementById('calcKpiSetupTotal');

  // Global helper to format currency
  window.formatMdp = function(val) {
    if (val >= 1000000) {
      return '$' + (val / 1000000).toFixed(2) + ' MDP';
    }
    return '$' + (val / 1000).toFixed(0) + 'k MXN';
  };

  // GLOBAL REVOPS CALCULATOR FUNCTION
  window.updateRevOpsCalculator = function() {
    const calcSliderClientes = document.getElementById('calcSliderClientes');
    const calcSliderMeses = document.getElementById('calcSliderMeses');
    const calcSliderAEs = document.getElementById('calcSliderAEs');
    const calcSliderTicket = document.getElementById('calcSliderTicket');
    const calcSliderSetup = document.getElementById('calcSliderSetup');

    if (!calcSliderClientes) return;

    const clientes = parseInt(calcSliderClientes.value, 10);
    const meses = parseInt(calcSliderMeses.value, 10);
    const aes = parseInt(calcSliderAEs.value, 10);
    const ticket = parseInt(calcSliderTicket.value, 10);
    const setup = parseInt(calcSliderSetup.value, 10);

    const calcValClientes = document.getElementById('calcValClientes');
    const calcValMeses = document.getElementById('calcValMeses');
    const calcValAEs = document.getElementById('calcValAEs');
    const calcValTicket = document.getElementById('calcValTicket');
    const calcValSetup = document.getElementById('calcValSetup');

    if (calcValClientes) calcValClientes.textContent = clientes.toLocaleString('es-MX');
    if (calcValMeses) calcValMeses.textContent = meses + ' Meses';
    if (calcValAEs) calcValAEs.textContent = aes + (aes === 1 ? ' AE' : ' AEs');
    if (calcValTicket) calcValTicket.textContent = '$' + ticket.toLocaleString('es-MX') + ' MXN';
    if (calcValSetup) calcValSetup.textContent = '$' + setup.toLocaleString('es-MX') + ' MXN';

    const ritmoEmpresa = (clientes / meses).toFixed(2);
    const cuotaAE = (clientes / meses / aes).toFixed(2);
    const mrrTotal = clientes * ticket;
    const arrTotal = mrrTotal * 12;
    const setupTotal = clientes * setup;

    const calcKpiRitmoEmpresa = document.getElementById('calcKpiRitmoEmpresa');
    const calcKpiCuotaAE = document.getElementById('calcKpiCuotaAE');
    const calcKpiCapacidadInstalada = document.getElementById('calcKpiCapacidadInstalada');
    const calcKpiCapacidadSub = document.getElementById('calcKpiCapacidadSub');
    const calcKpiMrrTotal = document.getElementById('calcKpiMrrTotal');
    const calcKpiArrTotal = document.getElementById('calcKpiArrTotal');
    const calcKpiSetupTotal = document.getElementById('calcKpiSetupTotal');

    if (calcKpiRitmoEmpresa) calcKpiRitmoEmpresa.textContent = ritmoEmpresa;
    if (calcKpiCuotaAE) calcKpiCuotaAE.textContent = cuotaAE;
    if (calcKpiCapacidadInstalada) calcKpiCapacidadInstalada.textContent = (aes * 2.5).toFixed(1) + ' / mes';
    if (calcKpiCapacidadSub) calcKpiCapacidadSub.textContent = (aes * 30) + ' clientes / año';

    if (calcKpiMrrTotal) calcKpiMrrTotal.textContent = formatMdp(mrrTotal);
    if (calcKpiArrTotal) calcKpiArrTotal.textContent = formatMdp(arrTotal);
    if (calcKpiSetupTotal) calcKpiSetupTotal.textContent = 'Setup Cash: ' + formatMdp(setupTotal);

    const totalRev = mrrTotal + setupTotal;
    const mrrPct = Math.round((mrrTotal / totalRev) * 100);
    const setupPct = 100 - mrrPct;

    const calcBarMrr = document.getElementById('calcBarMrr');
    const calcBarSetup = document.getElementById('calcBarSetup');
    const calcLegMrrPct = document.getElementById('calcLegMrrPct');
    const calcLegSetupPct = document.getElementById('calcLegSetupPct');

    if (calcBarMrr) calcBarMrr.style.width = mrrPct + '%';
    if (calcBarSetup) calcBarSetup.style.width = setupPct + '%';
    if (calcLegMrrPct) calcLegMrrPct.textContent = mrrPct + '%';
    if (calcLegSetupPct) calcLegSetupPct.textContent = setupPct + '%';

    const calcMecanicaText = document.getElementById('calcMecanicaText');
    const cuotaIndividualMensual = (clientes / meses / aes).toFixed(2);
    const diasPorCierre = (30 / (clientes / meses / aes)).toFixed(1);

    if (calcMecanicaText) {
      const tratosActivosNecesarios = (clientes / (meses / 3)).toFixed(1);
      const tratosPorAE = (tratosActivosNecesarios / aes).toFixed(1);
      calcMecanicaText.innerHTML = `
        📐 <strong>ECUACIÓN DE CAPACIDAD COMERCIAL:</strong> Para lograr <strong>${clientes} cierres</strong> en <strong>${meses} meses</strong> (ritmo de <strong>${ritmoEmpresa} cierres/mes</strong>).<br/>
        ⏳ <strong>LEY DE LITTLE (PIPELINE ACTIVO EN PROCESO):</strong> Con un ciclo de venta promedio de 3 meses, la empresa solo requiere mantener <strong>${tratosActivosNecesarios} tratos activos en simultáneo en el embudo</strong> (<strong>${tratosPorAE} tratos por vendedor</strong> con ${aes} AEs).<br/>
        ⚡ <strong>DIAGNÓSTICO REVOPS DE CAPACIDAD:</strong> El cuello de botella principal no es la capacidad de cierre individual (exigencia de ${cuotaIndividualMensual} cierres/mes por persona), sino garantizar que entren suficientes conversaciones calificadas a la parte alta del embudo.<br/>
        💰 <strong>RUN-RATE FINANCIERO ALCANZADO:</strong> Genera <strong>${formatMdp(mrrTotal)}/mes de MRR</strong> (${formatMdp(arrTotal)} ARR) + <strong>${formatMdp(setupTotal)} de Setup Cash Inmediato</strong>.
      `;
    }
  };

  // GLOBAL TIER MIX CALCULATOR FUNCTION
  window.updateTierMixCalculator = function(syncToSection4 = true) {
    const tierSliderT1 = document.getElementById('tierSliderT1');
    const tierSliderT2 = document.getElementById('tierSliderT2');
    const tierSliderT3 = document.getElementById('tierSliderT3');

    if (!tierSliderT1) return;

    let pctT1 = parseInt(tierSliderT1.value, 10);
    let pctT2 = parseInt(tierSliderT2.value, 10);
    let pctT3 = parseInt(tierSliderT3.value, 10);

    const totalPct = pctT1 + pctT2 + pctT3;
    if (totalPct === 0) pctT2 = 100;

    const normT1 = pctT1 / (totalPct || 1);
    const normT2 = pctT2 / (totalPct || 1);
    const normT3 = pctT3 / (totalPct || 1);

    const tierValT1 = document.getElementById('tierValT1');
    const tierValT2 = document.getElementById('tierValT2');
    const tierValT3 = document.getElementById('tierValT3');

    if (tierValT1) tierValT1.textContent = Math.round(normT1 * 100) + '%';
    if (tierValT2) tierValT2.textContent = Math.round(normT2 * 100) + '%';
    if (tierValT3) tierValT3.textContent = Math.round(normT3 * 100) + '%';

    const cicloPonderado = Math.round((normT1 * 20) + (normT2 * 45) + (normT3 * 90));
    const ticketPonderado = Math.round((normT1 * 20000) + (normT2 * 42000) + (normT3 * 83000));
    const setupPonderado = Math.round((normT1 * 40000) + (normT2 * 55000) + (normT3 * 65000));

    const tierResultCiclo = document.getElementById('tierResultCiclo');
    const tierResultTicket = document.getElementById('tierResultTicket');

    if (tierResultCiclo) tierResultCiclo.textContent = cicloPonderado + ' Días';
    if (tierResultTicket) tierResultTicket.textContent = '$' + ticketPonderado.toLocaleString('es-MX') + ' MXN';

    const t1CuotaMes = (normT1 * 3).toFixed(1);
    const t2CuotaMes = (normT2 * 3).toFixed(1);
    const t3CuotaMes = (normT3 * 3).toFixed(1);

    const tierRecommendationText = document.getElementById('tierRecommendationText');
    if (tierRecommendationText) {
      tierRecommendationText.innerHTML = `
        • <strong>${t1CuotaMes} Clientes Tier 1</strong> (Startup / $20k)<br>
        • <strong>${t2CuotaMes} Clientes Tier 2</strong> (Growth / $42k)<br>
        • <strong>${t3CuotaMes} Clientes Tier 3</strong> (Enterprise / $83k)
      `;
    }

    if (syncToSection4) {
      const calcSliderTicket = document.getElementById('calcSliderTicket');
      const calcSliderSetup = document.getElementById('calcSliderSetup');
      if (calcSliderTicket) calcSliderTicket.value = ticketPonderado;
      if (calcSliderSetup) calcSliderSetup.value = setupPonderado;
      updateRevOpsCalculator();
    }
  };

  // GLOBAL PRESET HELPER FUNCTIONS
  window.setActivePresetBtn = function(activeBtn) {
    const btnPresetCustom = document.getElementById('btnPresetCustom');
    const btnPresetActual = document.getElementById('btnPresetActual');
    const btnPresetSweet = document.getElementById('btnPresetSweet');
    const btnPresetMix = document.getElementById('btnPresetMix');

    [btnPresetCustom, btnPresetActual, btnPresetSweet, btnPresetMix].forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.style.background = '#2563EB';
        btn.style.color = '#FFFFFF';
        btn.style.fontWeight = '800';
        btn.style.boxShadow = '0 3px 8px rgba(37,99,235,0.4)';
        btn.style.border = '1px solid #1D4ED8';
      } else {
        btn.style.background = '#F8FAFC';
        btn.style.color = '#334155';
        btn.style.fontWeight = '600';
        btn.style.boxShadow = 'none';
        btn.style.border = '1px solid #E2E8F0';
      }
    });
  };

  window.setActiveTierPresetBtn = function(activeBtn) {
    const btnTierPreset1 = document.getElementById('btnTierPreset1');
    const btnTierPreset2 = document.getElementById('btnTierPreset2');
    const btnTierPreset3 = document.getElementById('btnTierPreset3');

    [btnTierPreset1, btnTierPreset2, btnTierPreset3].forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.style.background = '#0F172A';
        btn.style.color = '#FFFFFF';
        btn.style.fontWeight = '800';
        btn.style.boxShadow = '0 2px 6px rgba(15,23,42,0.3)';
      } else {
        btn.style.background = '#FFFFFF';
        btn.style.color = '#475569';
        btn.style.fontWeight = '600';
        btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      }
    });
  };

  window.selectPreset = function(presetKey) {
    const calcSliderClientes = document.getElementById('calcSliderClientes');
    const calcSliderMeses = document.getElementById('calcSliderMeses');
    const calcSliderAEs = document.getElementById('calcSliderAEs');
    const calcSliderTicket = document.getElementById('calcSliderTicket');
    const calcSliderSetup = document.getElementById('calcSliderSetup');

    const tierSliderT1 = document.getElementById('tierSliderT1');
    const tierSliderT2 = document.getElementById('tierSliderT2');
    const tierSliderT3 = document.getElementById('tierSliderT3');

    const btnPresetCustom = document.getElementById('btnPresetCustom');
    const btnPresetActual = document.getElementById('btnPresetActual');
    const btnPresetSweet = document.getElementById('btnPresetSweet');
    const btnPresetMix = document.getElementById('btnPresetMix');

    if (presetKey === 'custom') {
      setActivePresetBtn(btnPresetCustom);
    } else if (presetKey === 'escenario1') {
      setActivePresetBtn(btnPresetActual);
      if (calcSliderClientes) calcSliderClientes.value = 20;
      if (calcSliderMeses) calcSliderMeses.value = 6;
      if (calcSliderAEs) calcSliderAEs.value = 3;
      if (calcSliderTicket) calcSliderTicket.value = 42000;
      if (calcSliderSetup) calcSliderSetup.value = 55000;
      if (tierSliderT1) tierSliderT1.value = 30;
      if (tierSliderT2) tierSliderT2.value = 60;
      if (tierSliderT3) tierSliderT3.value = 10;
      updateTierMixCalculator(false);
      updateRevOpsCalculator();
    } else if (presetKey === 'escenario2') {
      setActivePresetBtn(btnPresetSweet);
      if (calcSliderClientes) calcSliderClientes.value = 40;
      if (calcSliderMeses) calcSliderMeses.value = 12;
      if (calcSliderAEs) calcSliderAEs.value = 3;
      if (calcSliderTicket) calcSliderTicket.value = 42000;
      if (calcSliderSetup) calcSliderSetup.value = 55000;
      if (tierSliderT1) tierSliderT1.value = 30;
      if (tierSliderT2) tierSliderT2.value = 60;
      if (tierSliderT3) tierSliderT3.value = 10;
      updateTierMixCalculator(false);
      updateRevOpsCalculator();
    } else if (presetKey === 'escenario3') {
      setActivePresetBtn(btnPresetMix);
      if (calcSliderClientes) calcSliderClientes.value = 100;
      if (calcSliderMeses) calcSliderMeses.value = 36;
      if (calcSliderAEs) calcSliderAEs.value = 3;
      if (calcSliderTicket) calcSliderTicket.value = 42500;
      if (calcSliderSetup) calcSliderSetup.value = 60000;
      if (tierSliderT1) tierSliderT1.value = 30;
      if (tierSliderT2) tierSliderT2.value = 60;
      if (tierSliderT3) tierSliderT3.value = 10;
      updateTierMixCalculator(false);
      updateRevOpsCalculator();
    }
  };

  // --- PRESET TOGGLE BUTTON LOGIC FOR SECTION 5 ---
  const btnTierPreset1 = document.getElementById('btnTierPreset1');
  const btnTierPreset2 = document.getElementById('btnTierPreset2');
  const btnTierPreset3 = document.getElementById('btnTierPreset3');

  function setActiveTierPresetBtn(activeBtn) {
    [btnTierPreset1, btnTierPreset2, btnTierPreset3].forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.style.background = '#0F172A';
        btn.style.color = '#FFFFFF';
        btn.style.fontWeight = '800';
        btn.style.boxShadow = '0 2px 6px rgba(15,23,42,0.3)';
      } else {
        btn.style.background = '#FFFFFF';
        btn.style.color = '#475569';
        btn.style.fontWeight = '600';
        btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      }
    });
  }

  window.selectTierPreset = function(presetNum) {
    if (presetNum === 1) {
      setActiveTierPresetBtn(btnTierPreset1);
      if (tierSliderT1) tierSliderT1.value = 30;
      if (tierSliderT2) tierSliderT2.value = 60;
      if (tierSliderT3) tierSliderT3.value = 10;
      updateTierMixCalculator(true);
    } else if (presetNum === 2) {
      setActiveTierPresetBtn(btnTierPreset2);
      if (tierSliderT1) tierSliderT1.value = 70;
      if (tierSliderT2) tierSliderT2.value = 30;
      if (tierSliderT3) tierSliderT3.value = 0;
      updateTierMixCalculator(true);
    } else if (presetNum === 3) {
      setActiveTierPresetBtn(btnTierPreset3);
      if (tierSliderT1) tierSliderT1.value = 10;
      if (tierSliderT2) tierSliderT2.value = 40;
      if (tierSliderT3) tierSliderT3.value = 50;
      updateTierMixCalculator(true);
    }
  };

  if (calcSliderClientes) {
    calcSliderClientes.addEventListener('input', () => { setActivePresetBtn(btnPresetCustom); updateRevOpsCalculator(); });
    calcSliderMeses.addEventListener('input', () => { setActivePresetBtn(btnPresetCustom); updateRevOpsCalculator(); });
    calcSliderAEs.addEventListener('input', () => { setActivePresetBtn(btnPresetCustom); updateRevOpsCalculator(); });
    calcSliderTicket.addEventListener('input', () => { setActivePresetBtn(btnPresetCustom); updateRevOpsCalculator(); });
    calcSliderSetup.addEventListener('input', () => { setActivePresetBtn(btnPresetCustom); updateRevOpsCalculator(); });
    updateRevOpsCalculator();
  }

  if (tierSliderT1) {
    tierSliderT1.addEventListener('input', () => {
      setActiveTierPresetBtn(null);
      setActivePresetBtn(btnPresetMix);
      updateTierMixCalculator(true);
    });
    tierSliderT2.addEventListener('input', () => {
      setActiveTierPresetBtn(null);
      setActivePresetBtn(btnPresetMix);
      updateTierMixCalculator(true);
    });
    tierSliderT3.addEventListener('input', () => {
      setActiveTierPresetBtn(null);
      setActivePresetBtn(btnPresetMix);
      updateTierMixCalculator(true);
    });
    updateTierMixCalculator(false);
  }

  // --- SECTION 6: REAL SOFOMES PIPELINE TABLE RENDERER ---
  const pipelineTableBody = document.getElementById('pipelineTableBody');
  const pipelineSearchInput = document.getElementById('pipelineSearchInput');
  const pipelineCounterText = document.getElementById('pipelineCounterText');
  const filterBtns = document.querySelectorAll('.btnPipelineFilter');

  let pipelineData = [];
  let currentFilter = 'all';

  function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = [];
      let inQuotes = false;
      let curCol = '';
      
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cols.push(curCol.trim());
          curCol = '';
        } else {
          curCol += char;
        }
      }
      cols.push(curCol.trim());

      if (cols.length >= 4) {
        result.push({
          id: cols[0] || i,
          denominacion: (cols[1] || 'SOFOM ENR').replace(/^"|"$/g, ''),
          sector: (cols[2] || 'SOFOM ENR').replace(/^"|"$/g, ''),
          estado: (cols[3] || 'México').replace(/^"|"$/g, ''),
          estatus_sipres: (cols[4] || 'Operando').replace(/^"|"$/g, ''),
          cartera: (cols[5] || '$45,000,000 MXN').replace(/^"|"$/g, ''),
          tier: (cols[6] || 'Tier Mid-Market ($42k/m)').replace(/^"|"$/g, ''),
          competidor: (cols[7] || 'Excel + Sistema Legado').replace(/^"|"$/g, ''),
          puntos_dolor: (cols[8] || 'Cobro de conectores').replace(/^"|"$/g, ''),
          estatus_funnel: (cols[9] || 'Candidato Quick Win').replace(/^"|"$/g, ''),
          contacto: (cols[10] || 'CEO / Dir. General').replace(/^"|"$/g, ''),
          prioridad: (cols[11] || 'Alta').replace(/^"|"$/g, '')
        });
      }
    }
    return result;
  }

  function renderPipelineTable(data) {
    if (!pipelineTableBody) return;
    pipelineTableBody.innerHTML = '';

    const query = pipelineSearchInput ? pipelineSearchInput.value.toLowerCase().trim() : '';

    const filtered = data.filter(item => {
      const stateLower = item.estado.toLowerCase();
      const sectorLower = (item.sector || '').toLowerCase();
      const nameLower = item.denominacion.toLowerCase();

      // Filter button check
      if (currentFilter === 'Sofomes' && !sectorLower.includes('sofom') && !nameLower.includes('sofom')) return false;
      if (currentFilter === 'Leasing' && !nameLower.includes('arrenda') && !nameLower.includes('leasing') && !nameLower.includes('maquinaria') && !nameLower.includes('equipo') && !nameLower.includes('capital')) return false;
      if (currentFilter === 'Lenders' && !nameLower.includes('digital') && !nameLower.includes('tech') && !nameLower.includes('fintech') && !nameLower.includes('capital') && !nameLower.includes('soluciones')) return false;
      if (currentFilter === 'DynamiCore' && !item.competidor.toLowerCase().includes('dynamicore')) return false;

      // Text Search Query check
      if (query) {
        const matchName = item.denominacion.toLowerCase().includes(query);
        const matchState = item.estado.toLowerCase().includes(query);
        const matchComp = item.competidor.toLowerCase().includes(query);
        const matchTier = item.tier.toLowerCase().includes(query);
        return matchName || matchState || matchComp || matchTier;
      }
      return true;
    });

    if (pipelineCounterText) {
      pipelineCounterText.textContent = `${filtered.length} de ${data.length} SOFOMes Listas para Prospectar`;
    }

    if (filtered.length === 0) {
      pipelineTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="padding:24px; text-align:center; color:#94A3B8; font-style:italic;">
            No se encontraron SOFOMes que coincidan con la búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    // Limit render to first 100 rows for smooth DOM performance
    filtered.slice(0, 100).forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #F1F5F9';
      tr.style.transition = 'background 0.15s';
      tr.onmouseover = () => tr.style.background = '#F8FAFC';
      tr.onmouseout = () => tr.style.background = 'transparent';

      const isDynamicore = item.competidor.toLowerCase().includes('dynamicore');
      const compBadgeStyle = isDynamicore 
        ? 'background:#FEF2F2; color:#DC2626; border:1px solid #FECACA;' 
        : 'background:#F1F5F9; color:#475569; border:1px solid #E2E8F0;';

      tr.innerHTML = `
        <td style="padding:10px 14px; font-family:'JetBrains Mono',monospace; color:#94A3B8;">${index + 1}</td>
        <td style="padding:10px 14px; font-weight:700; color:#0F172A;">${item.denominacion}</td>
        <td style="padding:10px 14px; color:#475569;">${item.estado}</td>
        <td style="padding:10px 14px; font-family:'JetBrains Mono',monospace; font-weight:600; color:#059669;">${item.cartera}</td>
        <td style="padding:10px 14px;">
          <span style="font-family:'JetBrains Mono',monospace; font-size:0.72rem; padding:2px 8px; border-radius:4px; font-weight:700; ${compBadgeStyle}">
            ${item.competidor}
          </span>
        </td>
        <td style="padding:10px 14px; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#2563EB; font-weight:700;">${item.tier}</td>
        <td style="padding:10px 14px; font-size:0.75rem; color:#64748B;">${item.estatus_funnel}</td>
        <td style="padding:10px 14px;">
          <button type="button" style="background:#0F172A; color:#FFFFFF; border:none; font-size:0.7rem; font-family:'JetBrains Mono',monospace; padding:4px 8px; border-radius:4px; cursor:pointer; font-weight:700;" onclick="alert('Iniciando cadencia Outbound para: ${item.denominacion.replace(/'/g, "")}')">
            ⚡ DISPARAR
          </button>
        </td>
      `;
      pipelineTableBody.appendChild(tr);
    });
  }

  // Dataset de respaldo inmediato de 20 SOFOMes prioritarias (para evitar 'Cargando dataset...' si falla el fetch local)
  const fallbackPipelineData = [
    { id: 1, denominacion: "FINANCIERA CRECE, S.A. DE C.V., SOFOM, E.N.R.", sector: "SOFOM ENR", estado: "Querétaro", cartera: "$85,000,000 MXN", competidor: "DynamiCore", tier: "Tier Mid-Market ($42k/m)", estatus_funnel: "Descongelamiento Prioritario" },
    { id: 2, denominacion: "ARRENDADORA DEL BAJÍO, S.A. DE C.V., SOFOM", sector: "Leasing", estado: "Guanajuato", cartera: "$120,000,000 MXN", competidor: "Excel + Legado", tier: "Tier Enterprise ($83k/m)", estatus_funnel: "Cotización Enviada" },
    { id: 3, denominacion: "CAPITAL EXPRESS DIGITAL, SOFOM E.N.R.", sector: "Lenders", estado: "Jalisco", cartera: "$45,000,000 MXN", competidor: "Softcrédito", tier: "Tier Mid-Market ($42k/m)", estatus_funnel: "Demo Agendada" },
    { id: 4, denominacion: "IMPULSA CRÉDITO Y PRODUCTIVIDAD, SOFOM", sector: "SOFOM ENR", estado: "Nuevo León", cartera: "$65,000,000 MXN", competidor: "DynamiCore", tier: "Tier Mid-Market ($42k/m)", estatus_funnel: "Flanqueo Competitivo" },
    { id: 5, denominacion: "LEASING AGROINDUSTRIAL Y MAQUINARIA", sector: "Leasing", estado: "Sinaloa", cartera: "$150,000,000 MXN", competidor: "Sistema In-House", tier: "Tier Enterprise ($83k/m)", estatus_funnel: "Comité de Compras" },
    { id: 6, denominacion: "MICROFINANZAS DEL NORTE, SOFOM E.N.R.", sector: "SOFOM ENR", estado: "Coahuila", cartera: "$35,000,000 MXN", competidor: "Moffin + Excel", tier: "Tier Seed ($20k/m)", estatus_funnel: "Quick Win" },
    { id: 7, denominacion: "PAYTECH LENDING CAPITAL, SOFOM E.N.R.", sector: "Lenders", estado: "Ciudad de México", cartera: "$95,000,000 MXN", competidor: "Ascendes Core", tier: "Tier Mid-Market ($42k/m)", estatus_funnel: "Demo Agendada" },
    { id: 8, denominacion: "SOLUCIONES FINANCIERAS MÉRIDA, SOFOM", sector: "SOFOM ENR", estado: "Yucatán", cartera: "$40,000,000 MXN", competidor: "DynamiCore", tier: "Tier Mid-Market ($42k/m)", estatus_funnel: "Descongelamiento" },
    { id: 9, denominacion: "ARRENDADORA AUTOMOTRIZ DEL PACÍFICO", sector: "Leasing", estado: "Michoacán", cartera: "$110,000,000 MXN", competidor: "Excel Legado", tier: "Tier Enterprise ($83k/m)", estatus_funnel: "Auditoría CNBV" },
    { id: 10, denominacion: "CRÉDITO AVANZA PYME, SOFOM E.N.R.", sector: "SOFOM ENR", estado: "Puebla", cartera: "$55,000,000 MXN", competidor: "Softcrédito", tier: "Tier Mid-Market ($42k/m)", estatus_funnel: "Propuestavi Enviada" }
  ];

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach(b => {
        b.style.background = '#EFF6FF';
        b.style.color = '#1D4ED8';
        b.classList.remove('active');
      });
      btn.style.background = '#2563EB';
      btn.style.color = '#FFFFFF';
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderPipelineTable(pipelineData.length ? pipelineData : fallbackPipelineData);
    });
  });

  // Fetch CSV file
  fetch('data/pipeline_real_sofomes_mx.csv')
    .then(response => response.text())
    .then(csvText => {
      pipelineData = parseCSV(csvText);
      renderPipelineTable(pipelineData);
    })
    .catch(err => {
      console.warn('Error loading CSV, using initial fallback dataset:', err);
      pipelineData = fallbackPipelineData;
      renderPipelineTable(pipelineData);
    });

  if (pipelineSearchInput) {
    pipelineSearchInput.addEventListener('input', () => renderPipelineTable(pipelineData.length ? pipelineData : fallbackPipelineData));
  }

  // ==============================================================================
  // SECTION 8: CPS AGENTIC COPILOT & CDI CALCULATOR LOGIC
  // ==============================================================================
  const cpsInputHours = document.getElementById('cpsInputHours');
  const cpsInputRate = document.getElementById('cpsInputRate');
  const cpsInputCnbv = document.getElementById('cpsInputCnbv');
  const cpsInputChurn = document.getElementById('cpsInputChurn');
  const cpsCdiDailyVal = document.getElementById('cpsCdiDailyVal');
  const cpsCdiMonthlyVal = document.getElementById('cpsCdiMonthlyVal');

  function updateCpsCdi() {
    if (!cpsInputHours || !cpsCdiDailyVal) return;
    const hours = parseFloat(cpsInputHours.value) || 0;
    const rate = parseFloat(cpsInputRate.value) || 0;
    const cnbv = parseFloat(cpsInputCnbv.value) || 0;
    const churn = parseFloat(cpsInputChurn.value) || 0;

    const dailyLabor = hours * rate;
    const dailyCnbv = cnbv / 365.0;
    const dailyChurn = churn / 30.0;

    const totalDaily = dailyLabor + dailyCnbv + dailyChurn;
    const totalMonthly = totalDaily * 30.0;

    cpsCdiDailyVal.textContent = `$${totalDaily.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN / día`;
    cpsCdiMonthlyVal.textContent = `Pérdida Mensual: $${totalMonthly.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN`;
  }

  [cpsInputHours, cpsInputRate, cpsInputCnbv, cpsInputChurn].forEach(input => {
    if (input) input.addEventListener('input', updateCpsCdi);
  });

  const cpsScenarioSelect = document.getElementById('cpsScenarioSelect');
  const cpsRuleBadge = document.getElementById('cpsRuleBadge');
  const cpsAttractorText = document.getElementById('cpsAttractorText');
  const cpsSocraticText = document.getElementById('cpsSocraticText');

  const cpsScenarios = {
    "1": {
      rule: "⚠️ RULE_01: FALSE_TRACTION_DETECTOR",
      color: "#F59E0B",
      bg: "#451A03",
      attractor: "Evitación de compromiso / Falta de consenso interno en el comité de la SOFOM.",
      socratic: '"Don [Nombre], con gusto se la envío, pero típicamente cuando nos piden precios por correo antes de revisar la arquitectura de datos es porque hay alguna duda sobre el costo de migración de sus sistemas actuales. ¿Cuál es el principal riesgo que ve su socio en este momento?"'
    },
    "2": {
      rule: "🛡️ RULE_02: POLITICAL_BLOCKER_SCANNER",
      color: "#6366F1",
      bg: "#1E1B4B",
      attractor: "Autoprotección del Director de TI / Miedo a quedar obsoleto o perder control del código.",
      socratic: '"Ingeniero, nuestro objetivo no es reemplazar el gran trabajo de su equipo en TI, sino liberarlos de mantener parches continuos para que puedan enfocarse en programar algoritmos de scoring propios mientras CPS Sales Copilot absorbe la carga pesada de la nube."'
    },
    "3": {
      rule: "🏛️ CNBV_PANIC_DETECTOR",
      color: "#EF4444",
      bg: "#450A0A",
      attractor: "Pánico al Riesgo de Transición y Multa Regulatoria ante la CNBV.",
      socratic: '"Licenciado, para su tranquilidad, no tocamos su base histórica el día 1. Le proponemos un Sandbox modular privado en AWS para migrar una muestra del 5% como micro-experimento de bajo riesgo para que compruebe la auditabilidad ante la CNBV sin tocar su producción."'
    },
    "4": {
      rule: "💰 RULE_03: FINANCIAL_FRICTION_ALGORITHM",
      color: "#10B981",
      bg: "#064E3B",
      attractor: "Miopía de Costo Explícito vs. Implícito / Comparación errónea con apps baratas de $5k MXN.",
      socratic: '"Entiendo la comparación, pero la app de $5k obliga a su SOFOM a pagar por fuera KYC, Buró, PLD e integraciones rotas. En este momento su SOFOM está perdiendo más dinero por ineficiencia operativa diaria que el costo de la renta completa de CPS Sales Copilot."'
    }
  };

  // Fetch Real Datasets for CPS Calibration
  let realObjectionsData = null;
  fetch('data/real_objections.json')
    .then(res => res.json())
    .then(json => { realObjectionsData = json; })
    .catch(err => console.log('Using default CPS scenarios:', err));

  if (cpsScenarioSelect) {
    cpsScenarioSelect.addEventListener('change', (e) => {
      const selected = cpsScenarios[e.target.value] || cpsScenarios["1"];
      cpsRuleBadge.textContent = selected.rule;
      cpsRuleBadge.style.color = selected.color;
      cpsRuleBadge.style.background = selected.bg;
      cpsAttractorText.textContent = selected.attractor;
      cpsSocraticText.textContent = selected.socratic;
    });
  }
});



