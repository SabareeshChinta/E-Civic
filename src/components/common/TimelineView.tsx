import React from 'react';
import { TimelineEvent, IssueStatus } from '../../types/index.js';
import {
  FileText,
  Cpu,
  Users,
  UserCheck,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface TimelineViewProps {
  events: TimelineEvent[];
  currentStatus: IssueStatus;
}

interface StandardStep {
  key: IssueStatus;
  title: string;
  defaultDesc: string;
  icon: React.ReactNode;
}

const LIFECYCLE_STEPS: StandardStep[] = [
  {
    key: 'reported',
    title: 'Reported',
    defaultDesc: 'Citizen uploaded report with geo-tag and photo evidence.',
    icon: <FileText className="w-3.5 h-3.5" />
  },
  {
    key: 'ai_analyzed',
    title: 'AI Analyzed',
    defaultDesc: 'Vision & NLP classified category, severity, and calculated priority score.',
    icon: <Cpu className="w-3.5 h-3.5" />
  },
  {
    key: 'community_verified',
    title: 'Community Verified',
    defaultDesc: 'Nearby citizens verified report and duplicate reports merged.',
    icon: <Users className="w-3.5 h-3.5" />
  },
  {
    key: 'assigned',
    title: 'Assigned',
    defaultDesc: 'Auto-routed to departmental authority and lead officer assigned.',
    icon: <UserCheck className="w-3.5 h-3.5" />
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    defaultDesc: 'Field crew dispatched and active remediation underway.',
    icon: <Wrench className="w-3.5 h-3.5" />
  },
  {
    key: 'resolved',
    title: 'Resolved',
    defaultDesc: 'Authority uploaded completion evidence and marked resolved.',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  },
  {
    key: 'citizen_verified',
    title: 'Citizen Verification',
    defaultDesc: 'Citizen confirmed physical fix on site. Case closed.',
    icon: <ShieldCheck className="w-3.5 h-3.5" />
  }
];

export const TimelineView: React.FC<TimelineViewProps> = ({ events, currentStatus }) => {
  const statusIndexMap: Record<IssueStatus, number> = {
    reported: 0,
    ai_analyzed: 1,
    community_verified: 2,
    under_review: 2,
    assigned: 3,
    in_progress: 4,
    requires_inspection: 4,
    resolved: 5,
    citizen_verified: 6,
    closed: 6,
    duplicate: 2,
    rejected: 0
  };

  const activeIndex = statusIndexMap[currentStatus] ?? 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Issue Resolution Lifecycle Timeline
        </h3>
        <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          Step {Math.min(activeIndex + 1, 7)} of 7
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {LIFECYCLE_STEPS.map((step, idx) => {
          const isDone = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          const loggedEvent = events.find(e => {
            if (step.key === 'reported' && e.stage === 'reported') return true;
            if (step.key === 'ai_analyzed' && e.stage === 'ai_analyzed') return true;
            if (step.key === 'community_verified' && (e.stage === 'community_verified' || e.stage === 'under_review')) return true;
            if (step.key === 'assigned' && e.stage === 'assigned') return true;
            if (step.key === 'in_progress' && (e.stage === 'in_progress' || e.stage === 'requires_inspection')) return true;
            if (step.key === 'resolved' && e.stage === 'resolved') return true;
            if (step.key === 'citizen_verified' && (e.stage === 'citizen_verified' || e.stage === 'closed')) return true;
            return false;
          });

          return (
            <div key={step.key} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  isCurrent
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30'
                    : isDone
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="ml-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-blue-700'
                        : isDone
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  {loggedEvent?.timestamp && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(loggedEvent.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}{' '}
                      {new Date(loggedEvent.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
                <p className={`text-[11px] mt-0.5 ${isDone ? 'text-slate-600' : 'text-slate-400'}`}>
                  {loggedEvent ? loggedEvent.description : step.defaultDesc}
                </p>
                {loggedEvent && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                      By: {loggedEvent.actorName} ({loggedEvent.actorRole})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
