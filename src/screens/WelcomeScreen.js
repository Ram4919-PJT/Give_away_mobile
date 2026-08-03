import { StyleSheet, Text, View } from 'react-native';
import { BrandMark, Button, Screen } from '../components/ui';
import { colors, radius, shadow, spacing } from '../theme';

const STATS = [
  { value: '12,400+', label: 'Donations' },
  { value: '3,200', label: 'Families' },
  { value: '300+', label: 'NGOs' },
];

export default function WelcomeScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      {/* Soft green atmosphere — no flat gray wash */}
      <View pointerEvents="none" style={styles.atmosphere}>
        <View style={styles.blobTop} />
        <View style={styles.blobRight} />
        <View style={styles.softWash} />
      </View>

      <View style={styles.content}>
        <View style={styles.top}>
          <View style={styles.brandBlock}>
            <BrandMark size={56} />
            <View style={styles.brandText}>
              <Text style={styles.brand}>Give Away</Text>
              <Text style={styles.subBrand}>Aja Abayahastham</Text>
            </View>
          </View>

          <Text style={styles.headline}>
            Share more.{'\n'}Waste less.{'\n'}Help someone today.
          </Text>
          <Text style={styles.support}>
            Connect donors with verified NGOs and families in need — with clear tracking from gift to delivery.
          </Text>
        </View>

        <View style={styles.bottom}>
          <View style={styles.actions}>
            <Button title="Login" onPress={() => navigation.navigate('Login')} style={styles.primaryBtn} />
            <Button
              title="Create Account"
              variant="secondary"
              onPress={() => navigation.navigate('RegisterRole')}
              style={styles.secondaryBtn}
            />
          </View>

          <View style={styles.trustRow}>
            <Text style={styles.trustDot}>●</Text>
            <Text style={styles.trustText}>Verified partners · Transparent tracking</Text>
          </View>

          <View style={styles.statsStrip}>
            {STATS.map((s, i) => (
              <View key={s.label} style={styles.statCell}>
                {i > 0 ? <View style={styles.statDivider} /> : null}
                <View style={styles.statInner}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F7FBF8',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    zIndex: 1,
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  softWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '52%',
    backgroundColor: 'rgba(220, 252, 231, 0.55)',
  },
  blobTop: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  blobRight: {
    position: 'absolute',
    top: 120,
    right: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(22, 163, 74, 0.08)',
  },
  top: {
    gap: 0,
    paddingTop: spacing.md,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 36,
  },
  brandText: {
    gap: 2,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.text,
  },
  subBrand: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.9,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 14,
  },
  support: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.textSecondary,
    maxWidth: 340,
  },
  bottom: {
    gap: 20,
    paddingBottom: spacing.sm,
  },
  actions: {
    gap: 12,
  },
  primaryBtn: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primaryHover,
    ...shadow.soft,
  },
  secondaryBtn: {
    minHeight: 52,
    borderRadius: radius.md,
    borderColor: '#D1D5DB',
    backgroundColor: colors.white,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trustDot: {
    fontSize: 8,
    color: colors.primary,
  },
  trustText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.9)',
    paddingVertical: 16,
  },
  statCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  statInner: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
});
