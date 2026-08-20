import React, { useState } from 'react';
import { CivicIssue, PriorityLevel, IssueStatus } from '../../types/index.js';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { PriorityBadge } from '../common/PriorityBadge.js';
import { VerticalTimeline } from '../common/VerticalTimeline.js';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Building,
  UserCheck,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Camera,
  Send,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

interface DepartmentIssueDetailProps {
  issue: CivicIssue;
  onBack: () => void;
}

export const DepartmentIssueDetail: React.FC<DepartmentIssueDetailProps> = ({ issue, onBack }) => {
  const { updateStatus, assignOfficer, resolveIssue, showToast } = useIssues();
  const { currentUser } = useAuth();

  const [selectedDeptId, setSelectedDeptId] = useState<string>(issue.departmentId);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>(issue.priorityLevel);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(issue.status);
  const [assignedOfficerName, setAssignedOfficerName] = useState<string>(issue.assignedOfficer?.name || 'Priya Mehta');
  const [internalNote, setInternalNote] = useState<string>('');
  const [notesHistory, setNotesHistory] = useState<string[]>([
    'Field inspection completed. Sub-base asphalt depression confirmed ~10cm depth.'
  ]);

  // Resolution Form state
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [resolutionNotes, setResolutionNotes] = useState<string>(
    'Hot-mix asphalt surface patch completed and compacted to municipal grade.'
  );
  const [afterImageUrl, setAfterImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'
  );

  const isResolved = issue.status === 'resolved' || issue.status === 'citizen_verified' || issue.status === 'closed';

  const handleAddNote = () => {
    if (!internalNote.trim()) return;
    setNotesHistory([...notesHistory, internalNote.trim()]);
    setInternalNote('');
    showToast('Internal note saved to work order audit log', 'info');
  };

  const handleSaveAssignments = async () => {
    const deptNames: Record<string, string> = {
      dept_public_works: 'Public Works',
      dept_sanitation: 'Sanitation',
      dept_water_drainage: 'Water & Drainage',
      dept_electrical: 'Electrical',
      dept_traffic: 'Traffic & Signage',
      dept_parks: 'Parks & Public Spaces'
    };

    const targetDeptName = deptNames[selectedDeptId] || 'Public Works';

    if (assignedOfficerName) {
      await assignOfficer(issue.id, 'officer_custom', assignedOfficerName, targetDeptName);
    }
    if (selectedStatus !== issue.status) {
      await updateStatus(issue.id, selectedStatus, `Status updated by ${currentUser?.name || 'Officer'}`);
    }
    showToast('Department assignments and status updated', 'success');
  };

  const handleConfirmResolution = async () => {
    await resolveIssue(
      issue.id,
      currentUser?.name ? `${currentUser.name} (${currentUser.departmentName || 'Public Works'})` : 'Priya Mehta (Public Works)',
      resolutionNotes,
      afterImageUrl
    );
    setIsResolving(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues Queue</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-teal-800">
            Case #{issue.id}
          </span>
          <StatusBadge status={issue.status} size="sm" />
          <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
        </div>
      </div>

      {/* Case Header (Section 7 Specs) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-sm font-bold text-slate-500">
            {issue.id}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            SLA Target Deadline: {issue.sla?.deadline || '24h standard'}
          </span>
        </div>

        <h1 className="text-xl font-bold text-slate-900">{issue.title}</h1>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Location</span>
            <span className="font-semibold text-slate-900">{issue.location.address}</span>
            <span className="text-slate-500 block text-[11px]">{issue.location.ward} ({issue.location.sector})</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Category</span>
            <span className="font-semibold text-slate-900">{issue.categoryName}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Department</span>
            <span className="font-semibold text-teal-800">{issue.departmentName}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Community Upvotes</span>
            <span className="font-bold text-teal-900 font-mono flex items-center gap-1">
              ▲ {issue.confirmationsCount} residents
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Reported Time</span>
            <span className="font-medium text-slate-900">{new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Operational Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 Cols): Description, Citizen Image, Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Evidence Image */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Citizen Evidence Image
            </span>
            <div className="rounded border border-slate-200 overflow-hidden bg-slate-100 max-h-80">
              <img
                src={issue.images[0]}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2 text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Citizen Statement & Problem Details
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {issue.description}
            </p>
            <div className="pt-2 text-slate-500 font-mono text-[11px]">
              Reported by: <strong>{issue.reporter.name}</strong> (Citizen Reliability: {issue.reporter.reliabilityScore}%)
            </div>
          </div>

          {/* Intelligent Department Routing Breakdown (Section 8 Specs) */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              Intelligent Routing Matrix
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-500">Detected Category:</span>
                <span className="font-semibold block">{issue.categoryName}</span>
              </div>
              <div>
                <span className="text-slate-500">Suggested Department:</span>
                <span className="font-semibold text-teal-800 block">{issue.departmentName}</span>
              </div>
              <div>
                <span className="text-slate-500">Priority Level:</span>
                <span className="font-semibold block">{issue.priorityLevel}</span>
              </div>
              <div>
                <span className="text-slate-500">Ward Jurisdiction:</span>
                <span className="font-semibold block">{issue.location.ward}</span>
              </div>
            </div>
          </div>

          {/* Operational Vertical Timeline */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block border-b border-slate-100 pb-2">
              Resolution Lifecycle Progression
            </span>
            <VerticalTimeline
              timeline={issue.timeline}
              currentStatus={issue.status}
              departmentName={issue.departmentName}
              assignedOfficerName={issue.assignedOfficer?.name}
              resolutionNotes={issue.resolution?.notes}
              afterImageUrl={issue.resolution?.afterImageUrl}
              beforeImageUrl={issue.resolution?.beforeImageUrl || issue.images[0]}
            />
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Department Action Panel (Section 7 Specs) */}
        <div className="lg:col-span-5 space-y-5">
          {/* ACTION PANEL */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Department Operations Action Panel
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Assign officers, adjust SLA priority, update work order state
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* ASSIGN DEPARTMENT */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Assign Department</label>
                <select
                  value={selectedDeptId}
                  onChange={e => setSelectedDeptId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-700"
                >
                  <option value="dept_public_works">Public Works</option>
                  <option value="dept_sanitation">Sanitation</option>
                  <option value="dept_water_drainage">Water & Drainage</option>
                  <option value="dept_electrical">Electrical</option>
                  <option value="dept_traffic">Traffic & Signage</option>
                  <option value="dept_parks">Parks & Public Spaces</option>
                </select>
              </div>

              {/* ASSIGN OFFICER */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Assign Lead Officer</label>
                <input
                  type="text"
                  value={assignedOfficerName}
                  onChange={e => setAssignedOfficerName(e.target.value)}
                  placeholder="Officer Name"
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>

              {/* CHANGE PRIORITY */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Change Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={e => setSelectedPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-medium"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Change Status</label>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value as IssueStatus)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-medium"
                  >
                    <option value="reported">Reported</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="requires_inspection">Requires Inspection</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveAssignments}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold shadow-xs"
              >
                Save Department Assignment & Status
              </button>
            </div>

            {/* PRIMARY ACTION: MARK AS RESOLVED */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                Primary Resolution Action
              </span>

              {!isResolving && !isResolved ? (
                <button
                  id="mark-as-resolved-btn"
                  onClick={() => setIsResolving(true)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              ) : isResolved ? (
                <div className="p-3 bg-emerald-50 rounded border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Work Order Completed & Verified</span>
                </div>
              ) : (
                /* Resolution Form */
                <div className="bg-slate-50 p-3.5 rounded border border-slate-300 space-y-2.5">
                  <span className="font-bold text-slate-800 block text-xs">
                    Upload Resolution Evidence
                  </span>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Remediation Log / Notes</label>
                    <textarea
                      rows={2}
                      value={resolutionNotes}
                      onChange={e => setResolutionNotes(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">After-Repair Image URL</label>
                    <input
                      type="text"
                      value={afterImageUrl}
                      onChange={e => setAfterImageUrl(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setIsResolving(false)}
                      className="w-1/3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs rounded font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      id="confirm-resolution-btn"
                      onClick={handleConfirmResolution}
                      className="w-2/3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs rounded font-bold"
                    >
                      Confirm Resolution
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* INTERNAL NOTES & AUDIT TRAIL */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Internal Case Notes
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Officers Only</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notesHistory.map((note, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700">
                  <span className="text-slate-400 font-mono text-[10px] block">Officer Note #{idx + 1}:</span>
                  {note}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={internalNote}
                onChange={e => setInternalNote(e.target.value)}
                placeholder="Add internal note..."
                className="flex-1 bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
              />
              <button
                onClick={handleAddNote}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
