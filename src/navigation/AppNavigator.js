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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabs {...props} />}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Accounts" component={Accounts} />
      <Tab.Screen name="Savings" component={Savings} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8F7FC' }
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
