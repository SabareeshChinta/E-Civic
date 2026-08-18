import React from 'react';
import { CivicIssue } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  Search,
  ArrowRight,
  Shield,
  Hammer,
  Trash2,
  Lightbulb,
  Droplets,
  Building2,
  Signpost
} from 'lucide-react';

interface CitizenLandingProps {
  issues: CivicIssue[];
  onOpenReport: () => void;
  onOpenTrack: (issueId?: string) => void;
  onSelectIssue: (issue: CivicIssue) => void;
}

export const CitizenLanding: React.FC<CitizenLandingProps> = ({
  issues,
  onOpenReport,
  onOpenTrack,
  onSelectIssue
}) => {
  const categories = [
    { name: 'Road & Potholes', icon: <Hammer className="w-5 h-5 text-teal-700" />, desc: 'Potholes, broken roads, damaged pavements' },
    { name: 'Garbage & Waste', icon: <Trash2 className="w-5 h-5 text-emerald-700" />, desc: 'Uncollected trash, overflowing bins, street litter' },
    { name: 'Streetlights', icon: <Lightbulb className="w-5 h-5 text-amber-700" />, desc: 'Non-functioning streetlamps, dark stretches' },
    { name: 'Water & Drainage', icon: <Droplets className="w-5 h-5 text-sky-700" />, desc: 'Pipeline leaks, waterlogging, clogged drains' },
    { name: 'Public Spaces', icon: <Building2 className="w-5 h-5 text-slate-700" />, desc: 'Broken park benches, damaged walkways' },
    { name: 'Traffic & Signage', icon: <Signpost className="w-5 h-5 text-orange-700" />, desc: 'Broken traffic signals, missing signboards' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* 1. HERO SECTION */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-10 shadow-xs space-y-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          Municipal Civic Grievance System
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Report it. Track it. Get it resolved.
        </h1>

        <p className="text-slate-600 text-base max-w-2xl leading-relaxed">
          Report potholes, garbage accumulation, broken streetlights, water issues and other civic problems directly to the responsible department.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            id="landing-report-cta"
            onClick={onOpenReport}
            className="px-5 py-2.5 rounded bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>

          <button
            id="landing-track-cta"
            onClick={() => onOpenTrack()}
            className="px-5 py-2.5 rounded bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-300 flex items-center gap-2 shadow-xs transition"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Track a Complaint</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT LIVE CIVIC OVERVIEW (DEMO DATA) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold uppercase tracking-wider text-slate-700">
            Live Civic Overview
          </span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
              Reports Today
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
              1,284
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider block">
              Resolved
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
              932
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-amber-700 tracking-wider block">
              In Progress
            </span>
            <span className="text-2xl font-bold font-mono text-amber-800 mt-1 block">
              248
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
              Avg. Response
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
              6h 42m
            </span>
          </div>
        </div>
      </div>

      {/* 3. RECENT CIVIC ACTIVITY TABLE */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Recent Civic Activity
          </h2>
          <span className="text-xs text-slate-500">Live operational feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Complaint ID</th>
                <th className="py-2.5 px-4">Issue Description</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.slice(0, 5).map(issue => (
                <tr key={issue.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {issue.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                    {issue.title}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {issue.location.sector}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {issue.departmentName}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenTrack(issue.id)}
                      className="text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                    >
                      Track Timeline →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CIVIC CATEGORIES DIRECTORY */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Civic Categories Directory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={onOpenReport}
              className="bg-white p-4 rounded-lg border border-slate-200 hover:border-teal-700 cursor-pointer transition flex items-start space-x-3 shadow-xs"
            >
              <div className="p-2 rounded bg-slate-50 border border-slate-200 shrink-0">
                {cat.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
