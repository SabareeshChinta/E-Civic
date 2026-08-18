import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import {
  Hammer,
  Trash2,
  Lightbulb,
  Droplets,
  Building2,
  Signpost,
  AlertCircle,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  MapPin,
  Building,
  Shield,
  FileCheck
} from 'lucide-react';
import { IssueCategory, CivicIssue } from '../../types/index.js';

interface ReportIssueFlowProps {
  onCancel: () => void;
  onSuccess: (issueId: string) => void;
}

const CATEGORIES = [
  { id: 'cat_road', name: 'Road & Potholes', dept: 'Public Works', deptId: 'dept_public_works', icon: <Hammer className="w-5 h-5" />, desc: 'Potholes, cracks, broken asphalt' },
  { id: 'cat_waste', name: 'Garbage & Waste', dept: 'Sanitation', deptId: 'dept_sanitation', icon: <Trash2 className="w-5 h-5" />, desc: 'Uncollected waste, overflowing bin' },
  { id: 'cat_streetlights', name: 'Streetlights', dept: 'Electrical', deptId: 'dept_electrical', icon: <Lightbulb className="w-5 h-5" />, desc: 'Non-functioning streetlamp' },
  { id: 'cat_water', name: 'Water & Drainage', dept: 'Water & Drainage', deptId: 'dept_water_drainage', icon: <Droplets className="w-5 h-5" />, desc: 'Pipeline leakage, clogged drain' },
  { id: 'cat_public_spaces', name: 'Public Spaces', dept: 'Parks & Public Spaces', deptId: 'dept_parks', icon: <Building2 className="w-5 h-5" />, desc: 'Damaged park bench, walkway' },
  { id: 'cat_traffic', name: 'Traffic & Signage', dept: 'Traffic & Signage', deptId: 'dept_traffic', icon: <Signpost className="w-5 h-5" />, desc: 'Damaged traffic signal, sign' },
  { id: 'cat_other', name: 'Other Civic Issue', dept: 'Public Works', deptId: 'dept_public_works', icon: <AlertCircle className="w-5 h-5" />, desc: 'General municipal concern' }
];

const PRESETS = [
  {
    title: 'Large pothole near Sector 14 market corner',
    desc: 'Deep road crater approximately 1.2m across outside Gate 2 of Sector 14 market. High risk of two-wheeler skids.',
    catId: 'cat_road',
    address: 'Main Market Road, opposite Gate 2',
    sector: 'Sector 14',
    ward: 'Ward 14',
    lat: 28.6145,
    lng: 77.2102,
    img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Garbage heap overflowing on sidewalk',
    desc: 'Commercial garbage dumped on pedestrian sidewalk creating severe stench and foot-traffic obstruction.',
    catId: 'cat_waste',
    address: 'Commercial Plaza Lane, Sector 8',
    sector: 'Sector 8',
    ward: 'Ward 08',
    lat: 28.6189,
    lng: 77.2045,
    img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Drinking water pipeline burst on main road',
    desc: 'Pressurized clean water pipe burst flooding road and causing water supply disruption in surrounding homes.',
    catId: 'cat_water',
    address: 'Main Supply Road, Ward 21',
    sector: 'Sector 21',
    ward: 'Ward 21',
    lat: 28.6110,
    lng: 77.2140,
    img: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  }
];

