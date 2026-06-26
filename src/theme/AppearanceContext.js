import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from './colors';

const APPEARANCE_KEY = '@finpibble:appearance';

const backgroundOptions = [
  { label: 'Lilás', value: colors.background },
  { label: 'Menta', value: '#F1FBF6' },
  { label: 'Azul', value: '#F3F7FF' },
  { label: 'Pêssego', value: '#FFF7EF' }
];

const defaultAppearance = {
  backgroundColor: colors.background,
  darkMode: false
};

const AppearanceContext = createContext({
  appearance: defaultAppearance,
  backgroundOptions,
  setBackgroundColor: () => {},
  toggleDarkMode: () => {}
});

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState(defaultAppearance);

  useEffect(() => {
    async function loadAppearance() {
      const storedAppearance = await AsyncStorage.getItem(APPEARANCE_KEY);

      if (storedAppearance) {
        setAppearance({ ...defaultAppearance, ...JSON.parse(storedAppearance) });
      }
    }

    loadAppearance();
  }, []);

  const saveAppearance = async (nextAppearance) => {
    setAppearance(nextAppearance);
    await AsyncStorage.setItem(APPEARANCE_KEY, JSON.stringify(nextAppearance));
  };

  const value = useMemo(() => ({
    appearance,
    backgroundOptions,
    setBackgroundColor: (backgroundColor) => saveAppearance({ ...appearance, backgroundColor }),
    toggleDarkMode: () => saveAppearance({ ...appearance, darkMode: !appearance.darkMode })
  }), [appearance]);

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  return useContext(AppearanceContext);
}
