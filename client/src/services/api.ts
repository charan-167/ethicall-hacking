import { Device, AuthenticationLog, SecurityEvent, NetworkSettings, DashboardStats, AdminUser } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('securewifi_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Admin Auth APIs
export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; token?: string; user?: AdminUser; message?: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function verifyAdminToken(): Promise<{ success: boolean; authenticated: boolean; user?: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Device Access & Authentication APIs
export async function registerDevice(data: { device_name: string; username: string; device_id?: string; ip_address?: string; mac_address?: string }): Promise<{ success: boolean; requiresAuthentication?: boolean; device: Device; message?: string }> {
  const res = await fetch(`${API_BASE}/devices/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function authenticateDevice(data: { device_id: string; username?: string; password: string }): Promise<{
  success: boolean;
  status: string;
  device?: Device;
  message?: string;
  failed_attempts?: number;
  max_attempts?: number;
  reason?: string;
  policyFeedback?: string[];
}> {
  const res = await fetch(`${API_BASE}/authenticate/device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchDevices(status?: string, search?: string): Promise<{ success: boolean; count: number; devices: Device[] }> {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/devices?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function fetchDeviceById(id: string | number): Promise<{ success: boolean; device: Device; logs: AuthenticationLog[]; events: SecurityEvent[] }> {
  const res = await fetch(`${API_BASE}/devices/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function updateDeviceStatus(id: number | string, status: string): Promise<{ success: boolean; message: string; device?: Device }> {
  const res = await fetch(`${API_BASE}/devices/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function revokeDeviceAccess(id: number | string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/devices/${id}/revoke`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function deleteDevice(id: number | string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/devices/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Logs & Events APIs
export async function fetchAuthLogs(paramsObj?: { result?: string; search?: string; limit?: number }): Promise<{ success: boolean; count: number; logs: AuthenticationLog[] }> {
  const params = new URLSearchParams();
  if (paramsObj?.result && paramsObj.result !== 'All') params.append('result', paramsObj.result);
  if (paramsObj?.search) params.append('search', paramsObj.search);
  if (paramsObj?.limit) params.append('limit', String(paramsObj.limit));

  const res = await fetch(`${API_BASE}/logs/authentication?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function fetchSecurityEvents(severity?: string, limit: number = 50): Promise<{ success: boolean; count: number; events: SecurityEvent[] }> {
  const params = new URLSearchParams();
  if (severity && severity !== 'All') params.append('severity', severity);
  params.append('limit', String(limit));

  const res = await fetch(`${API_BASE}/logs/security?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Dashboard APIs
export async function fetchDashboardStats(): Promise<{ success: boolean; statistics: DashboardStats }> {
  const res = await fetch(`${API_BASE}/dashboard/statistics`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function fetchDashboardActivity(): Promise<{
  success: boolean;
  statusDistribution: Array<{ name: string; value: number }>;
  resultDistribution: Array<{ name: string; value: number }>;
  hourlyData: Array<{ hour: string; success: number; failed: number }>;
  recentAlerts: SecurityEvent[];
}> {
  const res = await fetch(`${API_BASE}/dashboard/activity`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function fetchNetworkTopology(): Promise<{ success: boolean; nodes: any[]; totalDevices: number }> {
  const res = await fetch(`${API_BASE}/network/topology`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Settings APIs
export async function fetchNetworkSettings(): Promise<{ success: boolean; settings: NetworkSettings; rawSettings: any[] }> {
  const res = await fetch(`${API_BASE}/network/settings`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function updateNetworkSettings(settings: Partial<NetworkSettings>): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/network/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ settings }),
  });
  return res.json();
}

// Reports APIs
export async function fetchReportsData(): Promise<{
  success: boolean;
  reportTimestamp: string;
  summary: {
    totalDevices: number;
    authorizedDevices: number;
    pendingDevices: number;
    blockedDevices: number;
    totalLogs: number;
    successfulLogs: number;
    failedLogs: number;
    blockedLogs: number;
    successRate: string;
    failureRate: string;
  };
  criticalEvents: SecurityEvent[];
}> {
  const res = await fetch(`${API_BASE}/reports/security`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Simulator API
export async function runSimulationStep(action: string, deviceId?: string): Promise<{ success: boolean; action: string; message: string; status?: string; failed_attempts?: number }> {
  const res = await fetch(`${API_BASE}/simulator/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, deviceId }),
  });
  return res.json();
}
