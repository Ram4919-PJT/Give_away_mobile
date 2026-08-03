import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { ASSISTANCE_TYPE_ICONS } from '../../data/receiverConstants';
import { formatCurrency } from '../../utils/format';
import {
  getReceiverApps,
  getReceiverStats,
  statusTone,
} from '../../utils/receiverHelpers';
import { colors, radius, spacing, typography } from '../../theme';

const STATS = [
  { key: 'submitted', label: 'Sent' },
  { key: 'underReview', label: 'Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const ACTIONS = [
  { label: 'Apply for Assistance', desc: 'Start a new request', icon: 'heart-outline', tab: 'Apply' },
  {
    label: 'My Applications',
    desc: 'Track request status',
    icon: 'clipboard-outline',
    tab: 'Applications',
    params: { screen: 'ApplicationsList' },
  },
  {
    label: 'Notifications',
    desc: 'Updates from AJA',
    icon: 'notifications-outline',
    tab: 'Alerts',
  },
];

export default function ReceiverHomeScreen() {
  const navigation = useNavigation();
  const { currentUser, receiverApplications, receiverNotifications } = useAuth();
  const apps = getReceiverApps(receiverApplications, currentUser);
  const stats = getReceiverStats(apps);
  const recent = apps.slice(0, 2);
  const notifs = (receiverNotifications || []).filter((n) => !n.read).slice(0, 2);
  const unread = (receiverNotifications || []).filter((n) => !n.read).length;
  const firstName = (currentUser?.name || 'there').split(' ')[0];

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.name}>{firstName}</Text>
        </View>
        <Pressable
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('Profile')}
          hitSlop={8}
        >
          <Ionicons name="person-outline" size={20} color={colors.primaryHover} />
        </Pressable>
      </View>

      <View style={styles.trustStrip}>
        <Ionicons name="shield-checkmark" size={16} color={colors.primaryHover} />
        <Text style={styles.trustText}>Reviewed privately by AJA Abayahastham</Text>
      </View>

      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <View key={s.key} style={styles.statCell}>
            <Text style={styles.statValue}>{stats[s.key]}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        {ACTIONS.map((a) => (
          <Pressable
            key={a.label}
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            onPress={() =>
              a.params ? navigation.navigate(a.tab, a.params) : navigation.navigate(a.tab)
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons name={a.icon} size={20} color={colors.primaryHover} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionDesc}>{a.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <Pressable onPress={() => navigation.navigate('Applications')} hitSlop={8}>
          <Text style={styles.link}>See all</Text>
        </Pressable>
      </View>

      {recent.length ? (
        <View style={styles.list}>
          {recent.map((a) => {
            const tone = statusTone(a.status);
            return (
              <Pressable
                key={a.id}
                style={({ pressed }) => [styles.appRow, pressed && styles.pressed]}
                onPress={() =>
                  navigation.navigate('Applications', {
                    screen: 'ApplicationDetail',
                    params: { id: a.id },
                  })
                }
              >
                <View style={styles.appIcon}>
                  <Text style={styles.appEmoji}>
                    {a.assistanceIcon || ASSISTANCE_TYPE_ICONS[a.assistanceType] || '📋'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.appTitle} numberOfLines={1}>
                    {a.assistanceType}
                  </Text>
                  <Text style={styles.appMeta} numberOfLines={1}>
                    {formatCurrency(a.amount)} · {a.appliedDate}
                  </Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.statusText, { color: tone.text }]} numberOfLines={1}>
                    {a.status}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No applications yet</Text>
          <Text style={styles.emptyBody}>Submit your first request when you're ready.</Text>
          <Button title="Apply now" onPress={() => navigation.navigate('Apply')} style={{ marginTop: 12 }} />
        </View>
      )}

      {(notifs.length > 0 || unread > 0) && (
        <>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            <Pressable onPress={() => navigation.navigate('Alerts')} hitSlop={8}>
              <Text style={styles.link}>{unread ? `${unread} new` : 'See all'}</Text>
            </Pressable>
          </View>
          <View style={styles.list}>
            {notifs.map((n) => (
              <View key={n.id} style={styles.notifRow}>
                <View style={styles.notifDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle} numberOfLines={1}>
                    {n.title}
                  </Text>
                  <Text style={styles.notifMsg} numberOfLines={1}>
                    {n.message}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {!currentUser?.verified ? (
        <Card style={styles.verifyCard}>
          <Text style={styles.verifyTitle}>Verification needed</Text>
          <Text style={styles.verifyBody}>
            Verify your account to unlock applications.
          </Text>
          <Button
            title="Go to profile"
            variant="secondary"
            onPress={() => navigation.navigate('Profile')}
            style={{ marginTop: 8 }}
          />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryHover,
    letterSpacing: 0.2,
  },
  name: {
    ...typography.title,
    marginTop: 2,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDeep,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.md,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.sm,
  },
  actionRow: {
    minHeight: 68,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.92,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  actionDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  link: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryHover,
  },
  list: {
    gap: spacing.sm,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  appIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appEmoji: {
    fontSize: 20,
  },
  appTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  appMeta: {
    marginTop: 3,
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusPill: {
    maxWidth: 88,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  notifMsg: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  emptyBody: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  verifyCard: {
    gap: 4,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  verifyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  verifyBody: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
