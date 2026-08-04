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
import { Button, Card, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  clearDependentSelections,
  DONATE_ITEM_CATEGORY_CONFIG,
  formatDonationCategoryLabel,
  getDonateCategoryConfig,
  getVisibleSteps,
  isCategorySelectionComplete,
  ITEM_CONDITIONS,
} from '../../data/donateItemCategories';
import { colors, radius, spacing, typography } from '../../theme';
import { buildItemDonationNotes } from '../../api/mappers';

const STEPS = ['Category', 'Details', 'Pickup'];

function StepIndicator({ step }) {
  return (
    <View style={styles.steps}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                done && styles.stepDotDone,
                active && styles.stepDotActive,
              ]}
            >
              {done ? (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              ) : (
                <Text
                  style={[
                    styles.stepNum,
                    (active || done) && styles.stepNumActive,
                  ]}
                >
                  {n}
                </Text>
              )}
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipActive]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function DonateItemScreen() {
  const navigation = useNavigation();
  const { submitDonation } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [selections, setSelections] = useState({});
  const [description, setDescription] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [images, setImages] = useState([]);

  const categoryConfig = getDonateCategoryConfig(categoryId);
  const categoryComplete = categoryId && isCategorySelectionComplete(categoryId, selections);
  const categoryLabel = formatDonationCategoryLabel(categoryId, selections);
  const visibleSteps = categoryConfig ? getVisibleSteps(categoryConfig, selections) : [];
  const showCondition =
    !!categoryConfig &&
    (categoryConfig.steps.length === 0 || visibleSteps.every((s) => selections[s.key]));

  const handleCategorySelect = (id) => {
    setCategoryId(id);
    setSelections({});
  };

  const handleSelectionChange = (key, value) => {
    const config = getDonateCategoryConfig(categoryId);
    setSelections((prev) => {
      const cleared = config ? clearDependentSelections(config, key, prev) : prev;
      return { ...cleared, [key]: value };
    });
  };

  const addMockPhoto = () => {
    setImages((prev) => [
      ...prev,
      { id: `img-${Date.now()}`, name: `Photo ${prev.length + 1}` },
    ]);
  };

  const submit = async () => {
    if (!categoryComplete || !description.trim() || !pickupAddress.trim() || !pickupDate.trim()) {
      Alert.alert('Give Away', 'Complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await submitDonation({
        donation_type: 'ITEM',
        notes: buildItemDonationNotes({
          category: categoryLabel,
          description: description.trim(),
          pickupAddress: pickupAddress.trim(),
          pickupDate,
        }),
      });

      Alert.alert('Thank you', 'Item donation submitted! AJA will confirm pickup.', [
        { text: 'OK', onPress: () => navigation.navigate('DonateHub') },
      ]);

      setStep(1);
      setCategoryId('');
      setSelections({});
      setDescription('');
      setPickupAddress('');
      setPickupDate('');
      setImages([]);
    } catch (err) {
      Alert.alert('Give Away', err.message || 'Could not submit donation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
        <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
        <Text style={styles.backText}>Donate</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.title}>Donate Item</Text>
        <Text style={styles.subtitle}>
          Give physical items — AJA Abayahastham coordinates pickup and delivery.
        </Text>
      </View>

      <StepIndicator step={step} />

      {step === 1 && (
        <>
          <Card>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Text style={styles.sectionSub}>Select what you would like to donate</Text>
            <View style={styles.catGrid}>
              {DONATE_ITEM_CATEGORY_CONFIG.map((cat) => {
                const selected = categoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleCategorySelect(cat.id)}
                    style={[styles.catCard, selected && styles.catCardActive]}
                  >
                    <Text style={styles.catEmoji}>{cat.icon}</Text>
                    <Text style={[styles.catLabel, selected && styles.catLabelActive]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card>
            {!categoryConfig ? (
              <View style={styles.emptyPanel}>
                <Text style={styles.emptyEmoji}>📦</Text>
                <Text style={styles.emptyTitle}>Select a category</Text>
                <Text style={styles.emptyBody}>
                  Choose a donation category above to configure item details here.
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.md }}>
                <View style={styles.panelHead}>
                  <Text style={styles.catEmoji}>{categoryConfig.icon}</Text>
                  <Text style={styles.panelTitle}>{categoryConfig.label}</Text>
                </View>

                {categoryConfig.steps.length === 0 ? (
                  <View style={styles.hintCard}>
                    <Text style={styles.hintText}>
                      {categoryConfig.emptyHint || 'Describe your items in the next step.'}
                    </Text>
                  </View>
                ) : null}

                {visibleSteps.map((s) => (
                  <View key={s.key} style={{ gap: spacing.sm }}>
                    <Text style={styles.fieldLabel}>{s.label}</Text>
                    <View style={styles.chipRow}>
                      {s.options.map((opt) => (
                        <Chip
                          key={opt}
                          label={opt}
                          selected={selections[s.key] === opt}
                          onPress={() => handleSelectionChange(s.key, opt)}
                        />
                      ))}
                    </View>
                  </View>
                ))}

                {showCondition ? (
                  <View style={{ gap: spacing.sm }}>
                    <Text style={styles.fieldLabel}>Item Condition</Text>
                    <Text style={styles.sectionSub}>
                      Select the overall condition of your donation
                    </Text>
                    <View style={styles.chipRow}>
                      {ITEM_CONDITIONS.map((c) => (
                        <Chip
                          key={c}
                          label={c}
                          selected={selections.condition === c}
                          onPress={() =>
                            setSelections((prev) => ({ ...prev, condition: c }))
                          }
                        />
                      ))}
                    </View>
                  </View>
                ) : null}

                {categoryComplete ? (
                  <View style={styles.summaryBanner}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.primaryHover} />
                    <Text style={styles.summaryBannerText}>{categoryLabel}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </Card>
        </>
      )}

      {step === 2 && (
        <Card style={{ gap: spacing.md }}>
          {categoryLabel ? (
            <View style={styles.selectedBanner}>
              <Text style={styles.selectedBannerText}>
                <Text style={{ fontWeight: '800' }}>Selected: </Text>
                {categoryLabel}
              </Text>
            </View>
          ) : null}

          <View style={{ gap: spacing.sm }}>
            <Text style={styles.fieldLabel}>Item Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              multiline
              value={description}
              onChangeText={setDescription}
              placeholder="Describe items, quantity, size, brand, and any special notes…"
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
            />
          </View>

          <Pressable style={styles.upload} onPress={addMockPhoto}>
            <Ionicons name="cloud-upload-outline" size={24} color={colors.primaryHover} />
            <View>
              <Text style={styles.uploadTitle}>Add photos</Text>
              <Text style={styles.uploadSub}>Tap to attach photos of items (wireframe)</Text>
            </View>
          </Pressable>

          {images.length > 0 ? (
            <View style={styles.photoList}>
              {images.map((img) => (
                <View key={img.id} style={styles.photoChip}>
                  <Ionicons name="image-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.photoName}>{img.name}</Text>
                  <Pressable
                    hitSlop={8}
                    onPress={() => setImages((p) => p.filter((x) => x.id !== img.id))}
                  >
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </Card>
      )}

      {step === 3 && (
        <Card style={{ gap: spacing.md }}>
          <View style={{ gap: spacing.sm }}>
            <Text style={styles.fieldLabel}>Pickup Address</Text>
            <TextInput
              style={[styles.input, styles.textareaShort]}
              multiline
              value={pickupAddress}
              onChangeText={setPickupAddress}
              placeholder="Full address for item pickup"
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
            />
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={styles.fieldLabel}>Preferred Pickup Date</Text>
            <TextInput
              style={styles.input}
              value={pickupDate}
              onChangeText={setPickupDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.reviewBox}>
            <Text style={styles.reviewTitle}>{categoryLabel}</Text>
            <Text style={styles.reviewBody}>{description || '—'}</Text>
            <Text style={styles.reviewMeta}>
              {images.length} photo(s) · Pickup {pickupDate || '—'}
            </Text>
          </View>
        </Card>
      )}

      <View style={styles.actions}>
        {step > 1 ? (
          <Button
            title="Back"
            variant="secondary"
            onPress={() => setStep((s) => s - 1)}
            style={{ flex: 1 }}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {step < 3 ? (
          <Button
            title="Next"
            onPress={() => setStep((s) => s + 1)}
            disabled={step === 1 && !categoryComplete}
            style={{ flex: 1 }}
          />
        ) : (
          <Button title={submitting ? 'Submitting…' : 'Submit Donation'} onPress={submit} disabled={submitting} style={{ flex: 1 }} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  hero: { gap: 6 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  stepDotDone: {
    borderColor: colors.primaryHover,
    backgroundColor: colors.primaryHover,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },
  stepNumActive: {
    color: colors.primaryHover,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepLabelActive: {
    color: colors.primaryHover,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  catCard: {
    width: '47%',
    flexGrow: 1,
    minHeight: 84,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: spacing.sm,
  },
  catCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  catEmoji: { fontSize: 22 },
  catLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  catLabelActive: {
    color: colors.primaryHover,
  },
  emptyPanel: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 8,
  },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  emptyBody: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  panelHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  hintCard: {
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  hintText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  fieldLabel: {
    ...typography.label,
  },
  chipRow: {
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
    alignItems: 'center',
    justifyContent: 'center',
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
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  summaryBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDeep,
  },
  selectedBanner: {
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.blueSoft,
  },
  selectedBannerText: {
    fontSize: 13,
    color: colors.blue,
    lineHeight: 18,
  },
  input: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.card,
    fontSize: 15,
    color: colors.text,
  },
  textarea: {
    minHeight: 110,
  },
  textareaShort: {
    minHeight: 72,
  },
  upload: {
    minHeight: 72,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#86EFAC',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  uploadSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  photoList: { gap: spacing.sm },
  photoChip: {
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoName: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text },
  reviewBox: {
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 6,
  },
  reviewTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  reviewBody: { fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  reviewMeta: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 4 },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
