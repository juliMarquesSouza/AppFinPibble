import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Landmark, PiggyBank, Plus, Wallet, WalletCards } from 'lucide-react-native';

import AddAccountModal from '../components/AddAccountModal';
import AccountCard from '../components/AccountCard';
import AppLayout from '../components/AppLayout';
import PrimaryButton from '../components/PrimaryButton';
import ScreenTopBar from '../components/ScreenTopBar';
import { createAccount, deleteAccount, getAccounts } from '../services/accountsApi';
import { colors } from '../theme/colors';

const iconByType = {
  'Conta bancária': Landmark,
  bank: Landmark,
  Carteira: Wallet,
  wallet: Wallet,
  Investimentos: PiggyBank,
  investment: PiggyBank,
  'Cartão de crédito': WalletCards,
  credit: WalletCards
};

const readableType = {
  bank: 'Conta bancária',
  wallet: 'Carteira',
  investment: 'Investimentos',
  credit: 'Cartão de crédito'
};

function normalizeAccount(account) {
  const accountData = account.account || account;
  const type = readableType[accountData.type] || accountData.type || 'Conta bancária';

  return {
    ...accountData,
    id: accountData.id || `local-${Date.now()}`,
    institution: accountData.institution || 'API local',
    type,
    balance: Number(accountData.balance) || 0,
    color: accountData.color || colors.purple
  };
}

function normalizeAccounts(apiAccounts) {
  return apiAccounts.map((account) => normalizeAccount(account));
}

function isBankAccount(account) {
  return account.type === 'bank' || account.type === 'Conta bancária';
}

export default function Accounts({ navigation }) {
  const [accountList, setAccountList] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Sincronizando com a API local...');

  useEffect(() => {
    let isMounted = true;

    async function loadAccounts() {
      try {
        const apiAccounts = await getAccounts();

        if (!isMounted) {
          return;
        }

        const bankAccounts = normalizeAccounts(apiAccounts).filter(isBankAccount);

        setAccountList(bankAccounts);
        setStatusMessage(bankAccounts.length ? 'Bancos carregados da API local.' : 'Nenhum banco adicionado ainda.');
      } catch {
        if (isMounted) {
          setAccountList([]);
          setStatusMessage('Não foi possível carregar suas contas reais.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAccounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const addAccount = async (data) => {
    try {
      setIsCreating(true);
      const createdAccount = await createAccount(data);
      const normalizedAccount = normalizeAccount(createdAccount);

      if (isBankAccount(normalizedAccount)) {
        setAccountList((currentAccounts) => [...currentAccounts, normalizedAccount]);
      }

      setStatusMessage('Banco criado e salvo na API local.');
      setIsModalVisible(false);
    } catch {
      Alert.alert('Não foi possível criar a conta', 'Confira se a API local está rodando em http://localhost:3333.');
    } finally {
      setIsCreating(false);
    }
  };

  const removeAccount = (account) => {
    Alert.alert(
      'Remover conta',
      `Deseja remover ${account.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(account.id);
              setAccountList((currentAccounts) =>
                currentAccounts.filter((item) => item.id !== account.id)
              );
              setStatusMessage('Conta removida da API local.');
            } catch (error) {
              Alert.alert('Não foi possível remover', error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <AppLayout>
      <ScreenTopBar navigation={navigation} />

      <View style={styles.header}>
        <Text style={styles.title}>Contas</Text>
        <Text style={styles.subtitle}>Bancos adicionados à sua visão financeira.</Text>
        <Text style={styles.status}>{isLoading ? 'Carregando contas...' : statusMessage}</Text>
      </View>

      <View style={styles.list}>
        {isLoading ? (
          <ActivityIndicator color={colors.purple} style={styles.loader} />
        ) : accountList.length ? (
          accountList.map((account) => (
            <AccountCard
              account={account}
              icon={iconByType[account.type]}
              key={account.id}
              onLongPress={() => removeAccount(account)}
              onPress={() => navigation.navigate('BankAccount', { account, accountId: account.id })}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum banco adicionado ainda.</Text>
        )}
      </View>

      <PrimaryButton
        title="Adicionar conta"
        icon={Plus}
        onPress={() => setIsModalVisible(true)}
        style={styles.button}
      />

      <AddAccountModal
        loading={isCreating}
        onClose={() => setIsModalVisible(false)}
        onSubmit={addAccount}
        visible={isModalVisible}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 22
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22
  },
  status: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4
  },
  list: {
    gap: 14
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center'
  },
  loader: {
    paddingVertical: 18
  },
  button: {
    marginTop: 22
  }
});
