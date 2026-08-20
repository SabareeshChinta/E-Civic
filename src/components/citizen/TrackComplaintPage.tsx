import React, { useState, useEffect } from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { CivicIssue } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import { VerticalTimeline } from '../common/VerticalTimeline.js';
import {
  Search,
  MapPin,
  Clock,
  Building,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertTriangle,
  UserCheck,
  FileText,
  Camera,
  ArrowLeft,
  ThumbsUp,
  TrendingUp,
  Users,
  Flame
} from 'lucide-react';

interface TrackComplaintPageProps {
  initialIssueId?: string;
  onSelectIssue?: (issue: CivicIssue) => void;
  onBack?: () => void;
}

export const TrackComplaintPage: React.FC<TrackComplaintPageProps> = ({ initialIssueId, onBack }) => {
  const { issues, verifyResolution, upvoteIssue } = useIssues();
  const { currentUser } = useAuth();
  const [searchId, setSearchId] = useState<string>(initialIssueId || 'CIV-2842');
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [isUpvoting, setIsUpvoting] = useState<boolean>(false);

  useEffect(() => {
    if (initialIssueId) {
      setSearchId(initialIssueId);
      const found = issues.find(i => i.id.toLowerCase() === initialIssueId.toLowerCase());
      if (found) setSelectedIssue(found);
    } else {
      const defaultIssue = issues.find(i => i.id === 'CIV-2842') || issues[0];
      if (defaultIssue) setSelectedIssue(defaultIssue);
    }
  }, [initialIssueId, issues]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toLowerCase();
    const found = issues.find(i => i.id.toLowerCase() === query || i.id.toLowerCase().includes(query));
    if (found) {
      setSelectedIssue(found);
    } else {
      setSelectedIssue(null);
    }
  };

  const handleUpvoteClick = async () => {
    if (!selectedIssue) return;
    setIsUpvoting(true);
    await upvoteIssue(selectedIssue.id);
    setIsUpvoting(false);
  };

  const currentUserId = currentUser?.id || 'user_citizen_aarav';
  const hasUpvoted = selectedIssue?.confirmations?.some(c => c.userId === currentUserId) || false;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Track a Complaint
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Search with your unique complaint reference number to view the live operational resolution lifecycle.
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-50 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="track-complaint-input"
            type="text"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            placeholder="Enter Complaint ID (e.g. CIV-2842, CIV-2841, CIV-2839...)"
            className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-4 py-2 text-xs font-mono font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-semibold shadow-xs transition"
        >
          Track Issue
        </button>
      </form>

      {/* Quick Complaint ID Pill Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 overflow-x-auto pb-1 no-scrollbar">
        <span className="font-semibold text-slate-700 shrink-0 text-[11px] sm:text-xs">Active Cases:</span>
        {issues.slice(0, 5).map(issue => (
          <button
            key={issue.id}
            onClick={() => {
              setSearchId(issue.id);
              setSelectedIssue(issue);
            }}
            className={`px-2 sm:px-2.5 py-1 rounded font-mono text-[11px] sm:text-xs border shrink-0 transition ${
              selectedIssue?.id === issue.id
                ? 'bg-teal-50 border-teal-700 text-teal-900 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            #{issue.id} ({issue.categoryName.split(' ')[0]})
          </button>
        ))}
      </div>

      {/* Issue Details & Operational Vertical Timeline */}
      {selectedIssue ? (
        <div className="space-y-5 sm:space-y-6">
          {/* Overview Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-sm text-teal-800">
                  #{selectedIssue.id}
                </span>
                <PriorityBadge level={selectedIssue.priorityLevel} score={selectedIssue.priorityScore} size="sm" />
                <StatusBadge status={selectedIssue.status} size="sm" />
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-mono">
                Reported: {new Date(selectedIssue.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">{selectedIssue.title}</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedIssue.description}</p>
            </div>

            {/* UPVOTE & COMMUNITY VERIFICATION BANNER */}
            <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-teal-950 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-700" />
                    Community Upvotes & Confirmations:
                  </span>
                  <span className="font-mono font-extrabold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-300 text-xs">
                    {selectedIssue.confirmationsCount} {selectedIssue.confirmationsCount === 1 ? 'Resident' : 'Residents'}
                  </span>
                </div>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  Upvoting signals that multiple citizens are affected. Each community upvote boosts the <strong>Priority Score</strong> and accelerates departmental dispatch.
                </p>
              </div>

              <button
                id="upvote-issue-btn"
                onClick={handleUpvoteClick}
                disabled={isUpvoting || selectedIssue.status === 'resolved' || selectedIssue.status === 'closed'}
                className={`px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition disabled:opacity-50 ${
                  hasUpvoted
                    ? 'bg-teal-800 text-white hover:bg-teal-900 ring-2 ring-teal-600/30'
                    : 'bg-white text-teal-900 border border-teal-300 hover:bg-teal-100/60'
                }`}
                title={hasUpvoted ? 'You have upvoted this issue (click to remove)' : 'Upvote to escalate priority'}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current' : ''}`} />
                <span>{hasUpvoted ? '✓ Upvoted (+1)' : '▲ Upvote Issue (+1)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Location</span>
                <span className="font-medium text-slate-900">{selectedIssue.location.address}</span>
                <span className="text-slate-500 block text-[11px]">{selectedIssue.location.ward}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Department</span>
                <span className="font-semibold text-teal-800">{selectedIssue.departmentName}</span>
                {selectedIssue.assignedOfficer && (
                  <span className="text-slate-500 block text-[11px]">Officer: {selectedIssue.assignedOfficer.name}</span>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">SLA Target</span>
                <span className="font-medium text-slate-900">
                  {selectedIssue.sla?.hoursRemaining > 0
                    ? `${selectedIssue.sla.hoursRemaining}h remaining`
                    : selectedIssue.status === 'resolved'
                    ? 'Completed on schedule'
                    : 'OVER SLA'}
                </span>
              </div>
            </div>
          </div>

          {/* Citizen Closed-Loop Resolution Verification Prompt */}
          {selectedIssue.status === 'resolved' && (
            <div className="bg-emerald-50 rounded-lg border border-emerald-300 p-4 sm:p-5 space-y-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Citizen Verification Audit
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                The municipal department has marked this work order as resolved. Has the problem actually been repaired on site?
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-1">
                <button
                  id="citizen-track-verify-yes"
                  onClick={() => verifyResolution(selectedIssue.id, 'yes')}
                  className="justify-center px-4 py-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Yes, Physical Fix Verified</span>
                </button>
                <button
                  id="citizen-track-verify-no"
                  onClick={() => verifyResolution(selectedIssue.id, 'no')}
                  className="justify-center px-4 py-2.5 rounded bg-white hover:bg-slate-50 text-rose-800 border border-rose-300 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>✕ No, Defect Still Exists</span>
                </button>
              </div>
            </div>
          )}

          {/* Vertical Operational Timeline */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              Operational Resolution Lifecycle Timeline
            </h3>

            <VerticalTimeline
              timeline={selectedIssue.timeline}
              currentStatus={selectedIssue.status}
              departmentName={selectedIssue.departmentName}
              assignedOfficerName={selectedIssue.assignedOfficer?.name}
              resolutionNotes={selectedIssue.resolution?.notes}
              afterImageUrl={selectedIssue.resolution?.afterImageUrl}
              beforeImageUrl={selectedIssue.resolution?.beforeImageUrl || selectedIssue.images[0]}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-8 sm:p-12 text-center text-slate-500 text-xs space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="font-semibold text-slate-800">No complaint found for ID "{searchId}"</p>
          <p>Please double-check your reference code or pick from the sample list above.</p>
        </div>
      )}
    </div>
  );
};
