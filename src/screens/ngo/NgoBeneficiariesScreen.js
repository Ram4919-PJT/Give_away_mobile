import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { DEMO_NGO_BENEFICIARIES } from '../../data/demoNgoBeneficiaries';
import { getInitials } from '../../utils/ngoHelpers';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

const FILTERS = ['All', 'Active', 'In Progress', 'Completed', 'Pending', 'On Hold'];

function tone(status) {
  const map = {
    Active: { bg: '#ECFDF5', text: '#15803D' },
    'In Progress': { bg: '#EFF6FF', text: '#1D4ED8' },
    Completed: { bg: '#F1F5F9', text: '#64748B' },
    Pending: { bg: '#FFF7ED', text: '#C2410C' },
    'On Hold': { bg: '#FEF2F2', text: '#B91C1C' },
  };
  return map[status] || map.Pending;
}

export default function NgoBeneficiariesScreen() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => {
    if (filter === 'All') return DEMO_NGO_BENEFICIARIES;
    return DEMO_NGO_BENEFICIARIES.filter((b) => b.status === filter);
  }, [filter]);

  const activeCount = DEMO_NGO_BENEFICIARIES.filter((b) => b.status === 'Active').length;

  if (!currentUser?.verified) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={20} color={PRIMARY_TEXT} />
          <Text style={styles.backText}>Profile</Text>
        </Pressable>
        <Text style={styles.title}>Beneficiaries</Text>
        <View style={styles.locked}>
          <Ionicons name="lock-closed-outline" size={28} color={MUTED} />
          <Text style={styles.lockedTitle}>Beneficiaries locked</Text>
          <Text style={styles.lockedBody}>
            Complete verification to manage people supported by your programs.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={PRIMARY_TEXT} />
        <Text style={styles.backText}>Profile</Text>
      </Pressable>

      <Text style={styles.title}>Beneficiaries</Text>
      <Text style={styles.subtitle}>
        {DEMO_NGO_BENEFICIARIES.length} people · {activeCount} active
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}
      >
        {FILTERS.map((f) => {
          const on = filter === f;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {list.map((b) => {
        const t = tone(b.status);
        return (
          <Pressable
            key={b.id}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
            onPress={() => setSelected(b)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(b.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{b.name}</Text>
              <Text style={styles.meta}>
                {b.type} · {b.location}
              </Text>
              <View style={[styles.pill, { backgroundColor: t.bg }]}>
                <Text style={[styles.pillText, { color: t.text }]}>{b.status}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={MUTED} />
          </Pressable>
        );
      })}

      <BottomSheet
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || 'Beneficiary'}
      >
        {selected ? (
          <View style={styles.detail}>
            <Detail label="Assistance" value={selected.type} />
            <Detail label="Status" value={selected.status} />
            <Detail label="Support" value={selected.resources} />
            <Detail label="Amount" value={selected.amount} />
            <Detail label="Location" value={selected.location} />
            <Detail label="Progress" value={selected.completion} />
            <Detail label="Last updated" value={selected.lastUpdated} />
            <Detail label="Completed donations" value={String(selected.completedDonations)} />
          </View>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '600', color: PRIMARY_TEXT },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 14 },
  chipScroll: { flexGrow: 0, height: 40, marginBottom: 14 },
  chips: { gap: 8, alignItems: 'center', paddingRight: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 12, fontWeight: '600', color: MUTED },
  chipTextOn: { color: WHITE },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: PRIMARY_TEXT },
  name: { fontSize: 15, fontWeight: '700', color: TEXT },
  meta: { fontSize: 12, color: MUTED, marginTop: 2, marginBottom: 6 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  pillText: { fontSize: 11, fontWeight: '700' },
  locked: {
    marginTop: 32,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    ...shadow.soft,
  },
  lockedTitle: { fontSize: 18, fontWeight: '700', color: TEXT },
  lockedBody: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20 },
  detail: { gap: 12, paddingTop: 4 },
  detailRow: { gap: 2 },
  detailLabel: { fontSize: 11, fontWeight: '700', color: MUTED, textTransform: 'uppercase' },
  detailValue: { fontSize: 15, fontWeight: '500', color: TEXT },
});
