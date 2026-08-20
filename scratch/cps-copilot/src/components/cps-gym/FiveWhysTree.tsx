"use client";

import React, { useState } from 'react';
import { GitFork } from 'lucide-react';

export const FiveWhysTree: React.FC = () => {
  const [symptom, setSymptom] = useState<string>("El cliente frena la firma argumentando: 'El precio es muy elevado frente a la competencia'.");
  
  const [steps, setSteps] = useState([
    { level: 1, why: "¿Por qué consideran que el precio es elevado?", answer: "Porque están comparando únicamente la tarifa transaccional porcentual (ej. 1.45% vs 1.40%)." },
    { level: 2, why: "¿Por qué solo miran la tarifa transaccional?", answer: "Porque no les hemos demostrado el costo oculto de la carga impositiva ni la tasa de contracargos/caídas." },
    { level: 3, why: "¿Por qué el decisor no está evaluando los costos ocultos?", answer: "Porque el interlocutor es un Gerente de Compras medido por reducción de tarifa directa, no por utilidad neta." },
    { level: 4, why: "¿Por qué no tenemos al CFO o Director General en la mesa?", answer: "Porque entramos por el canal operativo y no construimos un Caso de Negocio BLUF de nivel C-Suite." },
    { level: 5, why: "CAUSA RAÍZ (FACTOR X):", answer: "Falta de anclaje de valor con el CFO. Se está vendiendo una 'herramienta/comodidad' en lugar de un 'recuperador de margen neto y blindaje fiscal'." }
  ]);

  return (
    <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <GitFork size={18} className="text-[#346538]" />
            Simulador de los 5 Porqués (Root Cause Analysis & Factor X)
          </h3>
          <p className="text-xs text-[#787774] mt-0.5">Desentierra la causa raíz humana y estructural detrás del síntoma superficial.</p>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#EDF3EC] text-[#346538] border border-[#D3E3D2]">
          Root Cause
        </span>
      </div>

      {/* Síntoma inicial editable */}
      <div className="mb-6 bg-[#FBFBFA] p-4 rounded-lg border border-[#EAEAEA]">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#787774] mb-1.5 font-bold">
          Síntoma Superficial (Lo que el cliente dice):
        </label>
        <input
          type="text"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          className="w-full bg-[#FFFFFF] border border-[#EAEAEA] rounded-md px-3 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
        />
      </div>

      {/* Cadena Causal */}
      <div className="space-y-3.5 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-px before:bg-[#EAEAEA]">
        {steps.map((s, idx) => (
          <div key={idx} className="relative flex items-start gap-4 pl-9">
            {/* Dot indicador */}
            <div className={`absolute left-4 -translate-x-1/2 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold font-mono ${
              idx === 4 
                ? 'bg-[#9F2F2D] border-[#9F2F2D] text-white' 
                : 'bg-[#FFFFFF] border-[#EAEAEA] text-[#787774]'
            }`}>
              {s.level}
            </div>

            <div className={`w-full p-3.5 rounded-lg border transition-all ${
              idx === 4 
                ? 'bg-[#FDEBEC] border-[#FAD4D6]' 
                : 'bg-[#FBFBFA] border-[#EAEAEA]'
            }`}>
              <div className="text-xs font-mono font-bold text-[#111111] mb-1">
                {s.why}
              </div>
              <textarea
                rows={2}
                value={s.answer}
                onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[idx].answer = e.target.value;
                  setSteps(newSteps);
                }}
                className={`w-full bg-[#FFFFFF] border border-[#EAEAEA] rounded-md px-2.5 py-1.5 text-xs font-mono focus:outline-none ${
                  idx === 4 ? 'text-[#9F2F2D] font-medium' : 'text-[#2F3437]'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
