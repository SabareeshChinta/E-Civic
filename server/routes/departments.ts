import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// GET all departments with live stats
router.get('/', (_req, res) => {
  const departments = db.getDepartments();
  const issues = db.getIssues();

  const enhanced = departments.map(dept => {
    const deptIssues = issues.filter(i => i.departmentId === dept.id);
    const pending = deptIssues.filter(i => i.status === 'reported' || i.status === 'assigned' || i.status === 'under_review').length;
    const inProgress = deptIssues.filter(i => i.status === 'in_progress' || i.status === 'requires_inspection').length;
    const resolved = deptIssues.filter(i => i.status === 'resolved' || i.status === 'citizen_verified' || i.status === 'closed').length;

    return {
      ...dept,
      stats: {
        total: dept.stats.total + deptIssues.length,
        pending: pending + dept.stats.pending,
        inProgress: inProgress + dept.stats.inProgress,
        resolved: resolved + dept.stats.resolved,
        resolutionRate: dept.stats.resolutionRate,
        avgResolutionDays: dept.stats.avgResolutionDays
      }
    };
  });

  return res.json(enhanced);
});

// GET categories
router.get('/categories', (_req, res) => {
  const categories = db.getCategories();
  return res.json(categories);
});

export default router;
