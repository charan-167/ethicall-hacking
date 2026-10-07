import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, ShieldAlert, AlertOctagon, RefreshCw, Terminal, RotateCcw, Power, ShieldCheck } from 'lucide-react';
import { runSimulationStep } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const EventSimulatorPage: React.FC = () => {
  const [logs, setLogs] = useState<Array<{ id: string; time: string; action: string; text: string; success: boolean }>>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { addNotification } = useAuth();

  const handleSimulate = async (action: string, title: string) => {
    setLoadingAction(action);
    try {
      const res = await runSimulationStep(action, 'DEV-SIM-2026');
      const newEntry = {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        action: title,
        text: res.message,
        success: res.success,
      };
      setLogs((prev) => [newEntry, ...prev]);
      addNotification(res.success ? 'success' : 'danger', res.message);
    } catch (err: any) {
      setLogs((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          time: new Date().toLocaleTimeString(),
          action: title,
          text: 'Simulation error: ' + err.message,
          success: false,
        },
        ...prev,
      ]);
    } finally {
      setLoadingAction(null);
    }
  };

  const simButtons = [
    { action: 'connect_new', title: '1. Connect New Device', desc: 'Triggers First Access Detection & Pending status', icon: Cpu, color: 'border-cyan-500/50 text-cyan-300' },
    { action: 'correct_password', title: '2. Enter Correct Password', desc: 'Verifies bcrypt hash and grants Authorized access', icon: CheckCircle2, color: 'border-emerald-500/50 text-emerald-300' },
    { action: 'incorrect_password', title: '3. Enter Incorrect Password', desc: 'Increments failed count and logs security alert', icon: ShieldAlert, color: 'border-amber-500/50 text-amber-300' },
    { action: 'multi_fail_block', title: '4. Multiple Failed Attempts (5x)', desc: 'Hits 5-failure threshold and engages device lockout', icon: AlertOctagon, color: 'border-red-500/50 text-red-300' },
    { action: 'reauthenticate', title: '5. Successful Reauthentication', desc: 'Unblocks device and restores active network status', icon: ShieldCheck, color: 'border-emerald-500/50 text-emerald-300' },
    { action: 'revoke_device', title: '6. Admin Revoke Device Access', desc: 'Manually revokes authorization and blocks device', icon: Power, color: 'border-red-600/60 text-red-400' },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Security Event Simulator</h1>
          <p className="text-xs text-slate-400 font-mono">
            EDUCATIONAL THREAT & ACCESS DEMONSTRATION CONSOLE FOR VIVA EVALUATION
          </p>
        </div>

        <button
          onClick={() => setLogs([])}
          className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Console Logs</span>
        </button>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {simButtons.map((btn) => {
          const Icon = btn.icon;
          const isLoading = loadingAction === btn.action;
          return (
            <button
              key={btn.action}
              onClick={() => handleSimulate(btn.action, btn.title)}
              disabled={isLoading}
              className={`bg-slate-900/90 hover:bg-slate-800/90 border rounded-2xl p-5 text-left space-y-2 transition-all hover:scale-102 hover:shadow-xl ${btn.color}`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5" />
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current opacity-70" />
                )}
              </div>
              <h4 className="font-bold text-sm text-white font-mono">{btn.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{btn.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Live Simulation Terminal Console Log */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-2 font-bold text-cyan-400">
            <Terminal className="w-4 h-4" /> SIMULATOR EXECUTION OUTPUT TERMINAL
          </span>
          <span className="text-[10px]">{logs.length} events logged</span>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 text-xs">
          {logs.length === 0 ? (
            <p className="text-slate-600 text-center py-8">Click any simulation scenario button above to execute security event.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-cyan-400 font-bold">[{log.time}] {log.action}</span>
                  <span className={log.success ? 'text-emerald-400' : 'text-red-400'}>
                    {log.success ? 'SUCCESS' : 'ALERT'}
                  </span>
                </div>
                <p className="text-slate-200 text-xs">{log.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
