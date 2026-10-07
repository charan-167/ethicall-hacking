import { getDb } from './db';
import { hashPassword } from '../utils/auth';

export async function seedDatabase() {
  const db = await getDb();
  console.log('🌱 Seeding SecureWiFi database...');

  // 1. Seed Admin User
  const existingUser = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!existingUser) {
    const defaultPasswordHash = await hashPassword('AdminPass123!');
    await db.run(
      'INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      ['admin', defaultPasswordHash, 'admin']
    );
    console.log('✅ Created default admin user: admin / AdminPass123!');
  }

  // 2. Seed Network Settings
  const defaultSettings = [
    { setting_name: 'wireless_encryption', setting_value: 'WPA2/WPA3 Enterprise Simulation' },
    { setting_name: 'authentication_type', setting_value: 'Password-Based First Access' },
    { setting_name: 'first_access_auth', setting_value: 'enabled' },
    { setting_name: 'device_authorization', setting_value: 'enabled' },
    { setting_name: 'failed_attempt_protection', setting_value: 'enabled' },
    { setting_name: 'max_failed_attempts', setting_value: '5' },
    { setting_name: 'rate_limiting', setting_value: 'enabled' },
    { setting_name: 'password_hashing_algo', setting_value: 'bcrypt' },
    { setting_name: 'session_timeout_minutes', setting_value: '30' },
    { setting_name: 'network_ssid', setting_value: 'SecureWiFi_5G' },
    { setting_name: 'network_gateway_ip', setting_value: '192.168.1.1' },
    { setting_name: 'captive_portal_status', setting_value: 'Active' },
  ];

  for (const s of defaultSettings) {
    await db.run(
      `INSERT OR REPLACE INTO network_settings (setting_name, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [s.setting_name, s.setting_value]
    );
  }
  console.log('✅ Network settings populated');

  // 3. Seed Devices (20 Devices)
  const deviceCount = await db.get('SELECT COUNT(*) as count FROM devices');
  if (deviceCount.count === 0) {
    const sampleDevices = [
      { id: 'DEV-2026-001', name: 'Charan-Laptop', user: 'Charan', ip: '192.168.1.20', mac: '00:1A:2B:3C:4D:5E', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-002', name: 'Student-Mobile', user: 'User01', ip: '192.168.1.21', mac: '12:34:56:78:9A:BC', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-003', name: 'Unknown-Device', user: 'Guest_99', ip: '192.168.1.22', mac: 'AA:BB:CC:DD:EE:FF', status: 'Pending', attempts: 1 },
      { id: 'DEV-2026-004', name: 'Unknown-Laptop', user: 'Attacker_X', ip: '192.168.1.23', mac: 'FE:DC:BA:98:76:54', status: 'Blocked', attempts: 5 },
      { id: 'DEV-2026-005', name: 'Rahul-MacBook', user: 'Rahul', ip: '192.168.1.24', mac: '08:00:27:11:22:33', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-006', name: 'Priya-iPhone', user: 'Priya', ip: '192.168.1.25', mac: 'A4:B8:C2:D1:E5:F6', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-007', name: 'Lab-Workstation-01', user: 'LabAdmin', ip: '192.168.1.26', mac: '50:E5:49:12:34:56', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-008', name: 'Rogue-Access-Point', user: 'Unknown', ip: '192.168.1.27', mac: 'DE:AD:BE:EF:00:01', status: 'Blocked', attempts: 5 },
      { id: 'DEV-2026-009', name: 'Kiran-ThinkPad', user: 'Kiran', ip: '192.168.1.28', mac: 'BC:D1:D2:E3:F4:05', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-010', name: 'Test-Tablet-Pro', user: 'Tester', ip: '192.168.1.29', mac: '34:97:F6:11:22:33', status: 'Pending', attempts: 2 },
      { id: 'DEV-2026-011', name: 'Sneha-Pixel-8', user: 'Sneha', ip: '192.168.1.30', mac: '44:65:0D:88:99:AA', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-012', name: 'Unidentified-IoT-Cam', user: 'IoT_Sensor', ip: '192.168.1.31', mac: '00:0e:c6:88:99:bb', status: 'Pending', attempts: 0 },
      { id: 'DEV-2026-013', name: 'Suspicious-Probe', user: 'Scanner', ip: '192.168.1.32', mac: 'BA:DD:00:FF:EE:DD', status: 'Blocked', attempts: 5 },
      { id: 'DEV-2026-014', name: 'Anil-Desktop', user: 'Anil', ip: '192.168.1.33', mac: '00:15:5d:01:02:03', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-015', name: 'Visitor-Phone-A', user: 'Visitor1', ip: '192.168.1.34', mac: '66:77:88:99:00:11', status: 'Offline', attempts: 0 },
      { id: 'DEV-2026-016', name: 'Visitor-Phone-B', user: 'Visitor2', ip: '192.168.1.35', mac: '22:33:44:55:66:77', status: 'Offline', attempts: 0 },
      { id: 'DEV-2026-017', name: 'Faculty-Surface', user: 'Dr_Sharma', ip: '192.168.1.36', mac: '88:99:AA:BB:CC:DD', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-018', name: 'BruteForce-Bot', user: 'Admin_Guess', ip: '192.168.1.37', mac: '99:88:77:66:55:44', status: 'Blocked', attempts: 5 },
      { id: 'DEV-2026-019', name: 'SmartTV-Conference', user: 'ConfRoom', ip: '192.168.1.38', mac: 'AC:DE:48:11:22:33', status: 'Authorized', attempts: 0 },
      { id: 'DEV-2026-020', name: 'New-Student-iPad', user: 'Freshman_20', ip: '192.168.1.39', mac: '77:66:55:44:33:22', status: 'Pending', attempts: 0 },
    ];

    for (const dev of sampleDevices) {
      const now = new Date().toISOString();
      const authTime = dev.status === 'Authorized' ? now : null;
      await db.run(
        `INSERT INTO devices (device_id, device_name, username, ip_address, mac_address, status, first_access, authorized_at, last_seen, failed_attempts, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [dev.id, dev.name, dev.user, dev.ip, dev.mac, dev.status, now, authTime, now, dev.attempts, now]
      );
    }
    console.log('✅ Seeded 20 sample devices');
  }

  // 4. Seed Authentication Logs (50 Logs)
  const logCount = await db.get('SELECT COUNT(*) as count FROM authentication_logs');
  if (logCount.count === 0) {
    const logs = [
      { id: 'DEV-2026-001', user: 'Charan', ip: '192.168.1.20', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-002', user: 'User01', ip: '192.168.1.21', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-004', user: 'Attacker_X', ip: '192.168.1.23', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-004', user: 'Attacker_X', ip: '192.168.1.23', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-004', user: 'Attacker_X', ip: '192.168.1.23', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-004', user: 'Attacker_X', ip: '192.168.1.23', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-004', user: 'Attacker_X', ip: '192.168.1.23', result: 'BLOCKED', reason: 'Max failed attempts limit reached (5)' },
      { id: 'DEV-2026-005', user: 'Rahul', ip: '192.168.1.24', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-006', user: 'Priya', ip: '192.168.1.25', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-007', user: 'LabAdmin', ip: '192.168.1.26', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-008', user: 'Unknown', ip: '192.168.1.27', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-008', user: 'Unknown', ip: '192.168.1.27', result: 'BLOCKED', reason: 'Device blacklisted by administrator' },
      { id: 'DEV-2026-009', user: 'Kiran', ip: '192.168.1.28', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-010', user: 'Tester', ip: '192.168.1.29', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-010', user: 'Tester', ip: '192.168.1.29', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-011', user: 'Sneha', ip: '192.168.1.30', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-013', user: 'Scanner', ip: '192.168.1.32', result: 'FAILED', reason: 'Brute force detection trigger' },
      { id: 'DEV-2026-013', user: 'Scanner', ip: '192.168.1.32', result: 'BLOCKED', reason: 'Automatic security lockout' },
      { id: 'DEV-2026-014', user: 'Anil', ip: '192.168.1.33', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-017', user: 'Dr_Sharma', ip: '192.168.1.36', result: 'SUCCESS', reason: null },
      { id: 'DEV-2026-018', user: 'Admin_Guess', ip: '192.168.1.37', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-018', user: 'Admin_Guess', ip: '192.168.1.37', result: 'FAILED', reason: 'Invalid Password' },
      { id: 'DEV-2026-018', user: 'Admin_Guess', ip: '192.168.1.37', result: 'BLOCKED', reason: '5 Consecutive Auth Failures' },
      { id: 'DEV-2026-019', user: 'ConfRoom', ip: '192.168.1.38', result: 'SUCCESS', reason: null },
    ];

    // Generate 50 total entries with realistic timestamp distributions over recent hours
    const baseTime = Date.now();
    for (let i = 0; i < 50; i++) {
      const template = logs[i % logs.length];
      const hoursAgo = (50 - i) * 0.8;
      const timestamp = new Date(baseTime - hoursAgo * 3600 * 1000).toISOString();
      await db.run(
        `INSERT INTO authentication_logs (device_id, username, timestamp, ip_address, authentication_method, result, failure_reason)
         VALUES (?, ?, ?, ?, 'Password', ?, ?)`,
        [template.id, template.user, timestamp, template.ip, template.result, template.reason]
      );
    }
    console.log('✅ Seeded 50 authentication logs');
  }

  // 5. Seed Security Events (20 Events)
  const eventCount = await db.get('SELECT COUNT(*) as count FROM security_events');
  if (eventCount.count === 0) {
    const events = [
      { type: 'NEW_DEVICE_DETECTED', desc: 'New unauthenticated device connected: Charan-Laptop (192.168.1.20)', sev: 'LOW', dev: 'DEV-2026-001' },
      { type: 'AUTH_SUCCESS', desc: 'First access authentication succeeded for device DEV-2026-001 (Charan)', sev: 'LOW', dev: 'DEV-2026-001' },
      { type: 'NEW_DEVICE_DETECTED', desc: 'New unauthenticated device connected: Student-Mobile (192.168.1.21)', sev: 'LOW', dev: 'DEV-2026-002' },
      { type: 'AUTH_SUCCESS', desc: 'First access authentication succeeded for device DEV-2026-002 (User01)', sev: 'LOW', dev: 'DEV-2026-002' },
      { type: 'AUTH_FAILED', desc: 'Password verification failed for DEV-2026-004 (Attacker_X)', sev: 'MEDIUM', dev: 'DEV-2026-004' },
      { type: 'AUTH_FAILED', desc: 'Password verification failed for DEV-2026-004 (Attacker_X) - Attempt 3', sev: 'MEDIUM', dev: 'DEV-2026-004' },
      { type: 'DEVICE_BLOCKED', desc: 'Device DEV-2026-004 temporarily locked after 5 consecutive failed attempts', sev: 'HIGH', dev: 'DEV-2026-004' },
      { type: 'NEW_DEVICE_DETECTED', desc: 'Unregistered MAC address detected: Rogue-Access-Point (DE:AD:BE:EF:00:01)', sev: 'HIGH', dev: 'DEV-2026-008' },
      { type: 'ADMIN_BLOCK', desc: 'Administrator manually revoked access for device Rogue-Access-Point', sev: 'CRITICAL', dev: 'DEV-2026-008' },
      { type: 'AUTH_SUCCESS', desc: 'Authorized device reconnected: Rahul-MacBook', sev: 'LOW', dev: 'DEV-2026-005' },
      { type: 'SETTINGS_CHANGED', desc: 'Security policy updated: Password Hashing algorithm confirmed (bcrypt)', sev: 'LOW', dev: null },
      { type: 'AUTH_FAILED', desc: 'Invalid credentials entered for DEV-2026-010', sev: 'MEDIUM', dev: 'DEV-2026-010' },
      { type: 'RATE_LIMIT_TRIGGERED', desc: 'Excessive request rate detected from IP 192.168.1.32', sev: 'HIGH', dev: 'DEV-2026-013' },
      { type: 'DEVICE_BLOCKED', desc: 'Automated lockout engaged for Suspicious-Probe', sev: 'HIGH', dev: 'DEV-2026-013' },
      { type: 'AUTH_SUCCESS', desc: 'Authorized connection established for Priya-iPhone', sev: 'LOW', dev: 'DEV-2026-006' },
      { type: 'AUTH_FAILED', desc: 'Brute force credential spray detected targeting Admin username from DEV-2026-018', sev: 'CRITICAL', dev: 'DEV-2026-018' },
      { type: 'DEVICE_BLOCKED', desc: 'Device DEV-2026-018 blacklisted following brute force detection', sev: 'CRITICAL', dev: 'DEV-2026-018' },
      { type: 'AUTH_SUCCESS', desc: 'Faculty device verified: Dr_Sharma Surface Pro', sev: 'LOW', dev: 'DEV-2026-017' },
      { type: 'SETTINGS_CHANGED', desc: 'Max Failed Attempts set to 5 (System default enforced)', sev: 'LOW', dev: null },
      { type: 'SYSTEM_STARTUP', desc: 'SecureWiFi Authentication Gateway service initialized successfully', sev: 'LOW', dev: null },
    ];

    const baseTime = Date.now();
    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      const hoursAgo = (events.length - i) * 1.5;
      const timestamp = new Date(baseTime - hoursAgo * 3600 * 1000).toISOString();
      await db.run(
        `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
         VALUES (?, ?, ?, ?, ?)`,
        [ev.type, ev.desc, ev.sev, ev.dev, timestamp]
      );
    }
    console.log('✅ Seeded 20 security events');
  }

  console.log('🎉 Database seeding complete!');
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('Failed to seed database:', err);
    process.exit(1);
  });
}
