import React, { useState } from 'react';
import { CivicIssue, IssueStatus } from '../../types/index.js';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import { ExplainablePriorityCard } from '../common/ExplainablePriorityCard.js';
import { AIExplanationCard } from '../common/AIExplanationCard.js';
import { TimelineView } from '../common/TimelineView.js';
import { BeforeAfterViewer } from '../common/BeforeAfterViewer.js';
import {
  X,
  MapPin,
  Users,
  Copy,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  AlertOctagon,
  UserCheck,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Camera,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  const {
    assignOfficer,
    updateStatus,
    resolveIssue,
    verifyResolution,
    confirmIssue,
    showToast
  } = useIssues();
  const { currentUser, currentRole } = useAuth();

  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [resolutionNotes, setResolutionNotes] = useState<string>(
    'Pavement hot-mix asphalt patching completed and compacted to municipal standard grade.'
  );
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'
  );

  if (!issue) return null;

  const isResolved =
    issue.status === 'resolved' ||
    issue.status === 'citizen_verified' ||
    issue.status === 'closed';

  const userConfirmed = issue.confirmations.some(c => c.userId === currentUser?.id);

  const handleResolveSubmit = async () => {
    await resolveIssue(
      issue.id,
      currentUser?.name ? `${currentUser.name} (${currentUser.departmentName || 'Officer'})` : 'Priya Mehta (Roads & Infra)',
      resolutionNotes,
      afterPhotoUrl
    );
    setIsResolving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-black bg-white/20 px-3 py-1 rounded-xl border border-white/30 text-white">
              #{issue.id}
            </span>
            <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="md" />
            <StatusBadge status={issue.status} size="md" />
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Title & Location Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{issue.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> {issue.location.address} ({issue.location.sector})
              </span>
              <span>• Ward: <strong>{issue.location.ward}</strong></span>
              <span>• Dept: <strong className="text-blue-700">{issue.departmentName}</strong></span>
              <span>• Reported by: <strong>{issue.reporter.name}</strong> (Reliability: {issue.reporter.reliabilityScore}%)</span>
            </div>
          </div>

          {/* TWO COLUMN WORKFLOW LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN (7 Cols): Visual Evidence, Description, Community Verifications, Timeline */}
            <div className="lg:col-span-7 space-y-6">
              {/* If resolved: Show Before & After Viewer */}
              {isResolved && issue.resolution ? (
                <BeforeAfterViewer
                  beforeUrl={issue.resolution.beforeImageUrl || issue.images[0]}
                  afterUrl={issue.resolution.afterImageUrl}
                  resolvedAt={issue.resolution.resolvedAt}
                  resolvedBy={issue.resolution.resolvedBy}
                  notes={issue.resolution.notes}
                />
              ) : (
                /* Primary Evidence Image */
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-72 shadow-sm">
                  <img
                    src={issue.images[0]}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-slate-800 font-mono border border-slate-200 shadow-sm font-bold">
                    📍 Lat: {issue.location.lat.toFixed(4)}, Lng: {issue.location.lng.toFixed(4)}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Citizen Statement & Problem Details
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{issue.description}</p>
              </div>

              {/* Community Verifications & Merged Duplicate Reports */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Community Verifications ({issue.confirmationsCount})
                    </h3>
                  </div>
                  <span className="text-xs text-blue-700 font-bold font-mono">
                    👥 +{issue.priorityBreakdown?.factors?.confirmationsImpact || 20} pts Priority
                  </span>
                </div>

                {/* Confirmations List */}
                <div className="space-y-2.5">
                  {issue.confirmations.map(conf => (
                    <div
                      key={conf.id}
                      className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                        {conf.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{conf.userName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(conf.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{conf.comment}</p>
                        {conf.photoUrl && (
                          <div className="mt-2 w-24 h-16 rounded-xl overflow-hidden border border-slate-200">
                            <img src={conf.photoUrl} alt="Supporting proof" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Merged Duplicates List */}
                {issue.mergedReports && issue.mergedReports.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5" />
                      Merged Duplicate Reports ({issue.mergedReports.length})
                    </span>
                    <div className="space-y-1.5">
                      {issue.mergedReports.map(dup => (
                        <div
                          key={dup.id}
                          className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs flex items-center justify-between text-slate-700"
                        >
                          <div>
                            <span className="font-mono font-bold text-purple-700">{dup.id}</span>
                            <span className="text-slate-500 ml-2 font-medium">by {dup.reporterName}</span>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{dup.description}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 font-mono">{dup.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lifecycle Timeline */}
              <TimelineView events={issue.timeline} currentStatus={issue.status} />
            </div>

            {/* RIGHT COLUMN (5 Cols): AI Intelligence, Priority Card, Actions & Closed-Loop Verification */}
            <div className="lg:col-span-5 space-y-5">
              {/* AI Classification Card */}
              <AIExplanationCard analysis={issue.aiAnalysis} />

              {/* Explainable Priority Breakdown Card (Requirement #9) */}
              <ExplainablePriorityCard
                breakdown={issue.priorityBreakdown}
                confirmationsCount={issue.confirmationsCount}
                duplicateCount={issue.duplicateCount}
              />

              {/* REQUIREMENT #14: CITIZEN CLOSED-LOOP RESOLUTION VERIFICATION */}
              {issue.status === 'resolved' && (
                <div className="bg-emerald-50 p-5 rounded-3xl border-2 border-emerald-300 space-y-3 shadow-md animate-in zoom-in-95">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                      Has this issue actually been resolved?
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Municipal authority marked this work order as completed. As a nearby citizen, please audit the physical repair on site.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      id="citizen-verify-yes-btn"
                      onClick={() => verifyResolution(issue.id, 'yes')}
                      className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition transform active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✓ Yes, Resolved</span>
                    </button>
                    <button
                      id="citizen-verify-no-btn"
                      onClick={() => verifyResolution(issue.id, 'no')}
                      className="py-2.5 px-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition transform active:scale-95"
                    >
                      <X className="w-4 h-4" />
                      <span>✕ No, Still Exists</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CITIZEN CONFIRMATION ACTION */}
              {!isResolved && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    Community Action
                  </h4>
                  <button
                    onClick={() => confirmIssue(issue.id)}
                    disabled={userConfirmed}
                    className={`w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                      userConfirmed
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{userConfirmed ? '✓ Confirmed by You' : 'Confirm This Issue (+1 Vote)'}</span>
                  </button>
                </div>
              )}

              {/* AUTHORITY / OFFICER ACTION PANEL */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-600" />
                  Department Officer Actions
                </h4>

                <div className="space-y-2">
                  {/* Assign Officer */}
                  <button
                    onClick={() =>
                      assignOfficer(
                        issue.id,
                        currentUser?.id || 'user_officer_priya',
                        currentUser?.name || 'Priya Mehta',
                        currentUser?.departmentName || 'Roads & Infrastructure'
                      )
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Assign to Officer ({currentUser?.name || 'Priya Mehta'})</span>
                  </button>

                  {/* Mark In Progress */}
                  <button
                    onClick={() => updateStatus(issue.id, 'in_progress', 'Field repair crew deployed on site.')}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <span>Mark as "In Progress" (Deploy Crew)</span>
                  </button>

                  {/* Request Inspection */}
                  <button
                    onClick={() =>
                      updateStatus(
                        issue.id,
                        'requires_inspection',
                        'Supervisory engineering inspection requested for structural verification.'
                      )
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                    <span>Request Engineering Inspection</span>
                  </button>

                  {/* Resolve Issue Form Trigger */}
                  {!isResolving ? (
                    <button
                      id="officer-resolve-modal-btn"
                      onClick={() => setIsResolving(true)}
                      className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolve Issue & Upload After-Photo</span>
                    </button>
                  ) : (
                    /* Resolution Form */
                    <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-300 space-y-3 animate-in fade-in">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                        Upload Resolution Proof
                      </span>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1 font-semibold">After-Repair Photo URL</label>
                        <input
                          type="text"
                          value={afterPhotoUrl}
                          onChange={e => setAfterPhotoUrl(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1 font-semibold">Remediation Notes</label>
                        <textarea
                          rows={2}
                          value={resolutionNotes}
                          onChange={e => setResolutionNotes(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setIsResolving(false)}
                          className="w-1/3 py-2 bg-slate-200 text-slate-700 text-xs rounded-xl font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          id="submit-resolution-proof-btn"
                          onClick={handleResolveSubmit}
                          className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm"
                        >
                          Confirm Resolved
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
