import React from 'react';
import { PriorityBreakdown } from '../../types/index.js';
import { PriorityBadge } from './PriorityBadge.js';
import { ShieldCheck, Info, CheckCircle2, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

interface ExplainablePriorityCardProps {
  breakdown: PriorityBreakdown;
  confirmationsCount: number;
  duplicateCount?: number;
}

export const ExplainablePriorityCard: React.FC<ExplainablePriorityCardProps> = ({
  breakdown,
  confirmationsCount,
  duplicateCount = 0
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Transparent Priority Intelligence
            </span>
            <PriorityBadge level={breakdown.level} score={breakdown.score} size="sm" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time algorithmic scoring matrix calculated from 7 transparent civic metrics.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold font-mono text-blue-700">
            {breakdown.score}
          </span>
          <span className="text-xs text-slate-400 font-mono">/100</span>
        </div>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span className="flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3 text-blue-600" /> Community</span>
            <span className="font-mono text-blue-700 font-bold">+{breakdown.factors.confirmationsImpact} pts</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${Math.min(100, (breakdown.factors.confirmationsImpact / 20) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">{confirmationsCount} confirmations</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span className="flex items-center gap-1 font-semibold"><AlertTriangle className="w-3 h-3 text-rose-600" /> Safety Risk</span>
            <span className="font-mono text-rose-700 font-bold">+{breakdown.factors.safetyRiskImpact} pts</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-600 h-full rounded-full"
              style={{ width: `${Math.min(100, (breakdown.factors.safetyRiskImpact / 18) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Accident hazard</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span className="flex items-center gap-1 font-semibold"><TrendingUp className="w-3 h-3 text-amber-600" /> Traffic Density</span>
            <span className="font-mono text-amber-700 font-bold">+{breakdown.factors.trafficImpact} pts</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full"
              style={{ width: `${Math.min(100, (breakdown.factors.trafficImpact / 12) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Arterial corridor</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span className="flex items-center gap-1 font-semibold"><Clock className="w-3 h-3 text-purple-600" /> Recurrence</span>
            <span className="font-mono text-purple-700 font-bold">+{breakdown.factors.recurrenceImpact} pts</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full"
              style={{ width: `${Math.min(100, (breakdown.factors.recurrenceImpact / 15) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Sector history</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span className="flex items-center gap-1 font-semibold"><Info className="w-3 h-3 text-sky-600" /> Estimated Affected Population</span>
            <span className="font-mono text-sky-800 font-bold">~{breakdown.factors.affectedPopulationEstimate} citizens</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Calculated via municipal density models and transit corridor footprint.
          </p>
        </div>
      </div>

      {/* Explanations List ("Why this priority?") */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          Why this priority?
        </h4>
        <ul className="space-y-1.5">
          {breakdown.explanations.map((exp, idx) => (
            <li key={idx} className="flex items-start text-xs text-slate-700 gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>{exp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
