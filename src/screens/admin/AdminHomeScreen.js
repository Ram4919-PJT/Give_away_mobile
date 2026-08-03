import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  ADMIN_DASHBOARD_KPIS,
  ADMIN_PRIORITY_ACTIONS,
  statusTone,
} from '../../data/adminMobileData';
import {
  buildVerificationMockData,
} from '../../data/adminVerificationMockData';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

export default function AdminHomeScreen() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const pending = buildVerificationMockData([]).filter((v) =>
    ['Pending', 'Under Review'].includes(v.status)
  ).slice(0, 4);

  const go = (action) => {
    if (action.tab) navigation.navigate(action.tab);
    else if (action.screen) navigation.navigate('More', { screen: action.screen });
    else Alert.alert(action.title, 'Wireframe action.');
  };

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Text style={styles.eyebrow}>Admin Command Center</Text>
      <Text style={styles.title}>Hello, {(currentUser?.name || 'Admin').split(' ')[0]}</Text>
      <Text style={styles.subtitle}>All systems operational · Platform oversight</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.kpiScroll}
        contentContainerStyle={styles.kpiRow}
      >
        {ADMIN_DASHBOARD_KPIS.map((k) => (
          <View key={k.key} style={styles.kpiCard}>
            <View style={styles.kpiIcon}>
              <Ionicons name={k.icon} size={18} color={PRIMARY_TEXT} />
            </View>
            <Text style={styles.kpiValue}>{k.value}</Text>
            <Text style={styles.kpiLabel} numberOfLines={2}>
              {k.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.section}>Priority Actions</Text>
      {ADMIN_PRIORITY_ACTIONS.map((a) => (
        <Pressable
          key={a.id}
          style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.9 }]}
          onPress={() => go(a)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name={a.icon} size={20} color={PRIMARY_TEXT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{a.title}</Text>
            <Text style={styles.actionDesc}>{a.detail}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </Pressable>
      ))}

      <View style={styles.sectionHead}>
        <Text style={styles.section}>Recent Verifications</Text>
        <Pressable onPress={() => navigation.navigate('Queue')}>
          <Text style={styles.link}>View all</Text>
        </Pressable>
      </View>
      {pending.map((v) => {
        const t = statusTone(v.status);
        return (
          <Pressable
            key={v.id}
            style={styles.verCard}
            onPress={() =>
              navigation.navigate('Queue', {
                screen: 'VerificationDetail',
                params: { id: v.id },
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {typeof v.avatar === 'string' && v.avatar.length <= 3 ? v.avatar : 'NA'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.verName}>{v.name}</Text>
              <Text style={styles.verMeta}>
                {v.type} · {v.submitted}
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: t.bg }]}>
              <Text style={[styles.pillText, { color: t.text }]}>{v.status}</Text>
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.section}>Quick Modules</Text>
      <View style={styles.grid}>
        {[
          { label: 'Users', tab: 'Users', icon: 'people-outline' },
          { label: 'Reports', tab: 'Reports', icon: 'pie-chart-outline' },
          { label: 'Inventory', screen: 'AdminInventory', icon: 'archive-outline' },
          { label: 'Funds', screen: 'AdminFunds', icon: 'wallet-outline' },
          { label: 'NGOs', screen: 'AdminNgos', icon: 'business-outline' },
          { label: 'Settings', screen: 'AdminSettings', icon: 'settings-outline' },
        ].map((m) => (
          <Pressable
            key={m.label}
            style={styles.modCard}
            onPress={() =>
              m.tab
                ? navigation.navigate(m.tab)
                : navigation.navigate('More', { screen: m.screen })
            }
          >
            <Ionicons name={m.icon} size={20} color={PRIMARY_TEXT} />
            <Text style={styles.modLabel}>{m.label}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  eyebrow: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT, textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4, marginTop: 4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 18 },
  kpiScroll: { flexGrow: 0, marginHorizontal: -20, marginBottom: 20 },
  kpiRow: { paddingHorizontal: 20, gap: 10 },
  kpiCard: {
    width: 140,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    ...shadow.soft,
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiValue: { fontSize: 22, fontWeight: '700', color: TEXT },
  kpiLabel: { fontSize: 11, color: MUTED, marginTop: 2, lineHeight: 14 },
  section: { fontSize: 20, fontWeight: '600', color: TEXT, marginBottom: 12 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  link: { fontSize: 13, fontWeight: '700', color: PRIMARY_TEXT, marginBottom: 12 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  actionDesc: { fontSize: 12, color: MUTED, marginTop: 2 },
  verCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT },
  verName: { fontSize: 14, fontWeight: '700', color: TEXT },
  verMeta: { fontSize: 12, color: MUTED, marginTop: 2 },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 11, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  modCard: {
    width: '31%',
    flexGrow: 1,
    flexBasis: '30%',
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    ...shadow.soft,
  },
  modLabel: { fontSize: 12, fontWeight: '600', color: TEXT },
});
