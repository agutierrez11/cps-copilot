"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Activity, Sparkles, Brain } from 'lucide-react';
import { useDeepgram } from '@/hooks/useDeepgram';

type Insight = {
  type: 'cynefin' | 'factor_x' | 'socratic_friction';
  title: string;
  text: string;
  suggestion: string;
};

export const SocraticSparring: React.FC = () => {
  const { transcript, isListening, startListening, stopListening, error } = useDeepgram();
  
  const [insights, setInsights] = useState<Insight[]>([
    {
      type: 'factor_x',
      title: 'Factor X: Aversión al Riesgo del Decisor',
      text: 'El cliente muestra reticencia a cambiar de proveedor por miedo al costo operativo de migración.',
      suggestion: '¿Cuál es el costo estimado de mantener el proveedor actual 6 meses más frente al riesgo de migración?'
    },
    {
      type: 'cynefin',
      title: 'Dominio Cynefin: Entorno Complejo',
      text: 'Existen variables no lineales (volatilidad de comisiones y regulación SAT).',
      suggestion: 'Recomienda un piloto controlado en 2 sucursales antes del despliegue masivo.'
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastAnalyzedLengthRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening) {
      interval = setInterval(async () => {
        if (transcript.length - lastAnalyzedLengthRef.current > 20) {
          setIsAnalyzing(true);
          try {
            const recentContext = transcript.slice(-1000);
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                transcript: recentContext,
                contextConfig: {
                  mode: 'Sparring Socrático CPS',
                  clientRole: 'CFO / Decisor C-Level',
                  industry: 'Fintech & Estrategia',
                  goal: 'Desmantelar Objeciones y Demostrar Autoridad'
                }
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.insights && data.insights.length > 0) {
                setInsights(prev => [...data.insights, ...prev].slice(0, 4));
              }
              lastAnalyzedLengthRef.current = transcript.length;
            }
          } catch (err) {
            console.error("Error en análisis socrático:", err);
          } finally {
            setIsAnalyzing(false);
          }
        }
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, transcript]);

  return (
    <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between border-b border-[#EAEAEA] pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <Brain size={18} className="text-[#111111]" />
            Sparring Socrático & Voice AI (Entrenamiento de Llamadas)
          </h3>
          <p className="text-xs text-[#787774] mt-0.5">Practica tus conversaciones y recibe retroalimentación de Factor X y Cynefin en tiempo real.</p>
        </div>

        {/* Botón Micrófono */}
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs text-[#9F2F2D] font-mono bg-[#FDEBEC] px-2.5 py-1 rounded border border-[#FAD4D6]">
              {error}
            </span>
          )}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium transition-all ${
              isListening
                ? 'bg-[#9F2F2D] text-white animate-pulse'
                : 'bg-[#111111] hover:bg-[#333333] text-white shadow-sm'
            }`}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            {isListening ? 'Detener Sparring' : 'Iniciar Micrófono'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel Transcripción (5 Col) */}
        <div className="lg:col-span-5 bg-[#FBFBFA] p-4 rounded-lg border border-[#EAEAEA] flex flex-col justify-between h-[340px]">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2 mb-2">
            <span className="text-xs font-mono font-medium text-[#111111] flex items-center gap-2">
              <Activity size={13} className={isListening ? "text-[#346538] animate-spin" : "text-[#787774]"} />
              Transcripción en Vivo
            </span>
            {isAnalyzing && (
              <span className="text-[10px] font-mono text-[#1F6C9F] animate-pulse">Analizando...</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-1 text-xs font-mono text-[#2F3437] space-y-2">
            {transcript ? (
              <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
            ) : (
              <div className="h-full flex items-center justify-center text-[#787774] italic text-center p-4">
                {isListening ? 'Escuchando tu voz... Habla para detectar fricciones.' : 'Presiona el botón de micrófono para iniciar.'}
              </div>
            )}
          </div>
        </div>

        {/* Panel de Insights Socráticos (7 Col) */}
        <div className="lg:col-span-7 space-y-3 h-[340px] overflow-y-auto pr-1">
          {insights.map((ins, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border transition-all ${
                ins.type === 'factor_x'
                  ? 'bg-[#FBF3DB] border-[#E9DFBE]'
                  : ins.type === 'cynefin'
                  ? 'bg-[#E1F3FE] border-[#C6E4F8]'
                  : 'bg-[#EDF3EC] border-[#D3E3D2]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#111111]" />
                  {ins.title}
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#FFFFFF]/80 text-[#787774] border border-[#EAEAEA]">
                  {ins.type}
                </span>
              </div>
              <p className="text-xs text-[#2F3437] mb-2 font-mono">{ins.text}</p>
              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#EAEAEA] text-xs font-mono text-[#111111]">
                <span className="text-[#787774] font-bold">Empujón Socrático:</span> {ins.suggestion}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
