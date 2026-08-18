import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { CivicIssue } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import { CivicMap } from '../common/CivicMap.js';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  MapPin,
  Search,
  ExternalLink,
  Users,
  Building
} from 'lucide-react';

interface CitizenDashboardProps {
  onOpenReport: () => void;
  onSelectIssue: (issue: CivicIssue) => void;
  onOpenTrack: (issueId: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onOpenReport,
  onSelectIssue,
  onOpenTrack
}) => {
  const { issues, confirmIssue } = useIssues();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'my_reports' | 'nearby_map'>('my_reports');

  const myReports = issues.filter(
    i => i.reporter.id === currentUser?.id || i.reporter.name === currentUser?.name
  );

  const openIssuesCount = myReports.filter(i => i.status !== 'resolved' && i.status !== 'closed').length;
  const resolvedCount = myReports.filter(i => i.status === 'resolved' || i.status === 'citizen_verified' || i.status === 'closed').length;
  const awaitingActionCount = myReports.filter(i => i.status === 'resolved' && !i.resolution?.citizenVotes?.some(v => v.userId === currentUser?.id)).length;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-5 sm:space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {currentUser?.name || 'Citizen'}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Ward 14 (Sector 14) • Reliability Index:{' '}
            <strong className="text-teal-800 font-mono">{currentUser?.reliabilityScore || 98}% Verified</strong>
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="w-full sm:w-auto justify-center px-4 py-2.5 rounded bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* 2. OVERVIEW METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            My Reports
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {myReports.length}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Open Issues
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-amber-800 mt-1 block">
            {openIssuesCount}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-800 mt-1 block">
            {resolvedCount}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
            Awaiting Action
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-teal-800 mt-1 block">
            {awaitingActionCount}
          </span>
        </div>
      </div>

      {/* 3. TABS: MY REPORTS vs NEARBY CIVIC ISSUES */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('my_reports')}
          className={`px-3 py-1.5 rounded font-semibold transition shrink-0 ${
            activeTab === 'my_reports'
              ? 'bg-teal-800 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          My Reports ({myReports.length})
        </button>

        <button
          onClick={() => setActiveTab('nearby_map')}
          className={`px-3 py-1.5 rounded font-semibold transition shrink-0 ${
            activeTab === 'nearby_map'
              ? 'bg-teal-800 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Nearby Issues & Map ({issues.length})
        </button>
      </div>

      {/* 4. TAB 1: MY REPORTS (Responsive Card stack on mobile, Table on desktop) */}
      {activeTab === 'my_reports' && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Submitted Grievances List
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-500">Tap row to track</span>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {myReports.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No reports submitted yet</div>
            ) : (
              myReports.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => onOpenTrack(issue.id)}
                  className="p-3.5 hover:bg-slate-50 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-800 text-xs">#{issue.id}</span>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                  <p className="font-semibold text-slate-900 text-xs line-clamp-1">{issue.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{issue.location.sector} • {issue.departmentName}</span>
                    <span className="font-semibold text-teal-800">Track →</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Complaint ID</th>
                  <th className="py-2.5 px-4">Issue</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Last Update</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myReports.map(issue => (
                  <tr
                    key={issue.id}
                    className="hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => onOpenTrack(issue.id)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      {issue.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">{issue.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{issue.categoryName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {issue.location.sector}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {issue.departmentName}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      Updated recently
                    </td>
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenTrack(issue.id)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-[11px] border border-slate-200 transition"
                      >
                        Timeline →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 2: NEARBY CIVIC ISSUES & MAP */}
      {activeTab === 'nearby_map' && (
        <div className="space-y-4">
          <CivicMap
            issues={issues}
            onSelectIssue={issue => onOpenTrack(issue.id)}
            height="360px"
          />

          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Nearby Community Issues Feed ({issues.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {issues.map(issue => (
                <div
                  key={issue.id}
                  className="p-3.5 rounded border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-2 bg-slate-50/50"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-teal-800">#{issue.id}</span>
                      <StatusBadge status={issue.status} size="sm" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{issue.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{issue.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">📍 {issue.location.sector}</span>
                    <button
                      onClick={() => onOpenTrack(issue.id)}
                      className="text-xs font-bold text-teal-800 hover:underline"
                    >
                      Track Case →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
