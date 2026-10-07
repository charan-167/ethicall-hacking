import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, Device } from '../types';
import { verifyAdminToken } from '../services/api';

interface NotificationItem {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface AuthContextType {
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  activeDevice: Device | null;
  demoModeActive: boolean;
  presentationModeActive: boolean;
  notifications: NotificationItem[];
  loginAdminSuccess: (user: AdminUser, token: string) => void;
  logoutAdmin: () => void;
  setActiveDeviceSession: (device: Device | null) => void;
  toggleDemoMode: (val?: boolean) => void;
  togglePresentationMode: (val?: boolean) => void;
  addNotification: (type: 'success' | 'danger' | 'warning' | 'info', message: string) => void;
  clearNotifications: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeDevice, setActiveDevice] = useState<Device | null>(() => {
    const saved = localStorage.getItem('securewifi_active_device');
    return saved ? JSON.parse(saved) : null;
  });
  const [demoModeActive, setDemoModeActive] = useState<boolean>(false);
  const [presentationModeActive, setPresentationModeActive] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('securewifi_admin_token');
    if (token) {
      verifyAdminToken()
        .then((res) => {
          if (res.authenticated && res.user) {
            setAdminUser(res.user);
          } else {
            localStorage.removeItem('securewifi_admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('securewifi_admin_token');
        });
    }
  }, []);

  const loginAdminSuccess = (user: AdminUser, token: string) => {
    localStorage.setItem('securewifi_admin_token', token);
    setAdminUser(user);
    addNotification('success', `Welcome back Administrator ${user.username}!`);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('securewifi_admin_token');
    setAdminUser(null);
    addNotification('info', 'Admin logged out safely.');
  };

  const setActiveDeviceSession = (device: Device | null) => {
    setActiveDevice(device);
    if (device) {
      localStorage.setItem('securewifi_active_device', JSON.stringify(device));
    } else {
      localStorage.removeItem('securewifi_active_device');
    }
  };

  const toggleDemoMode = (val?: boolean) => {
    setDemoModeActive((prev) => (val !== undefined ? val : !prev));
  };

  const togglePresentationMode = (val?: boolean) => {
    setPresentationModeActive((prev) => (val !== undefined ? val : !prev));
  };

  const addNotification = (type: 'success' | 'danger' | 'warning' | 'info', message: string) => {
    const newNotif: NotificationItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdminLoggedIn: !!adminUser,
        activeDevice,
        demoModeActive,
        presentationModeActive,
        notifications,
        loginAdminSuccess,
        logoutAdmin,
        setActiveDeviceSession,
        toggleDemoMode,
        togglePresentationMode,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
