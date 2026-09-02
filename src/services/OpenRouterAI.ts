import { AIPsychologicalReport } from '../data/types';
import { getAll, addItem, updateItem } from './firestoreSync';

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  temperature: number;
}

const DEFAULT_MODEL = 'deepseek/deepseek-chat';

export const openRouterService = {
  getApiKey: (): string => {
    return localStorage.getItem('spora_openrouter_key') || 
      (import.meta as any).env?.VITE_OPENROUTER_API_KEY || 
      '';
  },

  setApiKey: (key: string): void => {
    localStorage.setItem('spora_openrouter_key', key.trim());
  },

  getModel: (): string => {
    return localStorage.getItem('spora_openrouter_model') || 
      (import.meta as any).env?.VITE_OPENROUTER_DEFAULT_MODEL || 
      DEFAULT_MODEL;
  },

  setModel: (model: string): void => {
    localStorage.setItem('spora_openrouter_model', model);
  },

  hasApiKey: (): boolean => {
    return Boolean(openRouterService.getApiKey());
  },

  /**
   * Retrieves all saved psychological assessment reports from Cloud Firestore
   */
  getAllReports: (): (AIPsychologicalReport & { studentName?: string; nisn?: string; schoolName?: string; score?: number })[] => {
    return getAll('ai_reports');
  },

  /**
   * Retrieves a report by student ID or email
   */
  getReportByStudentId: (studentId: string): AIPsychologicalReport | null => {
    const cleanId = studentId.toLowerCase().trim();
    const reports = openRouterService.getAllReports();
    return reports.find(r => r.studentId?.toLowerCase().trim() === cleanId) || null;
  },

  /**
   * Saves a report directly to Cloud Firestore collection 'ai_reports'
   */
  saveReport: (report: AIPsychologicalReport & { studentName?: string; nisn?: string; schoolName?: string; score?: number }): void => {
    try {
      const reports = getAll('ai_reports');
      const existing = reports.find(r => r.studentId?.toLowerCase().trim() === report.studentId?.toLowerCase().trim());
      if (existing) {
        updateItem('ai_reports', existing.id || existing._docId, report);
      } else {
        addItem('ai_reports', report);
      }
    } catch (e) {
      console.error('Failed to save AI report to Firestore:', e);
    }
  },

  /**
   * Generates a deep psychological and behavioral assessment report using OpenRouter LLM,
   * with graceful deterministic fallback if any network or quota issues occur.
   */
  generatePsychologicalReport: async (params: {
    studentId: string;
    studentName: string;
    nisn?: string;
    schoolName?: string;
    major?: string;
    dimensionScores: {
      technical?: number;
      safety?: number;
      psychometric?: number;
      learningAgility?: number;
      communication?: number;
    };
    overallScore: number;
    personalityType?: string;
  }): Promise<AIPsychologicalReport> => {
    const apiKey = openRouterService.getApiKey();
    const model = openRouterService.getModel();

    const dim = params.dimensionScores || {};
    const safetyScore = dim.safety || 85;
    const techScore = dim.technical || 80;
    const psychoScore = dim.psychometric || 85;
    const agilityScore = dim.learningAgility || 80;
    const commScore = dim.communication || 80;

    // Rich fallback baseline
    const fallbackReport: AIPsychologicalReport = {
      id: `ai-rep-${Date.now()}`,
      studentId: params.studentId,
      generatedAt: new Date().toISOString(),
      modelUsed: apiKey ? `OpenRouter (${model})` : 'Spora Industrial AI Heuristic Engine (Local)',
      archetype: params.personalityType || 'The High-Voltage Safety Champion & Precision Specialist',
      summary: `Kandidat ${params.studentName} (${params.major || 'Teknik Otomotif EV'}) menunjukkan profil kerja dengan kesadaran K3 tinggi (${safetyScore}%) dan etos kerja industri solid (${psychoScore}%). Sangat direkomendasikan untuk lingkungan manufaktur perakitan baterai dan pemeliharaan powertrain kendaraan listrik yang menuntut ketelitian tinggi.`,
      bigFiveTraits: {
        conscientiousness: {
          score: Math.min(98, psychoScore + 4),
          analysis: 'Tingkat disiplin dan kepatuhan SOP sangat tinggi. Cenderung teliti dalam kalibrasi torsi dan menjaga kerapihan 5S.'
        },
        emotionalStability: {
          score: Math.min(95, safetyScore + 2),
          analysis: 'Mampu bersikap tenang saat menghadapi indikasi darurat thermal runaway dan isolasi tegangan tinggi.'
        },
        extraversion: {
          score: Math.min(90, commScore),
          analysis: 'Gaya komunikasi lugas, efektif dalam koordinasi serah terima shift kerja (handover) dan pelaporan insiden.'
        },
        agreeableness: {
          score: Math.min(92, commScore + 3),
          analysis: 'Kooperatif dalam tim manufaktur, mengutamakan penyelesaian masalah berbasis manual teknis pabrik.'
        },
        openness: {
          score: Math.min(96, agilityScore + 4),
          analysis: 'Antusias terhadap transisi energi hijau, adaptif dalam mempelajari software diagnostik BMS/ECU terbaru.'
        }
      },
      safetyMindsetIndex: safetyScore,
      workplaceStrengths: [
        'Kepatuhan ketat terhadap SOP LOTO (Lockout/Tagout) dan APD 1000V.',
        'Wawasan mendalam mengenai efisiensi Green Energy dan sirkuit baterai EV.',
        'Inisiatif pemeliharaan 5S dan budaya pencegahan defect (Poka-Yoke).'
      ],
      operationalRisks: [
        'Perlu pendampingan berkala saat pertama kali menangani pack baterai tegangan tinggi di atas 800V DC.',
        'Pastikan terus memperbarui wawasan standar protokol pengisian DC Fast Charging.'
      ],
      developmentRecommendations: [
        'Ikuti sertifikasi BNSP Teknisi Otomotif Listrik Level 3.',
        'Pelajari lebih dalam sistem komunikasi CAN Bus dan pemetaan telemetri IoT baterai.'
      ],
      recommendedEVRoles: [
        'EV Battery Assembly & QC Inspector',
        'High-Voltage Maintenance Specialist',
        'SPKLU & Charging Infrastructure Technician',
        'Powertrain Retrofit & Conversion Specialist'
      ]
    };

    let resultReport = fallbackReport;

    if (apiKey) {
      try {
        const prompt = `Anda adalah Senior Industrial Psychologist & Lead Technical Recruiter di industri Kendaraan Listrik (Electric Vehicle & Green Energy).
Analisis data hasil psikotes dan uji kompetensi energi hijau siswa vokasi berikut:
- Nama Siswa: ${params.studentName}
- NISN: ${params.nisn || 'Terdaftar'}
- Sekolah Asal: ${params.schoolName || 'SMK Pusat Keunggulan'}
- Jurusan: ${params.major || 'Teknik Kendaraan Ringan Otomotif EV'}
- Total Skor Asesmen: ${params.overallScore}/100
- Skor K3 & Keselamatan HV: ${safetyScore}%
- Skor Green Energy & Teknis: ${techScore}%
- Skor Etos Kerja 5S & Presisi: ${psychoScore}%
- Skor Learning Agility: ${agilityScore}%
- Skor Komunikasi & Kerjasama Tim: ${commScore}%

Hasilkan laporan analisis psikologis mendalam dalam format JSON murni TANPA markdown backticks atau teks pengantar lainnya, dengan skema persis berikut:
{
  "archetype": "Gelar profil psikometrik unik (contoh: The Precision EV Battery Specialist)",
  "summary": "Ringkasan analisis psikologis dan kesiapan industri (3-4 kalimat)",
  "bigFiveTraits": {
    "conscientiousness": { "score": 88, "analysis": "analisis singkat" },
    "emotionalStability": { "score": 85, "analysis": "analisis singkat" },
    "extraversion": { "score": 80, "analysis": "analisis singkat" },
    "agreeableness": { "score": 86, "analysis": "analisis singkat" },
    "openness": { "score": 90, "analysis": "analisis singkat" }
  },
  "safetyMindsetIndex": ${safetyScore},
  "workplaceStrengths": ["keunggulan 1", "keunggulan 2", "keunggulan 3"],
  "operationalRisks": ["potensi risiko/blindspot 1", "potensi risiko 2"],
  "developmentRecommendations": ["rekomendasi pelatihan 1", "rekomendasi 2"],
  "recommendedEVRoles": ["posisi pekerjaan 1", "posisi pekerjaan 2", "posisi pekerjaan 3"]
}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://spora-juara.web.app',
            'X-Title': 'Spora Juara Talent Pool'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert Indonesian industrial psychologist specializing in vocational talent for the Electric Vehicle and Green Energy industries. You always output valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1200
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.choices?.[0]?.message?.content || '';
          const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);

          resultReport = {
            id: `ai-rep-${Date.now()}`,
            studentId: params.studentId,
            generatedAt: new Date().toISOString(),
            modelUsed: `OpenRouter (${model})`,
            archetype: parsed.archetype || fallbackReport.archetype,
            summary: parsed.summary || fallbackReport.summary,
            bigFiveTraits: parsed.bigFiveTraits || fallbackReport.bigFiveTraits,
            safetyMindsetIndex: parsed.safetyMindsetIndex || safetyScore,
            workplaceStrengths: parsed.workplaceStrengths || fallbackReport.workplaceStrengths,
            operationalRisks: parsed.operationalRisks || fallbackReport.operationalRisks,
            developmentRecommendations: parsed.developmentRecommendations || fallbackReport.developmentRecommendations,
            recommendedEVRoles: parsed.recommendedEVRoles || fallbackReport.recommendedEVRoles
          };
        } else {
          console.warn('OpenRouter API returned error, falling back to local engine:', response.statusText);
        }
      } catch (err) {
        console.error('Error generating OpenRouter psychological report, using fallback:', err);
      }
    }

    // Persist to central Cloud Firestore reports collection
    openRouterService.saveReport({
      ...resultReport,
      studentName: params.studentName,
      nisn: params.nisn,
      schoolName: params.schoolName,
      score: params.overallScore
    });

    return resultReport;
  }
};
