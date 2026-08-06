import { School } from './types';
export const mockSchools: School[] = Array.from({ length: 15 }, (_, i) => ({
  id: `school-${i + 1}`, name: ['SMKN 1 Cikarang', 'SMKN 2 Karawang', 'SMKN 1 Bekasi', 'SMKN 5 Surabaya', 'SMKN 2 Bandung', 'SMKN 1 Semarang', 'SMKN 3 Yogyakarta', 'SMKN 1 Medan', 'SMKN 2 Makassar'][i % 9],
  provinceId: 'prov-1', city: 'Cikarang', address: 'Jl. Pendidikan No. 1', type: 'Vocational',
  majors: ['Teknik Otomotif', 'Teknik Elektronika'], totalStudents: 1500, employmentRate: 85, avgTalentScore: 78,
  partnershipStatus: 'active'
}));