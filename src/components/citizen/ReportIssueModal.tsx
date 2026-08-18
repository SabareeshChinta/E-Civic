import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext.js';
import { useAuth } from '../../context/AuthContext.js';
import {
  Upload,
  Camera,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Cpu,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { AIAnalysisResult } from '../../types/index.js';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_CIVIC_PHOTOS = [
  {
    label: 'Road Pothole (Sector 14)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    desc: 'Huge deep pothole opening up near Sector 14 market corner. Vehicles skidding and causing severe traffic congestion.',
    sector: 'Sector 14',
    address: 'Main Market Junction, Sector 14'
  },
  {
    label: 'Garbage Dump (Sector 8)',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    desc: 'Overflowing commercial garbage heap outside Sector 8 market blocking pedestrian sidewalk. Foul stench and health hazard.',
    sector: 'Sector 8',
    address: 'Commercial Plaza Lane, Sector 8'
  },
  {
    label: 'Water Pipeline Leak (Sector 8)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    desc: 'Underground drinking water pipeline burst flooding the road. Clean water wasted and water pressure dropped in homes.',
    sector: 'Sector 8',
    address: 'Water Tanker Road, Sector 8'
  },
  {
    label: 'Drainage Blockage (Sector 21)',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    desc: 'Clogged sewage drain spilling foul water on street. High risk of waterlogging and pedestrian obstruction.',
    sector: 'Sector 21',
    address: 'Street 4, Sector 21 Residential Block B'
  }
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose }) => {
  const { createIssue, setIsDuplicateModalOpen, setPendingReportData, setDuplicateMatchData } = useIssues();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [photoUrl, setPhotoUrl] = useState<string>(PRESET_CIVIC_PHOTOS[0].url);
  const [description, setDescription] = useState<string>(PRESET_CIVIC_PHOTOS[0].desc);
  const [address, setAddress] = useState<string>(PRESET_CIVIC_PHOTOS[0].address);
  const [sector, setSector] = useState<string>(PRESET_CIVIC_PHOTOS[0].sector);
  const [lat, setLat] = useState<number>(28.6145);
  const [lng, setLng] = useState<number>(77.2102);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_CIVIC_PHOTOS[0]) => {
    setPhotoUrl(preset.url);
    setDescription(preset.desc);
    setAddress(preset.address);
    setSector(preset.sector);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setPhotoUrl(data.url);
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  };

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/issues/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, imageTag: photoUrl })
      });

      if (res.ok) {
        const analysis: AIAnalysisResult = await res.json();
        setAiAnalysis(analysis);
        setStep(3);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitReport = async () => {
    const draftPayload = {
      title: `${aiAnalysis?.category || 'Civic Issue'} at ${sector}`,
      description,
      categoryId: aiAnalysis?.categoryId,
      categoryName: aiAnalysis?.category,
      departmentId: aiAnalysis?.departmentId,
      departmentName: aiAnalysis?.department,
      location: {
        lat,
        lng,
        address,
        sector,
        ward: `Ward ${sector.replace(/\D/g, '') || '14'}`
      },
      images: [photoUrl]
    };

    try {
      const dupRes = await fetch('/api/issues/check-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          description,
          categoryId: aiAnalysis?.categoryId
        })
      });

      if (dupRes.ok) {
        const dupData = await dupRes.json();
        if (dupData.matchFound) {
          setPendingReportData(draftPayload);
          setDuplicateMatchData(dupData);
          onClose();
          setIsDuplicateModalOpen(true);
          return;
        }
      }

      await createIssue(draftPayload);
      onClose();
      resetForm();
    } catch (err) {
      console.error('Submission failed:', err);
      await createIssue(draftPayload);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setStep(1);
    setAiAnalysis(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 text-white rounded-2xl border border-white/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                Report a Civic Issue
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">
                  Instant AI Triage
                </span>
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Upload photo & description. Civic AI will classify & auto-route.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-3.5 pb-2.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
            Photo & Details
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
            Location
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
            AI Review & Submit
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Issue Photographic Evidence
                </label>

                {/* Photo Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-44 group">
                  <img src={photoUrl} alt="Report evidence" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                {/* Quick Presets for Demo */}
                <div className="mt-2.5">
                  <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">
                    ✨ Quick demo photo samples:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_CIVIC_PHOTOS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`text-left px-2.5 py-1.5 rounded-xl text-[11px] border transition truncate font-medium ${
                          photoUrl === p.url
                            ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        📷 {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  2. Short Description
                </label>
                <textarea
                  id="report-description-input"
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what is broken, traffic impact, or public safety hazard..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition"
              >
                <span>Continue to Location</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Confirm Geographic Location
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block mb-1">Sector / Neighborhood</span>
                    <select
                      value={sector}
                      onChange={e => {
                        setSector(e.target.value);
                        if (e.target.value === 'Sector 14') {
                          setLat(28.6145);
                          setLng(77.2102);
                        } else if (e.target.value === 'Sector 8') {
                          setLat(28.6189);
                          setLng(77.2045);
                        } else if (e.target.value === 'Sector 21') {
                          setLat(28.6110);
                          setLng(77.2140);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    >
                      <option value="Sector 14">Sector 14 (Central Market Area)</option>
                      <option value="Sector 8">Sector 8 (Commercial Plaza & Water Works)</option>
                      <option value="Sector 21">Sector 21 (Residential Block)</option>
                      <option value="City Hospital Corridor">City Hospital Corridor</option>
                      <option value="Central Bus Stand">Central Bus Stand</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block mb-1">Street Address & Landmark</span>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      placeholder="e.g. Near Market Gate #2"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-mono">
                    <span className="font-sans font-semibold">GPS Coordinates:</span>
                    <span className="text-blue-700 font-bold">{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  id="run-ai-analysis-btn"
                  type="button"
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing your report...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-sky-200" />
                      <span>Run AI Analysis →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && aiAnalysis && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-700" /> AI Classification Output
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                    {aiAnalysis.confidence}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Inferred Category</span>
                    <p className="font-bold text-slate-900">{aiAnalysis.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Severity</span>
                    <p className="font-bold text-amber-700 uppercase">{aiAnalysis.severity}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Department</span>
                    <p className="font-bold text-blue-700">{aiAnalysis.department}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Initial Priority Score</span>
                    <p className="font-bold text-blue-900 font-mono">{aiAnalysis.priorityScore}/100</p>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-blue-200/80 text-[11px] text-slate-700">
                  <strong className="text-blue-900">Suggested Action: </strong>
                  {aiAnalysis.suggestedAction}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  id="final-submit-report-btn"
                  type="button"
                  onClick={handleSubmitReport}
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalize & Submit Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
