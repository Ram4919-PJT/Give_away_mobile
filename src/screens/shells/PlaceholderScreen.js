import { StyleSheet, Text } from 'react-native';
import { Card, Screen } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export default function PlaceholderScreen({ title, description }) {
  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Card>
        <Text style={styles.body}>
          {description ||
            'Feature shell ready for the next mobile wireframe pass. Same functionality as web will land here screen-by-screen.'}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.title,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
