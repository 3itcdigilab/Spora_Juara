import { Student } from './types';

export interface ExtendedStudent extends Student {
  name: string;
  fullName?: string;
  email: string;
  nisn: string;
  phone?: string;
  bio?: string;
  schoolName: string;
  school: string;
  schoolToken?: string;
  isSchoolVerified?: boolean;
  score: number;
}

const firstNames = [
  'Rizky', 'Budi', 'Ahmad', 'Dimas', 'Bayu', 'Fajar', 'Muhammad', 'Eko', 'Andi', 'Denny',
  'Siti', 'Anisa', 'Dewi', 'Nur', 'Putri', 'Rina', 'Tri', 'Wahyu', 'Bambang', 'Hendra',
  'Aditya', 'Farhan', 'Rafi', 'Dicky', 'Ilham', 'Gilang', 'Yoga', 'Galih', 'Danang', 'Arif',
  'Lestari', 'Maya', 'Nabila', 'Rara', 'Sari', 'Indah', 'Tia', 'Zahra', 'Melani', 'Fitri',
  'Bagas', 'Doni', 'Alif', 'Aldi', 'Reza', 'Gema', 'Rio', 'Agus', 'Yusuf', 'Iman'
];

const lastNames = [
  'Pratama', 'Santoso', 'Fauzi', 'Setiawan', 'Nugroho', 'Hidayat', 'Saputra', 'Wijaya', 'Kusuma', 'Permana',
  'Rahmawati', 'Lestari', 'Putri', 'Wulandari', 'Utami', 'Anggraini', 'Astuti', 'Pramesti', 'Safitri', 'Kurniawan',
  'Syahputra', 'Maulana', 'Firmansyah', 'Pangestu', 'Subekti', 'Wibowo', 'Gunawan', 'Hartono', 'Susanto', 'Purwanto',
  'Siregar', 'Nasution', 'Batubara', 'Harahap', 'Ginting', 'Sembiring', 'Sinaga', 'Panjaitan', 'Simanjuntak', 'Sitompul'
];

const schoolPool = [
  { name: 'SMKN 1 Cikarang Pusat', city: 'Kab. Bekasi', province: 'Jawa Barat', schoolId: 'school-1' },
  { name: 'SMKN 2 Karawang', city: 'Kab. Karawang', province: 'Jawa Barat', schoolId: 'school-2' },
  { name: 'SMKN 1 Bekasi', city: 'Kota Bekasi', province: 'Jawa Barat', schoolId: 'school-3' },
  { name: 'SMKN 2 Bandung', city: 'Kota Bandung', province: 'Jawa Barat', schoolId: 'school-4' },
  { name: 'SMKN 5 Surabaya', city: 'Kota Surabaya', province: 'Jawa Timur', schoolId: 'school-5' },
  { name: 'SMKN 1 Semarang', city: 'Kota Semarang', province: 'Jawa Tengah', schoolId: 'school-6' },
  { name: 'SMKN 2 Surakarta', city: 'Kota Surakarta', province: 'Jawa Tengah', schoolId: 'school-7' },
  { name: 'SMKN 3 Yogyakarta', city: 'Kota Yogyakarta', province: 'DI Yogyakarta', schoolId: 'school-8' },
  { name: 'SMKN 1 Tangerang', city: 'Kota Tangerang', province: 'Banten', schoolId: 'school-9' },
  { name: 'SMKN 26 Jakarta', city: 'Jakarta Timur', province: 'DKI Jakarta', schoolId: 'school-10' },
  { name: 'SMKN 1 Medan', city: 'Kota Medan', province: 'Sumatera Utara', schoolId: 'school-11' },
  { name: 'SMKN 2 Makassar', city: 'Kota Makassar', province: 'Sulawesi Selatan', schoolId: 'school-12' }
];

const majorPool = [
  'Teknik Kendaraan Ringan (Otomotif EV)',
  'Teknik Mekatronika & Otomasi EV',
  'Teknik Baterai & Elektronika Daya',
  'Teknik Tenaga Listrik & SPKLU',
  'Teknik Otomasi Industri & Robotika EV',
  'Teknik Fabrikasi & Manufaktur Rangka EV'
];

