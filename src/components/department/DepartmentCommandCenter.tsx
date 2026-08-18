import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { CivicIssue } from '../../types/index.js';
import { DepartmentSidebar, DeptTab } from './DepartmentSidebar.js';
import { DepartmentOverview } from './DepartmentOverview.js';
import { DepartmentIssueDetail } from './DepartmentIssueDetail.js';
import { DepartmentSLAMonitor } from './DepartmentSLAMonitor.js';
import { DepartmentAnalytics } from './DepartmentAnalytics.js';
import { DepartmentComparison } from './DepartmentComparison.js';
import { CivicMap } from '../common/CivicMap.js';

interface DepartmentCommandCenterProps {
  onSelectIssue?: (issue: CivicIssue) => void;
}

export const DepartmentCommandCenter: React.FC<DepartmentCommandCenterProps> = () => {
  const { issues, selectedIssue, setSelectedIssue } = useIssues();
  const [activeTab, setActiveTab] = useState<DeptTab>('overview');

  const openIssuesCount = issues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length;
  const slaOverCount = issues.filter(i => i.sla?.isBreached || i.sla?.hoursRemaining < 0).length;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)] bg-[#f8fafc]">
      {/* Sidebar Navigation */}
      <DepartmentSidebar
        activeTab={activeTab}
        onSelectTab={tab => {
          setSelectedIssue(null);
          setActiveTab(tab);
        }}
        openIssuesCount={openIssuesCount}
        slaOverCount={slaOverCount}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
        {selectedIssue ? (
          <DepartmentIssueDetail
            issue={selectedIssue}
            onBack={() => setSelectedIssue(null)}
          />
        ) : (
          <>
            {activeTab === 'overview' && (
              <DepartmentOverview
                issues={issues}
                onSelectIssue={issue => setSelectedIssue(issue)}
              />
            )}

            {activeTab === 'issues' && (
              <DepartmentOverview
                issues={issues}
                onSelectIssue={issue => setSelectedIssue(issue)}
              />
            )}

            {activeTab === 'map' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    GIS Operations & Ward Distribution Map
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Spatial clustering of active municipal work orders across city wards
                  </p>
                </div>
                <CivicMap
                  issues={issues}
                  onSelectIssue={issue => setSelectedIssue(issue)}
                  height="540px"
                />
              </div>
            )}

            {activeTab === 'departments' && <DepartmentComparison />}

            {activeTab === 'analytics' && <DepartmentAnalytics />}

            {activeTab === 'sla' && (
              <DepartmentSLAMonitor
                issues={issues}
                onSelectIssue={issue => setSelectedIssue(issue)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
