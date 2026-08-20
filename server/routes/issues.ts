import { Router } from 'express';
import { db } from '../db/database.js';
import { AIService } from '../services/aiService.js';
import { CivicIssue, TimelineEvent, PriorityLevel, IssueStatus } from '../../src/types/index.js';

const router = Router();

// GET all issues with rich filters
router.get('/', (req, res) => {
  const { status, departmentId, categoryId, severity, priority, sector, reporterId, search } = req.query;
  const issues = db.getIssues({
    status: status as string,
    departmentId: departmentId as string,
    categoryId: categoryId as string,
    severity: severity as string,
    priority: priority as string,
    sector: sector as string,
    reporterId: reporterId as string,
    search: search as string,
  });
  return res.json(issues);
});

// GET single issue by ID
router.get('/:id', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Civic issue not found' });
  }
  return res.json(issue);
});

// POST AI Analysis preview for draft report
router.post('/analyze', (req, res) => {
  const { description, imageTag } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required for AI analysis' });
  }

  const analysis = AIService.classifyIssue(description, imageTag);
  return res.json(analysis);
});

// POST Check duplicates against existing active reports
router.post('/check-duplicates', (req, res) => {
  const { lat, lng, description, categoryId } = req.body;
  if (!lat || !lng || !description) {
    return res.status(400).json({ error: 'Location and description are required' });
  }

  const allIssues = db.getIssues();
  const dupResult = AIService.findDuplicates({ lat, lng, description, categoryId }, allIssues);
  return res.json(dupResult);
});

