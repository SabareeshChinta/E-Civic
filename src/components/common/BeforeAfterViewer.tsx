import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';

interface BeforeAfterViewerProps {
  beforeUrl?: string;
  afterUrl?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforeUrl,
  afterUrl,
  resolvedAt,
  resolvedBy,
  notes
}) => {
  const [activeView, setActiveView] = useState<'split' | 'before' | 'after'>('split');

  const defaultBefore =
    beforeUrl ||
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const defaultAfter =
    afterUrl ||
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl p-5 border border-emerald-300 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">
              Resolution Photographic Evidence
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified field repair upload by <strong className="text-slate-800">{resolvedBy || 'Department Officer'}</strong>.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveView('split')}
            className={`px-3 py-1 rounded-lg transition ${
              activeView === 'split' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveView('before')}
            className={`px-3 py-1 rounded-lg transition ${
              activeView === 'before' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setActiveView('after')}
            className={`px-3 py-1 rounded-lg transition ${
              activeView === 'after' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            After Repair
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeView === 'split' || activeView === 'before') && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
            <img
              src={defaultBefore}
              alt="Before resolution"
              className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> BEFORE REPAIR
            </div>
          </div>
        )}

        {(activeView === 'split' || activeView === 'after') && (
          <div className="relative rounded-xl overflow-hidden border border-emerald-300 group bg-slate-50 shadow-sm">
            <img
              src={defaultAfter}
              alt="After resolution"
              className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> AFTER REPAIR (RESOLVED)
            </div>
          </div>
        )}
      </div>

      {/* Completion notes */}
      {notes && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="font-bold text-slate-800">Remediation Log: </span>
          <span className="text-slate-600">{notes}</span>
          {resolvedAt && (
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Timestamp: {new Date(resolvedAt).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
