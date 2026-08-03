import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  DATE_FORMAT_OPTIONS,
  INITIAL_NGO_SETTINGS,
  LANGUAGE_OPTIONS,
  NOTIFICATION_TOGGLES,
  PRIVACY_TOGGLES,
  TIMEZONE_OPTIONS,
} from '../../data/ngoSettingsData';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const BORDER = '#E5E7EB';

function notify(msg) {
  Alert.alert('Give Away', msg);
}

function Section({ icon, title, subtitle, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon} size={18} color={PRIMARY_TEXT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSub}>{subtitle}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

function ToggleRow({ title, description, value, onValueChange, first }) {
  return (
    <View style={[styles.toggleRow, first && styles.toggleFirst]}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: '#86EFAC' }}
        thumbColor={value ? PRIMARY_TEXT : '#F8FAFC'}
        ios_backgroundColor="#E2E8F0"
      />
    </View>
  );
}

function SelectRow({ label, valueLabel, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.selectRow, pressed && { opacity: 0.9 }]}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.selectValue}>
        <Text style={styles.selectText}>{valueLabel}</Text>
        <Ionicons name="chevron-down" size={16} color={MUTED} />
      </View>
    </Pressable>
  );
}

function ActionRow({ title, description, meta, button, onPress }) {
  return (
    <View style={styles.actionRow}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      <Pressable onPress={onPress} style={styles.miniBtn}>
        <Text style={styles.miniBtnText}>{button}</Text>
      </Pressable>
    </View>
  );
}

