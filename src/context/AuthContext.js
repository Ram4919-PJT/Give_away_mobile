import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  getDemoAccountByEmail,
  getDemoAccountById,
  normalizeLoginRole,
  roleDisplayName,
} from '../data/demoAccounts';
import { INITIAL_DONOR_SETTINGS } from '../data/donorSettingsData';
import { INITIAL_RECEIVER_SETTINGS } from '../data/receiverSettingsData';
import { INITIAL_NGO_SETTINGS } from '../data/ngoSettingsData';
import { DEMO_DONATIONS } from '../data/demoDonations';
import {
  DEMO_RECEIVER_APPLICATIONS,
  DEMO_RECEIVER_NOTIFICATIONS,
} from '../data/demoReceiverData';
import { DEMO_NGO_REQUESTS } from '../data/demoNgoData';

const AuthContext = createContext(null);

function defaultSettingsForRole(role) {
  if (role === 'donor') return { ...INITIAL_DONOR_SETTINGS };
  if (role === 'receiver') return { ...INITIAL_RECEIVER_SETTINGS };
  if (role === 'ngo') return { ...INITIAL_NGO_SETTINGS };
  return {};
}

function buildUserFromDemo(account) {
  return {
    name: account.name,
    email: account.email,
    role: account.role,
    verified: account.verified,
    verificationStatus: account.verificationStatus,
    isDemoAccount: true,
    mobile: account.profile?.mobile || '+91 98765 43210',
    city: account.profile?.city || '',
    state: account.profile?.state || '',
    address: account.profile?.address || '',
    pincode: account.profile?.pincode || '',
    repName: account.profile?.repName || '',
    website: account.profile?.website || '',
    regNumber: account.profile?.regNumber || '',
    mission: account.profile?.mission || '',
    about: account.profile?.about || '',
    focusAreas: account.profile?.focusAreas || [],
    memberSince: account.profile?.memberSince || '2025',
    status: account.profile?.status,
    features: account.features || [],
    settings: {
      ...defaultSettingsForRole(account.role),
      ...(account.settings || {}),
    },
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [donations, setDonations] = useState(DEMO_DONATIONS);
  const [receiverApplications, setReceiverApplications] = useState(DEMO_RECEIVER_APPLICATIONS);
  const [receiverNotifications, setReceiverNotifications] = useState(DEMO_RECEIVER_NOTIFICATIONS);
  const [ngoRequests, setNgoRequests] = useState(DEMO_NGO_REQUESTS);

  const loginAsDemo = useCallback((accountId) => {
    const account = getDemoAccountById(accountId);
    if (!account) return { ok: false, error: 'Demo account not found.' };
    const user = buildUserFromDemo(account);
    setCurrentUser(user);
    return { ok: true, user };
  }, []);

  const login = useCallback((email, password, roleKey) => {
    const trimmed = (email || '').trim().toLowerCase();
    const role = normalizeLoginRole(roleKey);

    if (!trimmed) return { ok: false, error: 'Please enter your email.' };
    if (!password) return { ok: false, error: 'Please enter your password.' };

    const demo = getDemoAccountByEmail(trimmed);

    if (demo) {
      if (demo.password !== password) {
        return { ok: false, error: 'Incorrect password. Demo password is 123456.' };
      }
      if (demo.role !== role) {
        return {
          ok: false,
          error: `This account is a ${roleDisplayName(demo.role)}. Switch the role selector and try again.`,
        };
      }
      const user = buildUserFromDemo(demo);
      setCurrentUser(user);
      return { ok: true, user };
    }

    if (password.length < 4) {
      return { ok: false, error: 'Password must be at least 4 characters for wireframe login.' };
    }

    const user = {
      name: trimmed.split('@')[0] || 'Demo User',
      email: trimmed,
      role,
      verified: false,
      verificationStatus: 'registered',
      isDemoAccount: false,
      mobile: '',
      city: '',
      state: '',
      address: '',
      features: ['Wireframe session'],
      settings: defaultSettingsForRole(role),
    };
    setCurrentUser(user);
    return { ok: true, user };
  }, []);

  const register = useCallback((roleKey, form) => {
    const role = normalizeLoginRole(roleKey);
    const email = (form.email || '').trim().toLowerCase();
    if (!email || !form.password || !form.name) {
      return { ok: false, error: 'Please fill name, email, and password.' };
    }

    const user = {
      name: form.name.trim(),
      email,
      role,
      verified: false,
      verificationStatus: 'registered',
      isDemoAccount: false,
      mobile: form.mobile || '',
      city: form.city || '',
      state: form.state || '',
      address: form.address || '',
      orgName: form.orgName || '',
      features: ['Newly registered (wireframe)'],
      settings: defaultSettingsForRole(role),
    };
    setCurrentUser(user);
    return { ok: true, user };
  }, []);

  const updateSettings = useCallback((nextSettings) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: {
          ...defaultSettingsForRole(prev.role),
          ...(prev.settings || {}),
          ...nextSettings,
        },
      };
    });
  }, []);

  const updateUser = useCallback((patch) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const addDonation = useCallback((donation) => {
    setDonations((prev) => [donation, ...prev]);
  }, []);

  const addReceiverApplication = useCallback((application) => {
    setReceiverApplications((prev) => [application, ...prev]);
  }, []);

  const addNgoRequest = useCallback((request) => {
    setNgoRequests((prev) => [request, ...prev]);
  }, []);

  const markReceiverNotificationRead = useCallback((id) => {
    setReceiverNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const prependReceiverNotification = useCallback((notification) => {
    setReceiverNotifications((prev) => [notification, ...prev]);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      donations,
      receiverApplications,
      receiverNotifications,
      ngoRequests,
      login,
      loginAsDemo,
      register,
      updateSettings,
      updateUser,
      addDonation,
      addReceiverApplication,
      addNgoRequest,
      markReceiverNotificationRead,
      prependReceiverNotification,
      logout,
      roleDisplayName,
    }),
    [
      currentUser,
      donations,
      receiverApplications,
      receiverNotifications,
      ngoRequests,
      login,
      loginAsDemo,
      register,
      updateSettings,
      updateUser,
      addDonation,
      addReceiverApplication,
      addNgoRequest,
      markReceiverNotificationRead,
      prependReceiverNotification,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