// POST Create new Civic Issue
router.post('/', (req, res) => {
  const {
    title,
    description,
    categoryId,
    categoryName,
    departmentId,
    departmentName,
    location,
    images = [],
    reporter,
    mergeWithExistingId
  } = req.body;

  if (!description || !location) {
    return res.status(400).json({ error: 'Missing required report fields' });
  }

  // If citizen chose to merge with existing duplicate report:
  if (mergeWithExistingId) {
    const existing = db.getIssueById(mergeWithExistingId);
    if (existing) {
      const mergedReports = existing.mergedReports || [];
      const newMerged = {
        id: `CIV-${Math.floor(10000 + Math.random() * 90000)}`,
        reporterName: reporter?.name || 'Citizen',
        createdAt: new Date().toISOString(),
        distance: 'Direct coordinate match',
        description: description
      };
      mergedReports.push(newMerged);

      const newConfirmationsCount = existing.confirmationsCount + 1;
      const newDuplicateCount = (existing.duplicateCount || 0) + 1;

      // Re-calculate priority
      const priorityBreakdown = AIService.calculatePriority({
        categorySeverity: existing.severity,
        confirmationsCount: newConfirmationsCount,
        duplicateCount: newDuplicateCount,
        locationAddress: existing.location.address,
        locationSector: existing.location.sector,
        isSafetyHazard: existing.aiAnalysis.safetyHazard,
        unresolvedHours: (Date.now() - new Date(existing.createdAt).getTime()) / (3600 * 1000),
        isRecurring: existing.recurrenceInfo?.isRecurring
      });

      const updated = db.updateIssue(existing.id, {
        confirmationsCount: newConfirmationsCount,
        duplicateCount: newDuplicateCount,
        mergedReports,
        priorityScore: priorityBreakdown.score,
        priorityLevel: priorityBreakdown.level,
        priorityBreakdown,
        updatedAt: new Date().toISOString()
      });

      // Send notification
      db.addNotification({
        id: `notif_${Date.now()}`,
        userId: reporter?.id || 'user_citizen_aarav',
        title: `Report Linked to Case #${existing.id}`,
        message: `Your report was merged with active case #${existing.id}. Community confirmations increased to ${newConfirmationsCount} and Priority Score raised to ${priorityBreakdown.score}/100.`,
        type: 'success',
        issueId: existing.id,
        read: false,
        createdAt: new Date().toISOString()
      });

      return res.status(200).json({
        isMerged: true,
        issue: updated,
        message: 'Successfully linked to existing issue!'
      });
    }
  }

  // Run AI classification
  const aiAnalysis = AIService.classifyIssue(description);

  // Recurrence intelligence for this sector
  const allIssues = db.getIssues();
  const recurrenceInfo = AIService.analyzeRecurrence(location.sector || 'Central', aiAnalysis.categoryId, allIssues);

  // Calculate priority breakdown
  const priorityBreakdown = AIService.calculatePriority({
    categorySeverity: aiAnalysis.severity,
    confirmationsCount: 1,
    duplicateCount: 0,
    locationAddress: location.address,
    locationSector: location.sector,
    isSafetyHazard: aiAnalysis.safetyHazard,
    unresolvedHours: 0.1,
    isRecurring: recurrenceInfo.isRecurring
  });

  const issueId = `CIV-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  const dept = db.getDepartmentById(departmentId || aiAnalysis.departmentId);
  const targetSlaHours = dept ? dept.slaHoursDefault : 24;

  const initialTimeline: TimelineEvent[] = [
    {
      id: `tl_init_1`,
      stage: 'reported',
      title: 'Issue Reported by Citizen',
      description: `${reporter?.name || 'Citizen'} submitted report with photo and geolocation.`,
      timestamp: now,
      actorName: reporter?.name || 'Citizen',
      actorRole: 'Citizen',
      isCompleted: true
    },
    {
      id: `tl_init_2`,
      stage: 'ai_analyzed',
      title: 'AI Intelligence Analysis Completed',
      description: `Category: ${aiAnalysis.category} (${aiAnalysis.confidence}%) • Severity: ${aiAnalysis.severity.toUpperCase()} • Priority: ${priorityBreakdown.score}/100.`,
      timestamp: new Date(Date.now() + 2000).toISOString(),
      actorName: 'Civic AI Engine',
      actorRole: 'System',
      isCompleted: true
    },
    {
      id: `tl_init_3`,
      stage: 'assigned',
      title: 'Auto-Routed to Municipal Department',
      description: `Dispatched to ${departmentName || aiAnalysis.department} queue.`,
      timestamp: new Date(Date.now() + 4000).toISOString(),
      actorName: 'Smart Routing Engine',
      actorRole: 'System',
      isCompleted: true
    }
  ];

  const defaultPhoto = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'];

  const newIssue: CivicIssue = {
    id: issueId,
    title: title || `${aiAnalysis.category} at ${location.sector || location.address || 'Central District'}`,
    description,
    categoryId: categoryId || aiAnalysis.categoryId,
    categoryName: categoryName || aiAnalysis.category,
    departmentId: departmentId || aiAnalysis.departmentId,
    departmentName: departmentName || aiAnalysis.department,
    status: 'assigned',
    severity: aiAnalysis.severity,
    priorityScore: priorityBreakdown.score,
    priorityLevel: priorityBreakdown.level,
    priorityBreakdown,
    location: {
      lat: location.lat || 28.6139,
      lng: location.lng || 77.2090,
      address: location.address || 'Main Road, Smart City',
      sector: location.sector || 'Sector 14',
      ward: location.ward || 'Ward 14',
      landmark: location.landmark || ''
    },
    images: defaultPhoto,
    aiAnalysis,
    reporter: {
      id: reporter?.id || 'user_citizen_aarav',
      name: reporter?.name || 'Aarav Sharma',
      avatar: reporter?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      reliabilityScore: reporter?.reliabilityScore || 98
    },
    confirmations: [
      {
        id: `conf_initial_${Date.now()}`,
        userId: reporter?.id || 'user_citizen_aarav',
        userName: reporter?.name || 'Aarav Sharma',
        userAvatar: reporter?.avatar,
        userReliability: 98,
        comment: 'Initial issue report and verification',
        createdAt: now
      }
    ],
    confirmationsCount: 1,
    duplicateCount: 0,
    mergedReports: [],
    timeline: initialTimeline,
    resolution: {
      resolvedAt: '',
      resolvedBy: '',
      notes: '',
      beforeImageUrl: defaultPhoto[0],
      afterImageUrl: '',
      verificationStatus: 'pending',
      citizenFeedbackCount: { yes: 0, no: 0 },
      citizenVotes: []
    },
    recurrenceInfo,
    sla: {
      targetHours: targetSlaHours,
      deadline: new Date(Date.now() + targetSlaHours * 3600 * 1000).toISOString(),
      hoursRemaining: targetSlaHours,
      isBreached: false
    },
    createdAt: now,
    updatedAt: now
  };

  const created = db.createIssue(newIssue);

  // Send Notification to Citizen
  db.addNotification({
    id: `notif_${Date.now()}`,
    userId: reporter?.id || 'user_citizen_aarav',
    title: `Issue Logged: #${created.id}`,
    message: `Your report was classified as ${created.categoryName} and dispatched to ${created.departmentName} with Priority ${created.priorityScore}/100.`,
    type: 'info',
    issueId: created.id,
    read: false,
    createdAt: now
  });

  // Also notify Department Officer
  db.addNotification({
    id: `notif_off_${Date.now()}`,
    userId: 'user_officer_priya',
    title: `New Case Assigned: #${created.id}`,
    message: `New ${created.severity.toUpperCase()} severity ${created.categoryName} reported in ${created.location.sector}.`,
    type: 'critical',
    issueId: created.id,
    read: false,
    createdAt: now
  });

  return res.status(201).json(created);
});

