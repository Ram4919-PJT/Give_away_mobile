/** Demo accounts mirrored from the Give Away web wireframe */

export const DEMO_ACCOUNTS = [
  {
    id: 'verified-donor',
    group: 'Donor',
    role: 'donor',
    roleLabel: 'Donor',
    title: 'Verified Donor',
    email: 'verified.donor@demo.com',
    password: '123456',
    statusLabel: 'Verified',
    statusType: 'verified',
    verified: true,
    verificationStatus: 'verified',
    name: 'Verified Demo Donor',
    features: ['All modules unlocked', 'Verified Badge', 'Full dashboard access'],
  },
  {
    id: 'pending-donor',
    group: 'Donor',
    role: 'donor',
    roleLabel: 'Donor',
    title: 'Pending Donor',
    email: 'pending.donor@demo.com',
    password: '123456',
    statusLabel: 'Pending Verification',
    statusType: 'pending',
    verified: false,
    verificationStatus: 'registered',
    name: 'Pending Demo Donor',
    features: ['Locked premium features', 'Verification banner', 'Complete Verification'],
  },
  {
    id: 'verified-receiver',
    group: 'Receiver',
    role: 'receiver',
    roleLabel: 'Receiver',
    title: 'Verified Receiver',
    email: 'verified.receiver@demo.com',
    password: '123456',
    statusLabel: 'Verified',
    statusType: 'verified',
    verified: true,
    verificationStatus: 'verified',
    name: 'Verified Demo Receiver',
    features: ['Financial Assistance unlocked', 'My Applications', 'Verified Badge'],
    profile: { mobile: '+91 98765 43220', city: 'Mumbai', state: 'Maharashtra' },
  },
  {
    id: 'pending-receiver',
    group: 'Receiver',
    role: 'receiver',
    roleLabel: 'Receiver',
    title: 'Pending Receiver',
    email: 'pending.receiver@demo.com',
    password: '123456',
    statusLabel: 'Pending Verification',
    statusType: 'pending',
    verified: false,
    verificationStatus: 'registered',
    name: 'Pending Demo Receiver',
    features: ['Assistance locked', 'Verification required', 'Limited access'],
    profile: { mobile: '+91 98765 43221', city: 'Pune', state: 'Maharashtra' },
  },
  {
    id: 'verified-ngo',
    group: 'NGO',
    role: 'ngo',
    roleLabel: 'NGO',
    title: 'Verified NGO',
    email: 'verified.ngo@demo.com',
    password: '123456',
    statusLabel: 'Verified',
    statusType: 'verified',
    verified: true,
    verificationStatus: 'verified',
    name: 'Asha Kiran Foundation (Demo)',
    features: ['Donation Requests', 'Beneficiaries', 'Reports', 'Verified Badge'],
    profile: {
      mobile: '+91 98765 43230',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '12 Relief Lane, Andheri East',
      pincode: '400069',
      repName: 'Priya Sharma',
      website: 'https://ashakiran.demo',
      regNumber: 'MH/NGO/2019/4421',
      mission: 'Dignity-led relief for shelter communities across Maharashtra.',
      about:
        'Asha Kiran Foundation partners with AJA Abayahastham to request stock and funding for local distribution programs.',
      focusAreas: ['Shelter', 'Food Distribution', 'Medical', 'Child Welfare'],
      memberSince: '2019',
      status: 'Verified NGO Partner',
    },
  },
  {
    id: 'pending-ngo',
    group: 'NGO',
    role: 'ngo',
    roleLabel: 'NGO',
    title: 'Pending NGO',
    email: 'pending.ngo@demo.com',
    password: '123456',
    statusLabel: 'Pending Verification',
    statusType: 'pending',
    verified: false,
    verificationStatus: 'submitted',
    name: 'Smile Foundation (Demo)',
    features: ['Features locked', 'Verification progress', 'Complete Verification'],
    profile: {
      mobile: '+91 98765 43231',
      city: 'Delhi',
      state: 'Delhi',
      repName: 'Anil Mehta',
      status: 'Verification Pending',
    },
  },
  {
    id: 'admin',
    group: 'Admin',
    role: 'super-admin',
    roleLabel: 'Admin',
    title: 'Platform Admin',
    email: 'admin@demo.com',
    password: '123456',
    statusLabel: 'Full Access',
    statusType: 'admin',
    verified: true,
    verificationStatus: 'verified',
    name: 'Platform Administrator',
    features: ['Full platform access', 'Verification queue', 'All admin modules'],
  },
];

export const DEMO_ACCOUNT_GROUPS = ['Donor', 'Receiver', 'NGO', 'Admin'];

export const LOGIN_ROLES = [
  { key: 'donor', label: 'Donor', icon: 'heart', description: 'Give items or funds' },
  { key: 'receiver', label: 'Receiver', icon: 'people', description: 'Request support' },
  { key: 'ngo', label: 'NGO', icon: 'business', description: 'Coordinate relief' },
  { key: 'admin', label: 'Admin', icon: 'shield', description: 'Platform access' },
];

export const REGISTER_ROLES = [
  {
    key: 'donor',
    title: 'I want to donate',
    desc: 'Give items or money and track your impact.',
    icon: 'heart',
  },
  {
    key: 'receiver',
    title: 'I need support',
    desc: 'Apply for financial assistance when you need help.',
    icon: 'people',
  },
  {
    key: 'ngo',
    title: 'I represent an NGO',
    desc: 'Partner with us to coordinate relief programs.',
    icon: 'business',
  },
];

export function getDemoAccountById(id) {
  return DEMO_ACCOUNTS.find((a) => a.id === id) || null;
}

export function getDemoAccountByEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  return DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized) || null;
}

export function getDemoAccountsByGroup(group) {
  return DEMO_ACCOUNTS.filter((a) => a.group === group);
}

export function roleDisplayName(role) {
  const map = {
    donor: 'Donor',
    receiver: 'Receiver',
    ngo: 'NGO Partner',
    'super-admin': 'Admin',
    admin: 'Admin',
  };
  return map[role] || role;
}

export function normalizeLoginRole(roleKey) {
  return roleKey === 'admin' ? 'super-admin' : roleKey;
}
