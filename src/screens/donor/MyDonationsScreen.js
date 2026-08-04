import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen } from '../../components/ui';
import DonationTimeline from '../../components/DonationTimeline';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import {
  getDonorDonations,
  normalizeDonorStatus,
  statusTone,
} from '../../utils/donorHelpers';
import { colors, radius, spacing, typography } from '../../theme';

export default function MyDonationsScreen() {
  const navigation = useNavigation();
  const { currentUser, donations, platformLoading, refreshPlatformData } = useAuth();
  const list = getDonorDonations(donations, currentUser);

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshing={platformLoading}
      onRefresh={() => refreshPlatformData(currentUser?.role)}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>My Donations</Text>
        <Text style={styles.subtitle}>
          Track every contribution to AJA Abayahastham and its journey.
        </Text>
      </View>

      {platformLoading && !list.length ? (
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>Loading donations…</Text>
          <Text style={styles.emptyBody}>Fetching your contribution history.</Text>
        </Card>
      ) : list.length === 0 ? (
        <Card style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎁</Text>
          <Text style={styles.emptyTitle}>No Donations Yet</Text>
          <Text style={styles.emptyBody}>
            Your giving journey with AJA Abayahastham starts here.
          </Text>
          <Button
            title="Make Your First Donation"
            onPress={() => navigation.navigate('Donate', { screen: 'DonateHub' })}
            style={{ marginTop: spacing.sm, alignSelf: 'stretch' }}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {list.map((d) => {
            const tone = statusTone(d.status);
            const headline =
              d.type === 'Financial'
                ? formatCurrency(d.amount)
                : d.category || d.fund || 'Item donation';

            return (
              <Card key={d.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.visual}>
                    <Text style={styles.visualEmoji}>
                      {d.type === 'Financial' ? '💰' : '📦'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.headRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.id}>{d.id}</Text>
                        <Text style={styles.meta}>
                          {d.type} · {d.date}
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: tone.bg }]}>
                        <Text style={[styles.badgeText, { color: tone.text }]}>
                          {normalizeDonorStatus(d.status)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Text style={styles.details}>
                  {headline} — {d.details}
                </Text>

                <DonationTimeline status={d.status} compact />

                <Pressable
                  style={({ pressed }) => [styles.viewBtn, pressed && { opacity: 0.85 }]}
                  onPress={() => navigation.navigate('DonationDetail', { id: d.id })}
                >
                  <Text style={styles.viewBtnText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primaryHover} />
                </Pressable>
              </Card>
            );
          })}
        </View>
      )}
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
  list: { gap: spacing.md },
  card: { gap: spacing.sm },
  cardTop: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  visual: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualEmoji: { fontSize: 22 },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  id: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  details: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  viewBtn: {
    marginTop: spacing.xs,
    minHeight: 40,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryHover,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.lg,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  emptyBody: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
