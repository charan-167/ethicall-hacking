import { Request, Response } from 'express';
import { getDb } from '../database/db';
import { validatePasswordPolicy } from '../utils/auth';

// Helper helper to generate random IP or MAC for simulated devices if missing
function generateRandomIP() {
  return `192.168.1.${Math.floor(Math.random() * 200) + 20}`;
}

function generateRandomMAC() {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  ).join(':');
}

// 1. Register or lookup a device accessing the network for the first time
export async function registerDevice(req: Request, res: Response) {
  try {
    const { device_id, device_name, username, ip_address, mac_address } = req.body;

    if (!device_name || !username) {
      return res.status(400).json({ success: false, message: 'Device name and username are required' });
    }

    const db = await getDb();
    const targetDeviceId = device_id || `DEV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const finalIp = ip_address || generateRandomIP();
    const finalMac = mac_address || generateRandomMAC();

    // Check if device exists
    let device = await db.get('SELECT * FROM devices WHERE device_id = ?', [targetDeviceId]);

    if (!device) {
      // First access detection: Create new device record in Pending state
      const now = new Date().toISOString();
      const result = await db.run(
        `INSERT INTO devices (device_id, device_name, username, ip_address, mac_address, status, first_access, last_seen, failed_attempts, created_at)
         VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, 0, ?)`,
        [targetDeviceId, device_name, username, finalIp, finalMac, now, now, now]
      );

      device = await db.get('SELECT * FROM devices WHERE id = ?', [result.lastID]);

      // Log First Access Event
      await db.run(
        `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        ['FIRST_ACCESS_DETECTED', `New device connected: ${device_name} (${targetDeviceId}) by ${username}. Restricted state assigned.`, 'LOW', targetDeviceId]
      );
    } else {
      // Update last seen
      await db.run('UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?', [device.id]);
    }

    return res.json({
      success: true,
      message: device.status === 'Authorized' ? 'Device already authorized' : 'First access detected. Authentication required.',
      device,
      requiresAuthentication: device.status !== 'Authorized',
    });
  } catch (error: any) {
    console.error('Register device error:', error);
    return res.status(500).json({ success: false, message: 'Server error during device registration' });
  }
}

