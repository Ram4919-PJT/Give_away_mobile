import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  DEMO_NGO_NOTIFICATIONS,
  DEMO_NGO_TASKS,
  NGO_SUMMARY_STATS,
} from '../../data/demoNgoData';
import { DEMO_NGO_INVENTORY } from '../../data/demoNgoInventory';
import { countAvailableItems } from '../../utils/inventoryHelpers';
import {
  formatRequestAmount,
  getGreeting,
  getInitials,
  getNgoDashboardStats,
  getNgoRequests,
  requestStatusTone,
} from '../../utils/ngoHelpers';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const ACTION_W = (Math.min(Dimensions.get('window').width, 393) - 40 - 12) / 2;

const QUICK_ACTIONS = [
  {
    label: 'Request Donations',
    desc: 'Ask for warehouse stock',
    icon: 'cube-outline',
    tab: 'Requests',
    params: { screen: 'RequestDonations' },
  },
  {
    label: 'Request Funds',
    desc: 'Program funding support',
    icon: 'wallet-outline',
    tab: 'Requests',
    params: { screen: 'RequestFunds' },
  },
  {
    label: 'Manage Requests',
    desc: 'Track all submissions',
    icon: 'clipboard-outline',
    tab: 'Requests',
    params: { screen: 'RequestsList' },
  },
  {
    label: 'Inventory',
    desc: 'Stock and allocations',
    icon: 'archive-outline',
    tab: 'Inventory',
  },
  {
    label: 'Beneficiaries',
    desc: 'People you support',
    icon: 'people-outline',
    tab: 'Profile',
    params: { screen: 'NgoBeneficiaries' },
  },
  {
    label: 'Reports',
    desc: 'Impact summaries',
    icon: 'bar-chart-outline',
    tab: 'Reports',
  },
  {
    label: 'Messages',
    desc: 'Partner communications',
    icon: 'chatbubble-ellipses-outline',
    tab: 'Profile',
    params: { screen: 'NgoNotifications' },
  },
  {
    label: 'Notifications',
    desc: 'Latest portal updates',
    icon: 'notifications-outline',
    tab: 'Profile',
    params: { screen: 'NgoNotifications' },
  },
];

function toast(title) {
  Alert.alert(title, 'Wireframe preview — opens on the web portal.');
}

