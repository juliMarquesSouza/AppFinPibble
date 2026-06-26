import { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LogOut, Menu, Moon, Palette } from 'lucide-react-native';

import { clearSession } from '../services/apiClient';
import { useAppearance } from '../theme/AppearanceContext';
import { colors } from '../theme/colors';

export default function UserMenu({ navigation, visible, onClose, onOpen }) {
  const { appearance, backgroundOptions, setBackgroundColor, toggleDarkMode } = useAppearance();
  const [appearanceOpen, setAppearanceOpen] = useState(false);

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
        <View style={styles.menuBadge}>
          <Menu size={13} color={colors.purple} />
        </View>
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeLayer} />
          <View style={styles.menu}>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => setAppearanceOpen((current) => !current)}
              style={styles.item}
            >
              <Palette size={18} color={colors.purple} />
              <Text style={styles.itemText}>Aparência</Text>
            </TouchableOpacity>

            {appearanceOpen ? (
              <View style={styles.appearancePanel}>
                <TouchableOpacity activeOpacity={0.78} onPress={toggleDarkMode} style={styles.modeRow}>
                  <Moon size={16} color={appearance.darkMode ? colors.purple : colors.muted} />
                  <Text style={styles.modeText}>
                    {appearance.darkMode ? 'Modo noturno ativo' : 'Modo noturno'}
                  </Text>
                </TouchableOpacity>
                {/* <View style={styles.swatches}>
                  {backgroundOptions.map((option) => (
                    <TouchableOpacity
                      activeOpacity={0.78}
                      key={option.value}
                      onPress={() => setBackgroundColor(option.value)}
                      style={[
                        styles.swatchButton,
                        appearance.backgroundColor === option.value && styles.swatchButtonActive
                      ]}
                    >
                      <View style={[styles.swatch, { backgroundColor: option.value }]} />
                    </TouchableOpacity>
                  ))}
                </View> */}
              </View>
            ) : null}

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
  backdrop: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(31, 41, 55, 0.22)',
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 76
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
  logoutText: {
    color: colors.danger
  },
  appearancePanel: {
    backgroundColor: colors.softPurple,
    borderRadius: 14,
    gap: 10,
    marginBottom: 6,
    padding: 10
  },
  modeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  modeText: {
    color: colors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: '800'
  },
  swatches: {
    flexDirection: 'row',
    gap: 8
  },
  swatchButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: 'transparent',
    borderRadius: 999,
    borderWidth: 2,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  swatchButtonActive: {
    borderColor: colors.purple
  },
  swatch: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 20,
    width: 20
  }
});
