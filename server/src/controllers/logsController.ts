import { Request, Response } from 'express';
import { getDb } from '../database/db';

export async function getAuthenticationLogs(req: Request, res: Response) {
  try {
    const { result, search, startDate, endDate, limit = 100 } = req.query;
    const db = await getDb();

    let query = 'SELECT * FROM authentication_logs WHERE 1=1';
    const params: any[] = [];

    if (result && result !== 'All') {
      query += ' AND result = ?';
      params.push(result);
    }

    if (search) {
      query += ' AND (device_id LIKE ? OR username LIKE ? OR ip_address LIKE ? OR failure_reason LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (startDate) {
      query += ' AND timestamp >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND timestamp <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(Number(limit));

    const logs = await db.all(query, params);

    return res.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    console.error('Error fetching auth logs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch authentication logs' });
  }
}

export async function getSecurityEvents(req: Request, res: Response) {
  try {
    const { severity, limit = 50 } = req.query;
    const db = await getDb();

    let query = 'SELECT * FROM security_events WHERE 1=1';
    const params: any[] = [];

    if (severity && severity !== 'All') {
      query += ' AND severity = ?';
      params.push(severity);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(Number(limit));

    const events = await db.all(query, params);

    return res.json({ success: true, count: events.length, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch security events' });
  }
}
