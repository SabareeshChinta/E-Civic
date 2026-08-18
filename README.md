# 🏛️ E-Civic — Crowdsourced Civic Issue Reporting and Resolution System

[![Smart India Hackathon](https://img.shields.io/badge/SIH-SIH25031-teal.svg)](https://sih.gov.in)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2018%20%2B%20TypeScript-blue.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%20(GovTech%20Design)-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20REST%20API-green.svg)](https://expressjs.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Serverless%20%2B%20SPA-black.svg)](https://vercel.com/)

A production-grade, full-stack civic technology web platform built for **Indian Municipal Corporations**. E-Civic enables citizens to report civic grievances, track end-to-end resolution through vertical operational timelines, and verify repairs on site, while empowering municipal departments with an operational command center to triage, dispatch, monitor SLAs, and resolve work orders with photographic evidence.

---

## 🌟 Key Features & Capabilities

### 👤 Citizen Portal
- **Homepage & Civic Feed**: Real-time municipal metrics (*Reports Today, Resolved, In Progress, Avg. Response Time*) and live civic activity feed.
- **3-Step Grievance Reporting**: Category selection, description, ward & geolocation assignment, photo upload, and 1-click realistic demo presets.
- **Dedicated Complaint Tracking**: Instant search by Complaint ID (e.g. `CIV-2842`) to inspect the **Vertical Operational Timeline** (`REPORTED` $\rightarrow$ `VERIFIED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN PROGRESS` $\rightarrow$ `RESOLVED`).
- **Closed-Loop Citizen Verification**: Citizens audit completed work orders on site with before/after evidence photos (*"✓ Yes, Physical Fix Verified"* or *"✕ No, Defect Still Exists"*).
- **Interactive GIS Map**: Localized map view of ward complaints with category and status filtering.

### 🏛️ City Operations Command Center
- **Operational Issue Queue**: Multi-parameter filtering by Department, Ward, Category, Status, and real-time SLA countdown timers (`2h remaining`, `OVER SLA`).
- **Department Issue Detail Workspace**: Case inspection, officer assignment, priority adjustment, status transition, internal audit notes, and **Mark as Resolved** with before/after photo evidence.
- **SLA & Escalation Monitor**: Service area performance tracking (*Roads 82%, Waste 71%, Water 89%, Streetlights 94%*) and urgent deadline queues.
- **Municipal Analytics**: Ward-level resolution audit (*Ward 08 91%, Ward 14 84%, Ward 21 76%, Ward 03 94%*), category distribution, and weekly intake vs. throughput telemetry.
- **Department Comparison Audit**: Cross-departmental compliance benchmarking table.

---

## 🎨 Design Philosophy & GovTech Standards

- **Restrained Color Palette**: Deep civic teal (`#0f766e`), warm slate canvas (`#f8fafc`), deep charcoal typography (`#0f172a`), and muted slate metadata (`#64748b`).
- **Zero AI-Slop**: No purple/neon gradients, no glassmorphism, no fake marketing fluff. Visual hierarchy is built through **clean typography, spacing, borders, tabular metadata, and GIS mapping**.
- **Mobile-First & Desktop-Optimized**: Full responsiveness across mobile smartphones, tablets, and desktop workstations without compromise.

---

## 👥 Demo Profiles & Role Switcher

Use the top-bar **Profile Switcher** and **Portal Switcher** for instant testing:

| Profile | Role | Department / Jurisdiction | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Aarav Sharma** | 👤 Citizen | Ward 14 (Sector 14) | Report issues, track complaint timelines, view nearby issues, verify repairs |
| **Priya Mehta** | 🏛️ Officer | Public Works Department | Dispatch work orders, assign field officers, mark cases resolved with photo evidence |
| **Municipal Admin** | ⚙️ Administrator | City Operations HQ | Ward performance analytics, SLA compliance monitoring, cross-department audits |

---

## 🏃 Local Quick Start

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **npm** (v9+)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/SabareeshChinta/E-Civic.git
cd E-Civic

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
# Runs backend Express API (:5000) and frontend Vite (:5173) concurrently
npm run dev
```

### 4. Access Application
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ☁️ Deployment on Vercel

The repository is pre-configured for Vercel with [`vercel.json`](./vercel.json) and serverless function handlers in [`api/index.ts`](./api/index.ts):

1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Import the GitHub repository **`SabareeshChinta/E-Civic`**.
3. Keep default settings (**Build Command**: `npm run build`, **Output Directory**: `dist`).
4. Click **Deploy**.

---

## 🎬 3-Minute SIH Presentation Demo Script

1. **Citizen Experience**: Open homepage $\rightarrow$ Review live municipal counters and recent activity feed.
2. **File a Report**: Click **"Report an Issue"** $\rightarrow$ Select *Road & Potholes* $\rightarrow$ Load sample preset (*Large pothole near Sector 14*) $\rightarrow$ Review intelligent department suggestion (*Public Works*) $\rightarrow$ Click **Submit** $\rightarrow$ Case ID `#CIV-2842` is generated.
3. **Track Operational Lifecycle**: Click **"Track this issue"** $\rightarrow$ View the vertical timeline (`REPORTED` $\rightarrow$ `VERIFIED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN PROGRESS`).
4. **Switch to City Operations**: Use top bar profile dropdown to switch to **Priya Mehta (Public Works)**.
5. **Dispatch & Resolve**: Open `#CIV-2842` in the operations queue $\rightarrow$ Add internal inspection note $\rightarrow$ Click **"Mark as Resolved"** $\rightarrow$ Enter resolution log with photo evidence.
6. **Closed-Loop Citizen Audit**: Switch profile back to **Aarav Sharma (Citizen)** $\rightarrow$ View `#CIV-2842` timeline with Before/After repair photos $\rightarrow$ Click **"✓ Yes, Physical Fix Verified"** to close the loop!

---

## 🏗️ Architecture & Technology Stack

```
E-Civic/
├── api/                    # Vercel serverless function entrypoint
│   └── index.ts
├── server/                 # Express backend REST API
│   ├── app.ts              # Express application setup & middleware
│   ├── index.ts            # Local development server runner
│   ├── seedData.ts         # Authentic seed dataset for Indian Municipalities
│   ├── routes/             # Issues, Departments, Analytics, Notifications API
│   ├── services/           # AI classification, priority breakdown, duplicate clustering
│   └── db/                 # Embedded persistent database layer with tmpdir fallback
├── src/                    # Vite + React 18 frontend
│   ├── components/
│   │   ├── citizen/        # CitizenLanding, ReportIssueFlow, TrackComplaintPage, CitizenDashboard
│   │   ├── department/     # DepartmentCommandCenter, DepartmentOverview, IssueDetail, SLAMonitor, Analytics
│   │   └── common/         # Header, CivicMap, VerticalTimeline, StatusBadge, PriorityBadge
│   ├── context/            # AuthContext, IssueContext
│   ├── types/              # Full TypeScript interface definitions
│   ├── App.tsx             # Main router & layout controller
│   └── index.css           # GovTech design tokens & Tailwind utilities
├── vercel.json             # Vercel routing & SPA rewrites configuration
└── package.json
```

---

## 📜 License & Acknowledgements

- Built for **Smart India Hackathon (SIH25031)**.
- Designed & Developed by **Chinta Sabareesh Chowdary**.
