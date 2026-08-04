import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Screen, TextField } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) setError(result.error);
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>
        Use your registered email and password. Your role is assigned automatically after login.
      </Text>

      <Card style={styles.formCard}>
        <TextField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
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
      </Card>

      <Pressable
        style={styles.registerLink}
        onPress={() => navigation.navigate('RegisterRole')}
      >
        <Text style={styles.registerLinkText}>New here? Create an account</Text>
      </Pressable>
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
  formCard: {
    gap: 0,
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
});
