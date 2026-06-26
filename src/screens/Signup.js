import { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LockKeyhole, Mail, PiggyBank, Sparkles, Target, User } from 'lucide-react-native';

import AnimatedMascot from '../components/AnimatedMascot';
import AppLayout from '../components/AppLayout';
import FadeInView from '../components/FadeInView';
import Input from '../components/Input';
import PremiumBackground from '../components/PremiumBackground';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const goals = [
  { id: 'organize', label: 'Organizar gastos', icon: Sparkles },
  { id: 'save', label: 'Guardar dinheiro', icon: PiggyBank },
  { id: 'goal', label: 'Bater uma meta', icon: Target }
];

export default function Signup({ navigation }) {
  const [goal, setGoal] = useState('organize');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);
  const canSubmit = name && email && password;

  const finishSignup = () => {
    setSuccessVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <AppLayout contentStyle={styles.container}>
      <PremiumBackground />

      <View style={styles.content}>
        <AnimatedMascot delay={80} size={132} style={styles.mascot} />

        <FadeInView delay={260} style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Monte seu FinPibble com dados mocados por enquanto.</Text>
        </FadeInView>

        <View style={styles.form}>
          <FadeInView delay={420}>
            <Input
              icon={User}
              label="Nome"
              onChangeText={setName}
              placeholder="Juliana"
              value={name}
            />
          </FadeInView>
          <FadeInView delay={540}>
            <Input
              icon={Mail}
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="juliana@email.com"
              value={email}
            />
          </FadeInView>
          <FadeInView delay={660}>
            <Input
              icon={LockKeyhole}
              label="Senha"
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              secureTextEntry
              value={password}
            />
          </FadeInView>
        </View>

        <FadeInView delay={780} style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Seu primeiro objetivo</Text>
          <View style={styles.goalGrid}>
            {goals.map((item) => {
              const Icon = item.icon;
              const selected = goal === item.id;

              return (
                <TouchableOpacity
                  activeOpacity={0.82}
                  key={item.id}
                  onPress={() => setGoal(item.id)}
                  style={[styles.goalCard, selected && styles.goalCardActive]}
                >
                  <Icon size={20} color={selected ? colors.purple : colors.muted} />
                  <Text style={[styles.goalText, selected && styles.goalTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FadeInView>

        <FadeInView delay={900}>
          <PrimaryButton
            disabled={!canSubmit}
            title="Começar"
            onPress={() => setSuccessVisible(true)}
          />
        </FadeInView>

        <FadeInView delay={1020} style={styles.loginRow}>
          <Text style={styles.loginText}>Já possui conta?</Text>
          <TouchableOpacity activeOpacity={0.72} onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Entrar</Text>
          </TouchableOpacity>
        </FadeInView>
      </View>

      <Modal animationType="fade" transparent visible={successVisible} onRequestClose={finishSignup}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Image source={require('../assets/mascotePibble.png')} style={styles.successMascot} />
            <Text style={styles.modalTitle}>Conta criada</Text>
            <Text style={styles.modalText}>
              O Pibble já preparou um dashboard inicial com exemplos para você explorar.
            </Text>
            <PrimaryButton title="Ir para o app" onPress={finishSignup} />
          </View>
        </View>
      </Modal>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingBottom: 34,
    paddingTop: 30
  },
  content: {
    alignSelf: 'center',
    maxWidth: 390,
    width: '100%'
  },
  mascot: {
    alignSelf: 'center',
    marginBottom: 14
  },
  header: {
    alignItems: 'center',
    marginBottom: 26
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center'
  },
  form: {
    gap: 14
  },
  goalSection: {
    marginBottom: 22,
    marginTop: 24
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10
  },
  goalGrid: {
    gap: 10
  },
  goalCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16
  },
  goalCardActive: {
    backgroundColor: colors.softPurple,
    borderColor: colors.purple
  },
  goalText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800'
  },
  goalTextActive: {
    color: colors.purple
  },
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 22
  },
  loginText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600'
  },
  loginLink: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '900'
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.36)',
    flex: 1,
    justifyContent: 'center',
    padding: 22
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    maxWidth: 380,
    padding: 22,
    width: '100%'
  },
  successMascot: {
    alignSelf: 'center',
    height: 150,
    marginBottom: 12,
    resizeMode: 'contain',
    width: 150
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center'
  },
  modalText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 18,
    marginTop: 8,
    textAlign: 'center'
  }
});
