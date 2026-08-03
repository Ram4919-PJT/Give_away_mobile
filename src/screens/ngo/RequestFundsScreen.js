import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { FINANCIAL_ICONS } from '../../data/demoNgoData';
import {
  FINANCIAL_AMOUNT_MAX,
  FINANCIAL_AMOUNT_MIN,
  FINANCIAL_PRIORITY_OPTIONS,
  FINANCIAL_PURPOSE_CATEGORIES,
  FINANCIAL_REVIEW_TIME,
  formatInrDisplay,
  getPurposeById,
  INITIAL_FINANCIAL_FORM,
  isFinancialFormValid,
  parseAmountInput,
} from '../../data/ngoFinancialAssistance';
import { buildTimeline, getRequestProgress } from '../../utils/ngoHelpers';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const BORDER = '#E5E7EB';

const SUGGESTED_DOCS = [
  'Medical Bills',
  'Fee Receipts',
  'Quotations',
  'NGO Approval Letter',
];

export default function RequestFundsScreen() {
  const navigation = useNavigation();
  const { currentUser, addNgoRequest } = useAuth();
  const [form, setForm] = useState({ ...INITIAL_FINANCIAL_FORM });
  const [doneId, setDoneId] = useState(null);

  const patch = (p) => setForm((prev) => ({ ...prev, ...p }));
  const purpose = getPurposeById(form.purposeCategory);
  const valid = isFinancialFormValid(form);

  const toggleDoc = (name) => {
    const docs = form.documents.includes(name)
      ? form.documents.filter((d) => d !== name)
      : form.documents.length < 5
        ? [...form.documents, name]
        : form.documents;
    patch({ documents: docs });
  };

  const saveDraft = () => {
    const id = `NGO-REQ-${String(Date.now()).slice(-4)}`;
    addNgoRequest({
      id,
      ngoEmail: currentUser?.email,
      type: 'Financial',
      category: purpose?.label || 'Financial',
      purposeCategory: form.purposeCategory,
      purpose: form.beneficiaryDetails?.slice(0, 80) || 'Draft financial request',
      amount: Number(form.amount) || 0,
      priority: form.priority,
      requiredBefore: form.requiredBefore,
      beneficiaryCount: Number(form.beneficiaryCount) || 0,
      beneficiary: form.beneficiaryDetails,
      notes: form.notes,
      documents: form.documents,
      status: 'Draft',
      appliedDate: new Date().toISOString().slice(0, 10),
      progress: getRequestProgress('Draft'),
      timeline: buildTimeline('Draft'),
      rejectionReason: null,
    });
    Alert.alert('Draft saved', `${id} saved as draft under My Requests.`);
    navigation.navigate('RequestsList');
  };

  const submit = () => {
    if (!valid) {
      Alert.alert('Incomplete form', 'Please fill all required fields within the allowed amount range.');
      return;
    }
    const id = `NGO-REQ-${String(Date.now()).slice(-4)}`;
    addNgoRequest({
      id,
      ngoEmail: currentUser?.email,
      type: 'Financial',
      category: purpose?.label || 'Financial',
      purposeCategory: form.purposeCategory,
      purpose: form.beneficiaryDetails.trim().slice(0, 120),
      amount: Number(form.amount),
      priority: form.priority,
      requiredBefore: form.requiredBefore,
      beneficiaryCount: Number(form.beneficiaryCount),
      beneficiary: form.beneficiaryDetails.trim(),
      notes: form.notes,
      documents: form.documents,
      status: 'Submitted',
      appliedDate: new Date().toISOString().slice(0, 10),
      progress: getRequestProgress('Submitted'),
      timeline: buildTimeline('Submitted'),
      rejectionReason: null,
    });
    setDoneId(id);
  };

  if (!currentUser?.verified) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Button title="Back" variant="ghost" onPress={() => navigation.goBack()} />
        <View style={styles.locked}>
          <Ionicons name="lock-closed-outline" size={28} color={MUTED} />
          <Text style={styles.lockedTitle}>Financial assistance locked</Text>
          <Text style={styles.lockedBody}>
            Complete NGO verification to request program funding.
          </Text>
        </View>
      </Screen>
    );
  }

  if (doneId) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={32} color={WHITE} />
          </View>
          <Text style={styles.successTitle}>Request submitted</Text>
          <Text style={styles.successBody}>
            {doneId} will be reviewed in {FINANCIAL_REVIEW_TIME}. Track it under My Requests.
          </Text>
          <Button
            title="View My Requests"
            onPress={() => navigation.navigate('RequestsList')}
            style={{ alignSelf: 'stretch' }}
          />
          <Button
            title="Create another"
            variant="secondary"
            onPress={() => {
              setForm({ ...INITIAL_FINANCIAL_FORM });
              setDoneId(null);
            }}
            style={{ alignSelf: 'stretch', marginTop: 10 }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Button title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Request Funds</Text>
      <Text style={styles.subtitle}>
        Financial assistance for medical, education, food, housing, and relief programs.
      </Text>

      <View style={styles.info}>
        <Ionicons name="information-circle-outline" size={18} color={PRIMARY_TEXT} />
        <Text style={styles.infoText}>
          Requests are reviewed before publishing to donors. Typical review: {FINANCIAL_REVIEW_TIME}.
        </Text>
      </View>

      <Text style={styles.label}>Requested amount (₹) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={formatInrDisplay(form.amount)}
        onChangeText={(raw) => patch({ amount: parseAmountInput(raw) })}
        placeholder={`₹${FINANCIAL_AMOUNT_MIN.toLocaleString('en-IN')} – ₹${FINANCIAL_AMOUNT_MAX.toLocaleString('en-IN')}`}
        placeholderTextColor="#9CA3AF"
      />
      <Text style={styles.hint}>
        Min ₹{FINANCIAL_AMOUNT_MIN.toLocaleString('en-IN')} · Max ₹
        {FINANCIAL_AMOUNT_MAX.toLocaleString('en-IN')}
      </Text>

      <Text style={styles.label}>Purpose category *</Text>
      <View style={styles.grid}>
        {FINANCIAL_PURPOSE_CATEGORIES.map((c) => {
          const on = form.purposeCategory === c.id;
          return (
            <Pressable
              key={c.id}
              style={[styles.purposeCard, on && styles.purposeOn]}
              onPress={() => patch({ purposeCategory: c.id })}
            >
              <Ionicons
                name={FINANCIAL_ICONS[c.id] || 'heart-outline'}
                size={18}
                color={on ? PRIMARY_TEXT : MUTED}
              />
              <Text style={styles.purposeLabel}>{c.label}</Text>
              <Text style={styles.purposeDesc} numberOfLines={2}>
                {c.description}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Priority *</Text>
      <View style={styles.rowWrap}>
        {FINANCIAL_PRIORITY_OPTIONS.map((p) => {
          const on = form.priority === p.id;
          return (
            <Pressable
              key={p.id}
              style={[styles.prioChip, on && { backgroundColor: p.color, borderColor: p.color }]}
              onPress={() => patch({ priority: p.id })}
            >
              <Text style={[styles.prioText, on && { color: WHITE }]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Required before date * (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={form.requiredBefore}
        onChangeText={(v) => patch({ requiredBefore: v })}
        placeholder="2026-08-01"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Number of beneficiaries *</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={form.beneficiaryCount}
        onChangeText={(v) => patch({ beneficiaryCount: v.replace(/[^\d]/g, '') })}
      />

      <Text style={styles.label}>Beneficiary details *</Text>
      <TextInput
        style={[styles.input, styles.multi]}
        multiline
        value={form.beneficiaryDetails}
        onChangeText={(v) => patch({ beneficiaryDetails: v })}
        placeholder="Describe who will benefit and how funds will be used"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Supporting documents (optional, up to 5)</Text>
      <View style={styles.rowWrap}>
        {SUGGESTED_DOCS.map((d) => {
          const on = form.documents.includes(d);
          return (
            <Pressable
              key={d}
              style={[styles.docChip, on && styles.docOn]}
              onPress={() => toggleDoc(d)}
            >
              <Ionicons
                name={on ? 'document-attach' : 'document-outline'}
                size={14}
                color={on ? PRIMARY_TEXT : MUTED}
              />
              <Text style={[styles.docText, on && { color: PRIMARY_TEXT }]}>{d}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Additional notes</Text>
      <TextInput
        style={[styles.input, styles.multi]}
        multiline
        value={form.notes}
        onChangeText={(v) => patch({ notes: v })}
        placeholderTextColor="#9CA3AF"
      />

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Live summary</Text>
        <SummaryLine label="Amount" value={form.amount ? `₹${formatInrDisplay(form.amount)}` : '—'} />
        <SummaryLine label="Purpose" value={purpose?.label || '—'} />
        <SummaryLine label="Priority" value={form.priority} />
        <SummaryLine label="Required before" value={form.requiredBefore || '—'} />
        <SummaryLine label="Beneficiaries" value={form.beneficiaryCount || '—'} />
        <SummaryLine label="Documents" value={String(form.documents.length)} />
        <SummaryLine label="Review time" value={FINANCIAL_REVIEW_TIME} />
      </View>

      <View style={styles.actions}>
        <Button title="Save as Draft" variant="secondary" onPress={saveDraft} style={{ flex: 1 }} />
        <Button title="Submit" onPress={submit} disabled={!valid} style={{ flex: 1 }} />
      </View>
    </Screen>
  );
}

function SummaryLine({ label, value }) {
  return (
    <View style={styles.sumRow}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={styles.sumValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4, marginTop: 4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 16, lineHeight: 20 },
  info: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 13, color: PRIMARY_TEXT, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8, marginTop: 8 },
  hint: { fontSize: 12, color: MUTED, marginBottom: 8, marginTop: -4 },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXT,
    marginBottom: 8,
  },
  multi: { minHeight: 96, textAlignVertical: 'top' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  purposeCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 4,
    ...shadow.soft,
  },
  purposeOn: { borderColor: PRIMARY, backgroundColor: '#F0FDF4' },
  purposeLabel: { fontSize: 14, fontWeight: '700', color: TEXT },
  purposeDesc: { fontSize: 11, color: MUTED, lineHeight: 15 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  prioChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
  },
  prioText: { fontSize: 13, fontWeight: '600', color: MUTED },
  docChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  docOn: { backgroundColor: PRIMARY_SOFT, borderColor: PRIMARY },
  docText: { fontSize: 12, fontWeight: '600', color: MUTED },
  summary: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
    ...shadow.soft,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: TEXT, marginBottom: 4 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontSize: 13, color: MUTED },
  sumValue: { fontSize: 13, fontWeight: '600', color: TEXT },
  actions: { flexDirection: 'row', gap: 12 },
  success: {
    marginTop: 40,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    ...shadow.soft,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: { fontSize: 22, fontWeight: '700', color: TEXT, marginBottom: 8 },
  successBody: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  locked: {
    marginTop: 40,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    ...shadow.soft,
  },
  lockedTitle: { fontSize: 18, fontWeight: '700', color: TEXT },
  lockedBody: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20 },
});
