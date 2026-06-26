import { ArrowLeft, Banknote, FileText, Send, Wallet } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AppLayout from '../components/AppLayout';
import TransactionItem from '../components/TransactionItem';
import { accounts, transactions } from '../data/mockData';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

const actions = [
  { label: 'Pix', icon: Send, color: colors.purple },
  { label: 'Transferir', icon: Banknote, color: colors.success },
  { label: 'Depositar', icon: Wallet, color: colors.blue },
  { label: 'Extrato', icon: FileText, color: colors.peach }
];

export default function BankAccount({ navigation, route }) {
  const account =
    route.params?.account ||
    accounts.find((item) => item.id === route.params?.accountId) ||
    accounts[0];
  const accountTransactions = transactions.filter(
    (transaction) => transaction.account === account.name || account.id === 'nubank'
  );

  return (
    <AppLayout>
      <TouchableOpacity activeOpacity={0.82} onPress={() => navigation.goBack()} style={styles.backButton}>
        <ArrowLeft size={20} color={colors.text} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <LinearGradient
        colors={[account.color, colors.purpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.accountHero}
      >
        <Text style={styles.heroMeta}>{account.type}</Text>
        <Text style={styles.heroTitle}>{account.name}</Text>
        <Text style={styles.heroLabel}>Saldo atual</Text>
        <Text style={styles.heroBalance}>{formatCurrency(account.balance)}</Text>
      </LinearGradient>

      <View style={styles.shortcuts}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <TouchableOpacity activeOpacity={0.84} key={action.label} style={styles.action}>
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}25` }]}>
                <Icon size={20} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Histórico da conta</Text>
      <View style={styles.historyCard}>
        {accountTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    paddingVertical: 6
  },
  backText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  accountHero: {
    borderRadius: 28,
    marginBottom: 18,
    padding: 22
  },
  heroMeta: {
    color: '#F4F1FF',
    fontSize: 13,
    fontWeight: '800'
  },
  heroTitle: {
    color: colors.card,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 8
  },
  heroLabel: {
    color: '#F4F1FF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 28
  },
  heroBalance: {
    color: colors.card,
    fontSize: 33,
    fontWeight: '900',
    marginTop: 6
  },
  shortcuts: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24
  },
  action: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    minHeight: 92,
    paddingHorizontal: 6
  },
  actionIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 38,
    justifyContent: 'center',
    width: 38
  },
  actionText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center'
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingHorizontal: 16
  }
});
