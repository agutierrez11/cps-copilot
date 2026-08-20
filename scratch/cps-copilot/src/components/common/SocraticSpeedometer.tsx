"use client";

import React from 'react';

interface SocraticSpeedometerProps {
  /** Valor de 0 a 100 representando la proporción de escucha socrática (0 = Monólogo Vendedor, 100 = Escucha Activa Cliente) */
  value: number; // 0 - 100
  clientTalkPercent?: number;
  userTalkPercent?: number;
}

export const SocraticSpeedometer: React.FC<SocraticSpeedometerProps> = ({
  value = 65,
  clientTalkPercent = 65,
  userTalkPercent = 35
}) => {
  // Asegurar límites [0, 100]
  const clampedVal = Math.min(Math.max(value, 0), 100);
  
  // Convertir porcentaje a ángulo de aguja: -90 grados (0%) a +90 grados (100%)
  const needleAngle = -90 + (clampedVal / 100) * 180;

  return (
    <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-4 shadow-sm flex flex-col items-center justify-center space-y-2 select-none">
      <div className="flex items-center justify-between w-full border-b border-[#EAEAEA] pb-2 text-xs font-mono">
        <span className="font-bold text-[#111111] uppercase tracking-wider">Ritmo de Habla Socrático</span>
        <span className="text-[10px] text-[#787774] font-medium">Zona Óptima: 60-70% Escucha</span>
      </div>

      {/* Velocímetro SVG Estilo Editorial Minimalista */}
      <div className="relative w-44 h-24 flex items-end justify-center pt-2">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="editorialArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9F2F2D" />     {/* Terracota Muted (Monólogo) */}
              <stop offset="35%" stopColor="#D99B26" />    {/* Ámbar Cálido */}
              <stop offset="70%" stopColor="#346538" />    {/* Verde Bosque Óptimo */}
              <stop offset="100%" stopColor="#1E3E23" />   {/* Tinta Bosque Profundo */}
            </linearGradient>
          </defs>

          {/* Arco de fondo */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#F4F4F2"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Arco Gradiente de Tinta */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#editorialArc)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Marcas de graduación sutiles */}
          <line x1="20" y1="100" x2="30" y2="100" stroke="#787774" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="30" stroke="#787774" strokeWidth="2" />
          <line x1="180" y1="100" x2="170" y2="100" stroke="#787774" strokeWidth="2" />

          {/* Aguja Minimalista */}
          <g transform={`rotate(${needleAngle}, 100, 100)`} className="transition-transform duration-700 ease-out">
            <line x1="100" y1="100" x2="100" y2="30" stroke="#111111" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="7" fill="#111111" />
            <circle cx="100" cy="100" r="3" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Métrica de Ratio Habla/Escucha */}
      <div className="grid grid-cols-2 gap-2 w-full pt-1 text-center font-mono">
        <div className="bg-[#EDF3EC] p-1.5 rounded border border-[#D3E3D2]">
          <span className="text-[9px] text-[#346538] block uppercase font-bold">Cliente Hablando</span>
          <span className="text-xs font-bold text-[#346538]">{clientTalkPercent}%</span>
        </div>
        <div className="bg-[#FBFBFA] p-1.5 rounded border border-[#EAEAEA]">
          <span className="text-[9px] text-[#787774] block uppercase font-bold">Tú Hablando</span>
          <span className="text-xs font-bold text-[#111111]">{userTalkPercent}%</span>
        </div>
      </div>
    </div>
  );
};
