import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Landmark, Palette, PiggyBank, Wallet, WalletCards } from 'lucide-react-native';

import { colors } from '../theme/colors';
import Input from './Input';
import PrimaryButton from './PrimaryButton';

const accountTypes = [
  { label: 'Banco', value: 'bank', icon: Landmark },
  { label: 'Carteira', value: 'wallet', icon: Wallet },
  { label: 'Investimentos', value: 'investment', icon: PiggyBank },
  { label: 'Crédito', value: 'credit', icon: WalletCards }
];

const accountColors = ['#7C3AED', '#35B979', '#2563EB', '#EF6F7A', '#F59E0B'];

export default function AddAccountModal({ loading, onClose, onSubmit, visible }) {
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(accountColors[0]);
  const [name, setName] = useState('');
  const [type, setType] = useState(accountTypes[0].value);

  const canSubmit = name.trim() && balance.trim();

  const submit = async () => {
    const parsedBalance = Number(balance.replace(',', '.'));

    if (!canSubmit || Number.isNaN(parsedBalance)) {
      return;
    }

    const selectedType = accountTypes.find((item) => item.value === type) || accountTypes[0];

    await onSubmit({
      name: name.trim(),
      type,
      balance: parsedBalance,
      color,
      icon: selectedType.value === 'bank' ? 'bank' : selectedType.value
    });

    setBalance('');
    setColor(accountColors[0]);
    setName('');
    setType(accountTypes[0].value);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Nova conta</Text>
              <Text style={styles.subtitle}>Conecte uma conta à API local.</Text>
            </View>
            <TouchableOpacity activeOpacity={0.72} onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Input label="Nome" onChangeText={setName} placeholder="Nome da conta" value={name} />
            <Input
              keyboardType="decimal-pad"
              label="Saldo inicial"
              onChangeText={setBalance}
              placeholder="Saldo inicial"
              value={balance}
            />
          </View>

          <View style={styles.pickSection}>
            <Text style={styles.pickLabel}>Tipo</Text>
            <View style={styles.chips}>
              {accountTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <TouchableOpacity
                    activeOpacity={0.82}
                    key={item.value}
                    onPress={() => setType(item.value)}
                    style={[styles.chip, type === item.value && styles.chipActive]}
                  >
                    <Icon size={16} color={type === item.value ? colors.purple : colors.muted} />
                    <Text style={[styles.chipText, type === item.value && styles.chipTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.pickSection}>
            <Text style={styles.pickLabel}>Cor</Text>
            <View style={styles.swatches}>
              {accountColors.map((item) => (
                <TouchableOpacity
                  activeOpacity={0.82}
                  key={item}
                  onPress={() => setColor(item)}
                  style={[
                    styles.swatchButton,
                    color === item && styles.swatchButtonActive,
                    { borderColor: item }
                  ]}
                >
                  <View style={[styles.swatch, { backgroundColor: item }]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.colorHint}>
            <Palette size={18} color={colors.purple} />
            <Text style={styles.colorHintText}>A cor escolhida aparece no cartão da conta.</Text>
          </View>

          <PrimaryButton
            disabled={!canSubmit}
            loading={loading}
            onPress={submit}
            title="Criar conta"
          />
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
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 13,
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
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  swatchButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  swatchButtonActive: {
    borderWidth: 3
  },
  swatch: {
    borderRadius: 999,
    height: 24,
    width: 24
  },
  colorHint: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    marginTop: 18,
    padding: 14
  },
  colorHintText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700'
  }
});
