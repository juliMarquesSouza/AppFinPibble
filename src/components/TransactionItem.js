import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

export default function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
  const accent = isIncome ? colors.success : colors.danger;

  return (
    <View style={styles.item}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}20` }]}>
        <Icon size={20} color={accent} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.meta}>{transaction.category} • {transaction.account}</Text>
      </View>
      <View style={styles.side}>
        <Text style={[styles.amount, { color: accent }]}>
          {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  info: {
    flex: 1,
    gap: 4
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600'
  },
  side: {
    alignItems: 'flex-end',
    gap: 4
  },
  amount: {
    fontSize: 14,
    fontWeight: '900'
  },
  date: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600'
  }
});
