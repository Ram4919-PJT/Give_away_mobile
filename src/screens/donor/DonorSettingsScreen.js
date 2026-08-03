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
import { Button, BottomSheet, Card, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  DONOR_CATEGORIES,
  DONOR_DATE_FORMAT_OPTIONS,
  DONOR_LANGUAGE_OPTIONS,
  DONOR_NOTIFICATION_TOGGLES,
  DONOR_TIMEZONE_OPTIONS,
  INITIAL_DONOR_SETTINGS,
} from '../../data/donorSettingsData';
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

function ToggleRow({ title, description, value, onValueChange, disabled, first }) {
  return (
    <View style={[styles.toggleRow, first && styles.toggleRowFirst, disabled && styles.rowDisabled]}>
      <View style={{ flex: 1, paddingRight: spacing.sm }}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#E2E8F0', true: '#86EFAC' }}
        thumbColor={value ? colors.primaryHover : '#F8FAFC'}
        ios_backgroundColor="#E2E8F0"
      />
    </View>
  );
}

function ActionRow({ title, description, meta, buttonLabel, buttonIcon, onPress, ghost }) {
  return (
    <View style={styles.actionRow}>
      <View style={{ flex: 1, paddingRight: spacing.sm }}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
        {meta ? <Text style={styles.metaText}>{meta}</Text> : null}
      </View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.miniBtn,
          ghost && styles.miniBtnGhost,
          pressed && { opacity: 0.85 },
        ]}
      >
        {buttonIcon ? (
          <Ionicons
            name={buttonIcon}
            size={15}
            color={ghost ? colors.primaryHover : '#334155'}
          />
        ) : null}
        <Text style={[styles.miniBtnText, ghost && styles.miniBtnTextGhost]}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

function SelectField({ label, valueLabel, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.selectField, pressed && { opacity: 0.9 }]}>
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

