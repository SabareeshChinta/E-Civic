import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useIssues } from '../../context/IssueContext.js';
import {
  User,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  Users,
  MapPin,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const { issues } = useIssues();

  const myReports = issues.filter(
    i => i.reporter.id === currentUser?.id || i.reporter.name === currentUser?.name
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-blue-600/30 shrink-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {currentUser?.name}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase">
                  {currentUser?.role}
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {currentUser?.area || 'Sector 14, Central District'} ({currentUser?.ward || 'Ward 14'})
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {currentUser?.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {currentUser?.phone}</span>
              </div>
            </div>
          </div>

          {/* Citizen Reliability Score Gauge */}
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-right sm:text-center w-full sm:w-auto shadow-sm">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Citizen Reliability Index
            </span>
            <div className="flex items-center justify-end sm:justify-center gap-1 mt-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl font-black font-mono text-emerald-800">
                {currentUser?.reliabilityScore || 98}%
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">High Trust Verified Tier</span>
          </div>
        </div>

        {/* Contribution Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Reports Logged
            </span>
            <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
              {currentUser?.reportsCount || myReports.length || 8}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-sky-600" /> Confirmations
            </span>
            <span className="text-xl font-black font-mono text-sky-700 mt-1 block">
              {currentUser?.confirmationsCount || 43}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Fixes
            </span>
            <span className="text-xl font-black font-mono text-emerald-700 mt-1 block">
              {currentUser?.resolutionsVerified || 14}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-600" /> Civic Rank
            </span>
            <span className="text-xl font-black text-amber-700 mt-1 block">
              Active Guardian
            </span>
          </div>
        </div>

        {/* Why Reliability Matters Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Transparent Reliability Criteria
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Your reliability score is calculated based on accurate geolocation matching, photo verification integrity, verified community confirmations, and consistent audit track record. High-reliability citizen reports are prioritized faster by municipal dispatch algorithms.
          </p>
        </div>
      </div>
    </div>
  );
};
