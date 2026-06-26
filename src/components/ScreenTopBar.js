import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import { colors } from '../theme/colors';

export default function ScreenTopBar({
  backLabel = 'Voltar',
  fallbackRoute = 'Dashboard',
  navigation,
  showBack = true
}) {
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    if (fallbackRoute) {
      navigation.navigate(fallbackRoute);
    }
  };

  return (
    <View style={styles.bar}>
      {showBack ? (
        <TouchableOpacity activeOpacity={0.78} onPress={goBack} style={styles.action}>
          <ChevronLeft size={20} color={colors.text} />
          <Text style={styles.actionText}>{backLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    minHeight: 38
  },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingRight: 12,
    paddingVertical: 6
  },
  actionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  placeholder: {
    width: 1
  }
});
