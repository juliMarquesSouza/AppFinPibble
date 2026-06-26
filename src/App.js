import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';

import AppNavigator from './navigation/AppNavigator';
import { AppearanceProvider, useAppearance } from './theme/AppearanceContext';

function AppContent() {
  const { appearance } = useAppearance();

  return (
    <>
      <StatusBar style={appearance.darkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AppContent />
    </AppearanceProvider>
  );
}
