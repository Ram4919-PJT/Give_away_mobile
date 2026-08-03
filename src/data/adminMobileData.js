/** Compact admin wireframe seed mirroring the web admin modules */

export const ADMIN_DASHBOARD_KPIS = [
  { key: 'pendingDonors', label: 'Pending Donor Verifications', value: 4, icon: 'person-outline' },
  { key: 'pendingReceivers', label: 'Pending Receiver Verifications', value: 3, icon: 'people-outline' },
  { key: 'pendingNgos', label: 'Pending NGO Verifications', value: 2, icon: 'business-outline' },
  { key: 'openFinancial', label: 'Open Financial Assistance', value: 7, icon: 'wallet-outline' },
  { key: 'pendingItems', label: 'Pending Item Donations', value: 11, icon: 'cube-outline' },
  { key: 'completedDonations', label: 'Completed Donations', value: 186, icon: 'checkmark-circle-outline' },
  { key: 'activeNgos', label: 'Active NGOs', value: 24, icon: 'flag-outline' },
  { key: 'fundsManaged', label: 'Platform Funds', value: '₹24.5L', icon: 'cash-outline' },
];

export const ADMIN_PRIORITY_ACTIONS = [
  {
    id: 'pa1',
    title: 'Review NGO verifications',
    detail: '2 NGOs awaiting document review',
    icon: 'shield-checkmark-outline',
    tab: 'Queue',
  },
  {
    id: 'pa2',
    title: 'Priority financial cases',
    detail: '3 urgent assistance requests',
    icon: 'flash-outline',
    screen: 'AdminPriority',
  },
  {
    id: 'pa3',
    title: 'Allocate inventory stock',
    detail: '5 available items need assignment',
    icon: 'archive-outline',
    screen: 'AdminInventory',
  },
  {
    id: 'pa4',
    title: 'Release pending funds',
    detail: '₹2.8L awaiting disbursement',
    icon: 'wallet-outline',
    screen: 'AdminFunds',
  },
];

export const ADMIN_USER_TAB_COUNTS = {
  donors: 245,
  receivers: 132,
  ngos: 28,
  admins: 5,
};

export const ADMIN_PLATFORM_USERS = {
  donors: [
    {
      id: 'u-d1',
      name: 'Demo Donor',
      email: 'donor@gmail.com',
      role: 'Donor',
      verificationStatus: 'Verified',
      joinedDate: '2026-01-15',
      status: 'Active',
      avatar: 'DD',
    },
    {
      id: 'u-d2',
      name: 'Rajesh Mehta',
      email: 'rajesh@example.com',
      role: 'Donor',
      verificationStatus: 'Verified',
      joinedDate: '2026-03-20',
      status: 'Active',
      avatar: 'RM',
    },
    {
      id: 'u-d3',
      name: 'Anita Verma',
      email: 'anita@example.com',
      role: 'Donor',
      verificationStatus: 'Pending',
      joinedDate: '2026-07-01',
      status: 'Active',
      avatar: 'AV',
    },
  ],
  receivers: [
    {
      id: 'u-r1',
      name: 'Ravi Kumar',
      email: 'receiver@outlook.com',
      role: 'Receiver',
      verificationStatus: 'Verified',
      joinedDate: '2026-06-01',
      status: 'Active',
      avatar: 'RK',
    },
    {
      id: 'u-r2',
      name: 'Sunita Deshmukh',
      email: 'sunita@example.com',
      role: 'Receiver',
      verificationStatus: 'Pending',
      joinedDate: '2026-07-05',
      status: 'Active',
      avatar: 'SD',
    },
  ],
  ngos: [
    {
      id: 'u-n1',
      name: 'Asha Kiran Foundation',
      email: 'ngo@ashakiran.org',
      role: 'NGO',
      verificationStatus: 'Verified',
      joinedDate: '2018-04-20',
      status: 'Active',
      avatar: 'AK',
    },
    {
      id: 'u-n2',
      name: 'Smile Foundation',
      email: 'info@smilefoundationindia.org',
      role: 'NGO',
      verificationStatus: 'Pending Verification',
      joinedDate: '2026-06-15',
      status: 'Under Review',
      avatar: 'SF',
    },
  ],
  admins: [
    {
      id: 'u-a1',
      name: 'Platform Admin',
      email: 'admin@abhayahastam.org',
      role: 'Admin',
      verificationStatus: 'Verified',
      joinedDate: '2025-01-01',
      status: 'Active',
      avatar: 'PA',
    },
  ],
};

