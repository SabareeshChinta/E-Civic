import React from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { CivicIssue } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import { FileText, Plus, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

interface MyReportsProps {
  onSelectIssue: (issue: CivicIssue) => void;
  onOpenReportModal: () => void;
}

export const MyReports: React.FC<MyReportsProps> = ({ onSelectIssue, onOpenReportModal }) => {
  const { issues } = useIssues();
  const { currentUser } = useAuth();

  const myReports = issues.filter(
    i => i.reporter.id === currentUser?.id || i.reporter.name === currentUser?.name
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-700" />
            My Submitted Reports ({myReports.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track status progression, officer assignment, resolution evidence, and verify completed fixes.
          </p>
        </div>
        <button
          onClick={onOpenReportModal}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Report New Issue</span>
        </button>
      </div>

      {myReports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
          <p className="text-slate-500 text-sm">You haven't reported any civic issues yet.</p>
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Report an issue now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myReports.map(issue => {
            const isResolvedPending =
              issue.status === 'resolved' &&
              !issue.resolution?.citizenVotes?.some(v => v.userId === currentUser?.id);

            return (
              <div
                key={issue.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-300 hover:shadow-md transition shadow-sm"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={issue.images[0]} alt={issue.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-700">#{issue.id}</span>
                      <StatusBadge status={issue.status} size="sm" />
                      <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
                    </div>
                    <h3
                      onClick={() => onSelectIssue(issue)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer"
                    >
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      📍 {issue.location.address} • {issue.categoryName} • Routed to{' '}
                      <strong className="text-slate-800">{issue.departmentName}</strong>
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Reported: {new Date(issue.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {isResolvedPending ? (
                    <button
                      onClick={() => onSelectIssue(issue)}
                      className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-pulse"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verify Fix Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectIssue(issue)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <span>Case Timeline & Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