export default function NgoSettingsScreen() {
  const navigation = useNavigation();
  const { currentUser, updateSettings } = useAuth();
  const initial = useMemo(
    () => ({ ...INITIAL_NGO_SETTINGS, ...(currentUser?.settings || {}) }),
    [currentUser]
  );
  const [settings, setSettings] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [picker, setPicker] = useState(null);

  useEffect(() => {
    const next = { ...INITIAL_NGO_SETTINGS, ...(currentUser?.settings || {}) };
    setSettings(next);
    setBaseline(JSON.stringify(next));
  }, [currentUser?.email]);

  const dirty = JSON.stringify(settings) !== baseline;
  const patch = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const labelOf = (options, id) => options.find((o) => o.id === id)?.label || id;

  const pickerConfig = {
    language: { title: 'Language', options: LANGUAGE_OPTIONS, key: 'language' },
    timezone: { title: 'Timezone', options: TIMEZONE_OPTIONS, key: 'timezone' },
    dateFormat: { title: 'Date format', options: DATE_FORMAT_OPTIONS, key: 'dateFormat' },
  }[picker];

  const save = () => {
    if (!dirty) return;
    updateSettings({ ...settings });
    setBaseline(JSON.stringify(settings));
    notify('Settings saved.');
  };

  const reset = () => {
    setSettings(JSON.parse(baseline));
    notify('Changes discarded');
  };

  const confirmDanger = (label) => {
    Alert.alert(label, 'This is a sensitive action. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Continue',
        style: 'destructive',
        onPress: () => notify(`${label} request submitted for review`),
      },
    ]);
  };

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={PRIMARY_TEXT} />
        <Text style={styles.backText}>Profile</Text>
      </Pressable>

      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Manage organization preferences, notifications, privacy, and security.
      </Text>

      {dirty ? (
        <View style={styles.unsaved}>
          <Ionicons name="ellipse" size={8} color="#F59E0B" />
          <Text style={styles.unsavedText}>Unsaved changes</Text>
        </View>
      ) : null}

      <Section
        icon="notifications-outline"
        title="Notification Preferences"
        subtitle="Choose how your organization receives portal updates."
      >
        {NOTIFICATION_TOGGLES.map((item, i) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            value={!!settings[item.key]}
            onValueChange={(v) => patch(item.key, v)}
            first={i === 0}
          />
        ))}
      </Section>

      <Section
        icon="options-outline"
        title="Account Preferences"
        subtitle="Language, timezone, and display options."
      >
        <SelectRow
          label="Language"
          valueLabel={labelOf(LANGUAGE_OPTIONS, settings.language)}
          onPress={() => setPicker('language')}
        />
        <SelectRow
          label="Timezone"
          valueLabel={labelOf(TIMEZONE_OPTIONS, settings.timezone)}
          onPress={() => setPicker('timezone')}
        />
        <SelectRow
          label="Date format"
          valueLabel={labelOf(DATE_FORMAT_OPTIONS, settings.dateFormat)}
          onPress={() => setPicker('dateFormat')}
        />
        <Text style={styles.themeLabel}>Theme</Text>
        <View style={styles.themeRow}>
          <Pressable
            style={[styles.themeChip, settings.theme === 'light' && styles.themeChipOn]}
            onPress={() => patch('theme', 'light')}
          >
            <Text style={[styles.themeText, settings.theme === 'light' && styles.themeTextOn]}>
              Light
            </Text>
          </Pressable>
          <Pressable
            style={styles.themeChip}
            onPress={() => notify('Dark theme coming soon')}
          >
            <Text style={styles.themeText}>Dark · Soon</Text>
          </Pressable>
        </View>
      </Section>

      <Section
        icon="shield-checkmark-outline"
        title="Security"
        subtitle="Password, sessions, and two-factor authentication."
      >
        <ActionRow
          title="Change Password"
          description="Update your organization account password."
          button="Change"
          onPress={() => notify('Password change flow opened')}
        />
        <ActionRow
          title="Last Login"
          description="Most recent successful sign-in."
          meta="Today · 10:42 AM IST"
          button="OK"
          onPress={() => notify('Login activity is up to date')}
        />
        <ActionRow
          title="Active Sessions"
          description="Devices currently signed in."
          meta="2 active"
          button="Manage"
          onPress={() => notify('Active sessions reviewed')}
        />
        <ActionRow
          title="Two-Factor Authentication"
          description="Add an extra layer of protection."
          meta="Not enabled"
          button="Enable"
          onPress={() => notify('2FA setup coming soon')}
        />
      </Section>

      <Section
        icon="eye-outline"
        title="Privacy"
        subtitle="Control what donors and partners can see."
      >
        {PRIVACY_TOGGLES.map((item, i) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            value={!!settings[item.key]}
            onValueChange={(v) => patch(item.key, v)}
            first={i === 0}
          />
        ))}
      </Section>

      <Section
        icon="download-outline"
        title="Data & Reports"
        subtitle="Export organization activity and history."
      >
        {[
          ['Download Activity Log', 'activity'],
          ['Export Organization Data', 'org data'],
          ['Download Donation History', 'donation history'],
        ].map(([label, kind]) => (
          <Pressable
            key={label}
            style={styles.downloadRow}
            onPress={() => notify(`${label} started`)}
          >
            <Ionicons name="document-outline" size={18} color={PRIMARY_TEXT} />
            <Text style={styles.downloadText}>{label}</Text>
            <Ionicons name="download-outline" size={18} color={MUTED} />
          </Pressable>
        ))}
      </Section>

      <Section
        icon="warning-outline"
        title="Danger Zone"
        subtitle="Deactivating or deleting pauses matching and portal access."
      >
        <Button
          title="Deactivate Organization"
          variant="secondary"
          onPress={() => confirmDanger('Deactivate Organization')}
          style={{ marginBottom: 10 }}
        />
        <Button
          title="Delete Organization Account"
          variant="secondary"
          onPress={() => confirmDanger('Delete Organization Account')}
          textStyle={{ color: '#B91C1C' }}
        />
      </Section>

      <View style={styles.footer}>
        <Button title="Reset" variant="secondary" onPress={reset} disabled={!dirty} style={{ flex: 1 }} />
        <Button title="Save Settings" onPress={save} disabled={!dirty} style={{ flex: 1 }} />
      </View>

      <BottomSheet
        visible={!!picker}
        onClose={() => setPicker(null)}
        title={pickerConfig?.title || 'Select'}
      >
        {(pickerConfig?.options || []).map((opt) => (
          <Pressable
            key={opt.id}
            style={styles.optionRow}
            onPress={() => {
              patch(pickerConfig.key, opt.id);
              setPicker(null);
            }}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
            {settings[pickerConfig.key] === opt.id ? (
              <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
            ) : null}
          </Pressable>
        ))}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 32 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '600', color: PRIMARY_TEXT },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, lineHeight: 20, marginTop: 6, marginBottom: 16 },
  unsaved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  unsavedText: { fontSize: 12, fontWeight: '600', color: '#B45309' },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    ...shadow.soft,
  },
  sectionHead: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: TEXT },
  sectionSub: { fontSize: 12, color: MUTED, marginTop: 2, lineHeight: 16 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  toggleFirst: { borderTopWidth: 0, paddingTop: 4 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: TEXT },
  rowDesc: { fontSize: 12, color: MUTED, marginTop: 2, lineHeight: 16 },
  meta: { fontSize: 12, fontWeight: '600', color: PRIMARY_TEXT, marginTop: 4 },
  selectRow: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  selectLabel: { fontSize: 12, fontWeight: '600', color: MUTED, marginBottom: 6 },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  selectText: { fontSize: 14, fontWeight: '600', color: TEXT },
  themeLabel: { fontSize: 12, fontWeight: '600', color: MUTED, marginTop: 12, marginBottom: 8 },
  themeRow: { flexDirection: 'row', gap: 8 },
  themeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  themeChipOn: { backgroundColor: PRIMARY_SOFT, borderColor: PRIMARY },
  themeText: { fontSize: 13, fontWeight: '600', color: MUTED },
  themeTextOn: { color: PRIMARY_TEXT },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  miniBtn: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  miniBtnText: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  downloadText: { flex: 1, fontSize: 14, fontWeight: '600', color: TEXT },
  footer: { flexDirection: 'row', gap: 12, marginTop: 8 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  optionText: { fontSize: 15, fontWeight: '500', color: TEXT },
});
