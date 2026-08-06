import { Industry } from './types';
export const mockIndustries: Industry[] = Array.from({ length: 12 }, (_, i) => ({
  id: `industry-${i + 1}`, companyName: ['Hyundai', 'Toyota', 'Wuling', 'CATL', 'LG Energy', 'Foxconn', 'GoTo Group', 'Grab', 'PLN', 'United Tractors', 'Astra', 'Blue Bird'][i],
  sector: 'Automotive & EV', provinceId: 'prov-1', city: 'Jakarta', logoUrl: '/logos/hyundai.png',
  description: 'Leading EV manufacturer in Indonesia.', totalEmployees: 5000, activeVacancies: 15, totalHires: 120, partnershipTier: 'platinum'
}));