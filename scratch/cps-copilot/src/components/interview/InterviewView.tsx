"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Target, Mic, MicOff, Activity, Sparkles, UserCheck, PhoneCall, Download } from 'lucide-react';
import { useDeepgram } from '@/hooks/useDeepgram';
import { SocraticSpeedometer } from '@/components/common/SocraticSpeedometer';

type InterviewInsight = {
  interviewerIntent: string;
  factorX: string;
  mintoAnswer: string[];
  socraticCounter: string;
};

type SubTabType = 'live' | 'simulator' | 'aci_guide';

export const InterviewView: React.FC = () => {
  const [subTab, setSubTab] = useState<SubTabType>('live');

  const { transcript, isListening, startListening, stopListening, error } = useDeepgram();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastAnalyzedLengthRef = useRef(0);

  const [currentRole, setCurrentRole] = useState("BDR LATAM");
  const [targetCompanyType, setTargetCompanyType] = useState("ACI Worldwide");

  const handleSaveTranscript = () => {
    if (!transcript) return;
    const content = `==================================================\nREGISTRO DE TRANSCRIPCIÓN Y ANÁLISIS EN VIVO - CPS OS\nFecha: ${new Date().toLocaleString()}\nPosición: ${currentRole}\nEmpresa: ${targetCompanyType}\n==================================================\n\n[TRANSCRIPCIÓN COMPLETA DE LA SESIÓN]\n${transcript}\n\n==================================================\n[RECOMENDACIONES Y ANÁLISIS DE LA IA]\n${liveInsights.map((ins, i) => `\n--- INSIGHT ${i + 1} ---\nIntención del Entrevistador: ${ins.interviewerIntent}\nFactor X / Riesgo Evaluado: ${ins.factorX}\nPuntos Clave de Respuesta:\n${ins.mintoAnswer.join('\n')}\nContra-Pregunta Socrática: "${ins.socraticCounter}"\n`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Entrevista_${targetCompanyType.replace(/\s+/g, '_')}_Transcripcion_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [liveInsights, setLiveInsights] = useState<InterviewInsight[]>([
    {
      interviewerIntent: "Evaluación de Tracción y Rendimiento Bajo Presión",
      factorX: "Miedo a contratar a un líder puramente teórico que no sepa destrabar el pipeline en los primeros 60 días.",
      mintoAnswer: [
        "1. Diagnóstico forense del funnel (identificar etapas con caída >40%).",
        "2. Intervención quirúrgica en el 'ICP Density' y cadencias de outreach.",
        "3. Resultado cuantificado: Crecimiento de pipeline calificado en 3.4x."
      ],
      socraticCounter: "¿Hoy la principal fuga del equipo está en la generación de nuevos leads calificados o en la tasa de cierre en la etapa de propuesta?"
    }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening) {
      interval = setInterval(async () => {
        if (transcript.length - lastAnalyzedLengthRef.current > 25) {
          setIsAnalyzing(true);
          try {
            const recentContext = transcript.slice(-1200);
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                transcript: recentContext,
                contextConfig: {
                  mode: 'Entrevista Laboral de Alto Nivel (Director / C-Level)',
                  clientRole: `Entrevistador evaluando para: ${currentRole}`,
                  industry: targetCompanyType,
                  goal: 'Desmantelar Preguntas Trampa, Demostrar Autoridad y Formular Preguntas de Alto Estatus'
                }
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.insights && data.insights.length > 0) {
                const newInsight: InterviewInsight = {
                  interviewerIntent: data.insights[0]?.title || "Evaluación Estratégica",
                  factorX: data.insights.find((i: any) => i.type === 'factor_x')?.text || "El entrevistador busca validar capacidad de ejecución real.",
                  mintoAnswer: [
                    "1. Definir el problema con métrica de impacto directo.",
                    "2. Explicar la acción ejecutiva con Primeros Principios.",
                    "3. Presentar el resultado verificable y lección aprendida."
                  ],
                  socraticCounter: data.insights[0]?.suggestion || "¿Cuál es la expectativa de impacto para esta posición en los primeros 90 días?"
                };
                setLiveInsights(prev => [newInsight, ...prev].slice(0, 3));
              }
              lastAnalyzedLengthRef.current = transcript.length;
            }
          } catch (err) {
            console.error("Error en análisis de entrevista:", err);
          } finally {
            setIsAnalyzing(false);
          }
        }
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, transcript, currentRole, targetCompanyType]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sub-navegador */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] border border-[#EAEAEA] p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white font-mono font-bold shadow-sm">
            <Target size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111111] font-mono">
              Career & Interview Copilot
            </h2>
            <p className="text-xs text-[#787774]">Asesor táctico en vivo para entrevistas de liderazgo.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F4F4F2] p-1 rounded-lg border border-[#EAEAEA]">
          <button
            onClick={() => setSubTab('live')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              subTab === 'live'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
                : 'text-[#787774] hover:text-[#111111]'
            }`}
          >
            🎙️ 1. Copiloto en Vivo
          </button>
          <button
            onClick={() => setSubTab('aci_guide')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              subTab === 'aci_guide'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
                : 'text-[#787774] hover:text-[#111111]'
            }`}
          >
            📄 2. Guía ACI (Data & Insights)
          </button>
          <button
            onClick={() => setSubTab('simulator')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              subTab === 'simulator'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
                : 'text-[#787774] hover:text-[#111111]'
            }`}
          >
            🤖 3. Simulador de Voz
          </button>
        </div>
      </div>

      {/* VISTA 1: Copiloto en Vivo */}
      {subTab === 'live' && (
        <div className="space-y-6">
          
          {/* Configuración rápida */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#FFFFFF] p-4 rounded-xl border border-[#EAEAEA] text-xs font-mono">
            <div>
              <label className="block text-[#787774] mb-1">Posición:</label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full bg-[#FBFBFA] border border-[#EAEAEA] rounded-md px-3 py-1.5 text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[#787774] mb-1">Industria / Empresa:</label>
              <input
                type="text"
                value={targetCompanyType}
                onChange={(e) => setTargetCompanyType(e.target.value)}
                className="w-full bg-[#FBFBFA] border border-[#EAEAEA] rounded-md px-3 py-1.5 text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={isListening ? () => stopListening() : () => startListening()}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-md font-mono text-xs font-medium transition-all ${
                  isListening
                    ? 'bg-[#9F2F2D] text-white animate-pulse'
                    : 'bg-[#111111] hover:bg-[#333333] text-white shadow-sm'
                }`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                {isListening ? 'Detener Escucha' : 'Activar Escucha en Vivo'}
              </button>
            </div>
          </div>

          {/* Grid Principal: Transcripción (5 Col) + Tarjetas (7 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Transcripción + Velocímetro (5 Col) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-5 shadow-sm flex flex-col justify-between h-[330px]">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2 mb-2">
                  <span className="text-xs font-mono font-medium text-[#111111] flex items-center gap-2">
                    <Activity size={13} className={isListening ? "text-[#346538] animate-spin" : "text-[#787774]"} />
                    Transcripción de la Conversación
                  </span>
                  <div className="flex items-center gap-2">
                    {transcript && (
                      <button
                        onClick={handleSaveTranscript}
                        className="flex items-center gap-1 text-[10px] font-mono text-[#346538] bg-[#EDF3EC] hover:bg-[#D3E3D2] px-2 py-0.5 rounded border border-[#D3E3D2] transition-all"
                        title="Guardar transcripción completa y análisis de la sesión en archivo de texto"
                      >
                        <Download size={11} />
                        <span>Guardar (.txt)</span>
                      </button>
                    )}
                    {isAnalyzing && (
                      <span className="text-[10px] font-mono text-[#1F6C9F] animate-pulse">Analizando...</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 text-xs font-mono text-[#2F3437] space-y-2">
                  {transcript ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#787774] italic text-center p-6 space-y-2">
                      <UserCheck size={28} className="opacity-30" />
                      <p>Activa el micrófono durante la reunión en Teams o Meet.</p>
                      <p className="text-[10px] text-[#A0A09E]">El sistema escuchará la pregunta y te entregará la estrategia socrática.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Velocímetro Socrático Estilo Editorial Minimalista */}
              <SocraticSpeedometer
                value={isListening ? 68 : 65}
                clientTalkPercent={isListening ? 68 : 65}
                userTalkPercent={isListening ? 32 : 35}
              />
            </div>

            {/* Desglose Estratégico */}
            <div className="lg:col-span-7 space-y-3.5 h-[450px] overflow-y-auto pr-1">
              {liveInsights.map((item, idx) => (
                <div key={idx} className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-4 shadow-sm space-y-3">
                  
                  {/* Intención y Factor X */}
                  <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2">
                    <span className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#111111]" />
                      {item.interviewerIntent}
                    </span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#FBF3DB] text-[#956400] border border-[#E9DFBE]">
                      Factor X
                    </span>
                  </div>

                  <div className="bg-[#FBFBFA] p-2.5 rounded-md border border-[#EAEAEA] text-xs font-mono text-[#2F3437]">
                    <span className="text-[#787774] font-bold block mb-0.5">Qué teme o evalúa el entrevistador:</span>
                    {item.factorX}
                  </div>

                  {/* Estructura Minto */}
                  <div className="bg-[#EDF3EC] p-2.5 rounded-md border border-[#D3E3D2] space-y-1">
                    <span className="text-xs font-mono font-bold text-[#346538] block">
                      Estructura Recomendada (Minto / STAR):
                    </span>
                    {item.mintoAnswer.map((point, pIdx) => (
                      <div key={pIdx} className="text-xs font-mono text-[#2F3437]">
                        {point}
                      </div>
                    ))}
                  </div>

                  {/* Contra-Pregunta */}
                  <div className="bg-[#E1F3FE] p-2.5 rounded-md border border-[#C6E4F8]">
                    <span className="text-xs font-mono font-bold text-[#1F6C9F] block mb-0.5">
                      Contra-Pregunta de Alto Estatus:
                    </span>
                    <p className="text-xs font-mono text-[#2F3437] italic">
                      "{item.socraticCounter}"
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* VISTA 2: Guía ACI (Data & Insights) */}
      {subTab === 'aci_guide' && (
        <div className="space-y-5 font-mono animate-in fade-in duration-200">
          
          {/* Header & Quick Pitch Box */}
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#346538]"></span>
                <h3 className="text-sm font-bold text-[#111111]">
                  El Pitch Maestro de Doble Dominio (Inbound + Outbound)
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F1F1EF] text-[#787774] border border-[#EAEAEA]">
                ACI Worldwide BDR LATAM
              </span>
            </div>

            <div className="bg-[#FBFBFA] border border-[#EAEAEA] p-4 rounded-lg space-y-3 text-xs">
              <div>
                <span className="text-[#346538] font-bold block mb-1">🇺🇸 English Pitch (B2 Natural):</span>
                <p className="text-[#111111] italic leading-relaxed">
                  "You should hire me because I dominate BOTH Inbound and Outbound execution with hard data: On Inbound, I converted marketing leads into $16.8M MXN by maximizing response speed; on Outbound, I self-generated $50.5M MXN (72.7% of my $69M portfolio) with deal sizes twice as large as standard inbound leads, leading me to reach 109% quota and the Top 3 National Podium at Clip."
                </p>
              </div>
              <div className="border-t border-[#EAEAEA] pt-2">
                <span className="text-[#787774] font-bold block mb-1">🇲🇽 Versión en Español:</span>
                <p className="text-[#2F3437] leading-relaxed">
                  "Deberían contratarme porque domino AMBOS canales con datos duros: En Inbound convertí leads de marketing en $16.8M MXN respondiendo de inmediato; en Outbound auto-generé $50.5M MXN (72.7% del total) con tratos del doble de tamaño, alcanzando 109% de cuota y el Podio Nacional Top 3."
                </p>
              </div>
            </div>
          </div>

          {/* Grid: Métricas Reales + Insights ACI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tarjeta 1: Desglose de Data Real de Portafolio */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-4 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-[#111111] border-b border-[#EAEAEA] pb-2 flex items-center gap-1.5">
                📊 Data Dura Comprobada (Portafolio Real)
              </h4>
              <ul className="text-xs space-y-2 text-[#2F3437]">
                <li className="flex justify-between items-center bg-[#FBFBFA] p-2 rounded border border-[#EAEAEA]">
                  <span>Outbound Auto-Generado:</span>
                  <strong className="text-[#346538]">$50.5M MXN (72.7%)</strong>
                </li>
                <li className="flex justify-between items-center bg-[#FBFBFA] p-2 rounded border border-[#EAEAEA]">
                  <span>Inbound Marketing Convertido:</span>
                  <strong className="text-[#1F6C9F]">$16.8M MXN (24.2%)</strong>
                </li>
                <li className="flex justify-between items-center bg-[#FBFBFA] p-2 rounded border border-[#EAEAEA]">
                  <span>Ticket Promedio Outbound:</span>
                  <strong className="text-[#111111]">$555,000 MXN TPV (2x Inbound)</strong>
                </li>
                <li className="flex justify-between items-center bg-[#FBFBFA] p-2 rounded border border-[#EAEAEA]">
                  <span>Cumplimiento Total de Cuota:</span>
                  <strong className="text-[#956400]">109% (Top 3 Podio Nacional)</strong>
                </li>
              </ul>
            </div>

            {/* Tarjeta 2: Insights de Inteligencia de ACI */}
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-4 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-[#111111] border-b border-[#EAEAEA] pb-2 flex items-center gap-1.5">
                🍊 Insights de Inteligencia ACI para Soltar
              </h4>
              <div className="space-y-2 text-xs">
                <div className="bg-[#FBF3DB] text-[#956400] p-2.5 rounded border border-[#E9DFBE]">
                  <strong>1. Alberto Olivares (VP LATAM):</strong> Falsos positivos de fraude cuestan millones a comercios antes del Mundial 2026.
                </div>
                <div className="bg-[#E1F3FE] text-[#1F6C9F] p-2.5 rounded border border-[#C6E4F8]">
                  <strong>2. Alianza ACI + dLocal:</strong> Acceso a SPEI, OXXO, Pix en 1 sola integración para comercios multinacionales.
                </div>
                <div className="bg-[#EDF3EC] text-[#346538] p-2.5 rounded border border-[#D3E3D2]">
                  <strong>3. Vertical iGaming & Casinos:</strong> Foco en velocidad de Pay-Out y prevención de fraude en tiempo real.
                </div>
              </div>
            </div>

          </div>

          {/* Preguntas Finales */}
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-[#111111] border-b border-[#EAEAEA] pb-2">
              ❓ Tus 3 Preguntas de Alto Estatus para Andrés Soler
            </h4>
            <div className="text-xs text-[#2F3437] space-y-1.5 pt-1">
              <p>1. <em>"In the current LATAM strategy, is the main prospecting focus more on Large Retail, Gaming, or Financial Institutions?"</em></p>
              <p>2. <em>"What distinguishes a BDR who succeeds quickly and hits quota in their first 90 days at ACI?"</em></p>
              <p>3. <em>"What are the next steps in the interview process after our screening call today?"</em></p>
            </div>
          </div>

        </div>
      )}

      {/* VISTA 3: Simulador con Voz */}
      {subTab === 'simulator' && (
        <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 shadow-sm text-center space-y-5 max-w-xl mx-auto font-mono">
          <div className="w-12 h-12 rounded-lg bg-[#F4F4F2] border border-[#EAEAEA] flex items-center justify-center text-[#111111] mx-auto shadow-sm">
            <PhoneCall size={20} />
          </div>
          
          <div>
            <h3 className="text-base font-bold text-[#111111]">
              Simulador de Entrevista con Voz (Hume EVI)
            </h3>
            <p className="text-xs text-[#787774] max-w-sm mx-auto mt-1">
              Practica una entrevista realista donde la IA actúa como un CEO exigente evaluando tu tono, estructura y fluidez.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/interview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white font-mono font-medium text-xs px-5 py-2.5 rounded-md shadow-sm transition-all"
            >
              <PhoneCall size={14} />
              <span>Abrir Sala de Simulación con Voz</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
