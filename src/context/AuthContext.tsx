import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/index.js';

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role;
  isAuthenticated: boolean;
  allUsers: User[];
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  switchRole: (role: Role) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
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
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Failed to fetch demo accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    emailOrUsername: string,
    password: string,
    role?: Role
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUsername, password, role })
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Invalid credentials' };
      }
    } catch (e) {
      // Fallback local authentication
      const clean = emailOrUsername.trim().toLowerCase();
      const match = allUsers.find(
        u =>
          u.email.toLowerCase().includes(clean) ||
          u.role.toLowerCase() === clean ||
          u.name.toLowerCase().includes(clean)
      ) || (role ? allUsers.find(u => u.role === role) : allUsers[0]);

      if (match) {
        setCurrentUser(match);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
    }
  };

  const switchRole = (role: Role) => {
    const found = allUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
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
        isAuthenticated,
        allUsers,
        isLoading,
        login,
        logout,
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
