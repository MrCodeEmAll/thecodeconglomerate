// app/types.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  MainTabs: undefined;
  Deposit: undefined;
  Settings: undefined;
  FriendsList: undefined;
  Leaderboards: undefined;
  HelpCenter: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  ActiveBets: undefined;
  CreateBet: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;
export type DepositScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Deposit'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;
export type FriendsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FriendsList'>;
export type LeaderboardsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboards'>;
export type HelpCenterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelpCenter'>;