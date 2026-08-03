import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/ui';
import {
  ADMIN_PLATFORM_USERS,
  ADMIN_USER_TAB_COUNTS,
  statusTone,
} from '../../data/adminMobileData';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

const TABS = [
  { id: 'donors', label: 'Donors', count: ADMIN_USER_TAB_COUNTS.donors },
  { id: 'receivers', label: 'Receivers', count: ADMIN_USER_TAB_COUNTS.receivers },
  { id: 'ngos', label: 'NGOs', count: ADMIN_USER_TAB_COUNTS.ngos },
  { id: 'admins', label: 'Admins', count: ADMIN_USER_TAB_COUNTS.admins },
];

export default function AdminUsersScreen() {
  const [tab, setTab] = useState('donors');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const rows = ADMIN_PLATFORM_USERS[tab] || [];
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    );
  }, [tab, query]);

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Text style={styles.title}>Users</Text>
      <Text style={styles.subtitle}>Platform donors, receivers, NGOs, and admins</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}
      >
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <Pressable key={t.id} onPress={() => setTab(t.id)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {t.label} · {t.count}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <TextInput
        style={styles.search}
        placeholder="Search name or email"
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={setQuery}
      />

      {list.map((u) => {
        const v = statusTone(u.verificationStatus);
        const s = statusTone(u.status);
        return (
          <Pressable
            key={u.id}
            style={styles.card}
            onPress={() => Alert.alert(u.name, `Actions for ${u.name} (wireframe).`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{u.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{u.name}</Text>
              <Text style={styles.meta}>{u.email}</Text>
              <View style={styles.badges}>
                <View style={[styles.pill, { backgroundColor: PRIMARY_SOFT }]}>
                  <Text style={[styles.pillText, { color: PRIMARY_TEXT }]}>{u.role}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: v.bg }]}>
                  <Text style={[styles.pillText, { color: v.text }]}>{u.verificationStatus}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: s.bg }]}>
                  <Text style={[styles.pillText, { color: s.text }]}>{u.status}</Text>
                </View>
              </View>
              <Text style={styles.joined}>Joined {u.joinedDate}</Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={18} color={MUTED} />
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 14 },
  chipScroll: { flexGrow: 0, height: 40, marginBottom: 10 },
  chips: { gap: 8, alignItems: 'center', paddingRight: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 12, fontWeight: '600', color: MUTED },
  chipTextOn: { color: WHITE },
  search: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    color: TEXT,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '700', color: PRIMARY_TEXT },
  name: { fontSize: 15, fontWeight: '700', color: TEXT },
  meta: { fontSize: 12, color: MUTED, marginTop: 2 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  pillText: { fontSize: 10, fontWeight: '700' },
  joined: { fontSize: 11, color: MUTED, marginTop: 8 },
});
