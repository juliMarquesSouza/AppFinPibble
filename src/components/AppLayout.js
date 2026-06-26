import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';
import { useAppearance } from '../theme/AppearanceContext';

export default function AppLayout({
  children,
  scroll = true,
  contentStyle,
  overlay,
  hasFixedTabs = false,
  fixedHeader
}) {
  const { appearance } = useAppearance();
  const backgroundColor = appearance.darkMode ? '#171426' : appearance.backgroundColor;
  const content = <View style={[styles.content, hasFixedTabs && styles.fixedTabsContent, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoider}
      >
        {fixedHeader ? (
          <View style={[styles.fixedHeader, { backgroundColor }]}>
            {fixedHeader}
          </View>
        ) : null}
        {scroll ? (
          <ScrollView
            style={styles.scroll}
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
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' ? {
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden'
    } : {})
  },
  keyboardAvoider: {
    flex: 1
  },
  fixedHeader: {
    paddingHorizontal: 22,
    paddingTop: 18,
    zIndex: 30
  },
  scroll: {
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
  fixedTabsContent: {
    paddingBottom: 124
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
