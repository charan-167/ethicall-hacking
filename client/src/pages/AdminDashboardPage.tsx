import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Activity,
  BarChart2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { fetchDashboardStats, fetchDashboardActivity } from '../services/api';
import { DashboardStats, SecurityEvent } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 128,
    authorizedDevices: 104,
    pendingDevices: 15,
    blockedDevices: 9,
    offlineDevices: 0,
    successfulLogins: 42,
    failedAttempts: 8,
  });

  const [statusDist, setStatusDist] = useState<Array<{ name: string; value: number }>>([
    { name: 'Authorized', value: 104 },
    { name: 'Pending', value: 15 },
    { name: 'Blocked', value: 9 },
  ]);

  const [resultDist, setResultDist] = useState<Array<{ name: string; value: number }>>([
    { name: 'SUCCESS', value: 42 },
    { name: 'FAILED', value: 8 },
  ]);

  const [hourlyData, setHourlyData] = useState<Array<{ hour: string; success: number; failed: number }>>([
    { hour: '00:00', success: 4, failed: 1 },
    { hour: '03:00', success: 2, failed: 0 },
    { hour: '06:00', success: 6, failed: 2 },
    { hour: '09:00', success: 18, failed: 4 },
    { hour: '12:00', success: 25, failed: 6 },
    { hour: '15:00', success: 32, failed: 9 },
    { hour: '18:00', success: 20, failed: 3 },
    { hour: '21:00', success: 12, failed: 2 },
  ]);

  const [alerts, setAlerts] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([fetchDashboardStats(), fetchDashboardActivity()]);
      if (sRes.success && sRes.statistics) {
        setStats(sRes.statistics);
      }
      if (aRes.success) {
        if (aRes.statusDistribution?.length) setStatusDist(aRes.statusDistribution);
        if (aRes.resultDistribution?.length) setResultDist(aRes.resultDistribution);
        if (aRes.hourlyData?.length) setHourlyData(aRes.hourlyData);
        if (aRes.recentAlerts?.length) setAlerts(aRes.recentAlerts);
      }
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const PIE_COLORS = {
    Authorized: '#10b981',
    Pending: '#f59e0b',
    Blocked: '#ef4444',
    Offline: '#64748b',
    SUCCESS: '#06b6d4',
    FAILED: '#ef4444',
    BLOCKED: '#dc2626',
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Title & Refresh Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Network Security Dashboard</h1>
          <p className="text-xs text-slate-400 font-mono">
            REAL-TIME WIRELESS ACCESS MONITORING & THREAT CONTROL CONSOLE
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-xl text-xs font-mono text-cyan-400 flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top 6 Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Devices */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL DEVICES</span>
            <Laptop className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{stats.totalDevices}</p>
          <p className="text-[10px] text-slate-500 font-mono">100% Registered</p>
        </div>

        {/* Authorized Devices */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>AUTHORIZED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{stats.authorizedDevices}</p>
          <p className="text-[10px] text-emerald-500/80 font-mono">Full Gateway Access</p>
        </div>

        {/* Pending Devices */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PENDING</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-300 font-mono">{stats.pendingDevices}</p>
          <p className="text-[10px] text-amber-500/80 font-mono">Awaiting Password</p>
        </div>

        {/* Blocked Devices */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>BLOCKED</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-extrabold text-red-400 font-mono">{stats.blockedDevices}</p>
          <p className="text-[10px] text-red-500/80 font-mono">Locked & Blacklisted</p>
        </div>

        {/* Successful Logins */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SUCCESS LOGINS</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-300 font-mono">{stats.successfulLogins}</p>
          <p className="text-[10px] text-cyan-500/80 font-mono">bcrypt Verified</p>
        </div>

        {/* Failed Attempts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>FAILED ATTEMPTS</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-extrabold text-red-400 font-mono">{stats.failedAttempts}</p>
          <p className="text-[10px] text-red-500/80 font-mono">Logged & Audited</p>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Hourly Authentication Activity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Authentication Activity by Hour
            </h3>
            <span className="text-[10px] font-mono text-slate-400">24-HOUR TREND</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="success" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSuccess)" name="Successful Auth" />
                <Area type="monotone" dataKey="failed" stroke="#ef4444" fillOpacity={1} fill="url(#colorFailed)" name="Failed Attempts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Device Status Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" /> Device Access Status Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-400">DEVICE REGISTRY</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={(PIE_COLORS as any)[entry.name] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Security Alerts Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Live Security Alert Stream</h3>
          </div>
          <Link to="/security-events" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono">
            <span>View All Security Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {alerts.slice(0, 5).map((ev) => (
            <div
              key={ev.id}
              className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ev.severity === 'CRITICAL'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : ev.severity === 'HIGH'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-slate-800 text-cyan-300'
                  }`}
                >
                  {ev.severity}
                </span>
                <span className="text-slate-200">{ev.description}</span>
              </div>
              <span className="text-slate-500 text-[11px] shrink-0">
                {new Date(ev.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
