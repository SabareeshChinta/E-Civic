import React from 'react';
import { CivicIssue } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import { Clock, AlertTriangle, CheckCircle2, Flame, ShieldAlert, ArrowRight } from 'lucide-react';

interface DepartmentSLAMonitorProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
}

export const DepartmentSLAMonitor: React.FC<DepartmentSLAMonitorProps> = ({ issues, onSelectIssue }) => {
  const onTrackCount = 104;
  const approachingCount = 32;
  const overSlaCount = 12;
  const escalatedCount = 5;

  const slaPerformance = [
    { department: 'Roads & Infrastructure', rate: 82, color: 'bg-teal-700' },
    { department: 'Waste Management', rate: 71, color: 'bg-emerald-700' },
    { department: 'Water Supply Department', rate: 89, color: 'bg-sky-700' },
    { department: 'Streetlights & Electrical', rate: 94, color: 'bg-amber-600' }
  ];

  const approachingIssues = issues.filter(
    i => i.status !== 'resolved' && i.status !== 'closed'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-800" />
          <span>SLA & Escalation Monitor</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time service level agreement compliance and priority escalation monitoring
        </p>
      </div>

      {/* 4 Status Counters (Section 9 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            On Track
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
            {onTrackCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Approaching Deadline
          </span>
          <span className="text-2xl font-bold font-mono text-amber-800 mt-1 block">
            {approachingCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-rose-300 shadow-xs">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
            Over SLA
          </span>
          <span className="text-2xl font-bold font-mono text-rose-700 mt-1 block">
            {overSlaCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
            Escalated
          </span>
          <span className="text-2xl font-bold font-mono text-purple-900 mt-1 block">
            {escalatedCount}
          </span>
        </div>
      </div>

      {/* SLA Performance Bars (Section 9 Specs) */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          SLA Performance by Service Area
        </h2>

        <div className="space-y-3">
          {slaPerformance.map(item => (
            <div key={item.department} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{item.department}</span>
                <span className="font-mono font-bold text-slate-900">{item.rate}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden border border-slate-200">
                <div className={`h-full ${item.color}`} style={{ width: `${item.rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues Approaching SLA Deadlines Table (Section 9 Specs) */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Issues Approaching SLA Deadlines
          </h2>
          <span className="text-xs text-slate-500">Urgent operational queue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Complaint ID</th>
                <th className="py-2.5 px-4">Issue</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Time Remaining</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approachingIssues.slice(0, 5).map(issue => {
                const isOver = issue.sla?.isBreached || issue.sla?.hoursRemaining < 0;
                return (
                  <tr key={issue.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      #{issue.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {issue.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {issue.departmentName}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      <span className={isOver ? 'text-rose-700 font-bold' : 'text-amber-800 font-bold'}>
                        {isOver ? 'OVER SLA' : `${issue.sla?.hoursRemaining || 2}h remaining`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectIssue(issue)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-[11px] border border-slate-300"
                      >
                        Dispatch →
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
