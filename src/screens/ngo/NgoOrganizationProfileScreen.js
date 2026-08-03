import { useEffect, useMemo, useState } from 'react';
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
import {
  buildProfileForm,
  computeProfileCompletion,
  getVerificationDocs,
  NGO_DOC_TYPES,
  NGO_FOCUS_AREAS,
} from '../../data/ngoProfileData';
import { getInitials } from '../../utils/ngoHelpers';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const BORDER = '#E5E7EB';

function Field({ label, value, onChange, editable = true, multiline, placeholder }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        editable={editable}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={[
          styles.input,
          multiline && styles.inputMulti,
          !editable && styles.inputLocked,
        ]}
      />
    </View>
  );
}

export default function NgoOrganizationProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, updateUser } = useAuth();
  const verified = !!currentUser?.verified;

  const initial = useMemo(() => buildProfileForm(currentUser || {}), [currentUser]);
  const [form, setForm] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));

  useEffect(() => {
    const next = buildProfileForm(currentUser || {});
    setForm(next);
    setBaseline(JSON.stringify(next));
  }, [currentUser?.email]);

  const dirty = JSON.stringify(form) !== baseline;
  const completion = computeProfileCompletion(form);
  const docs = getVerificationDocs(verified);
  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleFocus = (area) => {
    setForm((prev) => {
      const list = prev.focusAreas || [];
      const next = list.includes(area) ? list.filter((a) => a !== area) : [...list, area];
      return { ...prev, focusAreas: next };
    });
  };

  const save = () => {
    if (!dirty) return;
    updateUser({ ...form });
    setBaseline(JSON.stringify(form));
    Alert.alert('Saved', 'Organization profile updated.');
  };

  const cancel = () => {
    setForm(JSON.parse(baseline));
    navigation.goBack();
  };

  const orgName = (form.name || 'NGO').replace(/\s*\(Demo\)\s*$/i, '');

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={PRIMARY_TEXT} />
        <Text style={styles.backText}>Profile</Text>
      </Pressable>

      <Text style={styles.title}>Organization Profile</Text>
      <Text style={styles.subtitle}>Keep your public NGO details and documents up to date.</Text>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(orgName)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroName}>{orgName}</Text>
          {verified ? (
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={12} color={PRIMARY_TEXT} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          ) : (
            <Text style={styles.pending}>Verification pending</Text>
          )}
          <Text style={styles.regMeta}>{form.regNumber || 'No registration number'}</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHead}>
          <Text style={styles.progressLabel}>Profile completion</Text>
          <Text style={styles.progressPct}>{completion}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${completion}%` }]} />
        </View>
      </View>

      <Text style={styles.section}>Organization information</Text>
      <View style={styles.card}>
        <Field label="Organization name" value={form.name} onChange={(v) => patch('name', v)} />
        <Field label="Representative name" value={form.repName} onChange={(v) => patch('repName', v)} />
        <Field label="Email" value={form.email} onChange={(v) => patch('email', v)} />
        <Field label="Phone number" value={form.mobile} onChange={(v) => patch('mobile', v)} />
        <Field
          label="Website"
          value={form.website}
          onChange={(v) => patch('website', v)}
          placeholder="https://"
        />
        <Field
          label="Registration number"
          value={form.regNumber}
          onChange={(v) => patch('regNumber', v)}
          editable={!verified}
        />
      </View>

      <Text style={styles.section}>Address</Text>
      <View style={styles.card}>
        <Field label="Address" value={form.address} onChange={(v) => patch('address', v)} multiline />
        <Field label="City" value={form.city} onChange={(v) => patch('city', v)} />
        <Field label="State" value={form.state} onChange={(v) => patch('state', v)} />
        <Field label="Pincode" value={form.pincode} onChange={(v) => patch('pincode', v)} />
      </View>

      <Text style={styles.section}>Mission & about</Text>
      <View style={styles.card}>
        <Field label="Mission" value={form.mission} onChange={(v) => patch('mission', v)} multiline />
        <Field label="About" value={form.about} onChange={(v) => patch('about', v)} multiline />
      </View>

      <Text style={styles.section}>Focus areas</Text>
      <View style={styles.wrap}>
        {NGO_FOCUS_AREAS.map((area) => {
          const on = form.focusAreas?.includes(area);
          return (
            <Pressable
              key={area}
              onPress={() => toggleFocus(area)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{area}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Documents</Text>
      <View style={styles.card}>
        {NGO_DOC_TYPES.map((d) => (
          <View key={d.id} style={styles.docRow}>
            <View style={styles.docIcon}>
              <Ionicons name="document-text-outline" size={18} color={PRIMARY_TEXT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docLabel}>{d.label}</Text>
              <Text style={styles.docFile}>{d.file}</Text>
            </View>
            <Pressable
              style={styles.docBtn}
              onPress={() => Alert.alert('Replace file', `${d.label} upload is a wireframe action.`)}
            >
              <Text style={styles.docBtnText}>Replace</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Verification status</Text>
      <View style={styles.card}>
        {docs.map((d) => (
          <View key={d.id} style={styles.verRow}>
            <Text style={styles.verLabel}>{d.label}</Text>
            <View
              style={[
                styles.verPill,
                d.status === 'Verified' && styles.verOk,
                d.status === 'Pending' && styles.verPending,
                d.status === 'Rejected' && styles.verBad,
              ]}
            >
              <Text
                style={[
                  styles.verPillText,
                  d.status === 'Verified' && { color: PRIMARY_TEXT },
                  d.status === 'Pending' && { color: '#C2410C' },
                  d.status === 'Rejected' && { color: '#B91C1C' },
                ]}
              >
                {d.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button title="Cancel" variant="secondary" onPress={cancel} style={{ flex: 1 }} />
        <Button title="Save Changes" onPress={save} disabled={!dirty} style={{ flex: 1 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 32 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '600', color: PRIMARY_TEXT },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, lineHeight: 20, marginTop: 6, marginBottom: 16 },
  hero: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    ...shadow.soft,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: WHITE, fontSize: 18, fontWeight: '700' },
  heroName: { fontSize: 17, fontWeight: '700', color: TEXT },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: PRIMARY_TEXT },
  pending: { fontSize: 12, color: '#C2410C', marginTop: 4, fontWeight: '600' },
  regMeta: { fontSize: 12, color: MUTED, marginTop: 4 },
  progressCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    ...shadow.soft,
  },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, fontWeight: '600', color: MUTED },
  progressPct: { fontSize: 13, fontWeight: '700', color: PRIMARY_TEXT },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  section: { fontSize: 18, fontWeight: '600', color: TEXT, marginBottom: 10, marginTop: 4 },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    ...shadow.soft,
  },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: MUTED, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: TEXT,
    backgroundColor: BG,
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  inputLocked: { backgroundColor: '#F1F5F9', color: MUTED },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
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
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  docIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  docFile: { fontSize: 12, color: MUTED, marginTop: 1 },
  docBtn: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  docBtnText: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT },
  verRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  verLabel: { fontSize: 14, fontWeight: '500', color: TEXT },
  verPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  verOk: { backgroundColor: PRIMARY_SOFT },
  verPending: { backgroundColor: '#FFF7ED' },
  verBad: { backgroundColor: '#FEF2F2' },
  verPillText: { fontSize: 11, fontWeight: '700' },
  footer: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
