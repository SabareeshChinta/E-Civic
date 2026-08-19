import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.js';
import { useIssues } from './context/IssueContext.js';
import { Header } from './components/common/Header.js';
import { CitizenLanding } from './components/citizen/CitizenLanding.js';
import { ReportIssueFlow } from './components/citizen/ReportIssueFlow.js';
import { TrackComplaintPage } from './components/citizen/TrackComplaintPage.js';
import { CitizenDashboard } from './components/citizen/CitizenDashboard.js';
import { CivicMap } from './components/common/CivicMap.js';
import { DepartmentCommandCenter } from './components/department/DepartmentCommandCenter.js';
import { LoginPage } from './components/auth/LoginPage.js';
import {
  Home,
  PlusCircle,
  FileText,
  MapPin,
  Search,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ArrowLeft,
  LogIn
} from 'lucide-react';
import { CivicIssue } from './types/index.js';

type CitizenNavTab = 'home' | 'report' | 'my_reports' | 'nearby' | 'track';

export const App: React.FC = () => {
  const { currentRole, currentUser, switchRole, isAuthenticated, logout } = useAuth();
  const {
    issues,
    selectedIssue,
    setSelectedIssue,
    quickToast
  } = useIssues();

  const [citizenTab, setCitizenTab] = useState<CitizenNavTab>('home');
  const [tabHistory, setTabHistory] = useState<CitizenNavTab[]>([]);
  const [trackedIssueId, setTrackedIssueId] = useState<string>('CIV-2842');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const navigateToTab = (newTab: CitizenNavTab) => {
    setIsLoginOpen(false);
    if (citizenTab !== newTab) {
      setTabHistory(prev => [...prev, citizenTab]);
      setCitizenTab(newTab);
    }
  };

  const handleNavigateHome = () => {
    setIsLoginOpen(false);
    switchRole('citizen');
    setSelectedIssue(null);
    setTabHistory([]);
    setCitizenTab('home');
  };

  const handleNavigateBack = () => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
      return;
    }

    if (selectedIssue) {
      setSelectedIssue(null);
      return;
    }

    if (tabHistory.length > 0) {
      const prev = tabHistory[tabHistory.length - 1];
      setTabHistory(tabHistory.slice(0, -1));
      setCitizenTab(prev);
    } else {
      setCitizenTab('home');
    }
  };

  const handleOpenReport = () => {
    navigateToTab('report');
  };

  const handleOpenTrack = (issueId?: string) => {
    if (issueId) {
      setTrackedIssueId(issueId);
    }
    navigateToTab('track');
  };

  const handleReportSubmitted = (newIssueId: string) => {
    setTrackedIssueId(newIssueId);
    navigateToTab('track');
  };

  const showLoginPage = !isAuthenticated || isLoginOpen;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* 1. TOP HEADER (Unified Navigation, Back Button, Home Button, Profile Switcher & Login) */}
      <Header
        onNavigateHome={handleNavigateHome}
        onNavigateBack={handleNavigateBack}
        onOpenLogin={() => setIsLoginOpen(true)}
        canGoBack={isLoginOpen || citizenTab !== 'home' || selectedIssue !== null || tabHistory.length > 0}
      />

      {/* 2. CITIZEN SUB-NAVIGATION BAR (Only when logged in) */}
      {!showLoginPage && currentRole === 'citizen' && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-3 sm:px-6">
            <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar text-xs">
              <button
                id="nav-citizen-home"
                onClick={() => navigateToTab('home')}
                className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition shrink-0 ${
                  citizenTab === 'home'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                id="nav-citizen-report"
                onClick={() => navigateToTab('report')}
                className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition shrink-0 ${
                  citizenTab === 'report'
                    ? 'bg-teal-800 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </button>

              <button
                id="nav-citizen-myreports"
                onClick={() => navigateToTab('my_reports')}
                className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition shrink-0 ${
                  citizenTab === 'my_reports'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Reports</span>
              </button>

              <button
                id="nav-citizen-nearby"
                onClick={() => navigateToTab('nearby')}
                className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition shrink-0 ${
                  citizenTab === 'nearby'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Nearby Issues</span>
              </button>

              <button
                id="nav-citizen-track"
                onClick={() => navigateToTab('track')}
                className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition shrink-0 ${
                  citizenTab === 'track'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Complaint</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1">
        {/* LOGIN SCREEN (Shown on first landing or when opened) */}
        {showLoginPage ? (
          <LoginPage
            onSuccess={() => setIsLoginOpen(false)}
            onCancel={isAuthenticated ? () => setIsLoginOpen(false) : undefined}
            initialRole={currentRole}
          />
        ) : (
          <>
            {/* CITIZEN PORTAL */}
            {currentRole === 'citizen' && (
              <>
                {citizenTab === 'home' && (
                  <CitizenLanding
                    issues={issues}
                    onOpenReport={handleOpenReport}
                    onOpenTrack={handleOpenTrack}
                    onSelectIssue={issue => handleOpenTrack(issue.id)}
                  />
                )}

                {citizenTab === 'report' && (
                  <ReportIssueFlow
                    onCancel={handleNavigateBack}
                    onSuccess={handleReportSubmitted}
                  />
                )}

                {citizenTab === 'my_reports' && (
                  <CitizenDashboard
                    onOpenReport={handleOpenReport}
                    onSelectIssue={issue => handleOpenTrack(issue.id)}
                    onOpenTrack={handleOpenTrack}
                  />
                )}

                {citizenTab === 'nearby' && (
                  <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                          Nearby Civic Issues Map
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Filter by status and category across your municipal ward
                        </p>
                      </div>
                      <button
                        onClick={handleNavigateBack}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                    </div>
                    <CivicMap
                      issues={issues}
                      onSelectIssue={issue => handleOpenTrack(issue.id)}
                      height="500px"
                    />
                  </div>
                )}

                {citizenTab === 'track' && (
                  <TrackComplaintPage
                    initialIssueId={trackedIssueId}
                    onSelectIssue={issue => setTrackedIssueId(issue.id)}
                    onBack={handleNavigateBack}
                  />
                )}
              </>
            )}

            {/* CITY OPERATIONS / DEPARTMENT DASHBOARD */}
            {(currentRole === 'officer' || currentRole === 'admin') && (
              <DepartmentCommandCenter />
            )}
          </>
        )}
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            © 2026 E-Civic Municipal Platform • Smart India Hackathon (SIH25031)
          </p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
            <span>Public Works</span>
            <span>•</span>
            <span>Sanitation</span>
            <span>•</span>
            <span>Water & Drainage</span>
            <span>•</span>
            <span>Electrical</span>
            <span>•</span>
            <span>SLA Monitoring</span>
          </div>
        </div>
      </footer>

      {/* Global Toast Notification */}
      {quickToast && (
        <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top duration-150">
          <div
            className={`px-4 py-2.5 rounded shadow-md border text-xs font-semibold flex items-center space-x-2 ${
              quickToast.type === 'success'
                ? 'bg-emerald-800 text-white border-emerald-900'
                : quickToast.type === 'warning'
                ? 'bg-amber-800 text-white border-amber-900'
                : quickToast.type === 'error'
                ? 'bg-rose-800 text-white border-rose-900'
                : 'bg-slate-900 text-white border-slate-950'
            }`}
          >
            {quickToast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {quickToast.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
            {quickToast.type === 'info' && <Info className="w-3.5 h-3.5" />}
            <span>{quickToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
