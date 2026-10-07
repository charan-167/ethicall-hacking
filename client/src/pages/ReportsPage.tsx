import React, { useEffect, useState, useRef } from 'react';
import { BarChart3, Download, Printer, Shield, CheckCircle2, AlertOctagon, FileText, Calendar } from 'lucide-react';
import { fetchReportsData } from '../services/api';
import { SecurityEvent } from '../types';

export const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReportsData()
      .then((res) => {
        if (res.success) {
          setReportData(res);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  const summary = reportData?.summary || {
    totalDevices: 128,
    authorizedDevices: 104,
    pendingDevices: 15,
    blockedDevices: 9,
    totalLogs: 50,
    successfulLogs: 42,
    failedLogs: 6,
    blockedLogs: 2,
    successRate: '84.0%',
    failureRate: '16.0%',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Security & Audit Reporting</h1>
          <p className="text-xs text-slate-400 font-mono">
            COMPREHENSIVE ENGINEERING EVALUATION & COMPLIANCE REPORT
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Printable Report View Container */}
      <div ref={reportRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 print:border-gray-300 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 print:text-cyan-800 font-mono font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>SECUREWIFI NETWORK ACCESS AUDIT REPORT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white print:text-black">
              Design of a Secure Wireless Network with Password-Based Authentication for First Access
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
              3rd-Year Engineering AI & Data Science Project
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-gray-600">
            <p className="flex items-center gap-1 justify-end">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 print:text-black" /> Date: {new Date().toLocaleDateString()}
            </p>
            <p>Generated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white print:text-black font-mono">1. EXECUTIVE SUMMARY METRICS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-2xl">
              <span className="text-slate-500 print:text-gray-600 block">Total Devices</span>
              <strong className="text-xl text-white print:text-black">{summary.totalDevices}</strong>
            </div>

            <div className="p-4 bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-2xl">
              <span className="text-slate-500 print:text-gray-600 block">Authorized</span>
              <strong className="text-xl text-emerald-400 print:text-emerald-700">{summary.authorizedDevices}</strong>
            </div>

            <div className="p-4 bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-2xl">
              <span className="text-slate-500 print:text-gray-600 block">Pending Auth</span>
              <strong className="text-xl text-amber-300 print:text-amber-700">{summary.pendingDevices}</strong>
            </div>

            <div className="p-4 bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-2xl">
              <span className="text-slate-500 print:text-gray-600 block">Blocked Devices</span>
              <strong className="text-xl text-red-400 print:text-red-700">{summary.blockedDevices}</strong>
            </div>

            <div className="p-4 bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-2xl">
              <span className="text-slate-500 print:text-gray-600 block">Success Rate</span>
              <strong className="text-xl text-cyan-300 print:text-cyan-800">{summary.successRate}</strong>
            </div>

            <div className="p-4 bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-2xl">
              <span className="text-slate-500 print:text-gray-600 block">Failure Rate</span>
              <strong className="text-xl text-red-400 print:text-red-700">{summary.failureRate}</strong>
            </div>
          </div>
        </div>

        {/* Security Events Audit Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white print:text-black font-mono">2. CRITICAL SECURITY EVENTS AUDIT</h3>
          <div className="border border-slate-800 print:border-gray-300 rounded-2xl overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 print:bg-gray-200 border-b border-slate-800 print:border-gray-300 text-slate-400 print:text-black">
                <tr>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-300">
                {(reportData?.criticalEvents || []).slice(0, 5).map((ev: SecurityEvent) => (
                  <tr key={ev.id}>
                    <td className="p-3">
                      <span className="font-bold text-red-400 print:text-red-700">{ev.severity}</span>
                    </td>
                    <td className="p-3 font-semibold text-cyan-300 print:text-black">{ev.event_type}</td>
                    <td className="p-3 text-slate-300 print:text-black">{ev.description}</td>
                    <td className="p-3 text-slate-500 print:text-gray-600">{new Date(ev.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
