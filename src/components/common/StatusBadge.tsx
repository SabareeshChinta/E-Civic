import React from 'react';
import { IssueStatus } from '../../types/index.js';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const getStatusConfig = (status: IssueStatus) => {
    switch (status) {
      case 'resolved':
      case 'citizen_verified':
      case 'closed':
        return {
          label: status === 'citizen_verified' ? 'Verified Resolved' : 'Resolved',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium',
          dot: 'bg-emerald-600'
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          classes: 'bg-amber-50 text-amber-900 border-amber-300 font-medium',
          dot: 'bg-amber-600'
        };
      case 'assigned':
      case 'under_review':
      case 'community_verified':
        return {
          label: status === 'assigned' ? 'Assigned' : 'Verified',
          classes: 'bg-blue-50 text-blue-900 border-blue-300 font-medium',
          dot: 'bg-blue-600'
        };
      case 'requires_inspection':
        return {
          label: 'Inspection Needed',
          classes: 'bg-orange-50 text-orange-900 border-orange-300 font-medium',
          dot: 'bg-orange-600'
        };
      case 'duplicate':
        return {
          label: 'Merged',
          classes: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
          dot: 'bg-slate-500'
        };
      case 'reported':
      case 'ai_analyzed':
      default:
        return {
          label: 'Reported',
          classes: 'bg-slate-100 text-slate-800 border-slate-300 font-medium',
          dot: 'bg-slate-600'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border ${config.classes} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
