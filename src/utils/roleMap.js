const IAM_TO_MOBILE = {
  DONOR: 'donor',
  RECEIVER: 'receiver',
  NGO: 'ngo',
  SUPER_ADMIN: 'super-admin',
};

const MOBILE_TO_IAM = {
  donor: 'DONOR',
  receiver: 'RECEIVER',
  ngo: 'NGO',
};

export function mapRoleFromIam(iamRoleName) {
  return IAM_TO_MOBILE[iamRoleName] || 'donor';
}

export function mapRoleToIam(mobileRole) {
  return MOBILE_TO_IAM[mobileRole] || null;
}

export function mapIamUser(iamUser) {
  const roleName = iamUser.role?.role_name || iamUser.role_name;
  return {
    userId: iamUser.user_id,
    name: iamUser.full_name,
    email: iamUser.email,
    mobile: iamUser.mobile || '',
    role: mapRoleFromIam(roleName),
    status: iamUser.status,
    memberSince: iamUser.created_at ? String(iamUser.created_at).split('T')[0] : '',
    verified: false,
    verificationStatus: 'registered',
  };
}

export function normalizeMobileInput(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10) return digits;
  return digits.slice(-10);
}

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
