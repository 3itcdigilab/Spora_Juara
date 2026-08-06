import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB } from '../services/db';

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
  const defaultUsers = [
    { email: 'sporaadmin@spora.id', password: 'sporaev', name: 'Spora Admin Master', role: 'admin', status: 'active', avatarUrl: '' },
    { email: 'tubagus@spora.id', password: 'demo123', name: 'Tubagus', role: 'student', status: 'active', avatarUrl: '' },
    { 
      email: '3itcdigilab@gmail.com', 
      password: 'demo123', 
      name: '3ITC', 
      role: 'industry', 
      status: 'active', 
      avatarUrl: '',
      directorName: 'Tubagus Aria',
      pics: [
        {
          id: 'pic-1',
          name: 'Tubagus Aria',
          role: 'Direktur Utama',
          email: 'tubagusaria31@gmail.com',
          phone: '087780092090',
          notes: 'Penanggung jawab utama rekrutmen lulusan SMK Vokasi & program magang industri.'
        }
      ]
    },
    { email: 'school@spora.id', password: 'demo123', name: 'SMKN 1 Cikarang', role: 'school', status: 'active', avatarUrl: '' },
    { email: 'industry@spora.id', password: 'demo123', name: 'Hyundai Motor Indonesia', role: 'industry', status: 'active', avatarUrl: '' }
  ];

  const rawUsers = localStorage.getItem('spora_users');
  if (!rawUsers) {
    localStorage.setItem('spora_users', JSON.stringify(defaultUsers));
  } else {
    // Always force 3ITC account role to 'industry'
    let users = JSON.parse(rawUsers);
    let found3ITC = false;
    users = users.map((u: any) => {
      if (u.email.toLowerCase() === '3itcdigilab@gmail.com' || u.name === '3ITC') {
        found3ITC = true;
        return { 
          ...u, 
          role: 'industry',
          directorName: u.directorName || 'Tubagus Aria',
          pics: u.pics && u.pics.length > 0 ? u.pics : [
            {
              id: 'pic-1',
              name: 'Tubagus Aria',
              role: 'Direktur Utama',
              email: 'tubagusaria31@gmail.com',
              phone: '087780092090',
              notes: 'Penanggung jawab utama rekrutmen lulusan SMK Vokasi & program magang industri.'
            }
          ]
        };
      }
      return u;
    });

    if (!found3ITC) {
      users.push(defaultUsers[2]);
    }
    localStorage.setItem('spora_users', JSON.stringify(users));
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
          const is3ITC = parsed.user.email?.toLowerCase() === '3itcdigilab@gmail.com' || parsed.user.name === '3ITC';
          const resolvedRole = is3ITC ? 'industry' : parsed.role;
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
        status: 'active',
        directorName: 'Tubagus Aria',
        pics: [
          {
            id: 'pic-1',
            name: 'Tubagus Aria',
            role: 'Direktur Utama',
            email: 'tubagusaria31@gmail.com',
            phone: '087780092090',
            notes: 'Penanggung jawab utama rekrutmen lulusan SMK Vokasi & program magang industri.'
          }
        ]
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
    const is3ITC = foundUser.email.toLowerCase() === '3itcdigilab@gmail.com' || resolvedName === '3ITC';
    const roleName = is3ITC ? 'industry' : (foundUser.role || 'student');
    const userStatus = foundUser.status || 'active';
    let userAvatar = foundUser.avatarUrl || '';

    if (roleName === 'student') {
      const studentProfile = localDB.getProfile('stu-1');
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
    const is3ITC = email.toLowerCase() === '3itcdigilab@gmail.com';
    const roleName = is3ITC ? 'industry' : (role || (isObj ? dataOrEmail.role : 'student'));
    const name = isObj && dataOrEmail.name ? dataOrEmail.name : 'Candidate';

    const status = (roleName === 'industry' || roleName === 'school') ? 'pending' : 'active';

    const rawUsers = localStorage.getItem('spora_users');
    const users = rawUsers ? JSON.parse(rawUsers) : [];

    const existingIdx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    const newUserEntry = { ...dataOrEmail, email, password: pwd, name, role: roleName, status, avatarUrl: '' };

    if (existingIdx >= 0) {
      users[existingIdx] = newUserEntry;
    } else {
      users.push(newUserEntry);
    }
    localStorage.setItem('spora_users', JSON.stringify(users));

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
      const current = prev.user || { name: '3ITC', email: '3itcdigilab@gmail.com', status: 'active', avatarUrl: '' };
      const nextUser = { ...current, ...updatedData };
      const nextState = { ...prev, user: nextUser };

      try {
        const rawUsers = localStorage.getItem('spora_users');
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const idx = users.findIndex((u: any) => u.email.toLowerCase() === current.email.toLowerCase());
        if (idx >= 0) {
          users[idx] = { ...users[idx], ...nextUser };
          localStorage.setItem('spora_users', JSON.stringify(users));
        }
      } catch (err) {}

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