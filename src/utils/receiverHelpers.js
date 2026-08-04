export function getReceiverApps(apps, user) {
  if (!user) return [];
  const emailKey = (user.email || '').toLowerCase();
  const userId = user.id || user.user_id || user.userId;
  const list = apps || [];
  const matched = list.filter(
    (a) =>
      (userId && a.receiver_user_id === userId) ||
      (a.receiverEmail || '').toLowerCase() === emailKey
  );
  if (!matched.length && list.length && user.role === 'receiver') return list;
  return matched;
}

export function getReceiverStats(apps) {
  const list = apps || [];
  return {
    submitted: list.length,
    underReview: list.filter((a) =>
      ['Submitted', 'Documents Verified', 'Under Review'].includes(a.status)
    ).length,
    approved: list.filter((a) =>
      ['Approved', 'Assigned', 'Funds Released', 'Completed'].includes(a.status)
    ).length,
    rejected: list.filter((a) => a.status === 'Rejected').length,
  };
}

export function getTimelineIndex(status) {
  if (status === 'Rejected') return -1;
  const steps = [
    'Submitted',
    'Documents Verified',
    'Under Review',
    'Approved',
    'Assigned',
    'Funds Released',
    'Completed',
  ];
  const idx = steps.indexOf(status);
  if (idx >= 0) return idx;
  if (status === 'Draft') return -1;
  return status === 'Under Review' ? 2 : 0;
}

export function getCardTimelineIndex(status) {
  const map = {
    Draft: -1,
    Submitted: 0,
    'Documents Verified': 1,
    'Under Review': 1,
    Approved: 2,
    Assigned: 2,
    'Funds Released': 3,
    Completed: 4,
    Rejected: -1,
  };
  return map[status] ?? 0;
}

export function statusTone(status) {
  const map = {
    Draft: { bg: '#F1F5F9', text: '#64748B' },
    Submitted: { bg: '#EFF6FF', text: '#1D4ED8' },
    'Documents Verified': { bg: '#EFF6FF', text: '#1D4ED8' },
    'Under Review': { bg: '#FFF7ED', text: '#C2410C' },
    Approved: { bg: '#ECFDF5', text: '#047857' },
    Assigned: { bg: '#ECFDF5', text: '#047857' },
    'Funds Released': { bg: '#F0FDF4', text: '#15803D' },
    Completed: { bg: '#ECFDF5', text: '#15803D' },
    Rejected: { bg: '#FEF2F2', text: '#B91C1C' },
  };
  return map[status] || map.Draft;
}

export function getInitials(name) {
  return (name || 'R')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
