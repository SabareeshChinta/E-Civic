import React from 'react';
import { Building2, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DepartmentComparison: React.FC = () => {
  const departments = [
    { name: 'Public Works', code: 'PWD', open: 42, resolved: 81, sla: 82, officers: 18, head: 'Priya Mehta' },
    { name: 'Sanitation', code: 'SWM', open: 31, resolved: 74, sla: 71, officers: 24, head: 'Vikram Singh' },
    { name: 'Water & Drainage', code: 'WDD', open: 18, resolved: 52, sla: 89, officers: 15, head: 'Sunita Rao' },
    { name: 'Electrical', code: 'ELEC', open: 12, resolved: 47, sla: 94, officers: 12, head: 'Karan Joshi' },
    { name: 'Traffic & Signage', code: 'TRF', open: 14, resolved: 30, sla: 76, officers: 9, head: 'Sanjay Kapoor' },
    { name: 'Parks & Public Spaces', code: 'PPS', open: 11, resolved: 25, sla: 78, officers: 8, head: 'Meera Deshmukh' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-800" />
          <span>Department Performance & Compliance Audit</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official municipal performance report across city departments
        </p>
      </div>

      {/* DEPARTMENT PERFORMANCE TABLE (Section 11 Specs) */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Municipal Department Comparison Report
          </h2>
          <span className="text-xs text-slate-500 font-mono">Q3 FY2026 Audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Lead Officer</th>
                <th className="py-3 px-4 text-center">Active Officers</th>
                <th className="py-3 px-4 text-center">Open Cases</th>
                <th className="py-3 px-4 text-center">Resolved Cases</th>
                <th className="py-3 px-4 text-center">SLA Compliance</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {departments.map(dept => (
                <tr key={dept.name} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{dept.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Code: {dept.code}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {dept.head}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-600">
                    {dept.officers}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-amber-800">
                    {dept.open}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800">
                    {dept.resolved}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-teal-800">
                    {dept.sla}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        dept.sla >= 85
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {dept.sla >= 85 ? 'Compliant' : 'Target SLA Warning'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
