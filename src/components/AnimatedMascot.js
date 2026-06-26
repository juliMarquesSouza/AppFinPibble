import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';

export default function AnimatedMascot({ size = 204, delay = 0, style }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      delay,
      duration: 820,
      toValue: 1,
      useNativeDriver: false
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          duration: 2600,
          toValue: 1,
          useNativeDriver: false
        }),
        Animated.timing(breath, {
          duration: 2600,
          toValue: 0,
          useNativeDriver: false
        })
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [breath, delay, entrance]);

  const imageStyle = {
    height: size,
    width: size
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        {
          opacity: entrance,
          shadowOpacity: breath.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.2]
          }),
          shadowRadius: breath.interpolate({
            inputRange: [0, 1],
            outputRange: [22, 34]
          }),
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0]
              })
            },
            {
              translateY: breath.interpolate({
                inputRange: [0, 1],
                outputRange: [4, -8]
              })
            },
            {
              scale: breath.interpolate({
                inputRange: [0, 1],
                outputRange: [0.98, 1.03]
              })
            },
            {
              rotate: breath.interpolate({
                inputRange: [0, 1],
                outputRange: ['-2deg', '3deg']
              })
            }
          ]
        }
      ]}
    >
      <View style={[styles.halo, { height: size * 0.74, width: size * 0.74 }]} />
      <Image source={require('../assets/logoPibble.png')} style={[styles.image, imageStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purpleDark,
    shadowOffset: { width: 0, height: 22 },
    elevation: 8
  },
  halo: {
    backgroundColor: colors.softPurple,
    borderRadius: 999,
    opacity: 0.92,
    position: 'absolute'
  },
  image: {
    resizeMode: 'contain'
  }
});
