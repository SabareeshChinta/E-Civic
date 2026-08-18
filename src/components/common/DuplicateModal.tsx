import React from 'react';
import { CivicIssue } from '../../types/index.js';
import { useIssues } from '../../context/IssueContext.js';
import {
  Copy,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateMatch: {
    primaryMatch: CivicIssue;
    distanceMeters: number;
    similarityScore: number;
    matchReasons: string[];
    nearbyClusterCount: number;
  } | null;
  pendingDraft: any;
  onConfirmMerge: (existingIssueId: string) => void;
  onProceedAsNew: () => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  isOpen,
  onClose,
  duplicateMatch,
  pendingDraft,
  onConfirmMerge,
  onProceedAsNew
}) => {
  if (!isOpen || !duplicateMatch || !duplicateMatch.primaryMatch) return null;

  const existing = duplicateMatch.primaryMatch;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 text-white rounded-2xl border border-white/30">
              <Copy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-tight">
                  Similar Issue Found Nearby!
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 text-xs font-bold font-mono">
                  {duplicateMatch.similarityScore}% Match
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                AI Duplicate Clustering detected an active case within {duplicateMatch.distanceMeters}m of your coordinates.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* AI Match Factors */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs">
            <span className="font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Why this was flagged as a duplicate:
            </span>
            <ul className="space-y-1 text-slate-700">
              {duplicateMatch.matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Existing Active Case Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-700 font-mono">
                  Active Case #{existing.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                  {existing.categoryName}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {duplicateMatch.distanceMeters}m away
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 rounded-xl overflow-hidden border border-slate-200 h-28 bg-white">
                <img
                  src={existing.images[0]}
                  alt="Existing case"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{existing.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{existing.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <span className="flex items-center gap-1 text-blue-700 font-bold">
                    <Users className="w-3.5 h-3.5" /> {existing.confirmationsCount} confirmations
                  </span>
                  <span className="flex items-center gap-1 text-purple-700 font-semibold">
                    <Copy className="w-3.5 h-3.5" /> {existing.duplicateCount} merged
                  </span>
                  <span className="text-emerald-700 font-bold">
                    Priority: {existing.priorityScore}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded-xl text-xs text-slate-600">
            💡 <strong>Merging increases priority:</strong> Linking your report gives the municipal department concentrated community proof for faster work-order dispatch.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            id="submit-separate-issue-btn"
            onClick={onProceedAsNew}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 transition shadow-sm"
          >
            Submit as Separate Issue
          </button>
          <button
            id="link-to-existing-issue-btn"
            onClick={() => onConfirmMerge(existing.id)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 hover:from-blue-600 hover:to-sky-500 shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Link to Existing Issue (+1 Confirmation)
          </button>
        </div>
      </div>
    </div>
  );
};
