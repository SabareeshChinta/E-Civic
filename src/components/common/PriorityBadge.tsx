import React from 'react';
import { PriorityLevel } from '../../types/index.js';

interface PriorityBadgeProps {
  level: PriorityLevel;
  score?: number;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ level, score, size = 'md' }) => {
  const getStyle = (lvl: PriorityLevel) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
      case 'HIGH':
        return 'bg-amber-50 text-amber-900 border-amber-300 font-semibold';
      case 'MEDIUM':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
      case 'LOW':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 font-medium';
    }
  };

  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1 rounded border font-mono uppercase tracking-wider ${getStyle(level)} ${sizeClass}`}>
      <span>{level}</span>
      {score !== undefined && (
        <span className="text-[10px] opacity-75">({score})</span>
      )}
    </span>
  );
};
