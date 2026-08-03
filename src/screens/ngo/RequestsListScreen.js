import { useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { normalizeRequestStatus } from '../../data/ngoDonationCategories';
import {
  formatRequestAmount,
  getNgoRequests,
  requestStatusTone,
} from '../../utils/ngoHelpers';
import { shadow } from '../../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

const TYPE_FILTERS = ['All', 'Items', 'Financial'];
const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'In Progress', 'Completed', 'Rejected'];

export default function RequestsListScreen() {
  const navigation = useNavigation();
  const { currentUser, ngoRequests } = useAuth();
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const requests = getNgoRequests(ngoRequests, currentUser);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (typeFilter !== 'All' && r.type !== typeFilter) return false;
      if (statusFilter !== 'All') {
        if (normalizeRequestStatus(r.status) !== statusFilter) return false;
      }
      return true;
    });
  }, [requests, typeFilter, statusFilter]);

  const setChip = (setter, value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(value);
  };

  const verified = !!currentUser?.verified;

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>My Requests</Text>
          <Text style={styles.subtitle}>
            {requests.length} request{requests.length === 1 ? '' : 's'} with AJA
          </Text>
        </View>
      </View>

      {/* Primary create actions — web parity */}
      <View style={styles.ctaRow}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaCard,
            styles.ctaPrimary,
            (!verified || pressed) && { opacity: verified ? 0.9 : 0.55 },
          ]}
          disabled={!verified}
          onPress={() => navigation.navigate('RequestDonations')}
        >
          <View style={styles.ctaIconLight}>
            <Ionicons name="cube-outline" size={20} color={WHITE} />
          </View>
          <Text style={styles.ctaTitleLight}>Request Donations</Text>
          <Text style={styles.ctaDescLight}>Warehouse stock & items</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.ctaCard,
            styles.ctaSecondary,
            (!verified || pressed) && { opacity: verified ? 0.9 : 0.55 },
          ]}
          disabled={!verified}
          onPress={() => navigation.navigate('RequestFunds')}
        >
          <View style={styles.ctaIcon}>
            <Ionicons name="wallet-outline" size={20} color={PRIMARY_TEXT} />
          </View>
          <Text style={styles.ctaTitle}>Request Funds</Text>
          <Text style={styles.ctaDesc}>Financial assistance</Text>
        </Pressable>
      </View>

      {!verified ? (
        <View style={styles.lockBanner}>
          <Ionicons name="lock-closed-outline" size={16} color="#C2410C" />
          <Text style={styles.lockText}>
            Complete verification to submit new donation or fund requests.
          </Text>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}
      >
        {TYPE_FILTERS.map((f) => {
          const active = typeFilter === f;
          return (
            <Pressable
              key={`t-${f}`}
              onPress={() => setChip(setTypeFilter, f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.chipScroll, { marginBottom: 16 }]}
        contentContainerStyle={styles.chips}
      >
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f;
          return (
            <Pressable
              key={`s-${f}`}
              onPress={() => setChip(setStatusFilter, f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="clipboard-outline" size={32} color={MUTED} />
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptyBody}>
            Submit your first donation or fund request to track progress here.
          </Text>
        </View>
      ) : (
        filtered.map((r) => {
          const tone = requestStatusTone(r.status);
          return (
            <Pressable
              key={r.id}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
              onPress={() => navigation.navigate('RequestDetail', { id: r.id })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.reqId}>{r.id}</Text>
                <View style={[styles.pill, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.pillText, { color: tone.text }]}>{r.status}</Text>
                </View>
              </View>
              <Text style={styles.purpose} numberOfLines={2}>
                {r.purpose}
              </Text>
              <View style={styles.meta}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name={r.type === 'Financial' ? 'wallet-outline' : 'cube-outline'}
                    size={14}
                    color={MUTED}
                  />
                  <Text style={styles.metaText}>{r.category || r.type}</Text>
                </View>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{formatRequestAmount(r)}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{r.appliedDate}</Text>
              </View>
              {r.priority ? (
                <Text style={styles.priority}>Priority: {r.priority}</Text>
              ) : null}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${r.progress ?? 20}%` },
                  ]}
                />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.viewDetails}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color={PRIMARY_TEXT} />
              </View>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  header: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.4,
  },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4 },
  ctaRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  ctaCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    ...shadow.soft,
  },
  ctaPrimary: { backgroundColor: PRIMARY },
  ctaSecondary: { backgroundColor: WHITE },
  ctaIconLight: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ctaTitleLight: { fontSize: 15, fontWeight: '700', color: WHITE },
  ctaDescLight: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  ctaTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  ctaDesc: { fontSize: 12, color: MUTED, marginTop: 2 },
  lockBanner: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  lockText: { flex: 1, fontSize: 13, color: '#9A3412', lineHeight: 18 },
  chipScroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: 40,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 13, fontWeight: '600', color: MUTED, lineHeight: 16 },
  chipTextActive: { color: WHITE },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    ...shadow.soft,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reqId: { fontSize: 13, fontWeight: '600', color: MUTED },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 12, fontWeight: '600' },
  purpose: { fontSize: 16, fontWeight: '600', color: TEXT, marginBottom: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: MUTED },
  metaDot: { color: MUTED },
  priority: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 10 },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewDetails: { fontSize: 13, fontWeight: '600', color: PRIMARY_TEXT },
  empty: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    ...shadow.soft,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: TEXT, marginTop: 4 },
  emptyBody: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20 },
});
