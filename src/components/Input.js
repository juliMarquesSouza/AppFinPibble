import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';

export default function Input({ label, icon: Icon, rightElement, style, fieldStyle, ...props }) {
  const { appearance } = useAppearance();
  const isDark = appearance.darkMode;

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={[styles.label, isDark && styles.darkLabel]}>{label}</Text>
      <View style={[styles.field, isDark && styles.darkField, fieldStyle]}>
        {Icon ? <Icon size={20} color={isDark ? colors.dark.muted : colors.muted} /> : null}
        <TextInput
          placeholderTextColor={isDark ? colors.dark.muted : colors.muted}
          style={[styles.input, isDark && styles.darkInput]}
          autoCapitalize="none"
          {...props}
        />
        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  darkLabel: {
    color: colors.dark.text
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: '#ECECEC',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 18,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.045,
    shadowRadius: 20,
    elevation: 2
  },
  darkField: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
    shadowColor: colors.dark.purpleGlow,
    shadowOpacity: 0.12
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    outlineStyle: 'none'
  },
  darkInput: {
    color: colors.dark.text
  },
  rightElement: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 38
  }
});