const skillPool = [
  ['EV Battery Assembly', 'BMS Testing', 'High Voltage Safety Level 1', 'Wiring Harness'],
  ['Electric Motor Winding', 'Inverter Diagnostics', 'CAN Bus Protocol', 'Oscilloscope'],
  ['SPKLU Installation', 'Power Electronics', 'Electrical Safety', 'PLC Programming'],
  ['Battery Cell Balancing', 'Thermal Management', 'Soldering & Crimping', 'Quality Control'],
  ['Chassis & Suspension EV', 'Torque Tool Calibration', 'Diagnostic Scanner', '5S Standards'],
  ['Pneumatics & Hydraulics', 'Sensor Kalibrasi', 'SolidWorks CAD', 'AutoCAD Electrical'],
  ['LFP & NMC Battery Chemistry', 'Spot Welding', 'Multimeter Precision', 'Preventive Maintenance'],
  ['EV Powertrain Retrofit', 'DC Fast Charging Protocol', 'Safety Lockout/Tagout (LOTO)', 'Inspection']
];

const bioPool = [
  'Lulusan vokasi berprestasi dengan sertifikasi keselamatan tegangan tinggi (High Voltage Safety) dan pengalaman magang perakitan baterai EV.',
  'Spesialis diagnostik sistem kelistrikan kendaraan listrik roda dua dan instalasi stasiun penukaran baterai (BSS).',
  'Memiliki keahlian dalam perakitan motor listrik BLDC/PMSM, pengujian modul inverter, dan kalibrasi sensor daya.',
  'Terbiasa bekerja dengan standar industri manufaktur otomotif global (5S, Kaizen, ISO 9001) dan perakitan harness presisi.',
  'Fokus pada Battery Management System (BMS), balancing sel lithium, dan pengujian siklus termal baterai kendaraan listrik.',
  'Terampil dalam pemeliharaan preventif charging station (SPKLU), sistem proteksi arus bocor, dan kelistrikan industri.'
];

export const mockStudents: (Student & { name: string; fullName: string; email: string; nisn: string; phone: string; bio: string; schoolName: string; school: string; score: number })[] = Array.from({ length: 100 }, (_, idx) => {
  const fName = firstNames[idx % firstNames.length];
  const lName = lastNames[(idx * 3 + 7) % lastNames.length];
  const fullName = `${fName} ${lName}`;
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${idx + 1}@spora.id`;
  const nisn = `007${(1234500 + idx + 1).toString().padStart(7, '0')}`;
  const schoolObj = schoolPool[idx % schoolPool.length];
  const major = majorPool[idx % majorPool.length];
  const skills = skillPool[idx % skillPool.length];
  const bio = bioPool[idx % bioPool.length];
  const gradYear = 2024 + (idx % 3);
  const score = 78 + ((idx * 7) % 20); // 78 to 97

  return {
    id: `stu-${idx + 1}`,
    userId: `user-${idx + 1}`,
    name: fullName,
    fullName: fullName,
    email: email,
    nisn: nisn,
    phone: `0812${(10000000 + idx * 83457).toString().slice(0, 8)}`,
    bio: bio,
    schoolId: schoolObj.schoolId,
    schoolName: schoolObj.name,
    school: schoolObj.name,
    isSchoolVerified: true,
    major: major,
    graduationYear: gradYear,
    province: schoolObj.province,
    city: schoolObj.city,
    skills: skills,
    languages: ['Bahasa Indonesia (Native)', idx % 2 === 0 ? 'Bahasa Inggris (Teknis)' : 'Bahasa Inggris (Dasar)'],
    resumeUrl: `/resumes/cv-${fName.toLowerCase()}-${idx + 1}.pdf`,
    careerInterest: major.includes('Baterai') ? 'Teknisi Baterai EV' : (major.includes('Motor') ? 'Spesialis Motor Listrik' : 'Teknisi Perakitan & QC EV'),
    profileCompletion: 85 + (idx % 16), // 85% to 100%
    status: idx % 3 === 0 ? 'graduated' : 'active',
    score: score
  };
});