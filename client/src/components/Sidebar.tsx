import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wifi,
  Laptop,
  FileText,
  ShieldAlert,
  Network,
  Lock,
  BarChart3,
  Cpu,
  Presentation,
  Info,
  Sliders,
} from 'lucide-react';

interface Props {
  collapsed?: boolean;
}

export const Sidebar: React.FC<Props> = ({ collapsed = false }) => {
  const navItems = [
    { label: 'Admin Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { label: 'First Access Portal', path: '/first-access', icon: Wifi },
    { label: 'Connected Devices', path: '/devices', icon: Laptop },
    { label: 'Authentication Logs', path: '/logs', icon: FileText },
    { label: 'Security Events', path: '/security-events', icon: ShieldAlert },
    { label: 'Network Topology', path: '/topology', icon: Network },
    { label: 'Security Settings', path: '/security-settings', icon: Lock },
    { label: 'Security Reports', path: '/reports', icon: BarChart3 },
    { label: 'Event Simulator', path: '/simulator', icon: Cpu, badge: 'VIVA DEMO' },
    { label: 'Presentation Mode', path: '/presentation', icon: Presentation },
    { label: 'Global Settings', path: '/settings', icon: Sliders },
    { label: 'About Project', path: '/about', icon: Info },
  ];

  return (
    <aside
      className={`bg-[#0a0e17] border-r border-slate-800/80 min-h-[calc(100vh-61px)] transition-all duration-300 flex flex-col justify-between shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-4 px-3 space-y-1">
        <div className={`px-3 py-2 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? 'NAV' : 'MAIN NAVIGATION'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-cyber-glow'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Sidebar Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 font-mono text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>NETWORK STATE</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <p className="text-[10px] text-slate-400">Gateway: 192.168.1.1</p>
          <p className="text-[10px] text-slate-400">Encryption: WPA2/3 Ent</p>
        </div>
      )}
    </aside>
  );
};
