export type Role = 'citizen' | 'officer' | 'admin';

export type IssueStatus =
  | 'reported'
  | 'ai_analyzed'
  | 'under_review'
  | 'community_verified'
  | 'assigned'
  | 'in_progress'
  | 'requires_inspection'
  | 'resolved'
  | 'citizen_verified'
  | 'closed'
  | 'duplicate'
  | 'rejected';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;
  departmentName?: string;
  ward?: string;
  area?: string;
  phone?: string;
  avatar?: string;
  reliabilityScore: number;
  reportsCount: number;
  confirmationsCount: number;
  resolutionsVerified: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  icon: string;
  headOfficer: string;
  activeOfficersCount: number;
  slaHoursDefault: number;
  color: string;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    resolutionRate: number;
    avgResolutionDays: number;
  };
}

export interface IssueCategory {
  id: string;
  name: string;
  code: string;
  defaultDepartmentId: string;
  defaultDepartmentName: string;
  icon: string;
  baseSeverity: SeverityLevel;
  description: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  sector: string;
  ward: string;
  landmark?: string;
}

export interface PriorityBreakdown {
  score: number;
  level: PriorityLevel;
  factors: {
    confirmationsImpact: number;
    safetyRiskImpact: number;
    trafficImpact: number;
    recurrenceImpact: number;
    timeUnresolvedImpact: number;
    affectedPopulationEstimate: number;
  };
  explanations: string[];
}

export interface AIAnalysisResult {
  category: string;
  categoryId: string;
  confidence: number;
  severity: SeverityLevel;
  department: string;
  departmentId: string;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  safetyHazard: boolean;
  estimatedCostBracket: string;
  suggestedAction: string;
  detectedLabels: string[];
  alternatives: { label: string; confidence: number }[];
  reasoning: string[];
  trustScore: number;
  trustFactors: string[];
}

export interface CommunityConfirmation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userReliability?: number;
  comment?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  stage: IssueStatus;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  isCompleted: boolean;
}

export interface ResolutionData {
  resolvedAt: string;
  resolvedBy: string;
  notes: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  verificationStatus: 'pending' | 'verified_resolved' | 'disputed_still_exists';
  citizenFeedbackCount: { yes: number; no: number };
  citizenVotes: {
    userId: string;
    userName: string;
    vote: 'yes' | 'no';
    comment?: string;
    timestamp: string;
  }[];
}

export interface RecurrenceIntelligence {
  isRecurring: boolean;
  recurrenceScore: number; // e.g. 82%
  previousOccurrencesIn60Days: number;
  previousResolutionCount: number;
  patternNotice: string;
  systemicRecommendation: string;
}

export interface SLAData {
  targetHours: number;
  deadline: string;
  hoursRemaining: number;
  isBreached: boolean;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  status: IssueStatus;
  severity: SeverityLevel;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  priorityBreakdown: PriorityBreakdown;
  location: LocationData;
  images: string[];
  aiAnalysis: AIAnalysisResult;
  reporter: {
    id: string;
    name: string;
    avatar?: string;
    reliabilityScore: number;
  };
  assignedOfficer?: {
    id: string;
    name: string;
    department: string;
    assignedAt: string;
  };
  confirmations: CommunityConfirmation[];
  confirmationsCount: number;
  duplicateGroupId?: string;
  duplicateCount: number;
  mergedReports?: {
    id: string;
    reporterName: string;
    createdAt: string;
    distance: string;
    description: string;
  }[];
  timeline: TimelineEvent[];
  resolution?: ResolutionData;
  recurrenceInfo?: RecurrenceIntelligence;
  sla: SLAData;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  issueId?: string;
  read: boolean;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  type: 'recurrence' | 'trend' | 'hotspot' | 'anomaly' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  sector: string;
  category: string;
  statHighlight: string;
  description: string;
  actionRecommendation: string;
  createdAt: string;
}

export interface PriorityQueueAction {
  rank: number;
  issueId: string;
  title: string;
  sector: string;
  department: string;
  affectedCount: number;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  slaHoursRemaining: number;
  whyPrioritized: string;
}
