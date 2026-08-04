import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen } from '../../components/ui';
import DonationTimeline from '../../components/DonationTimeline';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import {
  getDonorDonations,
  getDonorStats,
  normalizeDonorStatus,
  statusTone,
} from '../../utils/donorHelpers';
import { colors, radius, spacing, typography } from '../../theme';

const STATS = [
  { key: 'totalDonations', label: 'Total Donations', icon: 'gift-outline' },
  { key: 'itemsDonated', label: 'Items Donated', icon: 'cube-outline' },
  { key: 'moneyDonated', label: 'Money Donated', icon: 'cash-outline', money: true },
  { key: 'completedDonations', label: 'Completed', icon: 'checkmark-circle-outline' },
];

export default function MyImpactScreen() {
  const navigation = useNavigation();
  const { currentUser, donations } = useAuth();

  if (!currentUser?.verified) {
    return (
      <Screen contentStyle={styles.content}>
        <Card style={styles.locked}>
          <Ionicons name="lock-closed" size={40} color={colors.textMuted} />
          <Text style={styles.lockedTitle}>My Impact Locked</Text>
          <Text style={styles.lockedBody}>
            Complete donor verification to unlock premium impact analytics and your verified badge.
          </Text>
          <Button
            title="Complete Verification"
            onPress={() => navigation.navigate('Settings', { screen: 'DonorVerify' })}
            style={{ alignSelf: 'stretch', marginTop: spacing.sm }}
          />
        </Card>
      </Screen>
    );
  }

  const stats = getDonorStats(donations, currentUser);
  const list = getDonorDonations(donations, currentUser);
  const completed = list.filter((d) => normalizeDonorStatus(d.status) === 'Completed');

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>My Impact</Text>
        <Text style={styles.subtitle}>
          See how your generosity through AJA Abayahastham creates real change.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {STATS.map((stat) => (
          <Card key={stat.key} style={styles.statCard}>
            <Ionicons name={stat.icon} size={18} color={colors.primaryHover} />
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>
              {stat.money ? formatCurrency(stats[stat.key]) : stats[stat.key]}
            </Text>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Donation History</Text>
      {list.length === 0 ? (
        <Card style={styles.empty}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={styles.emptyTitle}>No Impact Yet</Text>
          <Text style={styles.emptyBody}>
            Complete a donation to see your impact journey here.
          </Text>
          <Button
            title="Donate Now"
            onPress={() => navigation.navigate('Donate', { screen: 'DonateMoney' })}
            style={{ alignSelf: 'stretch', marginTop: spacing.sm }}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {list.map((d) => {
            const tone = statusTone(d.status);
            return (
              <Card key={d.id} style={styles.historyCard}>
                <View style={styles.historyHead}>
                  <Text style={styles.historyId}>{d.id}</Text>
                  <View style={[styles.badge, { backgroundColor: tone.bg }]}>
                    <Text style={[styles.badgeText, { color: tone.text }]}>
                      {normalizeDonorStatus(d.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historyMeta}>
                  {d.type} ·{' '}
                  {d.type === 'Financial' ? formatCurrency(d.amount) : d.category || d.fund} ·{' '}
                  {d.date}
                </Text>
                <DonationTimeline status={d.status} compact />
                <Pressable
                  style={styles.linkBtn}
                  onPress={() =>
                    navigation.navigate('Donations', {
                      screen: 'DonationDetail',
                      params: { id: d.id },
                    })
                  }
                >
                  <Text style={styles.linkBtnText}>View Details</Text>
                </Pressable>
              </Card>
            );
          })}
        </View>
      )}

      {completed.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Completed Donations</Text>
          <View style={styles.list}>
            {completed.map((d) => (
              <Card key={d.id} style={styles.historyCard}>
                <Text style={styles.historyId}>{d.id}</Text>
                <Text style={styles.historyMeta}>
                  {d.type} ·{' '}
                  {d.type === 'Financial' ? formatCurrency(d.amount) : d.category || d.fund} ·{' '}
                  {d.date}
                </Text>
              </Card>
            ))}
          </View>
        </>
      ) : null}

      <Card style={styles.thanks}>
        <Ionicons name="star" size={24} color={colors.primaryHover} />
        <Text style={styles.thanksTitle}>Thank you for making a difference.</Text>
        <Text style={styles.thanksBody}>
          Because of your generosity, families have received meaningful support through AJA
          Abayahastham. Every contribution creates hope.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: { gap: 6 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    gap: 6,
    minHeight: 96,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sectionTitle: {
    ...typography.section,
    marginTop: spacing.xs,
  },
  list: { gap: spacing.sm },
  historyCard: { gap: spacing.sm },
  historyHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  historyId: { fontSize: 14, fontWeight: '800', color: colors.text },
  historyMeta: { fontSize: 12, color: colors.textSecondary },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  linkBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryHover,
  },
  beneficiaryCard: { gap: spacing.sm },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  gridLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  gridValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  storyCard: { gap: spacing.sm, paddingBottom: spacing.sm },
  storyBody: { gap: 6 },
  storyEmoji: { fontSize: 28 },
  storyCat: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryHover,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  storyTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  storySummary: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  storyDate: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  readMore: { fontSize: 13, fontWeight: '700', color: colors.primaryHover },
  delivery: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  deliveryText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  deliveryIllus: { fontSize: 22, marginTop: 4 },
  downloadRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  thanks: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderColor: '#BBF7D0',
  },
  thanksTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  thanksBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.lg,
  },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  emptyBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  locked: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  lockedTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  lockedBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
