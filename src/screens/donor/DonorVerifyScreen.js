import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { buildDonorVerificationNotes } from '../../utils/donorVerification';
import { colors, radius, spacing, typography } from '../../theme';

const DOCS = [
  { key: 'aadhaarcard', name: 'Aadhaar Card', required: true },
  { key: 'selfie', name: 'Selfie', required: false },
  { key: 'addressproof', name: 'Address Proof', required: false },
];

function DocRow({ doc, uploaded, onToggle }) {
  const done = uploaded[doc.key];
  return (
    <Pressable
      onPress={() => onToggle(doc.key)}
      style={[styles.docRow, done && styles.docRowDone]}
    >
      <View style={[styles.docIcon, done && styles.docIconDone]}>
        <Ionicons
          name={done ? 'checkmark-circle' : 'cloud-upload-outline'}
          size={22}
          color={done ? colors.primaryHover : colors.textMuted}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.docTitle}>
          {doc.name}
          {doc.required ? ' *' : ' (Optional)'}
        </Text>
        <Text style={styles.docHint}>{done ? 'Marked as uploaded' : 'Tap to mark uploaded'}</Text>
      </View>
    </Pressable>
  );
}

export default function DonorVerifyScreen() {
  const { currentUser, submitDonorVerification } = useAuth();
  const [uploaded, setUploaded] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const status =
    currentUser?.verified === true
      ? 'verified'
      : currentUser?.verified === 'pending'
        ? 'pending'
        : currentUser?.verified === 'rejected'
          ? 'rejected'
          : 'none';

  const toggleDoc = (key) => {
    setUploaded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!uploaded.aadhaarcard) {
      Alert.alert('Give Away', 'Aadhaar Card is required.');
      return;
    }
    setSubmitting(true);
    try {
      await submitDonorVerification({
        notes: buildDonorVerificationNotes({
          'Aadhaar Card': uploaded.aadhaarcard,
          Selfie: uploaded.selfie,
          'Address Proof': uploaded.addressproof,
        }),
      });
      Alert.alert('Give Away', 'Verification submitted for admin review.');
    } catch (err) {
      Alert.alert('Give Away', err.message || 'Could not submit verification.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'verified') {
    return (
      <Screen contentStyle={styles.content}>
        <Card style={styles.statusCard}>
          <Ionicons name="shield-checkmark" size={40} color={colors.primaryHover} />
          <Text style={styles.statusTitle}>Verified Donor</Text>
          <Text style={styles.statusBody}>
            Your account is verified. Thank you for building trust with AJA Abayahastham.
          </Text>
        </Card>
      </Screen>
    );
  }

  if (status === 'pending') {
    return (
      <Screen contentStyle={styles.content}>
        <Card style={styles.statusCard}>
          <Ionicons name="time-outline" size={40} color={colors.primaryHover} />
          <Text style={styles.statusTitle}>Verification Pending</Text>
          <Text style={styles.statusBody}>
            Our team is reviewing your documents. You'll be notified once approved.
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>
          {status === 'rejected' ? 'Resubmit Verification' : 'Become a Verified Donor'}
        </Text>
        <Text style={styles.subtitle}>
          {status === 'rejected'
            ? currentUser?.rejectionReason || 'Please upload your documents again.'
            : 'Unlock verified badge, faster approval, and impact transparency.'}
        </Text>
      </View>

      {status !== 'rejected' && (
        <Card style={styles.benefits}>
          <Text style={styles.benefitsTitle}>Benefits</Text>
          {[
            'Verified badge on your profile',
            'Higher trust with AJA Abayahastham',
            'Faster donation approval',
          ].map((line) => (
            <View key={line} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primaryHover} />
              <Text style={styles.benefitText}>{line}</Text>
            </View>
          ))}
        </Card>
      )}

      <Card style={styles.docsCard}>
        <Text style={styles.sectionTitle}>Documents</Text>
        {DOCS.map((doc) => (
          <DocRow key={doc.key} doc={doc} uploaded={uploaded} onToggle={toggleDoc} />
        ))}
      </Card>

      <Button
        title={submitting ? 'Submitting…' : status === 'rejected' ? 'Resubmit Verification' : 'Submit Verification'}
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting}
        style={{ alignSelf: 'stretch' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  hero: { gap: spacing.xs },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  statusCard: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  statusTitle: { ...typography.section },
  statusBody: { ...typography.body, textAlign: 'center' },
  benefits: { gap: spacing.sm },
  benefitsTitle: { ...typography.label },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  benefitText: { ...typography.body, flex: 1 },
  docsCard: { gap: spacing.sm },
  sectionTitle: { ...typography.label, marginBottom: spacing.xs },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docRowDone: { borderColor: '#86EFAC', backgroundColor: '#F0FDF4' },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconDone: { backgroundColor: colors.primarySoft },
  docTitle: { ...typography.label },
  docHint: { ...typography.caption, marginTop: 2 },
});
