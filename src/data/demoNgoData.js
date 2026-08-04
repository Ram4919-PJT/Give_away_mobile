/** NGO dashboard data — populated when NGO service is connected. */

export const DEMO_NGO_REQUESTS = [];
export const DEMO_NGO_NOTIFICATIONS = [];
export const DEMO_NGO_TASKS = [];

export const NGO_SUMMARY_STATS = [
  { key: 'total', label: 'Total Requests', ionicon: 'layers-outline', valueKey: 'total' },
  { key: 'open', label: 'Open Requests', ionicon: 'folder-open-outline', valueKey: 'open' },
  { key: 'approved', label: 'Approved', ionicon: 'checkmark-circle-outline', valueKey: 'approved' },
  { key: 'pending', label: 'Pending', ionicon: 'time-outline', valueKey: 'pending' },
  { key: 'delivered', label: 'Delivered', ionicon: 'car-outline', valueKey: 'delivered' },
  { key: 'beneficiaries', label: 'Beneficiaries', ionicon: 'people-outline', valueKey: 'beneficiaries' },
  { key: 'inventory', label: 'Inventory Items', ionicon: 'archive-outline', valueKey: 'inventory' },
];

export const CATEGORY_ICONS = {
  clothes: 'shirt-outline',
  books: 'book-outline',
  food: 'restaurant-outline',
  bedding: 'bed-outline',
  furniture: 'bed-outline',
  medical: 'medkit-outline',
  electronics: 'laptop-outline',
  children: 'happy-outline',
  other: 'cube-outline',
};

export const FINANCIAL_ICONS = {
  medical: 'medkit-outline',
  education: 'school-outline',
  food: 'restaurant-outline',
  housing: 'home-outline',
  disaster: 'warning-outline',
  livelihood: 'briefcase-outline',
  other: 'heart-outline',
};
