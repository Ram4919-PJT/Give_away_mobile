import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  DATE_RANGES,
  getFilteredAnalytics,
  INITIAL_REPORT_FILTERS,
  RECENT_REPORTS,
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  REPORT_TEMPLATES,
  REPORT_TYPES,
} from '../../data/ngoReportsData';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const BORDER = '#E5E7EB';

const TEMPLATE_ICONS = {
  Gift: 'gift-outline',
  Users: 'people-outline',
  Package: 'cube-outline',
  Banknote: 'wallet-outline',
};

const KPI_META = [
  {
    key: 'totalDonations',
    label: 'Total Donations',
    delta: 'donationsDelta',
    icon: 'gift-outline',
    up: true,
  },
  {
    key: 'itemsDistributed',
    label: 'Items Distributed',
    delta: 'itemsDelta',
    icon: 'cube-outline',
    up: true,
  },
  {
    key: 'activeBeneficiaries',
    label: 'Active Beneficiaries',
    delta: 'beneficiariesDelta',
    icon: 'people-outline',
    up: true,
  },
  {
    key: 'pendingRequests',
    label: 'Pending Requests',
    delta: 'pendingDelta',
    icon: 'time-outline',
    up: false,
  },
];

function toast(title, body = 'Wireframe preview') {
  Alert.alert(title, body);
}

