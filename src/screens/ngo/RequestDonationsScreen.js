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
import { useNavigation } from '@react-navigation/native';
import { Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { CATEGORY_ICONS } from '../../data/demoNgoData';
import {
  CONDITION_OPTIONS,
  DESCRIPTION_MAX,
  DONATION_CATEGORIES,
  getCategoryById,
  getSubcategoriesFor,
  getTemplateById,
  GUIDELINE_ITEMS,
  INITIAL_REQUEST_FORM,
  PRIORITY_OPTIONS,
  REQUEST_TEMPLATES,
  REQUEST_WIZARD_STEPS,
  TARGET_BENEFICIARIES,
} from '../../data/ngoDonationCategories';
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

function Chip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipOn]}>
      <Text style={[styles.chipText, selected && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

function StepBar({ step }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.stepScroll}
      contentContainerStyle={styles.steps}
    >
      {REQUEST_WIZARD_STEPS.map((s) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <View key={s.id} style={styles.stepItem}>
            <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotOn]}>
              {done ? (
                <Ionicons name="checkmark" size={12} color={WHITE} />
              ) : (
                <Text style={[styles.stepNum, (active || done) && { color: WHITE }]}>{s.id}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelOn]}>{s.label}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

export default function RequestDonationsScreen() {
  const navigation = useNavigation();
  const { currentUser, addNgoRequest } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...INITIAL_REQUEST_FORM });
  const [submittedId, setSubmittedId] = useState(null);

  const category = getCategoryById(form.category);
  const subcats = useMemo(
    () => getSubcategoriesFor(form.category),
    [form.category]
  );

  const patch = (p) => setForm((prev) => ({ ...prev, ...p }));

  const toggleSub = (name) => {
    const next = form.subcategories.includes(name)
      ? form.subcategories.filter((s) => s !== name)
      : [...form.subcategories, name];
    patch({ subcategories: next });
  };

  const toggleBen = (name) => {
    const next = form.beneficiaries.includes(name)
      ? form.beneficiaries.filter((s) => s !== name)
      : [...form.beneficiaries, name];
    patch({ beneficiaries: next });
  };

  const applyTemplate = (id) => {
    const t = getTemplateById(id);
    if (!t) return;
    patch({
      category: t.categoryId,
      subcategories: [...t.subcategories],
      beneficiaries: [...t.beneficiaries],
      condition: t.condition || 'either',
      purpose: t.purpose,
      priority: t.priority,
      templateId: t.id,
    });
    setStep(2);
  };

  const canNext = () => {
    if (step === 1) return !!form.category;
    if (step === 2) return form.subcategories.length > 0;
    if (step === 3) {
      if (form.beneficiaries.length === 0) return false;
      if (form.category === 'clothes' && !form.condition) return false;
      return true;
    }
    if (step === 4) {
      return (
        !!form.purpose.trim() &&
        !!form.quantity &&
        Number(form.quantity) > 0 &&
        !!form.beneficiaryCount &&
        Number(form.beneficiaryCount) > 0 &&
        !!form.deliveryDate &&
        !!form.location.trim()
      );
    }
    return true;
  };

  const submit = () => {
    const id = `NGO-REQ-${String(Date.now()).slice(-4)}`;
    const catLabel = category?.label || form.category;
    const request = {
      id,
      ngoEmail: currentUser?.email,
      type: 'Items',
      category: catLabel,
      subcategories: form.subcategories,
      beneficiaries: form.beneficiaries,
      condition: form.category === 'clothes' ? form.condition : null,
      purpose: form.purpose.trim(),
      title: form.purpose.trim(),
      quantity: Number(form.quantity),
      priority: form.priority,
      beneficiary: `${form.beneficiaryCount} beneficiaries`,
      beneficiaryCount: Number(form.beneficiaryCount),
      location: form.location.trim(),
      deliveryDate: form.deliveryDate,
      targetDate: form.deliveryDate,
      description: form.description,
      notes: form.specialInstructions,
      status: 'Submitted',
      appliedDate: new Date().toISOString().slice(0, 10),
      progress: getRequestProgress('Submitted'),
      timeline: buildTimeline('Submitted'),
      rejectionReason: null,
    };
    addNgoRequest(request);
    setSubmittedId(id);
    setStep(6);
  };

  if (!currentUser?.verified) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Button title="Back" variant="ghost" onPress={() => navigation.goBack()} />
        <View style={styles.locked}>
          <Ionicons name="lock-closed-outline" size={28} color={MUTED} />
          <Text style={styles.lockedTitle}>Request Donations locked</Text>
          <Text style={styles.lockedBody}>
            Complete NGO verification to request warehouse stock and items.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <View style={styles.top}>
        <Button title="Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Request Donations</Text>
        <Text style={styles.subtitle}>Resource requests for verified NGO partners</Text>
      </View>

      {step < 6 ? <StepBar step={step} /> : null}

      {step === 1 && (
        <View>
          <Text style={styles.section}>Quick templates</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.templateScroll}
            contentContainerStyle={styles.templateRow}
          >
            {REQUEST_TEMPLATES.map((t) => (
              <Pressable key={t.id} style={styles.templateCard} onPress={() => applyTemplate(t.id)}>
                <Text style={styles.templateEmoji}>{t.emoji}</Text>
                <Text style={styles.templateTitle}>{t.title}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.section}>Choose category</Text>
          <View style={styles.catGrid}>
            {DONATION_CATEGORIES.map((c) => {
              const on = form.category === c.id;
              return (
                <Pressable
                  key={c.id}
                  style={[styles.catCard, on && styles.catCardOn]}
                  onPress={() =>
                    patch({
                      category: c.id,
                      subcategories: [],
                      templateId: null,
                    })
                  }
                >
                  <View style={[styles.catIcon, on && styles.catIconOn]}>
                    <Ionicons
                      name={CATEGORY_ICONS[c.id] || 'cube-outline'}
                      size={20}
                      color={on ? PRIMARY_TEXT : MUTED}
                    />
                  </View>
                  <Text style={styles.catLabel}>{c.label}</Text>
                  <Text style={styles.catDesc} numberOfLines={2}>
                    {c.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>Request guidelines</Text>
            {GUIDELINE_ITEMS.map((g) => (
              <View key={g} style={styles.guideRow}>
                <Ionicons name="checkmark-circle" size={16} color={PRIMARY_TEXT} />
                <Text style={styles.guideText}>{g}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.section}>Select items — {category?.label}</Text>
          <View style={styles.wrap}>
            {subcats.map((s) => (
              <Chip
                key={s}
                label={s}
                selected={form.subcategories.includes(s)}
                onPress={() => toggleSub(s)}
              />
            ))}
          </View>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.section}>Who is this for?</Text>
          <View style={styles.wrap}>
            {TARGET_BENEFICIARIES.map((b) => (
              <Chip
                key={b}
                label={b}
                selected={form.beneficiaries.includes(b)}
                onPress={() => toggleBen(b)}
              />
            ))}
          </View>
          {form.category === 'clothes' ? (
            <>
              <Text style={[styles.section, { marginTop: 20 }]}>Condition needed</Text>
              <View style={styles.wrap}>
                {CONDITION_OPTIONS.map((c) => (
                  <Chip
                    key={c.id}
                    label={c.label}
                    selected={form.condition === c.id}
                    onPress={() => patch({ condition: c.id })}
                  />
                ))}
              </View>
            </>
          ) : null}
        </View>
      )}

      {step === 4 && (
        <View style={styles.form}>
          <Text style={styles.section}>Request details</Text>
          <Field label="Purpose *" value={form.purpose} onChange={(v) => patch({ purpose: v })} />
          <Field
            label="Beneficiary count *"
            value={form.beneficiaryCount}
            onChange={(v) => patch({ beneficiaryCount: v.replace(/[^\d]/g, '') })}
            keyboardType="number-pad"
          />
          <Field
            label="Quantity required *"
            value={form.quantity}
            onChange={(v) => patch({ quantity: v.replace(/[^\d]/g, '') })}
            keyboardType="number-pad"
          />
          <Text style={styles.fieldLabel}>Priority *</Text>
          <View style={styles.wrap}>
            {PRIORITY_OPTIONS.map((p) => (
              <Chip
                key={p.id}
                label={p.label}
                selected={form.priority === p.id}
                onPress={() => patch({ priority: p.id })}
              />
            ))}
          </View>
          <Field
            label="Required before date * (YYYY-MM-DD)"
            value={form.deliveryDate}
            onChange={(v) => patch({ deliveryDate: v })}
            placeholder="2026-08-15"
          />
          <Field
            label="Delivery location *"
            value={form.location}
            onChange={(v) => patch({ location: v })}
          />
          <Field
            label={`Description (optional, max ${DESCRIPTION_MAX})`}
            value={form.description}
            onChange={(v) => patch({ description: v.slice(0, DESCRIPTION_MAX) })}
            multiline
          />
          <Field
            label="Special instructions (optional)"
            value={form.specialInstructions}
            onChange={(v) => patch({ specialInstructions: v })}
            multiline
          />
        </View>
      )}

      {step === 5 && (
        <View style={styles.reviewCard}>
          <Text style={styles.section}>Review & submit</Text>
          <ReviewRow label="Category" value={category?.label} />
          <ReviewRow label="Items" value={form.subcategories.join(', ')} />
          <ReviewRow label="Beneficiaries" value={form.beneficiaries.join(', ')} />
          {form.category === 'clothes' ? (
            <ReviewRow
              label="Condition"
              value={CONDITION_OPTIONS.find((c) => c.id === form.condition)?.label}
            />
          ) : null}
          <ReviewRow label="Purpose" value={form.purpose} />
          <ReviewRow label="Quantity" value={String(form.quantity)} />
          <ReviewRow label="Beneficiary count" value={String(form.beneficiaryCount)} />
          <ReviewRow label="Priority" value={form.priority} />
          <ReviewRow label="Required before" value={form.deliveryDate} />
          <ReviewRow label="Location" value={form.location} />
          <ReviewRow label="Description" value={form.description || '—'} />
          <ReviewRow label="Instructions" value={form.specialInstructions || '—'} />
        </View>
      )}

      {step === 6 && (
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={32} color={WHITE} />
          </View>
          <Text style={styles.successTitle}>Request submitted</Text>
          <Text style={styles.successBody}>
            {submittedId} is with AJA for review. You can track it under My Requests.
          </Text>
          <Button
            title="View My Requests"
            onPress={() => navigation.navigate('RequestsList')}
            style={{ alignSelf: 'stretch', marginTop: 8 }}
          />
          <Button
            title="Create another"
            variant="secondary"
            onPress={() => {
              setForm({ ...INITIAL_REQUEST_FORM });
              setSubmittedId(null);
              setStep(1);
            }}
            style={{ alignSelf: 'stretch', marginTop: 10 }}
          />
        </View>
      )}

      {step < 6 ? (
        <View style={styles.navRow}>
          {step > 1 ? (
            <Button title="Back" variant="secondary" onPress={() => setStep((s) => s - 1)} style={{ flex: 1 }} />
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {step < 5 ? (
            <Button
              title="Continue"
              disabled={!canNext()}
              onPress={() => {
                if (!canNext()) {
                  Alert.alert('Complete this step', 'Fill the required fields to continue.');
                  return;
                }
                setStep((s) => s + 1);
              }}
              style={{ flex: 1 }}
            />
          ) : (
            <Button title="Submit request" onPress={submit} style={{ flex: 1 }} />
          )}
        </View>
      ) : null}
    </Screen>
  );
}

function Field({ label, value, onChange, multiline, keyboardType, placeholder }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[styles.input, multiline && styles.inputMulti]}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

function ReviewRow({ label, value }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 32 },
  top: { marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4 },
  steps: { gap: 12, paddingVertical: 4, alignItems: 'center' },
  stepScroll: { flexGrow: 0, marginBottom: 12, maxHeight: 56 },
  templateScroll: { flexGrow: 0, marginBottom: 8, maxHeight: 120 },
  stepItem: { alignItems: 'center', width: 72 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotDone: { backgroundColor: PRIMARY },
  stepDotOn: { backgroundColor: PRIMARY_TEXT },
  stepNum: { fontSize: 12, fontWeight: '700', color: MUTED },
  stepLabel: { fontSize: 10, color: MUTED, fontWeight: '500', textAlign: 'center' },
  stepLabelOn: { color: TEXT, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '600', color: TEXT, marginBottom: 12, marginTop: 8 },
  templateRow: { gap: 10, paddingBottom: 8, marginBottom: 8 },
  templateCard: {
    width: 140,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    ...shadow.soft,
  },
  templateEmoji: { fontSize: 22, marginBottom: 8 },
  templateTitle: { fontSize: 13, fontWeight: '600', color: TEXT },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  catCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.soft,
  },
  catCardOn: { borderColor: PRIMARY, backgroundColor: '#F0FDF4' },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catIconOn: { backgroundColor: PRIMARY_SOFT },
  catLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  catDesc: { fontSize: 12, color: MUTED, marginTop: 2, lineHeight: 16 },
  guideCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    ...shadow.soft,
  },
  guideTitle: { fontSize: 15, fontWeight: '700', color: TEXT, marginBottom: 10 },
  guideRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  guideText: { flex: 1, fontSize: 13, color: MUTED, lineHeight: 18 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipOn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 13, fontWeight: '600', color: MUTED },
  chipTextOn: { color: WHITE },
  form: { gap: 4 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXT,
  },
  inputMulti: { minHeight: 88, textAlignVertical: 'top' },
  reviewCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    ...shadow.soft,
  },
  reviewRow: { gap: 2 },
  reviewLabel: { fontSize: 12, fontWeight: '600', color: MUTED, textTransform: 'uppercase' },
  reviewValue: { fontSize: 15, color: TEXT, fontWeight: '500', lineHeight: 22 },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  success: {
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
  successBody: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
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
