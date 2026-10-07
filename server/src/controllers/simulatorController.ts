import { Request, Response } from 'express';
import { getDb } from '../database/db';

export async function runSimulationStep(req: Request, res: Response) {
  try {
    const { action, deviceId } = req.body;
    const db = await getDb();

    const targetDevId = deviceId || 'DEV-SIM-2026';
    const now = new Date().toISOString();

    switch (action) {
      case 'connect_new': {
        // Create new device in Pending state
        await db.run(
          `INSERT OR REPLACE INTO devices (device_id, device_name, username, ip_address, mac_address, status, first_access, last_seen, failed_attempts, created_at)
           VALUES (?, 'Demo-Laptop-X', 'DemoUser', '192.168.1.150', 'AA:11:22:33:44:55', 'Pending', ?, ?, 0, ?)`,
          [targetDevId, now, now, now]
        );

        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES ('SIM_NEW_DEVICE', 'SIMULATION: New device detected accessing wireless network. State set to Pending.', 'LOW', ?, CURRENT_TIMESTAMP)`,
          [targetDevId]
        );

        return res.json({
          success: true,
          action: 'connect_new',
          message: 'Simulated new device connection detected. Device placed in restricted state.',
          device_id: targetDevId,
          status: 'Pending',
        });
      }

      case 'correct_password': {
        await db.run(
          `UPDATE devices SET status = 'Authorized', authorized_at = ?, last_seen = ?, failed_attempts = 0 WHERE device_id = ?`,
          [now, now, targetDevId]
        );

        await db.run(
          `INSERT INTO authentication_logs (device_id, username, timestamp, ip_address, authentication_method, result, failure_reason)
           VALUES (?, 'DemoUser', CURRENT_TIMESTAMP, '192.168.1.150', 'Password', 'SUCCESS', NULL)`,
          [targetDevId]
        );

        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES ('SIM_AUTH_SUCCESS', 'SIMULATION: Password verified. Device granted full authorized network access.', 'LOW', ?, CURRENT_TIMESTAMP)`,
          [targetDevId]
        );

        return res.json({
          success: true,
          action: 'correct_password',
          message: 'Simulated correct password entered. Device status changed to AUTHORIZED.',
          device_id: targetDevId,
          status: 'Authorized',
        });
      }

      case 'incorrect_password': {
        const device = await db.get('SELECT * FROM devices WHERE device_id = ?', [targetDevId]);
        const currentFailed = device ? device.failed_attempts + 1 : 1;

        await db.run(
          `UPDATE devices SET failed_attempts = ?, last_seen = ? WHERE device_id = ?`,
          [currentFailed, now, targetDevId]
        );

        await db.run(
          `INSERT INTO authentication_logs (device_id, username, timestamp, ip_address, authentication_method, result, failure_reason)
           VALUES (?, 'DemoUser', CURRENT_TIMESTAMP, '192.168.1.150', 'Password', 'FAILED', 'Invalid Password')`,
          [targetDevId]
        );

        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES ('SIM_AUTH_FAILED', 'SIMULATION: Incorrect password entered. Failed attempts count incremented.', 'MEDIUM', ?, CURRENT_TIMESTAMP)`,
          [targetDevId]
        );

        return res.json({
          success: true,
          action: 'incorrect_password',
          message: `Simulated failed authentication attempt (${currentFailed}/5).`,
          device_id: targetDevId,
          failed_attempts: currentFailed,
        });
      }

      case 'multi_fail_block': {
        await db.run(
          `UPDATE devices SET status = 'Blocked', failed_attempts = 5, last_seen = ? WHERE device_id = ?`,
          [now, targetDevId]
        );

        await db.run(
          `INSERT INTO authentication_logs (device_id, username, timestamp, ip_address, authentication_method, result, failure_reason)
           VALUES (?, 'DemoUser', CURRENT_TIMESTAMP, '192.168.1.150', 'Password', 'BLOCKED', '5 Consecutive Auth Failures Limit Exceeded')`,
          [targetDevId]
        );

        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES ('SIM_DEVICE_BLOCKED', 'SIMULATION: 5 failed attempts threshold hit. Device lock engaged.', 'HIGH', ?, CURRENT_TIMESTAMP)`,
          [targetDevId]
        );

        return res.json({
          success: true,
          action: 'multi_fail_block',
          message: 'Simulated 5 failed attempts limit reached. Device status set to BLOCKED.',
          device_id: targetDevId,
          status: 'Blocked',
        });
      }

      case 'reauthenticate': {
        await db.run(
          `UPDATE devices SET status = 'Authorized', failed_attempts = 0, authorized_at = ?, last_seen = ? WHERE device_id = ?`,
          [now, now, targetDevId]
        );

        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES ('SIM_REAUTH_SUCCESS', 'SIMULATION: Successful re-authentication following security unblock.', 'LOW', ?, CURRENT_TIMESTAMP)`,
          [targetDevId]
        );

        return res.json({
          success: true,
          action: 'reauthenticate',
          message: 'Device successfully re-authenticated and unblocked.',
          device_id: targetDevId,
          status: 'Authorized',
        });
      }

      case 'revoke_device': {
        await db.run(
          `UPDATE devices SET status = 'Blocked', failed_attempts = 5, last_seen = ? WHERE device_id = ?`,
          [now, targetDevId]
        );

        await db.run(
          `INSERT INTO security_events (event_type, description, severity, device_id, timestamp)
           VALUES ('SIM_REVOKE_ACCESS', 'SIMULATION: Admin manually revoked network authorization. Device blocked.', 'CRITICAL', ?, CURRENT_TIMESTAMP)`,
          [targetDevId]
        );

        return res.json({
          success: true,
          action: 'revoke_device',
          message: 'Device network access revoked by admin simulation.',
          device_id: targetDevId,
          status: 'Blocked',
        });
      }

      default:
        return res.status(400).json({ success: false, message: 'Invalid simulation action' });
    }
  } catch (error: any) {
    console.error('Simulator step error:', error);
    return res.status(500).json({ success: false, message: 'Failed to run simulation step' });
  }
}
