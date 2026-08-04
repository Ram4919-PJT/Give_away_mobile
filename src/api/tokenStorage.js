import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACCESS_TOKEN_KEY = 'giveaway-access-token';
export const REFRESH_TOKEN_KEY = 'giveaway-refresh-token';

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