export const ReportIssueFlow: React.FC<ReportIssueFlowProps> = ({ onCancel, onSuccess }) => {
  const { createIssue, issues } = useIssues();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCatId, setSelectedCatId] = useState<string>('cat_road');
  const [title, setTitle] = useState<string>(PRESETS[0].title);
  const [description, setDescription] = useState<string>(PRESETS[0].desc);
  const [address, setAddress] = useState<string>(PRESETS[0].address);
  const [sector, setSector] = useState<string>(PRESETS[0].sector);
  const [ward, setWard] = useState<string>(PRESETS[0].ward);
  const [lat, setLat] = useState<number>(PRESETS[0].lat);
  const [lng, setLng] = useState<number>(PRESETS[0].lng);
  const [imageUrl, setImageUrl] = useState<string>(PRESETS[0].img);
  const [submittedIssue, setSubmittedIssue] = useState<CivicIssue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeCategory = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0];

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setSelectedCatId(preset.catId);
    setAddress(preset.address);
    setSector(preset.sector);
    setWard(preset.ward);
    setLat(preset.lat);
    setLng(preset.lng);
    setImageUrl(preset.img);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newId = `CIV-${2842 + Math.floor(Math.random() * 20)}`;
      const payload = {
        title,
        description,
        categoryId: activeCategory.id,
        categoryName: activeCategory.name,
        departmentId: activeCategory.deptId,
        departmentName: activeCategory.dept,
        location: {
          lat,
          lng,
          address,
          sector,
          ward
        },
        images: [imageUrl]
      };

      const created = await createIssue(payload);
      setSubmittedIssue(created);
      setStep(4);
    } catch (e) {
      console.error('Submission failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-900">
              {step === 4 ? 'Report Submitted Successfully' : 'Report a Civic Issue'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct municipal grievance lodging system
            </p>
          </div>

          {step < 4 && (
            <div className="flex items-center space-x-1 text-xs font-mono">
              <span className="font-semibold text-teal-800">Step {step}</span>
              <span className="text-slate-400">/ 3</span>
            </div>
          )}
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Step 1: Select Issue Category
              </label>
              <p className="text-xs text-slate-500">
                Choose the category that best describes the municipal problem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition flex items-start space-x-3 ${
                    selectedCatId === cat.id
                      ? 'bg-teal-50/50 border-teal-700 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded shrink-0 ${selectedCatId === cat.id ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {cat.icon}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{cat.name}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono text-slate-600">
                      Dept: {cat.dept}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Problem Details */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Step 2: Describe the Problem
              </label>
              <p className="text-xs text-slate-500">
                Provide clear location and description for the municipal field team.
              </p>
            </div>

            {/* Quick Presets for demonstration */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Quick Demonstration Samples:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-medium text-slate-800"
                  >
                    Load Sample #{idx + 1}: {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
                  placeholder="e.g. Large pothole near Sector 14 market corner"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
                  placeholder="Describe the severity, traffic obstruction, or public hazard..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Location / Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-700"
                    placeholder="e.g. Main Market Road, opposite Gate 2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Ward / Sector</label>
                  <select
                    value={ward}
                    onChange={e => {
                      setWard(e.target.value);
                      if (e.target.value === 'Ward 14') setSector('Sector 14');
                      if (e.target.value === 'Ward 08') setSector('Sector 8');
                      if (e.target.value === 'Ward 21') setSector('Sector 21');
                      if (e.target.value === 'Ward 03') setSector('Sector 3');
                    }}
                    className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-700 font-medium"
                  >
                    <option value="Ward 14">Ward 14 (Sector 14)</option>
                    <option value="Ward 08">Ward 08 (Sector 8)</option>
                    <option value="Ward 21">Ward 21 (Sector 21)</option>
                    <option value="Ward 03">Ward 03 (Sector 3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Evidence Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-16 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                    <img src={imageUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded p-2 text-xs text-slate-900"
                    placeholder="Image URL"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>Review Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review Report */}
        {step === 3 && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Step 3: Review Report
              </label>
              <p className="text-xs text-slate-500">
                Confirm all details before generating official complaint reference.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Category</span>
                  <span className="font-bold text-slate-900">{activeCategory.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Department</span>
                  <span className="font-bold text-teal-800">{activeCategory.dept}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Issue Title</span>
                <p className="font-semibold text-slate-900 mt-0.5">{title}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Description</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Location</span>
                  <span className="text-slate-800">{address} ({ward})</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Reporter</span>
                  <span className="text-slate-800">{currentUser?.name || 'Aarav Sharma'}</span>
                </div>
              </div>

              {imageUrl && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Attached Evidence</span>
                  <img src={imageUrl} alt="Attached" className="h-32 object-cover rounded border border-slate-300" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                id="submit-report-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation Screen */}
        {step === 4 && submittedIssue && (
          <div className="p-8 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Your issue has been reported.</h2>
              <p className="text-xs text-slate-500 mt-1">
                The complaint has been registered in the municipal operations queue.
              </p>
            </div>

            <div className="bg-slate-50 max-w-md mx-auto p-4 rounded-lg border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Complaint ID:</span>
                <span className="font-mono font-bold text-teal-800 text-sm">#{submittedIssue.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-medium text-slate-800">{submittedIssue.categoryName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-800">{submittedIssue.location.address} ({submittedIssue.location.ward})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Assigned Department:</span>
                <span className="font-semibold text-teal-800">{submittedIssue.departmentName}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-semibold text-slate-900 uppercase">{submittedIssue.status.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                id="track-this-issue-btn"
                onClick={() => onSuccess(submittedIssue.id)}
                className="px-6 py-2.5 rounded bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition"
              >
                <span>Track this issue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
