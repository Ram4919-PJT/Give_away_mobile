export const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  primaryDeep: '#15803D',
  primarySoft: '#ECFDF5',
  blue: '#2563EB',
  blueSoft: '#EFF6FF',
  accent: '#F97316',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderSoft: '#F1F5F9',
  danger: '#EF4444',
  warning: '#F59E0B',
  dark: '#111827',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
};

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
};

export const typography = {
  hero: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: colors.text },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, color: colors.text },
  section: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22, color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '600', color: '#334155' },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
};
