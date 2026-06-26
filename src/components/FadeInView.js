import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function FadeInView({ children, delay = 0, style }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      delay,
      duration: 720,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0]
              })
            }
          ]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
}
