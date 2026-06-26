import { StyleSheet, Text, View } from 'react-native';

import AnimatedMascot from '../components/AnimatedMascot';
import AppLayout from '../components/AppLayout';
import FadeInView from '../components/FadeInView';
import PremiumBackground from '../components/PremiumBackground';
import PrimaryButton from '../components/PrimaryButton';
import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';

export default function Welcome({ navigation }) {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;

  return (
    <AppLayout scroll={false} contentStyle={styles.container}>
      <PremiumBackground />

      <View style={styles.content}>
        <AnimatedMascot delay={120} size={204} style={styles.mascot} />

        <View style={styles.copy}>
          <FadeInView delay={560}>
            <Text style={[styles.eyebrow, isDark && styles.darkText]}>Bem-vindo ao</Text>
          </FadeInView>
          <FadeInView delay={720}>
            <Text style={styles.title}>FinPibble</Text>
          </FadeInView>
          <FadeInView delay={920}>
            <Text style={[styles.subtitle, isDark && styles.darkMuted]}>
              Organize suas finanças{'\n'}e construa seu patrimônio.
            </Text>
          </FadeInView>
        </View>

        <FadeInView delay={1180} style={styles.action}>
          <PrimaryButton title="Começar" onPress={() => navigation.navigate('Login')} />
        </FadeInView>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingBottom: 34,
    paddingTop: 34
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    maxWidth: 380,
    width: '100%'
  },
  mascot: {
    marginBottom: 30
  },
  copy: {
    alignItems: 'center',
    marginBottom: 48
  },
  eyebrow: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 24,
    textAlign: 'center'
  },
  darkText: {
    color: colors.dark.text
  },
  title: {
    color: colors.purple,
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 56,
    textAlign: 'center'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 27,
    marginTop: 12,
    textAlign: 'center'
  },
  darkMuted: {
    color: colors.dark.muted
  },
  action: {
    width: '100%'
  }
});
