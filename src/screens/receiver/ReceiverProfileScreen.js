import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen, TextField } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  getInitials,
  getReceiverApps,
  getReceiverStats,
} from '../../utils/receiverHelpers';
import { colors, radius, spacing } from '../../theme';

export default function ReceiverProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, receiverApplications, updateUser, requestLogout, logoutLoading } = useAuth();
  const apps = getReceiverApps(receiverApplications, currentUser);
  const stats = getReceiverStats(apps);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    address: currentUser?.address || '',
  });

  useEffect(() => {
    setForm({
      name: currentUser?.name || '',
      mobile: currentUser?.mobile || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      address: currentUser?.address || '',
    });
  }, [currentUser?.email]);

  const initials = useMemo(() => getInitials(currentUser?.name), [currentUser?.name]);

  const save = () => {
    updateUser({ ...form });
    setEditing(false);
    Alert.alert('Give Away', 'Profile updated.');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{currentUser?.name}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
        <View style={styles.badges}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Receiver</Text>
          </View>
          <View
            style={[
              styles.verifyBadge,
              currentUser?.verified ? styles.verifyOk : styles.verifyPending,
            ]}
          >
            <Ionicons
              name={currentUser?.verified ? 'shield-checkmark' : 'time-outline'}
              size={12}
              color={currentUser?.verified ? colors.primaryDeep : '#C2410C'}
            />
            <Text
              style={[
                styles.verifyText,
                currentUser?.verified ? styles.verifyOkText : styles.verifyPendingText,
              ]}
            >
              {currentUser?.verified ? 'Verified' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[
          ['Submitted', stats.submitted],
          ['In review', stats.underReview],
          ['Approved', stats.approved],
        ].map(([label, val]) => (
          <View key={label} style={styles.stat}>
            <Text style={styles.statVal}>{val}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Personal info</Text>
          <Pressable onPress={() => (editing ? save() : setEditing(true))} hitSlop={8}>
            <Text style={styles.link}>{editing ? 'Save' : 'Edit'}</Text>
          </Pressable>
        </View>

        {editing ? (
          <View style={styles.editFields}>
            <TextField
              label="Full name"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              autoCapitalize="words"
            />
            <TextField
              label="Mobile"
              value={form.mobile}
              onChangeText={(v) => setForm((f) => ({ ...f, mobile: v }))}
              keyboardType="phone-pad"
            />
            <TextField
              label="City"
              value={form.city}
              onChangeText={(v) => setForm((f) => ({ ...f, city: v }))}
              autoCapitalize="words"
            />
            <TextField
              label="State"
              value={form.state}
              onChangeText={(v) => setForm((f) => ({ ...f, state: v }))}
              autoCapitalize="words"
            />
            <TextField
              label="Address"
              value={form.address}
              onChangeText={(v) => setForm((f) => ({ ...f, address: v }))}
              autoCapitalize="sentences"
            />
            <Button title="Cancel" variant="ghost" onPress={() => setEditing(false)} />
          </View>
        ) : (
          [
            ['Mobile', currentUser?.mobile || '—'],
            ['City', currentUser?.city || '—'],
            ['State', currentUser?.state || '—'],
            ['Address', currentUser?.address || '—'],
          ].map(([label, value], index) => (
            <View
              key={label}
              style={[styles.infoRow, index === 0 && styles.infoRowFirst]}
            >
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))
        )}
      </Card>

      <View style={styles.menu}>
        {[
          {
            title: 'Settings',
            desc: 'Notifications & privacy',
            icon: 'settings-outline',
            onPress: () => navigation.navigate('ReceiverSettings'),
          },
          {
            title: 'Apply for assistance',
            desc: 'Start a new request',
            icon: 'heart-outline',
            onPress: () => navigation.navigate('Apply'),
          },
        ].map((item) => (
          <Pressable
            key={item.title}
            style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.92 }]}
            onPress={item.onPress}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon} size={18} color={colors.primaryHover} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Button title={logoutLoading ? 'Signing out…' : 'Sign out'} variant="secondary" onPress={requestLogout} loading={logoutLoading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.blue,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  email: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.blueSoft,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
  },
  verifyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  verifyOk: {
    backgroundColor: colors.primarySoft,
  },
  verifyPending: {
    backgroundColor: '#FFF7ED',
  },
  verifyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  verifyOkText: {
    color: colors.primaryDeep,
  },
  verifyPendingText: {
    color: '#C2410C',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  infoCard: {
    gap: 0,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  link: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryHover,
  },
  editFields: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  infoRow: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    gap: 3,
  },
  infoRowFirst: {
    borderTopWidth: 0,
    paddingTop: spacing.sm,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  menu: {
    gap: spacing.sm,
  },
  menuRow: {
    minHeight: 68,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  menuDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
