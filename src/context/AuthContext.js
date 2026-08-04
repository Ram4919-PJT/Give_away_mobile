import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  login as iamLogin,
  register as iamRegister,
  logout as iamLogout,
  refresh as iamRefresh,
  getMe,
  saveTokens,
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from '../api/iamClient';
import {
  mapIamUser,
  mapRoleToIam,
  normalizeMobileInput,
  roleDisplayName,
} from '../utils/roleMap';
import { INITIAL_DONOR_SETTINGS } from '../data/donorSettingsData';
import { INITIAL_RECEIVER_SETTINGS } from '../data/receiverSettingsData';
import { INITIAL_NGO_SETTINGS } from '../data/ngoSettingsData';

const AuthContext = createContext(null);

function defaultSettingsForRole(role) {
  if (role === 'donor') return { ...INITIAL_DONOR_SETTINGS };
  if (role === 'receiver') return { ...INITIAL_RECEIVER_SETTINGS };
  if (role === 'ngo') return { ...INITIAL_NGO_SETTINGS };
  return {};
}

function enrichUser(base) {
  return {
    ...base,
    city: base.city || '',
    state: base.state || '',
    address: base.address || '',
    features: base.features || [],
    settings: {
      ...defaultSettingsForRole(base.role),
      ...(base.settings || {}),
    },
  };
}

async function loadUserFromToken(accessToken) {
  const me = await getMe(accessToken);
  return enrichUser(mapIamUser(me));
}

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [receiverApplications, setReceiverApplications] = useState([]);
  const [receiverNotifications, setReceiverNotifications] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const refreshToken = await getStoredRefreshToken();
      const accessToken = await getStoredAccessToken();

      if (!refreshToken && !accessToken) {
        if (!cancelled) setAuthLoading(false);
        return;
      }

      try {
        let token = accessToken;
        if (refreshToken) {
          const tokens = await iamRefresh(refreshToken);
          await saveTokens(tokens);
          token = tokens.access_token;
        }
        const user = await loadUserFromToken(token);
        if (!cancelled) setCurrentUser(user);
      } catch {
        await clearTokens();
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed) return { ok: false, error: 'Please enter your email.' };
    if (!password) return { ok: false, error: 'Please enter your password.' };

    try {
      const tokens = await iamLogin(trimmed, password);
      await saveTokens(tokens);
      const user = await loadUserFromToken(tokens.access_token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message || 'Invalid email or password.' };
    }
  }, []);

  const register = useCallback(async (roleKey, form) => {
    const roleName = mapRoleToIam(roleKey);
    if (!roleName) {
      return { ok: false, error: 'Invalid role for registration.' };
    }

    const email = (form.email || '').trim().toLowerCase();
    const fullName =
      roleKey === 'ngo' && form.orgName
        ? form.orgName.trim()
        : (form.name || '').trim();
    const mobile = normalizeMobileInput(form.mobile);

    if (!fullName) return { ok: false, error: 'Please enter your name.' };
    if (!email) return { ok: false, error: 'Please enter your email.' };
    if (!form.password) return { ok: false, error: 'Please enter a password.' };
    if (mobile.length !== 10) {
      return { ok: false, error: 'Enter a valid 10-digit mobile number.' };
    }

    try {
      const tokens = await iamRegister({
        full_name: fullName,
        email,
        mobile,
        password: form.password,
        role_name: roleName,
      });
      await saveTokens(tokens);
      const user = enrichUser({
        ...mapIamUser(await getMe(tokens.access_token)),
        city: form.city || '',
        state: form.state || '',
        orgName: form.orgName || '',
      });
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message || 'Registration failed.' };
    }
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

  const logout = useCallback(async () => {
    const refreshToken = await getStoredRefreshToken();
    await clearTokens();
    setCurrentUser(null);
    await iamLogout(refreshToken);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      authLoading,
      donations,
      receiverApplications,
      receiverNotifications,
      ngoRequests,
      login,
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
      authLoading,
      donations,
      receiverApplications,
      receiverNotifications,
      ngoRequests,
      login,
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
