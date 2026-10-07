import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, ArrowRight, RotateCcw, Home, CheckCircle2, XCircle, Clock, Lock, Laptop, Cpu } from 'lucide-react';

export const AuthResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {
    success: true,
    status: 'Authorized',
    deviceName: 'Charan-Laptop',
    deviceId: 'DEV-2026-001',
    username: 'Charan',
    message: 'Authentication Successful',
    failedAttempts: 0,
    maxAttempts: 5,
    reason: null,
  };

  const isSuccess = state.success;
  const isBlocked = state.status === 'Blocked' || state.failedAttempts >= 5;

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div
        className={`bg-slate-900/95 border-2 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center space-y-6 ${
          isSuccess ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-red-500/50 shadow-red-500/10'
        }`}
      >
        <div
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 ${
            isSuccess
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-cyber-success'
              : 'bg-red-950/80 border-red-500 text-red-400 shadow-cyber-danger'
          }`}
        >
          {isSuccess ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
            {isSuccess ? 'Authentication Successful' : isBlocked ? 'Device Access Locked' : 'Authentication Failed'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {isSuccess ? 'IDENTITY & CREDENTIALS VERIFIED' : 'ACCESS VERIFICATION FAILED'}
          </p>
        </div>

        {/* Result Detail Grid */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left text-xs font-mono space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Device Name:
            </span>
            <span className="font-bold text-slate-200">{state.deviceName}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Device ID:
            </span>
            <span className="font-bold text-slate-200">{state.deviceId}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-500">Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                isSuccess
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {state.status.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-500">Network Access:</span>
            <span className={`font-bold ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
              {isSuccess ? 'GRANTED' : 'BLOCKED'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-500">Authentication Method:</span>
            <span className="text-slate-300">Password Verified</span>
          </div>

          {!isSuccess && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-500">Failed Attempts:</span>
              <span className="text-amber-400 font-bold">
                {state.failedAttempts} / {state.maxAttempts || 5}
              </span>
            </div>
          )}

          {state.reason && (
            <div className="pt-1 text-red-300">
              <span className="text-slate-500 block">Failure Reason:</span>
              <span className="font-semibold">{state.reason}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Timestamp:
            </span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {isSuccess ? (
            <Link
              to="/user-dashboard"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Enter Network Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              {!isBlocked && (
                <Link
                  to="/first-access"
                  className="flex-1 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <span>Try Again</span>
                </Link>
              )}
              <Link
                to="/"
                className="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
