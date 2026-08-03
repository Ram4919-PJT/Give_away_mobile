import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  ADMIN_FUND_SUMMARY,
  ADMIN_INVENTORY_ITEMS,
  ADMIN_MORE_MODULES,
  ADMIN_NGO_LIST,
  ADMIN_NOTIFICATIONS_LIST,
  ADMIN_SETTINGS_SECTIONS,
  formatInr,
  getInventorySummary,
  PRIORITY_QUEUE_ITEMS,
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

function Back({ label = 'More' }) {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()} style={styles.back}>
      <Ionicons name="chevron-back" size={20} color={PRIMARY_TEXT} />
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}

export function AdminMoreHubScreen() {
  const navigation = useNavigation();
  const { logout, currentUser } = useAuth();

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>
        {currentUser?.name || 'Admin'} · Full platform modules
      </Text>

      {ADMIN_MORE_MODULES.map((m) => (
        <Pressable
          key={m.screen}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
          onPress={() => navigation.navigate(m.screen)}
        >
          <View style={styles.rowIcon}>
            <Ionicons name={m.icon} size={20} color={PRIMARY_TEXT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{m.label}</Text>
            <Text style={styles.rowDesc}>{m.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </Pressable>
      ))}

      <Button title="Sign out" variant="secondary" onPress={logout} style={{ marginTop: 8 }} />
    </Screen>
  );
}

export function AdminPriorityScreen() {
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>Priority Queue</Text>
      <Text style={styles.subtitle}>Urgent financial, verification, and item cases</Text>
      {PRIORITY_QUEUE_ITEMS.map((p) => {
        const pr = statusTone(p.priority);
        const st = statusTone(p.status);
        return (
          <View key={p.id} style={styles.card}>
            <Text style={styles.cardTitle}>{p.title}</Text>
            <Text style={styles.cardMeta}>
              {p.entity} · {p.type} · {p.date}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.pill, { backgroundColor: pr.bg }]}>
                <Text style={[styles.pillText, { color: pr.text }]}>{p.priority}</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: st.bg }]}>
                <Text style={[styles.pillText, { color: st.text }]}>{p.status}</Text>
              </View>
            </View>
            <Text style={styles.assignee}>Assignee · {p.assignee}</Text>
          </View>
        );
      })}
    </Screen>
  );
}

