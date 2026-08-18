import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, MapPin, Building2 } from 'lucide-react';

export const DepartmentAnalytics: React.FC = () => {
  const wardPerformance = [
    { ward: 'Ward 08', rate: 91, count: 182, status: 'Optimal' },
    { ward: 'Ward 14', rate: 84, count: 245, status: 'Attention' },
    { ward: 'Ward 21', rate: 76, count: 134, status: 'Action Required' },
    { ward: 'Ward 03', rate: 94, count: 110, status: 'Optimal' }
  ];

  const categoryBreakdown = [
    { name: 'Road & Potholes', count: 142, pct: 32 },
    { name: 'Garbage & Waste', count: 120, pct: 27 },
    { name: 'Water & Drainage', count: 85, pct: 19 },
    { name: 'Streetlights', count: 54, pct: 12 },
    { name: 'Public Spaces', count: 28, pct: 6 },
    { name: 'Traffic & Signage', count: 18, pct: 4 }
  ];

  const weeklyVolume = [
    { day: 'Mon', reported: 24, resolved: 22 },
    { day: 'Tue', reported: 31, resolved: 29 },
    { day: 'Wed', reported: 28, resolved: 26 },
    { day: 'Thu', reported: 35, resolved: 30 },
    { day: 'Fri', reported: 40, resolved: 38 },
    { day: 'Sat', reported: 22, resolved: 25 },
    { day: 'Sun', reported: 16, resolved: 18 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-800" />
          <span>Municipal Analytics & Performance Telemetry</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Executive operations summary, ward-level resolution rates, and SLA compliance metrics
        </p>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Overall Resolution Rate
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
            86.4%
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Avg. Resolution Time
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            18.2 <span className="text-xs font-normal text-slate-500">hours</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            SLA Compliance
          </span>
          <span className="text-2xl font-bold font-mono text-teal-800 mt-1 block">
            88.2%
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Weekly Complaints Resolved
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            188 <span className="text-xs font-normal text-slate-500">cases</span>
          </span>
        </div>
      </div>

      {/* Grid: Ward Performance & Category Volume */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WARD PERFORMANCE (Section 10 Specs) */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Ward Performance Breakdown
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">Citywide Wards</span>
          </div>

          <div className="space-y-3">
            {wardPerformance.map(w => (
              <div key={w.ward} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{w.ward}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px] font-mono">{w.count} logged</span>
                    <span className="font-mono font-bold text-teal-800">{w.rate}% resolved</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden border border-slate-200">
                  <div
                    className={`h-full ${w.rate >= 90 ? 'bg-emerald-600' : w.rate >= 80 ? 'bg-teal-700' : 'bg-amber-600'}`}
                    style={{ width: `${w.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ISSUES BY CATEGORY (Section 10 Specs) */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Issues by Category
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">Volume Distribution</span>
          </div>

          <div className="space-y-2.5">
            {categoryBreakdown.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-200/80">
                <span className="font-medium text-slate-800">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">{cat.count} cases</span>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WEEKLY ISSUE VOLUME REPORT */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Weekly Issue Intake vs Resolution Throughput
          </h2>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Reported</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-700" /> Resolved</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {weeklyVolume.map(day => (
            <div key={day.day} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">{day.day}</span>
              <div className="text-[11px] text-slate-600">
                <span>{day.reported}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="font-bold text-teal-800">{day.resolved}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
