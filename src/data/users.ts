import { mockStudents } from './students';
import { mockSchools } from './schools';
import { mockIndustries } from './industries';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'school' | 'industry' | 'student';
  status: 'active' | 'pending' | 'rejected';
  directorName?: string;
  schoolName?: string;
  companyName?: string;
  school?: string;
  major?: string;
  graduationYear?: number;
  province?: string;
  city?: string;
  pics?: any[];
  createdAt?: string;
}

export const adminUser: BaseUser = {
  id: 'user-sporaadmin',
  name: 'Spora Admin',
  email: 'sporaadmin@spora.id',
  password: 'sporagreenenergy',
  role: 'admin',
  status: 'active',
  createdAt: '2026-08-01T00:00:00.000Z'
};

export const mockSchoolUsers: BaseUser[] = mockSchools.map((s, idx) => {
  const shortKey = s.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14);
  return {
    id: `user-${s.id}`,
    name: s.name,
    email: `${shortKey}@spora.id`,
    password: '123',
    role: 'school',
    status: 'active',
    schoolName: s.name,
    school: s.name,
    city: s.city,
    province: s.provinceId,
    createdAt: '2026-08-01T00:00:00.000Z'
  };
});

export const mockIndustryUsers: BaseUser[] = mockIndustries.map((ind, idx) => {
  const shortKey = ind.companyName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
  const picNames = ['Budi Santoso', 'Dewi Lestari', 'Ahmad Fauzi', 'Rina Kurnia', 'Hendra Gunawan', 'Fajar Nugraha', 'Maya Anggraini', 'Eko Prasetyo', 'Rizky Maulana', 'Dimas Kurnia', 'Andi Saputra', 'Nurul Hidayah'];
  const picRoles = ['HR & Talent Acquisition Lead', 'Technical Recruitment Manager', 'Plant HR Operations', 'Talent Sourcing Specialist', 'Head of People & Culture', 'Recruitment & Vocational Partner'];

  return {
    id: `user-${ind.id}`,
    name: ind.companyName,
    companyName: ind.companyName,
    email: `${shortKey}@spora.id`,
    password: '123',
    role: 'industry',
    status: 'active',
    directorName: idx % 2 === 0 ? 'Direktur Eksekutif PT EV' : 'Direktur Operasional & SDM',
    city: ind.city,
    province: ind.provinceId,
    pics: [
      {
        id: `pic-${idx + 1}`,
        name: picNames[idx % picNames.length],
        role: picRoles[idx % picRoles.length],
        email: `hr.${shortKey}@spora.id`,
        phone: `0812${(10000000 + idx * 77341).toString().slice(0, 8)}`,
        notes: 'Kontak utama rekrutmen lulusan vokasi EV.'
      }
    ],
    createdAt: '2026-08-01T00:00:00.000Z'
  };
});

export const mockStudentUsers: BaseUser[] = mockStudents.map((st) => ({
  id: st.userId || `user-${st.id}`,
  name: st.name,
  email: st.email,
  password: '123',
  role: 'student',
  status: 'active',
  schoolName: st.schoolName,
  school: st.school,
  major: st.major,
  graduationYear: st.graduationYear,
  province: st.province,
  city: st.city,
  createdAt: '2026-08-01T00:00:00.000Z'
}));

export const mockAllUsers: BaseUser[] = [
  adminUser,
  ...mockSchoolUsers,
  ...mockIndustryUsers,
  ...mockStudentUsers
];
