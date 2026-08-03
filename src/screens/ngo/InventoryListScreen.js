import { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, Button, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { DEMO_NGO_INVENTORY } from '../../data/demoNgoInventory';
import {
  countAvailableItems,
  getInventoryCategoryIcon,
  getInventoryStockStatus,
} from '../../utils/inventoryHelpers';
import { shadow } from '../../theme';

const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const PRIMARY = '#22C55E';
const PRIMARY_SOFT = '#DCFCE7';
const PRIMARY_TEXT = '#15803D';
const BORDER = '#E5E7EB';

const CARD_W = (Math.min(Dimensions.get('window').width, 430) - 40 - 12) / 2;

export default function InventoryListScreen() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [detailItem, setDetailItem] = useState(null);

  const inventory = DEMO_NGO_INVENTORY;
  const availableCount = useMemo(() => countAvailableItems(inventory), [inventory]);
  const verified = !!currentUser?.verified;

  if (!verified) {
    return (
      <Screen contentStyle={styles.pad} style={{ backgroundColor: BG }}>
        <Text style={styles.title}>Inventory</Text>
        <View style={styles.locked}>
          <Ionicons name="lock-closed-outline" size={28} color={MUTED} />
          <Text style={styles.lockedTitle}>Inventory locked</Text>
          <Text style={styles.lockedBody}>
            Complete NGO verification to browse warehouse stock and request items.
          </Text>
        </View>
      </Screen>
    );
  }

  const requestItem = (item) => {
    if (Number(item.qty) <= 0) {
      Alert.alert('Out of stock', 'This item is currently unavailable.');
      return;
    }
    navigation.navigate('InventoryRequest', { itemId: item.id });
  };

  return (
    <Screen scroll contentStyle={styles.pad} style={{ backgroundColor: BG }}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="archive-outline" size={22} color={PRIMARY_TEXT} />
        </View>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>
          Browse AJA warehouse stock and request items for your programs.
        </Text>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{availableCount}</Text>
          <Text style={styles.statLabel}>items in stock</Text>
        </View>
      </View>

      {inventory.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cube-outline" size={32} color={MUTED} />
          <Text style={styles.emptyTitle}>No inventory items</Text>
          <Text style={styles.emptyBody}>Nothing available right now. Check back soon.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {inventory.map((item) => {
            const status = getInventoryStockStatus(item.qty);
            const out = status.id === 'out';
            return (
              <View key={item.id} style={[styles.card, out && styles.cardOut]}>
                <View style={styles.cardTop}>
                  <View style={[styles.catIcon, out && styles.catIconOut]}>
                    <Ionicons
                      name={getInventoryCategoryIcon(item.category)}
                      size={20}
                      color={out ? MUTED : PRIMARY_TEXT}
                    />
                  </View>
                  <View style={[styles.badge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                  </View>
                </View>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemCat} numberOfLines={1}>
                  {item.category}
                </Text>
                <Text style={styles.qtyLabel}>Available</Text>
                <Text style={styles.qtyValue}>
                  {item.qty} {item.unit}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    out && styles.primaryBtnDisabled,
                    pressed && !out && { opacity: 0.9 },
                  ]}
                  disabled={out}
                  onPress={() => requestItem(item)}
                >
                  <Text style={[styles.primaryBtnText, out && styles.primaryBtnTextDisabled]}>
                    Request Item
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.8 }]}
                  onPress={() => setDetailItem(item)}
                >
                  <Text style={styles.ghostBtnText}>View Details</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      <BottomSheet
        visible={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.name || 'Item details'}
      >
        {detailItem ? (
          <View style={styles.detailBody}>
            {(() => {
              const status = getInventoryStockStatus(detailItem.qty);
              return (
                <>
                  <View style={[styles.detailBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                  </View>
                  <DetailRow label="Item ID" value={detailItem.id} />
                  <DetailRow label="Category" value={detailItem.category} />
                  <DetailRow
                    label="Available quantity"
                    value={`${detailItem.qty} ${detailItem.unit}`}
                  />
                  <Button
                    title={
                      Number(detailItem.qty) > 0
                        ? 'Request this item'
                        : 'Out of stock'
                    }
                    disabled={Number(detailItem.qty) <= 0}
                    onPress={() => {
                      const item = detailItem;
                      setDetailItem(null);
                      requestItem(item);
                    }}
                    style={{ marginTop: 12 }}
                  />
                </>
              );
            })()}
          </View>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 28 },
  hero: { marginBottom: 20 },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
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
    marginBottom: 14,
  },
  statPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    backgroundColor: WHITE,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadow.soft,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: PRIMARY_TEXT },
  statLabel: { fontSize: 13, fontWeight: '500', color: MUTED },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_W,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 14,
    ...shadow.soft,
  },
  cardOut: { opacity: 0.72 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconOut: { backgroundColor: '#F1F5F9' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    maxWidth: 78,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 2,
    minHeight: 40,
  },
  itemCat: { fontSize: 12, color: MUTED, marginBottom: 10 },
  qtyLabel: { fontSize: 11, fontWeight: '600', color: MUTED, textTransform: 'uppercase' },
  qtyValue: { fontSize: 18, fontWeight: '700', color: TEXT, marginBottom: 12 },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 6,
  },
  primaryBtnDisabled: { backgroundColor: '#E5E7EB' },
  primaryBtnText: { fontSize: 13, fontWeight: '700', color: WHITE },
  primaryBtnTextDisabled: { color: MUTED },
  ghostBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  ghostBtnText: { fontSize: 13, fontWeight: '600', color: PRIMARY_TEXT },
  empty: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    ...shadow.soft,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: TEXT, marginTop: 4 },
  emptyBody: { fontSize: 14, color: MUTED, textAlign: 'center' },
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
  detailBody: { gap: 12, paddingTop: 4 },
  detailBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  detailRow: { gap: 2 },
  detailLabel: { fontSize: 12, fontWeight: '600', color: MUTED, textTransform: 'uppercase' },
  detailValue: { fontSize: 15, fontWeight: '500', color: TEXT },
});
