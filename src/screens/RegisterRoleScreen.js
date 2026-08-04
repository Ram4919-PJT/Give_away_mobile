import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Screen } from '../components/ui';
import { REGISTER_ROLES } from '../utils/roleMap';
import { colors, spacing, typography } from '../theme';

const ICONS = {
  heart: 'heart',
  people: 'people',
  business: 'business',
};

export default function RegisterRoleScreen({ navigation }) {
  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Choose how you want to use Give Away</Text>

      <View style={styles.list}>
        {REGISTER_ROLES.map((role) => (
          <Pressable
            key={role.key}
            onPress={() => navigation.navigate('RegisterForm', { role: role.key })}
          >
            <Card style={styles.option}>
              <View style={styles.iconWrap}>
                <Ionicons name={ICONS[role.icon]} size={22} color={colors.primaryHover} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>{role.title}</Text>
                <Text style={styles.optionDesc}>{role.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Card>
          </Pressable>
        ))}
      </View>

      <Button
        title="Already have an account? Sign in"
        variant="ghost"
        onPress={() => navigation.navigate('Login')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  title: {
    ...typography.hero,
  },
  subtitle: {
    ...typography.body,
    marginTop: -8,
  },
  list: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 88,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  optionDesc: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
