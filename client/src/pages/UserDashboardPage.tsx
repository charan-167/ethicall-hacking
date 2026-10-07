import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wifi, ShieldCheck, Laptop, Clock, Power, CheckCircle2, ArrowRight, Activity, Lock, Cpu, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserDashboardPage: React.FC = () => {
  const { activeDevice, setActiveDeviceSession, addNotification } = useAuth();
  const navigate = useNavigate();

  const device = activeDevice || {
    device_id: 'DEV-2026-001',
    device_name: 'Charan-Laptop',
    username: 'Charan',
    ip_address: '192.168.1.20',
    mac_address: '00:1A:2B:3C:4D:5E',
    status: 'Authorized',
    first_access: new Date().toISOString(),
    authorized_at: new Date().toISOString(),
    last_seen: new Date().toISOString(),
    failed_attempts: 0,
    id: 1,
    created_at: new Date().toISOString(),
  };

  const [sessionSeconds, setSessionSeconds] = useState<number>(142);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDisconnect = () => {
    setActiveDeviceSession(null);
    addNotification('warning', `Device ${device.device_name} disconnected from SecureWiFi.`);
    navigate('/');
  };

  const timelineSteps = [
    { label: 'Device Detected', desc: 'MAC Address Logged', icon: Laptop, status: 'complete' },
    { label: 'Auth Requested', desc: 'Captive Portal Redirect', icon: ShieldCheck, status: 'complete' },
    { label: 'Password Verified', desc: 'bcrypt Hash Check', icon: Lock, status: 'complete' },
    { label: 'Device Authorized', desc: 'Firewall Policy Rule', icon: CheckCircle2, status: 'complete' },
    { label: 'Access Granted', desc: 'Full Wireless Gateway', icon: Wifi, status: 'active' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>NETWORK SESSION ACTIVE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {device.username}</h1>
          <p className="text-xs text-slate-400 font-mono">
            Device: <span className="text-cyan-400 font-semibold">{device.device_name}</span> ({device.device_id})
          </p>
        </div>

        <button
          onClick={handleDisconnect}
          className="px-5 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold font-mono flex items-center gap-2 transition-all hover:shadow-cyber-danger"
        >
          <Power className="w-4 h-4" />
          <span>Disconnect Device</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Network Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Network Status</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">CONNECTED</p>
          <p className="text-[11px] text-slate-500 font-mono">SSID: SecureWiFi_5G</p>
        </div>

        {/* Authentication Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Authentication</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-cyan-300">AUTHORIZED</p>
          <p className="text-[11px] text-slate-500 font-mono">Method: Password (bcrypt)</p>
        </div>

        {/* Device Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Assigned IP</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{device.ip_address}</p>
          <p className="text-[11px] text-slate-500 font-mono">MAC: {device.mac_address}</p>
        </div>

        {/* Session Duration */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Session Duration</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-amber-300 font-mono">{formatDuration(sessionSeconds)}</p>
          <p className="text-[11px] text-slate-500 font-mono">Timeout: 30 minutes</p>
        </div>
      </div>

      {/* Connection Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Device Authentication Flow Timeline</h3>
            <p className="text-xs text-slate-400 font-mono">Sequential verification steps executed during connection</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
            100% VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {timelineSteps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 relative flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">STEP {idx + 1}</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white">{st.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{st.desc}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono pt-1 border-t border-slate-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>COMPLETED</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
