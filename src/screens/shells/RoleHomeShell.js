import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, typography } from '../../theme';

export default function RoleHomeShell({
  title,
  subtitle,
  actions = [],
  stats = [],
  refreshing,
  onRefresh,
}) {
  const { currentUser, requestLogout, logoutLoading, roleDisplayName } = useAuth();
  const navigation = useNavigation();

  const handleAction = (action) => {
    if (action.tab) {
      if (action.params) {
        navigation.navigate(action.tab, action.params);
      } else {
        navigation.navigate(action.tab);
      }
      return;
    }
    if (action.onPress) action.onPress();
  };

  return (
    <Screen scroll contentStyle={styles.content} refreshing={refreshing} onRefresh={onRefresh}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.name}>{currentUser?.name}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{roleDisplayName(currentUser?.role)}</Text>
            </View>
            {currentUser?.verified === true ? (
              <View style={[styles.badge, styles.badgeOk]}>
                <Text style={[styles.badgeText, styles.badgeOkText]}>Verified</Text>
              </View>
            ) : currentUser?.verified === 'pending' ? (
              <View style={[styles.badge, styles.badgeWarn]}>
                <Text style={[styles.badgeText, styles.badgeWarnText]}>Pending</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeMuted]}>
                <Text style={[styles.badgeText, styles.badgeMutedText]}>Basic</Text>
              </View>
            )}
          </View>
        </View>
        <Pressable style={styles.logout} onPress={requestLogout} hitSlop={8} disabled={logoutLoading}>
          <Ionicons name="log-out-outline" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <Card style={styles.heroCard}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroBody}>{subtitle}</Text>
      </Card>

      {stats.length > 0 && (
        <View style={styles.stats}>
          {stats.map(([num, label]) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.section}>Quick actions</Text>
      <View style={styles.actions}>
        {actions.map((action) => (
          <Pressable key={action.label} style={styles.actionRow} onPress={() => handleAction(action)}>
            <View style={styles.actionIcon}>
              <Ionicons name={action.icon} size={20} color={colors.primaryHover} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionDesc}>{action.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Button
        title={logoutLoading ? 'Signing out…' : 'Sign out'}
        variant="secondary"
        onPress={requestLogout}
        loading={logoutLoading}
        style={{ marginTop: spacing.md }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  greeting: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.primaryHover,
    fontWeight: '700',
  },
  name: {
    ...typography.title,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.blueSoft,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
  },
  badgeOk: {
    backgroundColor: colors.primarySoft,
  },
  badgeOkText: {
    color: colors.primaryDeep,
  },
  badgeWarn: {
    backgroundColor: '#FFF7ED',
  },
  badgeWarnText: {
    color: '#C2410C',
  },
  badgeMuted: {
    backgroundColor: colors.borderSoft,
  },
  badgeMutedText: {
    color: colors.textMuted,
  },
  logout: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  heroCard: {
    backgroundColor: colors.primarySoft,
    borderColor: '#BBF7D0',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  heroBody: {
    marginTop: 6,
    ...typography.body,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    ...typography.section,
    marginTop: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  actionRow: {
    minHeight: 72,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionIcon: {
    width: 44,
    height: 44,
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
});
