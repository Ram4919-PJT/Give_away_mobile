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
import { BottomSheet, Button, Card, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_RECEIVER_SETTINGS,
  RECEIVER_CATEGORY_OPTIONS,
  RECEIVER_CONTACT_OPTIONS,
  RECEIVER_DATE_FORMAT_OPTIONS,
  RECEIVER_LANGUAGE_OPTIONS,
  RECEIVER_NOTIFICATION_TOGGLES,
  RECEIVER_PRIVACY_TOGGLES,
  RECEIVER_TIMEZONE_OPTIONS,
} from '../../data/receiverSettingsData';
import { colors, radius, spacing, typography } from '../../theme';

function SectionHeader({ icon, title, subtitle }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color={colors.primaryHover} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

function ToggleRow({ title, description, value, onValueChange, first }) {
  return (
    <View style={[styles.toggleRow, first && styles.toggleRowFirst]}>
      <View style={{ flex: 1, paddingRight: spacing.sm }}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: '#86EFAC' }}
        thumbColor={value ? colors.primaryHover : '#F8FAFC'}
        ios_backgroundColor="#E2E8F0"
      />
    </View>
  );
}

function SelectField({ label, valueLabel, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.selectField}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.selectValueRow}>
        <Text style={styles.selectValue}>{valueLabel}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

function notify(message) {
  Alert.alert('Give Away', message);
}

