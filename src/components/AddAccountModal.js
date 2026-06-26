import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Landmark, Palette } from 'lucide-react-native';

import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';
import Input from './Input';
import PrimaryButton from './PrimaryButton';

const accountColors = ['#7C3AED', '#35B979', '#2563EB', '#EF6F7A', '#F59E0B'];

export default function AddAccountModal({ loading, onClose, onSubmit, visible }) {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(accountColors[0]);
  const [name, setName] = useState('');

  const canSubmit = name.trim() && balance.trim();

  const submit = async () => {
    const parsedBalance = Number(balance.replace(',', '.'));

    if (!canSubmit || Number.isNaN(parsedBalance)) {
      Alert.alert('Dados incompletos', 'Informe o nome do banco e um saldo inicial válido.');
      return;
    }

    await onSubmit({
      name: name.trim(),
      type: 'bank',
      balance: parsedBalance,
      color,
      icon: 'bank'
    });

    setBalance('');
    setColor(accountColors[0]);
    setName('');
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={[styles.backdrop, isDark && styles.darkBackdrop]}>
        <View style={[styles.sheet, isDark && styles.darkSheet]}>
          <View style={[styles.handle, isDark && styles.darkHandle]} />
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, isDark && styles.darkText]}>Nova conta</Text>
              <Text style={[styles.subtitle, isDark && styles.darkMuted]}>Adicione um banco à sua visão financeira.</Text>
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

          <View style={[styles.bankTypeHint, isDark && styles.darkHint]}>
            <Landmark size={18} color={colors.purple} />
            <Text style={[styles.colorHintText, isDark && styles.darkMuted]}>Tipo de conta: Banco</Text>
          </View>

          <View style={styles.pickSection}>
            <Text style={[styles.pickLabel, isDark && styles.darkText]}>Cor</Text>
            <View style={styles.swatches}>
              {accountColors.map((item) => (
                <TouchableOpacity
                  activeOpacity={0.82}
                  key={item}
                  onPress={() => setColor(item)}
                  style={[
                    styles.swatchButton,
                    color === item && styles.swatchButtonActive,
                    { borderColor: item },
                    isDark && styles.darkSwatchButton
                  ]}
                >
                  <View style={[styles.swatch, { backgroundColor: item }]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.colorHint, isDark && styles.darkHint]}>
            <Palette size={18} color={colors.purple} />
            <Text style={[styles.colorHintText, isDark && styles.darkMuted]}>A cor escolhida aparece no cartão da conta.</Text>
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
  darkBackdrop: {
    backgroundColor: 'rgba(8, 6, 18, 0.70)'
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    padding: 22
  },
  darkSheet: {
    backgroundColor: colors.dark.background,
    borderColor: colors.dark.border,
    borderWidth: 1
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
  form: {
    gap: 14
  },
  bankTypeHint: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    padding: 14
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
  darkSwatchButton: {
    backgroundColor: colors.dark.surface
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
  darkHint: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
    borderWidth: 1
  },
  colorHintText: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '700'
  }
});
