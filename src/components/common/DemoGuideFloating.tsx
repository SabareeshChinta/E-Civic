import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useIssues } from '../../context/IssueContext.js';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  CheckCircle2,
  HelpCircle,
  Shield,
  User,
  Wrench,
  RotateCcw
} from 'lucide-react';

export const DemoGuideFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const { switchUser, switchRole } = useAuth();
  const {
    setIsReportingModalOpen,
    setSelectedIssue,
    issues,
    showToast
  } = useIssues();

  const totalSteps = 6;

  const handleStepAction = (targetStep: number) => {
    setStep(targetStep);

    if (targetStep === 1) {
      switchRole('citizen');
      showToast('Switched to Citizen Profile (Aarav Sharma)', 'info');
    } else if (targetStep === 2) {
      switchRole('citizen');
      setIsReportingModalOpen(true);
      showToast('Step 2: Upload photo and witness AI instant inference!', 'info');
    } else if (targetStep === 3) {
      const civ48 = issues.find(i => i.id === 'CIV-48291') || issues[0];
      if (civ48) setSelectedIssue(civ48);
      showToast('Inspecting Case #CIV-48291 (Priority 92/100)', 'info');
    } else if (targetStep === 4) {
      switchRole('officer');
      showToast('Switched to Authority Profile: Priya Mehta (Public Works)', 'info');
    } else if (targetStep === 5) {
      switchRole('officer');
      const civ48 = issues.find(i => i.id === 'CIV-48291') || issues[0];
      if (civ48) setSelectedIssue(civ48);
      showToast('Step 5: Review AI breakdown & upload Before/After evidence', 'info');
    } else if (targetStep === 6) {
      switchRole('citizen');
      const civ48 = issues.find(i => i.id === 'CIV-48291') || issues[0];
      if (civ48) setSelectedIssue(civ48);
      showToast('Step 6: Closed-loop verification by citizen on site!', 'success');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 text-xs font-bold hover:scale-105 transition transform border border-blue-400/40"
      >
        <Sparkles className="w-4 h-4 text-sky-200" />
        <span>SIH Demo Story Guide (3-Min Flow)</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 px-4 py-3 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-white/20 text-white border border-white/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black tracking-tight">SIH Hackathon Live Demo</h4>
            <span className="text-[10px] text-blue-100 font-semibold">
              Step {step} of {totalSteps}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {step === 1 && (
          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" /> Step 1: Citizen Reports Problem
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Aarav Sharma notices a deep pothole in Sector 14 market and clicks "+ Report an Issue".
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" /> Step 2: AI Multi-Modal Triage
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              AI instantly detects <strong>Road Damage (96% confidence)</strong>, auto-assigns to Roads & Infra, and checks spatial duplicates.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Step 3: Crowdsourced Validation & Priority
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              43 citizens confirm issue with photo evidence. AI calculates transparent <strong>Priority 92/100 (HIGH)</strong>.
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-600" /> Step 4: Municipal Command Center
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Officer Priya Mehta inspects GIS Map, checks <strong>"🧠 WHAT SHOULD WE FIX FIRST?"</strong> queue, and assigns rapid crew.
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-600" /> Step 5: Resolution & Photographic Proof
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Authority completes hot-mix asphalt repair and uploads <strong>Before & After photographic evidence</strong>.
            </p>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step 6: Closed-Loop Citizen Audit
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Citizen receives prompt: <em>"Has this issue actually been resolved?"</em> Confirms fix on site → Case closed!
            </p>
          </div>
        )}

        {/* Action Button for current step */}
        <button
          onClick={() => handleStepAction(step)}
          className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Step {step} Demo Action</span>
        </button>

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            disabled={step === 1}
            onClick={() => handleStepAction(Math.max(1, step - 1))}
            className="text-slate-500 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1 font-semibold"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <button
                key={s}
                onClick={() => handleStepAction(s)}
                className={`h-2 rounded-full transition-all ${
                  step === s ? 'bg-blue-600 w-5' : 'bg-slate-200 hover:bg-slate-300 w-2'
                }`}
              />
            ))}
          </div>
          <button
            disabled={step === totalSteps}
            onClick={() => handleStepAction(Math.min(totalSteps, step + 1))}
            className="text-blue-600 hover:text-blue-700 disabled:opacity-30 flex items-center gap-1 font-bold"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
