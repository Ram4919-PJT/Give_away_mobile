import { useMemo, useState } from 'react';
import {
  Alert,
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  ASSISTANCE_TYPE_ICONS,
  RECEIVER_TIMELINE_STEPS,
} from '../../data/receiverConstants';
import { formatCurrency } from '../../utils/format';
import {
  getCardTimelineIndex,
  getReceiverApps,
  getTimelineIndex,
  statusTone,
} from '../../utils/receiverHelpers';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const BG = '#F8FAFC';
const BORDER = '#E5E7EB';
const TEXT = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

const FILTERS = ['All', 'Review', 'Approved', 'Completed'];

const FILTER_MAP = {
  All: null,
  Review: ['Submitted', 'Documents Verified', 'Under Review'],
  Approved: ['Approved', 'Assigned', 'Funds Released'],
  Completed: ['Completed'],
};

function ProgressBar({ status }) {
  if (status === 'Rejected') {
    return (
      <View style={styles.rejectTrack}>
        <Text style={styles.rejectTrackText}>Rejected</Text>
      </View>
    );
  }

  const idx = Math.max(0, getCardTimelineIndex(status));
  const pct = Math.min(100, Math.round((idx / 4) * 100));

  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
}

function Locked({ onProfile }) {
  return (
    <Screen contentStyle={styles.screenPad}>
      <View style={styles.lockedWrap}>
        <View style={styles.locked}>
          <Ionicons name="lock-closed-outline" size={28} color={MUTED} />
          <Text style={styles.lockedTitle}>Applications locked</Text>
          <Text style={styles.lockedBody}>
            Complete verification to view your assistance requests.
          </Text>
          <Button title="Go to profile" onPress={onProfile} style={{ alignSelf: 'stretch' }} />
        </View>
      </View>
    </Screen>
  );
}

