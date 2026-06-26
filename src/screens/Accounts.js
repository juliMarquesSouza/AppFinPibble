import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Landmark, PiggyBank, Plus, Wallet, WalletCards } from 'lucide-react-native';

import AddAccountModal from '../components/AddAccountModal';
import AccountCard from '../components/AccountCard';
import AppLayout from '../components/AppLayout';
import PrimaryButton from '../components/PrimaryButton';
import { accounts } from '../data/mockData';
import { createAccount } from '../services/accountsApi';
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

export default function Accounts({ navigation }) {
  const [accountList, setAccountList] = useState(accounts);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addAccount = async (data) => {
    try {
      setIsCreating(true);
      const createdAccount = await createAccount(data);
      setAccountList((currentAccounts) => [...currentAccounts, normalizeAccount(createdAccount)]);
      setIsModalVisible(false);
    } catch {
      Alert.alert('Não foi possível criar a conta', 'Confira se a API local está rodando em http://localhost:3333.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Contas</Text>
        <Text style={styles.subtitle}>Bancos, carteira, investimentos e crédito em uma visão.</Text>
      </View>

      <View style={styles.list}>
        {accountList.map((account) => (
          <AccountCard
            account={account}
            icon={iconByType[account.type]}
            key={account.id}
            onPress={() => navigation.navigate('BankAccount', { account, accountId: account.id })}
          />
        ))}
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
  list: {
    gap: 14
  },
  button: {
    marginTop: 22
  }
});
