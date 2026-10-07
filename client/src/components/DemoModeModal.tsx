import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, AlertTriangle, ShieldCheck, X, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { runSimulationStep } from '../services/api';

export const DemoModeModal: React.FC = () => {
  const { demoModeActive, toggleDemoMode, addNotification } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [simOutput, setSimOutput] = useState<string>('');
  const navigate = useNavigate();

  if (!demoModeActive) return null;

  const steps = [
    {
      title: '01. New Device Connection',
      desc: 'Simulate an unknown laptop connecting to SecureWiFi_5G for the first time.',
      action: 'connect_new',
      btnText: 'Simulate Connection',
      route: '/first-access',
    },
    {
      title: '02. First Access Detection',
      desc: 'The system detects that the MAC address is unregistered and places the device into a Restricted / Pending state.',
      action: 'none',
      btnText: 'View First Access Portal',
      route: '/first-access',
    },
    {
      title: '03. Incorrect Password Attempt',
      desc: 'Simulate entering an incorrect password. Observe security event logging and failed attempt count (1/5).',
      action: 'incorrect_password',
      btnText: 'Test Wrong Password',
      route: '/first-access',
    },
    {
      title: '04. Multiple Failures Lockout',
      desc: 'Simulate 5 consecutive failed authentication attempts to trigger automated device lockout.',
      action: 'multi_fail_block',
      btnText: 'Trigger 5-Fail Lockout',
      route: '/devices',
    },
    {
      title: '05. Correct Password & Authorization',
      desc: 'Re-authenticate with valid password or unblock device to transition state to AUTHORIZED.',
      action: 'reauthenticate',
      btnText: 'Authorize Device',
      route: '/user-dashboard',
    },
    {
      title: '06. Administrator Dashboard Inspection',
      desc: 'Review updated live statistics, Recharts analytics, and audit logs on the Admin Dashboard.',
      action: 'none',
      btnText: 'Open Admin Dashboard',
      route: '/admin-dashboard',
    },
  ];

  const handleStepAction = async (stepIdx: number) => {
    const step = steps[stepIdx];
    setLoading(true);
    setSimOutput('');

    try {
      if (step.action !== 'none') {
        const res = await runSimulationStep(step.action, 'DEV-SIM-2026');
        setSimOutput(res.message);
        addNotification(res.success ? 'success' : 'danger', res.message);
      }
      if (step.route) {
        navigate(step.route);
      }
    } catch (err: any) {
      setSimOutput('Error running step: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-[#0e1626]/95 border-2 border-cyan-500/60 rounded-2xl shadow-2xl p-5 backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm tracking-wide">
          <Play className="w-4 h-4 fill-cyan-400" />
          <span>PROJECT DEMONSTRATION MODE</span>
        </div>
        <button
          onClick={() => toggleDemoMode(false)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3 space-y-3 font-sans">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Step {currentStep} of {steps.length}</span>
          <span className="text-cyan-400 font-bold">{steps[currentStep - 1].title}</span>
        </div>

        {/* Step Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 rounded-full transition-all ${
                i + 1 <= currentStep ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {steps[currentStep - 1].desc}
        </p>

        {simOutput && (
          <div className="p-2.5 bg-slate-950 border border-cyan-500/30 rounded-lg text-[11px] font-mono text-cyan-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{simOutput}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => handleStepAction(currentStep - 1)}
            disabled={loading}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{steps[currentStep - 1].btnText}</span>
          </button>

          <button
            onClick={() => {
              if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
              } else {
                setCurrentStep(1);
              }
            }}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
