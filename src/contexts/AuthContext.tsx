import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB } from '../services/db';
import { getAll, addItem, updateItem, findOne } from '../services/firestoreSync';

export interface User {
  name: string;
  email: string;
  nisn?: string;
  schoolToken?: string;
  isSchoolVerified?: boolean;
  avatarUrl?: string;
  status?: 'active' | 'pending' | 'rejected';
  directorName?: string;
  schoolName?: string;
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
  login: (e: string, p: string) => Promise<{ success: boolean; status?: string; role?: string; message?: string }>;
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

  const login = async (e: string, p: string): Promise<{ success: boolean; status?: string; role?: string; message?: string }> => {
    const users = getAll('users');
    const cleanInput = e.toLowerCase().trim();

    // Check by email, NISN, or username
    let foundUser = users.find((u: any) => 
      (u.email && u.email.toLowerCase().trim() === cleanInput) ||
      (u.nisn && u.nisn.toString().trim() === cleanInput) ||
      (cleanInput === 'sporaadmin' && (u.email.toLowerCase().includes('sporaadmin') || u.name?.toLowerCase().includes('sporaadmin')))
    );

    if (!foundUser && (cleanInput === 'sporaadmin' || cleanInput === 'sporaadmin@spora.id')) {
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
      return { success: false, message: 'Akun / NISN belum terdaftar atau password salah.' };
    }

    const resolvedName = foundUser.name || 'User';
    const roleName = foundUser.role || 'student';
    const userStatus = foundUser.status || 'active';
    let userAvatar = foundUser.avatarUrl || '';

    if (roleName === 'student') {
      const studentProfile = localDB.getProfile(foundUser.email);
      if (studentProfile?.avatarUrl) userAvatar = studentProfile.avatarUrl;
    }

    if (!userAvatar) {
      if (roleName === 'admin') userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
      else if (roleName === 'industry') userAvatar = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150';
      else if (roleName === 'school') userAvatar = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150';
      else userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    }

    const newState: AuthState = {
      user: {
        ...foundUser,
        name: resolvedName,
        email: foundUser.email,
        nisn: foundUser.nisn,
        schoolToken: foundUser.schoolToken,
        isSchoolVerified: foundUser.isSchoolVerified,
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
    return { success: true, status: userStatus, role: roleName };
  };

  const register = async (dataOrEmail: any, password?: string, role?: string) => {
    const isObj = typeof dataOrEmail === 'object';
    const email = isObj ? dataOrEmail.email : dataOrEmail;
    const pwd = isObj ? dataOrEmail.password : password;
    const roleName = role || (isObj ? dataOrEmail.role : 'student');
    const name = isObj && dataOrEmail.name ? dataOrEmail.name : 'Candidate';
    const nisn = isObj ? dataOrEmail.nisn : undefined;
    const schoolToken = isObj ? dataOrEmail.schoolToken : undefined;
    const isSchoolVerified = isObj ? dataOrEmail.isSchoolVerified : true;

    const status = (roleName === 'industry' || roleName === 'school') ? 'pending' : 'active';

    const newUserEntry = { 
      ...dataOrEmail, 
      email, 
      nisn,
      schoolToken,
      isSchoolVerified,
      password: pwd, 
      name, 
      role: roleName, 
      status, 
      avatarUrl: '' 
    };

    const existingUser = findOne('users', (u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      updateItem('users', existingUser.id, newUserEntry);
    } else {
      addItem('users', newUserEntry);
    }

    // If student, also sync to students & profiles in localDB
    if (roleName === 'student') {
      localDB.saveProfile({
        studentId: email.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        fullName: name,
        nisn: nisn || '',
        phone: dataOrEmail.phone || '',
        address: `${dataOrEmail.city || ''}, ${dataOrEmail.province || ''}`,
        bio: `Siswa vokasi EV ${dataOrEmail.school || ''} jurusan ${dataOrEmail.major || ''}.`
      });

      const studentEntry = {
        id: `stu-${Date.now()}`,
        userId: `user-${Date.now()}`,
        name: name,
        fullName: name,
        email: email.toLowerCase().trim(),
        nisn: nisn || '',
        schoolName: dataOrEmail.school || 'SMKN 1 Cikarang',
        school: dataOrEmail.school || 'SMKN 1 Cikarang',
        schoolToken: schoolToken || '',
        isSchoolVerified: Boolean(isSchoolVerified),
        major: dataOrEmail.major || 'Teknik Kendaraan Ringan (Otomotif EV)',
        graduationYear: parseInt(dataOrEmail.graduationYear, 10) || 2025,
        province: dataOrEmail.province || 'Jawa Barat',
        city: dataOrEmail.city || 'Kabupaten Bekasi',
        status: 'active',
        score: typeof dataOrEmail.score === 'number' ? dataOrEmail.score : 85,
        profileCompletion: 90
      };
      addItem('students', studentEntry);
    }

    const newState: AuthState = {
      user: {
        ...newUserEntry,
        name,
        email,
        nisn,
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
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = findOne('users', (u: any) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      updateItem('users', existingUser.id, { status: 'active' });
    }
  };

  const rejectUser = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = findOne('users', (u: any) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      updateItem('users', existingUser.id, { status: 'rejected' });
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