export const ADMIN_INVENTORY_ITEMS = [
  {
    id: 'inv-item-1',
    name: 'Winter Jackets',
    category: 'Clothes',
    condition: 'Good',
    quantity: 15,
    donorName: 'Demo Donor',
    receivedDate: '2026-07-10',
    status: 'Available',
    storageLocation: 'Warehouse A — Shelf 12',
    assignedNgo: null,
  },
  {
    id: 'inv-item-2',
    name: 'First Aid Kits',
    category: 'Medical Equipment',
    condition: 'New',
    quantity: 30,
    donorName: 'Rajesh Mehta',
    receivedDate: '2026-07-08',
    status: 'Reserved',
    storageLocation: 'Medical Storage — Unit 3',
    assignedNgo: 'Asha Kiran Foundation',
  },
  {
    id: 'inv-item-3',
    name: 'Study Books Set',
    category: 'Educational Materials',
    condition: 'Good',
    quantity: 48,
    donorName: 'Anita Verma',
    receivedDate: '2026-07-07',
    status: 'Available',
    storageLocation: 'Warehouse B — Shelf 4',
    assignedNgo: null,
  },
  {
    id: 'inv-item-4',
    name: 'Wheelchairs',
    category: 'Medical Equipment',
    condition: 'Fair',
    quantity: 8,
    donorName: 'Corporate CSR Fund',
    receivedDate: '2026-07-05',
    status: 'Delivered',
    storageLocation: 'Delivered',
    assignedNgo: 'Helpage India',
  },
];

export const ADMIN_FUND_SUMMARY = {
  totalReceived: 2450000,
  availableBalance: 680000,
  allocated: 1200000,
  distributed: 920000,
  pendingAllocation: 280000,
  monthlyDonations: 185000,
};

export const PRIORITY_QUEUE_ITEMS = [
  {
    id: 'pq-1',
    title: 'Emergency Rent Support',
    entity: 'Ravi Kumar',
    type: 'Financial',
    priority: 'Urgent',
    status: 'Pending',
    date: '2026-07-10',
    assignee: 'Unassigned',
  },
  {
    id: 'pq-2',
    title: 'NGO Verification — Smile Foundation',
    entity: 'Smile Foundation',
    type: 'Verification',
    priority: 'High',
    status: 'Pending',
    date: '2026-07-09',
    assignee: 'Admin',
  },
  {
    id: 'pq-3',
    title: 'Winter Blankets Request',
    entity: 'Asha Kiran Foundation',
    type: 'Items',
    priority: 'High',
    status: 'Under Review',
    date: '2026-07-08',
    assignee: 'Admin',
  },
  {
    id: 'pq-4',
    title: 'Receiver Verification',
    entity: 'Sunita Deshmukh',
    type: 'Verification',
    priority: 'Normal',
    status: 'Pending',
    date: '2026-07-09',
    assignee: 'Unassigned',
  },
];

export const ADMIN_NOTIFICATIONS_LIST = [
  {
    id: 'adm-n1',
    title: 'New NGO Verification',
    message: 'Smile Foundation submitted verification documents.',
    time: '10 min ago',
    priority: 'High',
    read: false,
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'adm-n2',
    title: 'Emergency Assistance Request',
    message: 'APP-2026-001 flagged as high priority medical case.',
    time: '25 min ago',
    priority: 'Urgent',
    read: false,
    icon: 'warning-outline',
  },
  {
    id: 'adm-n3',
    title: 'Donation Assigned',
    message: 'Item donation assigned to Asha Kiran Foundation.',
    time: '1 hour ago',
    priority: 'Normal',
    read: true,
    icon: 'gift-outline',
  },
  {
    id: 'adm-n4',
    title: 'Funds Released',
    message: '₹1,000 medical fund released to verified beneficiary.',
    time: 'Yesterday',
    priority: 'Normal',
    read: true,
    icon: 'cash-outline',
  },
];

export const ADMIN_NGO_LIST = [
  {
    id: 'ngo-1',
    name: 'Asha Kiran Foundation',
    city: 'Mumbai',
    status: 'Verified',
    beneficiaries: 320,
    activeRequests: 4,
    contact: 'Priya Sharma',
  },
  {
    id: 'ngo-2',
    name: 'Helpage India',
    city: 'New Delhi',
    status: 'Verified',
    beneficiaries: 890,
    activeRequests: 6,
    contact: 'Dr. Rajesh Singh',
  },
  {
    id: 'ngo-3',
    name: 'Smile Foundation',
    city: 'Gurugram',
    status: 'Pending',
    beneficiaries: 0,
    activeRequests: 1,
    contact: 'Amit Gupta',
  },
];

