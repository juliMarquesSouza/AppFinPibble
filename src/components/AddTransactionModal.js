import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalendarDays, Coins, Tag } from 'lucide-react-native';

import { accounts, categories } from '../data/mockData';
import { colors } from '../theme/colors';
import Input from './Input';
import PrimaryButton from './PrimaryButton';

export default function AddTransactionModal({ onAdd, onClose, visible }) {
  const [account, setAccount] = useState(accounts[0].name);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense');
  const canSubmit = title && amount;

  const submit = () => {
    const parsedAmount = Number(amount.replace(',', '.'));

    if (!canSubmit || Number.isNaN(parsedAmount)) {
      return;
    }

    onAdd({
      id: `local-${Date.now()}`,
      title,
      category,
      account,
      amount: type === 'income' ? Math.abs(parsedAmount) : -Math.abs(parsedAmount),
      type,
      date: 'Agora'
    });

    setAmount('');
    setTitle('');
    setType('expense');
    setCategory(categories[0]);
    setAccount(accounts[0].name);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Nova transação</Text>
              <Text style={styles.subtitle}>Adicione um lançamento mockado ao resumo.</Text>
            </View>
            <TouchableOpacity activeOpacity={0.72} onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.segmented}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setType('expense')}
              style={[styles.segment, type === 'expense' && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, type === 'expense' && styles.segmentTextActive]}>
                Despesa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setType('income')}
              style={[styles.segment, type === 'income' && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, type === 'income' && styles.segmentTextActive]}>
                Receita
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Input
              icon={Tag}
              label="Descrição"
              onChangeText={setTitle}
              placeholder="Mercado, salário..."
              value={title}
            />
            <Input
              icon={Coins}
              keyboardType="decimal-pad"
              label="Valor"
              onChangeText={setAmount}
              placeholder="0,00"
              value={amount}
            />
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
            <Text style={styles.pickLabel}>Conta</Text>
            <View style={styles.chips}>
              {accounts.slice(0, 3).map((item) => (
                <TouchableOpacity
                  activeOpacity={0.82}
                  key={item.id}
                  onPress={() => setAccount(item.name)}
                  style={[styles.chip, account === item.name && styles.chipActive]}
                >
                  <Text style={[styles.chipText, account === item.name && styles.chipTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dateHint}>
            <CalendarDays size={18} color={colors.purple} />
            <Text style={styles.dateHintText}>Data definida como agora para o mock.</Text>
          </View>

          <PrimaryButton disabled={!canSubmit} title="Adicionar" onPress={submit} />
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
    maxHeight: '92%',
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
  segmentText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900'
  },
  segmentTextActive: {
    color: colors.purple
  },
  form: {
    gap: 14
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
