import { DONOR_JOURNEY_STEPS, DONOR_STATUS_MAP } from '../data/donorConstants';

export function getDonorDonations(donations, user) {
  if (!user) return [];
  const key = (user.email || '').toLowerCase();
  return (donations || []).filter(
    (d) => (d.donorEmail || '').toLowerCase() === key || d.donor === user.name
  );
}

export function normalizeDonorStatus(status) {
  return DONOR_STATUS_MAP[status] || status || 'Pending';
}

export function getDonorStats(donations, user) {
  const list = getDonorDonations(donations, user);
  const financial = list.filter((d) => d.type === 'Financial');
  const items = list.filter((d) => d.type === 'Items');
  const completed = list.filter((d) => normalizeDonorStatus(d.status) === 'Completed');

  return {
    totalDonations: list.length,
    itemsDonated: items.length,
    moneyDonated: financial.reduce((s, d) => s + (d.amount || 0), 0),
    livesImpacted:
      list.reduce(
        (s, d) =>
          s + (d.livesImpacted || (normalizeDonorStatus(d.status) === 'Completed' ? 2 : 0)),
        0
      ) || completed.length * 2,
    familiesHelped:
      list.reduce(
        (s, d) =>
          s + (d.familiesHelped || (normalizeDonorStatus(d.status) === 'Completed' ? 1 : 0)),
        0
      ) || completed.length,
  };
}

export function getJourneyIndex(status) {
  const normalized = normalizeDonorStatus(status);
  const map = {
    Pending: 0,
    Approved: 1,
    'Pickup Scheduled': 1,
    Collected: 2,
    Assigned: 3,
    Delivered: 4,
    Completed: 4,
  };
  return map[normalized] ?? 0;
}

export function statusTone(status) {
  const n = normalizeDonorStatus(status);
  const map = {
    Pending: { bg: '#FFF7ED', text: '#C2410C' },
    Approved: { bg: '#EFF6FF', text: '#1D4ED8' },
    'Pickup Scheduled': { bg: '#F0F9FF', text: '#0369A1' },
    Collected: { bg: '#EEF2FF', text: '#4338CA' },
    Assigned: { bg: '#F5F3FF', text: '#6D28D9' },
    Delivered: { bg: '#ECFDF5', text: '#047857' },
    Completed: { bg: '#ECFDF5', text: '#15803D' },
  };
  return map[n] || map.Pending;
}

export { DONOR_JOURNEY_STEPS };
