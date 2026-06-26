export const summary = {
  totalBalance: 12480.75,
  income: 7350,
  expenses: 2840.35,
  monthGoal: 68,
  weeklySpending: 742.4
};

export const categories = [
  'Casa',
  'Mercado',
  'Transporte',
  'Lazer',
  'Saúde',
  'Receita',
  'Investimentos'
];

export const upcomingBills = [
  {
    id: 'b1',
    title: 'Cartão Pibble',
    amount: 910,
    dueDate: '12 jul'
  },
  {
    id: 'b2',
    title: 'Internet',
    amount: 119.9,
    dueDate: '15 jul'
  }
];

export const pibbleTips = [
  'Seu gasto com assinaturas está estável. Bom momento para revisar o que ainda usa.',
  'Reservar uma parte da receita logo no início do mês ajuda a meta avançar sem esforço.',
  'Você ainda tem 32% do orçamento livre para fechar o mês com folga.'
];

export const savingsGoals = [
  {
    id: 'emergency',
    title: 'Reserva de emergência',
    saved: 7800,
    target: 12000,
    color: '#A7DCC3'
  },
  {
    id: 'trip',
    title: 'Viagem de férias',
    saved: 2200,
    target: 6000,
    color: '#B7C9F2'
  }
];

export const accounts = [
  {
    id: 'nubank',
    name: 'Conta Principal',
    institution: 'Banco Pibble',
    type: 'Conta bancária',
    balance: 8450.75,
    color: '#7C6AED'
  },
  {
    id: 'wallet',
    name: 'Carteira',
    institution: 'Dinheiro físico',
    type: 'Carteira',
    balance: 340,
    color: '#F5D9B5'
  },
  {
    id: 'investments',
    name: 'Investimentos',
    institution: 'Reserva e renda fixa',
    type: 'Investimentos',
    balance: 2780,
    color: '#A7DCC3'
  },
  {
    id: 'credit-card',
    name: 'Cartão Pibble',
    institution: 'Fechamento dia 12',
    type: 'Cartão de crédito',
    balance: -910,
    color: '#B7C9F2'
  }
];

export const transactions = [
  {
    id: 't1',
    title: 'Salário',
    category: 'Receita',
    account: 'Conta Principal',
    amount: 7350,
    type: 'income',
    date: 'Hoje'
  },
  {
    id: 't2',
    title: 'Mercado',
    category: 'Casa',
    account: 'Cartão Pibble',
    amount: -326.8,
    type: 'expense',
    date: 'Ontem'
  },
  {
    id: 't3',
    title: 'Pix recebido',
    category: 'Transferência',
    account: 'Conta Principal',
    amount: 280,
    type: 'income',
    date: '22 jun'
  },
  {
    id: 't4',
    title: 'Streaming',
    category: 'Assinaturas',
    account: 'Cartão Pibble',
    amount: -39.9,
    type: 'expense',
    date: '20 jun'
  },
  {
    id: 't5',
    title: 'Aporte mensal',
    category: 'Investimentos',
    account: 'Investimentos',
    amount: -600,
    type: 'expense',
    date: '18 jun'
  }
];
