import { BarChart3, PiggyBank, WalletCards } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../theme/colors';
import { useAppearance } from '../theme/AppearanceContext';

const icons = {
  Dashboard: BarChart3,
  Accounts: WalletCards,
  Savings: PiggyBank
};

const labels = {
  Dashboard: 'Início',
  Accounts: 'Contas',
  Savings: 'Metas'
};

export default function BottomTabs({ state, descriptors, navigation }) {
  const { appearance } = useAppearance();
  const backgroundColor = appearance.darkMode ? '#171426' : appearance.backgroundColor;
  const isDark = appearance.darkMode;

  return (
    <View style={[styles.outer, { backgroundColor }]}>
      <View style={[styles.bar, isDark && styles.darkBar]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = icons[route.name] || BarChart3;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              activeOpacity={0.84}
              key={route.key}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.activeTab, isDark && isFocused && styles.darkActiveTab]}
            >
              <Icon size={21} color={isFocused ? (isDark ? colors.card : colors.purple) : (isDark ? colors.dark.muted : colors.muted)} />
              <Text style={[styles.label, isDark && styles.darkLabel, isFocused && styles.activeLabel, isDark && isFocused && styles.darkActiveLabel]}>
                {labels[route.name] || route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.background,
    paddingBottom: 14,
    paddingHorizontal: 18,
    paddingTop: 8
  },
  bar: {
    backgroundColor: colors.card,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 7
  },
  darkBar: {
    backgroundColor: colors.dark.surface,
    shadowColor: colors.dark.purpleGlow,
    shadowOpacity: 0.18
  },
  tab: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    gap: 4,
    justifyContent: 'center',
    minHeight: 58
  },
  activeTab: {
    backgroundColor: colors.softPurple
  },
  darkActiveTab: {
    backgroundColor: 'rgba(124,106,237,.24)'
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800'
  },
  activeLabel: {
    color: colors.purple
  },
  darkLabel: {
    color: colors.dark.muted
  },
  darkActiveLabel: {
    color: '#CDBDFF'
  }
});
