import { apiRequest, saveSession } from './apiClient';

export async function register(data) {
  const session = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  await saveSession(session);

  return session;
}

export async function login(data) {
  const session = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  await saveSession(session);

  return session;
}

export async function forgotPassword(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function resetPassword(data) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
