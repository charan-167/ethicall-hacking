import React, { useState, useEffect } from 'react';
import { Network, Server, Cpu, Shield, Database, Laptop, Lock, Wifi, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { fetchNetworkTopology } from '../services/api';

export const NetworkTopologyPage: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchNetworkTopology()
      .then((res) => {
        if (res.success && res.nodes) {
          setNodes(res.nodes);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'cloud':
        return Server;
      case 'router':
        return Cpu;
      case 'gateway':
        return Shield;
      case 'firewall':
        return Lock;
      case 'database':
        return Database;
      default:
        return Laptop;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Interactive Network Topology</h1>
          <p className="text-xs text-slate-400 font-mono">
            LIVE GRAPHICAL REPRESENTATION OF CONNECTED BOUNDARIES & SECURITY NODES
          </p>
        </div>

        <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full text-xs font-mono">
          CLICK NODE FOR DETAILS
        </span>
      </div>

      {/* Interactive Topology Graph Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl relative shadow-2xl min-h-[500px]">
        {/* Core Infrastructure Pipeline Row */}
        <div className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono text-cyan-400 tracking-wider">INFRASTRUCTURE CORE LAYER</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {[
              { id: 'internet', name: 'INTERNET', sub: 'External Cloud', type: 'cloud', ip: '0.0.0.0' },
              { id: 'router', name: 'SECURE ROUTER', sub: '192.168.1.1', type: 'router', ip: '192.168.1.1' },
              { id: 'gateway', name: 'AUTH GATEWAY', sub: 'First Access Portal', type: 'gateway', ip: '192.168.1.2' },
              { id: 'firewall', name: 'FIREWALL', sub: 'Access Control Rules', type: 'firewall', ip: '192.168.1.3' },
              { id: 'db', name: 'USER & LOG DB', sub: 'SQLite / bcrypt Store', type: 'database', ip: '192.168.1.4' },
            ].map((n) => {
              const Icon = getNodeIcon(n.type);
              return (
                <button
                  key={n.id}
                  onClick={() =>
                    setSelectedNode({
                      label: n.name,
                      type: n.type,
                      ip: n.ip,
                      description: `${n.name} handles core network boundary processing and verification rules.`,
                      status: 'active',
                    })
                  }
                  className="bg-slate-950 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-4 text-center space-y-2 transition-all hover:scale-105 shadow-cyber-glow group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 mx-auto flex items-center justify-center text-cyan-400 group-hover:text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-white">{n.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{n.sub}</p>
                </button>
              );
            })}
          </div>

          {/* Connected Device Nodes Grid */}
          <div className="pt-8 border-t border-slate-800">
            <div className="text-center mb-6">
              <span className="text-xs font-mono text-cyan-400 tracking-wider">REGISTERED NETWORK DEVICES</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {nodes
                .filter((n) => n.type === 'device')
                .map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedNode(d)}
                    className={`p-4 rounded-2xl border text-left space-y-2 transition-all hover:scale-105 cursor-pointer ${
                      d.status === 'authorized'
                        ? 'bg-slate-950 border-emerald-500/40 hover:border-emerald-400'
                        : d.status === 'pending'
                        ? 'bg-slate-950 border-amber-500/40 hover:border-amber-400'
                        : 'bg-slate-950 border-red-500/40 hover:border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Laptop className="w-4 h-4 text-cyan-400" />
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          d.status === 'authorized'
                            ? 'bg-emerald-950 text-emerald-400'
                            : d.status === 'pending'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {d.status.toUpperCase()}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-white truncate">{d.label}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">{d.ip}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Details Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" /> Node Details
              </h3>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p><span className="text-slate-500">Node Identifier:</span> <strong className="text-white">{selectedNode.label}</strong></p>
              <p><span className="text-slate-500">Node Type:</span> <strong className="text-cyan-400">{selectedNode.type}</strong></p>
              <p><span className="text-slate-500">IP Address:</span> <strong>{selectedNode.ip}</strong></p>
              {selectedNode.mac && <p><span className="text-slate-500">MAC Address:</span> <strong>{selectedNode.mac}</strong></p>}
              {selectedNode.user && <p><span className="text-slate-500">Associated User:</span> <strong>{selectedNode.user}</strong></p>}
              <p><span className="text-slate-500">Current Status:</span> <strong className="text-emerald-400">{selectedNode.status}</strong></p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNode(null)}
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
