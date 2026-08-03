export function getNgoRequests(requests, user) {
  if (!user) return [];
  const key = (user.email || '').toLowerCase();
  return (requests || []).filter((r) => (r.ngoEmail || '').toLowerCase() === key);
}

export function getRequestProgress(status) {
  const order = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Processing', 'Completed', 'Delivered'];
  const idx = order.indexOf(status);
  if (status === 'Rejected') return 100;
  if (idx < 0) return 10;
  return Math.round((idx / (order.length - 1)) * 100);
}

export function buildTimeline(status) {
  const steps = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Processing', 'Completed'];
  if (status === 'Delivered') status = 'Completed';
  const idx = steps.indexOf(status);
  const activeIdx = idx < 0 ? 1 : idx;
  return steps.map((step, i) => ({
    step,
    done: i <= activeIdx,
    active: i === activeIdx,
  }));
}

export function getNgoDashboardStats(requests, { beneficiaries = 120, inventory = 48 } = {}) {
  const list = requests || [];
  return {
    total: list.length,
    open: list.filter((r) => ['Submitted', 'Under Review'].includes(r.status)).length,
    approved: list.filter((r) => r.status === 'Approved').length,
    pending: list.filter((r) => ['Submitted', 'Under Review', 'Pending'].includes(r.status)).length,
    delivered: list.filter((r) => ['Delivered', 'Completed'].includes(r.status)).length,
    beneficiaries,
    inventory,
  };
}

export function formatRequestAmount(req) {
  if (req.amount != null) return `₹${Number(req.amount).toLocaleString('en-IN')}`;
  if (req.quantity != null) return `${req.quantity} items`;
  return '—';
}

export function requestStatusTone(status) {
  const map = {
    Draft: { bg: '#F1F5F9', text: '#64748B' },
    Submitted: { bg: '#EFF6FF', text: '#1D4ED8' },
    'Under Review': { bg: '#FFF7ED', text: '#C2410C' },
    Approved: { bg: '#ECFDF5', text: '#15803D' },
    Rejected: { bg: '#FEF2F2', text: '#B91C1C' },
    Delivered: { bg: '#F0FDF4', text: '#166534' },
    Completed: { bg: '#ECFDF5', text: '#15803D' },
  };
  return map[status] || map.Submitted;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning,';
  if (h < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

export function getInitials(name) {
  return (name || 'N')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
