import React from 'react';
import {
  LayoutDashboard,
  Layers,
  MapPin,
  Building2,
  BarChart3,
  Clock,
  Settings,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export type DeptTab = 'overview' | 'issues' | 'map' | 'departments' | 'analytics' | 'sla' | 'settings';

interface DepartmentSidebarProps {
  activeTab: DeptTab;
  onSelectTab: (tab: DeptTab) => void;
  openIssuesCount: number;
  slaOverCount: number;
}

export const DepartmentSidebar: React.FC<DepartmentSidebarProps> = ({
  activeTab,
  onSelectTab,
  openIssuesCount,
  slaOverCount
}) => {
  const { currentUser } = useAuth();

  const navItems: { id: DeptTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'issues', label: 'Issues Queue', icon: <Layers className="w-4 h-4" />, badge: openIssuesCount },
    { id: 'map', label: 'GIS Operations Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sla', label: 'SLA Monitor', icon: <Clock className="w-4 h-4" />, badge: slaOverCount, badgeColor: 'bg-rose-600 text-white' }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)] border-r border-slate-800">
      <div className="p-4 space-y-6">
        {/* Top Header Label */}
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>CITY OPERATIONS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Live civic issue management
          </p>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1 text-xs">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition font-medium ${
                  isActive
                    ? 'bg-teal-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={isActive ? 'text-teal-200' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Officer Profile Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
            {currentUser?.name.charAt(0) || 'P'}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-white truncate">{currentUser?.name || 'Priya Mehta'}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser?.departmentName || 'Public Works'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
