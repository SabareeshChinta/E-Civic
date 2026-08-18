import React, { useState } from 'react';
import { CivicIssue } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import {
  Layers,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Flame
} from 'lucide-react';

interface DepartmentOverviewProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
}

export const DepartmentOverview: React.FC<DepartmentOverviewProps> = ({
  issues,
  onSelectIssue
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // KPI Metrics (Section 6 Specs)
  const openCount = 148;
  const inProgressCount = 72;
  const overSlaCount = 12;
  const resolvedTodayCount = 94;

  const filteredIssues = issues.filter(issue => {
    if (selectedDept !== 'all' && issue.departmentId !== selectedDept) return false;
    if (selectedWard !== 'all' && issue.location.ward !== selectedWard) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.location.address.toLowerCase().includes(q) ||
        issue.location.sector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 sm:pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>CITY OPERATIONS</span>
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
              Command
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Live civic issue management and departmental dispatch
          </p>
        </div>
      </div>

      {/* 2. TOP METRIC COUNTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Open Issues
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {openCount}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-amber-800 mt-1 block">
            {inProgressCount}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-rose-300 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Over SLA
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-rose-700 mt-1 block">
            {overSlaCount}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Resolved Today
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-800 mt-1 block">
            {resolvedTodayCount}
          </span>
        </div>
      </div>

      {/* 3. OPERATIONAL ISSUE QUEUE */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs space-y-0">
        {/* Table Filter Controls */}
        <div className="p-3 sm:p-3.5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center space-x-2 flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search ID, title, street..."
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 sm:py-1 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar pb-0.5">
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1.5 sm:py-1 text-[11px] sm:text-xs text-slate-800 font-medium shrink-0"
            >
              <option value="all">All Depts</option>
              <option value="dept_public_works">Public Works</option>
              <option value="dept_sanitation">Sanitation</option>
              <option value="dept_water_drainage">Water & Drainage</option>
              <option value="dept_electrical">Electrical</option>
              <option value="dept_traffic">Traffic & Signage</option>
              <option value="dept_parks">Parks & Public Spaces</option>
            </select>

            <select
              value={selectedWard}
              onChange={e => setSelectedWard(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1.5 sm:py-1 text-[11px] sm:text-xs text-slate-800 font-medium shrink-0"
            >
              <option value="all">All Wards</option>
              <option value="Ward 14">Ward 14</option>
              <option value="Ward 08">Ward 08</option>
              <option value="Ward 21">Ward 21</option>
              <option value="Ward 03">Ward 03</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1.5 sm:py-1 text-[11px] sm:text-xs text-slate-800 font-medium shrink-0"
            >
              <option value="all">All Status</option>
              <option value="reported">Reported</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Mobile View: Card Stack */}
        <div className="block lg:hidden divide-y divide-slate-100">
          {filteredIssues.map((issue, idx) => {
            const isOverSla = issue.sla?.isBreached || issue.sla?.hoursRemaining < 0;
            const slaText = isOverSla
              ? 'OVER SLA'
              : issue.status === 'resolved'
              ? 'Completed'
              : `${issue.sla?.hoursRemaining || 4}h remaining`;

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className={`p-3.5 hover:bg-slate-50 transition cursor-pointer space-y-2 ${
                  isOverSla ? 'bg-rose-50/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-teal-800">#{issue.id}</span>
                    <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
                  </div>
                  <StatusBadge status={issue.status} size="sm" />
                </div>

                <p className="font-semibold text-slate-900 text-xs line-clamp-1">{issue.title}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{issue.location.ward} • {issue.departmentName}</span>
                  <span className={isOverSla ? 'text-rose-700 font-bold font-mono' : 'font-mono text-slate-600'}>
                    {slaText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Issue</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Ward</th>
                <th className="py-2.5 px-3">Reported</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">SLA</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((issue, idx) => {
                const isOverSla = issue.sla?.isBreached || issue.sla?.hoursRemaining < 0;
                const slaText = isOverSla
                  ? 'OVER SLA'
                  : issue.status === 'resolved'
                  ? 'Completed'
                  : `${issue.sla?.hoursRemaining || 4}h remaining`;

                return (
                  <tr
                    key={issue.id}
                    className={`hover:bg-slate-50/80 transition cursor-pointer ${
                      isOverSla ? 'bg-rose-50/20' : ''
                    }`}
                    onClick={() => onSelectIssue(issue)}
                  >
                    <td className="py-2.5 px-3">
                      <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-[11px] text-teal-800">#{issue.id}</div>
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">{issue.title}</div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {issue.categoryName}
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {issue.location.ward}
                    </td>

                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {idx === 0 ? '18 min ago' : idx === 1 ? '42 min ago' : idx === 2 ? '1h ago' : '3h ago'}
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      {issue.departmentName}
                    </td>

                    <td className="py-2.5 px-3">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <span
                        className={`font-semibold ${
                          isOverSla
                            ? 'text-rose-700 font-bold'
                            : issue.status === 'resolved'
                            ? 'text-emerald-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {slaText}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectIssue(issue)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-800 hover:text-white text-slate-800 font-medium text-[11px] border border-slate-300 transition"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
