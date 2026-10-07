import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Presentation, ChevronRight, ChevronLeft, Play, Shield, CheckCircle2, Lock, Cpu, Server, Layers } from 'lucide-react';

export const PresentationModePage: React.FC = () => {
  const [slide, setSlide] = useState<number>(1);
  const navigate = useNavigate();

  const slides = [
    {
      num: 1,
      title: 'Problem Statement & Motivation',
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p className="text-base font-medium text-white">
            Unsecured or static-password wireless networks suffer from serious security vulnerabilities when new devices connect without identity verification.
          </p>
          <ul className="space-y-2 list-disc list-inside text-slate-400 font-mono text-xs">
            <li>Unrestricted initial network entry allows rogue MAC addresses to join.</li>
            <li>Passphrase leakage leads to credential spraying and unauthorized access.</li>
            <li>Lack of real-time device auditing and threat logging.</li>
            <li>Absence of automated device lockout after repeated invalid attempts.</li>
          </ul>
        </div>
      ),
    },
    {
      num: 2,
      title: 'Proposed Solution & Project Objectives',
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p className="text-base font-medium text-white">
            Design and demonstrate a zero-trust Wireless First-Access Authentication System titled <strong className="text-cyan-400">SecureWiFi</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <strong className="text-emerald-400 block">1. First Access Detection</strong>
              <span>New MAC addresses placed into Pending state automatically.</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <strong className="text-cyan-400 block">2. bcrypt Hashed Credentials</strong>
              <span>Passwords salted & hashed before backend verification.</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <strong className="text-amber-400 block">3. 5-Attempt Device Lockout</strong>
              <span>Automated rate limiting & blacklisting after 5 bad attempts.</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <strong className="text-indigo-400 block">4. Full Admin Audit Logs</strong>
              <span>Recharts dashboard analytics & printable PDF reports.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: 'System Architecture & Data Flow',
      content: (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs text-center">
          <div className="inline-block px-4 py-2 bg-slate-900 border border-cyan-500 rounded-xl text-cyan-300 font-bold">
            USER DEVICE (First Access Connection Attempt)
          </div>
          <div className="text-slate-600">↓</div>
          <div className="inline-block px-4 py-2 bg-slate-900 border border-indigo-500 rounded-xl text-indigo-300 font-bold">
            SECURE ROUTER & AUTHENTICATION GATEWAY
          </div>
          <div className="text-slate-600">↓</div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-400 font-bold">
              AUTHORIZED NETWORK (Access Granted)
            </div>
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-400 font-bold">
              RESTRICTED STATE (Access Denied / Blocked)
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 4,
      title: 'Security Enforcement & Password Policy',
      content: (
        <div className="space-y-4 text-slate-300 text-sm">
          <p className="font-semibold text-white">Strict Password Enforcement Policy:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400">✓ At least 8 characters long</div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400">✓ At least 1 uppercase letter (A-Z)</div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400">✓ At least 1 lowercase letter (a-z)</div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400">✓ At least 1 number (0-9) & special char</div>
          </div>
        </div>
      ),
    },
    {
      num: 5,
      title: 'Project Conclusion & Demonstration',
      content: (
        <div className="space-y-6 text-center">
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            The SecureWiFi system successfully demonstrates a full-stack, secure, responsive wireless network access controller suitable for modern cyber defense deployments.
          </p>

          <button
            onClick={() => navigate('/first-access')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-cyan-500/25 inline-flex items-center gap-3 transition-all hover:scale-105"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start Live Demonstration</span>
          </button>
        </div>
      ),
    },
  ];

  const current = slides[slide - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Presentation className="w-6 h-6 text-purple-400" /> Project Presentation Mode
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            3RD-YEAR ENGINEERING VIVA & REVIEW SLIDE DECK
          </p>
        </div>

        <button
          onClick={() => navigate('/first-access')}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-md"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Start Live Demonstration</span>
        </button>
      </div>

      {/* Main Slide Presentation Deck Frame */}
      <div className="bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl p-8 lg:p-12 shadow-2xl backdrop-blur-xl relative min-h-[420px] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-purple-400">SLIDE {current.num} OF {slides.length}</span>
            <h3 className="text-xl font-extrabold text-white">{current.title}</h3>
          </div>

          <div className="py-4">{current.content}</div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6 font-mono text-xs">
          <button
            onClick={() => setSlide(Math.max(1, slide - 1))}
            disabled={slide === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-2">
            {slides.map((s) => (
              <button
                key={s.num}
                onClick={() => setSlide(s.num)}
                className={`w-3 h-3 rounded-full transition-all ${s.num === slide ? 'bg-purple-500 w-8' : 'bg-slate-800'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setSlide(Math.min(slides.length, slide + 1))}
            disabled={slide === slides.length}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl flex items-center gap-1.5 font-bold"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
