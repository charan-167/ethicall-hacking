import React, { useState } from 'react';
import { Play, CheckCircle2, ShieldAlert, ArrowDown, RefreshCw, Lock, Laptop, Cpu, Shield } from 'lucide-react';
import { runSimulationStep } from '../services/api';

export const SecurityWorkflowPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<'success' | 'failure' | null>(null);

  const startAnimatedSimulation = async (simulateSuccess: boolean) => {
    setIsRunning(true);
    setOutcome(null);
    setActiveStep(1);

    await new Promise((r) => setTimeout(r, 800));
    setActiveStep(2);

    await new Promise((r) => setTimeout(r, 800));
    setActiveStep(3);

    await new Promise((r) => setTimeout(r, 800));
    setActiveStep(4);

    await new Promise((r) => setTimeout(r, 800));
    setActiveStep(5);

    await new Promise((r) => setTimeout(r, 800));
    if (simulateSuccess) {
      setOutcome('success');
      setActiveStep(6);
      await runSimulationStep('correct_password', 'DEV-WF-2026');
    } else {
      setOutcome('failure');
      setActiveStep(7);
      await runSimulationStep('incorrect_password', 'DEV-WF-2026');
    }
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Interactive Security Access Workflow</h1>
          <p className="text-xs text-slate-400 font-mono">
            ANIMATED SEQUENTIAL PATHWAY OF FIRST ACCESS SECURITY ENFORCEMENT
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startAnimatedSimulation(true)}
            disabled={isRunning}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Success Flow</span>
          </button>

          <button
            onClick={() => startAnimatedSimulation(false)}
            disabled={isRunning}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Failure Flow</span>
          </button>
        </div>
      </div>

      {/* Animated Flowchart Nodes */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-10 backdrop-blur-xl relative shadow-2xl space-y-6">
        <div className="max-w-xl mx-auto space-y-4">
          {/* Step 1: NEW DEVICE */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all duration-300 font-mono text-xs ${
              activeStep === 1
                ? 'bg-cyan-950 border-cyan-400 shadow-cyber-glow text-white scale-105'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Laptop className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <strong className="block text-sm text-white">1. NEW DEVICE DETECTED</strong>
            <span>MAC Address Captured by Access Point</span>
          </div>

          <ArrowDown className={`w-5 h-5 mx-auto ${activeStep >= 2 ? 'text-cyan-400 animate-bounce' : 'text-slate-700'}`} />

          {/* Step 2: FIRST ACCESS DETECTION */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all duration-300 font-mono text-xs ${
              activeStep === 2
                ? 'bg-cyan-950 border-cyan-400 shadow-cyber-glow text-white scale-105'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Cpu className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <strong className="block text-sm text-white">2. FIRST ACCESS DETECTION</strong>
            <span>Database Query: Unregistered State Confirmed</span>
          </div>

          <ArrowDown className={`w-5 h-5 mx-auto ${activeStep >= 3 ? 'text-cyan-400 animate-bounce' : 'text-slate-700'}`} />

          {/* Step 3: DEVICE REGISTRATION */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all duration-300 font-mono text-xs ${
              activeStep === 3
                ? 'bg-cyan-950 border-cyan-400 shadow-cyber-glow text-white scale-105'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Shield className="w-5 h-5 mx-auto mb-1 text-amber-400" />
            <strong className="block text-sm text-white">3. DEVICE REGISTRATION (PENDING)</strong>
            <span>Restricted Firewall Rule Assigned</span>
          </div>

          <ArrowDown className={`w-5 h-5 mx-auto ${activeStep >= 4 ? 'text-cyan-400 animate-bounce' : 'text-slate-700'}`} />

          {/* Step 4: PASSWORD REQUEST */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all duration-300 font-mono text-xs ${
              activeStep === 4
                ? 'bg-cyan-950 border-cyan-400 shadow-cyber-glow text-white scale-105'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Lock className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <strong className="block text-sm text-white">4. PASSWORD REQUEST</strong>
            <span>Captive Portal Verification Form Presented</span>
          </div>

          <ArrowDown className={`w-5 h-5 mx-auto ${activeStep >= 5 ? 'text-cyan-400 animate-bounce' : 'text-slate-700'}`} />

          {/* Step 5: PASSWORD VERIFICATION */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all duration-300 font-mono text-xs ${
              activeStep === 5
                ? 'bg-cyan-950 border-cyan-400 shadow-cyber-glow text-white scale-105'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <Lock className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
            <strong className="block text-sm text-white">5. PASSWORD VERIFICATION</strong>
            <span>bcrypt Hash Evaluation & Policy Match</span>
          </div>

          {/* Branching Outcomes */}
          <div className="grid grid-cols-2 gap-4 pt-4 font-mono text-xs">
            {/* SUCCESS BRANCH */}
            <div
              className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
                outcome === 'success'
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-cyber-success scale-105'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
              <strong className="block text-emerald-300">AUTHORIZED</strong>
              <span>Network Access Granted</span>
            </div>

            {/* FAILURE BRANCH */}
            <div
              className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
                outcome === 'failure'
                  ? 'bg-red-950 border-red-400 text-red-200 shadow-cyber-danger scale-105'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <ShieldAlert className="w-6 h-6 mx-auto text-red-400" />
              <strong className="block text-red-300">ACCESS DENIED</strong>
              <span>Security Event Logged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
