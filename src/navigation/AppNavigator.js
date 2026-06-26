import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from '../components/BottomTabs';
import Accounts from '../screens/Accounts';
import BankAccount from '../screens/BankAccount';
import Dashboard from '../screens/Dashboard';
import Login from '../screens/Login';
import Savings from '../screens/Savings';
import Signup from '../screens/Signup';
import { getToken } from '../services/apiClient';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <View style={styles.tabsRoot}>
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomTabs {...props} />}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Accounts" component={Accounts} />
        <Tab.Screen name="Savings" component={Savings} />
      </Tab.Navigator>
    </View>
  );
}

export default function AppNavigator() {
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    async function loadInitialRoute() {
      const token = await getToken();
      setInitialRouteName(token ? 'MainTabs' : 'Login');
    }

    loadInitialRoute();
  }, []);

  if (!initialRouteName) {
    return (
      <View style={{ alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.purple} />
      </View>
    );
  }

  return (
    <NavigationContainer documentTitle={{ formatter: () => 'FinPibble' }}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#F8F7FC',
            ...(Platform.OS === 'web' ? {
              height: '100vh',
              maxHeight: '100vh',
              overflow: 'hidden'
            } : {})
          }
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="BankAccount" component={BankAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabsRoot: {
    flex: 1,
    ...(Platform.OS === 'web' ? {
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden'
    } : {})
  }
});
