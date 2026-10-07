import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Wifi, Lock, Bell, Play, Presentation, UserCheck, LogOut, Activity, ChevronDown, Sliders } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { adminUser, isAdminLoggedIn, logoutAdmin, notifications, toggleDemoMode, activeDevice } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentPage = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Subtitle */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 absolute" />
            <Wifi className="w-3.5 h-3.5 text-cyan-200 translate-y-[1px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                SecureWiFi
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-full">
                v2.4 SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Password-Based First Access Authentication System
            </p>
          </div>
        </Link>

        {/* Center Live Network Status Badge */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-semibold">SSID: <span className="text-cyan-400">SecureWiFi_5G</span></span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>WPA2/WPA3 Enterprise</span>
          </div>
        </div>

        {/* Right Navigation & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Button */}
          <button
            onClick={() => {
              toggleDemoMode(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 transition-all hover:shadow-cyber-glow"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
            <span>Start Demo</span>
          </button>

          {/* Presentation Mode Link */}
          <Link
            to="/presentation"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isCurrentPage('/presentation')
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-purple-300 border border-purple-500/30'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Presentation</span>
          </Link>

          {/* Connect New Device CTA */}
          <Link
            to="/first-access"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md shadow-blue-600/20 transition-all"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Connect Device</span>
          </Link>

          {/* Active Device Session Indicator */}
          {activeDevice && (
            <Link
              to="/user-dashboard"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-mono"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span className="max-w-[90px] truncate">{activeDevice.device_name}</span>
            </Link>
          )}

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              title="Security Alerts"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-black font-extrabold text-[9px] rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-3 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold">
                  <span className="text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" /> Live Security Stream
                  </span>
                  <span className="text-[10px] text-slate-500">{notifications.length} alerts</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-[11px]">
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No recent security events</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded border text-slate-300 flex items-start gap-2 ${
                          n.type === 'danger'
                            ? 'bg-red-950/40 border-red-800/40 text-red-200'
                            : n.type === 'success'
                            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                            : n.type === 'warning'
                            ? 'bg-amber-950/40 border-amber-800/40 text-amber-200'
                            : 'bg-slate-800/60 border-slate-700/60'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        <p className="flex-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Menu / Login Link */}
          {isAdminLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-[10px]">
                  ADM
                </div>
                <span className="hidden md:inline font-mono">{adminUser?.username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-1 font-mono text-xs">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-slate-400 text-[10px]">Signed in as</p>
                    <p className="font-bold text-slate-200">{adminUser?.username}</p>
                  </div>
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Admin Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Network Settings
                  </Link>
                  <button
                    onClick={() => {
                      logoutAdmin();
                      setShowUserMenu(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-left border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out Admin
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/admin-login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
