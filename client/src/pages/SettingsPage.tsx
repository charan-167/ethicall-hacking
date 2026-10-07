import React from 'react';
import { Sliders, Database, Server, Shield, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-mono text-xs">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Global System Settings</h1>
        <p className="text-slate-400">DATABASE & BACKEND GATEWAY INFRASTRUCTURE STATUS</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Database Engine Configuration</h3>
        </div>

        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-500">Database Driver:</span>
            <span className="text-cyan-400 font-bold">SQLite 3 (Async Wrapper)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Database Path:</span>
            <span className="text-slate-200">/server/database/securewifi.sqlite</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Migration Compatibility:</span>
            <span className="text-emerald-400 font-bold">PostgreSQL / MySQL Ready</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Foreign Key Enforcement:</span>
            <span className="text-emerald-400">ENABLED (PRAGMA foreign_keys = ON)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
