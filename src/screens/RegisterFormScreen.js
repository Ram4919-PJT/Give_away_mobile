import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Screen, TextField } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme';

const TITLES = {
  donor: 'Register as Donor',
  receiver: 'Register as Receiver',
  ngo: 'Register as NGO Partner',
};

export default function RegisterFormScreen({ navigation, route }) {
  const role = route.params?.role || 'donor';
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    city: '',
    state: '',
    orgName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    const result = await register(role, form);
    setLoading(false);
    if (!result.ok) setError(result.error);
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>{TITLES[role] || 'Register'}</Text>
      <Text style={styles.subtitle}>
        Creates your account on the platform. Password must include upper, lower, digit, and special character.
      </Text>

      <Card style={styles.card}>
        {role === 'ngo' ? (
          <TextField
            label="Organization Name"
            value={form.orgName}
            onChangeText={set('orgName')}
            placeholder="Your NGO name"
            autoCapitalize="words"
          />
        ) : null}

        <TextField
          label={role === 'ngo' ? 'Representative Name' : 'Full Name'}
          value={form.name}
          onChangeText={set('name')}
          placeholder="Your name"
          autoCapitalize="words"
          style={role === 'ngo' ? { marginTop: spacing.md } : undefined}
        />
        <TextField
          label="Email"
          value={form.email}
          onChangeText={set('email')}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginTop: spacing.md }}
        />
        <TextField
          label="Password"
          value={form.password}
          onChangeText={set('password')}
          placeholder="e.g. Test@1234"
          secureTextEntry
          style={{ marginTop: spacing.md }}
        />
        <TextField
          label="Mobile"
          value={form.mobile}
          onChangeText={set('mobile')}
          placeholder="9876543210"
          keyboardType="phone-pad"
          style={{ marginTop: spacing.md }}
        />
        <View style={styles.row}>
          <TextField
            label="City"
            value={form.city}
            onChangeText={set('city')}
            placeholder="City"
            autoCapitalize="words"
            style={{ flex: 1 }}
          />
          <TextField
            label="State"
            value={form.state}
            onChangeText={set('state')}
            placeholder="State"
            autoCapitalize="words"
            style={{ flex: 1 }}
          />
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Button
          title="Create account"
          onPress={onSubmit}
          loading={loading}
          style={{ marginTop: spacing.lg }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    alignSelf: 'flex-start',
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
  card: {},
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  errorBox: {
    marginTop: spacing.md,
    backgroundColor: '#FEF2F2',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
  },
});