// POST Upvote / Toggle Upvote on an Issue
router.post('/:id/upvote', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { userId, userName, userAvatar } = req.body;
  const currentUserId = userId || 'user_citizen_aarav';
  const currentUserName = userName || 'Aarav Sharma';

  const existingIndex = issue.confirmations.findIndex(c => c.userId === currentUserId);
  let updatedConfirmations = [...issue.confirmations];
  let isUpvoted = false;

  if (existingIndex >= 0) {
    // If already upvoted, remove the upvote (toggle off)
    updatedConfirmations.splice(existingIndex, 1);
    isUpvoted = false;
  } else {
    // Add new upvote
    const newConfirmation = {
      id: `conf_upvote_${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      userAvatar,
      userReliability: 98,
      comment: 'Upvoted by community member.',
      createdAt: new Date().toISOString()
    };
    updatedConfirmations.push(newConfirmation);
    isUpvoted = true;
  }

  const newCount = updatedConfirmations.length;

  // Re-calculate AI Priority with new upvote evidence!
  const priorityBreakdown = AIService.calculatePriority({
    categorySeverity: issue.severity,
    confirmationsCount: newCount,
    duplicateCount: issue.duplicateCount,
    locationAddress: issue.location.address,
    locationSector: issue.location.sector,
    isSafetyHazard: issue.aiAnalysis?.safetyHazard || false,
    unresolvedHours: (Date.now() - new Date(issue.createdAt).getTime()) / (3600 * 1000),
    isRecurring: issue.recurrenceInfo?.isRecurring
  });

  const updated = db.updateIssue(issue.id, {
    confirmations: updatedConfirmations,
    confirmationsCount: newCount,
    priorityScore: priorityBreakdown.score,
    priorityLevel: priorityBreakdown.level,
    priorityBreakdown,
    status: issue.status === 'reported' && newCount > 1 ? 'community_verified' : issue.status,
    updatedAt: new Date().toISOString()
  });

  return res.json({
    issue: updated,
    isUpvoted,
    confirmationsCount: newCount,
    priorityScore: updated?.priorityScore
  });
});

// POST Community Confirmation ("I confirm this issue")
router.post('/:id/confirm', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { userId, userName, userAvatar, userReliability, comment, photoUrl } = req.body;

  // Check if user already confirmed
  const existingConf = issue.confirmations.find(c => c.userId === userId);
  if (existingConf) {
    return res.status(400).json({ error: 'You have already confirmed this issue' });
  }

  const newConfirmation = {
    id: `conf_${Date.now()}`,
    userId: userId || 'user_citizen_aarav',
    userName: userName || 'Aarav Sharma',
    userAvatar,
    userReliability: userReliability || 95,
    comment: comment || 'Verified by nearby resident.',
    photoUrl,
    createdAt: new Date().toISOString()
  };

  const updatedConfirmations = [...issue.confirmations, newConfirmation];
  const newCount = updatedConfirmations.length;

  // Re-calculate AI Priority with new confirmation evidence!
  const priorityBreakdown = AIService.calculatePriority({
    categorySeverity: issue.severity,
    confirmationsCount: newCount,
    duplicateCount: issue.duplicateCount,
    locationAddress: issue.location.address,
    locationSector: issue.location.sector,
    isSafetyHazard: issue.aiAnalysis?.safetyHazard || false,
    unresolvedHours: (Date.now() - new Date(issue.createdAt).getTime()) / (3600 * 1000),
    isRecurring: issue.recurrenceInfo?.isRecurring
  });

  const updated = db.updateIssue(issue.id, {
    confirmations: updatedConfirmations,
    confirmationsCount: newCount,
    priorityScore: priorityBreakdown.score,
    priorityLevel: priorityBreakdown.level,
    priorityBreakdown,
    status: issue.status === 'reported' ? 'community_verified' : issue.status,
    updatedAt: new Date().toISOString()
  });

  return res.json(updated);
});

// POST Assign Officer
router.post('/:id/assign', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { officerId, officerName, department } = req.body;
  const now = new Date().toISOString();

  const newTimeline = [...issue.timeline];
  newTimeline.push({
    id: `tl_assign_${Date.now()}`,
    stage: 'assigned',
    title: `Officer Assigned: ${officerName}`,
    description: `Assigned to Lead Officer ${officerName} (${department}).`,
    timestamp: now,
    actorName: officerName,
    actorRole: 'Lead Officer',
    isCompleted: true
  });

  const updated = db.updateIssue(issue.id, {
    assignedOfficer: {
      id: officerId,
      name: officerName,
      department: department || issue.departmentName,
      assignedAt: now
    },
    timeline: newTimeline,
    updatedAt: now
  });

  return res.json(updated);
});

// PATCH Status transition (in_progress, requires_inspection, etc.)
router.patch('/:id/status', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { status, actorName, notes } = req.body;
  const now = new Date().toISOString();

  const newTimeline = [...issue.timeline];
  let stageTitle = `Status Changed to ${status.replace('_', ' ').toUpperCase()}`;
  if (status === 'in_progress') stageTitle = 'Field Repair Crew Deployed';
  if (status === 'requires_inspection') stageTitle = 'Structural Inspection Requested';

  newTimeline.push({
    id: `tl_status_${Date.now()}`,
    stage: status as IssueStatus,
    title: stageTitle,
    description: notes || `Lead officer transitioned case status to ${status}.`,
    timestamp: now,
    actorName: actorName || 'Department Officer',
    actorRole: 'Authority',
    isCompleted: true
  });

  const updated = db.updateIssue(issue.id, {
    status: status as IssueStatus,
    timeline: newTimeline,
    updatedAt: now
  });

  return res.json(updated);
});

// POST Mark Issue as Resolved by Department Officer (with Before & After evidence)
router.post('/:id/resolve', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { resolvedBy, notes, afterImageUrl, beforeImageUrl } = req.body;
  const now = new Date().toISOString();

  const newTimeline = [...issue.timeline];
  newTimeline.push({
    id: `tl_resolve_${Date.now()}`,
    stage: 'resolved',
    title: 'Resolution Completed by Department',
    description: notes || 'Work order completed and verified with on-site photographic evidence.',
    timestamp: now,
    actorName: resolvedBy || 'Priya Mehta',
    actorRole: 'Lead Officer',
    isCompleted: true
  });

  const updated = db.updateIssue(issue.id, {
    status: 'resolved',
    resolution: {
      resolvedAt: now,
      resolvedBy: resolvedBy || 'Priya Mehta (Roads & Infra)',
      notes: notes || 'Pavement surface hot-mix repair executed according to municipal standard specs.',
      beforeImageUrl: beforeImageUrl || issue.images[0],
      afterImageUrl: afterImageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
      verificationStatus: 'pending',
      citizenFeedbackCount: { yes: 0, no: 0 },
      citizenVotes: []
    },
    timeline: newTimeline,
    updatedAt: now
  });

  // Notify original reporter for citizen closed-loop verification
  db.addNotification({
    id: `notif_res_${Date.now()}`,
    userId: issue.reporter.id,
    title: `Issue #${issue.id} Marked Resolved!`,
    message: `Authority marked "${issue.title}" as resolved. Please verify if the issue is physically fixed.`,
    type: 'warning',
    issueId: issue.id,
    read: false,
    createdAt: now
  });

  return res.json(updated);
});

