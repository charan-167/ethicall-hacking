import { Router } from 'express';
import { adminLogin, verifyAdminSession } from '../controllers/authController';
import {
  registerDevice,
  authenticateDevice,
  getDevices,
  getDeviceById,
  updateDeviceStatus,
  revokeDeviceAccess,
  deleteDevice,
} from '../controllers/deviceController';
import { getAuthenticationLogs, getSecurityEvents } from '../controllers/logsController';
import {
  getDashboardStatistics,
  getDashboardActivity,
  getNetworkTopology,
  getReportsData,
} from '../controllers/dashboardController';
import { getNetworkSettings, updateNetworkSettings } from '../controllers/networkController';
import { runSimulationStep } from '../controllers/simulatorController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Authentication Routes
router.post('/auth/login', adminLogin);
router.post('/auth/logout', (_req, res) => res.json({ success: true, message: 'Logged out successfully' }));
router.get('/auth/verify', verifyAdminSession);

// Device Routes
router.post('/devices/register', registerDevice);
router.post('/authenticate/device', authenticateDevice);
router.get('/devices', getDevices);
router.get('/devices/:id', getDeviceById);
router.put('/devices/:id', updateDeviceStatus);
router.post('/devices/:id/revoke', revokeDeviceAccess);
router.delete('/devices/:id', deleteDevice);

// Log Routes
router.get('/logs/authentication', getAuthenticationLogs);
router.get('/logs/security', getSecurityEvents);

// Dashboard Routes
router.get('/dashboard/statistics', getDashboardStatistics);
router.get('/dashboard/activity', getDashboardActivity);
router.get('/network/topology', getNetworkTopology);

// Reports Routes
router.get('/reports/security', getReportsData);
router.get('/reports/authentication', getReportsData);

// Network Settings Routes
router.get('/network/settings', getNetworkSettings);
router.put('/network/settings', updateNetworkSettings);

// Simulator Routes
router.post('/simulator/action', runSimulationStep);

export default router;