export function ApplicationsListScreen() {
  const navigation = useNavigation();
  const { currentUser, receiverApplications } = useAuth();
  const [filter, setFilter] = useState('All');
  const apps = getReceiverApps(receiverApplications, currentUser);

  const filtered = useMemo(() => {
    const match = FILTER_MAP[filter];
    if (!match) return apps;
    return apps.filter((a) => match.includes(a.status));
  }, [apps, filter]);

  const selectFilter = (next) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(next);
  };

  if (!currentUser?.verified) {
    return (
      <Locked
        onProfile={() => navigation.navigate('Profile', { screen: 'ReceiverProfile' })}
      />
    );
  }

  const countLabel = `${apps.length} Request${apps.length === 1 ? '' : 's'} with AJA`;

  return (
    <Screen scroll contentStyle={styles.screenPad}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Applications</Text>
          <Text style={styles.subtitle}>{countLabel}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New application"
          onPress={() => navigation.navigate('Apply')}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <Ionicons name="add" size={24} color={WHITE} />
        </Pressable>
      </View>

      {/* Horizontal filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => selectFilter(f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Cards */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No applications</Text>
          <Text style={styles.emptyBody}>Tap + to start a new request.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filtered.map((a) => {
            const tone = statusTone(a.status);
            const icon = a.assistanceIcon || ASSISTANCE_TYPE_ICONS[a.assistanceType] || '📋';

            return (
              <Pressable
                key={a.id}
                onPress={() => navigation.navigate('ApplicationDetail', { id: a.id })}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.cardHead}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {icon}  {a.assistanceType}
                    </Text>
                    <Text style={styles.cardId}>{a.id}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: tone.bg }]}>
                    <Text style={[styles.badgeText, { color: tone.text }]}>{a.status}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {a.purpose}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.amount}>{formatCurrency(a.amount)}</Text>
                  <Text style={styles.date}>{a.appliedDate}</Text>
                </View>

                <ProgressBar status={a.status} />

                <Pressable
                  onPress={() => navigation.navigate('ApplicationDetail', { id: a.id })}
                  style={({ pressed }) => [styles.detailsBtn, pressed && { opacity: 0.88 }]}
                >
                  <Text style={styles.detailsBtnText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color={PRIMARY_TEXT} />
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

export function ApplicationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { receiverApplications } = useAuth();
  const app = receiverApplications?.find((a) => a.id === route.params?.id);

  if (!app) {
    return (
      <Screen contentStyle={styles.screenPad}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={MUTED} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Application not found</Text>
        </View>
      </Screen>
    );
  }

  const tone = statusTone(app.status);
  const idx = getTimelineIndex(app.status);
  const icon = app.assistanceIcon || ASSISTANCE_TYPE_ICONS[app.assistanceType] || '📋';
  const docs = app.documents
    ? Object.entries(app.documents).map(([name, val]) => ({
        name,
        filename: typeof val === 'object' ? val.filename : `${name}.pdf`,
      }))
    : [];

  return (
    <Screen scroll contentStyle={styles.screenPad}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={12}>
        <Ionicons name="arrow-back" size={20} color={MUTED} />
        <Text style={styles.backText}>Applications</Text>
      </Pressable>

      <View style={styles.detailHero}>
        <Text style={styles.detailEmoji}>{icon}</Text>
        <Text style={styles.detailTitle}>{app.assistanceType}</Text>
        <Text style={styles.cardId}>{app.id}</Text>
        <View style={[styles.badge, { backgroundColor: tone.bg, marginTop: 12 }]}>
          <Text style={[styles.badgeText, { color: tone.text }]}>{app.status}</Text>
        </View>
      </View>

      <View style={styles.amountHero}>
        <Text style={styles.amountLabel}>Requested</Text>
        <Text style={styles.amountHeroValue}>{formatCurrency(app.amount)}</Text>
      </View>

      <Card style={styles.sectionCard}>
        <Info label="Purpose" value={app.purpose} />
        <Info label="Submitted" value={app.appliedDate} />
        <Info label="Description" value={app.description || '—'} last />
      </Card>

      {app.rejectionReason ? (
        <View style={styles.rejectBox}>
          <Text style={styles.rejectTitle}>Rejected</Text>
          <Text style={styles.rejectBody}>{app.rejectionReason}</Text>
          <Button title="Apply again" onPress={() => navigation.navigate('Apply')} />
        </View>
      ) : null}

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {RECEIVER_TIMELINE_STEPS.map((step, i) => {
          const done = idx >= 0 && i <= idx;
          return (
            <View key={step} style={styles.timelineRow}>
              <View style={[styles.timelineDot, done && styles.timelineDotDone]}>
                {done ? <Ionicons name="checkmark" size={12} color={WHITE} /> : null}
              </View>
              <Text style={[styles.timelineText, done && styles.timelineTextDone]}>{step}</Text>
            </View>
          );
        })}
      </Card>

      {docs.length > 0 ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {docs.map((d) => (
            <View key={d.name} style={styles.docRow}>
              <Ionicons name="document-text-outline" size={18} color={PRIMARY} />
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>{d.name}</Text>
                <Text style={styles.docFile}>{d.filename}</Text>
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      {app.reviewNotes ? (
        <View style={styles.reviewNotes}>
          <Text style={styles.sectionTitle}>Review notes</Text>
          <Text style={styles.reviewBody}>{app.reviewNotes}</Text>
        </View>
      ) : null}

      <Button
        title="Download summary"
        variant="secondary"
        onPress={() => Alert.alert('Give Away', `Downloading summary for ${app.id} (demo).`)}
      />
    </Screen>
  );
}

function Info({ label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenPad: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 32,
    backgroundColor: BG,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '400',
    color: MUTED,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },

  /* Filters */
  filters: {
    gap: 10,
    paddingVertical: 2,
  },
  chip: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
  },
  chipTextActive: {
    color: WHITE,
  },

  /* Cards */
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardPressed: {
    opacity: 0.97,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT,
    letterSpacing: -0.2,
  },
  cardId: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: PRIMARY,
  },
  rejectTrack: {
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectTrackText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
  },
  detailsBtn: {
    height: 44,
    borderRadius: 14,
    backgroundColor: PRIMARY_SOFT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_TEXT,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
  },
  emptyBody: {
    fontSize: 14,
    color: MUTED,
  },

  lockedWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  locked: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },
  lockedBody: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
    textAlign: 'center',
  },

  /* Detail (unchanged behavior) */
  back: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
  },
  detailHero: {
    alignItems: 'center',
  },
  detailEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
  },
  amountHero: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: PRIMARY_SOFT,
    gap: 4,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: PRIMARY_TEXT,
  },
  amountHeroValue: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
  },
  sectionCard: {
    gap: 0,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 12,
  },
  infoRow: {
    paddingVertical: 14,
    gap: 4,
  },
  infoBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: MUTED,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    lineHeight: 22,
  },
  rejectBox: {
    gap: 12,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
  },
  rejectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B91C1C',
  },
  rejectBody: {
    fontSize: 14,
    color: MUTED,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  timelineText: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED,
  },
  timelineTextDone: {
    color: TEXT,
    fontWeight: '600',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  docName: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
  },
  docFile: {
    fontSize: 12,
    color: MUTED,
  },
  reviewNotes: {
    gap: 8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
  },
  reviewBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1D4ED8',
  },
});
