import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CivicIssue, Department, IssueCategory, NotificationItem, User } from '../../src/types/index.js';
import { INITIAL_USERS, INITIAL_DEPARTMENTS, INITIAL_CATEGORIES, INITIAL_ISSUES, INITIAL_NOTIFICATIONS } from '../seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface Schema {
  users: User[];
  departments: Department[];
  categories: IssueCategory[];
  issues: CivicIssue[];
  notifications: NotificationItem[];
}

class Database {
  private data: Schema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): Schema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing database.json, initializing default seed data.');
    }

    const defaultData: Schema = {
      users: [...INITIAL_USERS],
      departments: [...INITIAL_DEPARTMENTS],
      categories: [...INITIAL_CATEGORIES],
      issues: [...INITIAL_ISSUES],
      notifications: [...INITIAL_NOTIFICATIONS],
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: Schema = this.data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public resetToSeed() {
    this.data = {
      users: [...INITIAL_USERS],
      departments: [...INITIAL_DEPARTMENTS],
      categories: [...INITIAL_CATEGORIES],
      issues: [...INITIAL_ISSUES],
      notifications: [...INITIAL_NOTIFICATIONS],
    };
    this.saveData();
    return this.data;
  }

  // Users
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.saveData();
      return this.data.users[idx];
    }
    return undefined;
  }

  // Departments
  public getDepartments(): Department[] {
    return this.data.departments;
  }

  public getDepartmentById(id: string): Department | undefined {
    return this.data.departments.find(d => d.id === id);
  }

  // Categories
  public getCategories(): IssueCategory[] {
    return this.data.categories;
  }

  // Issues
  public getIssues(filter?: {
    status?: string;
    departmentId?: string;
    categoryId?: string;
    severity?: string;
    priority?: string;
    sector?: string;
    reporterId?: string;
    search?: string;
  }): CivicIssue[] {
    let result = [...this.data.issues];

    if (!filter) return result;

    if (filter.status && filter.status !== 'all') {
      result = result.filter(i => i.status === filter.status);
    }
    if (filter.departmentId && filter.departmentId !== 'all') {
      result = result.filter(i => i.departmentId === filter.departmentId);
    }
    if (filter.categoryId && filter.categoryId !== 'all') {
      result = result.filter(i => i.categoryId === filter.categoryId);
    }
    if (filter.severity && filter.severity !== 'all') {
      result = result.filter(i => i.severity === filter.severity);
    }
    if (filter.priority && filter.priority !== 'all') {
      result = result.filter(i => i.priorityLevel === filter.priority);
    }
    if (filter.sector && filter.sector !== 'all') {
      result = result.filter(i => i.location.sector.toLowerCase().includes(filter.sector!.toLowerCase()));
    }
    if (filter.reporterId) {
      result = result.filter(i => i.reporter.id === filter.reporterId);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.location.address.toLowerCase().includes(q) ||
          i.location.sector.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getIssueById(id: string): CivicIssue | undefined {
    return this.data.issues.find(i => i.id === id);
  }

  public createIssue(issue: CivicIssue): CivicIssue {
    this.data.issues.unshift(issue);
    this.saveData();
    return issue;
  }

  public updateIssue(id: string, updates: Partial<CivicIssue>): CivicIssue | undefined {
    const idx = this.data.issues.findIndex(i => i.id === id);
    if (idx !== -1) {
      this.data.issues[idx] = {
        ...this.data.issues[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data.issues[idx];
    }
    return undefined;
  }

  // Notifications
  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return this.data.notifications.filter(n => n.userId === userId);
    }
    return this.data.notifications;
  }

  public addNotification(notification: NotificationItem): NotificationItem {
    this.data.notifications.unshift(notification);
    this.saveData();
    return notification;
  }

  public markNotificationAsRead(id: string): boolean {
    const item = this.data.notifications.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.saveData();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.saveData();
  }
}

export const db = new Database();