export const ADMIN_REPORT_KPIS = [
  { label: 'Total Reports', value: '248' },
  { label: 'This Month', value: '32' },
  { label: 'Scheduled', value: '7' },
  { label: 'Total Donations', value: '1,248' },
  { label: 'Funds Distributed', value: '₹9.2L' },
  { label: 'Active NGOs', value: '24' },
];

export const ADMIN_REPORT_TABS = [
  'Donation',
  'Fund',
  'NGO',
  'Beneficiary',
  'Platform',
];

export const ADMIN_MORE_MODULES = [
  { label: 'Priority Queue', desc: 'Urgent financial and verification cases', icon: 'flash-outline', screen: 'AdminPriority' },
  { label: 'NGO Management', desc: 'Partner NGOs and account status', icon: 'business-outline', screen: 'AdminNgos' },
  { label: 'Item Inventory', desc: 'Warehouse stock and assignments', icon: 'archive-outline', screen: 'AdminInventory' },
  { label: 'Fund Management', desc: 'Balances, allocations, releases', icon: 'wallet-outline', screen: 'AdminFunds' },
  { label: 'Donations', desc: 'Item and money donation oversight', icon: 'gift-outline', screen: 'AdminDonations' },
  { label: 'Financial Assistance', desc: 'Aid requests and disbursements', icon: 'heart-outline', screen: 'AdminFinancial' },
  { label: 'Notifications', desc: 'Platform alerts for admins', icon: 'notifications-outline', screen: 'AdminNotifications' },
  { label: 'System Logs', desc: 'Audit trail and activity history', icon: 'list-outline', screen: 'AdminLogs' },
  { label: 'Settings', desc: 'Platform configuration', icon: 'settings-outline', screen: 'AdminSettings' },
];

export const ADMIN_SETTINGS_SECTIONS = [
  { id: 'security', title: 'Security', desc: 'Password, 2FA, sessions, roles', icon: 'lock-closed-outline' },
  { id: 'notifications', title: 'Notifications', desc: 'Email, push, digest frequency', icon: 'notifications-outline' },
  { id: 'verification', title: 'Verification Rules', desc: 'Required docs and review flow', icon: 'shield-checkmark-outline' },
  { id: 'donation', title: 'Donation Limits', desc: 'Min/max and anonymous gifts', icon: 'gift-outline' },
  { id: 'financial', title: 'Financial Rules', desc: 'Budgets and allocation', icon: 'cash-outline' },
  { id: 'system', title: 'System', desc: 'Maintenance, language, timezone', icon: 'cog-outline' },
];

export function formatInr(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export function getInventorySummary(items = ADMIN_INVENTORY_ITEMS) {
  return {
    total: items.reduce((s, i) => s + i.quantity, 0),
    available: items.filter((i) => i.status === 'Available').reduce((s, i) => s + i.quantity, 0),
    reserved: items.filter((i) => i.status === 'Reserved').reduce((s, i) => s + i.quantity, 0),
    delivered: items.filter((i) => i.status === 'Delivered').reduce((s, i) => s + i.quantity, 0),
  };
}

export function statusTone(status) {
  const map = {
    Pending: { bg: '#FFF7ED', text: '#C2410C' },
    'Under Review': { bg: '#EFF6FF', text: '#1D4ED8' },
    Verified: { bg: '#ECFDF5', text: '#15803D' },
    Approved: { bg: '#ECFDF5', text: '#15803D' },
    Rejected: { bg: '#FEF2F2', text: '#B91C1C' },
    Active: { bg: '#ECFDF5', text: '#15803D' },
    Available: { bg: '#ECFDF5', text: '#15803D' },
    Reserved: { bg: '#EFF6FF', text: '#1D4ED8' },
    Delivered: { bg: '#F1F5F9', text: '#64748B' },
    'In Storage': { bg: '#FFF7ED', text: '#C2410C' },
    Urgent: { bg: '#FEF2F2', text: '#B91C1C' },
    High: { bg: '#FFF7ED', text: '#C2410C' },
    Normal: { bg: '#F1F5F9', text: '#64748B' },
  };
  return map[status] || { bg: '#F1F5F9', text: '#64748B' };
}
