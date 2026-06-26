import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export default function StatCard({ label, value, icon: Icon, accent = colors.purple }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
        {Icon ? <Icon size={20} color={accent} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    flex: 1,
    gap: 8,
    padding: 16,
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
