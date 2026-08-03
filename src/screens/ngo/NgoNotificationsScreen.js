import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/ui';
import { DEMO_NGO_NOTIFICATIONS } from '../../data/demoNgoData';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

export default function NgoNotificationsScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState(DEMO_NGO_NOTIFICATIONS);

  const markRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAll = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={PRIMARY_TEXT} />
        <Text style={styles.backText}>Profile</Text>
      </Pressable>

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unread ? `${unread} unread` : 'You are all caught up'}
          </Text>
        </View>
        {unread > 0 ? (
          <Pressable onPress={markAll} hitSlop={8}>
            <Text style={styles.markAll}>Mark all read</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.panel}>
        {items.map((n, i) => (
          <Pressable
            key={n.id}
            style={[styles.row, i < items.length - 1 && styles.border]}
            onPress={() => markRead(n.id)}
          >
            <View style={[styles.icon, !n.read && styles.iconUnread]}>
              <Ionicons name={n.icon} size={18} color={!n.read ? PRIMARY_TEXT : MUTED} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{n.title}</Text>
              <Text style={styles.rowMsg}>{n.message}</Text>
              <Text style={styles.rowTime}>{n.time}</Text>
            </View>
            {!n.read ? <View style={styles.dot} /> : null}
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '600', color: PRIMARY_TEXT },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4 },
  markAll: { fontSize: 13, fontWeight: '700', color: PRIMARY_TEXT, marginTop: 8 },
  panel: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadow.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconUnread: { backgroundColor: PRIMARY_SOFT },
  rowTitle: { fontSize: 15, fontWeight: '600', color: TEXT },
  rowMsg: { fontSize: 13, color: MUTED, lineHeight: 18, marginTop: 2 },
  rowTime: { fontSize: 12, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
    marginTop: 6,
  },
});
