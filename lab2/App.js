import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';
import ContactsScreen from './screens/ContactsScreen';
import CustomDrawer from './components/CustomDrawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator для новин (Main + Details)
function NewsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Деталі новини',
          headerBackTitle: 'Назад',
        })}
      />
    </Stack.Navigator>
  );
}

// Головний Drawer Navigator
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawer {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="Новини" component={NewsStack} />
          <Drawer.Screen
            name="Контакти"
            component={ContactsScreen}
            options={{ headerShown: true, title: 'Контакти' }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}