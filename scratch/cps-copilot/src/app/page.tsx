"use client";

import React, { useState } from 'react';
import { Topbar } from '@/components/topbar/Topbar';
import { CpsGymView } from '@/components/cps-gym/CpsGymView';
import { BusinessEngineView } from '@/components/business-engine/BusinessEngineView';
import { InterviewView } from '@/components/interview/InterviewView';

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<'gym' | 'business' | 'interview'>('business');

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] flex flex-col selection:bg-[#FBF3DB] selection:text-[#111111]">
      {/* Barra Superior Minimalista */}
      <Topbar 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeMode === 'gym' && <CpsGymView />}
        {activeMode === 'business' && <BusinessEngineView />}
        {activeMode === 'interview' && <InterviewView />}
      </main>

      {/* Footer Editorial */}
      <footer className="w-full border-t border-[#EAEAEA] py-4 text-center text-[11px] font-mono text-[#787774]">
        CPS OS v2.4 • Cognitive Architecture & Strategic Revenue • Zero-Assumption Standard
      </footer>
    </div>
  );
}
