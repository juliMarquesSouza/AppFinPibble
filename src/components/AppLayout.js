import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';
import { useAppearance } from '../theme/AppearanceContext';

export default function AppLayout({ children, scroll = true, contentStyle, overlay }) {
  const { appearance } = useAppearance();
  const backgroundColor = appearance.darkMode ? '#171426' : appearance.backgroundColor;
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoider}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
        {overlay ? <View style={styles.overlay}>{overlay}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  keyboardAvoider: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28
  },
  overlay: {
    alignItems: 'center',
    left: 18,
    pointerEvents: 'none',
    position: 'absolute',
    right: 18,
    top: 12,
    zIndex: 20
  }
});
