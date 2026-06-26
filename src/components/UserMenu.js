import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LogOut, Menu, Moon } from 'lucide-react-native';

import { clearSession } from '../services/apiClient';
import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';

export default function UserMenu({ navigation, visible, onClose, onOpen }) {
  const { appearance, toggleDarkMode } = useAppearance();
  const isDark = appearance.darkMode;

  const logout = async () => {
    onClose();
    await clearSession();
    const rootNavigation = navigation.getParent()?.getParent?.() || navigation.getParent?.() || navigation;

    rootNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.82} onPress={onOpen} style={styles.trigger}>
        <Image source={require('../assets/logoPibble.png')} style={styles.avatar} />
        <View style={[styles.menuBadge, isDark && styles.darkMenuBadge]}>
          <Menu size={13} color={isDark ? colors.dark.text : colors.purple} />
        </View>
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
        <View style={[styles.backdrop, isDark && styles.darkBackdrop]}>
          <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeLayer} />
          <View style={[styles.menu, isDark && styles.darkMenu]}>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={toggleDarkMode}
              style={styles.item}
            >
              <Moon size={18} color={isDark ? '#CDBDFF' : colors.purple} />
              <Text style={[styles.itemText, isDark && styles.darkItemText]}>
                {isDark ? 'Modo noturno ativo' : 'Modo noturno'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.78} onPress={logout} style={styles.item}>
              <LogOut size={18} color={colors.danger} />
              <Text style={[styles.itemText, styles.logoutText]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 54,
    position: 'relative',
    width: 54
  },
  avatar: {
    height: 48,
    width: 48
  },
  menuBadge: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.softPurple,
    borderRadius: 999,
    borderWidth: 1,
    bottom: 2,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 24
  },
  darkMenuBadge: {
    backgroundColor: colors.dark.surfaceAlt,
    borderColor: colors.dark.border
  },
  backdrop: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(31, 41, 55, 0.22)',
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 76
  },
  darkBackdrop: {
    backgroundColor: 'rgba(8, 6, 18, 0.62)'
  },
  closeLayer: {
    ...StyleSheet.absoluteFillObject
  },
  menu: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 8,
    shadowColor: '#202038',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    width: 210
  },
  darkMenu: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
    borderWidth: 1,
    shadowColor: colors.dark.purpleGlow,
    shadowOpacity: 0.22
  },
  item: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 12
  },
  itemText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  darkItemText: {
    color: colors.dark.text
  },
  logoutText: {
    color: colors.danger
  }
});
