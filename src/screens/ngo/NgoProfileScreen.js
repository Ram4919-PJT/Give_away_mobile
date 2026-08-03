import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/ngoHelpers';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

const LINKS = [
  {
    label: 'Organization Profile',
    desc: 'Details, documents, and verification',
    icon: 'business-outline',
    screen: 'NgoOrganizationProfile',
  },
  {
    label: 'Organization Settings',
    desc: 'Notifications, privacy, and security',
    icon: 'settings-outline',
    screen: 'NgoSettings',
  },
  {
    label: 'Beneficiaries',
    desc: 'People supported by your programs',
    icon: 'people-outline',
    screen: 'NgoBeneficiaries',
  },
  {
    label: 'Notifications',
    desc: 'Portal activity feed',
    icon: 'notifications-outline',
    screen: 'NgoNotifications',
  },
];

export default function NgoProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, logout } = useAuth();
  const orgName = (currentUser?.name || 'NGO Partner').replace(/\s*\(Demo\)\s*$/i, '');

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(orgName)}</Text>
        </View>
        <Text style={styles.name}>{orgName}</Text>
        <Text style={styles.role}>{currentUser?.status || 'NGO Partner'}</Text>
        {currentUser?.verified ? (
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={12} color={PRIMARY_TEXT} />
            <Text style={styles.badgeText}>Verified NGO</Text>
          </View>
        ) : (
          <Text style={styles.pending}>Verification pending</Text>
        )}
        {currentUser?.repName ? (
          <Text style={styles.rep}>Rep · {currentUser.repName}</Text>
        ) : null}
      </View>

      {LINKS.map((l) => (
        <Pressable
          key={l.label}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.88 }]}
          onPress={() => navigation.navigate(l.screen)}
        >
          <View style={styles.rowIcon}>
            <Ionicons name={l.icon} size={20} color={PRIMARY_TEXT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{l.label}</Text>
            <Text style={styles.rowDesc}>{l.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </Pressable>
      ))}

      <Button title="Sign out" variant="secondary" onPress={logout} style={{ marginTop: 8 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.4,
    marginBottom: 20,
  },
  hero: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    ...shadow.soft,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: WHITE, fontSize: 20, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: TEXT, textAlign: 'center' },
  role: { fontSize: 14, color: MUTED, marginTop: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: PRIMARY_TEXT },
  pending: { fontSize: 13, color: '#C2410C', fontWeight: '600', marginTop: 10 },
  rep: { fontSize: 12, color: MUTED, marginTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...shadow.soft,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontSize: 16, fontWeight: '600', color: TEXT },
  rowDesc: { fontSize: 13, color: MUTED, marginTop: 2 },
});
