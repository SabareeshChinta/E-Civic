import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useIssues } from '../../context/IssueContext.js';
import {
  Building,
  Bell,
  User,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Menu,
  X,
  Home
} from 'lucide-react';

interface HeaderProps {
  onNavigateHome?: () => void;
  onToggleNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, onToggleNotifications }) => {
  const { currentRole, currentUser, switchUser, switchRole } = useAuth();
  const { notifications, markAllNotificationsAsRead, setSelectedIssue, issues } = useIssues();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (issueId?: string) => {
    if (issueId) {
      const found = issues.find(i => i.id === issueId);
      if (found) {
        setSelectedIssue(found);
      }
    }
    setIsNotifOpen(false);
  };

  const handleLogoOrHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      switchRole('citizen');
      setSelectedIssue(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Platform Title (Clickable to Home / Intro page) */}
          <div
            onClick={handleLogoOrHomeClick}
            className="flex items-center space-x-3 cursor-pointer group select-none"
            title="Go to Home / Intro Page"
          >
            <div className="w-8 h-8 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-sm tracking-wider group-hover:bg-teal-900 transition">
              EC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight text-slate-900 group-hover:text-teal-800 transition">
                  E-CIVIC
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-semibold">
                  MUNICIPAL PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                City Operations & Citizen Resolution System
              </p>
            </div>
          </div>

          {/* Center: Home Button & Quick Experience Switcher */}
          <div className="flex items-center space-x-2">
            {/* Direct Home Button */}
            <button
              id="header-home-btn"
              onClick={handleLogoOrHomeClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-700 hover:text-teal-800 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
              title="Return to Citizen Homepage"
            >
              <Home className="w-3.5 h-3.5 text-teal-700" />
              <span>Home</span>
            </button>

            {/* Experience Switcher (Citizen vs Department Operations) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
              <button
                onClick={() => switchRole('citizen')}
                className={`px-3 py-1 rounded font-medium transition ${
                  currentRole === 'citizen'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Citizen Portal
              </button>
              <button
                onClick={() => switchRole('officer')}
                className={`px-3 py-1 rounded font-medium transition ${
                  currentRole === 'officer'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                City Operations
              </button>
            </div>
          </div>

          {/* Right Actions: Profile Selector & Notifications */}
          <div className="flex items-center space-x-3">
            {/* Profile Switcher Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-700">
              <span className="text-slate-400 hidden md:inline text-[11px]">Profile:</span>
              <select
                value={currentUser?.id || 'user_citizen_aarav'}
                onChange={e => switchUser(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              >
                <option value="user_citizen_aarav">Aarav Sharma (Citizen · Ward 14)</option>
                <option value="user_officer_priya">Priya Mehta (Public Works Officer)</option>
                <option value="user_admin_rajesh">Municipal Admin (Operations HQ)</option>
              </select>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 relative"
                title="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-700 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      System Notifications
                    </span>
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-[11px] text-teal-700 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n.issueId)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                            !n.read ? 'bg-teal-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                          {n.issueId && (
                            <span className="inline-block mt-1 text-[10px] font-mono text-teal-800 font-semibold">
                              Inspect {n.issueId} →
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
