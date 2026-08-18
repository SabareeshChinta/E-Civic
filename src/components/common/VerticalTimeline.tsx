import React from 'react';
import { TimelineEvent, IssueStatus } from '../../types/index.js';
import {
  FileText,
  CheckCircle,
  UserCheck,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowDown
} from 'lucide-react';

interface VerticalTimelineProps {
  timeline: TimelineEvent[];
  currentStatus: IssueStatus;
  departmentName?: string;
  assignedOfficerName?: string;
  resolutionNotes?: string;
  afterImageUrl?: string;
  beforeImageUrl?: string;
}

interface StepDef {
  key: string;
  title: string;
  subtext: string;
  icon: React.ReactNode;
}

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  timeline = [],
  currentStatus,
  departmentName,
  assignedOfficerName,
  resolutionNotes,
  afterImageUrl,
  beforeImageUrl
}) => {
  const steps: StepDef[] = [
    {
      key: 'reported',
      title: 'REPORTED',
      subtext: 'Citizen filed issue with location and photo evidence.',
      icon: <FileText className="w-4 h-4" />
    },
    {
      key: 'verified',
      title: 'VERIFIED',
      subtext: 'Civic routing matrix verified location and triage category.',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      key: 'assigned',
      title: 'ASSIGNED',
      subtext: departmentName ? `Assigned to ${departmentName}${assignedOfficerName ? ` (${assignedOfficerName})` : ''}` : 'Routed to designated municipal department.',
      icon: <UserCheck className="w-4 h-4" />
    },
    {
      key: 'in_progress',
      title: 'IN PROGRESS',
      subtext: 'Field repair team dispatched with materials.',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      key: 'resolved',
      title: 'RESOLVED',
      subtext: resolutionNotes || 'Remediation completed and verified on site.',
      icon: <CheckCircle2 className="w-4 h-4" />
    }
  ];

  const getStepIndex = (status: IssueStatus): number => {
    switch (status) {
      case 'reported':
      case 'ai_analyzed':
        return 0;
      case 'under_review':
      case 'community_verified':
        return 1;
      case 'assigned':
        return 2;
      case 'in_progress':
      case 'requires_inspection':
        return 3;
      case 'resolved':
      case 'citizen_verified':
      case 'closed':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  const getTimelineEventForStep = (stepKey: string) => {
    if (stepKey === 'reported') return timeline.find(e => e.stage === 'reported');
    if (stepKey === 'verified') return timeline.find(e => e.stage === 'ai_analyzed' || e.stage === 'community_verified');
    if (stepKey === 'assigned') return timeline.find(e => e.stage === 'assigned');
    if (stepKey === 'in_progress') return timeline.find(e => e.stage === 'in_progress');
    if (stepKey === 'resolved') return timeline.find(e => e.stage === 'resolved' || e.stage === 'citizen_verified');
    return undefined;
  };

  return (
    <div className="py-2">
      <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const event = getTimelineEventForStep(step.key);

          return (
            <div key={step.key} className="relative">
              {/* Dot / Icon */}
              <div
                className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                  isCurrent
                    ? 'bg-teal-700 border-teal-800 text-white shadow-sm'
                    : isDone
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {step.icon}
              </div>

              {/* Step Content */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider font-mono ${
                        isCurrent
                          ? 'text-teal-800'
                          : isDone
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold uppercase">
                        Current Stage
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {event?.timestamp ? event.timestamp : isDone ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-normal leading-relaxed">
                  {event?.description || step.subtext}
                </p>

                {/* Specific details for Assigned step */}
                {step.key === 'assigned' && isDone && departmentName && (
                  <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200/80 text-slate-800">
                    <span className="font-semibold">Department:</span> {departmentName}
                    {assignedOfficerName && (
                      <span className="ml-3 text-slate-600 font-mono">
                        Officer: {assignedOfficerName}
                      </span>
                    )}
                  </div>
                )}

                {/* Specific details for Resolved step */}
                {step.key === 'resolved' && isDone && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    {resolutionNotes && (
                      <div className="text-xs bg-emerald-50/70 p-2.5 rounded border border-emerald-200 text-emerald-900">
                        <span className="font-semibold">Work Order Completion Log:</span> {resolutionNotes}
                      </div>
                    )}
                    {(afterImageUrl || beforeImageUrl) && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {beforeImageUrl && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                              Before Repair
                            </span>
                            <img
                              src={beforeImageUrl}
                              alt="Before repair"
                              className="w-full h-28 object-cover rounded border border-slate-200"
                            />
                          </div>
                        )}
                        {afterImageUrl && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">
                              After Repair (Verified)
                            </span>
                            <img
                              src={afterImageUrl}
                              alt="After repair"
                              className="w-full h-28 object-cover rounded border border-emerald-300"
                            />
                          </div>
                        )}
                      </div>
                    )}
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
