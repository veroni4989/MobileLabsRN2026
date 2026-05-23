import React from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GameProvider, useGame } from './GameContext';
import GameScreen from './screens/GameScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const TAB_ICONS = { 'Гра': '▶️', 'Завдання': '📋', 'Налаштування': '⚙️' };

function AppNavigator() {
  const { isDark } = useGame();
  const card   = isDark ? '#161b22' : '#ffffff';
  const text   = isDark ? '#e6edf3' : '#111827';
  const border = isDark ? '#30363d' : '#e5e7eb';

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: '#3b82f6',
          background: isDark ? '#0d1117' : '#f9fafb',
          card, text, border,
          notification: '#3b82f6',
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 2 }}>{TAB_ICONS[route.name]}</Text>
          ),
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
          tabBarStyle: { backgroundColor: card, borderTopColor: border },
          headerStyle: { backgroundColor: card },
          headerTintColor: text,
          headerTitleStyle: { fontWeight: '700' },
        })}
      >
        <Tab.Screen name="Гра"          component={GameScreen}       options={{ title: 'Gesture Clicker' }} />
        <Tab.Screen name="Завдання"     component={ChallengesScreen} options={{ title: 'Challenges' }} />
        <Tab.Screen name="Налаштування" component={SettingsScreen}   options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <AppNavigator />
      </GameProvider>
    </GestureHandlerRootView>
  );
}