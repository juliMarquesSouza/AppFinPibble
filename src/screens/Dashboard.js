import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays, Lightbulb, Pencil, Plus, Target, Trash2, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

import AddTransactionModal from '../components/AddTransactionModal';
import AppLayout from '../components/AppLayout';
import PrimaryButton from '../components/PrimaryButton';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import UserMenu from '../components/UserMenu';
import { getStoredUser } from '../services/apiClient';
import { getDashboardSummary } from '../services/dashboardService';
import { createTransaction, deleteTransaction, updateTransaction } from '../services/transactionsService';
import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

const emptySummary = {
  totalBalance: 0,
  income: 0,
  expenses: 0,
  monthGoal: 0
};

function getPibbleTip({ accounts, expenses, income, mainGoal, transactionCount }) {
  if (!accounts.length) {
    return 'Crie sua primeira conta para começar a acompanhar saldo, receitas e despesas.';
  }

  if (!transactionCount) {
    return 'Registre uma receita ou despesa para o Pibble montar seu resumo do mês.';
  }

  if (income > 0 && expenses > income) {
    return 'Suas despesas passaram das receitas neste mês. Revise categorias maiores antes do próximo lançamento.';
  }

  if (income > 0 && expenses / income >= 0.8) {
    return 'Você já usou boa parte das receitas do mês. Vale segurar gastos variáveis por alguns dias.';
  }

  if (mainGoal) {
    const progress = mainGoal.target ? Math.min(Math.round((mainGoal.saved / mainGoal.target) * 100), 100) : 0;

    if (progress >= 75 && progress < 100) {
      return `Sua meta ${mainGoal.title} está com ${progress}%. Um aporte final pode acelerar a conclusão.`;
    }

    if (progress >= 100) {
      return `Sua meta ${mainGoal.title} chegou a 100%. Pense no próximo objetivo financeiro.`;
    }
  }

  if (income > expenses) {
    return 'Você está fechando o mês com sobra. Separar uma parte agora ajuda suas metas a avançarem.';
  }

  return 'Mantenha seus lançamentos em dia para o Pibble identificar padrões melhores no seu dinheiro.';
}

