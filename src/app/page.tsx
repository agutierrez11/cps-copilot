"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Settings, Sparkles, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDeepgram } from '@/hooks/useDeepgram';

type Insight = {
  type: 'objection' | 'cdi';
  title: string;
  text: string;
  suggestion: string;
};

export default function CopilotPage() {
  const { transcript, isListening, startListening, stopListening, error } = useDeepgram();
  
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastAnalyzedLengthRef = useRef(0);

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
              body: JSON.stringify({ transcript: recentContext }),
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
  }, [isListening, transcript]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col p-6">
      {/* Header */}
      <header className="flex items-center justify-between glass-panel p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">CPS Copilot</h1>
            <p className="text-xs text-zinc-500 font-medium">Real-Time Analysis Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isAnalyzing ? 'bg-amber-100 text-amber-700' : isListening ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
            <Activity size={14} className={isListening || isAnalyzing ? 'animate-pulse' : ''} />
            {isAnalyzing ? 'Groq Analizando...' : isListening ? 'Deepgram Live' : 'En Espera'}
          </div>
          <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
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
            CPS Insights
          </h2>
          
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${insight.type === 'objection' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'} shadow-sm animate-in fade-in slide-in-from-bottom-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    {insight.type === 'objection' ? <AlertCircle size={16} className="text-amber-600" /> : <CheckCircle2 size={16} className="text-emerald-600" />}
                    <h3 className={`font-semibold text-sm ${insight.type === 'objection' ? 'text-amber-900' : 'text-emerald-900'}`}>
                      {insight.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-700 mb-3">{insight.text}</p>
                  <div className="bg-white/60 p-3 rounded-lg border border-white/40">
                    <p className="text-xs font-semibold text-indigo-700 mb-1">🔥 Acción Recomendada</p>
                    <p className="text-xs text-zinc-800">{insight.suggestion}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8 border-2 border-dashed border-zinc-200 rounded-xl">
                <p className="text-sm text-zinc-500">
                  {isListening ? "Escuchando... Groq analizará la llamada en busca de objeciones o CDI cada 5 segundos." : "Inicia el copiloto para recibir insights en tiempo real procesados por Groq."}
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
