import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Wifi, Lock, AlertTriangle, Eye, EyeOff, Cpu, Laptop, User, CheckCircle2 } from 'lucide-react';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { registerDevice, authenticateDevice } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const FirstAccessPortalPage: React.FC = () => {
  const [deviceName, setDeviceName] = useState('Charan-Laptop');
  const [deviceId, setDeviceId] = useState('DEV-2026-001');
  const [username, setUsername] = useState('Charan');
  const [password, setPassword] = useState('SecureWiFi2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { setActiveDeviceSession, addNotification } = useAuth();

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName || !username || !password) {
      setErrorMsg('Please fill in all required authentication fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Register or lookup device in backend DB
      const regRes = await registerDevice({
        device_id: deviceId,
        device_name: deviceName,
        username,
      });

      // 2. Perform backend authentication
      const authRes = await authenticateDevice({
        device_id: deviceId,
        username,
        password,
      });

      if (authRes.device) {
        setActiveDeviceSession(authRes.device);
      }

      // Navigate to Auth Result page carrying state
      navigate('/auth-result', {
        state: {
          success: authRes.success,
          status: authRes.status,
          deviceName,
          deviceId,
          username,
          message: authRes.message,
          failedAttempts: authRes.failed_attempts || 0,
          maxAttempts: authRes.max_attempts || 5,
          reason: authRes.reason,
          policyFeedback: authRes.policyFeedback,
        },
      });

      addNotification(authRes.success ? 'success' : 'danger', authRes.message || 'Authentication process finished.');
    } catch (err: any) {
      setErrorMsg('Network error connecting to authentication server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Portal Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800/60 text-cyan-400 shadow-cyber-glow">
            <Wifi className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Connect to SecureWiFi</h1>
          <p className="text-xs text-slate-400 font-mono">FIRST ACCESS CAPTIVE AUTHENTICATION PORTAL</p>
        </div>

        {/* Network Metadata Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Target Network:</span>
            <span className="font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
              <Wifi className="w-3.5 h-3.5" /> SecureWiFi_5G
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Security Protocol:</span>
            <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" /> WPA2/WPA3 Enterprise
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Access Status:</span>
            <span className="font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 animate-pulse" /> NEW DEVICE DETECTED
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-950/40 border border-amber-800/50 rounded-2xl p-4 mb-6 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-300">First Access Verification Required</h4>
            <p className="text-slate-300 mt-1 leading-relaxed">
              This device has not previously authenticated with this network. Authentication is required before network access is granted.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthenticate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Device Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Device Name
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors font-mono"
                placeholder="e.g. Charan-Laptop"
              />
            </div>

            {/* Device ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Device ID
              </label>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors font-mono"
                placeholder="e.g. DEV-2026-001"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors font-mono"
              placeholder="e.g. Charan"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Try correct: SecureWiFi2026! or wrong: 12345</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors font-mono pr-10"
                placeholder="Enter network access password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator Component */}
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
            <span>QUICK PRESETS:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPassword('SecureWiFi2026!');
                  setDeviceId('DEV-2026-001');
                }}
                className="text-cyan-400 hover:underline"
              >
                [Valid Password]
              </button>
              <button
                type="button"
                onClick={() => {
                  setPassword('wrong');
                }}
                className="text-red-400 hover:underline"
              >
                [Wrong Password]
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Verifying Credentials...
              </span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Authenticate Device</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
