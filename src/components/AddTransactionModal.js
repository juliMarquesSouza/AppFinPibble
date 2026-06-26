import { useEffect, useRef, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarDays, Coins, Tag } from 'lucide-react-native';

import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';
import { brazilDateToIso, isoToBrazilDate, todayInputValue } from '../utils/formatters';
import Input from './Input';
import PrimaryButton from './PrimaryButton';

const categories = [
  'Casa',
  'Mercado',
  'Transporte',
  'Lazer',
  'Saúde',
  'Receita',
  'Investimentos'
];

export default function AddTransactionModal({
  accounts = [],
  editingTransaction,
  loading = false,
  onAdd,
  onClose,
  visible
}) {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;
  const dateInputRef = useRef(null);
  const [accountId, setAccountId] = useState(accounts[0]?.id);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(isoToBrazilDate(todayInputValue()));
  const [title, setTitle] = useState('');
  const [type, setType] = useState('income');
  const canSubmit = title.trim() && amount.trim() && accountId;

  useEffect(() => {
    if (accounts.length && !accounts.some((account) => account.id === accountId)) {
      setAccountId(accounts[0].id);
    }
  }, [accountId, accounts]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (editingTransaction) {
      setAccountId(editingTransaction.accountId);
      setAmount(String(Math.abs(editingTransaction.amount)).replace('.', ','));
      setCategory(editingTransaction.category || categories[0]);
      setDate(isoToBrazilDate(editingTransaction.rawDate || editingTransaction.date));
      setTitle(editingTransaction.title || editingTransaction.description || '');
      setType(editingTransaction.type || 'income');
      return;
    }

    setAccountId(accounts[0]?.id);
    setAmount('');
    setCategory(categories[0]);
    setDate(isoToBrazilDate(todayInputValue()));
    setTitle('');
    setType('income');
  }, [accounts, editingTransaction, visible]);

  const submit = async () => {
    const parsedAmount = Number(amount.replace(',', '.'));
    const isoDate = brazilDateToIso(date);

    if (!canSubmit || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Dados incompletos', 'Informe descrição, valor maior que zero e conta.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
      Alert.alert('Data inválida', 'Informe a data no formato dia/mês/ano.');
      return;
    }

    await onAdd({
      description: title.trim(),
      title: title.trim(),
      category,
      accountId,
      amount: Math.abs(parsedAmount),
      date: isoDate,
      type
    });

    setAmount('');
    setTitle('');
    setType('income');
    setCategory(categories[0]);
    setDate(isoToBrazilDate(todayInputValue()));
    setAccountId(accounts[0]?.id);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={[styles.backdrop, isDark && styles.darkBackdrop]}>
        <View style={[styles.sheet, isDark && styles.darkSheet]}>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.handle, isDark && styles.darkHandle]} />
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, isDark && styles.darkText]}>{editingTransaction ? 'Editar transação' : 'Nova transação'}</Text>
                <Text style={[styles.subtitle, isDark && styles.darkMuted]}>Adicione ou ajuste um lançamento do seu resumo.</Text>
              </View>
              <TouchableOpacity activeOpacity={0.72} onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.segmented, isDark && styles.darkSegmented]}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => setType('income')}
                style={[styles.segment, styles.incomeSegment, isDark && styles.darkIncomeSegment, type === 'income' && styles.incomeSegmentActive]}
              >
                <Text style={[styles.segmentText, styles.incomeSegmentText, type === 'income' && styles.segmentTextActive]}>
                  Receita
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => setType('expense')}
                style={[styles.segment, styles.expenseSegment, isDark && styles.darkExpenseSegment, type === 'expense' && styles.expenseSegmentActive]}
              >
                <Text style={[styles.segmentText, styles.expenseSegmentText, type === 'expense' && styles.segmentTextActive]}>
                  Despesa
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Input
                icon={Tag}
                label="Descrição"
                onChangeText={setTitle}
                placeholder="Descrição da transação"
                value={title}
              />
              <Input
                icon={Coins}
                keyboardType="decimal-pad"
                label="Valor"
                onChangeText={setAmount}
                placeholder="Valor da transação"
                value={amount}
              />
              <View style={styles.dateWrapper}>
                <Text style={[styles.dateLabel, isDark && styles.darkText]}>Data</Text>
                <View style={[styles.dateField, isDark && styles.darkField]}>
                  <TouchableOpacity
                    activeOpacity={0.72}
                    accessibilityRole="button"
                    accessibilityLabel="Escolher data"
                    onPress={() => {
                      dateInputRef.current?.focus?.();
                      dateInputRef.current?.showPicker?.();
                    }}
                    style={styles.dateIconButton}
                  >
                    <CalendarDays size={20} color={isDark ? colors.dark.muted : colors.muted} />
                  </TouchableOpacity>
                  <TextInput
                    ref={dateInputRef}
                    keyboardType="numeric"
                    onChangeText={(value) => setDate(Platform.OS === 'web' ? isoToBrazilDate(value) : value)}
                    placeholder="11/12/2005"
                    placeholderTextColor={isDark ? colors.dark.muted : colors.muted}
                    style={[styles.dateInput, isDark && styles.darkInput]}
                    type={Platform.OS === 'web' ? 'date' : undefined}
                    value={Platform.OS === 'web' ? brazilDateToIso(date) : date}
                  />
                </View>
              </View>
            </View>

            <View style={styles.pickSection}>
              <Text style={[styles.pickLabel, isDark && styles.darkText]}>Categoria</Text>
              <View style={styles.chips}>
                {categories.map((item) => (
                  <TouchableOpacity
                    activeOpacity={0.82}
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[styles.chip, isDark && styles.darkChip, category === item && styles.chipActive, isDark && category === item && styles.darkChipActive]}
                  >
                    <Text style={[styles.chipText, isDark && styles.darkMuted, category === item && styles.chipTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.pickSection}>
              <Text style={[styles.pickLabel, isDark && styles.darkText]}>
                {type === 'income' ? 'Conta de destino' : 'Conta de origem'}
              </Text>
              <View style={styles.chips}>
                {accounts.map((item) => (
                  <TouchableOpacity
                    activeOpacity={0.82}
                    key={item.id}
                    onPress={() => setAccountId(item.id)}
                    style={[styles.chip, isDark && styles.darkChip, accountId === item.id && styles.chipActive, isDark && accountId === item.id && styles.darkChipActive]}
                  >
                    <Text style={[styles.chipText, isDark && styles.darkMuted, accountId === item.id && styles.chipTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!accounts.length ? (
                <Text style={[styles.emptyText, isDark && styles.darkMuted]}>Crie uma conta antes de adicionar transações.</Text>
              ) : null}
            </View>

            <View style={[styles.dateHint, isDark && styles.darkHint]}>
              <CalendarDays size={18} color={colors.purple} />
              <Text style={[styles.dateHintText, isDark && styles.darkMuted]}>O saldo da conta será atualizado ao salvar.</Text>
            </View>

            <PrimaryButton
              disabled={!canSubmit || !accounts.length}
              loading={loading}
              title={editingTransaction ? 'Salvar edição' : 'Adicionar'}
              onPress={submit}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(31, 41, 55, 0.36)',
    flex: 1,
    justifyContent: 'flex-end'
  },
  darkBackdrop: {
    backgroundColor: 'rgba(8, 6, 18, 0.70)'
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%'
  },
  darkSheet: {
    backgroundColor: colors.dark.background,
    borderColor: colors.dark.border,
    borderWidth: 1
  },
  sheetContent: {
    padding: 22
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 5,
    marginBottom: 18,
    width: 54
  },
  darkHandle: {
    backgroundColor: colors.dark.border
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4
  },
  darkText: {
    color: colors.dark.text
  },
  darkMuted: {
    color: colors.dark.muted
  },
  closeButton: {
    paddingLeft: 12,
    paddingVertical: 4
  },
  closeText: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900'
  },
  segmented: {
    backgroundColor: colors.card,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    padding: 6
  },
  darkSegmented: {
    backgroundColor: colors.dark.surface
  },
  segment: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center'
  },
  segmentActive: {
    backgroundColor: colors.softPurple
  },
  incomeSegment: {
    backgroundColor: '#E8F8EF'
  },
  darkIncomeSegment: {
    backgroundColor: colors.dark.incomeCard
  },
  incomeSegmentActive: {
    backgroundColor: '#CFF3DE'
  },
  expenseSegment: {
    backgroundColor: '#FDECEF'
  },
  darkExpenseSegment: {
    backgroundColor: colors.dark.expenseCard
  },
  expenseSegmentActive: {
    backgroundColor: '#FAD2DA'
  },
  segmentText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900'
  },
  incomeSegmentText: {
    color: colors.success
  },
  expenseSegmentText: {
    color: colors.danger
  },
  segmentTextActive: {
    color: colors.purple
  },
  form: {
    gap: 14
  },
  dateWrapper: {
    gap: 8
  },
  dateLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  dateField: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: '#ECECEC',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 18
  },
  darkField: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border
  },
  dateIconButton: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34
  },
  dateInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    outlineStyle: 'none'
  },
  darkInput: {
    color: colors.dark.text
  },
  pickSection: {
    marginTop: 16
  },
  pickLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  darkChip: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border
  },
  chipActive: {
    backgroundColor: colors.softPurple,
    borderColor: colors.purple
  },
  darkChipActive: {
    backgroundColor: colors.dark.tipCard,
    borderColor: colors.dark.purpleGlow
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800'
  },
  chipTextActive: {
    color: colors.purple
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8
  },
  dateHint: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    marginTop: 18,
    padding: 14
  },
  darkHint: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
    borderWidth: 1
  },
  dateHintText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700'
  }
});
