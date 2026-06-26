import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PiggyBank, Plus, Target } from 'lucide-react-native';

import AppLayout from '../components/AppLayout';
import PrimaryButton from '../components/PrimaryButton';
import { savingsGoals } from '../data/mockData';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

export default function Savings() {
  const [goals, setGoals] = useState(savingsGoals);

  const addMockGoal = () => {
    if (goals.some((goal) => goal.id === 'notebook')) {
      return;
    }

    setGoals((current) => [
      ...current,
      {
        id: 'notebook',
        title: 'Notebook novo',
        saved: 900,
        target: 4500,
        color: colors.peach
      }
    ]);
  };

  return (
    <AppLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Metas</Text>
        <Text style={styles.subtitle}>Acompanhe seus objetivos e veja onde o dinheiro está chegando.</Text>
      </View>

      <View style={styles.hero}>
        <Image source={require('../assets/mascotePibble.png')} style={styles.heroMascot} />
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Continue assim</Text>
          <Text style={styles.heroText}>Sua reserva principal já passou da metade.</Text>
        </View>
      </View>

      <View style={styles.list}>
        {goals.map((goal) => {
          const progress = Math.round((goal.saved / goal.target) * 100);

          return (
            <View key={goal.id} style={styles.card}>
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
            </View>
          );
        })}
      </View>

      <PrimaryButton
        title="Criar meta mockada"
        icon={Plus}
        onPress={addMockGoal}
        style={styles.button}
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
  button: {
    marginTop: 20
  }
});
