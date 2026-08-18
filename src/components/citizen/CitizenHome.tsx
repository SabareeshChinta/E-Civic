import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { CivicMap } from '../common/CivicMap.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import {
  Plus,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Filter,
  Search,
  Clock,
  Building2,
  TrendingUp
} from 'lucide-react';
import { CivicIssue } from '../../types/index.js';

interface CitizenHomeProps {
  onOpenReportModal: () => void;
  onSelectIssue: (issue: CivicIssue) => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  onOpenReportModal,
  onSelectIssue
}) => {
  const { issues, confirmIssue, showToast } = useIssues();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalReports = 12483 + issues.length;
  const activeReports = issues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length;
  const resolvedReports = issues.filter(i => i.status === 'resolved' || i.status === 'citizen_verified' || i.status === 'closed').length;
  const communityConfirmations = issues.reduce((acc, curr) => acc + curr.confirmationsCount, 1840);

  const filteredIssues = issues.filter(issue => {
    if (selectedCategory !== 'all' && issue.categoryId !== selectedCategory) return false;
    if (selectedSector !== 'all' && !issue.location.sector.includes(selectedSector)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.location.sector.toLowerCase().includes(q) ||
        issue.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. HERO SECTION (Deep Navy & Sapphire GovTech Gradient Banner) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border border-slate-800 shadow-xl p-8 sm:p-10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Crowdsourced Civic Intelligence (SIH25031)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            See a problem in your city?<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300">
              Report it in seconds.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Our multi-modal AI classifies the damage, detects spatial duplicates, transparently computes priority, and routes directly to the municipal authority for verified remediation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              id="citizen-hero-report-btn"
              onClick={onOpenReportModal}
              className="px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition transform active:scale-95"
            >
              <Plus className="w-5 h-5 font-bold" />
              <span>+ REPORT AN ISSUE</span>
            </button>
            <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              9,960+ verified civic resolutions citywide
            </span>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Total Reports</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-white mt-1 block">
              {totalReports.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Active Cases</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 mt-1 block">
              {activeReports}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Resolved & Verified</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 mt-1 block">
              {resolvedReports.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">Community Confirmations</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-sky-200 mt-1 block">
              {communityConfirmations.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. "YOUR AREA" GIS MAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-700" />
              Live Civic Map — Sector Risk Heatmaps & Active Cases
            </h2>
            <p className="text-xs text-slate-500">
              Interactive municipal GIS map showing sector boundaries, recurrence risk, and severity pins.
            </p>
          </div>
          <button
            onClick={onOpenReportModal}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            + Report in this zone →
          </button>
        </div>
        <CivicMap
          issues={issues}
          onSelectIssue={onSelectIssue}
          onSelectSector={sectorName => setSelectedSector(sectorName)}
          height="420px"
        />
      </div>

      {/* 3. NEARBY CIVIC ISSUES FEED */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              Nearby Civic Issues ({filteredIssues.length})
            </h3>
            <p className="text-xs text-slate-500">
              Help your neighborhood by verifying active issues or confirming completed physical fixes.
            </p>
          </div>

          {/* Category & Sector Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedSector('all'); }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedCategory === 'all' && selectedSector === 'all'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Cases
            </button>
            <button
              onClick={() => setSelectedCategory('cat_road_damage')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedCategory === 'cat_road_damage'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Road Damage
            </button>
            <button
              onClick={() => setSelectedCategory('cat_garbage')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedCategory === 'cat_garbage'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Garbage
            </button>
            <button
              onClick={() => setSelectedCategory('cat_water_leak')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedCategory === 'cat_water_leak'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Water Leaks
            </button>
          </div>
        </div>

        {/* Issue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIssues.map(issue => {
            const isResolved = issue.status === 'resolved' || issue.status === 'citizen_verified';
            const userConfirmed = issue.confirmations.some(c => c.userId === currentUser?.id);

            return (
              <div
                key={issue.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition duration-200 overflow-hidden shadow-sm flex flex-col group"
              >
                {/* Photo & Badges */}
                <div
                  className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => onSelectIssue(issue)}
                >
                  <img
                    src={issue.images[0]}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                  <div className="absolute bottom-2 left-2.5 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 border border-slate-200 shadow-sm">
                    📍 {issue.location.sector}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-mono text-blue-700 font-bold">#{issue.id}</span>
                      <span className="font-medium">{issue.categoryName}</span>
                    </div>
                    <h4
                      onClick={() => onSelectIssue(issue)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer line-clamp-1 transition"
                    >
                      {issue.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {/* Crowdsourcing Stats */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-blue-700">
                      <Users className="w-3.5 h-3.5" />
                      {issue.confirmationsCount} verified
                    </span>
                    {issue.duplicateCount > 0 && (
                      <span className="text-[11px] text-purple-700 font-semibold">
                        {issue.duplicateCount} merged reports
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    {isResolved ? (
                      <button
                        onClick={() => onSelectIssue(issue)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Verify Resolution</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (userConfirmed) {
                            showToast('You have already confirmed this report', 'info');
                          } else {
                            confirmIssue(issue.id);
                          }
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                          userConfirmed
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{userConfirmed ? '✓ Confirmed by You' : 'Confirm Issue (+1)'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => onSelectIssue(issue)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition shrink-0"
                      title="Inspect case details"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
