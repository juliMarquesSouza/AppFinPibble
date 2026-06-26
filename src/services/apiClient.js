/* global fetch */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:3333';

const TOKEN_KEY = '@finpibble:token';
const USER_KEY = '@finpibble:user';

export async function saveSession({ token, user }) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)]
  ]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function getStoredUser() {
  const storedUser = await AsyncStorage.getItem(USER_KEY);

  return storedUser ? JSON.parse(storedUser) : null;
}

export async function apiRequest(path, options = {}) {
  const token = await getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível conectar ao FinPibble');
  }

  return data;
}
