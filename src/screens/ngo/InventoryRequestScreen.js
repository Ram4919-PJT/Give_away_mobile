import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { DEMO_NGO_INVENTORY } from '../../data/demoNgoInventory';
import {
  PRIORITY_OPTIONS,
  TARGET_BENEFICIARIES,
} from '../../data/ngoDonationCategories';
import {
  getInventoryStockStatus,
  INITIAL_INVENTORY_REQUEST_FORM,
  isInventoryRequestValid,
} from '../../utils/inventoryHelpers';
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

export default function InventoryRequestScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser, addNgoRequest } = useAuth();
  const item = useMemo(
    () => DEMO_NGO_INVENTORY.find((i) => i.id === route.params?.itemId),
    [route.params?.itemId]
  );
  const [form, setForm] = useState({ ...INITIAL_INVENTORY_REQUEST_FORM });
  const [doneId, setDoneId] = useState(null);

  const patch = (p) => setForm((prev) => ({ ...prev, ...p }));
  const status = getInventoryStockStatus(item?.qty);
  const maxQty = Number(item?.qty) || 0;
  const reqQty = Number(form.quantity) || 0;
  const remaining = Math.max(0, maxQty - reqQty);
  const valid = item ? isInventoryRequestValid(form, maxQty) : false;

  const toggleBen = (name) => {
    const next = form.beneficiaries.includes(name)
      ? form.beneficiaries.filter((b) => b !== name)
      : [...form.beneficiaries, name];
    patch({ beneficiaries: next });
  };

  const submit = () => {
    if (!item || !valid) {
      Alert.alert('Incomplete form', 'Fill all required fields. Quantity cannot exceed stock.');
      return;
    }
    const id = `NGO-REQ-${String(Date.now()).slice(-4)}`;
    addNgoRequest({
      id,
      ngoEmail: currentUser?.email,
      type: 'Items',
      source: 'inventory',
      inventoryItemId: item.id,
      category: item.category,
      itemName: item.name,
      subcategories: [item.name],
      title: `Inventory: ${item.name}`,
      purpose: form.reason.trim(),
      quantity: Number(form.quantity),
      availableStock: item.qty,
      priority: form.priority,
      beneficiaries: form.beneficiaries,
      beneficiary: `${form.beneficiaryCount} · ${form.beneficiaries.join(', ')}`,
      beneficiaryCount: Number(form.beneficiaryCount),
      location: form.location.trim(),
      deliveryDate: form.deliveryDate,
      distributionDate: form.deliveryDate,
      targetDate: form.deliveryDate,
      notes: form.specialInstructions,
      status: 'Submitted',
      appliedDate: new Date().toISOString().slice(0, 10),
      progress: getRequestProgress('Submitted'),
      timeline: buildTimeline('Submitted'),
      rejectionReason: null,
    });
    setDoneId(id);
  };

  if (!item) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Text style={styles.title}>Item not found</Text>
        <Button title="Back to Inventory" onPress={() => navigation.goBack()} />
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
            {doneId} for {item.name} is pending review (24–48 hrs).
          </Text>
          <Button
            title="Back to Inventory"
            onPress={() => navigation.navigate('InventoryList')}
            style={{ alignSelf: 'stretch' }}
          />
          <Button
            title="View My Requests"
            variant="secondary"
            onPress={() =>
              navigation.getParent()?.navigate('Requests', { screen: 'RequestsList' })
            }
            style={{ alignSelf: 'stretch', marginTop: 10 }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Button title="← Inventory" variant="ghost" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Request Inventory Item</Text>
      <Text style={styles.subtitle}>Request stock directly from the AJA warehouse.</Text>

      {/* Locked item panel */}
      <View style={styles.lockedItem}>
        <Text style={styles.lockedEyebrow}>Selected item</Text>
        <Text style={styles.lockedName}>{item.name}</Text>
        <View style={styles.lockedMeta}>
          <Meta label="Category" value={item.category} />
          <Meta label="Available" value={`${item.qty} ${item.unit}`} />
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.label}>Quantity needed * (max {maxQty})</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={form.quantity}
        onChangeText={(v) => patch({ quantity: v.replace(/[^\d]/g, '') })}
        placeholder={`1 – ${maxQty}`}
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Target beneficiaries *</Text>
      <View style={styles.wrap}>
        {TARGET_BENEFICIARIES.map((b) => {
          const on = form.beneficiaries.includes(b);
          return (
            <Pressable
              key={b}
              onPress={() => toggleBen(b)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{b}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Beneficiary count *</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={form.beneficiaryCount}
        onChangeText={(v) => patch({ beneficiaryCount: v.replace(/[^\d]/g, '') })}
      />

      <Text style={styles.label}>Priority *</Text>
      <View style={styles.wrap}>
        {PRIORITY_OPTIONS.map((p) => {
          const on = form.priority === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => patch({ priority: p.id })}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Required before date * (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={form.deliveryDate}
        onChangeText={(v) => patch({ deliveryDate: v })}
        placeholder="2026-08-15"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Delivery location *</Text>
      <TextInput
        style={styles.input}
        value={form.location}
        onChangeText={(v) => patch({ location: v })}
        placeholder="City / warehouse / drop point"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Reason for request *</Text>
      <TextInput
        style={[styles.input, styles.multi]}
        multiline
        value={form.reason}
        onChangeText={(v) => patch({ reason: v })}
        placeholder="Explain how this stock will be used"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Special instructions (optional)</Text>
      <TextInput
        style={[styles.input, styles.multi]}
        multiline
        value={form.specialInstructions}
        onChangeText={(v) => patch({ specialInstructions: v })}
        placeholderTextColor="#9CA3AF"
      />

      {/* Live summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Live summary</Text>
        <Sum label="Item" value={item.name} />
        <Sum label="Available" value={`${item.qty} ${item.unit} · ${status.label}`} />
        <Sum label="Requested" value={form.quantity || '—'} />
        <Sum label="Remaining after request" value={String(remaining)} />
        <Sum
          label="Beneficiaries"
          value={form.beneficiaries.length ? form.beneficiaries.join(', ') : '—'}
        />
        <Sum label="Priority" value={form.priority} />
        <Sum label="Required before" value={form.deliveryDate || '—'} />
        <Sum label="Location" value={form.location || '—'} />
        <Sum label="Status" value="Pending review · 24–48 hrs" />
      </View>

      <View style={styles.actions}>
        <Button title="Cancel" variant="secondary" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
        <Button title="Submit" onPress={submit} disabled={!valid} style={{ flex: 1 }} />
      </View>
    </Screen>
  );
}

function Meta({ label, value }) {
  return (
    <View style={styles.metaBlock}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function Sum({ label, value }) {
  return (
    <View style={styles.sumRow}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={styles.sumValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.4,
    marginTop: 4,
  },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 16, lineHeight: 20 },
  lockedItem: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PRIMARY_SOFT,
    ...shadow.soft,
  },
  lockedEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY_TEXT,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  lockedName: { fontSize: 18, fontWeight: '700', color: TEXT, marginBottom: 12 },
  lockedMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
  metaBlock: { minWidth: '40%' },
  metaLabel: { fontSize: 11, fontWeight: '600', color: MUTED, textTransform: 'uppercase' },
  metaValue: { fontSize: 14, fontWeight: '600', color: TEXT, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8, marginTop: 8 },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXT,
    marginBottom: 4,
  },
  multi: { minHeight: 88, textAlignVertical: 'top' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
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
  summary: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
    ...shadow.soft,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: TEXT, marginBottom: 4 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  sumLabel: { fontSize: 13, color: MUTED, flexShrink: 0 },
  sumValue: { fontSize: 13, fontWeight: '600', color: TEXT, flex: 1, textAlign: 'right' },
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
});
