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
  APPLY_ASSISTANCE_CATEGORIES,
  APPLY_FLOW_STEPS,
  APPLY_UPLOAD_PLACEHOLDERS,
  APPLY_WIREFRAME_DOCUMENTS,
} from '../../data/receiverApplyConfig';
import { buildReceiverApplicationFromFlow } from '../../utils/receiverHelpers';
import { colors, radius, spacing, typography } from '../../theme';

function Locked({ onProfile }) {
  return (
    <Screen contentStyle={styles.lockedWrap}>
      <Card style={styles.locked}>
        <Ionicons name="lock-closed" size={40} color={colors.textMuted} />
        <Text style={styles.lockedTitle}>Financial Assistance Locked</Text>
        <Text style={styles.lockedBody}>
          Complete receiver verification before applying for financial assistance from AJA
          Abayahastham.
        </Text>
        <Button title="Complete Verification" onPress={onProfile} style={{ alignSelf: 'stretch' }} />
      </Card>
    </Screen>
  );
}

function Progress({ step }) {
  return (
    <View style={styles.progress}>
      {APPLY_FLOW_STEPS.map((s) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <View key={s.id} style={styles.progressItem}>
            <View
              style={[
                styles.progressDot,
                done && styles.progressDotDone,
                active && styles.progressDotActive,
              ]}
            >
              {done ? (
                <Ionicons name="checkmark" size={12} color={colors.white} />
              ) : (
                <Text style={[styles.progressNum, active && styles.progressNumActive]}>{s.id}</Text>
              )}
            </View>
            <Text style={[styles.progressLabel, active && styles.progressLabelActive]}>
              {s.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function ApplyAssistanceScreen() {
  const navigation = useNavigation();
  const {
    currentUser,
    addReceiverApplication,
    prependReceiverNotification,
  } = useAuth();

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const [form, setForm] = useState({
    purpose: '',
    amount: '',
    description: '',
    notes: '',
  });

  if (!currentUser?.verified) {
    return (
      <Locked
        onProfile={() => navigation.navigate('Profile', { screen: 'ReceiverProfile' })}
      />
    );
  }

  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const cat = APPLY_ASSISTANCE_CATEGORIES.find((c) => c.id === categoryId);

  const canNext =
    (step === 1 && categoryId) ||
    (step === 2 && form.purpose.trim() && form.amount.trim() && form.description.trim()) ||
    step === 3 ||
    step === 4;

  const submit = () => {
    const application = buildReceiverApplicationFromFlow({
      categoryId,
      form,
      user: currentUser,
    });
    addReceiverApplication(application);
    prependReceiverNotification({
      id: `rn-${Date.now()}`,
      title: 'Application Submitted',
      message: `${application.id} has been submitted to AJA Abayahastham for review.`,
      time: 'Just now',
      group: 'today',
      read: false,
      icon: 'document-outline',
    });
    Alert.alert('Application Submitted', 'Thank you. AJA will review your request.', [
      {
        text: 'View Applications',
        onPress: () => {
          setStarted(false);
          setStep(1);
          setCategoryId('');
          setForm({ purpose: '', amount: '', description: '', notes: '' });
          navigation.navigate('Applications');
        },
      },
    ]);
  };

  if (!started) {
    return (
      <Screen scroll contentStyle={styles.content}>
        <View style={styles.hero}>
        <Text style={styles.title}>Apply</Text>
        <Text style={styles.subtitle}>Private requests reviewed by AJA</Text>
      </View>

      <Card style={styles.landingCard}>
          <View style={styles.landingIcon}>
            <Ionicons name="heart" size={28} color={colors.primaryHover} />
          </View>
          <Text style={styles.landingTitle}>Financial assistance</Text>
          <Text style={styles.landingBody}>
            Share what you need. AJA reviews every application with care.
          </Text>
          <View style={styles.bullets}>
            {['Choose a category', 'Share your details', 'Attach documents', 'Submit securely'].map(
              (b) => (
                <View key={b} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primaryHover} />
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              )
            )}
          </View>
          <Button title="Start application" onPress={() => setStarted(true)} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable
        style={styles.back}
        onPress={() => {
          if (step === 1) setStarted(false);
          else setStep((s) => s - 1);
        }}
      >
        <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Apply for Assistance</Text>
      <Progress step={step} />

      {step === 1 && (
        <View style={styles.list}>
          <Text style={styles.stepTitle}>Choose Assistance Type</Text>
          <Text style={styles.stepSub}>Select the category that best describes your need.</Text>
          {APPLY_ASSISTANCE_CATEGORIES.map((c) => {
            const selected = categoryId === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                style={[styles.typeCard, selected && styles.typeCardActive]}
              >
                <Text style={styles.typeEmoji}>{c.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.typeTitle}>{c.title}</Text>
                  <Text style={styles.typeDesc}>{c.description}</Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primaryHover} />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {step === 2 && (
        <Card style={{ gap: spacing.md }}>
          <Text style={styles.stepTitle}>Application Details</Text>
          <Field label="Purpose" value={form.purpose} onChangeText={(v) => patch('purpose', v)} placeholder="e.g. Emergency house rent support" />
          <Field label="Required Amount (₹)" value={form.amount} onChangeText={(v) => patch('amount', v)} placeholder="Enter amount" keyboardType="numeric" />
          <Field label="Description" value={form.description} onChangeText={(v) => patch('description', v)} placeholder="Explain your situation" multiline />
          <Field label="Additional Notes" value={form.notes} onChangeText={(v) => patch('notes', v)} placeholder="Optional" multiline short />
        </Card>
      )}

      {step === 3 && (
        <Card style={{ gap: spacing.md }}>
          <Text style={styles.stepTitle}>Upload Documents</Text>
          <Text style={styles.stepSub}>Wireframe placeholders — uploads are simulated.</Text>
          <View style={styles.dropzone}>
            <Ionicons name="cloud-upload-outline" size={28} color={colors.primaryHover} />
            <Text style={styles.uploadTitle}>Attach documents</Text>
            <Text style={styles.uploadSub}>PDF, JPG, PNG · Max 5MB</Text>
          </View>
          {APPLY_UPLOAD_PLACEHOLDERS.map((item) => (
            <View key={item.label} style={styles.uploadCard}>
              <Ionicons name="attach-outline" size={18} color={colors.primaryHover} />
              <View>
                <Text style={styles.uploadCardTitle}>{item.label}</Text>
                <Text style={styles.uploadSub}>{item.hint}</Text>
              </View>
            </View>
          ))}
          {APPLY_WIREFRAME_DOCUMENTS.map((doc) => (
            <View key={doc.name} style={styles.docRow}>
              <Ionicons name="document-text-outline" size={18} color={colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.uploadSub}>{doc.filename}</Text>
              </View>
              <Text style={styles.docProgress}>
                {doc.progress === 100 ? 'Complete' : doc.progress > 0 ? `${doc.progress}%` : 'Pending'}
              </Text>
            </View>
          ))}
        </Card>
      )}

      {step === 4 && (
        <Card style={{ gap: spacing.md }}>
          <Text style={styles.stepTitle}>Review & Submit</Text>
          <View style={styles.reviewBlock}>
            <Text style={styles.reviewLabel}>Selected Assistance</Text>
            <Text style={styles.reviewValue}>
              {cat ? `${cat.icon} ${cat.title}` : '—'}
            </Text>
          </View>
          <View style={styles.reviewBlock}>
            <Text style={styles.reviewLabel}>Purpose</Text>
            <Text style={styles.reviewValue}>{form.purpose || '—'}</Text>
          </View>
          <View style={styles.reviewBlock}>
            <Text style={styles.reviewLabel}>Amount</Text>
            <Text style={styles.reviewValue}>₹{form.amount || '—'}</Text>
          </View>
          <View style={styles.reviewBlock}>
            <Text style={styles.reviewLabel}>Description</Text>
            <Text style={styles.reviewValue}>{form.description || '—'}</Text>
          </View>
        </Card>
      )}

      <View style={styles.footer}>
        {step < 4 ? (
          <Button
            title="Next"
            disabled={!canNext}
            onPress={() => setStep((s) => s + 1)}
          />
        ) : (
          <Button title="Submit Application" onPress={submit} />
        )}
      </View>
    </Screen>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline, short, keyboardType }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && (short ? styles.textareaShort : styles.textarea)]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.xxl },
  lockedWrap: { justifyContent: 'center', flexGrow: 1 },
  locked: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  lockedTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  lockedBody: { fontSize: 13, lineHeight: 19, color: colors.textSecondary, textAlign: 'center' },
  hero: { gap: 4 },
  title: { ...typography.title },
  subtitle: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  landingCard: { gap: spacing.md, alignItems: 'stretch' },
  landingIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  landingTitle: { fontSize: 18, fontWeight: '800', color: colors.text, textAlign: 'center' },
  landingBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bullets: { gap: 10 },
  bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  bulletText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  progress: { flexDirection: 'row', justifyContent: 'space-between' },
  progressItem: { flex: 1, alignItems: 'center', gap: 4 },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  progressDotDone: { backgroundColor: colors.primaryHover, borderColor: colors.primaryHover },
  progressDotActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  progressNum: { fontSize: 12, fontWeight: '800', color: colors.textMuted },
  progressNumActive: { color: colors.primaryHover },
  progressLabel: { fontSize: 10, fontWeight: '600', color: colors.textMuted, textAlign: 'center' },
  progressLabelActive: { color: colors.primaryHover },
  list: { gap: spacing.sm },
  stepTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  stepSub: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 72,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.card,
  },
  typeCardActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  typeEmoji: { fontSize: 24 },
  typeTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  typeDesc: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  fieldLabel: { ...typography.label },
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
  textarea: { minHeight: 100 },
  textareaShort: { minHeight: 72 },
  dropzone: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#86EFAC',
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  uploadSub: { fontSize: 12, color: colors.textSecondary },
  uploadCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  uploadCardTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
  },
  docName: { fontSize: 13, fontWeight: '700', color: colors.text },
  docProgress: { fontSize: 11, fontWeight: '700', color: colors.primaryHover },
  reviewBlock: { gap: 4 },
  reviewLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  reviewValue: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 20 },
  footer: { marginTop: spacing.sm },
});
