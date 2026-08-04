import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui';
import { colors, radius, spacing } from '../theme';

export default function LogoutConfirmModal({
  visible,
  userName,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={loading ? undefined : onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation?.()}>
          <View style={styles.iconWrap}>
            <Ionicons name="log-out-outline" size={28} color="#DC2626" />
          </View>

          <Text style={styles.title}>Sign out?</Text>
          <Text style={styles.body}>
            {userName
              ? `You're signed in as ${userName}. You'll need to sign in again to access your dashboard.`
              : "You'll need to sign in again to access your dashboard."}
          </Text>

          <View style={styles.actions}>
            <Button
              title="Stay signed in"
              variant="secondary"
              onPress={onCancel}
              disabled={loading}
              style={styles.btn}
            />
            <Button
              title={loading ? 'Signing out…' : 'Sign out'}
              onPress={onConfirm}
              loading={loading}
              style={[styles.btn, styles.dangerBtn]}
              textStyle={styles.dangerText}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  btn: {
    alignSelf: 'stretch',
  },
  dangerBtn: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  dangerText: {
    color: colors.white,
  },
});
