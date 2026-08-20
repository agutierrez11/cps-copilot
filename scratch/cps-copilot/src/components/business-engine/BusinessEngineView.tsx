"use client";

import React, { useState, useMemo } from 'react';
import { Briefcase, Sliders, Mail, Copy, Check, ShieldCheck, Plus, Globe, FileText, X, Loader2, Zap } from 'lucide-react';
import defaultProfiles from '@/profiles/client_profiles.json';

interface VariableDef {
  id: string;
  label: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
}

interface OutreachEmail {
  step: string;
  subject: string;
  body: string;
}

interface BusinessProfile {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  currency: string;
  regulations: string[];
  variables: VariableDef[];
  outreach_emails: OutreachEmail[];
}

interface VariableState {
  [key: string]: number;
}

export const BusinessEngineView: React.FC = () => {
  const [profiles, setProfiles] = useState<BusinessProfile[]>(defaultProfiles as BusinessProfile[]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || 'radar_linkedin');
  const [copiedEmailIdx, setCopiedEmailIdx] = useState<number | null>(null);
  const [copiedDictum, setCopiedDictum] = useState<boolean>(false);
  const [targetAccountName, setTargetAccountName] = useState<string>('');
  const [isSyncingHubSpot, setIsSyncingHubSpot] = useState<boolean>(false);
  const [hubspotSyncMsg, setHubspotSyncMsg] = useState<string | null>(null);

  // Modal de Ingestión de Contexto
  const [isIngestModalOpen, setIsIngestModalOpen] = useState<boolean>(false);
  const [ingestForm, setIngestForm] = useState({
    companyName: '',
    websiteUrl: '',
    documentText: '',
    notes: ''
  });
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestError, setIngestError] = useState<string | null>(null);

  const currentProfile = useMemo(() => {
    return profiles.find(p => p.id === selectedProfileId) || profiles[0];
  }, [selectedProfileId, profiles]);

  // Manejo de valores de sliders
  const [varValues, setVarValues] = useState<VariableState>(() => {
    const initial: VariableState = {};
    profiles.forEach(p => {
      p.variables?.forEach(v => {
        initial[`${p.id}_${v.id}`] = v.default;
      });
    });
    return initial;
  });

  const handleVarChange = (varId: string, val: number) => {
    setVarValues(prev => ({
      ...prev,
      [`${currentProfile.id}_${varId}`]: val
    }));
  };

  // Enviar contexto a la IA para crear perfil
  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIngesting(true);
    setIngestError(null);

    try {
      const resp = await fetch('/api/ingest-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingestForm),
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Error al compilar el caso de negocio.');
      }

      const data = await resp.json();
      if (data.profile) {
        const newProfile: BusinessProfile = data.profile;
        setProfiles(prev => [newProfile, ...prev]);
        setSelectedProfileId(newProfile.id);

        const newVars: VariableState = {};
        newProfile.variables?.forEach(v => {
          newVars[`${newProfile.id}_${v.id}`] = v.default;
        });
        setVarValues(prev => ({ ...prev, ...newVars }));

        setIsIngestModalOpen(false);
        setIngestForm({ companyName: '', websiteUrl: '', documentText: '', notes: '' });
      }
    } catch (err: any) {
      setIngestError(err.message || 'Error de conexión');
    } finally {
      setIsIngesting(false);
    }
  };

  // Cálculo de impacto financiero
  const calculatedSavings = useMemo(() => {
    const pId = currentProfile.id;
    if (pId === 'radar_linkedin') {
      const reps = varValues[`radar_linkedin_reps`] || 4;
      const hoursWasted = varValues[`radar_linkedin_hours_wasted`] || 12;
      const hourlyRate = varValues[`radar_linkedin_rep_hourly_rate`] || 22;
      const missedTriggers = varValues[`radar_linkedin_missed_triggers`] || 28;

      const monthlyHoursCost = reps * hoursWasted * 4.33 * hourlyRate;
      const monthlyMissedPipeline = missedTriggers * 150; 
      const totalMonthlySaved = monthlyHoursCost + monthlyMissedPipeline;
      return { monthly: Math.round(totalMonthlySaved), annual: Math.round(totalMonthlySaved * 12) };
    } else if (pId === 'paymind') {
      const stations = varValues[`paymind_stations`] || 4;
      const volume = varValues[`paymind_volume`] || 450000;
      const pvp = varValues[`paymind_pvp`] || 24.50;
      const currentFee = varValues[`paymind_current_fee`] || 1.45;
      const spread = varValues[`paymind_paymind_spread`] || 0.55;
      
      const totalTurnover = stations * volume * pvp;
      const bankCommission = totalTurnover * (currentFee / 100);
      const paymindCost = totalTurnover * (spread / 100);
      const monthlySaved = bankCommission - paymindCost;
      return { monthly: Math.round(monthlySaved), annual: Math.round(monthlySaved * 12) };
    } else if (pId === 'fleetcontrol') {
      const trucks = varValues[`fleetcontrol_trucks`] || 35;
      const dieselSpend = varValues[`fleetcontrol_diesel_spend`] || 65000;
      const leakageRate = varValues[`fleetcontrol_leakage_rate`] || 11;
      const saasCost = varValues[`fleetcontrol_saas_cost`] || 480;

      const totalDiesel = trucks * dieselSpend;
      const monthlyLeakage = totalDiesel * (leakageRate / 100);
      const monthlySaasCost = trucks * saasCost;
      const netMonthlySaved = monthlyLeakage - monthlySaasCost;
      return { monthly: Math.round(netMonthlySaved), annual: Math.round(netMonthlySaved * 12) };
    } else if (pId === 'hrtech') {
      const headcount = varValues[`hrtech_headcount`] || 320;
      const avgSalary = varValues[`hrtech_avg_salary`] || 1200;
      const turnoverRate = varValues[`hrtech_turnover_rate`] || 18;
      const mult = varValues[`hrtech_replacement_cost_multiplier`] || 1.75;

      const annualTurnoverLoss = headcount * (turnoverRate / 100) * avgSalary * mult;
      return { monthly: Math.round(annualTurnoverLoss / 12), annual: Math.round(annualTurnoverLoss) };
    } else {
      const vars = currentProfile.variables || [];
      let factor1 = varValues[`${pId}_${vars[0]?.id}`] || vars[0]?.default || 50;
      let factor2 = varValues[`${pId}_${vars[1]?.id}`] || vars[1]?.default || 1000;
      let factor3 = varValues[`${pId}_${vars[2]?.id}`] || vars[2]?.default || 10;
      
      const monthlyLoss = (factor1 * factor2 * (factor3 / 100));
      return { monthly: Math.round(monthlyLoss), annual: Math.round(monthlyLoss * 12) };
    }
  }, [currentProfile, varValues]);

  // Dictamen
  const dictumText = useMemo(() => {
    const p = currentProfile as any;
    const reg1 = p.regulations?.[0] || "Normativas del sector";
    const reg2 = p.regulations?.[1] || "Estándares de mercado";
    const targetName = targetAccountName.trim() || p.targetClientRole || "Empresa / Cuenta Prospecto";

    return `DICTAMEN DE AUDITORÍA DE INEFICIENCIA FINANCIERA (COI):
Auditoría Objetivo: ${targetName}
Solución Evaluada: ${p.name}

1. Diagnóstico de Ineficiencia: Al evaluar la operación de ${targetName}, detectamos una fuga de $${calculatedSavings.monthly.toLocaleString()} ${p.currency}/mes frente a la arquitectura optimizada.
2. Marco Regulatorio & Retorno Neto: Bajo ${reg1} y ${reg2}, la optimización recupera $${calculatedSavings.annual.toLocaleString()} ${p.currency} anuales en margen neto directo.
3. Recomendación BLUF: Implementar la arquitectura de ${p.name} con SLA de recuperación de inversión (Payback) estimado en 45 días.`;
  }, [currentProfile, calculatedSavings, targetAccountName]);

  const copyDictum = () => {
    navigator.clipboard.writeText(dictumText);
    setCopiedDictum(true);
    setTimeout(() => setCopiedDictum(false), 2000);
  };

  const handleHubspotSync = async () => {
    setIsSyncingHubSpot(true);
    setHubspotSyncMsg(null);
    try {
      const res = await fetch('/api/hubspot-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: 'DEAL-HS-84920',
          companyName: currentProfile.name,
          coiMonthly: calculatedSavings.monthly,
          coiAnnual: calculatedSavings.annual,
          paybackMonths: 1.5,
          dictumText: dictumText
        })
      });
      const data = await res.json();
      if (data.success) {
        setHubspotSyncMsg(`✓ ${data.message || 'Sincronizado a HubSpot CRM'}`);
        setTimeout(() => setHubspotSyncMsg(null), 4500);
      } else {
        setHubspotSyncMsg(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setHubspotSyncMsg(`Error: ${e.message}`);
    } finally {
      setIsSyncingHubSpot(false);
    }
  };

  const copyEmail = (body: string, idx: number) => {
    navigator.clipboard.writeText(body);
    setCopiedEmailIdx(idx);
    setTimeout(() => setCopiedEmailIdx(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Selector de Perfil y Botón de Ingestión */}
      <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#787774] font-bold block mb-1">
            Empresa / Proyecto Activo
          </span>
          <h2 className="text-base font-bold text-[#111111] font-mono flex items-center gap-2">
            <Briefcase size={16} className="text-[#111111]" />
            {currentProfile.name}
          </h2>
          <p className="text-xs text-[#787774] mt-0.5">{currentProfile.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Projects */}
          <div className="flex items-center gap-1 bg-[#F4F4F2] border border-[#EAEAEA] p-1 rounded-lg">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all whitespace-nowrap ${
                  selectedProfileId === p.id
                    ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
                    : 'text-[#787774] hover:text-[#111111]'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Botón Ingestar */}
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#F4F4F2] border border-[#EAEAEA] text-[#111111] px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium shadow-sm transition-all"
          >
            <Plus size={13} />
            <span>+ Cargar Proyecto (Web/Deck)</span>
          </button>
        </div>
      </div>

      {/* Modal de Ingestión */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/40 backdrop-blur-sm p-4">
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#FBFBFA] border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111111] font-mono flex items-center gap-2">
                <FileText size={16} />
                Ingestar Contexto de Empresa con IA
              </h3>
              <button onClick={() => setIsIngestModalOpen(false)} className="text-[#787774] hover:text-[#111111]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIngestSubmit} className="p-6 space-y-4 text-xs font-mono">
              <p className="text-[#787774]">
                Pega la URL de la empresa, el texto de una presentación o notas. La IA estructurará los sliders cuantitativos, el marco regulatorio y las secuencias de prospección.
              </p>

              <div>
                <label className="block text-[#111111] font-bold mb-1">Nombre de la Empresa o Proyecto *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. CloudShield Cybersecurity / Logística Express"
                  value={ingestForm.companyName}
                  onChange={(e) => setIngestForm({...ingestForm, companyName: e.target.value})}
                  className="w-full bg-[#FFFFFF] border border-[#EAEAEA] rounded-md px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#787774] font-medium mb-1 flex items-center gap-1">
                    <Globe size={12} />
                    Sitio Web (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="https://empresa.com"
                    value={ingestForm.websiteUrl}
                    onChange={(e) => setIngestForm({...ingestForm, websiteUrl: e.target.value})}
                    className="w-full bg-[#FFFFFF] border border-[#EAEAEA] rounded-md px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[#787774] font-medium mb-1">¿Qué vendes y a quién?</label>
                  <input
                    type="text"
                    placeholder="ej. Software SOC para CFOs de bancos"
                    value={ingestForm.notes}
                    onChange={(e) => setIngestForm({...ingestForm, notes: e.target.value})}
                    className="w-full bg-[#FFFFFF] border border-[#EAEAEA] rounded-md px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#787774] font-medium mb-1 flex items-center gap-1">
                  <FileText size={12} />
                  Texto del Pitch Deck / Presentación:
                </label>
                <textarea
                  rows={3}
                  placeholder="Pega extractos de la presentación, propuesta de valor, precios o dolores clave..."
                  value={ingestForm.documentText}
                  onChange={(e) => setIngestForm({...ingestForm, documentText: e.target.value})}
                  className="w-full bg-[#FFFFFF] border border-[#EAEAEA] rounded-md px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {ingestError && (
                <div className="p-2.5 rounded-md bg-[#FDEBEC] border border-[#FAD4D6] text-[#9F2F2D]">
                  {ingestError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIngestModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-[#EAEAEA] text-[#787774] hover:text-[#111111]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isIngesting}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#111111] hover:bg-[#333333] text-white font-medium disabled:opacity-50"
                >
                  {isIngesting ? <Loader2 size={13} className="animate-spin" /> : null}
                  {isIngesting ? 'Compilando...' : 'Compilar Caso de Negocio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna 1: Sliders Adaptativos (5 Col) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
            <h3 className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} />
              Variables de Operación ({currentProfile.industry})
            </h3>
          </div>

          <div className="space-y-3.5">
            {currentProfile.variables?.map(v => {
              const valKey = `${currentProfile.id}_${v.id}`;
              const currentVal = varValues[valKey] !== undefined ? varValues[valKey] : v.default;

              return (
                <div key={v.id} className="bg-[#FBFBFA] p-3 rounded-lg border border-[#EAEAEA]">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#787774]">{v.label}:</span>
                    <span className="text-[#111111] font-bold">
                      {currentVal.toLocaleString()} {v.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={v.min}
                    max={v.max}
                    step={v.step}
                    value={currentVal}
                    onChange={(e) => handleVarChange(v.id, Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Tarjetas de Ahorro / Pérdida */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#EDF3EC] p-3 rounded-lg border border-[#D3E3D2]">
              <span className="text-[10px] text-[#346538] block font-mono uppercase tracking-wider font-bold">Fuga Mensual Rescatable</span>
              <span className="text-base font-bold font-mono text-[#346538]">
                ${calculatedSavings.monthly.toLocaleString()} {currentProfile.currency}
              </span>
            </div>
            <div className="bg-[#FBF3DB] p-3 rounded-lg border border-[#E9DFBE]">
              <span className="text-[10px] text-[#956400] block font-mono uppercase tracking-wider font-bold">Impacto Anual Neto</span>
              <span className="text-base font-bold font-mono text-[#956400]">
                ${calculatedSavings.annual.toLocaleString()} {currentProfile.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Columna 2: Dictamen Regulatorio & Secuencias de Outreach (7 Col) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Dictamen Ejecutivo */}
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <span className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#346538]" />
                Dictamen Ejecutivo con Marco Regulatorio & BLUF
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHubspotSync}
                  disabled={isSyncingHubSpot}
                  className="flex items-center gap-1.5 text-[11px] font-mono bg-[#FF7A59] hover:bg-[#E56647] text-[#FFFFFF] font-bold px-2.5 py-1 rounded transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSyncingHubSpot ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                  {isSyncingHubSpot ? 'Sincronizando...' : 'Sync HubSpot CRM'}
                </button>
                <button
                  onClick={copyDictum}
                  className="flex items-center gap-1 text-[11px] font-mono bg-[#FFFFFF] hover:bg-[#F4F4F2] border border-[#EAEAEA] text-[#111111] px-2.5 py-1 rounded transition-colors"
                >
                  {copiedDictum ? <Check size={12} className="text-[#346538]" /> : <Copy size={12} />}
                  {copiedDictum ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <label className="text-[11px] font-mono font-medium text-[#787774] whitespace-nowrap">Prospecto Auditado:</label>
              <input
                type="text"
                placeholder={(currentProfile as any).targetClientRole || "ej. Grupo Gasolinero Pemex / Sofía Health"}
                value={targetAccountName}
                onChange={(e) => setTargetAccountName(e.target.value)}
                className="w-full bg-[#FBFBFA] border border-[#EAEAEA] rounded px-2.5 py-1 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <p className="text-xs font-mono text-[#2F3437] leading-relaxed whitespace-pre-line bg-[#FBFBFA] p-3.5 rounded-lg border border-[#EAEAEA]">
              {dictumText}
            </p>
            {hubspotSyncMsg && (
              <div className="bg-[#FFF4F0] border border-[#FFD5C8] text-[#D9381E] text-xs font-mono px-3 py-2 rounded-md animate-in fade-in">
                {hubspotSyncMsg}
              </div>
            )}
          </div>

          {/* Secuencias de Outreach */}
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2.5">
              <span className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5">
                <Mail size={14} />
                Secuencias de Outreach (4 Pasos Adaptados)
              </span>
              <span className="text-[10px] font-mono text-[#787774]">Snov.io / Apollo / WhatsApp</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {currentProfile.outreach_emails?.map((email, idx) => (
                <div key={idx} className="bg-[#FBFBFA] p-3 rounded-lg border border-[#EAEAEA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111111]">
                      {email.step}
                    </span>
                    <button
                      onClick={() => copyEmail(email.body, idx)}
                      className="flex items-center gap-1 text-[10px] font-mono bg-[#FFFFFF] hover:bg-[#F4F4F2] border border-[#EAEAEA] text-[#787774] px-2 py-0.5 rounded transition-colors"
                    >
                      {copiedEmailIdx === idx ? <Check size={11} className="text-[#346538]" /> : <Copy size={11} />}
                      {copiedEmailIdx === idx ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-[#787774]">
                    <span className="font-bold">Asunto:</span> {email.subject}
                  </div>
                  <p className="text-xs font-mono text-[#2F3437] whitespace-pre-line bg-[#FFFFFF] p-2.5 rounded border border-[#EAEAEA]">
                    {email.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
