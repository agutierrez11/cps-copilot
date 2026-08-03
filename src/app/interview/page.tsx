"use client";

import React, { useState, useEffect } from 'react';
import { VoiceProvider, useVoice } from '@humeai/voice-react';
import { Mic, MicOff, PhoneOff, PhoneCall, Sparkles } from 'lucide-react';

function InterviewControls({ accessToken, systemPrompt }: { accessToken: string, systemPrompt: string }) {
  const { connect, disconnect, status, isMuted, mute, unmute } = useVoice();

  return (
    <div className="flex items-center gap-4 mt-8">
      {status.value === 'connected' ? (
        <>
          <button
            onClick={isMuted ? unmute : mute}
            className={`p-4 rounded-full transition-all ${
              isMuted ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button
            onClick={() => disconnect()}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all"
          >
            <PhoneOff size={24} />
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            connect({
              auth: { type: "accessToken", value: accessToken },
              sessionSettings: {
                type: "session_settings",
                systemPrompt: systemPrompt
              }
            }).catch(console.error);
          }}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
        >
          <PhoneCall size={20} />
          {status.value === 'connecting' ? 'Conectando a Hume...' : 'Iniciar Entrevista'}
        </button>
      )}
    </div>
  );
}

function InterviewMessages() {
  const { messages } = useVoice();

  // Scroll to bottom on new message
  useEffect(() => {
    const el = document.getElementById('message-container');
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div 
      id="message-container"
      className="flex-1 w-full max-w-2xl mt-8 overflow-y-auto pr-4 flex flex-col gap-4 scroll-smooth"
    >
      {messages.map((msg, idx) => {
        if (msg.type !== 'user_message' && msg.type !== 'assistant_message') return null;
        
        const isUser = msg.message.role === 'user';
        
        return (
          <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="leading-relaxed">{msg.message.content}</p>
            </div>
            <span className="text-xs text-zinc-400 mt-1 px-1">
              {isUser ? 'Tú' : 'StarPago VP (Hume AI)'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function InterviewSimulator() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/api/hume/token');
        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        } else {
          setError(data.error || 'Error al obtener token de Hume.');
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchToken();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 animate-pulse font-medium">Cargando credenciales seguras...</p>
      </div>
    );
  }

  // System Prompt for StarPago VP Role
  const systemPrompt = `
    Eres un estricto pero justo Vicepresidente de Ventas en Asia para la empresa StarPago (soluciones de pago B2B y FX).
    Estás entrevistando a un candidato altamente capacitado para un rol de Full-Cycle Sales. 
    Tu objetivo es validar si realmente sabe manejar un ciclo completo de ventas B2B, identificar dolores de inacción (CDI) y negociar con ejecutivos C-Level.
    Habla en español, de forma muy directa y al grano. Haz preguntas difíciles, interrumpe si el candidato divaga, y presiona sobre cómo manejaría una objeción de precio.
    Inicia la entrevista saludando y pidiendo al candidato que te venda por qué debería contratarlo para StarPago.
  `;

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <div className="z-10 flex flex-col items-center text-center max-w-lg mb-8">
        <div className="bg-indigo-100 p-3 rounded-2xl mb-4">
          <Sparkles className="text-indigo-600" size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">Simulador B2B</h1>
        <p className="text-zinc-500 font-medium">Entrevista en vivo con EVI de Hume AI (StarPago VP)</p>
      </div>

      <VoiceProvider>
        <div className="w-full max-w-4xl h-[600px] glass-panel flex flex-col items-center p-8 bg-white/50 relative overflow-hidden">
          
          <InterviewMessages />
          
          <div className="mt-auto w-full flex justify-center border-t border-zinc-200/60 pt-6">
            <InterviewControls accessToken={accessToken} systemPrompt={systemPrompt} />
          </div>
          
        </div>
      </VoiceProvider>
    </main>
  );
}
