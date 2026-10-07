import { Request, Response } from 'express';
import { getDb } from '../database/db';

export async function getDashboardStatistics(req: Request, res: Response) {
  try {
    const db = await getDb();

    const deviceCounts = await db.all(`
      SELECT status, COUNT(*) as count FROM devices GROUP BY status
    `);

    const totalDevices = await db.get(`SELECT COUNT(*) as count FROM devices`);
    const successfulLogins = await db.get(`SELECT COUNT(*) as count FROM authentication_logs WHERE result = 'SUCCESS'`);
    const failedAttempts = await db.get(`SELECT COUNT(*) as count FROM authentication_logs WHERE result IN ('FAILED', 'BLOCKED')`);

    const statusMap: Record<string, number> = {
      Authorized: 0,
      Pending: 0,
      Blocked: 0,
      Offline: 0,
    };

    deviceCounts.forEach((row: any) => {
      if (row.status) {
        statusMap[row.status] = row.count;
      }
    });

    return res.json({
      success: true,
      statistics: {
        totalDevices: totalDevices.count,
        authorizedDevices: statusMap.Authorized,
        pendingDevices: statusMap.Pending,
        blockedDevices: statusMap.Blocked,
        offlineDevices: statusMap.Offline,
        successfulLogins: successfulLogins.count,
        failedAttempts: failedAttempts.count,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard statistics:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
  }
}

export async function getDashboardActivity(req: Request, res: Response) {
  try {
    const db = await getDb();

    // 1. Device Status Distribution
    const statusDistribution = await db.all(`
      SELECT status as name, COUNT(*) as value FROM devices GROUP BY status
    `);

    // 2. Success vs Failed Auth
    const resultDistribution = await db.all(`
      SELECT result as name, COUNT(*) as value FROM authentication_logs GROUP BY result
    `);

    // 3. Hourly Activity / Authentication attempts over time
    const hourlyData = [
      { hour: '00:00', success: 4, failed: 1 },
      { hour: '03:00', success: 2, failed: 0 },
      { hour: '06:00', success: 6, failed: 2 },
      { hour: '09:00', success: 18, failed: 4 },
      { hour: '12:00', success: 25, failed: 6 },
      { hour: '15:00', success: 32, failed: 9 },
      { hour: '18:00', success: 20, failed: 3 },
      { hour: '21:00', success: 12, failed: 2 },
    ];

    // 4. Recent Security Alerts Stream
    const recentAlerts = await db.all(`
      SELECT * FROM security_events ORDER BY timestamp DESC LIMIT 6
    `);

    return res.json({
      success: true,
      statusDistribution,
      resultDistribution,
      hourlyData,
      recentAlerts,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard activity data' });
  }
}

export async function getNetworkTopology(req: Request, res: Response) {
  try {
    const db = await getDb();
    const devices = await db.all('SELECT * FROM devices ORDER BY status ASC');

    const nodes = [
      { id: 'internet', label: 'INTERNET', type: 'cloud', status: 'active', ip: '0.0.0.0' },
      { id: 'router', label: 'SECURE ROUTER', type: 'router', status: 'active', ip: '192.168.1.1' },
      { id: 'gateway', label: 'AUTHENTICATION GATEWAY', type: 'gateway', status: 'active', ip: '192.168.1.2' },
      { id: 'firewall', label: 'SECURITY FIREWALL', type: 'firewall', status: 'active', ip: '192.168.1.3' },
      { id: 'db', label: 'SECURITY & USER DB', type: 'database', status: 'active', ip: '192.168.1.4' },
      ...devices.slice(0, 10).map((d: any) => ({
        id: d.device_id,
        label: d.device_name,
        type: 'device',
        status: d.status.toLowerCase(),
        ip: d.ip_address,
        mac: d.mac_address,
        user: d.username,
        failedAttempts: d.failed_attempts,
      })),
    ];

    return res.json({ success: true, nodes, totalDevices: devices.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch network topology' });
  }
}

export async function getReportsData(req: Request, res: Response) {
  try {
    const db = await getDb();

    const totalDevices = await db.get(`SELECT COUNT(*) as count FROM devices`);
    const authorized = await db.get(`SELECT COUNT(*) as count FROM devices WHERE status = 'Authorized'`);
    const pending = await db.get(`SELECT COUNT(*) as count FROM devices WHERE status = 'Pending'`);
    const blocked = await db.get(`SELECT COUNT(*) as count FROM devices WHERE status = 'Blocked'`);

    const totalLogs = await db.get(`SELECT COUNT(*) as count FROM authentication_logs`);
    const successfulLogs = await db.get(`SELECT COUNT(*) as count FROM authentication_logs WHERE result = 'SUCCESS'`);
    const failedLogs = await db.get(`SELECT COUNT(*) as count FROM authentication_logs WHERE result = 'FAILED'`);
    const blockedLogs = await db.get(`SELECT COUNT(*) as count FROM authentication_logs WHERE result = 'BLOCKED'`);

    const criticalEvents = await db.all(`SELECT * FROM security_events WHERE severity IN ('HIGH', 'CRITICAL') ORDER BY timestamp DESC LIMIT 10`);

    const successRate = totalLogs.count > 0 ? ((successfulLogs.count / totalLogs.count) * 100).toFixed(1) : '100';
    const failureRate = totalLogs.count > 0 ? (((failedLogs.count + blockedLogs.count) / totalLogs.count) * 100).toFixed(1) : '0';

    return res.json({
      success: true,
      reportTimestamp: new Date().toISOString(),
      summary: {
        totalDevices: totalDevices.count,
        authorizedDevices: authorized.count,
        pendingDevices: pending.count,
        blockedDevices: blocked.count,
        totalLogs: totalLogs.count,
        successfulLogs: successfulLogs.count,
        failedLogs: failedLogs.count,
        blockedLogs: blockedLogs.count,
        successRate: `${successRate}%`,
        failureRate: `${failureRate}%`,
      },
      criticalEvents,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate report data' });
  }
}
