"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Settings, Sparkles, Activity, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useDeepgram } from '@/hooks/useDeepgram';

type Insight = {
  type: 'cynefin' | 'factor_x' | 'socratic_friction';
  title: string;
  text: string;
  suggestion: string;
};

export default function CopilotPage() {
  const { transcript, isListening, startListening, stopListening, error } = useDeepgram();
  
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastAnalyzedLengthRef = useRef(0);

  // Context Engine State
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [contextConfig, setContextConfig] = useState({
    mode: 'Reunión Comercial B2B',
    clientRole: 'Director Financiero (CFO)',
    industry: 'Fintech / Pagos B2B',
    goal: 'Descubrimiento y Manejo de Objeciones'
  });

  // Interval-based Analysis Engine
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening) {
      interval = setInterval(async () => {
        // Only analyze if the transcript has grown by at least 20 chars since last check
        if (transcript.length - lastAnalyzedLengthRef.current > 20) {
          setIsAnalyzing(true);
          try {
            // Send the most recent context (e.g. last 1000 characters to avoid huge payloads)
            const recentContext = transcript.slice(-1000);
            
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                transcript: recentContext,
                contextConfig: contextConfig 
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.insights && data.insights.length > 0) {
                // Prepend new insights, keep maximum of 5 on screen to avoid clutter
                setInsights(prev => [...data.insights, ...prev].slice(0, 5));
              }
              lastAnalyzedLengthRef.current = transcript.length;
            }
          } catch (err) {
            console.error("Error calling analysis engine:", err);
          } finally {
            setIsAnalyzing(false);
          }
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, transcript, contextConfig]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col p-6 relative">
      
      {/* Configuration Modal (Context Engine) */}
      {isConfigOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings size={20} />
                Configuración del Contexto
              </h2>
              <button onClick={() => setIsConfigOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Modo de Operación</label>
                <select 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={contextConfig.mode}
                  onChange={e => setContextConfig({...contextConfig, mode: e.target.value})}
                >
                  <option>Reunión Comercial B2B</option>
                  <option>Entrevista de Práctica (Roleplay)</option>
                  <option>Llamada de Calificación (SDR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Perfil del Cliente / Cargo</label>
                <input 
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={contextConfig.clientRole}
                  onChange={e => setContextConfig({...contextConfig, clientRole: e.target.value})}
                  placeholder="Ej. Director de Operaciones"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Industria</label>
                <input 
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={contextConfig.industry}
                  onChange={e => setContextConfig({...contextConfig, industry: e.target.value})}
                  placeholder="Ej. Retail, Banca, Manufactura"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Objetivo del Vendedor</label>
                <input 
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={contextConfig.goal}
                  onChange={e => setContextConfig({...contextConfig, goal: e.target.value})}
                  placeholder="Ej. Descubrimiento y Cierre"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  onClick={() => setIsConfigOpen(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Guardar y Activar Copiloto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between glass-panel p-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">CPS Copilot</h1>
            <p className="text-xs text-zinc-500 font-medium">{contextConfig.mode}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isAnalyzing ? 'bg-amber-100 text-amber-700' : isListening ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
            <Activity size={14} className={isListening || isAnalyzing ? 'animate-pulse' : ''} />
            {isAnalyzing ? 'Groq Analizando...' : isListening ? 'Deepgram Live' : 'En Espera'}
          </div>
          <button 
            onClick={() => setIsConfigOpen(true)}
            className="text-zinc-400 hover:text-indigo-600 transition-colors p-2 bg-white rounded-full border border-zinc-200 shadow-sm"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Column - Transcript & Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">Transcripción en Vivo</h2>
              <button 
                onClick={isListening ? stopListening : startListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isListening 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                {isListening ? 'Detener Micrófono' : 'Activar Micrófono'}
              </button>
            </div>
            
            <div className="flex-1 bg-zinc-50 rounded-lg border border-zinc-100 p-4 font-mono text-sm text-zinc-600 overflow-y-auto">
              {error && <p className="text-red-500 mb-2 font-sans font-medium text-xs">Error: {error}</p>}
              <p className="leading-relaxed whitespace-pre-wrap">
                {!isListening && !transcript ? "Presiona 'Activar Micrófono' para comenzar a transcribir tu voz en tiempo real con Deepgram..." : transcript}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Insights */}
        <div className="glass-panel p-6 flex flex-col">
           <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500" />
            CPS Socratic Insights
          </h2>
          
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2 scroll-smooth">
            {insights.length > 0 ? (
              insights.map((insight, idx) => {
                let bgColor = 'bg-zinc-50 border-zinc-200';
                let iconColor = 'text-zinc-600';
                let textColor = 'text-zinc-900';
                
                if (insight.type === 'socratic_friction') {
                  bgColor = 'bg-amber-50 border-amber-200';
                  iconColor = 'text-amber-600';
                  textColor = 'text-amber-900';
                } else if (insight.type === 'factor_x') {
                  bgColor = 'bg-indigo-50 border-indigo-200';
                  iconColor = 'text-indigo-600';
                  textColor = 'text-indigo-900';
                } else if (insight.type === 'cynefin') {
                  bgColor = 'bg-emerald-50 border-emerald-200';
                  iconColor = 'text-emerald-600';
                  textColor = 'text-emerald-900';
                }

                return (
                  <div key={idx} className={`p-4 rounded-xl border ${bgColor} shadow-sm animate-in fade-in slide-in-from-bottom-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      {insight.type === 'socratic_friction' ? <AlertCircle size={16} className={iconColor} /> : 
                       insight.type === 'factor_x' ? <Activity size={16} className={iconColor} /> :
                       <CheckCircle2 size={16} className={iconColor} />}
                      <h3 className={`font-semibold text-sm ${textColor}`}>
                        {insight.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-700 mb-3 font-medium">"{insight.text}"</p>
                    <div className="bg-white/70 p-3 rounded-lg border border-white/60 shadow-inner">
                      <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${iconColor}`}>
                        {insight.type === 'socratic_friction' ? '🔥 Reto Socrático' : '💡 Análisis CPS'}
                      </p>
                      <p className="text-sm text-zinc-800 leading-relaxed">{insight.suggestion}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                <Activity size={32} className={`text-zinc-300 mb-3 ${isListening ? 'animate-bounce' : ''}`} />
                <p className="text-sm text-zinc-500 font-medium">
                  {isListening ? "Analizando conversación en vivo..." : "El copiloto está inactivo. Enciende el micrófono para recibir fricción socrática."}
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
