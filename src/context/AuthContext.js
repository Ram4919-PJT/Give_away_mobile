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
import { fetchPlatformData, coreClient, notificationsClient } from '../api/platformApi';
import { mapDonationFromApi, mapVerificationFromApi, mapAssistanceRequestFromApi, buildAssistanceRequestPayload } from '../api/mappers';
import { deriveDonorVerificationFromRequests, deriveReceiverVerificationFromRequests } from '../utils/donorVerification';
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

async function loadUserFromToken() {
  const me = await getMe();
  return enrichUser(mapIamUser(me));
}

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [platformLoading, setPlatformLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [receiverApplications, setReceiverApplications] = useState([]);
  const [receiverNotifications, setReceiverNotifications] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);

  const refreshPlatformData = useCallback(async (role) => {
    if (!role) return;
    setPlatformLoading(true);
    try {
      const data = await fetchPlatformData(role);
      if (role === 'donor' || role === 'super-admin') {
        setDonations(data.donations || []);
      }
      setNotifications(data.notifications || []);
      setReceiverNotifications(data.receiverNotifications || []);
      setVerifications(data.verifications || []);
      if (role === 'receiver' || role === 'super-admin') {
        setReceiverApplications(data.receiverApplications || []);
      }

      if (role === 'donor') {
        const verificationPatch = deriveDonorVerificationFromRequests(data.verifications);
        if (verificationPatch) {
          setCurrentUser((prev) => (prev ? { ...prev, ...verificationPatch } : prev));
        }
      }
      if (role === 'receiver') {
        const verificationPatch = deriveReceiverVerificationFromRequests(data.verifications);
        if (verificationPatch) {
          setCurrentUser((prev) => (prev ? { ...prev, ...verificationPatch } : prev));
        }
      }
    } finally {
      setPlatformLoading(false);
    }
  }, []);

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
        if (refreshToken) {
          const tokens = await iamRefresh(refreshToken);
          await saveTokens(tokens);
        }
        const user = await loadUserFromToken();
        if (!cancelled) {
          setCurrentUser(user);
          await refreshPlatformData(user.role);
        }
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
  }, [refreshPlatformData]);

  const login = useCallback(async (email, password) => {
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed) return { ok: false, error: 'Please enter your email.' };
    if (!password) return { ok: false, error: 'Please enter your password.' };

    try {
      const tokens = await iamLogin(trimmed, password);
      await saveTokens(tokens);
      const user = await loadUserFromToken();
      setCurrentUser(user);
      await refreshPlatformData(user.role);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message || 'Invalid email or password.' };
    }
  }, [refreshPlatformData]);

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
        ...mapIamUser(await getMe()),
        city: form.city || '',
        state: form.state || '',
        orgName: form.orgName || '',
      });
      setCurrentUser(user);
      await refreshPlatformData(user.role);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message || 'Registration failed.' };
    }
  }, [refreshPlatformData]);

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

  const submitDonation = useCallback(async (payload) => {
    const created = await coreClient.createDonation(payload);
    const mapped = mapDonationFromApi(created);
    setDonations((prev) => [mapped, ...prev]);
    if (currentUser?.role) await refreshPlatformData(currentUser.role);
    return mapped;
  }, [currentUser, refreshPlatformData]);

  const submitDonorVerification = useCallback(async ({ notes }) => {
    let profile = await coreClient.getMyDonorProfile().catch(() => null);
    if (!profile) {
      profile = await coreClient.createDonorProfile({
        organization_name: currentUser?.name || undefined,
      });
    }
    const created = await coreClient.createVerificationRequest({
      entity_type: 'DONOR',
      entity_id: profile.donor_profile_id,
      notes: notes || 'Donor verification request',
    });
    setVerifications((prev) => [mapVerificationFromApi(created), ...prev]);
    setCurrentUser((prev) =>
      prev ? { ...prev, verified: 'pending', verificationStatus: 'submitted' } : prev
    );
    await refreshPlatformData('donor');
    return mapVerificationFromApi(created);
  }, [currentUser?.name, refreshPlatformData]);

  const loadDonorProfile = useCallback(async () => {
    const profile = await coreClient.getMyDonorProfile().catch(() => null);
    if (profile) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              donorProfileId: profile.donor_profile_id,
              panNumber: profile.pan_number,
              profileStatus: profile.status,
            }
          : prev
      );
    }
    return profile;
  }, []);

  const submitAssistanceRequest = useCallback(async ({ categoryId, categoryTitle, form }) => {
    const payload = buildAssistanceRequestPayload({ categoryId, categoryTitle, form });
    const created = await coreClient.createAssistanceRequest(payload);
    const mapped = mapAssistanceRequestFromApi(created);
    setReceiverApplications((prev) => [mapped, ...prev]);
    if (currentUser?.role) await refreshPlatformData(currentUser.role);
    return mapped;
  }, [currentUser, refreshPlatformData]);

  const addReceiverApplication = useCallback((application) => {
    setReceiverApplications((prev) => [application, ...prev]);
  }, []);

  const addNgoRequest = useCallback((request) => {
    setNgoRequests((prev) => [request, ...prev]);
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await notificationsClient.markNotificationRead(id);
    } catch {
      /* optimistic */
    }
  }, []);

  const markReceiverNotificationRead = useCallback(async (id) => {
    setReceiverNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await notificationsClient.markNotificationRead(id);
    } catch {
      /* optimistic */
    }
  }, []);

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      const refreshToken = await getStoredRefreshToken();
      await iamLogout(refreshToken);
    } catch {
      /* revoke best-effort */
    } finally {
      await clearTokens();
      setCurrentUser(null);
      setDonations([]);
      setNotifications([]);
      setVerifications([]);
      setReceiverNotifications([]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setLogoutLoading(false);
      setLogoutConfirmOpen(false);
    }
  }, []);

  const requestLogout = useCallback(() => {
    setLogoutConfirmOpen(true);
  }, []);

  const cancelLogout = useCallback(() => {
    if (!logoutLoading) setLogoutConfirmOpen(false);
  }, [logoutLoading]);

  const confirmLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      authLoading,
      logoutLoading,
      logoutConfirmOpen,
      platformLoading,
      donations,
      notifications,
      verifications,
      receiverApplications,
      receiverNotifications,
      ngoRequests,
      login,
      register,
      updateSettings,
      updateUser,
      submitDonation,
      submitDonorVerification,
      loadDonorProfile,
      submitAssistanceRequest,
      refreshPlatformData,
      addReceiverApplication,
      addNgoRequest,
      markNotificationRead,
      markReceiverNotificationRead,
      requestLogout,
      cancelLogout,
      confirmLogout,
      logout,
      roleDisplayName,
    }),
    [
      currentUser,
      authLoading,
      logoutLoading,
      logoutConfirmOpen,
      platformLoading,
      donations,
      notifications,
      verifications,
      receiverApplications,
      receiverNotifications,
      ngoRequests,
      login,
      register,
      updateSettings,
      updateUser,
      submitDonation,
      submitDonorVerification,
      loadDonorProfile,
      submitAssistanceRequest,
      refreshPlatformData,
      addReceiverApplication,
      addNgoRequest,
      markNotificationRead,
      markReceiverNotificationRead,
      requestLogout,
      cancelLogout,
      confirmLogout,
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