function ChipRow({ options, value, onChange, getId, getLabel }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipScroll}
      contentContainerStyle={styles.chips}
    >
      {options.map((opt) => {
        const id = getId ? getId(opt) : opt;
        const label = getLabel ? getLabel(opt) : opt;
        const active = value === id;
        return (
          <Pressable
            key={String(id)}
            onPress={() => onChange(id)}
            style={[styles.chip, active && styles.chipOn]}
          >
            <Text style={[styles.chipText, active && styles.chipTextOn]}>{label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function BarChart({ data, valueKey = 'value', formatTick }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <View style={styles.barChart}>
      {data.map((d) => {
        const h = Math.max(8, Math.round((d[valueKey] / max) * 100));
        return (
          <View key={d.label} style={styles.barCol}>
            <Text style={styles.barValue}>
              {formatTick ? formatTick(d[valueKey]) : d[valueKey]}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { height: `${h}%` }]} />
            </View>
            <Text style={styles.barLabel}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function TrendChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={styles.barChart}>
      {data.map((d) => {
        const h = Math.max(10, Math.round((d.value / max) * 100));
        return (
          <View key={d.label} style={styles.barCol}>
            <Text style={styles.barValue}>{d.value}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { height: `${h}%` }]} />
            </View>
            <Text style={styles.barLabel}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

/** Clean stacked distribution + legend (mobile-friendly pie alternative) */
function DistributionChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <View>
      <View style={styles.stackBar}>
        {data.map((d) => (
          <View
            key={d.name}
            style={{
              flex: d.value / total,
              backgroundColor: d.color,
              height: 14,
            }}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {data.map((d) => (
          <View key={d.name} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: d.color }]} />
            <Text style={styles.legendName}>{d.name}</Text>
            <Text style={styles.legendVal}>
              {d.value} ({Math.round((d.value / total) * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function NgoReportsScreen() {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState({ ...INITIAL_REPORT_FILTERS });
  const [generatedAt, setGeneratedAt] = useState({});
  const analytics = useMemo(() => getFilteredAnalytics(filters), [filters]);

  const patch = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({ ...INITIAL_REPORT_FILTERS });
    toast('Filters reset');
  };

  const generateReport = (report) => {
    const stamp = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setGeneratedAt((prev) => ({ ...prev, [report.id]: stamp }));
    toast(`${report.name} generated`, 'Report is ready under Recent Reports.');
  };

  if (!currentUser?.verified) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Text style={styles.title}>Reports</Text>
        <View style={styles.locked}>
          <Ionicons name="lock-closed-outline" size={28} color={MUTED} />
          <Text style={styles.lockedTitle}>Reports locked</Text>
          <Text style={styles.lockedBody}>
            Complete NGO verification to unlock analytics and export tools.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>
        Analyze donations, beneficiaries, inventory, and financial assistance.
      </Text>

      {/* KPIs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.kpiScroll}
        contentContainerStyle={styles.kpiRow}
      >
        {KPI_META.map((k) => (
          <View key={k.key} style={styles.kpiCard}>
            <View style={styles.kpiIcon}>
              <Ionicons name={k.icon} size={18} color={PRIMARY_TEXT} />
            </View>
            <Text style={styles.kpiValue}>
              {Number(analytics.kpis[k.key]).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.kpiLabel}>{k.label}</Text>
            <Text style={[styles.kpiDelta, !k.up && styles.kpiDeltaDown]}>
              {analytics.kpis[k.delta]}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Filters */}
      <View style={styles.filterCard}>
        <View style={styles.filterHead}>
          <Text style={styles.sectionTitle}>Filters</Text>
          <Pressable onPress={resetFilters} hitSlop={8}>
            <Text style={styles.reset}>Reset</Text>
          </Pressable>
        </View>
        <Text style={styles.filterLabel}>Date range</Text>
        <ChipRow
          options={DATE_RANGES}
          value={filters.dateRange}
          onChange={(id) => patch('dateRange', id)}
          getId={(o) => o.id}
          getLabel={(o) => o.label}
        />
        <Text style={styles.filterLabel}>Report type</Text>
        <ChipRow
          options={REPORT_TYPES}
          value={filters.reportType}
          onChange={(id) => patch('reportType', id)}
          getId={(o) => o.id}
          getLabel={(o) => o.label}
        />
        <Text style={styles.filterLabel}>Category</Text>
        <ChipRow
          options={REPORT_CATEGORIES}
          value={filters.category}
          onChange={(id) => patch('category', id)}
        />
        <Text style={styles.filterLabel}>Status</Text>
        <ChipRow
          options={REPORT_STATUSES}
          value={filters.status}
          onChange={(id) => patch('status', id)}
        />
      </View>

      {analytics.hasData ? (
        <>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Donation Trend</Text>
            <TrendChart data={analytics.trend} />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Donation Distribution</Text>
            <DistributionChart data={analytics.distribution} />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Donations</Text>
            <BarChart
              data={analytics.monthly}
              formatTick={(v) => `${Math.round(v / 1000)}k`}
            />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Beneficiary Status</Text>
            <DistributionChart data={analytics.beneficiaryStatus} />
          </View>

          <Text style={styles.sectionTitle}>Impact Insights</Text>
          <View style={styles.insightGrid}>
            {analytics.insights.map((ins) => (
              <View key={ins.id} style={styles.insightCard}>
                <Text style={styles.insightLabel}>{ins.label}</Text>
                <Text style={styles.insightValue}>{ins.value}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <Ionicons name="bar-chart-outline" size={32} color={MUTED} />
          <Text style={styles.emptyTitle}>No report data available</Text>
        </View>
      )}

      {/* Generate */}
      <Text style={styles.sectionTitle}>Generate Reports</Text>
      {REPORT_TEMPLATES.map((t) => (
        <View key={t.id} style={styles.templateCard}>
          <View style={styles.templateIcon}>
            <Ionicons name={TEMPLATE_ICONS[t.icon] || 'document-outline'} size={20} color={PRIMARY_TEXT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.templateName}>{t.name}</Text>
            <Text style={styles.templateDesc}>{t.description}</Text>
            <Text style={styles.templateMeta}>
              Last: {generatedAt[t.id] || t.lastGenerated}
            </Text>
          </View>
          <Pressable style={styles.genBtn} onPress={() => generateReport(t)}>
            <Text style={styles.genBtnText}>Generate</Text>
          </Pressable>
        </View>
      ))}

      {/* Export */}
      <Text style={styles.sectionTitle}>Export</Text>
      <View style={styles.exportRow}>
        {[
          { label: 'PDF', icon: 'document-text-outline', msg: 'PDF export started' },
          { label: 'Excel', icon: 'grid-outline', msg: 'Excel export started' },
          { label: 'Print', icon: 'print-outline', msg: 'Print preview opened' },
          { label: 'Schedule', icon: 'calendar-outline', msg: 'Schedule Report coming soon' },
        ].map((a) => (
          <Pressable
            key={a.label}
            style={styles.exportBtn}
            onPress={() => toast(a.msg)}
          >
            <Ionicons name={a.icon} size={18} color={PRIMARY_TEXT} />
            <Text style={styles.exportText}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent */}
      <Text style={styles.sectionTitle}>Recent Reports</Text>
      {RECENT_REPORTS.map((row) => (
        <View key={row.id} style={styles.recentCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.recentName}>{row.name}</Text>
            <Text style={styles.recentMeta}>
              {row.generatedBy} · {row.date} · {row.format}
            </Text>
            <View
              style={[
                styles.statusPill,
                row.status === 'Ready' ? styles.statusReady : styles.statusProcessing,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  row.status === 'Ready' ? styles.statusReadyText : styles.statusProcessingText,
                ]}
              >
                {row.status}
              </Text>
            </View>
          </View>
          <Button
            title="Download"
            variant="secondary"
            onPress={() => {
              if (row.status !== 'Ready') {
                toast('Still processing', 'Report is not ready to download.');
                return;
              }
              toast(`Downloading ${row.name}`, `${row.format} wireframe download.`);
            }}
            style={styles.dlBtn}
            textStyle={{ fontSize: 13 }}
          />
        </View>
      ))}
      <View style={{ height: 8 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  kpiScroll: { flexGrow: 0, marginBottom: 16, marginHorizontal: -20 },
  kpiRow: { paddingHorizontal: 20, gap: 12 },
  kpiCard: {
    width: 148,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 14,
    ...shadow.soft,
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiValue: { fontSize: 24, fontWeight: '700', color: TEXT, letterSpacing: -0.4 },
  kpiLabel: { fontSize: 12, color: MUTED, marginTop: 2, marginBottom: 6 },
  kpiDelta: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT },
  kpiDeltaDown: { color: '#2563EB' },
  filterCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...shadow.soft,
  },
  filterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reset: { fontSize: 13, fontWeight: '700', color: PRIMARY_TEXT },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 6,
  },
  chipScroll: { flexGrow: 0, height: 40, marginBottom: 4 },
  chips: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 12, fontWeight: '600', color: MUTED },
  chipTextOn: { color: WHITE },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 12,
    marginTop: 8,
  },
  chartCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...shadow.soft,
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: TEXT, marginBottom: 14 },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 6,
  },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barValue: { fontSize: 9, color: MUTED, marginBottom: 4 },
  barTrack: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 60,
  },
  barFill: {
    width: '100%',
    backgroundColor: PRIMARY,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barLabel: { fontSize: 10, color: MUTED, marginTop: 6, fontWeight: '600' },
  stackBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 14,
  },
  legend: { gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { flex: 1, fontSize: 13, color: TEXT, fontWeight: '500' },
  legendVal: { fontSize: 12, color: MUTED, fontWeight: '600' },
  insightGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  insightCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    ...shadow.soft,
  },
  insightLabel: { fontSize: 12, color: MUTED, marginBottom: 6 },
  insightValue: { fontSize: 15, fontWeight: '700', color: TEXT },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    ...shadow.soft,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateName: { fontSize: 15, fontWeight: '700', color: TEXT },
  templateDesc: { fontSize: 12, color: MUTED, marginTop: 2, lineHeight: 16 },
  templateMeta: { fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  genBtn: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  genBtnText: { fontSize: 12, fontWeight: '700', color: PRIMARY_TEXT },
  exportRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
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
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    ...shadow.soft,
  },
  recentName: { fontSize: 15, fontWeight: '700', color: TEXT },
  recentMeta: { fontSize: 12, color: MUTED, marginTop: 2, marginBottom: 8 },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusReady: { backgroundColor: PRIMARY_SOFT },
  statusProcessing: { backgroundColor: '#FFF7ED' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusReadyText: { color: PRIMARY_TEXT },
  statusProcessingText: { color: '#C2410C' },
  dlBtn: { minHeight: 36, paddingHorizontal: 12 },
  empty: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    ...shadow.soft,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: TEXT },
  locked: {
    marginTop: 32,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    ...shadow.soft,
  },
  lockedTitle: { fontSize: 18, fontWeight: '700', color: TEXT },
  lockedBody: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20 },
});
