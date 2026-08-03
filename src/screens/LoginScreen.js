import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheet,
  Button,
  Card,
  RoleChip,
  Screen,
  TextField,
} from '../components/ui';
import { useAuth } from '../context/AuthContext';
import {
  DEMO_ACCOUNT_GROUPS,
  LOGIN_ROLES,
  getDemoAccountsByGroup,
} from '../data/demoAccounts';
import { colors, radius, spacing, typography } from '../theme';

const ICON_MAP = {
  heart: 'heart',
  people: 'people',
  business: 'business',
  shield: 'shield-checkmark',
};

export default function LoginScreen({ navigation, route }) {
  const initialRole = route.params?.role || 'donor';
  const { login, loginAsDemo } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoGroup, setDemoGroup] = useState('Donor');

  const config = useMemo(
    () => LOGIN_ROLES.find((r) => r.key === role) || LOGIN_ROLES[0],
    [role]
  );

  const accounts = getDemoAccountsByGroup(demoGroup);

  const onSubmit = () => {
    setLoading(true);
    setError('');
    const result = login(email, password, role);
    setLoading(false);
    if (!result.ok) setError(result.error);
  };

  const onDemoLogin = (accountId) => {
    const result = loginAsDemo(accountId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDemoOpen(false);
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Choose your role, then continue with your account.</Text>

      <View style={styles.chipRow}>
        {LOGIN_ROLES.map((item) => (
          <RoleChip
            key={item.key}
            label={item.label}
            icon={ICON_MAP[item.icon]}
            selected={role === item.key}
            onPress={() => {
              setRole(item.key);
              setError('');
            }}
          />
        ))}
      </View>

      <Card style={styles.formCard}>
        <Text style={styles.roleHint}>{config.description}</Text>
        <TextField
          label={role === 'ngo' ? 'Organization Email' : role === 'admin' ? 'Admin Email' : 'Email Address'}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={{ marginTop: spacing.md }}
        />

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Button
          title="Sign In"
          onPress={onSubmit}
          loading={loading}
          style={{ marginTop: spacing.lg }}
        />

        <Button
          title="Try demo accounts"
          variant="ghost"
          onPress={() => {
            const groupMap = { donor: 'Donor', receiver: 'Receiver', ngo: 'NGO', admin: 'Admin' };
            setDemoGroup(groupMap[role] || 'Donor');
            setDemoOpen(true);
          }}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      {role !== 'admin' && (
        <Pressable
          style={styles.registerLink}
          onPress={() => navigation.navigate('RegisterForm', { role })}
        >
          <Text style={styles.registerLinkText}>
            New here? Create a {config.label} account
          </Text>
        </Pressable>
      )}

      <BottomSheet visible={demoOpen} onClose={() => setDemoOpen(false)} title="Demo accounts">
        <Text style={styles.demoSub}>One-tap login · password is always 123456</Text>
        <View style={styles.demoTabs}>
          {DEMO_ACCOUNT_GROUPS.map((group) => (
            <RoleChip
              key={group}
              label={group}
              selected={demoGroup === group}
              onPress={() => setDemoGroup(group)}
            />
          ))}
        </View>
        <View style={styles.demoList}>
          {accounts.map((account) => (
            <Pressable
              key={account.id}
              style={styles.demoRow}
              onPress={() => onDemoLogin(account.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.demoTitle}>{account.title}</Text>
                <Text style={styles.demoEmail}>{account.email}</Text>
                <Text
                  style={[
                    styles.demoStatus,
                    account.statusType === 'verified' || account.statusType === 'admin'
                      ? styles.demoStatusOk
                      : styles.demoStatusPending,
                  ]}
                >
                  {account.statusLabel}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    alignSelf: 'flex-start',
    marginLeft: -4,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  title: {
    ...typography.hero,
  },
  subtitle: {
    ...typography.body,
    marginTop: -8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  formCard: {
    gap: 0,
  },
  roleHint: {
    ...typography.caption,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  errorBox: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  errorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 18,
  },
  registerLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerLinkText: {
    color: colors.primaryHover,
    fontWeight: '600',
    fontSize: 14,
  },
  demoSub: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  demoTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  demoList: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  demoRow: {
    minHeight: 72,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  demoEmail: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  demoStatus: {
    marginTop: 6,
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  demoStatusOk: {
    backgroundColor: colors.primarySoft,
    color: colors.primaryDeep,
  },
  demoStatusPending: {
    backgroundColor: '#FFF7ED',
    color: '#C2410C',
  },
});
