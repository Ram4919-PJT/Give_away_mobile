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

export default function ReceiverNotificationsScreen() {
  const { receiverNotifications, markReceiverNotificationRead } = useAuth();
  const list = receiverNotifications || [];

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Status updates from AJA Abayahastham</Text>
      </View>

      {list.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-outline" size={28} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptyBody}>Application updates will show here.</Text>
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
                    onPress={() => markReceiverNotificationRead(n.id)}
                    style={[
                      styles.item,
                      index < items.length - 1 && styles.itemBorder,
                      !n.read && styles.unread,
                    ]}
                  >
                    <View style={[styles.iconWrap, !n.read && styles.iconWrapUnread]}>
                      <Ionicons
                        name={n.icon || 'notifications-outline'}
                        size={18}
                        color={colors.primaryHover}
                      />
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
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    gap: 4,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    paddingHorizontal: 2,
  },
  groupCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  unread: {
    backgroundColor: '#F8FFFB',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: {
    backgroundColor: colors.primarySoft,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  itemMsg: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  itemTime: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  emptyBody: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
