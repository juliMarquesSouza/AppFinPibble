import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PiggyBank, Plus, Target } from 'lucide-react-native';

import AppLayout from '../components/AppLayout';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import ScreenTopBar from '../components/ScreenTopBar';
import { createGoal, deleteGoal, getGoals, updateGoal } from '../services/goalsService';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

function getGoalProgress(goal) {
  if (!goal || !goal.target) {
    return 0;
  }

  return Math.min(Math.round((goal.saved / goal.target) * 100), 100);
}

function getGoalMessage(goal) {
  const progress = getGoalProgress(goal);

  if (!goal) {
    return {
      title: 'Vamos começar',
      text: 'Crie uma meta para o Pibble acompanhar seu progresso com você.'
    };
  }

  if (progress >= 100) {
    return {
      title: 'Meta concluída',
      text: `${goal.title} chegou a 100%. Hora de comemorar e planejar o próximo passo.`
    };
  }

  if (progress >= 75) {
    return {
      title: 'Está quase lá',
      text: `${goal.title} já está com ${progress}% de conclusão. Falta pouco.`
    };
  }

  if (progress >= 50) {
    return {
      title: 'Continue assim',
      text: `${goal.title} passou da metade: ${progress}% concluído.`
    };
  }

  if (progress > 0) {
    return {
      title: 'Bom começo',
      text: `${goal.title} está com ${progress}% de progresso. Pequenos aportes constroem o caminho.`
    };
  }

  return {
    title: 'Primeiro passo',
    text: `${goal.title} ainda está em 0%. Guarde um valor inicial para tirar a meta do papel.`
  };
}

export default function Savings({ navigation }) {
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [target, setTarget] = useState('');
  const [title, setTitle] = useState('');
  const mainGoal = goals[0] || null;
  const heroMessage = getGoalMessage(mainGoal);

  const loadGoals = async () => {
    try {
      setLoadingGoals(true);
      const apiGoals = await getGoals();
      setGoals(apiGoals.length ? apiGoals : []);
    } catch {
      setGoals([]);
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const resetForm = () => {
    setSaved('');
    setTarget('');
    setTitle('');
  };

  const addGoal = async () => {
    try {
      setSaving(true);
      const goal = await createGoal({
        title,
        saved: Number(saved.replace(',', '.') || 0),
        target: Number(target.replace(',', '.')),
        color: colors.mint
      });

      setGoals((current) => [goal, ...current]);
      resetForm();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Não foi possível criar a meta', error.message);
    } finally {
      setSaving(false);
    }
  };

  const addToGoal = async (goal) => {
    try {
      const updatedGoal = await updateGoal(goal.id, {
        saved: Math.min(goal.saved + 100, goal.target)
      });

      setGoals((current) => current.map((item) => (item.id === goal.id ? updatedGoal : item)));
    } catch (error) {
      Alert.alert('Não foi possível atualizar', error.message);
    }
  };

  const removeGoal = (goal) => {
    Alert.alert('Remover meta', `Deseja remover ${goal.title}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGoal(goal.id);
            setGoals((current) => current.filter((item) => item.id !== goal.id));
          } catch (error) {
            Alert.alert('Não foi possível remover', error.message);
          }
        }
      }
    ]);
  };

  return (
    <AppLayout>
      <ScreenTopBar navigation={navigation} />

      <View style={styles.header}>
        <Text style={styles.title}>Metas</Text>
        <Text style={styles.subtitle}>Acompanhe seus objetivos e veja onde o dinheiro está chegando.</Text>
      </View>

      <View style={styles.hero}>
        <Image source={require('../assets/mascotePibble.png')} style={styles.heroMascot} />
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>{heroMessage.title}</Text>
          <Text style={styles.heroText}>{heroMessage.text}</Text>
        </View>
      </View>

      <View style={styles.list}>
        {loadingGoals ? (
          <ActivityIndicator color={colors.purple} style={styles.loader} />
        ) : goals.length ? goals.map((goal) => {
          const progress = getGoalProgress(goal);

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={goal.id}
              onLongPress={() => removeGoal(goal)}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: `${goal.color}66` }]}>
                  {goal.id === 'emergency' ? (
                    <PiggyBank size={26} color={colors.purple} />
                  ) : (
                    <Target size={26} color={colors.purple} />
                  )}
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>{progress}%</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{goal.title}</Text>
              <Text style={styles.cardText}>
                {formatCurrency(goal.saved)} de {formatCurrency(goal.target)} guardados
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={() => addToGoal(goal)}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Guardar +R$100</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }) : (
          <Text style={styles.emptyText}>Nenhuma meta criada ainda.</Text>
        )}
      </View>

      <PrimaryButton
        title="Criar meta"
        icon={Plus}
        onPress={() => setModalVisible(true)}
        style={styles.button}
      />

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nova meta</Text>
            <View style={styles.modalForm}>
              <Input label="Título" onChangeText={setTitle} placeholder="Nome da meta" value={title} />
              <Input
                keyboardType="decimal-pad"
                label="Guardado"
                onChangeText={setSaved}
                placeholder="0,00"
                value={saved}
              />
              <Input
                keyboardType="decimal-pad"
                label="Meta"
                onChangeText={setTarget}
                placeholder="4500,00"
                value={target}
              />
            </View>
            <PrimaryButton
              disabled={!title || !target}
              loading={saving}
              onPress={addGoal}
              title="Salvar meta"
            />
            <TouchableOpacity
              activeOpacity={0.72}
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  hero: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 22,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
    padding: 16
  },
  heroMascot: {
    height: 84,
    resizeMode: 'contain',
    width: 84
  },
  heroCopy: {
    flex: 1
  },
  heroTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  heroText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 4
  },
  list: {
    gap: 14
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    gap: 12,
    padding: 20
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52
  },
  progressBadge: {
    backgroundColor: colors.softPurple,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  progressBadgeText: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900'
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  cardText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700'
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
  saveButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softPurple,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  saveButtonText: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: '900'
  },
  button: {
    marginTop: 20
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
  modalBackdrop: {
    backgroundColor: 'rgba(31, 41, 55, 0.36)',
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16
  },
  modalForm: {
    gap: 14,
    marginBottom: 18
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4
  },
  cancelText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800'
  }
});
