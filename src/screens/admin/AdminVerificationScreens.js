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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Screen } from '../../components/ui';
import { NGO_REJECTION_REASONS } from '../../data/adminConstants';
import { statusTone } from '../../data/adminMobileData';
import {
  buildVerificationMockData,
  getStatusCounts,
  getVerificationSummary,
  VERIFICATION_TABS,
} from '../../data/adminVerificationMockData';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const BORDER = '#E5E7EB';

const STATUS_FILTERS = ['All', 'Pending', 'Under Review', 'Verified', 'Rejected'];

export function AdminVerificationListScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState(() => buildVerificationMockData([]));
  const [tab, setTab] = useState('Donor');
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');

  const summary = useMemo(() => getVerificationSummary(items, tab), [items, tab]);

  const filtered = useMemo(() => {
    return items
      .filter((i) => i.type === tab)
      .filter((i) => (status === 'All' ? true : i.status === status))
      .filter((i) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          i.name.toLowerCase().includes(q) ||
          (i.email || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => String(b.submitted).localeCompare(String(a.submitted)));
  }, [items, tab, status, query]);

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Text style={styles.title}>Verifications</Text>
      <Text style={styles.subtitle}>Review donor, receiver, and NGO applications</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statScroll}
        contentContainerStyle={styles.statRow}
      >
        {[
          ['Pending', summary.pending],
          ['Approved Today', summary.approvedToday],
          ['Rejected Today', summary.rejectedToday],
          ['Total', summary.total],
        ].map(([label, value]) => (
          <View key={label} style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}
      >
        {VERIFICATION_TABS.map((t) => {
          const on = tab === t.id;
          const open =
            getStatusCounts(items, t.id).Pending +
            getStatusCounts(items, t.id)['Under Review'];
          return (
            <Pressable key={t.id} onPress={() => setTab(t.id)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {t.id} ({open})
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}
      >
        {STATUS_FILTERS.map((s) => {
          const on = status === s;
          return (
            <Pressable key={s} onPress={() => setStatus(s)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{s}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filtered.map((v) => {
        const t = statusTone(v.status);
        return (
          <Pressable
            key={v.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('VerificationDetail', {
                id: v.id,
                onUpdate: (next) =>
                  setItems((prev) => prev.map((i) => (i.id === next.id ? next : i))),
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {String(v.avatar || 'NA').slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{v.name}</Text>
              <Text style={styles.meta}>
                {v.email} · {v.submitted}
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: t.bg }]}>
              <Text style={[styles.pillText, { color: t.text }]}>{v.status}</Text>
            </View>
          </Pressable>
        );
      })}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No applications in this filter.</Text>
        </View>
      ) : null}
    </Screen>
  );
}

export function AdminVerificationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [items] = useState(() => buildVerificationMockData([]));
  const [item, setItem] = useState(() => items.find((i) => i.id === route.params?.id));
  const [reason, setReason] = useState(NGO_REJECTION_REASONS[0]);

  if (!item) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Text style={styles.title}>Not found</Text>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const t = statusTone(item.status);

  const updateStatus = (status, extra = {}) => {
    const next = {
      ...item,
      status,
      ...extra,
      timeline: [
        ...(item.timeline || []),
        { date: new Date().toISOString().slice(0, 10), event: status },
      ],
    };
    setItem(next);
    route.params?.onUpdate?.(next);
    Alert.alert('Updated', `${item.name} marked as ${status}.`);
  };

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={PRIMARY_TEXT} />
        <Text style={styles.backText}>Queue</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.heroName}>{item.name}</Text>
        <View style={[styles.pill, { backgroundColor: t.bg, alignSelf: 'flex-start', marginTop: 8 }]}>
          <Text style={[styles.pillText, { color: t.text }]}>{item.status}</Text>
        </View>
        <Text style={styles.meta}>
          {item.type} · {item.email} · {item.phone}
        </Text>
      </View>

      <Text style={styles.section}>Profile</Text>
      <View style={styles.panel}>
        <Row label="Submitted" value={item.submitted} />
        <Row label="Registration" value={item.registrationDate} />
        {item.verificationLevel ? <Row label="Level" value={item.verificationLevel} /> : null}
        {item.assistanceType ? <Row label="Assistance" value={item.assistanceType} /> : null}
        {item.address ? <Row label="Address" value={item.address} /> : null}
        {item.incomeStatus ? <Row label="Income" value={item.incomeStatus} /> : null}
        {item.registrationId ? <Row label="Reg ID" value={item.registrationId} /> : null}
        {item.representative ? <Row label="Representative" value={item.representative} /> : null}
        {item.location ? <Row label="Location" value={item.location} /> : null}
        <Row label="Reviewer" value={item.reviewer} />
      </View>

      <Text style={styles.section}>Documents</Text>
      <View style={styles.panel}>
        {(item.documents || []).map((d) => (
          <Pressable
            key={d.filename}
            style={styles.docRow}
            onPress={() => Alert.alert(d.label, `${d.filename}\nUploaded ${d.uploadedAt}`)}
          >
            <Ionicons name="document-text-outline" size={18} color={PRIMARY_TEXT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.docLabel}>{d.label}</Text>
              <Text style={styles.docFile}>{d.filename}</Text>
            </View>
            <Ionicons name="eye-outline" size={18} color={MUTED} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Checklist</Text>
      <View style={styles.panel}>
        {(item.checklist || []).map((c) => (
          <View key={c.id} style={styles.checkRow}>
            <Ionicons
              name={c.checked ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={c.checked ? PRIMARY : MUTED}
            />
            <Text style={styles.checkText}>{c.label}</Text>
          </View>
        ))}
      </View>

      {item.notes ? (
        <>
          <Text style={styles.section}>Notes</Text>
          <View style={styles.panel}>
            <Text style={styles.notes}>{item.notes}</Text>
          </View>
        </>
      ) : null}

      <Text style={styles.section}>Timeline</Text>
      <View style={styles.panel}>
        {(item.timeline || []).map((ev, i) => (
          <View key={`${ev.date}-${i}`} style={styles.tlRow}>
            <Text style={styles.tlDate}>{ev.date}</Text>
            <Text style={styles.tlEvent}>{ev.event}</Text>
          </View>
        ))}
      </View>

      {item.status !== 'Verified' && item.status !== 'Rejected' ? (
        <>
          <Text style={styles.section}>Actions</Text>
          <Button
            title="Approve Verification"
            onPress={() => updateStatus('Verified', { reviewer: 'Platform Admin' })}
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.rejectLabel}>Rejection reason</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chips}
          >
            {NGO_REJECTION_REASONS.map((r) => {
              const on = reason === r;
              return (
                <Pressable key={r} onPress={() => setReason(r)} style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && styles.chipTextOn]} numberOfLines={1}>
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Button
            title="Reject Verification"
            variant="secondary"
            onPress={() =>
              updateStatus('Rejected', {
                rejectionReason: reason,
                reviewer: 'Platform Admin',
              })
            }
            textStyle={{ color: '#B91C1C' }}
            style={{ marginBottom: 10 }}
          />
          <Button
            title="Request More Documents"
            variant="secondary"
            onPress={() => Alert.alert('Request sent', 'Applicant will be notified (wireframe).')}
            style={{ marginBottom: 10 }}
          />
          <Button
            title="Mark Under Review"
            variant="secondary"
            onPress={() => updateStatus('Under Review', { reviewer: 'Platform Admin' })}
          />
        </>
      ) : null}
    </Screen>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 16 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: '600', color: PRIMARY_TEXT },
  statScroll: { flexGrow: 0, marginHorizontal: -20, marginBottom: 12 },
  statRow: { paddingHorizontal: 20, gap: 8 },
  statCard: {
    width: 110,
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 12,
    ...shadow.soft,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: TEXT },
  statLabel: { fontSize: 11, color: MUTED, marginTop: 2 },
  chipScroll: { flexGrow: 0, height: 40, marginBottom: 10 },
  chips: { gap: 8, alignItems: 'center', paddingRight: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 220,
  },
  chipOn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 12, fontWeight: '600', color: MUTED },
  chipTextOn: { color: WHITE },
  search: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT,
    marginBottom: 10,
  },
  card: {
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT },
  name: { fontSize: 15, fontWeight: '700', color: TEXT },
  meta: { fontSize: 12, color: MUTED, marginTop: 2, lineHeight: 16 },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 11, fontWeight: '700' },
  empty: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...shadow.soft,
  },
  emptyText: { color: MUTED },
  hero: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    ...shadow.soft,
  },
  heroName: { fontSize: 22, fontWeight: '700', color: TEXT },
  section: { fontSize: 18, fontWeight: '600', color: TEXT, marginBottom: 10, marginTop: 6 },
  panel: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    ...shadow.soft,
  },
  row: { marginBottom: 10 },
  rowLabel: { fontSize: 11, fontWeight: '700', color: MUTED, textTransform: 'uppercase' },
  rowValue: { fontSize: 14, color: TEXT, marginTop: 2, fontWeight: '500' },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  docLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  docFile: { fontSize: 12, color: MUTED },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  checkText: { fontSize: 14, color: TEXT },
  notes: { fontSize: 14, color: TEXT, lineHeight: 20 },
  tlRow: { paddingVertical: 8 },
  tlDate: { fontSize: 11, fontWeight: '700', color: MUTED },
  tlEvent: { fontSize: 14, color: TEXT, marginTop: 2 },
  rejectLabel: { fontSize: 12, fontWeight: '600', color: MUTED, marginBottom: 8 },
});
