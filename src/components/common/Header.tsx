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
  ArrowLeft,
  Menu,
  X,
  Home,
  LogIn,
  LogOut,
  KeyRound
} from 'lucide-react';

interface HeaderProps {
  onNavigateHome?: () => void;
  onNavigateBack?: () => void;
  onOpenLogin?: () => void;
  canGoBack?: boolean;
  onToggleNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onNavigateBack,
  onOpenLogin,
  canGoBack = false,
  onToggleNotifications
}) => {
  const { currentRole, currentUser, switchUser, switchRole, isAuthenticated, logout } = useAuth();
  const { notifications, markAllNotificationsRead, setSelectedIssue, issues } = useIssues();
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

  const handleBackClick = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      handleLogoOrHomeClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Logo & Platform Title (Clickable to Home / Intro page) */}
          <div
            onClick={handleLogoOrHomeClick}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group select-none shrink-0"
            title="Go to Home / Intro Page"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider group-hover:bg-teal-900 transition shrink-0">
              EC
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 group-hover:text-teal-800 transition">
                  E-CIVIC
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1 sm:px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-semibold hidden xs:inline-block">
                  MUNICIPAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block">
                City Operations & Citizen Resolution System
              </p>
            </div>
          </div>

          {/* Center: Back Button, Home Button & Quick Experience Switcher */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Back Button */}
            <button
              id="header-back-btn"
              onClick={handleBackClick}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-teal-800 hover:bg-slate-100 transition border border-slate-200"
              title="Go Back"
            >
              <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Direct Home Button */}
            <button
              id="header-home-btn"
              onClick={handleLogoOrHomeClick}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-teal-800 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
              title="Return to Citizen Homepage"
            >
              <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Home</span>
            </button>

            {/* Experience Switcher (Citizen vs Department Operations) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-[11px] sm:text-xs">
              <button
                onClick={() => switchRole('citizen')}
                className={`px-2 sm:px-3 py-1 rounded font-medium transition ${
                  currentRole === 'citizen'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="sm:hidden">Citizen</span>
                <span className="hidden sm:inline">Citizen Portal</span>
              </button>
              <button
                onClick={() => switchRole('officer')}
                className={`px-2 sm:px-3 py-1 rounded font-medium transition ${
                  currentRole === 'officer'
                    ? 'bg-teal-800 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="sm:hidden">Operations</span>
                <span className="hidden sm:inline">City Operations</span>
              </button>
            </div>
          </div>

          {/* Right Actions: Profile Selector, Login/Sign In, & Notifications */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Profile Switcher Dropdown */}
            <div className="flex items-center space-x-1 text-xs text-slate-700">
              <span className="text-slate-400 hidden lg:inline text-[11px]">Profile:</span>
              <select
                value={currentUser?.id || 'user_citizen_aarav'}
                onChange={e => switchUser(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-700 max-w-[90px] xs:max-w-[120px] sm:max-w-none"
              >
                <option value="user_citizen_aarav">Aarav (Citizen)</option>
                <option value="user_officer_priya">Priya (Public Works)</option>
                <option value="user_admin_rajesh">Admin (HQ)</option>
              </select>
            </div>

            {/* Sign In / Sign Out Button */}
            {onOpenLogin && (
              <button
                id="header-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-[11px] sm:text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100 transition"
                title="Login with Test Credentials"
              >
                <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-800" />
                <span className="hidden xs:inline">Login</span>
              </button>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 relative"
                title="View Notifications"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-700 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel (Responsive) */}
              {isNotifOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] max-w-sm bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      System Notifications
                    </span>
                    <button
                      onClick={() => markAllNotificationsRead()}
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
