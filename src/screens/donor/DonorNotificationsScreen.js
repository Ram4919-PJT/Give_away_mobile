import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, typography } from '../../theme';

const GROUPS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'earlier', label: 'Earlier' },
];

export default function DonorNotificationsScreen() {
  const { notifications, markNotificationRead, platformLoading, refreshPlatformData, currentUser } = useAuth();
  const list = notifications || [];
  const unread = list.filter((n) => !n.read).length;

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshing={platformLoading}
      onRefresh={() => refreshPlatformData(currentUser?.role)}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Stay updated on your donations and verification status.
          {unread > 0 ? ` ${unread} unread.` : ''}
        </Text>
      </View>

      {platformLoading && !list.length ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Loading notifications…</Text>
        </View>
      ) : list.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-outline" size={28} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptyBody}>Donation and verification updates will appear here.</Text>
        </View>
      ) : (
        GROUPS.map((g) => {
          const items = list.filter((n) => n.group === g.key);
          if (!items.length) return null;
          return (
            <View key={g.key} style={styles.group}>
              <Text style={styles.groupTitle}>{g.label}</Text>
              <View style={styles.groupCard}>
                {items.map((n, index) => (
                  <Pressable
                    key={n.id}
                    onPress={() => markNotificationRead(n.id)}
                    style={[
                      styles.item,
                      index < items.length - 1 && styles.itemBorder,
                      !n.read && styles.unread,
                    ]}
                  >
                    <View style={[styles.iconWrap, !n.read && styles.iconWrapUnread]}>
                      <Ionicons name="notifications-outline" size={18} color={colors.primaryHover} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{n.title}</Text>
                      <Text style={styles.itemMsg}>{n.message}</Text>
                      <Text style={styles.itemTime}>{n.time}</Text>
                    </View>
                    {!n.read ? <View style={styles.dot} /> : null}
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  hero: { gap: spacing.xs },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { ...typography.section },
  emptyBody: { ...typography.body, textAlign: 'center' },
  group: { gap: spacing.sm },
  groupTitle: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
  },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  unread: { backgroundColor: '#F0FDF4' },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: { backgroundColor: '#DCFCE7' },
  itemTitle: { ...typography.label, color: colors.text },
  itemMsg: { ...typography.body, marginTop: 2 },
  itemTime: { ...typography.caption, marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryHover,
    marginTop: 6,
  },
});
