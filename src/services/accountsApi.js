import { API_URL, apiRequest } from './apiClient';

export { API_URL };

export async function getAccounts() {
  return apiRequest('/accounts');
}

export async function createAccount(data) {
  return apiRequest('/accounts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAccount(id, data) {
  return apiRequest(`/accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteAccount(id) {
  return apiRequest(`/accounts/${id}`, {
    method: 'DELETE'
  });
}
