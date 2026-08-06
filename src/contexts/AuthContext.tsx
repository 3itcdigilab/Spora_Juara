import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB } from '../services/db';

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  status?: 'active' | 'pending' | 'rejected';
}

interface AuthState {
  user: User | null;
  role: string;
  tenantId: string | null;
  isAuthenticated: boolean;
  permissions: string[];
}

interface AuthContextType extends AuthState {
  login: (e: string, p: string) => Promise<{ success: boolean; status?: string; message?: string }>;
  register: (dataOrEmail: any, password?: string, role?: string) => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
  approveUser: (email: string) => void;
  rejectUser: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial default user accounts in LocalStorage
const initUsers = () => {
  const existing = localStorage.getItem('spora_users');
  let users = existing ? JSON.parse(existing) : [];

  // Guarantee sporaadmin@spora.id exists with sporaev password
  const adminIdx = users.findIndex((u: any) => u.email.toLowerCase() === 'sporaadmin@spora.id' || u.email.toLowerCase() === 'sporaadmin');
  const adminEntry = { email: 'sporaadmin@spora.id', password: 'sporaev', name: 'Platform Administrator', role: 'admin', status: 'active' };

  if (adminIdx >= 0) {
    users[adminIdx] = adminEntry;
  } else {
    users.unshift(adminEntry);
  }

  // Check default demo accounts
  if (!users.find((u: any) => u.email === 'tubagus@spora.id')) {
    users.push({ email: 'tubagus@spora.id', password: 'demo123', name: 'Tubagus', role: 'student', status: 'active' });
  }
  if (!users.find((u: any) => u.email === 'school@spora.id')) {
    users.push({ email: 'school@spora.id', password: 'demo123', name: 'SMK Negeri 1 Cikarang', role: 'school', status: 'active' });
  }
  if (!users.find((u: any) => u.email === 'industry@spora.id')) {
    users.push({ email: 'industry@spora.id', password: 'demo123', name: 'Hyundai Motor Manufacturing', role: 'industry', status: 'active' });
  }

  localStorage.setItem('spora_users', JSON.stringify(users));
};

initUsers();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.user.name) return parsed;
      } catch (err) {
        console.error(err);
      }
    }

    return {
      user: { name: 'Tubagus', email: 'tubagus@spora.id', status: 'active' },
      role: 'student',
      tenantId: 't1',
      isAuthenticated: true,
      permissions: []
    };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state));
  }, [state]);

  const login = async (e: string, p: string): Promise<{ success: boolean; status?: string; message?: string }> => {
    const rawUsers = localStorage.getItem('spora_users');
    const users = rawUsers ? JSON.parse(rawUsers) : [];

    const foundUser = users.find((u: any) => u.email.toLowerCase() === e.toLowerCase());

    // Strict validation
    if (!foundUser || foundUser.password !== p) {
      return { success: false, message: 'Akun belum terdaftar atau password salah.' };
    }

    const resolvedName = foundUser.name || 'User';
    const roleName = foundUser.role || 'student';
    const userStatus = foundUser.status || 'active';

    // Update LocalStorage profile for student
    if (roleName === 'student') {
      localDB.saveProfile({
        studentId: 'stu-1',
        fullName: resolvedName
      });
    }

    const newState: AuthState = {
      user: {
        name: resolvedName,
        email: e,
        status: userStatus
      },
      role: roleName,
      tenantId: 't1',
      isAuthenticated: true,
      permissions: []
    };
    setState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));

    return { success: true, status: userStatus };
  };

  const register = async (dataOrEmail: any, password?: string, role?: string) => {
    const isObj = typeof dataOrEmail === 'object' && dataOrEmail !== null;
    const email = isObj ? dataOrEmail.email : dataOrEmail;
    const pwd = password || (isObj ? dataOrEmail.password : 'demo123');
    const roleName = role || (isObj ? dataOrEmail.role : 'student');
    const name = isObj && dataOrEmail.name ? dataOrEmail.name : 'Tubagus';

    // Industry and School need Admin verification
    const status = (roleName === 'industry' || roleName === 'school') ? 'pending' : 'active';

    const rawUsers = localStorage.getItem('spora_users');
    const users = rawUsers ? JSON.parse(rawUsers) : [];

    const existingIdx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    const newUserEntry = { email, password: pwd, name, role: roleName, status };

    if (existingIdx >= 0) {
      users[existingIdx] = newUserEntry;
    } else {
      users.push(newUserEntry);
    }
    localStorage.setItem('spora_users', JSON.stringify(users));

    // Update profile for student
    if (roleName === 'student') {
      localDB.saveProfile({
        studentId: 'stu-1',
        fullName: name
      });
    }

    const newState: AuthState = {
      user: {
        name: name,
        email: email,
        status: status
      },
      role: roleName,
      tenantId: 't1',
      isAuthenticated: true,
      permissions: []
    };
    setState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  const updateUser = (updatedData: Partial<User>) => {
    setState(prev => {
      const current = prev.user || { name: 'Tubagus', email: 'tubagus@spora.id', status: 'active' };
      const nextUser = { ...current, ...updatedData };
      const nextState = { ...prev, user: nextUser };

      try {
        const rawUsers = localStorage.getItem('spora_users');
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const idx = users.findIndex((u: any) => u.email.toLowerCase() === current.email.toLowerCase());
        if (idx >= 0) {
          users[idx].name = nextUser.name;
          if (nextUser.status) users[idx].status = nextUser.status;
          localStorage.setItem('spora_users', JSON.stringify(users));
        }
      } catch (err) {}

      if (prev.role === 'student' && nextUser.name) {
        localDB.saveProfile({
          studentId: 'stu-1',
          fullName: nextUser.name
        });
      }

      localStorage.setItem('auth', JSON.stringify(nextState));
      return nextState;
    });
  };

  const approveUser = (email: string) => {
    const rawUsers = localStorage.getItem('spora_users');
    const users = rawUsers ? JSON.parse(rawUsers) : [];
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (idx >= 0) {
      users[idx].status = 'active';
      localStorage.setItem('spora_users', JSON.stringify(users));
    }
    if (state.user && state.user.email.toLowerCase() === email.toLowerCase()) {
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, status: 'active' } : null
      }));
    }
  };

  const rejectUser = (email: string) => {
    const rawUsers = localStorage.getItem('spora_users');
    const users = rawUsers ? JSON.parse(rawUsers) : [];
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (idx >= 0) {
      users[idx].status = 'rejected';
      localStorage.setItem('spora_users', JSON.stringify(users));
    }
    if (state.user && state.user.email.toLowerCase() === email.toLowerCase()) {
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, status: 'rejected' } : null
      }));
    }
  };

  const logout = () => {
    const cleared = { user: null, role: '', tenantId: null, isAuthenticated: false, permissions: [] };
    setState(cleared);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, updateUser, approveUser, rejectUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};