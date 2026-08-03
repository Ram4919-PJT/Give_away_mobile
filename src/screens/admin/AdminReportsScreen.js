import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/ui';
import { ADMIN_REPORT_KPIS, ADMIN_REPORT_TABS } from '../../data/adminMobileData';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';

const TAB_CHARTS = {
  Donation: [
    { label: 'Money donations', value: '₹6.4L' },
    { label: 'Item donations', value: '512' },
    { label: 'Completed', value: '186' },
    { label: 'Pending', value: '28' },
  ],
  Fund: [
    { label: 'Received', value: '₹24.5L' },
    { label: 'Allocated', value: '₹12L' },
    { label: 'Distributed', value: '₹9.2L' },
    { label: 'Balance', value: '₹6.8L' },
  ],
  NGO: [
    { label: 'Verified NGOs', value: '24' },
    { label: 'Pending', value: '4' },
    { label: 'Active programs', value: '41' },
    { label: 'Top partner requests', value: '18' },
  ],
  Beneficiary: [
    { label: 'Total beneficiaries', value: '1,240' },
    { label: 'Active cases', value: '89' },
    { label: 'Completed aid', value: '640' },
    { label: 'Medical share', value: '32%' },
  ],
  Platform: [
    { label: 'Total users', value: '410' },
    { label: 'Donors', value: '245' },
    { label: 'Receivers', value: '132' },
    { label: 'Success rate', value: '94%' },
  ],
};

export default function AdminReportsScreen() {
  const [tab, setTab] = useState('Donation');
  const metrics = TAB_CHARTS[tab] || [];

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>Analytics across donations, funds, NGOs, and platform health</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.kpiScroll}
        contentContainerStyle={styles.kpiRow}
      >
        {ADMIN_REPORT_KPIS.map((k) => (
          <View key={k.label} style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{k.value}</Text>
            <Text style={styles.kpiLabel}>{k.label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}
      >
        {ADMIN_REPORT_TABS.map((t) => {
          const on = tab === t;
          return (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{t}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.section}>{tab} overview</Text>
      <View style={styles.grid}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.metricCard}>
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{tab} trend</Text>
        <View style={styles.bars}>
          {[42, 55, 48, 68, 74, 70, 82].map((h, i) => (
            <View key={i} style={styles.barCol}>
              <View style={[styles.bar, { height: `${h}%` }]} />
              <Text style={styles.barLabel}>{['J', 'F', 'M', 'A', 'M', 'J', 'J'][i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.section}>Export</Text>
      <View style={styles.exportRow}>
        {['PDF', 'Excel', 'Generate', 'Schedule'].map((a) => (
          <Pressable
            key={a}
            style={styles.exportBtn}
            onPress={() => Alert.alert(`${a}`, `${a} started (wireframe).`)}
          >
            <Ionicons
              name={
                a === 'PDF'
                  ? 'document-text-outline'
                  : a === 'Excel'
                    ? 'grid-outline'
                    : a === 'Generate'
                      ? 'sparkles-outline'
                      : 'calendar-outline'
              }
              size={18}
              color={PRIMARY_TEXT}
            />
            <Text style={styles.exportText}>{a}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 4, marginBottom: 16, lineHeight: 20 },
  kpiScroll: { flexGrow: 0, marginHorizontal: -20, marginBottom: 12 },
  kpiRow: { paddingHorizontal: 20, gap: 10 },
  kpiCard: {
    width: 120,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 12,
    ...shadow.soft,
  },
  kpiValue: { fontSize: 18, fontWeight: '700', color: TEXT },
  kpiLabel: { fontSize: 11, color: MUTED, marginTop: 4 },
  chipScroll: { flexGrow: 0, height: 40, marginBottom: 14 },
  chips: { gap: 8, alignItems: 'center' },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 12, fontWeight: '600', color: MUTED },
  chipTextOn: { color: WHITE },
  section: { fontSize: 18, fontWeight: '600', color: TEXT, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  metricCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    ...shadow.soft,
  },
  metricValue: { fontSize: 20, fontWeight: '700', color: TEXT },
  metricLabel: { fontSize: 12, color: MUTED, marginTop: 4 },
  chartCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...shadow.soft,
  },
  chartTitle: { fontSize: 15, fontWeight: '700', color: TEXT, marginBottom: 12 },
  bars: { flexDirection: 'row', height: 120, alignItems: 'flex-end', gap: 8 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: {
    width: '100%',
    backgroundColor: PRIMARY,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 12,
  },
  barLabel: { fontSize: 10, color: MUTED, marginTop: 6, fontWeight: '600' },
  exportRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  exportBtn: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    ...shadow.soft,
  },
  exportText: { fontSize: 13, fontWeight: '600', color: TEXT },
});
