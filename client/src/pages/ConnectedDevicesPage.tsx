import React, { useState, useEffect } from 'react';
import { Laptop, Search, Filter, ShieldOff, CheckCircle2, AlertOctagon, Eye, Trash2, ShieldCheck, RefreshCw, X } from 'lucide-react';
import { fetchDevices, updateDeviceStatus, revokeDeviceAccess, deleteDevice } from '../services/api';
import { Device } from '../types';
import { useAuth } from '../context/AuthContext';

export const ConnectedDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const { addNotification } = useAuth();

  const loadDevices = async () => {
    setLoading(true);
    try {
      const res = await fetchDevices(statusFilter, searchQuery);
      if (res.success) {
        setDevices(res.devices);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    try {
      const res = await updateDeviceStatus(id, newStatus);
      if (res.success) {
        addNotification('success', res.message);
        loadDevices();
      }
    } catch (err) {
      addNotification('danger', 'Failed to update status');
    }
  };

  const handleRevoke = async (id: number | string) => {
    try {
      const res = await revokeDeviceAccess(id);
      if (res.success) {
        addNotification('danger', res.message);
        loadDevices();
      }
    } catch (err) {
      addNotification('danger', 'Failed to revoke access');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to remove this device record?')) return;
    try {
      const res = await deleteDevice(id);
      if (res.success) {
        addNotification('info', res.message);
        loadDevices();
      }
    } catch (err) {
      addNotification('danger', 'Failed to delete device');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Connected Devices Management</h1>
          <p className="text-xs text-slate-400 font-mono">AUTHORIZED AND RESTRICTED NETWORK DEVICE REGISTRY</p>
        </div>

        <button
          onClick={loadDevices}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-cyan-400 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 text-xs font-mono w-full md:w-auto">
          {['All', 'Authorized', 'Pending', 'Blocked', 'Offline'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500 text-black font-extrabold border-cyan-400 shadow-cyber-glow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MAC, IP, Device Name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Device Name / ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Network IP / MAC</th>
                <th className="p-4">First Access</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No matching devices found in registry.
                  </td>
                </tr>
              ) : (
                devices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{dev.device_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">{dev.device_id}</span>
                    </td>

                    <td className="p-4 text-slate-200 font-semibold">{dev.username}</td>

                    <td className="p-4">
                      <span className="text-cyan-300 block">{dev.ip_address}</span>
                      <span className="text-[10px] text-slate-500">{dev.mac_address}</span>
                    </td>

                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(dev.first_access).toLocaleDateString()} {new Date(dev.first_access).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          dev.status === 'Authorized'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : dev.status === 'Pending'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : dev.status === 'Blocked'
                            ? 'bg-red-950/80 text-red-400 border-red-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {dev.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDevice(dev)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {dev.status === 'Authorized' && (
                          <button
                            onClick={() => handleRevoke(dev.id)}
                            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800"
                            title="Revoke Network Access"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {dev.status === 'Blocked' && (
                          <button
                            onClick={() => handleStatusChange(dev.id, 'Authorized')}
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                            title="Unblock & Authorize"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(dev.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800"
                          title="Delete Device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device View Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" /> Device Inspector
              </h3>
              <button onClick={() => setSelectedDevice(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p><span className="text-slate-500">Device Name:</span> <strong className="text-white">{selectedDevice.device_name}</strong></p>
              <p><span className="text-slate-500">Device ID:</span> <strong className="text-cyan-400">{selectedDevice.device_id}</strong></p>
              <p><span className="text-slate-500">Username:</span> <strong className="text-slate-200">{selectedDevice.username}</strong></p>
              <p><span className="text-slate-500">IP Address:</span> <strong>{selectedDevice.ip_address}</strong></p>
              <p><span className="text-slate-500">MAC Address:</span> <strong>{selectedDevice.mac_address}</strong></p>
              <p><span className="text-slate-500">Access Status:</span> <strong className="text-amber-400">{selectedDevice.status}</strong></p>
              <p><span className="text-slate-500">Failed Attempts:</span> <strong className="text-red-400">{selectedDevice.failed_attempts}/5</strong></p>
              <p><span className="text-slate-500">First Access:</span> {new Date(selectedDevice.first_access).toLocaleString()}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
