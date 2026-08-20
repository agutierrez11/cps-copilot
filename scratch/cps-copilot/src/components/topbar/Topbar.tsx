"use client";

import React from 'react';
import { Compass, Briefcase, Target, Shield } from 'lucide-react';

interface TopbarProps {
  activeMode: 'gym' | 'business' | 'interview';
  setActiveMode: (mode: 'gym' | 'business' | 'interview') => void;
  activeProfileName?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeMode,
  setActiveMode,
  activeProfileName = 'Radar Comercial'
}) => {
  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#EAEAEA] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white font-mono text-xs font-bold shadow-sm">
          CP
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111111] tracking-tight text-sm font-mono">CPS / OS</span>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider bg-[#F1F1EF] text-[#787774] border border-[#EAEAEA] px-1.5 py-0.5 rounded">
              v2.4
            </span>
          </div>
          <p className="text-[11px] text-[#787774] hidden sm:block">Cognitive Architecture & Strategic Revenue</p>
        </div>
      </div>

      {/* Segmented Mode Switcher (Editorial Flat Style) */}
      <div className="flex items-center bg-[#F4F4F2] border border-[#EAEAEA] p-1 rounded-lg gap-1">
        <button
          onClick={() => setActiveMode('gym')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
            activeMode === 'gym'
              ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
              : 'text-[#787774] hover:text-[#111111] hover:bg-[#FFFFFF]/60'
          }`}
        >
          <Compass size={13} />
          <span>CPS Gym</span>
          <span className="text-[10px] opacity-60 hidden lg:inline">Estudio</span>
        </button>

        <button
          onClick={() => setActiveMode('business')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
            activeMode === 'business'
              ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
              : 'text-[#787774] hover:text-[#111111] hover:bg-[#FFFFFF]/60'
          }`}
        >
          <Briefcase size={13} />
          <span>Business Engine</span>
          <span className="text-[10px] opacity-60 hidden lg:inline">Demos</span>
        </button>

        <button
          onClick={() => setActiveMode('interview')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
            activeMode === 'interview'
              ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
              : 'text-[#787774] hover:text-[#111111] hover:bg-[#FFFFFF]/60'
          }`}
        >
          <Target size={13} />
          <span>Interview Copilot</span>
          <span className="text-[10px] opacity-60 hidden lg:inline">Laboral</span>
        </button>
      </div>

      {/* Context Badge */}
      <div className="flex items-center gap-2">
        {activeMode === 'business' ? (
          <div className="flex items-center gap-1.5 bg-[#FBF3DB] border border-[#E9DFBE] text-[#956400] text-xs px-2.5 py-1 rounded-md font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#956400]"></span>
            <span>{activeProfileName}</span>
          </div>
        ) : activeMode === 'interview' ? (
          <div className="flex items-center gap-1.5 bg-[#E1F3FE] border border-[#C6E4F8] text-[#1F6C9F] text-xs px-2.5 py-1 rounded-md font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F6C9F]"></span>
            <span>Modo Asesor C-Level</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-[#EDF3EC] border border-[#D3E3D2] text-[#346538] text-xs px-2.5 py-1 rounded-md font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#346538]"></span>
            <span>Agnóstico</span>
          </div>
        )}
      </div>
    </header>
  );
};
