import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

export default function AccountCard({ account, icon: Icon, onPress }) {
  const isNegative = account.balance < 0;
  const meta = account.institution ? `${account.type} • ${account.institution}` : account.type;

  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${account.color}24` }]}>
        {Icon ? <Icon size={22} color={account.color} /> : null}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{account.name}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <View style={styles.amountWrap}>
        <Text style={[styles.amount, isNegative && styles.negative]}>
          {formatCurrency(account.balance)}
        </Text>
        <ChevronRight size={18} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  info: {
    flex: 1,
    gap: 4
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900'
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600'
  },
  amountWrap: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 4
  },
  amount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  negative: {
    color: colors.danger
  }
});
