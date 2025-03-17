import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = __DEV__ 
    ? 'http://localhost:5000/api'
    : 'https://your-production-url.com/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('userToken');
        }
        return Promise.reject(error);
    }
);

interface AuthResponse {
    token: string;
    _id: string;
    username: string;
    email: string;
}

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    stakes: Stake[];
}

interface Stake {
    _id: string;
    title: string;
    description: string;
    amount: number;
    creator: {
        _id: string;
        username: string;
    };
    participants: Array<{
        user: {
            _id: string;
            username: string;
        };
        joinedAt: Date;
    }>;
    status: 'active' | 'completed' | 'cancelled';
    category: string;
    expiresAt: Date;
    trending: boolean;
    visibility: 'public' | 'private';
}

// Auth API
export const authAPI = {
    register: async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/users', userData);
        return response.data;
    },
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/users/login', credentials);
        if (response.data.token) {
            await AsyncStorage.setItem('userToken', response.data.token);
        }
        return response.data;
    },
    logout: async () => {
        await AsyncStorage.removeItem('userToken');
    },
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get<UserProfile>('/users/profile');
        return response.data;
    },
};

// Stakes API
export const stakesAPI = {
    getAll: async (): Promise<Stake[]> => {
        const response = await api.get<Stake[]>('/stakes');
        return response.data;
    },
    getTrending: async (): Promise<Stake[]> => {
        const response = await api.get<Stake[]>('/stakes/trending');
        return response.data;
    },
    getById: async (id: string): Promise<Stake> => {
        const response = await api.get<Stake>(`/stakes/${id}`);
        return response.data;
    },
    create: async (stakeData: {
        title: string;
        description: string;
        amount: number;
        category: string;
        expiresAt: Date;
        visibility: 'public' | 'private';
    }): Promise<Stake> => {
        const response = await api.post<Stake>('/stakes', stakeData);
        return response.data;
    },
    join: async (id: string): Promise<Stake> => {
        const response = await api.post<Stake>(`/stakes/${id}/join`);
        return response.data;
    },
    updateStatus: async (id: string, status: 'active' | 'completed' | 'cancelled'): Promise<Stake> => {
        const response = await api.put<Stake>(`/stakes/${id}/status`, { status });
        return response.data;
    },
};

export default api; 