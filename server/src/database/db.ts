import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.resolve(__dirname, '../../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = process.env.DB_FILE || path.join(dbDir, 'securewifi.sqlite');

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await dbInstance.exec('PRAGMA foreign_keys = ON;');
  await initSchema(dbInstance);

  return dbInstance;
}

async function initSchema(db: Database) {
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
  `);

  // Devices table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT UNIQUE NOT NULL,
      device_name TEXT NOT NULL,
      username TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      mac_address TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Authorized', 'Pending', 'Blocked', 'Offline')),
      first_access DATETIME DEFAULT CURRENT_TIMESTAMP,
      authorized_at DATETIME,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      failed_attempts INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Authentication logs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS authentication_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      username TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT NOT NULL,
      authentication_method TEXT DEFAULT 'Password',
      result TEXT NOT NULL CHECK(result IN ('SUCCESS', 'FAILED', 'BLOCKED')),
      failure_reason TEXT
    );
  `);

  // Security events table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS security_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
      device_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Network settings table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS network_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_name TEXT UNIQUE NOT NULL,
      setting_value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
