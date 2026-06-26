import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import { AppearanceProvider, useAppearance } from './theme/AppearanceContext';

function AppContent() {
  const { appearance } = useAppearance();

  return (
    <View style={styles.root}>
      <StatusBar style={appearance.darkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AppContent />
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web' ? {
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      width: '100%'
    } : {})
  }
});
