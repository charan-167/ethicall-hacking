import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

interface Props {
  password: string;
}

export const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  if (!password) return null;

  const checks = [
    { label: 'At least 8 characters long', valid: password.length >= 8 },
    { label: 'At least 1 uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'At least 1 number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'At least 1 special character (!@#$%^&*)', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const passedCount = checks.filter((c) => c.valid).length;

  let strengthLabel = 'Weak';
  let colorClass = 'bg-red-500';
  let textColorClass = 'text-red-400';

  if (passedCount >= 5) {
    strengthLabel = 'Strong';
    colorClass = 'bg-emerald-500';
    textColorClass = 'text-emerald-400';
  } else if (passedCount >= 3) {
    strengthLabel = 'Medium';
    colorClass = 'bg-amber-500';
    textColorClass = 'text-amber-400';
  }

  return (
    <div className="mt-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs space-y-2">
      <div className="flex items-center justify-between font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          {passedCount >= 5 ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-amber-400" />}
          Password Security:
        </span>
        <span className={`font-semibold ${textColorClass}`}>{strengthLabel} ({passedCount}/5)</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 transition-all duration-300 ${
              step <= passedCount ? colorClass : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[11px]">
        {checks.map((chk, idx) => (
          <div key={idx} className={`flex items-center gap-1.5 ${chk.valid ? 'text-emerald-400' : 'text-slate-500'}`}>
            {chk.valid ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
            <span>{chk.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
