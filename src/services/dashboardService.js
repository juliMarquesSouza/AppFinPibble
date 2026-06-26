import { apiRequest } from './apiClient';

export async function getDashboardSummary() {
  return apiRequest('/dashboard/summary');
}
