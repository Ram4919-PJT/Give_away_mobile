import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DONOR_JOURNEY_STEPS } from '../data/donorConstants';
import { getJourneyIndex } from '../utils/donorHelpers';
import { colors, spacing } from '../theme';

export default function DonationTimeline({ status, compact = false }) {
  const idx = getJourneyIndex(status);

  if (compact) {
    return (
      <View style={styles.compactRow}>
        {DONOR_JOURNEY_STEPS.map((step, i) => {
          const done = i <= idx;
          const active = i === idx;
          return (
            <View key={step} style={styles.compactStep}>
              <View
                style={[
                  styles.compactDot,
                  done && styles.compactDotDone,
                  active && styles.compactDotActive,
                ]}
              >
                {i < idx ? (
                  <Ionicons name="checkmark" size={8} color={colors.white} />
                ) : null}
              </View>
              <Text style={[styles.compactLabel, done && styles.compactLabelDone]}>
                {step.split(' ')[0]}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.detailList}>
      {DONOR_JOURNEY_STEPS.map((step, i) => {
        const done = i <= idx;
        const active = i === idx;
        return (
          <View key={step} style={styles.detailRow}>
            <View
              style={[
                styles.detailDot,
                done && styles.detailDotDone,
                active && styles.detailDotActive,
              ]}
            >
              <Ionicons
                name={i < idx ? 'checkmark' : 'time-outline'}
                size={12}
                color={done ? colors.white : colors.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailTitle, done && styles.detailTitleDone]}>{step}</Text>
              {done ? (
                <Text style={styles.detailMeta}>{i < idx ? 'Completed' : 'In progress'}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: spacing.sm,
  },
  compactStep: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  compactDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactDotDone: {
    backgroundColor: colors.primaryHover,
    borderColor: colors.primaryHover,
  },
  compactDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  compactLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  compactLabelDone: {
    color: colors.primaryDeep,
  },
  detailList: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  detailDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  detailDotDone: {
    backgroundColor: colors.primaryHover,
    borderColor: colors.primaryHover,
  },
  detailDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  detailTitleDone: {
    color: colors.text,
  },
  detailMeta: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
