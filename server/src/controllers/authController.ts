import { Request, Response } from 'express';
import { getDb } from '../database/db';
import { comparePassword, generateToken, verifyToken } from '../utils/auth';

export async function adminLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      // Log failed admin login attempt
      await db.run(
        `INSERT INTO security_events (event_type, description, severity, timestamp)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        ['ADMIN_LOGIN_FAILED', `Failed admin login attempt for username: ${username}`, 'MEDIUM']
      );
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Update last login
    await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Generate JWT
    const token = generateToken({ id: user.id, username: user.username, role: user.role });

    // Log security event
    await db.run(
      `INSERT INTO security_events (event_type, description, severity, timestamp)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      ['ADMIN_LOGIN_SUCCESS', `Admin user ${user.username} logged in successfully`, 'LOW']
    );

    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during admin authentication' });
  }
}

export async function verifyAdminSession(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, authenticated: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, authenticated: false });
    }

    return res.json({
      success: true,
      authenticated: true,
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({ success: false, authenticated: false });
  }
}
