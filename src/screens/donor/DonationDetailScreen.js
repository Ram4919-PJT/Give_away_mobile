import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, Screen } from '../../components/ui';
import DonationTimeline from '../../components/DonationTimeline';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import {
  getDonorDonations,
  normalizeDonorStatus,
  statusTone,
} from '../../utils/donorHelpers';
import { colors, radius, spacing, typography } from '../../theme';

export default function DonationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser, donations } = useAuth();
  const list = getDonorDonations(donations, currentUser);
  const d = list.find((x) => x.id === route.params?.id);

  if (!d) {
    return (
      <Screen contentStyle={styles.content}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
          <Text style={styles.backText}>Back to My Donations</Text>
        </Pressable>
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>Donation not found</Text>
          <Text style={styles.emptyBody}>This donation could not be located.</Text>
        </Card>
      </Screen>
    );
  }

  const tone = statusTone(d.status);
  const headline =
    d.type === 'Financial' ? formatCurrency(d.amount) : d.category || d.fund || 'Item donation';
  const completed = normalizeDonorStatus(d.status) === 'Completed';

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
        <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
        <Text style={styles.backText}>Back to My Donations</Text>
      </Pressable>

      <Card style={styles.detailCard}>
        <View style={styles.head}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.id}>{d.id}</Text>
            <Text style={styles.headline}>{headline}</Text>
            <View style={[styles.badge, { backgroundColor: tone.bg, alignSelf: 'flex-start' }]}>
              <Text style={[styles.badgeText, { color: tone.text }]}>
                {normalizeDonorStatus(d.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.date}>{d.date}</Text>
        </View>

        <Text style={styles.details}>{d.details}</Text>

        {d.pickupAddress ? (
          <Text style={styles.pickup}>
            <Text style={{ fontWeight: '700' }}>Pickup: </Text>
            {d.pickupAddress} · {d.pickupDate || '—'}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>Donation Journey</Text>
        <DonationTimeline status={d.status} />

        {completed && d.beneficiary ? (
          <View style={styles.beneficiary}>
            <Text style={styles.sectionTitle}>Beneficiary (Privacy Protected)</Text>
            <View style={styles.grid}>
              {[
                ['Name', d.beneficiary.displayName],
                ['City', d.beneficiary.city],
                ['Assistance', d.beneficiary.assistanceType],
                ['Date Received', d.beneficiary.dateReceived],
              ].map(([label, value]) => (
                <View key={label} style={styles.gridItem}>
                  <Text style={styles.gridLabel}>{label}</Text>
                  <Text style={styles.gridValue}>{value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.privacy}>
              <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
              <Text style={styles.privacyText}>
                Personal documents and contact details are never shown.
              </Text>
            </View>
          </View>
        ) : null}

        {d.usage ? (
          <View style={styles.impactCard}>
            <Text style={styles.sectionTitle}>Impact Summary</Text>
            <Text style={styles.details}>{d.usage.summary}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.min(100, d.usage.utilizationPercent || 0)}%` },
                ]}
              />
            </View>
            <Text style={styles.utilText}>{d.usage.utilizationPercent}% utilized</Text>
          </View>
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailCard: { gap: spacing.md },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  id: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  headline: {
    ...typography.title,
    fontSize: 22,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  pickup: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  beneficiary: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
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
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  gridValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  privacyText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
  },
  impactCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primaryHover,
  },
  utilText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.lg,
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  emptyBody: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
