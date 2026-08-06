import { Profile } from './types';
export const mockProfiles: Profile[] = Array.from({ length: 25 }, (_, i) => ({
  id: `profile-${i + 1}`, studentId: `student-${i + 1}`,
  fullName: ['Budi Santoso', 'Siti Rahmawati', 'Ahmad Fauzi', 'Dewi Lestari', 'Rizky Pratama', 'Anisa Putri', 'Hendra Wijaya', 'Fajar Nugroho'][i % 8],
  dateOfBirth: '2005-05-15', gender: i % 2 === 0 ? 'Male' : 'Female', phone: '08123456789', address: 'Jl. Merdeka No. 10',
  bio: 'Passionate about EV technology.', linkedinUrl: 'https://linkedin.com', portfolioUrl: 'https://github.com'
}));