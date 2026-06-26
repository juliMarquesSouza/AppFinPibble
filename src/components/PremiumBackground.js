import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';

export default function PremiumBackground() {
  return (
    <View pointerEvents="none" style={styles.background}>
      <LinearGradient
        colors={['#FFFFFF', colors.background, '#F4F1FF']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blurCircle, styles.topCircle]} />
      <View style={[styles.blurCircle, styles.bottomCircle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden'
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
  bottomCircle: {
    backgroundColor: colors.mint,
    bottom: -150,
    height: 320,
    left: -150,
    width: 320
  }
});