export default function Dashboard({ navigation }) {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionsVisible, setTransactionsVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeText, setNoticeText] = useState('Transação adicionada!');
  const [noticeId, setNoticeId] = useState(0);
  const [savingTransaction, setSavingTransaction] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [localTransactions, setLocalTransactions] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [userName, setUserName] = useState('');
  const noticeProgress = useRef(new Animated.Value(0)).current;
  const mainGoal = dashboardSummary?.mainGoal || dashboardSummary?.goals?.[0] || null;
  const goalProgress = mainGoal ? Math.round((mainGoal.saved / mainGoal.target) * 100) : 0;
  const dashboardAccounts = dashboardSummary?.accounts || [];
  const currentSummary = dashboardSummary || emptySummary;

  const totals = useMemo(() => {
    if (dashboardSummary) {
      return {
        income: dashboardSummary.income,
        expenses: dashboardSummary.expenses,
        totalBalance: dashboardSummary.totalBalance
      };
    }

    return emptySummary;
  }, [dashboardSummary, localTransactions]);
  const pibbleTip = getPibbleTip({
    accounts: dashboardAccounts,
    expenses: totals.expenses,
    income: totals.income,
    mainGoal,
    transactionCount: localTransactions.length
  });

  const showNotice = useCallback((message) => {
    setNoticeText(message.endsWith('!') ? message : `${message}!`);
    setNoticeVisible(true);
    setNoticeId((current) => current + 1);
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const data = await getDashboardSummary();
      setDashboardSummary(data);
      setLocalTransactions(data.transactions.map((transaction) => ({
        id: String(transaction.id),
        accountId: transaction.accountId,
        title: transaction.description,
        description: transaction.description,
        category: transaction.category,
        account: transaction.account?.name || 'Conta',
        amount: transaction.amount,
        rawDate: transaction.date,
        type: transaction.type,
        date: new Date(transaction.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      })));
    } catch {
      setDashboardSummary(null);
      setLocalTransactions([]);
      showNotice('Não foi possível carregar seus dados reais. Entre novamente se a sessão expirou!');
    } finally {
      setLoadingDashboard(false);
    }
  }, [showNotice]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  useEffect(() => {
    async function loadUser() {
      const user = await getStoredUser();
      setUserName(user?.name || '');
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (!noticeVisible) {
      return undefined;
    }

    noticeProgress.setValue(0);
    Animated.timing(noticeProgress, {
      duration: 220,
      toValue: 1,
      useNativeDriver: true
    }).start();

    const timeout = globalThis.setTimeout(() => {
      Animated.timing(noticeProgress, {
        duration: 220,
        toValue: 0,
        useNativeDriver: true
      }).start(() => setNoticeVisible(false));
    }, 2300);

    return () => globalThis.clearTimeout(timeout);
  }, [noticeId, noticeProgress, noticeVisible]);

  const saveTransaction = async (transaction) => {
    try {
      setSavingTransaction(true);
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transaction);
      } else {
        await createTransaction(transaction);
      }
      await loadDashboard();
      setModalVisible(false);
      setEditingTransaction(null);
      showNotice(editingTransaction ? 'Transação editada com sucesso!' : 'Nova transação adicionada!');
    } catch (error) {
      Alert.alert('Não foi possível salvar', error.message);
      throw error;
    } finally {
      setSavingTransaction(false);
    }
  };

  const openTransactionModal = async () => {
    if (loadingDashboard) {
      await loadDashboard();
    }

    if (!dashboardAccounts.length) {
      showNotice('Crie uma conta antes de adicionar transações!');
      return;
    }

    setModalVisible(true);
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionsVisible(false);
    setModalVisible(true);
  };

  const removeTransaction = async () => {
    if (!transactionToDelete) {
      return;
    }

    try {
      await deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      setTransactionsVisible(false);
      await loadDashboard();
      showNotice('Transação apagada com sucesso!');
    } catch (error) {
      Alert.alert('Não foi possível apagar', error.message);
    }
  };

  const toastTranslateY = noticeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 0]
  });

  return (
    <AppLayout
      overlay={
        noticeVisible ? (
          <Animated.View
            style={[
              styles.notice,
              {
                opacity: noticeProgress,
                transform: [{ translateY: toastTranslateY }]
              }
            ]}
          >
            <Text style={styles.noticeText}>{noticeText}</Text>
          </Animated.View>
        ) : null
      }
    >
      <View style={styles.header}>
        <View style={styles.greetingBlock}>
          <View style={styles.greetingRow}>
            <Image source={require('../assets/saudacaoPibble.png')} style={styles.greetingIcon} />
            <Text style={[styles.greeting, isDark && styles.darkText]}>Olá{userName ? `, ${userName}` : ''}!</Text>
          </View>
          <Text style={[styles.subtitle, isDark && styles.darkMuted]}>Aqui está seu resumo financeiro.</Text>
        </View>
        <UserMenu
          navigation={navigation}
          onClose={() => setMenuVisible(false)}
          onOpen={() => setMenuVisible(true)}
          visible={menuVisible}
        />
      </View>

      <LinearGradient
        colors={isDark ? ['#A58BFF', '#6C4DFF', '#2B1B65'] : [colors.purple, colors.purpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.balanceCard, isDark && styles.darkBalanceCard]}
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
          tone="income"
          value={formatCurrency(totals.income)}
        />
        <StatCard
          accent={colors.danger}
          icon={TrendingDown}
          label="Despesas"
          tone="expense"
          value={formatCurrency(totals.expenses)}
        />
      </View>

      <View style={styles.insightsGrid}>
        <View style={[styles.insightCard, isDark && styles.darkDueCard]}>
          <View style={[styles.insightIcon, { backgroundColor: isDark ? 'rgba(255,193,7,.18)' : `${colors.peach}66` }]}>
            <CalendarDays size={20} color={isDark ? '#FFC84D' : colors.purpleDark} />
          </View>
          <Text style={[styles.insightLabel, isDark && { color: colors.dark.dueText }]}>Próximo vencimento</Text>
          <Text style={[styles.insightTitle, isDark && styles.darkText]}>Sem vencimentos</Text>
          <Text style={[styles.insightMeta, isDark && styles.darkMuted]}>Adicione transações para acompanhar</Text>
        </View>

        <View style={[styles.insightCard, isDark && styles.darkGoalCard]}>
          <View style={[styles.insightIcon, { backgroundColor: isDark ? 'rgba(38,166,154,.18)' : `${colors.mint}66` }]}>
            <Target size={20} color={isDark ? '#35D0C3' : colors.success} />
          </View>
          <Text style={[styles.insightLabel, isDark && { color: '#8DEDE2' }]}>Meta principal</Text>
          <Text style={[styles.insightTitle, isDark && styles.darkText]}>{mainGoal?.title || 'Nenhuma meta criada'}</Text>
          <Text style={[styles.insightMeta, isDark && styles.darkMuted]}>{goalProgress}% concluído</Text>
        </View>
      </View>

      <View style={[styles.tipCard, isDark && styles.darkTipCard]}>
        <View style={[styles.tipIcon, isDark && { backgroundColor: 'rgba(124,92,255,.20)' }]}>
          <Lightbulb size={20} color={isDark ? '#BFAEFF' : colors.purple} />
        </View>
        <View style={styles.tipContent}>
          <Text style={[styles.tipLabel, isDark && { color: '#CDBDFF' }]}>Dica do Pibble</Text>
          <Text style={[styles.tipText, isDark && styles.darkText]}>{pibbleTip}</Text>
        </View>
      </View>

      <View style={[styles.monthCard, isDark && styles.darkMonthCard]}>
        <View>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Resumo do mês</Text>
          <Text style={[styles.mutedText, isDark && styles.darkMuted]}>Você usou {currentSummary.monthGoal}% do orçamento previsto.</Text>
        </View>
        <View style={[styles.progressTrack, isDark && styles.darkProgressTrack]}>
          {isDark ? (
            <LinearGradient
              colors={['#7C5CFF', '#CDBDFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${currentSummary.monthGoal}%` }]}
            />
          ) : (
            <View style={[styles.progressFill, { width: `${currentSummary.monthGoal}%` }]} />
          )}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Transações recentes</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setTransactionsVisible(true)}>
          <Text style={styles.link}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.transactionsCard, isDark && styles.darkTransactionsCard]}>
        {loadingDashboard ? (
          <ActivityIndicator color={colors.purple} style={styles.loader} />
        ) : localTransactions.length ? (
          localTransactions.slice(0, 5).map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma transação registrada.</Text>
        )}
      </View>

      <PrimaryButton
        title="Nova transação"
        icon={Plus}
        onPress={openTransactionModal}
        style={styles.newButton}
      />

      <AddTransactionModal
        accounts={dashboardAccounts}
        editingTransaction={editingTransaction}
        loading={savingTransaction}
        onAdd={saveTransaction}
        onClose={() => {
          setEditingTransaction(null);
          setModalVisible(false);
        }}
        visible={modalVisible}
      />

      <Modal animationType="slide" transparent visible={transactionsVisible} onRequestClose={() => setTransactionsVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.transactionsSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Transações</Text>
              <TouchableOpacity activeOpacity={0.72} onPress={() => setTransactionsVisible(false)}>
                <Text style={styles.link}>Fechar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {localTransactions.length ? localTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionRow}>
                  <View style={styles.transactionInfo}>
                    <TransactionItem transaction={transaction} />
                  </View>
                  <View style={styles.transactionActions}>
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => editTransaction(transaction)}
                      style={styles.iconButton}
                    >
                      <Pencil size={17} color={colors.purple} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => setTransactionToDelete(transaction)}
                      style={styles.iconButton}
                    >
                      <Trash2 size={17} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              )) : (
                <Text style={styles.emptyText}>Nenhuma transação registrada.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={Boolean(transactionToDelete)}
        onRequestClose={() => setTransactionToDelete(null)}
      >
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Apagar transação?</Text>
            <Text style={styles.confirmText}>
              {transactionToDelete?.title} será removida e o saldo da conta será atualizado.
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={() => setTransactionToDelete(null)}
                style={styles.cancelAction}
              >
                <Text style={styles.cancelActionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={removeTransaction}
                style={styles.deleteAction}
              >
                <Text style={styles.deleteActionText}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  greetingBlock: {
    flex: 1,
    paddingRight: 12
  },
  greetingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  greetingIcon: {
    height: 34,
    resizeMode: 'contain',
    width: 34
  },
  notice: {
    backgroundColor: colors.purple,
    borderLeftColor: colors.purpleDark,
    borderLeftWidth: 5,
    borderRadius: 10,
    maxWidth: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: colors.purpleDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4
  },
  noticeText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '800'
  },
  greeting: {
    color: colors.text,
    flex: 1,
    fontSize: 26,
    fontWeight: '900'
  },
  darkText: {
    color: colors.dark.text
  },
  darkMuted: {
    color: colors.dark.muted
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4
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
  darkBalanceCard: {
    borderColor: 'rgba(205,189,255,.24)',
    borderWidth: 1,
    shadowColor: '#8D6CFF',
    shadowOpacity: 0.34,
    shadowRadius: 30
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
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
    flex: 1,
    padding: 18,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3
  },
  darkDueCard: {
    backgroundColor: colors.dark.dueCard,
    borderColor: colors.dark.dueBorder,
    shadowColor: '#FFC107',
    shadowOpacity: 0.12
  },
  darkGoalCard: {
    backgroundColor: colors.dark.goalCard,
    borderColor: colors.dark.goalBorder,
    shadowColor: '#26A69A',
    shadowOpacity: 0.12
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
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 18
  },
  darkTipCard: {
    backgroundColor: colors.dark.tipCard,
    borderColor: colors.dark.tipBorder,
    shadowColor: '#8D6CFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 5
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
  darkMonthCard: {
    backgroundColor: colors.dark.monthCard,
    borderColor: 'rgba(124,92,255,.24)',
    borderWidth: 1,
    shadowColor: '#8D6CFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18
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
  darkProgressTrack: {
    backgroundColor: 'rgba(205,189,255,.14)'
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
  darkTransactionsCard: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
    borderWidth: 1
  },
  loader: {
    paddingVertical: 18
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 18,
    textAlign: 'center'
  },
  newButton: {
    marginTop: 20
  },
  modalBackdrop: {
    backgroundColor: 'rgba(31, 41, 55, 0.36)',
    flex: 1,
    justifyContent: 'flex-end'
  },
  transactionsSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '84%',
    padding: 18
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900'
  },
  transactionRow: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  transactionInfo: {
    flex: 1
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 8
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.softPurple,
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  confirmBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.36)',
    flex: 1,
    justifyContent: 'center',
    padding: 22
  },
  confirmCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    width: '100%',
    maxWidth: 340
  },
  confirmTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  confirmText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 8
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 18
  },
  cancelAction: {
    backgroundColor: colors.softPurple,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  cancelActionText: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900'
  },
  deleteAction: {
    backgroundColor: '#FAD2DA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  deleteActionText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '900'
  }
});
