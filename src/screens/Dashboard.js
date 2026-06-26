import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays, Lightbulb, Plus, Target, TrendingDown, TrendingUp } from 'lucide-react-native';

import AddTransactionModal from '../components/AddTransactionModal';
import AppLayout from '../components/AppLayout';
import PrimaryButton from '../components/PrimaryButton';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import { pibbleTips, savingsGoals, summary, transactions, upcomingBills } from '../data/mockData';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const mainGoal = savingsGoals[0];
  const nextBill = upcomingBills[0];
  const tip = pibbleTips[0];
  const goalProgress = Math.round((mainGoal.saved / mainGoal.target) * 100);

  const totals = useMemo(() => {
    const extraIncome = localTransactions
      .filter((transaction) => transaction.id.startsWith('local') && transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
    const extraExpenses = localTransactions
      .filter((transaction) => transaction.id.startsWith('local') && transaction.type === 'expense')
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

    return {
      income: summary.income + extraIncome,
      expenses: summary.expenses + extraExpenses,
      totalBalance: summary.totalBalance + extraIncome - extraExpenses
    };
  }, [localTransactions]);

  useEffect(() => {
    if (!noticeVisible) {
      return undefined;
    }

    const timeout = globalThis.setTimeout(() => setNoticeVisible(false), 2200);
    return () => globalThis.clearTimeout(timeout);
  }, [noticeVisible]);

  const addTransaction = (transaction) => {
    setLocalTransactions((current) => [transaction, ...current]);
    setModalVisible(false);
    setNoticeVisible(true);
  };

  return (
    <AppLayout>
      {noticeVisible ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>Transação adicionada ao mock.</Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Juliana👋</Text>
          <Text style={styles.subtitle}>Aqui está seu resumo financeiro.</Text>
        </View>
        <Image source={require('../assets/logoPibble.png')} style={styles.avatar} />
      </View>

      <LinearGradient
        colors={[colors.purple, colors.purpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>Saldo total</Text>
        <Text style={styles.balanceValue}>{formatCurrency(totals.totalBalance)}</Text>
        <View style={styles.balanceFooter}>
          <Text style={styles.balanceFooterText}>+12% vs. mês anterior</Text>
          <Text style={styles.balanceFooterText}>Junho</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <StatCard
          accent={colors.success}
          icon={TrendingUp}
          label="Receitas"
          value={formatCurrency(totals.income)}
        />
        <StatCard
          accent={colors.danger}
          icon={TrendingDown}
          label="Despesas"
          value={formatCurrency(totals.expenses)}
        />
      </View>

      <View style={styles.insightsGrid}>
        <View style={styles.insightCard}>
          <View style={[styles.insightIcon, { backgroundColor: `${colors.peach}66` }]}>
            <CalendarDays size={20} color={colors.purpleDark} />
          </View>
          <Text style={styles.insightLabel}>Próximo vencimento</Text>
          <Text style={styles.insightTitle}>{nextBill.title}</Text>
          <Text style={styles.insightMeta}>
            {nextBill.dueDate} • {formatCurrency(nextBill.amount)}
          </Text>
        </View>

        <View style={styles.insightCard}>
          <View style={[styles.insightIcon, { backgroundColor: `${colors.mint}66` }]}>
            <Target size={20} color={colors.success} />
          </View>
          <Text style={styles.insightLabel}>Meta principal</Text>
          <Text style={styles.insightTitle}>{mainGoal.title}</Text>
          <Text style={styles.insightMeta}>{goalProgress}% concluído</Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Lightbulb size={20} color={colors.purple} />
        </View>
        <View style={styles.tipContent}>
          <Text style={styles.tipLabel}>Dica do Pibble</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      </View>

      <View style={styles.monthCard}>
        <View>
          <Text style={styles.sectionTitle}>Resumo do mês</Text>
          <Text style={styles.mutedText}>Você usou {summary.monthGoal}% do orçamento previsto.</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${summary.monthGoal}%` }]} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transações recentes</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.link}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsCard}>
        {localTransactions.slice(0, 5).map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </View>

      <PrimaryButton
        title="Nova transação"
        icon={Plus}
        onPress={() => setModalVisible(true)}
        style={styles.newButton}
      />

      <AddTransactionModal
        onAdd={addTransaction}
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22
  },
  notice: {
    alignSelf: 'center',
    backgroundColor: colors.text,
    borderRadius: 999,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  noticeText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '800'
  },
  greeting: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4
  },
  avatar: {
    height: 48,
    width: 48
  },
  balanceCard: {
    borderRadius: 28,
    marginBottom: 18,
    padding: 22,
    shadowColor: colors.purpleDark,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8
  },
  balanceLabel: {
    color: '#E8E4FF',
    fontSize: 14,
    fontWeight: '700'
  },
  balanceValue: {
    color: colors.card,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 10
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  balanceFooterText: {
    color: '#E8E4FF',
    fontSize: 13,
    fontWeight: '800'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    flex: 1,
    padding: 16
  },
  insightIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
    width: 40
  },
  insightLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  insightTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  insightMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5
  },
  tipCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
    padding: 16
  },
  tipIcon: {
    alignItems: 'center',
    backgroundColor: colors.softPurple,
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  tipContent: {
    flex: 1
  },
  tipLabel: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4
  },
  tipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19
  },
  monthCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    gap: 16,
    marginBottom: 22,
    padding: 18
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  mutedText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4
  },
  progressTrack: {
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 10,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: colors.mint,
    borderRadius: 999,
    height: 10
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  link: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900'
  },
  transactionsCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingHorizontal: 16
  },
  newButton: {
    marginTop: 20
  }
});
