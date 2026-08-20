"use client";

import React, { useState } from 'react';
import { TrendingUp, GitFork, Layers, Mic } from 'lucide-react';
import { CoiCalculator } from './CoiCalculator';
import { FiveWhysTree } from './FiveWhysTree';
import { FirstPrinciplesLab } from './FirstPrinciplesLab';
import { SocraticSparring } from './SocraticSparring';

export const CpsGymView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coi' | 'five_whys' | 'first_principles' | 'sparring'>('coi');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub-tab Navigation (Minimalist Segmented) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#EAEAEA] pb-3">
        <button
          onClick={() => setActiveTab('coi')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
            activeTab === 'coi'
              ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
              : 'bg-[#FFFFFF] text-[#787774] hover:text-[#111111] border border-[#EAEAEA]'
          }`}
        >
          <TrendingUp size={13} />
          <span>1. Calculadora COI (Inacción)</span>
        </button>

        <button
          onClick={() => setActiveTab('five_whys')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
            activeTab === 'five_whys'
              ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
              : 'bg-[#FFFFFF] text-[#787774] hover:text-[#111111] border border-[#EAEAEA]'
          }`}
        >
          <GitFork size={13} />
          <span>2. Los 5 Porqués (Root Cause)</span>
        </button>

        <button
          onClick={() => setActiveTab('first_principles')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
            activeTab === 'first_principles'
              ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
              : 'bg-[#FFFFFF] text-[#787774] hover:text-[#111111] border border-[#EAEAEA]'
          }`}
        >
          <Layers size={13} />
          <span>3. Primeros Principios</span>
        </button>

        <button
          onClick={() => setActiveTab('sparring')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
            activeTab === 'sparring'
              ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
              : 'bg-[#FFFFFF] text-[#787774] hover:text-[#111111] border border-[#EAEAEA]'
          }`}
        >
          <Mic size={13} />
          <span>4. Sparring Voice AI</span>
        </button>
      </div>

      {/* Contenido */}
      <div>
        {activeTab === 'coi' && <CoiCalculator />}
        {activeTab === 'five_whys' && <FiveWhysTree />}
        {activeTab === 'first_principles' && <FirstPrinciplesLab />}
        {activeTab === 'sparring' && <SocraticSparring />}
      </div>
    </div>
  );
};
