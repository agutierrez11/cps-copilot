"use client";

import React, { useState } from 'react';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const FirstPrinciplesLab: React.FC = () => {
  const [problem, setProblem] = useState("Debemos dar comisiones bajas de 1.2% porque la competencia en procesadores cobra 1.3%.");
  
  const [atomicTruths, setAtomicTruths] = useState([
    "La comisión bancaria del 1.4% actualmente se calcula sobre el 100% del PVP bruto (incluyendo 40% de IEPS e IVA que no son dinero del cliente).",
    "El cliente gasolinero/hotelero opera con un margen neto real de apenas 4% a 6% por litro.",
    "El banco tradicional no asume el riesgo fiscal ni regulatorio del combustible, pero se queda con el 43% de la utilidad neta de la estación."
  ]);

  const [discardedAssumptions, setDiscardedAssumptions] = useState([
    "Falsa Asunción 1: 'El cliente solo busca la terminal más barata de renta cero.'",
    "Falsa Asunción 2: 'Todas las tasas bancarias aplican de forma plana sobre cualquier giro.'",
    "Falsa Asunción 3: 'El costo de procesamiento no se puede deducir o desglosar de los impuestos.'"
  ]);

  const [reconstructedThesis, setReconstructedThesis] = useState(
    "Tesis Reconstruida: No competimos por 5 puntos base en la tarifa plana. Reestructuramos la liquidación para cobrar un spread sobre el valor neto desgravado, recuperando entre $180k y $350k MXN mensuales que van directos a la utilidad neta del grupo."
  );

  return (
    <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <Layers size={18} className="text-[#1F6C9F]" />
            Laboratorio de Primeros Principios (First Principles Reasoning)
          </h3>
          <p className="text-xs text-[#787774] mt-0.5">Descompón cualquier problema en sus verdades atómicas innegables, eliminando analogías heredadas.</p>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#E1F3FE] text-[#1F6C9F] border border-[#C6E4F8]">
          First Principles
        </span>
      </div>

      {/* Input de Problema */}
      <div className="bg-[#FBFBFA] p-4 rounded-lg border border-[#EAEAEA]">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#787774] mb-1.5 font-bold">
          Supuesto o Creencia Convencional a Desarmar:
        </label>
        <textarea
          rows={2}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full bg-[#FFFFFF] border border-[#EAEAEA] rounded-md px-3 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Columna 1: Verdades Fundamentales */}
        <div className="bg-[#FBFBFA] p-4 rounded-lg border border-[#EAEAEA] space-y-3">
          <span className="text-xs font-mono font-bold text-[#346538] flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            1. Verdades Fundamentales e Innegables:
          </span>
          <div className="space-y-2">
            {atomicTruths.map((truth, idx) => (
              <div key={idx} className="bg-[#FFFFFF] p-2.5 rounded border border-[#EAEAEA] text-xs font-mono text-[#2F3437]">
                • {truth}
              </div>
            ))}
          </div>
        </div>

        {/* Columna 2: Supuestos Descartados */}
        <div className="bg-[#FBFBFA] p-4 rounded-lg border border-[#EAEAEA] space-y-3">
          <span className="text-xs font-mono font-bold text-[#9F2F2D] flex items-center gap-1.5">
            2. Supuestos Heredados Descartados:
          </span>
          <div className="space-y-2">
            {discardedAssumptions.map((assump, idx) => (
              <div key={idx} className="bg-[#FFFFFF] p-2.5 rounded border border-[#EAEAEA] text-xs font-mono text-[#787774] line-through opacity-80">
                {assump}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reconstrucción desde Cero */}
      <div className="bg-[#EDF3EC] p-4 rounded-lg border border-[#D3E3D2]">
        <span className="text-xs font-mono font-bold text-[#346538] block mb-1 flex items-center gap-1.5">
          <ArrowRight size={14} />
          3. Tesis Reconstruida desde Cero (Oferta & Valor):
        </span>
        <p className="text-xs font-mono text-[#2F3437] leading-relaxed">
          {reconstructedThesis}
        </p>
      </div>
    </div>
  );
};
