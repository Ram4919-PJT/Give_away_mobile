import { apiRequest } from './client';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  saveTokens,
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from './tokenStorage';

export {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  saveTokens,
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
};

export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
    auth: false,
  });
}

export async function register({ full_name, email, mobile, password, role_name }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: {
      full_name,
      email: email.trim().toLowerCase(),
      mobile,
      password,
      role_name,
    },
    auth: false,
  });
}

export async function refresh(refreshToken) {
  return apiRequest('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    auth: false,
  });
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      auth: false,
    });
  } catch {
    /* revoke best-effort */
  }
}

export async function getMe() {
  return apiRequest('/auth/me');
}
