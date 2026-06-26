import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';

export default function Input({ label, icon: Icon, rightElement, style, fieldStyle, ...props }) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, fieldStyle]}>
        {Icon ? <Icon size={20} color={colors.muted} /> : null}
        <TextInput
          placeholderTextColor={colors.muted}
          style={styles.input}
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
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '600'
  },
  rightElement: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 38
  }
});
