import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, RefreshCw, CheckCircle2, XCircle, AlertOctagon } from 'lucide-react';
import { fetchAuthLogs } from '../services/api';
import { AuthenticationLog } from '../types';

export const AuthLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuthenticationLog[]>([]);
  const [resultFilter, setResultFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetchAuthLogs({ result: resultFilter, search: searchQuery, limit: 100 });
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Error fetching auth logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [resultFilter, searchQuery]);

  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = ['ID', 'Timestamp', 'Device ID', 'Username', 'IP Address', 'Auth Method', 'Result', 'Reason'];
    const csvRows = [headers.join(',')];

    logs.forEach((l) => {
      const row = [
        l.id,
        `"${new Date(l.timestamp).toLocaleString()}"`,
        `"${l.device_id}"`,
        `"${l.username}"`,
        `"${l.ip_address}"`,
        `"${l.authentication_method}"`,
        `"${l.result}"`,
        `"${l.failure_reason || ''}"`,
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SecureWiFi_Auth_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Authentication Audit Logs</h1>
          <p className="text-xs text-slate-400 font-mono">
            HISTORICAL AUDIT TRAIL OF FIRST ACCESS & CREDENTIAL VERIFICATIONS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadLogs}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {['All', 'SUCCESS', 'FAILED', 'BLOCKED'].map((res) => (
            <button
              key={res}
              onClick={() => setResultFilter(res)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                resultFilter === res
                  ? 'bg-cyan-500 text-black font-extrabold border-cyan-400 shadow-cyber-glow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {res}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Device ID, User, IP..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Device ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Method</th>
                <th className="p-4">Result</th>
                <th className="p-4">Failure Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No authentication logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-4 font-bold text-cyan-300">{log.device_id}</td>
                    <td className="p-4 text-slate-200">{log.username}</td>
                    <td className="p-4 text-slate-300">{log.ip_address}</td>
                    <td className="p-4 text-slate-400">{log.authentication_method}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                          log.result === 'SUCCESS'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : log.result === 'FAILED'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : 'bg-red-950/80 text-red-400 border-red-800'
                        }`}
                      >
                        {log.result === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                        {log.result === 'FAILED' && <XCircle className="w-3 h-3" />}
                        {log.result === 'BLOCKED' && <AlertOctagon className="w-3 h-3" />}
                        {log.result}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 italic text-[11px]">{log.failure_reason || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
