import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/index.js';

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role;
  allUsers: User[];
  isLoading: boolean;
  switchUser: (userId: string) => void;
  switchRole: (role: Role) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/demo-accounts');
      if (res.ok) {
        const users: User[] = await res.json();
        setAllUsers(users);
        // Default to Aarav Sharma (Citizen)
        const citizen = users.find(u => u.role === 'citizen') || users[0];
        setCurrentUser(citizen);
      }
    } catch (err) {
      console.error('Failed to fetch demo accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const switchRole = (role: Role) => {
    const found = allUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const currentRole: Role = currentUser?.role || 'citizen';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        allUsers,
        isLoading,
        switchUser,
        switchRole,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
