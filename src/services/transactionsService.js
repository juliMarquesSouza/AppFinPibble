import { apiRequest } from './apiClient';

export async function getTransactions() {
  return apiRequest('/transactions');
}

export async function createTransaction(data) {
  return apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateTransaction(id, data) {
  return apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteTransaction(id) {
  return apiRequest(`/transactions/${id}`, {
    method: 'DELETE'
  });
}
