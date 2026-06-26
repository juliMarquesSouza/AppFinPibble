import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { useAppearance } from '../theme/AppearanceContext';

export default function StatCard({ label, value, icon: Icon, accent = colors.purple, tone = 'default' }) {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;
  const darkTone = tone === 'income'
    ? {
        backgroundColor: colors.dark.incomeCard,
        borderColor: colors.dark.incomeBorder,
        labelColor: colors.dark.incomeText,
        iconBackground: 'rgba(76,175,80,.18)'
      }
    : tone === 'expense'
      ? {
          backgroundColor: colors.dark.expenseCard,
          borderColor: colors.dark.expenseBorder,
          labelColor: colors.dark.expenseText,
          iconBackground: 'rgba(244,67,54,.18)'
        }
      : {
          backgroundColor: colors.dark.surface,
          borderColor: colors.dark.border,
          labelColor: colors.dark.muted,
          iconBackground: `${accent}28`
        };

  return (
    <View
      style={[
        styles.card,
        isDark && {
          backgroundColor: darkTone.backgroundColor,
          borderColor: darkTone.borderColor,
          borderWidth: 1,
          shadowColor: accent
        }
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: isDark ? darkTone.iconBackground : `${accent}22` }]}>
        {Icon ? <Icon size={20} color={accent} /> : null}
      </View>
      <Text style={[styles.label, isDark && { color: darkTone.labelColor }]}>{label}</Text>
      <Text style={[styles.value, isDark && { color: colors.dark.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    flex: 1,
    gap: 8,
    padding: 18,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 38,
    justifyContent: 'center',
    width: 38
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  }
});
