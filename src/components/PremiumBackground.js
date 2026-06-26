import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';

export default function PremiumBackground() {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;

  return (
    <View style={styles.background}>
      <LinearGradient
        colors={isDark ? [colors.dark.background, '#171426', colors.dark.surface] : ['#FFFFFF', colors.background, '#F4F1FF']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blurCircle, styles.topCircle, isDark && styles.darkTopCircle]} />
      <View style={[styles.blurCircle, styles.bottomCircle, isDark && styles.darkBottomCircle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  blurCircle: {
    borderRadius: 999,
    opacity: 0.34,
    position: 'absolute'
  },
  topCircle: {
    backgroundColor: colors.blue,
    height: 280,
    right: -130,
    top: -110,
    width: 280
  },
  darkTopCircle: {
    backgroundColor: colors.dark.purpleGlow,
    opacity: 0.18
  },
  bottomCircle: {
    backgroundColor: colors.mint,
    bottom: -150,
    height: 320,
    left: -150,
    width: 320
  }
  ,
  darkBottomCircle: {
    backgroundColor: '#35D0C3',
    opacity: 0.12
  }
});
