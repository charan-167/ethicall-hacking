export type DeviceStatus = 'Authorized' | 'Pending' | 'Blocked' | 'Offline';

export interface Device {
  id: number;
  device_id: string;
  device_name: string;
  username: string;
  ip_address: string;
  mac_address: string;
  status: DeviceStatus;
  first_access: string;
  authorized_at?: string | null;
  last_seen: string;
  failed_attempts: number;
  created_at: string;
}

export interface AuthenticationLog {
  id: number;
  device_id: string;
  username: string;
  timestamp: string;
  ip_address: string;
  authentication_method: string;
  result: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  failure_reason?: string | null;
}

export interface SecurityEvent {
  id: number;
  event_type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  device_id?: string | null;
  timestamp: string;
}

export interface NetworkSettings {
  wireless_encryption: string;
  authentication_type: string;
  first_access_auth: string;
  device_authorization: string;
  failed_attempt_protection: string;
  max_failed_attempts: string;
  rate_limiting: string;
  password_hashing_algo: string;
  session_timeout_minutes: string;
  network_ssid: string;
  network_gateway_ip: string;
  captive_portal_status: string;
}

export interface DashboardStats {
  totalDevices: number;
  authorizedDevices: number;
  pendingDevices: number;
  blockedDevices: number;
  offlineDevices: number;
  successfulLogins: number;
  failedAttempts: number;
}

export interface AdminUser {
  id: number;
  username: string;
  role: string;
}
