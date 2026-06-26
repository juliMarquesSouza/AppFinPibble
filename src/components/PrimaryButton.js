import { useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';

export default function PrimaryButton({
  title,
  onPress,
  icon: Icon,
  variant = 'primary',
  loading = false,
  disabled = false,
  style
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  const animatePress = (toValue) => {
    Animated.spring(scale, {
      friction: 7,
      tension: 160,
      toValue,
      useNativeDriver: true
    }).start();
  };

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.card : colors.purple} />
      ) : Icon ? (
        <Icon size={20} color={isPrimary ? colors.card : colors.purple} />
      ) : null}
      <Text style={[styles.text, !isPrimary && styles.secondaryText]}>{title}</Text>
    </View>
  );

  if (!isPrimary) {
    return (
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        <TouchableOpacity
          activeOpacity={1}
          disabled={isDisabled}
          onPress={onPress}
          onPressIn={() => animatePress(0.97)}
          onPressOut={() => animatePress(1)}
          style={[styles.secondary, isDisabled && styles.disabled]}
        >
          {content}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={() => animatePress(0.97)}
        onPressOut={() => animatePress(1)}
      >
        <LinearGradient
          colors={[colors.purple, colors.purpleDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primary, isDisabled && styles.disabled]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  primary: {
    minHeight: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purpleDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 5
  },
  secondary: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.softPurple
  },
  disabled: {
    opacity: 0.66
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center'
  },
  text: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0
  },
  secondaryText: {
    color: colors.purple
  }
});
