import { Certificate } from './types';
export const mockCertificates: Certificate[] = Array.from({ length: 20 }, (_, i) => ({
  id: `cert-${i + 1}`, studentId: `student-${i + 1}`, name: 'K3 Umum', issuingBody: 'BNSP',
  issueDate: '2023-01-01', expiryDate: '2026-01-01', fileUrl: '', status: 'verified', type: 'competency'
}));