import React from 'react';
import { Shield, Lock, Cpu, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070a10] border-t border-slate-800/80 py-8 px-4 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-200">SecureWiFi Access Control System</p>
            <p className="text-[11px] text-slate-400">3rd-Year Engineering Project Demonstration | AI & Data Science</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-cyan-400" /> bcrypt Hashed
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Express REST API
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Code className="w-3.5 h-3.5 text-cyan-400" /> SQLite Persistent
          </span>
        </div>

        <p className="text-slate-400 text-[11px] font-mono">
          © {new Date().getFullYear()} SecureWiFi Project. Educational Simulation.
        </p>
      </div>
    </footer>
  );
};
