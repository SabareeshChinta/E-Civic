import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CivicIssue,
  Department,
  IssueCategory,
  NotificationItem,
  IssueStatus,
  AIInsight,
  PriorityQueueAction
} from '../types/index.js';
import { useAuth } from './AuthContext.js';

interface Filters {
  status: string;
  departmentId: string;
  categoryId: string;
  severity: string;
  priority: string;
  sector: string;
  search: string;
}

interface IssueContextType {
  issues: CivicIssue[];
  departments: Department[];
  categories: IssueCategory[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  selectedIssue: CivicIssue | null;
  setSelectedIssue: (issue: CivicIssue | null) => void;
  isLoading: boolean;
  isReportingModalOpen: boolean;
  setIsReportingModalOpen: (open: boolean) => void;
  isDuplicateModalOpen: boolean;
  setIsDuplicateModalOpen: (open: boolean) => void;
  pendingReportData: any | null;
  setPendingReportData: (data: any | null) => void;
  duplicateMatchData: any | null;
  setDuplicateMatchData: (data: any | null) => void;
  fetchIssues: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  createIssue: (issueData: any) => Promise<CivicIssue | null>;
  confirmIssue: (issueId: string, comment?: string, photoUrl?: string) => Promise<boolean>;
  assignOfficer: (issueId: string, officerId: string, officerName: string, department: string) => Promise<boolean>;
  updateStatus: (issueId: string, status: IssueStatus, notes?: string) => Promise<boolean>;
  resolveIssue: (issueId: string, resolvedBy: string, notes: string, afterImageUrl?: string) => Promise<boolean>;
  verifyResolution: (issueId: string, vote: 'yes' | 'no', comment?: string) => Promise<boolean>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  quickToast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const defaultFilters: Filters = {
  status: 'all',
  departmentId: 'all',
  categoryId: 'all',
  severity: 'all',
  priority: 'all',
  sector: 'all',
  search: '',
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & draft report states
  const [isReportingModalOpen, setIsReportingModalOpen] = useState<boolean>(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState<boolean>(false);
  const [pendingReportData, setPendingReportData] = useState<any | null>(null);
  const [duplicateMatchData, setDuplicateMatchData] = useState<any | null>(null);

  // Toast
  const [quickToast, setQuickToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setQuickToast({ message, type });
    setTimeout(() => setQuickToast(null), 4000);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    await Promise.all([fetchIssues(), fetchDepartments(), fetchCategories(), fetchNotifications()]);
    setIsLoading(false);
  };

  const fetchIssues = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.departmentId !== 'all') params.append('departmentId', filters.departmentId);
      if (filters.categoryId !== 'all') params.append('categoryId', filters.categoryId);
      if (filters.severity !== 'all') params.append('severity', filters.severity);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.sector !== 'all') params.append('sector', filters.sector);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`/api/issues?${params.toString()}`);
      if (res.ok) {
        const data: CivicIssue[] = await res.json();
        setIssues(data);
        // If selected issue is open, keep it in sync
        if (selectedIssue) {
          const fresh = data.find(i => i.id === selectedIssue.id);
          if (fresh) setSelectedIssue(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    }
  };

  // Re-fetch issues when filters change
  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/departments/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const url = currentUser ? `/api/notifications?userId=${currentUser.id}` : '/api/notifications';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const createIssue = async (issueData: any): Promise<CivicIssue | null> => {
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...issueData,
          reporter: {
            id: currentUser?.id || 'user_citizen_aarav',
            name: currentUser?.name || 'Aarav Sharma',
            avatar: currentUser?.avatar,
            reliabilityScore: currentUser?.reliabilityScore || 98
          }
        })
      });

      if (res.ok) {
        const created = await res.json();
        await fetchIssues();
        await fetchNotifications();
        showToast(
          created.isMerged
            ? `Report linked to active Case #${created.issue.id}! Confirmations increased.`
            : `Issue #${created.id} reported successfully! Dispatched to ${created.departmentName}.`,
          'success'
        );
        return created.issue || created;
      }
    } catch (err) {
      console.error('Failed to create issue:', err);
      showToast('Error creating report. Please try again.', 'error');
    }
    return null;
  };

  const confirmIssue = async (issueId: string, comment?: string, photoUrl?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/issues/${issueId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'user_citizen_aarav',
          userName: currentUser?.name || 'Aarav Sharma',
          userAvatar: currentUser?.avatar,
          userReliability: currentUser?.reliabilityScore || 95,
          comment: comment || 'Verified by nearby resident.',
          photoUrl
        })
      });

      if (res.ok) {
        const updated = await res.json();
        await fetchIssues();
        if (selectedIssue?.id === issueId) {
          setSelectedIssue(updated);
        }
        showToast(`Verified! Community confirmations now: ${updated.confirmationsCount} (Priority: ${updated.priorityScore}/100)`, 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Already confirmed by you', 'warning');
      }
    } catch (err) {
      console.error('Failed to confirm issue:', err);
      showToast('Error verifying issue', 'error');
    }
    return false;
  };

  const assignOfficer = async (issueId: string, officerId: string, officerName: string, department: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/issues/${issueId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId, officerName, department })
      });
      if (res.ok) {
        const updated = await res.json();
        await fetchIssues();
        if (selectedIssue?.id === issueId) setSelectedIssue(updated);
        showToast(`Case #${issueId} assigned to ${officerName}`, 'success');
        return true;
      }
    } catch (err) {
      console.error('Failed to assign officer:', err);
    }
    return false;
  };

  const updateStatus = async (issueId: string, status: IssueStatus, notes?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          actorName: currentUser?.name || 'Department Officer',
          notes
        })
      });
      if (res.ok) {
        const updated = await res.json();
        await fetchIssues();
        if (selectedIssue?.id === issueId) setSelectedIssue(updated);
        showToast(`Status updated to ${status.replace('_', ' ').toUpperCase()}`, 'info');
        return true;
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
    return false;
  };

  const resolveIssue = async (issueId: string, resolvedBy: string, notes: string, afterImageUrl?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/issues/${issueId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolvedBy,
          notes,
          afterImageUrl: afterImageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        await fetchIssues();
        if (selectedIssue?.id === issueId) setSelectedIssue(updated);
        showToast(`Issue #${issueId} marked RESOLVED with on-site photographic evidence! Awaiting citizen verification.`, 'success');
        return true;
      }
    } catch (err) {
      console.error('Failed to resolve issue:', err);
    }
    return false;
  };

  const verifyResolution = async (issueId: string, vote: 'yes' | 'no', comment?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/issues/${issueId}/verify-resolution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'user_citizen_aarav',
          userName: currentUser?.name || 'Aarav Sharma',
          vote,
          comment
        })
      });
      if (res.ok) {
        const updated = await res.json();
        await fetchIssues();
        if (selectedIssue?.id === issueId) setSelectedIssue(updated);
        if (vote === 'yes') {
          showToast(`Resolution verified by citizen! Case #${issueId} successfully closed.`, 'success');
        } else {
          showToast(`Dispute registered. Case #${issueId} automatically reopened for field inspection!`, 'warning');
        }
        return true;
      }
    } catch (err) {
      console.error('Failed to verify resolution:', err);
    }
    return false;
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      if (currentUser) {
        await fetch('/api/notifications/mark-all-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id })
        });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/issues/reset-demo', { method: 'POST' });
      if (res.ok) {
        await fetchInitialData();
        showToast('Demo data reset to clean initial state!', 'info');
      }
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <IssueContext.Provider
      value={{
        issues,
        departments,
        categories,
        notifications,
        unreadNotificationsCount,
        filters,
        setFilters,
        selectedIssue,
        setSelectedIssue,
        isLoading,
        isReportingModalOpen,
        setIsReportingModalOpen,
        isDuplicateModalOpen,
        setIsDuplicateModalOpen,
        pendingReportData,
        setPendingReportData,
        duplicateMatchData,
        setDuplicateMatchData,
        fetchIssues,
        fetchDepartments,
        fetchNotifications,
        createIssue,
        confirmIssue,
        assignOfficer,
        updateStatus,
        resolveIssue,
        verifyResolution,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        quickToast,
        showToast
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
