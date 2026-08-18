# 🏛️ E-CIVIC | Crowdsourced Civic Intelligence & Resolution Platform
### **Smart India Hackathon (SIH25031) — Problem Statement SIH25031**

> **A next-generation civic intelligence platform that transforms scattered citizen complaints into verified, prioritized, actionable civic cases with closed-loop citizen verification.**

---

## 🌟 The Core Civic Workflow
```
Citizen Report → AI Multi-Modal Triage → Duplicate Clustering → Community Verification 
       → Transparent Prioritization → Smart Department Auto-Routing 
       → Municipal Remediation → Closed-Loop Citizen Verification → Systemic Recurrence Intelligence
```

---

## 🚀 Key Innovation Highlights

1. **🧠 AI Multi-Modal Civic Triage Engine**:
   - Classifies civic defects (Road Damage, Water Burst, Sewage Overflow, Garbage, Broken Streetlights) with confidence percentage (96%+).
   - Informs cost schedule brackets, hazard risk, and auto-routes to appropriate municipal departments.

2. **🔍 Deterministic Duplicate Clustering**:
   - Real-time Haversine spatial indexing + NLP token similarity.
   - Detects nearby active cases (e.g. 120m away) and offers 1-click merging to concentrate community evidence rather than cluttering municipal queues.

3. **📊 Transparent, Explainable Priority Score (0–100)**:
   - **No unexplained AI magic numbers.** Clear breakdowns across:
     - Community confirmations (+20 pts)
     - Safety/Health hazards (+18 pts)
     - Transit corridors & emergency zones (+12 pts)
     - Sector recurrence history (+14 pts)
     - SLA remaining time pressure (+10 pts)

4. **⚡ "🧠 WHAT SHOULD WE FIX FIRST?" Priority Queue**:
   - Municipal Command Center hero queue algorithmically ranking top urgent dispatches for city directors.

5. **🔄 Closed-Loop Citizen Resolution Verification**:
   - Department uploads **Before & After photographic evidence**.
   - Citizens vote: **"Has this issue actually been resolved? ✓ Yes / ✕ No"**.
   - If disputed by community, automatically re-opens for supervisory inspection!

6. **🔮 Systemic Recurrence Intelligence**:
   - Identifies chronic sector infrastructure failures (e.g., Sector 14 drainage recurrence risk 82% over 60 days) and recommends root-cause preventive capital works rather than repetitive piecemeal patching.

---

## 👥 Demo Personas & Fast Switcher

Use the top-right **"Demo Switcher"** or floating **"SIH Demo Guide"** for 1-click switching:

| Persona | Role | Department / Area | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Aarav Sharma** | 👤 Citizen | Sector 14, Ward 14 | Instant 3-step reporting, photo upload, duplicate merging, community confirmation, resolution verification |
| **Priya Mehta** | 🏛️ Officer | Roads & Infrastructure | Municipal Command Center, Civic Map, Priority Queue, Crew assignment, Before/After resolution upload |
| **Municipal Admin** | ⚙️ Administrator | Citywide HQ | Inter-department governance, SLA compliance, Anti-spam & report trust telemetry |

---

## 🏃 How to Run Locally

### 1. Prerequisites
- **Node.js** (v18+ or v20+ / v24+)
- **npm** (v9+)

### 2. Installation & Quick Start
```bash
# Install dependencies
npm install

# Start both Backend API (:5000) and Frontend Vite (:5173) concurrently
npm run dev
```

### 3. Open in Browser
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend Health API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🎬 3-Minute Primary Demo Script (For Judges)

1. **Step 1 (Citizen)**: Select **Aarav Sharma**. Notice hero banner & click **`+ REPORT AN ISSUE`**.
2. **Step 2 (AI Analysis)**: Select sample photo *"Road Pothole (Sector 14)"*. Click *"Run AI Analysis"*. Witness instant 96% confidence classification and suggested Roads & Infra department routing.
3. **Step 3 (Duplicate Merge)**: Click *"Finalize & Submit"*. The system detects existing duplicate `#CIV-48291` 120m away and prompts merge. Click *"Link to Existing Issue"*.
4. **Step 4 (Priority Escalation)**: Confirmations increase to 43 and priority reaches **92/100 (HIGH)** with transparent explainability factors card.
5. **Step 5 (Command Center)**: Switch to Officer **Priya Mehta (Roads & Infra)**. Open **"🧠 WHAT SHOULD WE FIX FIRST?"** queue. Inspect `#CIV-48291`, assign officer, and change status to **"In Progress"**.
6. **Step 6 (Resolution & Evidence)**: Click *"Resolve Issue & Upload After-Photo"*.
7. **Step 7 (Closed-Loop Verification)**: Switch to Citizen **Aarav Sharma**. Review Before/After comparison slider and click **"✓ Yes, Resolved"** to verify fix on site.
8. **Step 8 (Systemic Intelligence)**: View **"AI Insights & Recurrence"** tab to see Sector 14's 82% recurrence risk and root-cause engineering recommendation!

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Lucide Icons, Leaflet OpenStreetMap
- **Backend**: Node.js, Express, RESTful API
- **Database**: Persistent JSON / Embedded relational schema in `./data/database.json`
- **AI Services**: Modular `AIService` supporting text NLP, perceptual vision hashing, explainable priority scoring, and duplicate clustering
