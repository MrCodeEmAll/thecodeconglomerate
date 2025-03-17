import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/bet';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and validate it
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Implement auth status check
      setIsLoading(false);
    } catch (error) {
      setUser(null);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Implement sign in logic
      setUser({
        _id: 'temp-user-id',
        username: 'temp-username',
        email: email,
        stats: {
          totalBets: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
        },
        balance: 0,
      });
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Implement sign out logic
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 