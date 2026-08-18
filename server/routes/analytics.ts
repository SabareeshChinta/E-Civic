import { Router } from 'express';
import { db } from '../db/database.js';
import { AIService } from '../services/aiService.js';

const router = Router();

router.get('/overview', (_req, res) => {
  const issues = db.getIssues();
  const departments = db.getDepartments();

  const total = 12483 + issues.length;
  const pending = 1842 + issues.filter(i => i.status === 'reported' || i.status === 'under_review' || i.status === 'assigned').length;
  const inProgress = 673 + issues.filter(i => i.status === 'in_progress' || i.status === 'requires_inspection').length;
  const resolved = 9968 + issues.filter(i => i.status === 'resolved' || i.status === 'citizen_verified' || i.status === 'closed').length;
  const critical = 47 + issues.filter(i => i.priorityLevel === 'CRITICAL' && i.status !== 'resolved' && i.status !== 'closed').length;
  const avgResolutionDays = 3.7;

  // Category Distribution
  const categoryCounts: Record<string, number> = {
    'Road Damage': 3820,
    'Garbage & Waste': 4120,
    'Sewerage & Drainage': 2150,
    'Water Supply': 1890,
    'Electrical / Lighting': 980,
    'Public Works': 720
  };

  // Department Performance comparison
  const departmentPerformance = [
    { name: 'Water Supply', rate: 93, target: 90, color: '#2563eb' },
    { name: 'Roads & Infra', rate: 89, target: 85, color: '#0284c7' },
    { name: 'Waste Management', rate: 81, target: 85, color: '#16a34a' },
    { name: 'Traffic & Works', rate: 78, target: 80, color: '#ea580c' },
    { name: 'Drainage & Sewage', rate: 77, target: 80, color: '#0891b2' },
    { name: 'Electrical', rate: 74, target: 85, color: '#eab308' }
  ];

  // Sector Hotspots
  const sectorHotspots = [
    { sector: 'Sector 14', total: 42, critical: 8, recurrenceRisk: 82, dominantCategory: 'Road & Drainage' },
    { sector: 'Sector 8 Market', total: 38, critical: 7, recurrenceRisk: 74, dominantCategory: 'Garbage & Waste' },
    { sector: 'Sector 21', total: 29, critical: 4, recurrenceRisk: 68, dominantCategory: 'Drainage Blockage' },
    { sector: 'City Hospital Corridor', total: 24, critical: 6, recurrenceRisk: 45, dominantCategory: 'Streetlights & Road' },
    { sector: 'Central Bus Terminal', total: 19, critical: 3, recurrenceRisk: 38, dominantCategory: 'Public Infra' }
  ];

  // AI Generated Top Priority Actions ("🧠 WHAT SHOULD WE FIX FIRST?")
  const topActions = AIService.generateTopActionsToday(issues);

  // AI Insights
  const aiInsights = AIService.generateAIInsights(issues);

  return res.json({
    kpis: {
      total,
      pending,
      inProgress,
      resolved,
      critical,
      avgResolutionDays,
      citizenSatisfactionRate: 91.4,
      crowdsourceVerificationRate: 88.2
    },
    categoryCounts,
    departmentPerformance,
    sectorHotspots,
    topActions,
    aiInsights
  });
});

// Priority Queue dedicated endpoint
router.get('/priority-queue', (_req, res) => {
  const issues = db.getIssues();
  const topActions = AIService.generateTopActionsToday(issues);
  return res.json(topActions);
});

// AI Insights dedicated endpoint
router.get('/ai-insights', (_req, res) => {
  const issues = db.getIssues();
  const insights = AIService.generateAIInsights(issues);
  return res.json(insights);
});

export default router;
