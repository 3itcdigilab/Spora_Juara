import { Job } from './types';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    industryId: 'industry-1', // Hyundai
    title: 'EV Battery Pack Assembly Technician',
    description: 'Responsible for high-voltage battery module assembly, cell balance testing, thermal management system integration, and safety checks in our modern Cikarang plant.',
    department: 'Hyundai Motor Manufacturing',
    location: 'Cikarang, Jawa Barat',
    employmentType: 'full-time',
    salaryMin: 6500000,
    salaryMax: 8500000,
    requiredTalentScore: 75,
    requiredSkills: ['EV Battery Assembly', 'High Voltage Safety', 'Quality Control', 'Electrical Testing'],
    requiredCertifications: ['K3 Listrik Tegangan Tinggi', 'BNSP Otomotif EV'],
    status: 'active',
    postedAt: '2026-07-15T08:00:00Z',
    deadline: '2026-08-30T23:59:59Z'
  },
  {
    id: 'job-2',
    industryId: 'industry-2', // Toyota
    title: 'Electric Motor Winding Specialist',
    description: 'Perform stator coil winding, rotor balance calibration, and insulation resistance testing for next-generation electric motor drive units.',
    department: 'Toyota Motor Manufacturing',
    location: 'Karawang, Jawa Barat',
    employmentType: 'contract',
    salaryMin: 5800000,
    salaryMax: 7200000,
    requiredTalentScore: 70,
    requiredSkills: ['Electric Motor Winding', 'PLC Programming', 'Safety Protocols', 'Precision Measurement'],
    requiredCertifications: ['K3 Umum'],
    status: 'active',
    postedAt: '2026-07-20T09:30:00Z',
    deadline: '2026-09-05T23:59:59Z'
  },
  {
    id: 'job-3',
    industryId: 'industry-3', // Wuling
    title: 'EV Maintenance & Diagnostic Specialist',
    description: 'Diagnose OBD-III EV error codes, inspect inverter power electronics, and execute firmware updates on commercial and passenger electric vehicles.',
    department: 'Wuling Motors Indonesia',
    location: 'Bekasi, Jawa Barat',
    employmentType: 'full-time',
    salaryMin: 7000000,
    salaryMax: 10000000,
    requiredTalentScore: 80,
    requiredSkills: ['BMS Diagnostics', 'Power Electronics', 'EV Wiring Harness', 'AutoCAD'],
    requiredCertifications: ['K3 Listrik', 'Diagnostik Otomotif'],
    status: 'active',
    postedAt: '2026-07-25T10:00:00Z',
    deadline: '2026-08-28T23:59:59Z'
  },
  {
    id: 'job-4',
    industryId: 'industry-4', // CATL
    title: 'Battery Cell Quality Control Inspector',
    description: 'Conduct strict quality assurance inspections on lithium-ion battery cells, checking internal impedance, electrolyte seal integrity, and voltage stability.',
    department: 'CATL Indonesia',
    location: 'Karawang, Jawa Barat',
    employmentType: 'full-time',
    salaryMin: 6000000,
    salaryMax: 8000000,
    requiredTalentScore: 72,
    requiredSkills: ['Quality Control', 'Lithium-Ion Cell Testing', 'Statistical Process Control', 'Safety Protocols'],
    requiredCertifications: ['ISO 9001 Lead Auditor', 'K3 Umum'],
    status: 'active',
    postedAt: '2026-07-10T11:15:00Z',
    deadline: '2026-08-25T23:59:59Z'
  },
  {
    id: 'job-5',
    industryId: 'industry-5', // LG Energy
    title: 'Battery Management System (BMS) Calibration Specialist',
    description: 'Calibrate state-of-charge (SOC) algorithms, state-of-health (SOH) monitors, and over-current protection thresholds for industrial energy storage packs.',
    department: 'LG Energy Solution',
    location: 'Cikarang, Jawa Barat',
    employmentType: 'full-time',
    salaryMin: 8000000,
    salaryMax: 12000000,
    requiredTalentScore: 82,
    requiredSkills: ['BMS Firmware', 'Power Electronics', 'Electrical Testing', 'CAN Bus Protocol'],
    requiredCertifications: ['BNSP Sistem Kontrol EV'],
    status: 'active',
    postedAt: '2026-07-28T14:00:00Z',
    deadline: '2026-09-15T23:59:59Z'
  },
  {
    id: 'job-6',
    industryId: 'industry-9', // PLN
    title: 'EV Fast Charging Infrastructure Operator',
    description: 'Manage 150kW Ultra-Fast SPKLU charging stations, perform transformer grid synchronization, and troubleshoot high-voltage DC charging connectors.',
    department: 'PLN Icon Plus EV Division',
    location: 'Jakarta Selatan, DKI Jakarta',
    employmentType: 'contract',
    salaryMin: 5500000,
    salaryMax: 7500000,
    requiredTalentScore: 68,
    requiredSkills: ['Charging Infrastructure', 'HV Grid Connection', 'Safety Protocols', 'Customer Service'],
    requiredCertifications: ['Teknisi Otomasi Listrik'],
    status: 'active',
    postedAt: '2026-07-18T16:00:00Z',
    deadline: '2026-09-01T23:59:59Z'
  },
  {
    id: 'job-7',
    industryId: 'industry-7', // GoTo / Electrum
    title: 'EV Two-Wheeler Conversion Mechanic',
    description: 'Convert conventional ICE motorcycles to electric drive systems, installing brushless DC motors, controller units, and quick-swap battery bays.',
    department: 'GoTo / Electrum EV Workshop',
    location: 'Bandung, Jawa Barat',
    employmentType: 'full-time',
    salaryMin: 5000000,
    salaryMax: 6800000,
    requiredTalentScore: 65,
    requiredSkills: ['Motorcycle EV Conversion', 'BLDC Motor Mounting', 'Wiring Harness Integration'],
    requiredCertifications: ['Sertifikasi Konversi Sepeda Motor Listrik Kemenhub'],
    status: 'active',
    postedAt: '2026-07-22T13:20:00Z',
    deadline: '2026-08-31T23:59:59Z'
  },
  {
    id: 'job-8',
    industryId: 'industry-10', // United Tractors
    title: 'Heavy Duty EV Fleet Service Technician',
    description: 'Perform preventive maintenance and sensor diagnostics on electric buses and heavy industrial haul trucks equipped with dual-inverter motors.',
    department: 'United Tractors EV Fleet',
    location: 'Surabaya, Jawa Timur',
    employmentType: 'full-time',
    salaryMin: 7500000,
    salaryMax: 11000000,
    requiredTalentScore: 78,
    requiredSkills: ['Heavy Machinery EV Maintenance', 'Hydraulic Systems', 'Safety Protocols', 'CAN Diagnostics'],
    requiredCertifications: ['K3 Alat Berat', 'Teknisi Listrik Industri'],
    status: 'active',
    postedAt: '2026-07-12T09:00:00Z',
    deadline: '2026-08-20T23:59:59Z'
  }
];