export function AdminInventoryScreen() {
  const summary = getInventorySummary();
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>Item Inventory</Text>
      <View style={styles.statGrid}>
        {[
          ['Total', summary.total],
          ['Available', summary.available],
          ['Reserved', summary.reserved],
          ['Delivered', summary.delivered],
        ].map(([l, v]) => (
          <View key={l} style={styles.miniStat}>
            <Text style={styles.miniValue}>{v}</Text>
            <Text style={styles.miniLabel}>{l}</Text>
          </View>
        ))}
      </View>
      {ADMIN_INVENTORY_ITEMS.map((item) => {
        const t = statusTone(item.status);
        return (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={[styles.pill, { backgroundColor: t.bg }]}>
                <Text style={[styles.pillText, { color: t.text }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>
              {item.category} · {item.condition} · Qty {item.quantity}
            </Text>
            <Text style={styles.cardMeta}>Donor · {item.donorName}</Text>
            <Text style={styles.cardMeta}>{item.storageLocation}</Text>
            <View style={styles.actionRow}>
              <Pressable
                style={styles.miniBtn}
                onPress={() => Alert.alert('Assign', `${item.name} assignment opened.`)}
              >
                <Text style={styles.miniBtnText}>Assign</Text>
              </Pressable>
              <Pressable
                style={styles.miniBtn}
                onPress={() => Alert.alert('Delivered', `${item.name} marked delivered.`)}
              >
                <Text style={styles.miniBtnText}>Mark Delivered</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

export function AdminFundsScreen() {
  const s = ADMIN_FUND_SUMMARY;
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>Fund Management</Text>
      <View style={styles.statGrid}>
        {[
          ['Received', formatInr(s.totalReceived)],
          ['Available', formatInr(s.availableBalance)],
          ['Allocated', formatInr(s.allocated)],
          ['Distributed', formatInr(s.distributed)],
          ['Pending', formatInr(s.pendingAllocation)],
          ['This month', formatInr(s.monthlyDonations)],
        ].map(([l, v]) => (
          <View key={l} style={styles.miniStat}>
            <Text style={styles.miniValue}>{v}</Text>
            <Text style={styles.miniLabel}>{l}</Text>
          </View>
        ))}
      </View>
      <Button
        title="Review pending releases"
        onPress={() => Alert.alert('Releases', 'Pending fund releases opened (wireframe).')}
      />
    </Screen>
  );
}

export function AdminNgosScreen() {
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>NGO Management</Text>
      {ADMIN_NGO_LIST.map((n) => {
        const t = statusTone(n.status === 'Verified' ? 'Verified' : 'Pending');
        return (
          <Pressable
            key={n.id}
            style={styles.card}
            onPress={() =>
              Alert.alert(n.name, `Contact: ${n.contact}\nCity: ${n.city}`)
            }
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{n.name}</Text>
              <View style={[styles.pill, { backgroundColor: t.bg }]}>
                <Text style={[styles.pillText, { color: t.text }]}>{n.status}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>
              {n.city} · {n.beneficiaries} beneficiaries · {n.activeRequests} active
            </Text>
            <Text style={styles.cardMeta}>Rep · {n.contact}</Text>
          </Pressable>
        );
      })}
    </Screen>
  );
}

export function AdminDonationsScreen() {
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>Donation Management</Text>
      <Text style={styles.subtitle}>Oversee item and money donations across the platform</Text>
      {[
        ['Today', '12 donations · ₹45,000'],
        ['This week', '68 donations · ₹2.1L'],
        ['Pending assignment', '11 item donations'],
        ['Completed', '186 closed donations'],
      ].map(([t, d]) => (
        <View key={t} style={styles.card}>
          <Text style={styles.cardTitle}>{t}</Text>
          <Text style={styles.cardMeta}>{d}</Text>
        </View>
      ))}
    </Screen>
  );
}

export function AdminFinancialScreen() {
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>Financial Assistance</Text>
      <Text style={styles.subtitle}>Aid requests awaiting review and disbursement</Text>
      {[
        { id: 'FA-001', who: 'Ravi Kumar', cat: 'Emergency', amount: '₹8,000', pri: 'Urgent' },
        { id: 'FA-002', who: 'Sunita Deshmukh', cat: 'Medical', amount: '₹12,500', pri: 'High' },
        { id: 'FA-003', who: 'Anjali Mehta', cat: 'Education', amount: '₹4,000', pri: 'Normal' },
      ].map((r) => {
        const t = statusTone(r.pri);
        return (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{r.id}</Text>
              <View style={[styles.pill, { backgroundColor: t.bg }]}>
                <Text style={[styles.pillText, { color: t.text }]}>{r.pri}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>
              {r.who} · {r.cat} · {r.amount}
            </Text>
          </View>
        );
      })}
    </Screen>
  );
}

export function AdminNotificationsScreen() {
  const [items, setItems] = useState(ADMIN_NOTIFICATIONS_LIST);
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.panel}>
        {items.map((n, i) => (
          <Pressable
            key={n.id}
            style={[styles.notifRow, i < items.length - 1 && styles.border]}
            onPress={() =>
              setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
            }
          >
            <View style={[styles.notifIcon, !n.read && { backgroundColor: PRIMARY_SOFT }]}>
              <Ionicons name={n.icon} size={18} color={!n.read ? PRIMARY_TEXT : MUTED} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{n.title}</Text>
              <Text style={styles.rowDesc}>{n.message}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

export function AdminLogsScreen() {
  const logs = [
    { id: 1, user: 'Platform Admin', activity: 'Approved NGO verification', module: 'Verifications', time: '10:42' },
    { id: 2, user: 'Platform Admin', activity: 'Released medical funds', module: 'Funds', time: '09:18' },
    { id: 3, user: 'Review Team A', activity: 'Requested more documents', module: 'Verifications', time: 'Yesterday' },
    { id: 4, user: 'Finance Admin', activity: 'Exported monthly report', module: 'Reports', time: 'Yesterday' },
  ];
  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>System Logs</Text>
      {logs.map((l) => (
        <View key={l.id} style={styles.card}>
          <Text style={styles.cardTitle}>{l.activity}</Text>
          <Text style={styles.cardMeta}>
            {l.user} · {l.module} · {l.time}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

export function AdminSettingsScreen() {
  const [emailOn, setEmailOn] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [manualReview, setManualReview] = useState(true);

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Back />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Platform configuration and security controls</Text>

      {ADMIN_SETTINGS_SECTIONS.map((s) => (
        <Pressable
          key={s.id}
          style={styles.row}
          onPress={() => Alert.alert(s.title, `${s.desc}\n\nOpen ${s.title} panel (wireframe).`)}
        >
          <View style={styles.rowIcon}>
            <Ionicons name={s.icon} size={20} color={PRIMARY_TEXT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{s.title}</Text>
            <Text style={styles.rowDesc}>{s.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </Pressable>
      ))}

      <Text style={styles.section}>Quick toggles</Text>
      <View style={styles.card}>
        <Toggle label="Email notifications" value={emailOn} onChange={setEmailOn} />
        <Toggle label="Push notifications" value={pushOn} onChange={setPushOn} />
        <Toggle label="Manual NGO verification review" value={manualReview} onChange={setManualReview} />
      </View>

      <Button
        title="Save Settings"
        onPress={() => Alert.alert('Saved', 'Admin settings updated (wireframe).')}
      />
    </Screen>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E2E8F0', true: '#86EFAC' }}
        thumbColor={value ? PRIMARY_TEXT : '#F8FAFC'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '600', color: PRIMARY_TEXT },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 16, lineHeight: 20 },
  section: { fontSize: 18, fontWeight: '600', color: TEXT, marginBottom: 12, marginTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  rowDesc: { fontSize: 12, color: MUTED, marginTop: 2, lineHeight: 16 },
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: TEXT, flex: 1 },
  cardMeta: { fontSize: 12, color: MUTED, marginTop: 4, lineHeight: 16 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  pillText: { fontSize: 10, fontWeight: '700' },
  assignee: { fontSize: 12, color: MUTED, marginTop: 8, fontWeight: '500' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  miniStat: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 12,
    ...shadow.soft,
  },
  miniValue: { fontSize: 16, fontWeight: '700', color: TEXT },
  miniLabel: { fontSize: 11, color: MUTED, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  miniBtn: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  miniBtnText: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT },
  panel: { backgroundColor: WHITE, borderRadius: 18, overflow: 'hidden', ...shadow.soft },
  notifRow: { flexDirection: 'row', gap: 12, padding: 14 },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: { fontSize: 11, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleLabel: { fontSize: 14, fontWeight: '500', color: TEXT, flex: 1, paddingRight: 12 },
});
