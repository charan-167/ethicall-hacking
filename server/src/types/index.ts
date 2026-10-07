export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
  last_login?: string;
}

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

export interface NetworkSetting {
  id: number;
  setting_name: string;
  setting_value: string;
  updated_at: string;
}
