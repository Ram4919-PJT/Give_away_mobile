import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getPurposeById } from '../../data/ngoFinancialAssistance';
import {
  formatRequestAmount,
  requestStatusTone,
} from '../../utils/ngoHelpers';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

function Row({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function RequestDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ngoRequests } = useAuth();
  const req = (ngoRequests || []).find((r) => r.id === route.params?.id);
  const tone = requestStatusTone(req?.status);

  if (!req) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Text style={styles.title}>Request not found</Text>
        <Button title="Back to requests" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const purposeLabel =
    req.type === 'Financial'
      ? getPurposeById(req.purposeCategory)?.label || req.category
      : req.category;

  const timeline = req.timeline || [];

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <View style={styles.topBar}>
        <Button title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.reqId}>{req.id}</Text>
        <View style={[styles.pill, { backgroundColor: tone.bg }]}>
          <Text style={[styles.pillText, { color: tone.text }]}>{req.status}</Text>
        </View>
        <Text style={styles.purpose}>{req.purpose}</Text>
        <Text style={styles.amount}>{formatRequestAmount(req)}</Text>
      </View>

      {req.rejectionReason ? (
        <View style={styles.rejectBanner}>
          <Ionicons name="alert-circle-outline" size={18} color="#B91C1C" />
          <Text style={styles.rejectText}>{req.rejectionReason}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>Status timeline</Text>
      <View style={styles.timelineCard}>
        {timeline.map((t, i) => (
          <View key={t.step} style={styles.tlRow}>
            <View
              style={[
                styles.tlDot,
                t.done && styles.tlDotDone,
                t.active && styles.tlDotActive,
              ]}
            >
              {t.done ? <Ionicons name="checkmark" size={12} color={WHITE} /> : null}
            </View>
            {i < timeline.length - 1 ? (
              <View style={[styles.tlLine, t.done && styles.tlLineDone]} />
            ) : null}
            <Text style={[styles.tlLabel, t.active && styles.tlLabelActive]}>{t.step}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Details</Text>
      <View style={styles.detailCard}>
        <Row label="Type" value={req.type} />
        <Row label="Category" value={purposeLabel} />
        {req.subcategories?.length ? (
          <Row label="Items" value={req.subcategories.join(', ')} />
        ) : null}
        {req.beneficiaries?.length ? (
          <Row label="Beneficiaries" value={req.beneficiaries.join(', ')} />
        ) : null}
        <Row label="Beneficiary summary" value={req.beneficiary} />
        <Row label="Count" value={req.beneficiaryCount ? String(req.beneficiaryCount) : null} />
        <Row label="Condition" value={req.condition} />
        <Row label="Priority" value={req.priority} />
        <Row label="Quantity / Amount" value={formatRequestAmount(req)} />
        <Row label="Location" value={req.location} />
        <Row label="Required before" value={req.requiredBefore || req.deliveryDate || req.targetDate} />
        <Row label="Applied" value={req.appliedDate} />
        <Row label="Notes" value={req.notes || req.description} />
        {req.documents?.length ? (
          <Row label="Documents" value={req.documents.join(', ')} />
        ) : null}
      </View>

      <Button
        title="Back to My Requests"
        variant="secondary"
        onPress={() => navigation.navigate('RequestsList')}
        style={{ marginTop: 8 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  topBar: { marginBottom: 8, alignItems: 'flex-start' },
  title: { fontSize: 22, fontWeight: '700', color: TEXT, marginBottom: 16 },
  hero: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...shadow.soft,
  },
  reqId: { fontSize: 13, fontWeight: '600', color: MUTED, marginBottom: 8 },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  pillText: { fontSize: 12, fontWeight: '600' },
  purpose: { fontSize: 20, fontWeight: '700', color: TEXT, marginBottom: 8 },
  amount: { fontSize: 16, fontWeight: '600', color: PRIMARY_TEXT },
  rejectBanner: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  rejectText: { flex: 1, fontSize: 13, color: '#B91C1C', lineHeight: 18 },
  section: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 12,
    marginTop: 8,
  },
  timelineCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...shadow.soft,
  },
  tlRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, position: 'relative' },
  tlDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  tlDotDone: { backgroundColor: PRIMARY },
  tlDotActive: { backgroundColor: PRIMARY_TEXT },
  tlLine: {
    position: 'absolute',
    left: 10,
    top: 22,
    width: 2,
    height: 14,
    backgroundColor: '#E5E7EB',
  },
  tlLineDone: { backgroundColor: PRIMARY },
  tlLabel: { fontSize: 14, color: MUTED, fontWeight: '500' },
  tlLabelActive: { color: TEXT, fontWeight: '700' },
  detailCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    gap: 12,
    ...shadow.soft,
  },
  row: { gap: 4 },
  rowLabel: { fontSize: 12, fontWeight: '600', color: MUTED, textTransform: 'uppercase' },
  rowValue: { fontSize: 15, color: TEXT, fontWeight: '500', lineHeight: 22 },
});