export default function ReceiverSettingsScreen() {
  const navigation = useNavigation();
  const { currentUser, updateSettings } = useAuth();

  const initial = useMemo(
    () => ({
      ...INITIAL_RECEIVER_SETTINGS,
      ...(currentUser?.settings || {}),
    }),
    [currentUser]
  );

  const [settings, setSettings] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [picker, setPicker] = useState(null);

  useEffect(() => {
    const next = {
      ...INITIAL_RECEIVER_SETTINGS,
      ...(currentUser?.settings || {}),
    };
    setSettings(next);
    setBaseline(JSON.stringify(next));
  }, [currentUser?.email]);

  const dirty = JSON.stringify(settings) !== baseline;
  const patch = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const optionLabel = (options, id) => options.find((o) => o.id === id)?.label || id;

  const pickerConfig = {
    preferredContactMethod: {
      title: 'Preferred Contact',
      options: RECEIVER_CONTACT_OPTIONS,
      key: 'preferredContactMethod',
    },
    defaultRequestCategory: {
      title: 'Default Category',
      options: RECEIVER_CATEGORY_OPTIONS,
      key: 'defaultRequestCategory',
    },
    language: { title: 'Language', options: RECEIVER_LANGUAGE_OPTIONS, key: 'language' },
    timezone: { title: 'Time Zone', options: RECEIVER_TIMEZONE_OPTIONS, key: 'timezone' },
    dateFormat: { title: 'Date Format', options: RECEIVER_DATE_FORMAT_OPTIONS, key: 'dateFormat' },
  }[picker];

  const saveSettings = () => {
    if (!dirty) return;
    updateSettings({ ...settings });
    setBaseline(JSON.stringify(settings));
    notify('Settings saved.');
  };

  const resetChanges = () => {
    setSettings(JSON.parse(baseline));
    notify('Changes discarded');
  };

  const confirmDanger = (actionLabel) => {
    Alert.alert(actionLabel, 'This is a sensitive action. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Continue',
        style: 'destructive',
        onPress: () => notify(`${actionLabel} request submitted for review`),
      },
    ]);
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
        <Text style={styles.backText}>Profile</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage notifications, privacy, request preferences, and account options.
        </Text>
      </View>

      <Card>
        <SectionHeader
          icon="notifications-outline"
          title="Notification Preferences"
          subtitle="Choose how you receive request updates."
        />
        {RECEIVER_NOTIFICATION_TOGGLES.map((item, index) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            value={!!settings[item.key]}
            onValueChange={(v) => patch(item.key, v)}
            first={index === 0}
          />
        ))}
      </Card>

      <Card>
        <SectionHeader
          icon="options-outline"
          title="Request Preferences"
          subtitle="Defaults for your assistance requests."
        />
        <SelectField
          label="Preferred Contact Method"
          valueLabel={optionLabel(RECEIVER_CONTACT_OPTIONS, settings.preferredContactMethod)}
          onPress={() => setPicker('preferredContactMethod')}
        />
        <SelectField
          label="Default Request Category"
          valueLabel={optionLabel(RECEIVER_CATEGORY_OPTIONS, settings.defaultRequestCategory)}
          onPress={() => setPicker('defaultRequestCategory')}
        />
        <ToggleRow
          title="Suggest Alternative Options"
          description="Allow AJA to suggest related assistance categories."
          value={!!settings.alternativeSuggestions}
          onValueChange={(v) => patch('alternativeSuggestions', v)}
        />
        <ToggleRow
          title="Allow NGO Recommendations"
          description="Receive recommendations from verified NGO partners via AJA."
          value={!!settings.allowNgoRecommendations}
          onValueChange={(v) => patch('allowNgoRecommendations', v)}
        />
        <ToggleRow
          title="Auto-save Drafts"
          description="Keep unfinished applications as drafts."
          value={!!settings.autoSaveDrafts}
          onValueChange={(v) => patch('autoSaveDrafts', v)}
        />
      </Card>

      <Card>
        <SectionHeader
          icon="shield-checkmark-outline"
          title="Privacy & Security"
          subtitle="Control what verified partners can see."
        />
        {RECEIVER_PRIVACY_TOGGLES.map((item, index) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            value={!!settings[item.key]}
            onValueChange={(v) => patch(item.key, v)}
            first={index === 0}
          />
        ))}
        <ToggleRow
          title="Two-Factor Authentication"
          description="Extra verification when signing in. Future-ready."
          value={!!settings.twoFactorEnabled}
          onValueChange={(v) => {
            patch('twoFactorEnabled', v);
            if (v) notify('2FA setup coming soon');
          }}
        />
        <Pressable style={styles.actionRow} onPress={() => notify('Password change flow opened')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Change Password</Text>
            <Text style={styles.toggleDesc}>Update your password to keep your account secure.</Text>
          </View>
          <Text style={styles.miniLink}>Change</Text>
        </Pressable>
      </Card>

      <Card>
        <SectionHeader
          icon="globe-outline"
          title="Account Preferences"
          subtitle="Language, regional formats, and theme."
        />
        <SelectField
          label="Language"
          valueLabel={optionLabel(RECEIVER_LANGUAGE_OPTIONS, settings.language)}
          onPress={() => setPicker('language')}
        />
        <SelectField
          label="Time Zone"
          valueLabel={optionLabel(RECEIVER_TIMEZONE_OPTIONS, settings.timezone)}
          onPress={() => setPicker('timezone')}
        />
        <SelectField
          label="Date Format"
          valueLabel={optionLabel(RECEIVER_DATE_FORMAT_OPTIONS, settings.dateFormat)}
          onPress={() => setPicker('dateFormat')}
        />
        <Text style={[styles.toggleTitle, { marginTop: spacing.md }]}>Theme</Text>
        <View style={styles.themeRow}>
          {['light', 'dark'].map((theme) => (
            <Pressable
              key={theme}
              onPress={() => {
                patch('theme', theme);
                if (theme === 'dark') notify('Dark Mode coming soon');
              }}
              style={[styles.themeCard, settings.theme === theme && styles.themeCardActive]}
            >
              <Text
                style={[
                  styles.themeText,
                  settings.theme === theme && styles.themeTextActive,
                ]}
              >
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <SectionHeader
          icon="server-outline"
          title="Data Management"
          subtitle="Download your application history and account activity."
        />
        <View style={{ gap: spacing.sm }}>
          <Button title="Download Application History" variant="secondary" onPress={() => notify('Downloading application history…')} />
          <Button title="Export Account Data" variant="secondary" onPress={() => notify('Exporting account data…')} />
          <Button title="View Activity Log" variant="secondary" onPress={() => notify('Opening activity log…')} />
        </View>
      </Card>

      <Card style={styles.dangerCard}>
        <SectionHeader
          icon="warning-outline"
          title="Danger Zone"
          subtitle="These actions may pause or remove access to your requests."
        />
        <View style={{ gap: spacing.sm }}>
          <Pressable style={styles.warnBtn} onPress={() => confirmDanger('Deactivate Account')}>
            <Text style={styles.warnBtnText}>Deactivate Account</Text>
          </Pressable>
          <Pressable style={styles.dangerBtn} onPress={() => confirmDanger('Delete Account')}>
            <Text style={styles.dangerBtnText}>Delete Account</Text>
          </Pressable>
        </View>
      </Card>

      <View style={[styles.footer, dirty && styles.footerDirty]}>
        {dirty ? <Text style={styles.unsaved}>Unsaved Changes</Text> : <View />}
        <View style={styles.footerBtns}>
          <Button title="Reset" variant="secondary" onPress={resetChanges} disabled={!dirty} style={{ flex: 1 }} />
          <Button title="Save Settings" onPress={saveSettings} disabled={!dirty} style={{ flex: 1 }} />
        </View>
      </View>

      <BottomSheet visible={!!picker} onClose={() => setPicker(null)} title={pickerConfig?.title || 'Select'}>
        {(pickerConfig?.options || []).map((opt) => {
          const selected = settings[pickerConfig.key] === opt.id;
          return (
            <Pressable
              key={opt.id}
              style={[styles.optionRow, selected && styles.optionRowSelected]}
              onPress={() => {
                patch(pickerConfig.key, opt.id);
                setPicker(null);
              }}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {opt.label}
              </Text>
              {selected ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.primaryHover} />
              ) : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  hero: { gap: 6 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  sectionHead: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  sectionSub: { marginTop: 2, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  toggleRowFirst: { borderTopWidth: 0, paddingTop: 0 },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  toggleDesc: { marginTop: 2, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  selectField: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  selectLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted, marginBottom: 4 },
  selectValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    gap: spacing.sm,
  },
  miniLink: { fontSize: 13, fontWeight: '700', color: colors.primaryHover },
  themeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  themeCard: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  themeCardActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  themeText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  themeTextActive: { color: colors.primaryHover },
  dangerCard: { borderColor: '#FECACA', backgroundColor: '#FFF7F7' },
  warnBtn: {
    minHeight: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  warnBtnText: { fontSize: 14, fontWeight: '700', color: '#B45309' },
  dangerBtn: {
    minHeight: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
  },
  dangerBtnText: { fontSize: 14, fontWeight: '700', color: colors.white },
  footer: { gap: spacing.sm },
  footerDirty: {
    backgroundColor: colors.primarySoft,
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  unsaved: { fontSize: 12, fontWeight: '700', color: colors.primaryDeep },
  footerBtns: { flexDirection: 'row', gap: spacing.sm },
  optionRow: {
    minHeight: 48,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  optionRowSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionText: { fontSize: 14, fontWeight: '600', color: colors.text },
  optionTextSelected: { color: colors.primaryHover },
});
