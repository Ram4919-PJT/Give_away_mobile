/** Seed applications + notifications for demo receiver accounts */

export const DEMO_RECEIVER_APPLICATIONS = [
  {
    id: 'APP-2026-001',
    receiverEmail: 'verified.receiver@demo.com',
    receiverName: 'Verified Demo Receiver',
    assistanceType: 'Emergency Relief',
    assistanceIcon: '🚨',
    purpose: 'Emergency house rent support',
    amount: 15000,
    description:
      'Lost job due to medical emergency. Need support for one month rent to avoid eviction.',
    notes: 'Family of 4, two school-going children.',
    status: 'Under Review',
    appliedDate: '2026-07-07',
    documents: {
      'Aadhaar Card': { filename: 'aadhaar_card.pdf', uploaded: true },
      'Income Certificate': { filename: 'income_certificate.pdf', uploaded: true },
      'Government Certificate': { filename: 'govt_certificate.pdf', uploaded: true },
    },
    rejectionReason: null,
    reviewNotes: 'Documents received. AJA Abayahastham is reviewing your application.',
  },
  {
    id: 'APP-2026-002',
    receiverEmail: 'verified.receiver@demo.com',
    receiverName: 'Verified Demo Receiver',
    assistanceType: 'Medical Assistance',
    assistanceIcon: '🏥',
    purpose: 'Monthly family medical support',
    amount: 8500,
    description: 'Need support for ongoing medical treatment for family member.',
    notes: '',
    status: 'Completed',
    appliedDate: '2026-06-01',
    documents: {
      'Aadhaar Card': { filename: 'aadhaar_card.pdf', uploaded: true },
      'Doctor Prescription': { filename: 'prescription.pdf', uploaded: true },
    },
    rejectionReason: null,
    reviewNotes: 'Assistance processed successfully through AJA Abayahastham.',
  },
];

export const DEMO_RECEIVER_NOTIFICATIONS = [
  {
    id: 'rn-1',
    title: 'Application Under Review',
    message: 'APP-2026-001 is being reviewed by AJA Abayahastham.',
    time: '2 hours ago',
    group: 'today',
    read: false,
    icon: 'time-outline',
  },
  {
    id: 'rn-2',
    title: 'Documents Received',
    message: 'Your documents for APP-2026-001 have been received.',
    time: '5 hours ago',
    group: 'today',
    read: false,
    icon: 'document-outline',
  },
  {
    id: 'rn-3',
    title: 'Assistance Completed',
    message: 'Your medical assistance for APP-2026-002 has been completed.',
    time: 'Yesterday',
    group: 'yesterday',
    read: true,
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'rn-4',
    title: 'Welcome to Give Away',
    message: 'Thank you for registering with AJA Abayahastham. Help is one step away.',
    time: '2 days ago',
    group: 'earlier',
    read: true,
    icon: 'heart-outline',
  },
];