export default function DonorSettingsScreen() {
  const { currentUser, updateSettings, logout } = useAuth();

  const initial = useMemo(
    () => ({
      ...INITIAL_DONOR_SETTINGS,
      ...(currentUser?.settings || {}),
    }),
    [currentUser]
  );

  const [settings, setSettings] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [picker, setPicker] = useState(null);

  useEffect(() => {
    const next = {
      ...INITIAL_DONOR_SETTINGS,
      ...(currentUser?.settings || {}),
    };
    setSettings(next);
    setBaseline(JSON.stringify(next));
  }, [currentUser?.email]);

  const dirty = JSON.stringify(settings) !== baseline;
  const selectedCount = settings.preferredCategories?.length || 0;

  const patch = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (category) => {
    setSettings((prev) => {
      const list = prev.preferredCategories || [];
      const next = list.includes(category)
        ? list.filter((c) => c !== category)
        : [...list, category];
      return { ...prev, preferredCategories: next };
    });
  };

  const resetChanges = () => {
    setSettings(JSON.parse(baseline));
    notify('Changes discarded');
  };

  const saveSettings = () => {
    if (!dirty) return;
    updateSettings({ ...settings });
    setBaseline(JSON.stringify(settings));
    notify('Settings saved.');
  };

  const confirmDanger = (actionLabel) => {
    Alert.alert(
      actionLabel,
      'This is a sensitive action. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => notify(`${actionLabel} request submitted for review`),
        },
      ]
    );
  };

  const optionLabel = (options, id) => options.find((o) => o.id === id)?.label || id;

  const pickerConfig = {
    language: { title: 'Preferred Language', options: DONOR_LANGUAGE_OPTIONS, key: 'language' },
    timezone: { title: 'Time Zone', options: DONOR_TIMEZONE_OPTIONS, key: 'timezone' },
    dateFormat: { title: 'Date Format', options: DONOR_DATE_FORMAT_OPTIONS, key: 'dateFormat' },
  }[picker];

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Settings</Text>
        <Text style={styles.heroBody}>
          Manage your account preferences, notifications, privacy, and donation settings.
        </Text>
      </View>

      <Card>
        <SectionHeader
          icon="notifications-outline"
          title="Notification Preferences"
          subtitle="Choose how you want to hear about donations and account activity."
        />
        <View style={styles.list}>
          {DONOR_NOTIFICATION_TOGGLES.map((item, index) => (
            <ToggleRow
              key={item.key}
              title={item.title}
              description={item.description}
              value={!!settings[item.key]}
              onValueChange={(value) => patch(item.key, value)}
              first={index === 0}
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionHeader
          icon="heart-outline"
          title="Donation Preferences"
          subtitle="Set defaults for how and what you prefer to donate."
        />
        <ToggleRow
          title="Anonymous Donations"
          description="Hide your name from public donation activity when possible."
          value={!!settings.anonymousDonations}
          onValueChange={(value) => patch('anonymousDonations', value)}
        />

        <View style={styles.multiBlock}>
          <View style={styles.multiLabelRow}>
            <Text style={styles.toggleTitle}>Preferred Donation Categories</Text>
            <Text style={styles.selectedCount}>{selectedCount} selected</Text>
          </View>
          <Pressable
            onPress={() => setCategoryOpen((o) => !o)}
            style={({ pressed }) => [styles.multiTrigger, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.multiTriggerText} numberOfLines={2}>
              {selectedCount
                ? settings.preferredCategories.join(', ')
                : 'Select preferred categories'}
            </Text>
            <Ionicons
              name={categoryOpen ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.textMuted}
            />
          </Pressable>
          {categoryOpen && (
            <View style={styles.chipWrap}>
              {DONOR_CATEGORIES.map((cat) => {
                const active = settings.preferredCategories.includes(cat);
                return (
                  <Pressable
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    {active ? (
                      <Ionicons name="checkmark" size={12} color={colors.primaryHover} />
                    ) : null}
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <ActionRow
          title="Default Payment Preference"
          description="Manage your preferred payment method for future contributions."
          buttonLabel="Manage"
          buttonIcon="card-outline"
          onPress={() => notify('Payment preferences opened')}
        />
        <ActionRow
          title="Default Pickup Preference"
          description="Coming soon — set preferred pickup windows for item donations."
          buttonLabel="Coming soon"
          buttonIcon="car-outline"
          ghost
          onPress={() => notify('Pickup preferences coming soon')}
        />
      </Card>

      <Card>
        <SectionHeader
          icon="shield-checkmark-outline"
          title="Privacy & Security"
          subtitle="Protect your account and review recent access activity."
        />
        <ActionRow
          title="Change Password"
          description="Update your password to keep your account secure."
          buttonLabel="Change Password"
          buttonIcon="key-outline"
          onPress={() => notify('Password change flow opened')}
        />
        <ToggleRow
          title="Two-Factor Authentication"
          description="Add an extra verification step when signing in. Future-ready."
          value={!!settings.twoFactorEnabled}
          onValueChange={(value) => {
            patch('twoFactorEnabled', value);
            if (value) notify('2FA setup coming soon');
          }}
        />
        <ActionRow
          title="Active Sessions"
          description="Review devices currently signed in to your donor account."
          meta="1 active"
          buttonLabel="View"
          buttonIcon="phone-portrait-outline"
          ghost
          onPress={() => notify('Active sessions reviewed')}
        />
        <View style={styles.actionRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Last Login Information</Text>
            <Text style={styles.toggleDesc}>Most recent successful sign-in to this account.</Text>
          </View>
          <Text style={styles.metaText}>Today · 09:18 AM IST</Text>
        </View>
      </Card>

      <Card>
        <SectionHeader
          icon="options-outline"
          title="Account Preferences"
          subtitle="Language, regional formats, and appearance."
        />
        <View style={styles.selectGrid}>
          <SelectField
            label="Preferred Language"
            valueLabel={optionLabel(DONOR_LANGUAGE_OPTIONS, settings.language)}
            onPress={() => setPicker('language')}
          />
          <SelectField
            label="Time Zone"
            valueLabel={optionLabel(DONOR_TIMEZONE_OPTIONS, settings.timezone)}
            onPress={() => setPicker('timezone')}
          />
          <SelectField
            label="Date Format"
            valueLabel={optionLabel(DONOR_DATE_FORMAT_OPTIONS, settings.dateFormat)}
            onPress={() => setPicker('dateFormat')}
          />
        </View>

        <Text style={[styles.toggleTitle, { marginTop: spacing.md }]}>Theme</Text>
        <View style={styles.themeRow}>
          <Pressable
            onPress={() => patch('theme', 'light')}
            style={[styles.themeCard, settings.theme === 'light' && styles.themeCardActive]}
          >
            <Text
              style={[styles.themeCardText, settings.theme === 'light' && styles.themeCardTextActive]}
            >
              Light Mode
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              patch('theme', 'dark');
              notify('Dark Mode coming soon');
            }}
            style={[styles.themeCard, settings.theme === 'dark' && styles.themeCardActive]}
          >
            <Text
              style={[styles.themeCardText, settings.theme === 'dark' && styles.themeCardTextActive]}
            >
              Dark Mode
            </Text>
            <Text style={styles.comingSoon}>Coming soon</Text>
          </Pressable>
        </View>
      </Card>

      <Card>
        <SectionHeader
          icon="server-outline"
          title="Data Management"
          subtitle="Download your donation history and account activity."
        />
        <View style={styles.dataActions}>
          <Button
            title="Download Donation History"
            variant="secondary"
            onPress={() => notify('Downloading donation history…')}
          />
          <Button
            title="Export Account Data"
            variant="secondary"
            onPress={() => notify('Exporting account data…')}
          />
          <Button
            title="View Activity Log"
            variant="secondary"
            onPress={() => notify('Opening activity log…')}
          />
        </View>
      </Card>

      <Card style={styles.dangerCard}>
        <SectionHeader
          icon="warning-outline"
          title="Danger Zone"
          subtitle="These actions are irreversible and may remove access to donation history."
        />
        <Text style={styles.dangerNote}>
          Deactivating or deleting your account will pause donation participation. Please confirm
          carefully before continuing.
        </Text>
        <View style={styles.dangerActions}>
          <Pressable
            style={({ pressed }) => [styles.warnBtn, pressed && { opacity: 0.9 }]}
            onPress={() => confirmDanger('Deactivate Account')}
          >
            <Text style={styles.warnBtnText}>Deactivate Account</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.dangerBtn, pressed && { opacity: 0.9 }]}
            onPress={() => confirmDanger('Delete Account')}
          >
            <Text style={styles.dangerBtnText}>Delete Account</Text>
          </Pressable>
        </View>
      </Card>

      <View style={[styles.footer, dirty && styles.footerDirty]}>
        {dirty ? <Text style={styles.unsaved}>Unsaved Changes</Text> : <View />}
        <View style={styles.footerBtns}>
          <Button
            title="Reset Changes"
            variant="secondary"
            onPress={resetChanges}
            disabled={!dirty}
            style={{ flex: 1 }}
          />
          <Button
            title="Save Settings"
            onPress={saveSettings}
            disabled={!dirty}
            style={{ flex: 1 }}
          />
        </View>
        <Button title="Sign out" variant="ghost" onPress={logout} />
      </View>

      <BottomSheet
        visible={!!picker}
        onClose={() => setPicker(null)}
        title={pickerConfig?.title || 'Select'}
      >
        {(pickerConfig?.options || []).map((opt) => {
          const selected = settings[pickerConfig.key] === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => {
                patch(pickerConfig.key, opt.id);
                setPicker(null);
              }}
              style={[styles.optionRow, selected && styles.optionRowSelected]}
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
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: {
    gap: 6,
  },
  heroTitle: {
    ...typography.title,
  },
  heroBody: {
    ...typography.body,
  },
  sectionHead: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSub: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  list: {
    gap: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  toggleRowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  toggleDesc: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    gap: spacing.sm,
  },
  metaText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: colors.blue,
  },
  miniBtn: {
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniBtnGhost: {
    borderColor: 'transparent',
    backgroundColor: colors.primarySoft,
  },
  miniBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  miniBtnTextGhost: {
    color: colors.primaryHover,
  },
  multiBlock: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    gap: spacing.sm,
  },
  multiLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  multiTrigger: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  multiTriggerText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primaryHover,
  },
  selectGrid: {
    gap: spacing.sm,
  },
  selectField: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  selectLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 4,
  },
  selectValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  themeRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeCard: {
    flex: 1,
    minHeight: 64,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.sm,
  },
  themeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  themeCardText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  themeCardTextActive: {
    color: colors.primaryHover,
  },
  comingSoon: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dataActions: {
    gap: spacing.sm,
  },
  dangerCard: {
    borderColor: '#FECACA',
    backgroundColor: '#FFF7F7',
  },
  dangerNote: {
    ...typography.body,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  dangerActions: {
    gap: spacing.sm,
  },
  warnBtn: {
    minHeight: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  warnBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  dangerBtn: {
    minHeight: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
  },
  dangerBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  footerDirty: {
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
    backgroundColor: colors.primarySoft,
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  unsaved: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  footerBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
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
  optionRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primaryHover,
  },
});
