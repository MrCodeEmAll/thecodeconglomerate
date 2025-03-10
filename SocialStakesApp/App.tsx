// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/screens/HomeScreen';
import ActiveBetsScreen from './app/screens/ActiveBetsScreen';
import CreateBetScreen from './app/screens/CreateBetScreen';
import NotificationsScreen from './app/screens/NotificationsScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import DepositScreen from './app/screens/DepositScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import FriendsListScreen from './app/screens/FriendsListScreen';
import LeaderboardsScreen from './app/screens/LeaderboardsScreen';
import HelpCenterScreen from './app/screens/HelpCenterScreen';
import { RootStackParamList, BottomTabParamList } from './app/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Main Bottom Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ActiveBets" component={ActiveBetsScreen} />
      <Tab.Screen name="CreateBet" component={CreateBetScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Deposit" component={DepositScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="FriendsList" component={FriendsListScreen} />
        <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}