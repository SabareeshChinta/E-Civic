import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { CivicIssue } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import { CivicMap } from '../common/CivicMap.js';
import {
  MapPin,
  Users,
  CheckCircle2,
  Filter,
  Search,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface NearbyIssuesProps {
  onSelectIssue: (issue: CivicIssue) => void;
}

export const NearbyIssues: React.FC<NearbyIssuesProps> = ({ onSelectIssue }) => {
  const { issues, confirmIssue } = useIssues();
  const { currentUser } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = issues.filter(issue => {
    if (selectedCategory !== 'all' && issue.categoryId !== selectedCategory) return false;
    if (selectedSector !== 'all' && !issue.location.sector.includes(selectedSector)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.location.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-700" />
          Nearby Civic Issues & Community Verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Crowdsource validation: Confirming reports increases priority for municipal dispatch.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by keyword, street, landmark..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Categories</option>
            <option value="cat_road_damage">Road Damage / Potholes</option>
            <option value="cat_garbage">Garbage Accumulation</option>
            <option value="cat_water_leak">Water Pipeline Leak</option>
            <option value="cat_drainage">Drainage & Sewage</option>
            <option value="cat_streetlight">Streetlights</option>
          </select>

          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Sectors</option>
            <option value="Sector 14">Sector 14 (Hotspot)</option>
            <option value="Sector 8">Sector 8</option>
            <option value="Sector 21">Sector 21</option>
            <option value="Hospital">Hospital Corridor</option>
          </select>
        </div>
      </div>

      {/* Map View */}
      <CivicMap
        issues={filtered}
        onSelectIssue={onSelectIssue}
        onSelectSector={sectorName => setSelectedSector(sectorName)}
        height="340px"
      />

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(issue => {
          const userConfirmed = issue.confirmations.some(c => c.userId === currentUser?.id);
          return (
            <div
              key={issue.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-700 font-bold">#{issue.id}</span>
                  <StatusBadge status={issue.status} size="sm" />
                </div>
                <h4
                  onClick={() => onSelectIssue(issue)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer line-clamp-1"
                >
                  {issue.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {issue.confirmationsCount} verified
                </span>
                <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => confirmIssue(issue.id)}
                  disabled={userConfirmed}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    userConfirmed
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {userConfirmed ? '✓ Confirmed' : 'Confirm Issue (+1)'}
                </button>
                <button
                  onClick={() => onSelectIssue(issue)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-xl font-bold border border-slate-200"
                >
                  View Case →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
