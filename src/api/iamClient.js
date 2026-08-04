import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

function getDefaultApiBase() {
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000/api/v1';
  return 'http://localhost:8000/api/v1';
}

const API_BASE = process.env.EXPO_PUBLIC_IAM_API_URL || getDefaultApiBase();

export const ACCESS_TOKEN_KEY = 'giveaway-access-token';
export const REFRESH_TOKEN_KEY = 'giveaway-refresh-token';

function parseErrorDetail(data) {
  if (!data?.detail) return 'Request failed';
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg || item.message || JSON.stringify(item)).join(', ');
  }
  return 'Request failed';
}

async function request(path, { method = 'GET', body, accessToken } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseErrorDetail(data));
  }
  return data;
}

export async function saveTokens({ access_token, refresh_token }) {
  if (access_token) await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  if (refresh_token) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

export async function getStoredAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getStoredRefreshToken() {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
  });
}

export async function register({ full_name, email, mobile, password, role_name }) {
  return request('/auth/register', {
    method: 'POST',
    body: {
      full_name,
      email: email.trim().toLowerCase(),
      mobile,
      password,
      role_name,
    },
  });
}

export async function refresh(refreshToken) {
  return request('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  });
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  try {
    await request('/auth/logout', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    });
  } catch {
    /* revoke best-effort */
  }
}

export async function getMe(accessToken) {
  return request('/auth/me', { accessToken });
}
