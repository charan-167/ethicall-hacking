import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Wifi, Lock, Server, Cpu, Database, CheckCircle2, ArrowRight, Play, FileText, AlertOctagon, Activity, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const steps = [
    { num: '01', title: 'Detect Device', desc: 'System automatically detects MAC & IP when an unregistered device connects.' },
    { num: '02', title: 'Verify First Access', desc: 'Database checks if MAC address exists. New devices placed in Pending state.' },
    { num: '03', title: 'Request Password', desc: 'Device redirected to captive portal authentication interface.' },
    { num: '04', title: 'Authenticate User', desc: 'Submitted password hashed with bcrypt and compared securely.' },
    { num: '05', title: 'Grant or Deny Access', desc: 'Authorized status enables full network access. 5 failures trigger lockout.' },
  ];

  const features = [
    { title: 'First Access Detection', desc: 'Automatic identification of new MAC addresses entering network boundaries.', icon: Wifi },
    { title: 'Password Authentication', desc: 'Enforces WPA2/3 enterprise first-access credential verification.', icon: Lock },
    { title: 'Secure Password Hashing', desc: 'Passwords salted & hashed with bcrypt. Never stored in plain text.', icon: Shield },
    { title: 'Device Authorization', desc: 'Dynamic firewall state update from Pending to Authorized.', icon: CheckCircle2 },
    { title: 'Authentication Logging', desc: 'Comprehensive audit trails recording IP, MAC, timestamp, and results.', icon: FileText },
    { title: 'Failed Attempt Detection', desc: 'Automatic rate limiting & lockout after 5 consecutive failed attempts.', icon: AlertOctagon },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>3RD YEAR ENGINEERING AI & DATA SCIENCE PROJECT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Secure Wireless Network <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Password-Based Authentication for First Access
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-normal"
          >
            A secure wireless access management system that verifies new devices before granting network access. Demonstrates real-time MAC detection, bcrypt credential verification, device lockout, and security event monitoring.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/first-access"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Wifi className="w-4 h-4" />
              <span>Connect New Device</span>
            </Link>

            <Link
              to="/admin-dashboard"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Admin Dashboard</span>
            </Link>

            <Link
              to="/topology"
              className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span>View Network Architecture</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* VISUAL ARCHITECTURE PIPELINE */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-2xl relative">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold">
              REAL-TIME NETWORK TRAFFIC FLOW
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">System Access Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center space-y-2 flex flex-col items-center justify-center">
              <Server className="w-8 h-8 text-indigo-400" />
              <span className="font-bold text-xs text-slate-200">INTERNET</span>
              <span className="text-[10px] text-slate-500 font-mono">External Network</span>
            </div>

            <div className="hidden md:flex items-center justify-center text-slate-600">
              <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center space-y-2 flex flex-col items-center justify-center">
              <Cpu className="w-8 h-8 text-cyan-400" />
              <span className="font-bold text-xs text-slate-200">SECURE ROUTER</span>
              <span className="text-[10px] text-slate-500 font-mono">192.168.1.1</span>
            </div>

            <div className="hidden md:flex items-center justify-center text-slate-600">
              <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>

            <div className="bg-slate-950/80 border border-cyan-500/50 rounded-xl p-4 text-center space-y-2 flex flex-col items-center justify-center shadow-cyber-glow">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="font-bold text-xs text-cyan-300">AUTHENTICATION GATEWAY</span>
              <span className="text-[10px] text-slate-400 font-mono">First Access Verification</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-300">SUCCESS BRANCH</p>
                <p className="text-[11px] text-slate-400">Device Authorized → Full Network Access Granted</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-red-500/30 flex items-center gap-3">
              <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-300">FAILURE BRANCH</p>
                <p className="text-[11px] text-slate-400">Invalid Password / 5 Failures → Access Blocked & Logged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY FEATURES CARDS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold">
            KEY SECURITY CAPABILITIES
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Robust Security Features</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 space-y-3 transition-all hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS 5-STEP SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-12 space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold">
              STEP-BY-STEP WORKFLOW
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">How First Access Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div key={i} className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative flex flex-col justify-between">
                <span className="font-mono text-2xl font-extrabold text-cyan-400">{st.num}</span>
                <h4 className="font-bold text-sm text-slate-100">{st.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