// 2. Authenticate a device using Network Password
export async function authenticateDevice(req: Request, res: Response) {
  try {
    const { device_id, username, password } = req.body;

    if (!device_id || !password) {
      return res.status(400).json({ success: false, message: 'Device ID and password are required' });
    }

    const db = await getDb();
    const device = await db.get('SELECT * FROM devices WHERE device_id = ?', [device_id]);

    if (!device) {
      return res.status(444).json({ success: false, message: 'Device not found in first-access registry' });
    }

    // Check if device is BLOCKED
    if (device.status === 'Blocked') {
      // Record blocked attempt log
      await db.run(
        `INSERT INTO authentication_logs (device_id, username, timestamp, ip_address, authentication_method, result, failure_reason)
         VALUES (?, ?, CURRENT_TIMESTAMP, ?, 'Password', 'BLOCKED', 'Device is locked due to repeated failed attempts')`,
        [device.device_id, username || device.username, device.ip_address]
      );

      return res.status(403).json({
        success: false,
        message: 'Too many failed authentication attempts. Access temporarily blocked.',
        status: 'Blocked',
        failed_attempts: device.failed_attempts,
      });
    }

    // Retrieve network master password setting or evaluate password rule
    // Standard simulation valid password: 'SecureWiFi2026!' or any password meeting strength policy with 8+ chars
    const passPolicy = validatePasswordPolicy(password);

    // Demonstration Rule: Passwords matching 'SecureWiFi2026!' or 'WiFiPass2026!' or strong passwords meeting policy are ACCEPTED.
    // Explicit incorrect trigger if password === 'wrong' or '12345' or doesn't meet minimum valid test criteria
    const isCorrectPassword = (password === 'SecureWiFi2026!' || password === 'WiFiPass2026!' || passPolicy.isValid) && password !== 'wrong' && password !== 'invalid';

    if (isCorrectPassword) {
      // SUCCESSFUL AUTHENTICATION
      const now = new Date().toISOString();
      await db.run(
        `UPDATE devices SET status = 'Authorized', authorized_at = ?, last_seen = ?, failed_attempts = 0 WHERE id = ?`,
        [now, now, device.id]
      );

      // Record Auth Log
      await db.run(
        `INSERT INTO authentication_logs (device_id, username, timestamp, ip_address, authentication_method, result, failure_reason)
         VALUES (?, ?, CURRENT_TIMESTAMP, ?, 'Password', 'SUCCESS', NULL)`,
        [device.device_id, username || device.username, device.ip_address]
      );

      // Record Security Event
      await db.run(
        `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        ['AUTH_SUCCESS', `Device ${device.device_name} (${device.device_id}) successfully authenticated. Granted network access.`, 'LOW', device.device_id]
      );

      const updatedDevice = await db.get('SELECT * FROM devices WHERE id = ?', [device.id]);

      return res.json({
        success: true,
        message: 'Authentication Successful! Network access granted.',
        status: 'Authorized',
        device: updatedDevice,
      });
    } else {
      // FAILED AUTHENTICATION
      const newFailedCount = device.failed_attempts + 1;
      const isNowBlocked = newFailedCount >= 5;
      const newStatus = isNowBlocked ? 'Blocked' : device.status;

      await db.run(
        `UPDATE devices SET failed_attempts = ?, status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?`,
        [newFailedCount, newStatus, device.id]
      );

      // Record Auth Log
      const reason = isNowBlocked ? 'Max failed attempts limit reached (5)' : 'Invalid password';
      await db.run(
        `INSERT INTO authentication_logs (device_id, username, timestamp, ip_address, authentication_method, result, failure_reason)
         VALUES (?, ?, CURRENT_TIMESTAMP, ?, 'Password', ?, ?)`,
        [device.device_id, username || device.username, device.ip_address, isNowBlocked ? 'BLOCKED' : 'FAILED', reason]
      );

      // Record Security Event
      if (isNowBlocked) {
        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          ['DEVICE_BLOCKED', `Device ${device.device_name} (${device.device_id}) temporarily locked after 5 consecutive failed authentication attempts.`, 'HIGH', device.device_id]
        );
      } else {
        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          ['AUTH_FAILED', `Failed authentication attempt for ${device.device_name} (${device.device_id}). Attempt ${newFailedCount}/5.`, 'MEDIUM', device.device_id]
        );
      }

      if (isNowBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Too many failed authentication attempts. Access temporarily blocked.',
          status: 'Blocked',
          failed_attempts: newFailedCount,
          reason,
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication Failed. Invalid password.',
        status: device.status,
        failed_attempts: newFailedCount,
        max_attempts: 5,
        reason,
        policyFeedback: passPolicy.errors,
      });
    }
  } catch (error: any) {
    console.error('Authenticate device error:', error);
    return res.status(500).json({ success: false, message: 'Server error during device authentication' });
  }
}

// 3. Get all devices with search & status filters
export async function getDevices(req: Request, res: Response) {
  try {
    const { status, search } = req.query;
    const db = await getDb();

    let query = 'SELECT * FROM devices WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (device_name LIKE ? OR device_id LIKE ? OR username LIKE ? OR ip_address LIKE ? OR mac_address LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    query += ' ORDER BY id DESC';
    const devices = await db.all(query, params);

    return res.json({ success: true, count: devices.length, devices });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving devices' });
  }
}

// 4. Get single device details
export async function getDeviceById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const device = await db.get('SELECT * FROM devices WHERE id = ? OR device_id = ?', [id, id]);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    const logs = await db.all('SELECT * FROM authentication_logs WHERE device_id = ? ORDER BY timestamp DESC LIMIT 10', [device.device_id]);
    const events = await db.all('SELECT * FROM security_events WHERE device_id = ? ORDER BY timestamp DESC LIMIT 10', [device.device_id]);

    return res.json({ success: true, device, logs, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching device detail' });
  }
}

// 5. Update device status (e.g. Block / Unblock / Authorize / Pending)
export async function updateDeviceStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Authorized', 'Pending', 'Blocked', 'Offline'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const db = await getDb();
    const device = await db.get('SELECT * FROM devices WHERE id = ? OR device_id = ?', [id, id]);

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    const failedAttempts = status === 'Authorized' || status === 'Pending' ? 0 : device.failed_attempts;
    const authTime = status === 'Authorized' ? new Date().toISOString() : device.authorized_at;

    await db.run(
      `UPDATE devices SET status = ?, failed_attempts = ?, authorized_at = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, failedAttempts, authTime, device.id]
    );

    // Record Security Log
    await db.run(
      `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      ['ADMIN_STATUS_CHANGE', `Admin changed status of device ${device.device_name} (${device.device_id}) to ${status}.`, status === 'Blocked' ? 'HIGH' : 'LOW', device.device_id]
    );

    const updated = await db.get('SELECT * FROM devices WHERE id = ?', [device.id]);
    return res.json({ success: true, message: `Device status updated to ${status}`, device: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update device status' });
  }
}

// 6. Revoke access for a device
export async function revokeDeviceAccess(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const device = await db.get('SELECT * FROM devices WHERE id = ? OR device_id = ?', [id, id]);

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    await db.run(
      `UPDATE devices SET status = 'Blocked', failed_attempts = 5, last_seen = CURRENT_TIMESTAMP WHERE id = ?`,
      [device.id]
    );

    // Log security event
    await db.run(
      `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      ['ACCESS_REVOKED', `Network access manually revoked for device ${device.device_name} (${device.device_id}). Device blocked.`, 'CRITICAL', device.device_id]
    );

    return res.json({ success: true, message: 'Device network access revoked. Device has been blocked.', device_id: device.device_id });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to revoke device access' });
  }
}

// 7. Delete device record
export async function deleteDevice(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    await db.run('DELETE FROM devices WHERE id = ? OR device_id = ?', [id, id]);
    return res.json({ success: true, message: 'Device removed from network database' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete device' });
  }
}
