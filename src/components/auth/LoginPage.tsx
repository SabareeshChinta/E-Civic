import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import {
  Shield,
  Building,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { Role } from '../../types/index.js';

interface LoginPageProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialRole?: Role;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onCancel, initialRole = 'citizen' }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState<string>('aarav.sharma@citizen.gov.in');
  const [password, setPassword] = useState<string>('citizen123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const testAccounts = [
    {
      role: 'citizen' as Role,
      title: 'Citizen / Customer',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@citizen.gov.in',
      password: 'citizen123',
      ward: 'Ward 14 (Sector 14)',
      badge: 'Public Grievance Access'
    },
    {
      role: 'officer' as Role,
      title: 'Municipal Officer',
      name: 'Priya Mehta',
      email: 'priya.mehta@pwd.gov.in',
      password: 'officer123',
      ward: 'Public Works Department',
      badge: 'Operations & Dispatch'
    },
    {
      role: 'admin' as Role,
      title: 'Operations Admin',
      name: 'Municipal Admin',
      email: 'admin@municipality.gov.in',
      password: 'admin123',
      ward: 'City Operations HQ',
      badge: 'Full Governance & SLA'
    }
  ];

  const handleRoleTabChange = (role: Role) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'citizen') {
      setEmail('aarav.sharma@citizen.gov.in');
      setPassword('citizen123');
    } else if (role === 'officer') {
      setEmail('priya.mehta@pwd.gov.in');
      setPassword('officer123');
    } else {
      setEmail('admin@municipality.gov.in');
      setPassword('admin123');
    }
  };

  const handleFillAccount = (acc: typeof testAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await login(email, password, selectedRole);
    setIsLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-3 sm:p-6 bg-[#f8fafc]">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header Branding */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-sm tracking-wider">
                EC
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-slate-900">E-CIVIC</span>
                <span className="text-[10px] uppercase font-mono ml-1.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                  SECURE AUTH
                </span>
              </div>
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log in as a citizen to track grievances or as an authority to manage city operations.
          </p>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-200/70 p-1 rounded-lg mt-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleTabChange('citizen')}
              className={`py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
                selectedRole === 'citizen'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-teal-700" />
              <span>Citizen Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('officer')}
              className={`py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
                selectedRole !== 'citizen'
                  ? 'bg-teal-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>City Authority</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email / Username Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {selectedRole === 'citizen' ? 'Citizen Email or ID' : 'Authority Work Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={selectedRole === 'citizen' ? 'e.g. aarav.sharma@citizen.gov.in' : 'e.g. priya.mehta@pwd.gov.in'}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 font-medium"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Test Password: {password || 'citizen123'}</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : `Sign In as ${selectedRole === 'citizen' ? 'Citizen' : 'Authority'}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-white px-2">1-Click Test Credentials</span>
            </div>
          </div>

          {/* 1-Click Demo Accounts Box */}
          <div className="space-y-2">
            {testAccounts.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleFillAccount(acc)}
                className={`w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between text-xs ${
                  email === acc.email
                    ? 'bg-teal-50 border-teal-700 text-teal-950 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{acc.name}</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-white border border-slate-300 text-slate-600">
                      {acc.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {acc.email} • Pass: <strong className="text-slate-800">{acc.password}</strong>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-teal-800 shrink-0 ml-2">
                  ⚡ Autofill
                </span>
              </button>
            ))}
          </div>
        </form>

        {/* Footer Note */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Smart India Hackathon • SIH25031 Municipal Platform
        </div>
      </div>
    </div>
  );
};
