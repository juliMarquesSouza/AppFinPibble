import { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarDays, Coins, Tag } from 'lucide-react-native';

import { colors } from '../theme/colors';
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

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function isoToBrazilDate(value) {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.slice(0, 10).split('-');
  return day && month && year ? `${day}/${month}/${year}` : value;
}

function brazilDateToIso(value) {
  if (!value) {
    return todayInputValue();
  }

  if (value.includes('-')) {
    return value.slice(0, 10);
  }

  const [day, month, year] = value.split('/');
  return day && month && year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : value;
}

export default function AddTransactionModal({
  accounts = [],
  editingTransaction,
  loading = false,
  onAdd,
  onClose,
  visible
}) {
  const [accountId, setAccountId] = useState(accounts[0]?.id);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(isoToBrazilDate(todayInputValue()));
  const [title, setTitle] = useState('');
  const [type, setType] = useState('income');
  const canSubmit = title && amount && accountId;

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

    if (!canSubmit || Number.isNaN(parsedAmount)) {
      return;
    }

    await onAdd({
      description: title,
      title,
      category,
      accountId,
      amount: Math.abs(parsedAmount),
      date: brazilDateToIso(date),
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
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.handle} />
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{editingTransaction ? 'Editar transação' : 'Nova transação'}</Text>
                <Text style={styles.subtitle}>Adicione ou ajuste um lançamento do seu resumo.</Text>
              </View>
              <TouchableOpacity activeOpacity={0.72} onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.segmented}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => setType('income')}
                style={[styles.segment, styles.incomeSegment, type === 'income' && styles.incomeSegmentActive]}
              >
                <Text style={[styles.segmentText, styles.incomeSegmentText, type === 'income' && styles.segmentTextActive]}>
                  Receita
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => setType('expense')}
                style={[styles.segment, styles.expenseSegment, type === 'expense' && styles.expenseSegmentActive]}
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
                <Text style={styles.dateLabel}>Data</Text>
                <View style={styles.dateField}>
                  <CalendarDays size={20} color={colors.muted} />
                  <TextInput
                    keyboardType="numeric"
                    onChangeText={(value) => setDate(Platform.OS === 'web' ? isoToBrazilDate(value) : value)}
                    placeholder="11/12/2005"
                    placeholderTextColor={colors.muted}
                    style={styles.dateInput}
                    type={Platform.OS === 'web' ? 'date' : undefined}
                    value={Platform.OS === 'web' ? brazilDateToIso(date) : date}
                  />
                </View>
              </View>
            </View>

            <View style={styles.pickSection}>
              <Text style={styles.pickLabel}>Categoria</Text>
              <View style={styles.chips}>
                {categories.map((item) => (
                  <TouchableOpacity
                    activeOpacity={0.82}
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[styles.chip, category === item && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, category === item && styles.chipTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.pickSection}>
              <Text style={styles.pickLabel}>
                {type === 'income' ? 'Conta de destino' : 'Conta de origem'}
              </Text>
              <View style={styles.chips}>
                {accounts.map((item) => (
                  <TouchableOpacity
                    activeOpacity={0.82}
                    key={item.id}
                    onPress={() => setAccountId(item.id)}
                    style={[styles.chip, accountId === item.id && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, accountId === item.id && styles.chipTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!accounts.length ? (
                <Text style={styles.emptyText}>Crie uma conta antes de adicionar transações.</Text>
              ) : null}
            </View>

            <View style={styles.dateHint}>
              <CalendarDays size={18} color={colors.purple} />
              <Text style={styles.dateHintText}>O saldo da conta será atualizado ao salvar.</Text>
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
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%'
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
  incomeSegmentActive: {
    backgroundColor: '#CFF3DE'
  },
  expenseSegment: {
    backgroundColor: '#FDECEF'
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
  dateInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    outlineStyle: 'none'
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
  chipActive: {
    backgroundColor: colors.softPurple,
    borderColor: colors.purple
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
  dateHintText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700'
  }
});
