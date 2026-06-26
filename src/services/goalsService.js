import { apiRequest } from './apiClient';

export async function getGoals() {
  return apiRequest('/goals');
}

export async function createGoal(data) {
  return apiRequest('/goals', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateGoal(id, data) {
  return apiRequest(`/goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteGoal(id) {
  return apiRequest(`/goals/${id}`, {
    method: 'DELETE'
  });
}
