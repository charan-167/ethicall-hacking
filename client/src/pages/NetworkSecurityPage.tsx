import React, { useState, useEffect } from 'react';
import { Lock, Shield, Sliders, Save, CheckCircle2, RefreshCw, Key, Clock, ShieldAlert } from 'lucide-react';
import { fetchNetworkSettings, updateNetworkSettings } from '../services/api';
import { NetworkSettings } from '../types';
import { useAuth } from '../context/AuthContext';

export const NetworkSecurityPage: React.FC = () => {
  const [settings, setSettings] = useState<NetworkSettings>({
    wireless_encryption: 'WPA2/WPA3 Enterprise Simulation',
    authentication_type: 'Password-Based First Access',
    first_access_auth: 'enabled',
    device_authorization: 'enabled',
    failed_attempt_protection: 'enabled',
    max_failed_attempts: '5',
    rate_limiting: 'enabled',
    password_hashing_algo: 'bcrypt',
    session_timeout_minutes: '30',
    network_ssid: 'SecureWiFi_5G',
    network_gateway_ip: '192.168.1.1',
    captive_portal_status: 'Active',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addNotification } = useAuth();

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetchNetworkSettings();
      if (res.success && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateNetworkSettings(settings);
      if (res.success) {
        addNotification('success', 'Security configuration saved and persisted to database!');
      } else {
        addNotification('danger', 'Failed to save settings.');
      }
    } catch (err) {
      addNotification('danger', 'Error updating security settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof NetworkSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === 'enabled' ? 'disabled' : 'enabled',
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Network Security Configuration</h1>
          <p className="text-xs text-slate-400 font-mono">
            HARDENING PARAMETERS & AUTHENTICATION GATEWAY POLICY ENGINE
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload DB Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Wireless Security Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Wireless Security Controls</h3>
              <p className="text-xs text-slate-400 font-mono">Core Wi-Fi encryption and authentication parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Encryption Standard */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">Encryption Standard:</label>
              <input
                type="text"
                value={settings.wireless_encryption}
                onChange={(e) => setSettings({ ...settings, wireless_encryption: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            {/* Password Hashing Algorithm */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">Password Hashing Algorithm:</label>
              <select
                value={settings.password_hashing_algo}
                onChange={(e) => setSettings({ ...settings, password_hashing_algo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-white outline-none"
              >
                <option value="bcrypt">bcrypt (Salting + 10 Rounds)</option>
                <option value="argon2">Argon2id (Memory Hardened)</option>
                <option value="pbkdf2">PBKDF2 (SHA-256)</option>
              </select>
            </div>

            {/* Max Failed Attempts */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">Max Failed Attempts Before Lockout:</label>
              <input
                type="number"
                value={settings.max_failed_attempts}
                onChange={(e) => setSettings({ ...settings, max_failed_attempts: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            {/* Session Timeout */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">Session Timeout (Minutes):</label>
              <input
                type="number"
                value={settings.session_timeout_minutes}
                onChange={(e) => setSettings({ ...settings, session_timeout_minutes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Policy Toggles */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Active Policy Engine Toggles</h3>
              <p className="text-xs text-slate-400 font-mono">Dynamic enforcement rules evaluated during network access</p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Toggle 1: First Access Auth */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <p className="font-bold text-white">First Access Authentication</p>
                <p className="text-[11px] text-slate-400">Require captive portal password for all unverified MAC addresses</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('first_access_auth')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  settings.first_access_auth === 'enabled'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-cyber-success'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {settings.first_access_auth.toUpperCase()}
              </button>
            </div>

            {/* Toggle 2: Device Authorization */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <p className="font-bold text-white">Device Authorization Enforcement</p>
                <p className="text-[11px] text-slate-400">Block packets until status transitions to AUTHORIZED</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('device_authorization')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  settings.device_authorization === 'enabled'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-cyber-success'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {settings.device_authorization.toUpperCase()}
              </button>
            </div>

            {/* Toggle 3: Failed Attempt Lockout */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <p className="font-bold text-white">Failed Attempt Protection & Lockout</p>
                <p className="text-[11px] text-slate-400">Automatically blacklist device after 5 consecutive bad passwords</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('failed_attempt_protection')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  settings.failed_attempt_protection === 'enabled'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-cyber-success'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {settings.failed_attempt_protection.toUpperCase()}
              </button>
            </div>

            {/* Toggle 4: Rate Limiting */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div>
                <p className="font-bold text-white">Rate Limiting Protection</p>
                <p className="text-[11px] text-slate-400">Prevent brute force API spamming using IP window counters</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('rate_limiting')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  settings.rate_limiting === 'enabled'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-cyber-success'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {settings.rate_limiting.toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all font-mono"
          >
            {saving ? (
              <span>Saving Security Parameters...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Persist Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
