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
export const initUsersDB = () => {
  const defaultUsers = [
    { email: 'sporaadmin@spora.id', password: 'sporaev', name: 'Spora Admin Master', role: 'admin', status: 'active', avatarUrl: '' },
    { email: 'tubagus@spora.id', password: 'demo123', name: 'Tubagus', role: 'student', status: 'active', avatarUrl: '' },
    { email: '3itcdigilab@gmail.com', password: 'demo123', name: '3ITC', role: 'industry', status: 'active', avatarUrl: '' },
    { email: 'school@spora.id', password: 'demo123', name: 'SMKN 1 Cikarang', role: 'school', status: 'active', avatarUrl: '' },
    { email: 'industry@spora.id', password: 'demo123', name: 'Hyundai Motor Indonesia', role: 'industry', status: 'active', avatarUrl: '' }
  ];

  const rawUsers = localStorage.getItem('spora_users');
  if (!rawUsers) {
    localStorage.setItem('spora_users', JSON.stringify(defaultUsers));
  } else {
    // Sync 3ITC account role to industry
    const users = JSON.parse(rawUsers);
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === '3itcdigilab@gmail.com');
    if (idx >= 0) {
      users[idx].role = 'industry';
      localStorage.setItem('spora_users', JSON.stringify(users));
    } else {
      users.push(defaultUsers[2]);
      localStorage.setItem('spora_users', JSON.stringify(users));
    }
  }
};

initUsersDB();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.user.name) {
          // Force correct role for 3ITC
          const resolvedRole = parsed.user.email?.toLowerCase() === '3itcdigilab@gmail.com' ? 'industry' : parsed.role;
          return {
            ...parsed,
            role: resolvedRole,
            user: {
              ...parsed.user,
              avatarUrl: parsed.user.avatarUrl || ''
            }
          };
        }
      } catch (err) {
        console.error(err);
      }
    }

    return {
      user: { 
        name: '3ITC', 
        email: '3itcdigilab@gmail.com', 
        avatarUrl: '',
        status: 'active' 
      },
      role: 'industry',
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

    if (!foundUser || foundUser.password !== p) {
      return { success: false, message: 'Akun belum terdaftar atau password salah.' };
    }

    const resolvedName = foundUser.name || 'User';
    const roleName = foundUser.email.toLowerCase() === '3itcdigilab@gmail.com' ? 'industry' : (foundUser.role || 'student');
    const userStatus = foundUser.status || 'active';
    let userAvatar = foundUser.avatarUrl || '';

    if (roleName === 'student') {
      const studentProfile = localDB.getProfile('stu-1');
      if (studentProfile?.avatarUrl) userAvatar = studentProfile.avatarUrl;
      localDB.saveProfile({
        studentId: 'stu-1',
        fullName: resolvedName,
        ...(userAvatar && { avatarUrl: userAvatar })
      });
    }

    const newState: AuthState = {
      user: {
        name: resolvedName,
        email: foundUser.email,
        avatarUrl: userAvatar,
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
    const isObj = typeof dataOrEmail === 'object';
    const email = isObj ? dataOrEmail.email : dataOrEmail;
    const pwd = isObj ? dataOrEmail.password : password;
    const roleName = role || (isObj ? dataOrEmail.role : 'student');
    const name = isObj && dataOrEmail.name ? dataOrEmail.name : 'Candidate';
    const phone = isObj && dataOrEmail.phone ? dataOrEmail.phone : '';

    const status = (roleName === 'industry' || roleName === 'school') ? 'pending' : 'active';

    const rawUsers = localStorage.getItem('spora_users');
    const users = rawUsers ? JSON.parse(rawUsers) : [];

    const existingIdx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    const newUserEntry = { email, password: pwd, name, role: roleName, status, avatarUrl: '' };

    if (existingIdx >= 0) {
      users[existingIdx] = newUserEntry;
    } else {
      users.push(newUserEntry);
    }
    localStorage.setItem('spora_users', JSON.stringify(users));

    if (roleName === 'student') {
      localDB.saveProfile({
        studentId: 'stu-1',
        fullName: name,
        ...(phone && { phone })
      });
    }

    const newState: AuthState = {
      user: {
        name,
        email,
        avatarUrl: '',
        status
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
      const current = prev.user || { name: '3ITC', email: '3itcdigilab@gmail.com', status: 'active', avatarUrl: '' };
      const nextUser = { ...current, ...updatedData };
      const nextState = { ...prev, user: nextUser };

      try {
        const rawUsers = localStorage.getItem('spora_users');
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const idx = users.findIndex((u: any) => u.email.toLowerCase() === current.email.toLowerCase());
        if (idx >= 0) {
          users[idx].name = nextUser.name;
          if (nextUser.status) users[idx].status = nextUser.status;
          if (nextUser.avatarUrl !== undefined) users[idx].avatarUrl = nextUser.avatarUrl;
          localStorage.setItem('spora_users', JSON.stringify(users));
        }
      } catch (err) {}

      if (prev.role === 'student') {
        localDB.saveProfile({
          studentId: 'stu-1',
          ...(nextUser.name && { fullName: nextUser.name }),
          ...(nextUser.avatarUrl !== undefined && { avatarUrl: nextUser.avatarUrl })
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
    localStorage.removeItem('auth');
    setState({
      user: null,
      role: 'guest',
      tenantId: null,
      isAuthenticated: false,
      permissions: []
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, updateUser, approveUser, rejectUser, logout }}>
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