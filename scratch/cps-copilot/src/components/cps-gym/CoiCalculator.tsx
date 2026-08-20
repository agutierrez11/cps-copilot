"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Copy, Check, ShieldAlert } from 'lucide-react';

export const CoiCalculator: React.FC = () => {
  const [directLoss, setDirectLoss] = useState<number>(18000);
  const [oppCost, setOppCost] = useState<number>(25000);
  const [degradationRate, setDegradationRate] = useState<number>(3.5);
  const [solutionCost, setSolutionCost] = useState<number>(35000);
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const monthlyTotal = directLoss + oppCost;
  
  const calculateAccumulated = (months: number) => {
    let total = 0;
    for (let m = 1; m <= months; m++) {
      total += monthlyTotal * Math.pow(1 + degradationRate / 100, m - 1);
    }
    return Math.round(total);
  };

  const loss3Months = calculateAccumulated(3);
  const loss6Months = calculateAccumulated(6);
  const loss12Months = calculateAccumulated(12);
  const loss24Months = calculateAccumulated(24);

  const wasteMultiplier = (loss12Months / (solutionCost || 1)).toFixed(1);
  const paybackMonths = (solutionCost / (monthlyTotal || 1)).toFixed(1);

  // Renderizar gráfico interactivo en Canvas (Estilo Editorial Blanco / Tinta)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.fillStyle = '#FAFAF9';
    ctx.fillRect(0, 0, width, height);

    // Fondo sutil de cuadrícula editorial
    ctx.strokeStyle = '#EAEAEA';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
    for (let y = 20; y < height - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 15, y);
      ctx.stroke();
    }

    const points = [
      { m: 0, val: 0 },
      { m: 3, val: loss3Months },
      { m: 6, val: loss6Months },
      { m: 12, val: loss12Months },
      { m: 24, val: loss24Months }
    ];

    const maxVal = loss24Months * 1.15;
    const scaleX = (m: number) => 40 + (m / 24) * (width - 70);
    const scaleY = (v: number) => (height - 35) - (v / maxVal) * (height - 60);

    // 1. Línea fija de inversión de la solución (Verde Bosque Muted)
    const solY = scaleY(solutionCost);
    ctx.strokeStyle = '#346538';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, solY);
    ctx.lineTo(width - 15, solY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Etiqueta Solución
    ctx.fillStyle = '#346538';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.fillText(`Inversión Solución ($${(solutionCost/1000).toFixed(0)}k)`, 45, solY - 6);

    // 2. Curva ascendente de Costo de Inacción (Tinta Carbón / Rojo Terracota)
    ctx.strokeStyle = '#9F2F2D';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(scaleX(0), scaleY(0));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(scaleX(points[i].m), scaleY(points[i].val));
    }
    ctx.stroke();

    // Relleno pastel sutil bajo la curva
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(159, 47, 45, 0.10)');
    grad.addColorStop(1, 'rgba(159, 47, 45, 0.01)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(scaleX(0), scaleY(0));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(scaleX(points[i].m), scaleY(points[i].val));
    }
    ctx.lineTo(scaleX(24), height - 35);
    ctx.lineTo(scaleX(0), height - 35);
    ctx.closePath();
    ctx.fill();

    // Puntos clave
    points.forEach((p, idx) => {
      if (idx === 0) return;
      const px = scaleX(p.m);
      const py = scaleY(p.val);

      ctx.fillStyle = '#9F2F2D';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Valor en texto
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`$${(p.val / 1000).toFixed(0)}k`, px - 12, py - 8);
      
      // Eje X
      ctx.fillStyle = '#787774';
      ctx.font = '10px monospace';
      ctx.fillText(`${p.m}m`, px - 6, height - 14);
    });

  }, [directLoss, oppCost, degradationRate, solutionCost, loss3Months, loss6Months, loss12Months, loss24Months]);

  const blufPitch = `Dictamen Financiero BLUF:
1. El Statu Quo actual acumula una fuga de $${monthlyTotal.toLocaleString()} USD mensuales ($${directLoss.toLocaleString()} en fricción directa + $${oppCost.toLocaleString()} en costo de oportunidad).
2. Postergar esta decisión a 12 meses representa un Costo de Inacción (COI) de $${loss12Months.toLocaleString()} USD (${wasteMultiplier}x el costo total de la solución).
3. Con una inversión estimada de $${solutionCost.toLocaleString()} USD, el proyecto se amortiza en apenas ${paybackMonths} meses. No decidir hoy es la decisión más costosa para la organización.`;

  const copyBluf = () => {
    navigator.clipboard.writeText(blufPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <TrendingUp size={18} className="text-[#9F2F2D]" />
            Calculadora Universal del Costo de la Inacción (COI)
          </h3>
          <p className="text-xs text-[#787774] mt-0.5">Cuantificación matemática de pérdidas acumuladas frente al statu quo.</p>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FDEBEC] text-[#9F2F2D] border border-[#FAD4D6]">
          COI Model
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel de Sliders */}
        <div className="lg:col-span-5 space-y-4 bg-[#FBFBFA] p-5 rounded-lg border border-[#EAEAEA]">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#787774]">Pérdida Mensual Directa:</span>
              <span className="text-[#111111] font-bold">${directLoss.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="1000"
              max="80000"
              step="1000"
              value={directLoss}
              onChange={(e) => setDirectLoss(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#787774]">Costo de Oportunidad Mensual:</span>
              <span className="text-[#111111] font-bold">${oppCost.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="2000"
              max="100000"
              step="1000"
              value={oppCost}
              onChange={(e) => setOppCost(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#787774]">Degradación / Inflación del Problema:</span>
              <span className="text-[#111111] font-bold">{degradationRate}% mensual</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={degradationRate}
              onChange={(e) => setDegradationRate(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#787774]">Costo Estimado de la Solución:</span>
              <span className="text-[#346538] font-bold">${solutionCost.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="5000"
              max="150000"
              step="2500"
              value={solutionCost}
              onChange={(e) => setSolutionCost(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Métricas Clave */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#FFFFFF] p-3 rounded-md border border-[#EAEAEA]">
              <span className="text-[10px] text-[#787774] block font-mono uppercase tracking-wider">Fuga a 12 Meses</span>
              <span className="text-base font-bold font-mono text-[#9F2F2D]">${(loss12Months/1000).toFixed(0)}k USD</span>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-md border border-[#EAEAEA]">
              <span className="text-[10px] text-[#787774] block font-mono uppercase tracking-wider">Payback Period</span>
              <span className="text-base font-bold font-mono text-[#346538]">{paybackMonths} meses</span>
            </div>
          </div>
        </div>

        {/* Gráfico Canvas & Dictamen BLUF */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="bg-[#FAFAF9] p-3.5 rounded-lg border border-[#EAEAEA]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-mono font-medium text-[#111111]">Curva de Inacción vs Solución</span>
              <span className="text-[10px] font-mono text-[#787774]">Horizonte 24 Meses</span>
            </div>
            <canvas ref={canvasRef} width={500} height={190} className="w-full h-[190px] block rounded" />
          </div>

          {/* Caja Dictamen BLUF */}
          <div className="bg-[#FBFBFA] border border-[#EAEAEA] rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-[#9F2F2D]" />
                Dictamen Ejecutivo Socrático (BLUF / Minto)
              </span>
              <button
                onClick={copyBluf}
                className="flex items-center gap-1 text-[11px] font-mono bg-[#FFFFFF] hover:bg-[#F4F4F2] border border-[#EAEAEA] text-[#111111] px-2.5 py-1 rounded transition-colors"
              >
                {copied ? <Check size={12} className="text-[#346538]" /> : <Copy size={12} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs font-mono text-[#2F3437] leading-relaxed whitespace-pre-line bg-[#FFFFFF] p-3 rounded border border-[#EAEAEA]">
              {blufPitch}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
