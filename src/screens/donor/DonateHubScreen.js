import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, Screen } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

const OPTIONS = [
  {
    key: 'money',
    title: 'Donate Money',
    desc: 'Support programs with a secure financial contribution.',
    icon: 'cash-outline',
    accent: colors.primarySoft,
    iconColor: colors.primaryHover,
    route: 'DonateMoney',
  },
  {
    key: 'item',
    title: 'Donate Item',
    desc: 'Give clothes, books, electronics, and more — we arrange pickup.',
    icon: 'gift-outline',
    accent: colors.blueSoft,
    iconColor: colors.blue,
    route: 'DonateItem',
  },
];

export default function DonateHubScreen() {
  const navigation = useNavigation();

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>Donate</Text>
        <Text style={styles.subtitle}>
          Choose how you want to give. Both paths support verified causes through AJA Abayahastham.
        </Text>
      </View>

      <View style={styles.options}>
        {OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            onPress={() => navigation.navigate(opt.route)}
            style={({ pressed }) => [pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
          >
            <Card style={styles.optionCard}>
              <View style={[styles.iconWrap, { backgroundColor: opt.accent }]}>
                <Ionicons name={opt.icon} size={28} color={opt.iconColor} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
              <View style={styles.chevron}>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <Card style={styles.note}>
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.primaryHover} />
        <Text style={styles.noteText}>
          Donations are verified by AJA before reaching beneficiaries and partner NGOs.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  hero: {
    gap: 8,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
  },
  options: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md + 2,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  optionDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  chevron: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderColor: '#BBF7D0',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.primaryDeep,
    fontWeight: '500',
  },
});
