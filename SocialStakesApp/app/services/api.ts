import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bet, CreateBetData, User } from '../types/bet';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/register', { username, email, password }),
  getCurrentUser: () => api.get<User>('/auth/me'),
};

export const betsAPI = {
  createBet: (betData: CreateBetData) => 
    api.post<Bet>('/bets', betData),
  getPublicBets: () => 
    api.get<Bet[]>('/bets/public'),
  getMyBets: () => 
    api.get<Bet[]>('/bets/my-bets'),
  getBetDetails: (betId: string) =>
    api.get<Bet>(`/bets/${betId}`),
  joinBet: (betId: string, choice: string, amount: number) =>
    api.post<Bet>(`/bets/${betId}/join`, { choice, amount }),
  resolveBet: (betId: string, outcome: string) =>
    api.post<Bet>(`/bets/${betId}/resolve`, { outcome }),
};

export const leaderboardAPI = {
  getGlobalLeaderboard: () => api.get<User[]>('/leaderboard/global'),
  getFriendsLeaderboard: () => api.get<User[]>('/leaderboard/friends'),
  getUserRanking: () => api.get<{ rank: number }>('/leaderboard/ranking'),
};

export const friendsAPI = {
  getFriends: () => api.get<User[]>('/users/friends'),
  sendFriendRequest: (userId: string) =>
    api.post<void>(`/users/${userId}/friend-request`),
  acceptFriendRequest: (requestId: string) =>
    api.post<void>(`/users/friend-request/${requestId}/accept`),
  rejectFriendRequest: (requestId: string) =>
    api.post<void>(`/users/friend-request/${requestId}/reject`),
};

export default api; 