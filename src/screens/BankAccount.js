import { useEffect, useState } from 'react';
import { Banknote, FileText, Send, Wallet } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AppLayout from '../components/AppLayout';
import ScreenTopBar from '../components/ScreenTopBar';
import TransactionItem from '../components/TransactionItem';
import { getTransactions } from '../services/transactionsService';
import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';
import { formatCurrency, formatTransactionDate } from '../utils/formatters';

const actions = [
  { label: 'Pix', icon: Send, color: colors.purple },
  { label: 'Transferir', icon: Banknote, color: colors.success },
  { label: 'Depositar', icon: Wallet, color: colors.blue },
  { label: 'Extrato', icon: FileText, color: colors.peach }
];

export default function BankAccount({ navigation, route }) {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;
  const account =
    route.params?.account ||
    {
      id: route.params?.accountId,
      name: 'Conta',
      type: 'Conta financeira',
      balance: 0,
      color: colors.purple
    };
  const [accountTransactions, setAccountTransactions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      try {
        const apiTransactions = await getTransactions();

        if (!isMounted) {
          return;
        }

        setAccountTransactions(
          apiTransactions
            .filter((transaction) => transaction.accountId === account.id)
            .map((transaction) => ({
              id: String(transaction.id),
              title: transaction.description,
              category: transaction.category,
              account: transaction.account?.name || account.name,
              amount: transaction.amount,
              type: transaction.type,
              date: formatTransactionDate(transaction.date, {
                day: '2-digit',
                month: 'short'
              })
            }))
        );
      } catch {
        if (isMounted) {
          setAccountTransactions([]);
        }
      }
    }

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, [account.id, account.name]);

  return (
    <AppLayout>
      <ScreenTopBar navigation={navigation} showMenu />

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
            <TouchableOpacity activeOpacity={0.84} key={action.label} style={[styles.action, isDark && styles.darkAction]}>
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}25` }]}>
                <Icon size={20} color={action.color} />
              </View>
              <Text style={[styles.actionText, isDark && styles.darkText]}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Histórico da conta</Text>
      <View style={[styles.historyCard, isDark && styles.darkHistoryCard]}>
        {accountTransactions.length ? (
          accountTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text style={[styles.emptyText, isDark && styles.darkMuted]}>Nenhuma transação registrada nesta conta.</Text>
        )}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
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
  darkAction: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
    borderWidth: 1
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
  darkText: {
    color: colors.dark.text
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
  },
  darkHistoryCard: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
    borderWidth: 1
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 18,
    textAlign: 'center'
  }
  ,
  darkMuted: {
    color: colors.dark.muted
  }
});
