import { Request, Response } from 'express';
import { getDb } from '../database/db';

export async function getNetworkSettings(req: Request, res: Response) {
  try {
    const db = await getDb();
    const settings = await db.all('SELECT * FROM network_settings');

    const formattedSettings: Record<string, string> = {};
    settings.forEach((s: any) => {
      formattedSettings[s.setting_name] = s.setting_value;
    });

    return res.json({ success: true, settings: formattedSettings, rawSettings: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch network settings' });
  }
}

export async function updateNetworkSettings(req: Request, res: Response) {
  try {
    const { settings } = req.body; // Key-value map of setting_name -> setting_value

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Settings payload must be an object' });
    }

    const db = await getDb();

    for (const [key, value] of Object.entries(settings)) {
      await db.run(
        `INSERT OR REPLACE INTO network_settings (setting_name, setting_value, updated_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, String(value)]
      );
    }

    // Log security event for configuration modification
    await db.run(
      `INSERT INTO security_events (event_type, description, severity, timestamp)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      ['SETTINGS_CHANGED', `Network security parameters updated by administrator`, 'MEDIUM']
    );

    return res.json({ success: true, message: 'Network settings updated and persisted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update network settings' });
  }
}
