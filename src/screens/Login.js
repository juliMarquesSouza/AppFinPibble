import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LockKeyhole, Mail, Send } from 'lucide-react-native';

import AnimatedMascot from '../components/AnimatedMascot';
import AppLayout from '../components/AppLayout';
import FadeInView from '../components/FadeInView';
import Input from '../components/Input';
import PremiumBackground from '../components/PremiumBackground';
import PrimaryButton from '../components/PrimaryButton';
import { forgotPassword, login } from '../services/authService';
import { colors } from '../theme/colors';

const closedEyeMascot = require('../assets/pibbleOlhoFechado.png');
const peekingMascot = require('../assets/pibbleespiando.png');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [loadedMascots, setLoadedMascots] = useState(0);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordIconProgress = useRef(new Animated.Value(0)).current;
  const pawPulse = useRef(new Animated.Value(0)).current;
  const hasPassword = password.length > 0;
  const mascotsReady = loadedMascots >= 2;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pawPulse, {
          duration: 480,
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.timing(pawPulse, {
          duration: 480,
          toValue: 0,
          useNativeDriver: true
        })
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [pawPulse]);

  useEffect(() => {
    Animated.timing(passwordIconProgress, {
      duration: 220,
      toValue: showPassword ? 1 : 0,
      useNativeDriver: true
    }).start();
  }, [passwordIconProgress, showPassword]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login({ email, password });
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      if (error.message === 'Email não cadastrado') {
        navigation.navigate('Signup', { email });
        return;
      }

      Alert.alert('Não foi possível entrar', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    try {
      setLoading(true);
      await forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (error) {
      Alert.alert('Recuperação de senha', error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotSent(false);
  };

  const closedOpacity = passwordIconProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });
  const closedScale = passwordIconProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.86]
  });
  const peekingOpacity = passwordIconProgress;
  const peekingScale = passwordIconProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.86, 1]
  });
  const pawScale = pawPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08]
  });

  const handleMascotLoaded = () => {
    setLoadedMascots((current) => Math.min(current + 1, 2));
  };

  return (
    <AppLayout contentStyle={styles.container}>
      <PremiumBackground />
      <View style={styles.preloadMascots}>
        <Image source={closedEyeMascot} onLoadEnd={handleMascotLoaded} style={styles.preloadImage} />
        <Image source={peekingMascot} onLoadEnd={handleMascotLoaded} style={styles.preloadImage} />
      </View>

      <View style={styles.content}>
        <AnimatedMascot delay={80} size={190} style={styles.mascot} />

        <View style={styles.header}>
          <FadeInView delay={460}>
            <Text style={styles.eyebrow}>Bem-vindo ao</Text>
          </FadeInView>
          <FadeInView delay={620}>
            <Text style={styles.title}>FinPibble</Text>
          </FadeInView>
          <FadeInView delay={780}>
            <Text style={styles.subtitle}>
              Organize suas finanças{'\n'}e construa seu patrimônio.
            </Text>
          </FadeInView>
        </View>

        <View style={styles.form}>
          <FadeInView delay={980}>
            <Input
              icon={Mail}
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="email@exemplo.com"
              value={email}
            />
          </FadeInView>
          <FadeInView delay={1120}>
            <Input
              icon={LockKeyhole}
              label="Senha"
              onChangeText={(value) => {
                setPassword(value);
                if (!value) {
                  setShowPassword(false);
                }
              }}
              placeholder="Digite sua senha"
              rightElement={
                <TouchableOpacity
                  activeOpacity={0.78}
                  accessibilityRole="button"
                  disabled={!hasPassword}
                  onPress={() => setShowPassword((current) => !current)}
                  style={[
                    styles.passwordMascotButton,
                    !hasPassword && styles.passwordMascotButtonHidden
                  ]}
                >
                  {!mascotsReady ? (
                    <Animated.View style={[styles.pawLoader, { transform: [{ scale: pawScale }] }]}>
                      <View style={styles.pawPad} />
                      <View style={[styles.pawToe, styles.pawToeOne]} />
                      <View style={[styles.pawToe, styles.pawToeTwo]} />
                      <View style={[styles.pawToe, styles.pawToeThree]} />
                    </Animated.View>
                  ) : (
                    <View style={styles.passwordMascotClip}>
                      <Animated.Image
                        source={closedEyeMascot}
                        style={[
                          styles.passwordMascot,
                          {
                            opacity: closedOpacity,
                            transform: [{ scale: closedScale }]
                          }
                        ]}
                      />
                      <Animated.Image
                        source={peekingMascot}
                        style={[
                          styles.passwordMascot,
                          styles.passwordMascotOverlay,
                          {
                            opacity: peekingOpacity,
                            transform: [{ scale: peekingScale }]
                          }
                        ]}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              }
              secureTextEntry={!showPassword}
              value={password}
            />
          </FadeInView>
          <FadeInView delay={1260}>
            <TouchableOpacity
              activeOpacity={0.72}
              onPress={() => {
                setForgotEmail(email);
                setShowForgot(true);
              }}
              style={styles.forgotButton}
            >
              <Text style={styles.forgot}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </FadeInView>
          <FadeInView delay={1400}>
            <PrimaryButton
              disabled={!email || !password}
              loading={loading}
              title={loading ? 'Entrando...' : 'Entrar'}
              onPress={handleLogin}
            />
          </FadeInView>
        </View>

        <FadeInView delay={1540} style={styles.signupRow}>
          <Text style={styles.signupText}>Não possui conta?</Text>
          <TouchableOpacity activeOpacity={0.72} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Criar conta</Text>
          </TouchableOpacity>
        </FadeInView>

        <FadeInView delay={1680} style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvido por: Juliana Marques</Text>
        </FadeInView>
      </View>

      <Modal animationType="fade" transparent visible={showForgot} onRequestClose={closeForgot}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Image source={require('../assets/logoPibble.png')} style={styles.modalMascot} />
            <Text style={styles.modalTitle}>
              {forgotSent ? 'Tudo certo!' : 'Recuperar senha'}
            </Text>
            <Text style={styles.modalText}>
              {forgotSent
                ? 'Enviamos instruções mocadas para o email informado.'
                : 'Digite seu email para receber as instruções de recuperação.'}
            </Text>

            {!forgotSent ? (
              <Input
                icon={Mail}
                keyboardType="email-address"
                label="Email"
                onChangeText={setForgotEmail}
                placeholder="email@exemplo.com"
                style={styles.modalInput}
                value={forgotEmail}
              />
            ) : null}

            <PrimaryButton
              disabled={!forgotSent && !forgotEmail}
              icon={!forgotSent ? Send : undefined}
              loading={loading}
              title={forgotSent ? 'Fechar' : 'Enviar instruções'}
              onPress={forgotSent ? closeForgot : handleForgot}
            />
            {!forgotSent ? (
              <TouchableOpacity activeOpacity={0.72} onPress={closeForgot} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            ) : null}
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
    paddingTop: 34
  },
  preloadMascots: {
    height: 1,
    opacity: 0.01,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    width: 1
  },
  preloadImage: {
    height: 1,
    width: 1
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    maxWidth: 380,
    width: '100%'
  },
  mascot: {
    alignSelf: 'center',
    marginBottom: 22
  },
  header: {
    alignItems: 'center',
    marginBottom: 36
  },
  eyebrow: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
    textAlign: 'center'
  },
  title: {
    color: colors.purple,
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 52,
    textAlign: 'center'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'center'
  },
  form: {
    gap: 16
  },
  forgotButton: {
    alignSelf: 'flex-end',
    paddingVertical: 2
  },
  forgot: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  passwordMascotButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 42
  },
  passwordMascotButtonHidden: {
    opacity: 0
  },
  passwordMascotClip: {
    alignItems: 'center',
    backgroundColor: colors.softPurple,
    borderColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    height: 38,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.purpleDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: 38
  },
  passwordMascot: {
    height: 48,
    resizeMode: 'contain',
    width: 48
  },
  passwordMascotOverlay: {
    position: 'absolute'
  },
  pawLoader: {
    alignItems: 'center',
    backgroundColor: colors.softPurple,
    borderColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    height: 38,
    justifyContent: 'center',
    width: 38
  },
  pawPad: {
    backgroundColor: '#FFF3E8',
    borderColor: colors.purple,
    borderRadius: 10,
    borderWidth: 1.5,
    bottom: 7,
    height: 16,
    position: 'absolute',
    width: 18
  },
  pawToe: {
    backgroundColor: '#FFF3E8',
    borderColor: colors.purple,
    borderRadius: 999,
    borderWidth: 1.5,
    height: 8,
    position: 'absolute',
    top: 7,
    width: 8
  },
  pawToeOne: {
    left: 8,
    top: 12
  },
  pawToeTwo: {
    top: 7
  },
  pawToeThree: {
    right: 8,
    top: 12
  },
  signupRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 24
  },
  signupText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0
  },
  signupLink: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0
  },
  footer: {
    alignItems: 'center',
    marginTop: 32
  },
  footerText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0
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
    padding: 22,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    width: '100%',
    maxWidth: 380
  },
  modalMascot: {
    alignSelf: 'center',
    height: 74,
    marginBottom: 12,
    width: 74
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center'
  },
  modalText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 18,
    marginTop: 8,
    textAlign: 'center'
  },
  modalInput: {
    marginBottom: 16
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
