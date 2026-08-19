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

const STRICT_TEST_CREDENTIALS: Record<string, { role: Role; userId: string; allowedPasswords: string[] }> = {
  'aarav.sharma@citizen.gov.in': {
    role: 'citizen',
    userId: 'user_citizen_aarav',
    allowedPasswords: ['citizen123', 'password123']
  },
  'aarav': {
    role: 'citizen',
    userId: 'user_citizen_aarav',
    allowedPasswords: ['citizen123', 'password123']
  },
  'citizen': {
    role: 'citizen',
    userId: 'user_citizen_aarav',
    allowedPasswords: ['citizen123', 'password123']
  },
  'priya.mehta@pwd.gov.in': {
    role: 'officer',
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'priya': {
    role: 'officer',
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'officer': {
    role: 'officer',
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'authority': {
    role: 'officer',
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'admin@municipality.gov.in': {
    role: 'admin',
    userId: 'user_admin_rajesh',
    allowedPasswords: ['admin123', 'password123']
  },
  'admin': {
    role: 'admin',
    userId: 'user_admin_rajesh',
    allowedPasswords: ['admin123', 'password123']
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsersAndSession();
  }, []);

  const fetchUsersAndSession = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/demo-accounts');
      let users: User[] = [];
      if (res.ok) {
        users = await res.json();
        setAllUsers(users);
      }

      // Check saved session in sessionStorage
      const savedSession = sessionStorage.getItem('ecivic_auth_user');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setIsAuthenticated(true);
          }
        } catch {
          // ignore corrupted session
        }
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
    const query = (emailOrUsername || '').trim().toLowerCase();
    const pwd = (password || '').trim();

    if (!query) {
      return { success: false, error: 'Email / Username is required.' };
    }
    if (!pwd) {
      return { success: false, error: 'Password is required.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: query, password: pwd, role })
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        sessionStorage.setItem('ecivic_auth_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Invalid email or password.' };
      }
    } catch {
      // Offline / Serverless cold start fallback with strict validation
      const credRecord = STRICT_TEST_CREDENTIALS[query];
      if (!credRecord) {
        return {
          success: false,
          error: 'Account not found. Please use one of the registered test accounts (e.g. aarav.sharma@citizen.gov.in or priya.mehta@pwd.gov.in).'
        };
      }

      if (!credRecord.allowedPasswords.includes(pwd)) {
        return {
          success: false,
          error: `Incorrect password. Please enter the test password (e.g. '${credRecord.allowedPasswords[0]}').`
        };
      }

      const match = allUsers.find(u => u.id === credRecord.userId) || {
        id: credRecord.userId,
        name: credRecord.role === 'citizen' ? 'Aarav Sharma' : credRecord.role === 'officer' ? 'Priya Mehta' : 'Municipal Admin',
        email: query.includes('@') ? query : `${query}@gov.in`,
        role: credRecord.role,
        ward: 'Ward 14',
        reliabilityScore: 98
      } as User;

      setCurrentUser(match);
      setIsAuthenticated(true);
      sessionStorage.setItem('ecivic_auth_user', JSON.stringify(match));
      return { success: true };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('ecivic_auth_user');
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      sessionStorage.setItem('ecivic_auth_user', JSON.stringify(found));
    }
  };

  const switchRole = (role: Role) => {
    const found = allUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      sessionStorage.setItem('ecivic_auth_user', JSON.stringify(found));
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        sessionStorage.setItem('ecivic_auth_user', JSON.stringify(updated));
        return updated;
      });
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
