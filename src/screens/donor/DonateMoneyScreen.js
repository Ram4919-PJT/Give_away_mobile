import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, Button, Card, Screen, TextField } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  DONOR_MONEY_PRESETS,
  DONOR_PAYMENT_METHODS,
  DONOR_PURPOSES,
} from '../../data/donorConstants';
import {
  getPaymentLabel,
  POPULAR_BANKS,
  UPI_APPS,
  WALLET_OPTIONS,
} from '../../data/donateMoneyConfig';
import { formatCurrency } from '../../utils/format';
import { colors, radius, spacing, typography } from '../../theme';

function FieldLabel({ children }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

function PaymentPanel({ payment, amount, onPay, disabled }) {
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [bank, setBank] = useState('');
  const [wallet, setWallet] = useState('');

  if (payment === 'upi') {
    return (
      <View style={styles.payPanel}>
        <Text style={styles.payPanelTitle}>UPI Payment</Text>
        <Text style={styles.payPanelSub}>Scan with any UPI app or enter your UPI ID</Text>

        <View style={styles.qrBox}>
          <Ionicons name="qr-code-outline" size={72} color={colors.textMuted} />
          <Text style={styles.qrHint}>Scan with any UPI app</Text>
        </View>

        <Text style={styles.appsLabel}>Supported apps</Text>
        <View style={styles.chipRow}>
          {UPI_APPS.map((app) => (
            <View key={app.id} style={styles.softChip}>
              <Text style={styles.softChipText}>{app.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <FieldLabel>Enter UPI ID</FieldLabel>
        <View style={styles.upiRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="name@upi"
            placeholderTextColor={colors.textMuted}
            value={upiId}
            autoCapitalize="none"
            onChangeText={(t) => {
              setUpiId(t);
              setUpiVerified(false);
            }}
          />
          <Pressable
            style={styles.verifyBtn}
            onPress={() => {
              if (upiId.includes('@')) setUpiVerified(true);
              else Alert.alert('Give Away', 'Enter a valid UPI ID (e.g. name@upi).');
            }}
          >
            <Text style={styles.verifyBtnText}>Verify</Text>
          </Pressable>
        </View>
        {upiVerified ? <Text style={styles.successText}>UPI ID verified</Text> : null}

        <Button
          title={`Pay ${amount > 0 ? formatCurrency(amount) : 'Now'}`}
          onPress={onPay}
          disabled={disabled}
          style={{ marginTop: spacing.md }}
        />
      </View>
    );
  }

  if (payment === 'card') {
    return (
      <View style={styles.payPanel}>
        <View style={styles.cardHead}>
          <Text style={styles.payPanelTitle}>Credit / Debit Card</Text>
          <Text style={styles.brands}>VISA · MC · RuPay</Text>
        </View>
        <TextField
          label="Card Number"
          value={card.number}
          onChangeText={(number) => setCard((c) => ({ ...c, number }))}
          placeholder="1234 5678 9012 3456"
          keyboardType="number-pad"
        />
        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <TextField
              label="Expiry"
              value={card.expiry}
              onChangeText={(expiry) => setCard((c) => ({ ...c, expiry }))}
              placeholder="MM/YY"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="CVV"
              value={card.cvv}
              onChangeText={(cvv) => setCard((c) => ({ ...c, cvv }))}
              placeholder="•••"
              secureTextEntry
              keyboardType="number-pad"
            />
          </View>
        </View>
        <TextField
          label="Card Holder Name"
          value={card.name}
          onChangeText={(name) => setCard((c) => ({ ...c, name }))}
          placeholder="Name on card"
          autoCapitalize="words"
        />
        <Button
          title={`Pay ${amount > 0 ? formatCurrency(amount) : 'Now'}`}
          onPress={onPay}
          disabled={disabled}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    );
  }

  if (payment === 'netbanking') {
    return (
      <View style={styles.payPanel}>
        <Text style={styles.payPanelTitle}>Net Banking</Text>
        <Text style={styles.payPanelSub}>Select your bank to continue</Text>
        <View style={styles.chipRow}>
          {POPULAR_BANKS.map((b) => {
            const selected = bank === b.id;
            return (
              <Pressable
                key={b.id}
                onPress={() => setBank(b.id)}
                style={[styles.softChip, selected && styles.softChipActive]}
              >
                <Text style={[styles.softChipText, selected && styles.softChipTextActive]}>
                  {b.short}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Button
          title={`Pay ${amount > 0 ? formatCurrency(amount) : 'Now'}`}
          onPress={onPay}
          disabled={disabled || !bank}
          style={{ marginTop: spacing.md }}
        />
      </View>
    );
  }

  if (payment === 'wallet') {
    return (
      <View style={styles.payPanel}>
        <Text style={styles.payPanelTitle}>Wallet</Text>
        <Text style={styles.payPanelSub}>Choose a wallet to complete payment</Text>
        <View style={styles.methodList}>
          {WALLET_OPTIONS.map((w) => {
            const selected = wallet === w.id;
            return (
              <Pressable
                key={w.id}
                onPress={() => setWallet(w.id)}
                style={[styles.methodRow, selected && styles.methodRowActive]}
              >
                <Text style={styles.methodRowText}>{w.label}</Text>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primaryHover} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
        <Button
          title={`Pay ${amount > 0 ? formatCurrency(amount) : 'Now'}`}
          onPress={onPay}
          disabled={disabled || !wallet}
          style={{ marginTop: spacing.md }}
        />
      </View>
    );
  }

  return null;
}

export default function DonateMoneyScreen() {
  const navigation = useNavigation();
  const { currentUser, addDonation } = useAuth();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('General Donation');
  const [payment, setPayment] = useState(null);
  const [purposeOpen, setPurposeOpen] = useState(false);

  const numericAmount = Number(amount) || 0;
  const isCheckout = payment !== null;

  const paymentLabel = useMemo(
    () => getPaymentLabel(payment, DONOR_PAYMENT_METHODS),
    [payment]
  );

  const submitDonation = () => {
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Give Away', 'Enter a valid amount.');
      return;
    }
    if (!payment) {
      Alert.alert('Give Away', 'Select a payment method.');
      return;
    }

    addDonation({
      id: `don-${Date.now()}`,
      donor: currentUser?.name,
      donorEmail: currentUser?.email,
      type: 'Financial',
      amount: numericAmount,
      fund: purpose,
      purpose,
      details: `${formatCurrency(amount)} donation for ${purpose}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      paymentMethod: payment,
    });

    Alert.alert(
      'Thank you',
      'Donation submitted! Thank you for supporting AJA Abayahastham.',
      [{ text: 'OK', onPress: () => navigation.navigate('DonateHub') }]
    );
    setAmount('');
    setPayment(null);
    setPurpose('General Donation');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
        <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
        <Text style={styles.backText}>Donate</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.title}>Donate Money</Text>
        <Text style={styles.subtitle}>
          Support AJA Abayahastham programs with a secure financial contribution.
        </Text>
      </View>

      <Card style={styles.ajaNote}>
        <Text style={styles.ajaNoteText}>
          Contributions are routed through AJA and allocated to verified needs.
        </Text>
      </Card>

      <Card>
        {!isCheckout ? (
          <View style={styles.formHead}>
            <Text style={styles.formTitle}>Make a Donation</Text>
            <Text style={styles.formSub}>Choose an amount and payment method to continue securely.</Text>
          </View>
        ) : null}

        <FieldLabel>Select Amount</FieldLabel>
        <View style={styles.amountGrid}>
          {DONOR_MONEY_PRESETS.map((preset) => {
            const selected = numericAmount === preset;
            return (
              <Pressable
                key={preset}
                onPress={() => setAmount(String(preset))}
                style={[styles.amountChip, selected && styles.amountChipActive]}
              >
                <Text style={[styles.amountChipText, selected && styles.amountChipTextActive]}>
                  ₹{preset.toLocaleString('en-IN')}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FieldLabel>Custom Amount</FieldLabel>
        <View style={styles.customWrap}>
          <Text style={styles.prefix}>₹</Text>
          <TextInput
            style={styles.customInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
        </View>

        <FieldLabel>Purpose</FieldLabel>
        <Pressable style={styles.select} onPress={() => setPurposeOpen(true)}>
          <Text style={styles.selectText}>{purpose}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </Pressable>

        <FieldLabel>Payment Method</FieldLabel>
        <View style={styles.payGrid}>
          {DONOR_PAYMENT_METHODS.map((method) => {
            const selected = payment === method.id;
            return (
              <Pressable
                key={method.id}
                onPress={() => setPayment(method.id)}
                style={[styles.payOpt, selected && styles.payOptActive]}
              >
                <Ionicons
                  name={method.icon}
                  size={20}
                  color={selected ? colors.primaryHover : colors.textSecondary}
                />
                <Text style={[styles.payOptText, selected && styles.payOptTextActive]}>
                  {method.label}
                </Text>
                {selected ? (
                  <Ionicons name="checkmark" size={14} color={colors.primaryHover} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {isCheckout ? (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Donation Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Amount</Text>
              <Text style={styles.summaryVal}>
                {numericAmount > 0 ? formatCurrency(numericAmount) : '—'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Purpose</Text>
              <Text style={styles.summaryVal}>{purpose}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Payment</Text>
              <Text style={styles.summaryVal}>{paymentLabel}</Text>
            </View>
          </View>
        ) : null}
      </Card>

      {isCheckout ? (
        <Card>
          <PaymentPanel
            payment={payment}
            amount={numericAmount}
            onPay={submitDonation}
            disabled={!numericAmount}
          />
        </Card>
      ) : null}

      <View style={styles.trust}>
        <View style={styles.trustBadge}>
          <Ionicons name="lock-closed" size={14} color={colors.primaryHover} />
          <Text style={styles.trustBadgeText}>Secure payment powered by AJA Abayahastham</Text>
        </View>
        <Text style={styles.trustMsg}>100% of your donation goes toward helping beneficiaries.</Text>
        <View style={styles.trustRow}>
          {['Secure', 'Encrypted', 'Trusted'].map((t) => (
            <View key={t} style={styles.trustPill}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primaryHover} />
              <Text style={styles.trustPillText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <BottomSheet visible={purposeOpen} onClose={() => setPurposeOpen(false)} title="Purpose">
        {DONOR_PURPOSES.map((p) => {
          const selected = purpose === p;
          return (
            <Pressable
              key={p}
              style={[styles.optionRow, selected && styles.optionRowSelected]}
              onPress={() => {
                setPurpose(p);
                setPurposeOpen(false);
              }}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{p}</Text>
              {selected ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.primaryHover} />
              ) : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  hero: { gap: 6 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  ajaNote: {
    backgroundColor: colors.blueSoft,
    borderColor: '#BFDBFE',
    paddingVertical: spacing.sm + 2,
  },
  ajaNoteText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.blue,
    fontWeight: '500',
  },
  formHead: { marginBottom: spacing.md, gap: 4 },
  formTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  formSub: { fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  fieldLabel: {
    ...typography.label,
    marginBottom: 8,
    marginTop: spacing.sm,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amountChip: {
    minWidth: '47%',
    flexGrow: 1,
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  amountChipText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  amountChipTextActive: {
    color: colors.primaryHover,
  },
  customWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginRight: 6,
  },
  customInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 10,
  },
  select: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  payGrid: { gap: spacing.sm },
  payOpt: {
    minHeight: 52,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  payOptActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  payOptText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  payOptTextActive: {
    color: colors.primaryHover,
  },
  summary: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryKey: { fontSize: 13, color: colors.textSecondary },
  summaryVal: { fontSize: 13, fontWeight: '700', color: colors.text },
  payPanel: { gap: spacing.sm },
  payPanelTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  payPanelSub: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  qrBox: {
    minHeight: 140,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrHint: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  appsLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  softChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  softChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  softChipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  softChipTextActive: { color: colors.primaryHover },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  orLine: { flex: 1, height: 1, backgroundColor: colors.borderSoft },
  orText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  input: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
    fontSize: 15,
    color: colors.text,
  },
  upiRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  verifyBtn: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  verifyBtnText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  successText: { fontSize: 12, fontWeight: '600', color: colors.primaryDeep },
  cardHead: { gap: 4, marginBottom: 4 },
  brands: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  row2: { flexDirection: 'row', gap: spacing.sm },
  methodList: { gap: spacing.sm },
  methodRow: {
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  methodRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  methodRowText: { fontSize: 14, fontWeight: '600', color: colors.text },
  trust: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDeep,
  },
  trustMsg: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  trustRow: { flexDirection: 'row', gap: spacing.sm },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  trustPillText: { fontSize: 11, fontWeight: '700', color: colors.primaryDeep },
  optionRow: {
    minHeight: 48,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  optionRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionText: { fontSize: 14, fontWeight: '600', color: colors.text },
  optionTextSelected: { color: colors.primaryHover },
});
