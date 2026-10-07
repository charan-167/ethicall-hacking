import React from 'react';
import { Info, Shield, Cpu, Lock, CheckCircle2, AlertTriangle, Layers, Server, Code, FileText, ArrowRight } from 'lucide-react';

export const AboutProjectPage: React.FC = () => {
  const modules = [
    { num: 'MODULE 1', name: 'Secure Wireless Network Design', desc: 'Boundary topology setup with access gateway and encryption protocols.' },
    { num: 'MODULE 2', name: 'First Access Device Detection', desc: 'MAC address identification and placement into untrusted pending state.' },
    { num: 'MODULE 3', name: 'Password-Based Authentication', desc: 'Captive portal credential collection and bcrypt hash verification.' },
    { num: 'MODULE 4', name: 'Device Authorization & Access Control', desc: 'Dynamic firewall state updating to Authorized or Blocked status.' },
    { num: 'MODULE 5', name: 'Authentication Logging & Monitoring', desc: 'Comprehensive audit trails recording all connection attempts.' },
    { num: 'MODULE 6', name: 'Security Analytics & Reporting', desc: 'Recharts analytics, executive summary graphs, and printable PDF reports.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-semibold">
          <Info className="w-4 h-4" />
          <span>3RD-YEAR ENGINEERING AI & DATA SCIENCE PROJECT</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white">
          Design of a Secure Wireless Network with Password-Based Authentication for First Access
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          PROJECT OVERVIEW, ARCHITECTURE, SECURITY MECHANISMS & ENGINEERING MODULES
        </p>
      </div>

      {/* Problem Statement & Proposed System */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        {/* Existing System Problems */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-mono">
            <AlertTriangle className="w-4 h-4" /> Problem Statement & Existing System
          </div>
          <p className="text-slate-300 leading-relaxed">
            Traditional open Wi-Fi networks allow any nearby device to connect instantly without verifying device identity or user credentials upon initial entry. Pre-shared keys (PSK) are frequently shared or leaked, leading to rogue devices polluting internal networks, unauthorized bandwidth consumption, and lack of accountability.
          </p>
          <ul className="space-y-1 text-slate-400 list-disc list-inside pt-2">
            <li>Zero first-access identity verification</li>
            <li>Plain text or static password sharing vulnerabilities</li>
            <li>No automated device lockout after credential spraying</li>
            <li>Lack of real-time device auditing and threat logs</li>
          </ul>
        </div>

        {/* Proposed System */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
            <CheckCircle2 className="w-4 h-4" /> Proposed SecureWiFi Solution
          </div>
          <p className="text-slate-300 leading-relaxed">
            SecureWiFi introduces a zero-trust captive authentication gateway. Unregistered devices attempting connection are immediately isolated into a Restricted/Pending state. Full network access is granted only after valid password verification, while failed attempts trigger automated lockout and security audit events.
          </p>
          <ul className="space-y-1 text-slate-400 list-disc list-inside pt-2">
            <li>Automatic MAC & IP detection upon entry</li>
            <li>Salted & hashed bcrypt credential verification</li>
            <li>Account/Device lockout after 5 failed attempts</li>
            <li>Full admin monitoring and real-time security analytics</li>
          </ul>
        </div>
      </div>

      {/* 6 Project Modules */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Core Engineering Project Modules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {modules.map((m, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] text-cyan-400 font-bold block">{m.num}</span>
              <h4 className="font-bold text-white text-sm">{m.name}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture Diagram Inside Webpage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
          <Server className="w-5 h-5" /> SYSTEM ARCHITECTURE DIAGRAM
        </div>

        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6 font-mono text-xs text-center">
          <div className="inline-block px-4 py-2 bg-slate-900 border border-cyan-500 rounded-xl text-cyan-300 font-bold">
            USER DEVICE (Laptop / Mobile)
          </div>

          <div className="text-slate-600">↓</div>

          <div className="inline-block px-4 py-2 bg-slate-900 border border-indigo-500 rounded-xl text-indigo-300 font-bold">
            WIRELESS ACCESS POINT (WPA2/3 Enterprise)
          </div>

          <div className="text-slate-600">↓</div>

          <div className="inline-block px-4 py-2 bg-slate-900 border border-cyan-500 rounded-xl text-cyan-300 font-bold">
            AUTHENTICATION GATEWAY & FIREWALL
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">USER DATABASE</div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">DEVICE REGISTRY</div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">SECURITY AUDIT LOGS</div>
          </div>

          <div className="text-slate-600">↓</div>

          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-400 font-bold">
              AUTHORIZED NETWORK
            </div>
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-400 font-bold">
              RESTRICTED / BLOCKED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
