import { apiRequest } from './client';

export async function listNotifications() {
  return apiRequest('/notifications/');
}

export async function markNotificationRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}