export default function NgoHomeScreen() {
  const navigation = useNavigation();
  const { currentUser, ngoRequests } = useAuth();
  const requests = getNgoRequests(ngoRequests, currentUser);
  const stats = getNgoDashboardStats(requests, {
    inventory: countAvailableItems(DEMO_NGO_INVENTORY),
  });
  const recent = requests.slice(0, 3);
  const notifs = DEMO_NGO_NOTIFICATIONS.slice(0, 3);
  const unread = DEMO_NGO_NOTIFICATIONS.filter((n) => !n.read).length;
  const orgName = (currentUser?.name || 'NGO Partner').replace(/\s*\(Demo\)\s*$/i, '');
  const verified = !!currentUser?.verified;

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.orgName} numberOfLines={2}>
            {orgName}
          </Text>
          {verified ? (
            <View style={styles.badgeRow}>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color={PRIMARY_TEXT} />
                <Text style={styles.verifiedText}>Verified NGO</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.unverified}>Verification pending</Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => toast('Search')}
            hitSlop={6}
            accessibilityLabel="Search"
          >
            <Ionicons name="search-outline" size={20} color={TEXT} />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() =>
              navigation.navigate('Profile', { screen: 'NgoNotifications' })
            }
            hitSlop={6}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={20} color={TEXT} />
            {unread > 0 ? <View style={styles.dot} /> : null}
          </Pressable>
          <Pressable
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
            accessibilityLabel="Profile"
          >
            <Text style={styles.avatarText}>{getInitials(orgName)}</Text>
          </Pressable>
        </View>
      </View>

      {/* Summary cards — horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
        style={styles.statsWrap}
      >
        {NGO_SUMMARY_STATS.map((s) => (
          <View key={s.key} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name={s.ionicon} size={18} color={PRIMARY_TEXT} />
            </View>
            <Text style={styles.statValue}>{stats[s.valueKey] ?? 0}</Text>
            <Text style={styles.statLabel} numberOfLines={2}>
              {s.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Quick actions — 2 column */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((a) => (
          <Pressable
            key={a.label}
            style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
            onPress={() =>
              a.params ? navigation.navigate(a.tab, a.params) : navigation.navigate(a.tab)
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons name={a.icon} size={20} color={PRIMARY_TEXT} />
            </View>
            <Text style={styles.actionTitle} numberOfLines={1}>
              {a.label}
            </Text>
            <Text style={styles.actionDesc} numberOfLines={2}>
              {a.desc}
            </Text>
            <View style={styles.actionChevron}>
              <Ionicons name="chevron-forward" size={16} color={MUTED} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Recent Requests */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Recent Requests</Text>
        <Pressable onPress={() => navigation.navigate('Requests')} hitSlop={8}>
          <Text style={styles.link}>View all</Text>
        </Pressable>
      </View>
      {recent.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="cube-outline" size={28} color={MUTED} />
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptyBody}>Submit your first donation request once verified.</Text>
        </View>
      ) : (
        recent.map((r) => {
          const tone = requestStatusTone(r.status);
          return (
            <View key={r.id} style={styles.requestCard}>
              <View style={styles.requestTop}>
                <Text style={styles.requestCat}>{r.category || r.type}</Text>
                <View style={[styles.statusPill, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.statusText, { color: tone.text }]}>{r.status}</Text>
                </View>
              </View>
              <Text style={styles.requestPurpose} numberOfLines={2}>
                {r.purpose}
              </Text>
              <View style={styles.requestMeta}>
                <Text style={styles.metaText}>{formatRequestAmount(r)}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{r.appliedDate}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${r.progress || 0}%` }]} />
              </View>
              <Pressable
                style={({ pressed }) => [styles.detailsBtn, pressed && styles.pressed]}
                onPress={() =>
                  navigation.navigate('Requests', {
                    screen: 'RequestDetail',
                    params: { id: r.id },
                  })
                }
              >
                <Text style={styles.detailsBtnText}>View Details</Text>
                <Ionicons name="arrow-forward" size={14} color={PRIMARY_TEXT} />
              </Pressable>
            </View>
          );
        })
      )}

      {/* Recent Notifications */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
      </View>
      <View style={styles.panel}>
        {notifs.map((n, i) => (
          <Pressable
            key={n.id}
            style={[styles.notifRow, i < notifs.length - 1 && styles.notifBorder]}
            onPress={() => toast(n.title)}
          >
            <View style={[styles.notifIcon, !n.read && styles.notifIconUnread]}>
              <Ionicons
                name={n.icon}
                size={18}
                color={!n.read ? PRIMARY_TEXT : MUTED}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Text style={styles.notifMsg} numberOfLines={2}>
                {n.message}
              </Text>
              <Text style={styles.notifTime}>{n.time}</Text>
            </View>
            {!n.read ? <View style={styles.unreadDot} /> : null}
          </Pressable>
        ))}
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
      </View>
      {DEMO_NGO_TASKS.map((t) => (
        <View key={t.id} style={styles.taskCard}>
          <View style={[styles.taskIcon, { backgroundColor: t.tone }]}>
            <Ionicons name={t.icon} size={18} color={t.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{t.title}</Text>
            <Text style={styles.taskDetail}>{t.detail}</Text>
          </View>
        </View>
      ))}

      <View style={{ height: 8 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  headerLeft: { flex: 1, gap: 6 },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED,
  },
  orgName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: TEXT,
    lineHeight: 34,
  },
  badgeRow: { flexDirection: 'row', marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_TEXT,
  },
  unverified: {
    fontSize: 13,
    color: '#C2410C',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
    borderWidth: 1.5,
    borderColor: WHITE,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },
  statsWrap: { marginHorizontal: -20, marginBottom: 24, flexGrow: 0 },
  statsScroll: {
    paddingHorizontal: 20,
    gap: 12,
    alignItems: 'stretch',
  },
  statCard: {
    width: 132,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    ...shadow.soft,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: MUTED,
    lineHeight: 16,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_TEXT,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: ACTION_W,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    ...shadow.soft,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
    paddingRight: 16,
  },
  actionChevron: {
    position: 'absolute',
    top: 16,
    right: 12,
  },
  requestCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    ...shadow.soft,
  },
  requestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  requestCat: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestPurpose: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
    marginBottom: 10,
  },
  requestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  metaDot: { color: MUTED },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: PRIMARY,
  },
  detailsBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY_TEXT,
  },
  emptyCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    ...shadow.soft,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
    marginTop: 4,
  },
  emptyBody: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  panel: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 4,
    marginBottom: 24,
    ...shadow.soft,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  notifBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIconUnread: {
    backgroundColor: PRIMARY_SOFT,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },
  notifMsg: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
    marginTop: 6,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...shadow.soft,
  },
  taskIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },
  taskDetail: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
  },
  pressed: { opacity: 0.88 },
});
