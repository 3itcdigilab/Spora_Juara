import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB } from '../services/db';
import { getAll, addItem, updateItem, findOne } from '../services/firestoreSync';

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  status?: 'active' | 'pending' | 'rejected';
  directorName?: string;
  picName?: string;
  picPhone?: string;
  picRole?: string;
  picNotes?: string;
  pics?: any[];
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
  // Firestore is initialized separately, keeping this for backward compatibility
};

initUsersDB();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.user.name) {
          return parsed;
        }
      } catch (err) {
        console.error(err);
      }
    }

    return {
      user: null,
      role: 'guest',
      tenantId: null,
      isAuthenticated: false,
      permissions: []
    };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state));
  }, [state]);

  const login = async (e: string, p: string): Promise<{ success: boolean; status?: string; message?: string }> => {
    const users = getAll('users');
    const cleanEmail = e.toLowerCase().trim();
    let foundUser = users.find((u: any) => 
      u.email.toLowerCase().trim() === cleanEmail ||
      (cleanEmail === 'sporaadmin' && (u.email.toLowerCase().includes('sporaadmin') || u.name?.toLowerCase().includes('sporaadmin')))
    );

    if (!foundUser && (cleanEmail === 'sporaadmin' || cleanEmail === 'sporaadmin@spora.id')) {
      if (p === 'sporagreenenergy') {
        foundUser = {
          name: 'Spora Admin',
          email: 'sporaadmin@spora.id',
          password: 'sporagreenenergy',
          role: 'admin',
          status: 'active'
        };
        addItem('users', foundUser);
      }
    }

    if (!foundUser || foundUser.password !== p) {
      return { success: false, message: 'Akun belum terdaftar atau password salah.' };
    }

    const resolvedName = foundUser.name || 'User';
    const roleName = foundUser.role || 'student';
    const userStatus = foundUser.status || 'active';
    let userAvatar = foundUser.avatarUrl || '';

    if (roleName === 'student') {
      const studentProfile = localDB.getProfile(foundUser.email);
      if (studentProfile?.avatarUrl) userAvatar = studentProfile.avatarUrl;
    }

    const newState: AuthState = {
      user: {
        ...foundUser,
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

    const status = (roleName === 'industry' || roleName === 'school') ? 'pending' : 'active';

    const newUserEntry = { ...dataOrEmail, email, password: pwd, name, role: roleName, status, avatarUrl: '' };

    const existingUser = findOne('users', (u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      updateItem('users', existingUser.id, newUserEntry);
    } else {
      addItem('users', newUserEntry);
    }

    const newState: AuthState = {
      user: {
        ...newUserEntry,
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
      const current = prev.user || { name: '', email: '', status: 'active', avatarUrl: '' };
      const nextUser = { ...current, ...updatedData } as User;
      const nextState = { ...prev, user: nextUser };

      try {
        const existingUser = findOne('users', (u: any) => u.email.toLowerCase() === current.email.toLowerCase());
        if (existingUser) {
          updateItem('users', existingUser.id, nextUser);
        }
      } catch (err) {}

      localStorage.setItem('auth', JSON.stringify(nextState));
      return nextState;
    });
  };

  const approveUser = (email: string) => {
    const existingUser = findOne('users', (u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      updateItem('users', existingUser.id, { status: 'active' });
    }
    if (state.user && state.user.email.toLowerCase() === email.toLowerCase()) {
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, status: 'active' } : null
      }));
    }
  };

  const rejectUser = (email: string) => {
    const existingUser = findOne('users', (u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      updateItem('users', existingUser.id, { status: 'rejected' });
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