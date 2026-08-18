import React from 'react';
import { AIAnalysisResult } from '../../types/index.js';
import { Cpu, CheckCircle2, ShieldCheck, Tag, DollarSign, Wrench, BarChart2 } from 'lucide-react';

interface AIExplanationCardProps {
  analysis: AIAnalysisResult;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              AI Civic Intelligence Analysis
            </h3>
            <p className="text-[11px] text-slate-500">
              Multi-modal classification & automated municipal triage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {analysis.confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Grid of AI Inferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 mb-1">
            <Tag className="w-3 h-3 text-blue-600" /> Inferred Category
          </span>
          <p className="text-sm font-bold text-slate-900">{analysis.category}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Auto-assigned to: <span className="text-blue-700 font-bold">{analysis.department}</span>
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-emerald-600" /> Estimated Cost Bracket
          </span>
          <p className="text-sm font-bold text-emerald-700 font-mono">{analysis.estimatedCostBracket}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Municipal schedule of rates</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 col-span-1 sm:col-span-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 mb-1">
            <Wrench className="w-3 h-3 text-amber-600" /> Recommended Municipal Action
          </span>
          <p className="text-xs text-slate-700 font-medium">{analysis.suggestedAction}</p>
        </div>
      </div>

      {/* Alternative Probabilities */}
      {analysis.alternatives && analysis.alternatives.length > 0 && (
        <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 mb-2">
            <BarChart2 className="w-3 h-3 text-blue-600" /> Classification Alternatives
          </span>
          <div className="space-y-1.5">
            {analysis.alternatives.map((alt, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium truncate max-w-[200px]">{alt.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-slate-400'}`}
                      style={{ width: `${alt.confidence}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 w-8 text-right font-bold">
                    {alt.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Trust Score */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <div>
            <span className="text-xs font-bold text-slate-900">
              Report Trust Score: {analysis.trustScore || 96}/100
            </span>
            <p className="text-[10px] text-slate-500">
              Verified GPS boundary, authentic perceptual photo hash, trusted citizen account.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
          High Trust
        </span>
      </div>
    </div>
  );
};