// POST Citizen Resolution Verification (Closed-Loop Feedback)
router.post('/:id/verify-resolution', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const { userId, userName, vote, comment } = req.body; // vote: 'yes' | 'no'
  if (!vote || (vote !== 'yes' && vote !== 'no')) {
    return res.status(400).json({ error: 'Vote must be yes or no' });
  }

  const now = new Date().toISOString();
  const resolution = issue.resolution || {
    resolvedAt: now,
    resolvedBy: 'Department Officer',
    notes: 'Resolution under verification',
    verificationStatus: 'pending',
    citizenFeedbackCount: { yes: 0, no: 0 },
    citizenVotes: []
  };

  // Add citizen vote
  const citizenVotes = [...(resolution.citizenVotes || [])];
  citizenVotes.push({
    userId: userId || 'user_citizen_aarav',
    userName: userName || 'Aarav Sharma',
    vote,
    comment: comment || (vote === 'yes' ? 'Physical resolution confirmed.' : 'Issue is still unresolved or defective.'),
    timestamp: now
  });

  const citizenFeedbackCount = {
    yes: citizenVotes.filter(v => v.vote === 'yes').length,
    no: citizenVotes.filter(v => v.vote === 'no').length
  };

  let newStatus: IssueStatus = issue.status;
  let verificationStatus = resolution.verificationStatus;
  const newTimeline = [...issue.timeline];

  if (vote === 'yes') {
    verificationStatus = 'verified_resolved';
    newStatus = 'citizen_verified';
    newTimeline.push({
      id: `tl_civ_ver_${Date.now()}`,
      stage: 'citizen_verified',
      title: 'Citizen Closed-Loop Verification: Confirmed Resolved',
      description: `${userName || 'Citizen'} verified on-site fix. Case verified by community.`,
      timestamp: now,
      actorName: userName || 'Citizen',
      actorRole: 'Community Auditor',
      isCompleted: true
    });
  } else {
    // If disputed, reopen issue or flag for reinspection!
    verificationStatus = 'disputed_still_exists';
    newStatus = 'requires_inspection';
    newTimeline.push({
      id: `tl_civ_disp_${Date.now()}`,
      stage: 'requires_inspection',
      title: 'Citizen Disputed Resolution: Issue Still Exists',
      description: `${userName || 'Citizen'} reported issue remains unresolved. Case automatically reopened for supervisory inspection.`,
      timestamp: now,
      actorName: userName || 'Citizen',
      actorRole: 'Community Auditor',
      isCompleted: true
    });

    // Notify officer of dispute
    db.addNotification({
      id: `notif_disp_${Date.now()}`,
      userId: issue.assignedOfficer?.id || 'user_officer_priya',
      title: `Dispute on Resolved Case #${issue.id}`,
      message: `Citizen ${userName} reported that issue #${issue.id} was NOT properly resolved. Reopened for field reinspection.`,
      type: 'critical',
      issueId: issue.id,
      read: false,
      createdAt: now
    });
  }

  const updated = db.updateIssue(issue.id, {
    status: newStatus,
    resolution: {
      ...resolution,
      verificationStatus,
      citizenFeedbackCount,
      citizenVotes
    },
    timeline: newTimeline,
    updatedAt: now
  });

  return res.json(updated);
});

// POST Reset Demo Data
router.post('/reset-demo', (_req, res) => {
  const data = db.resetToSeed();
  return res.json({ message: 'Demo data successfully reset to initial seed state', count: data.issues.length });
});

export default router;
