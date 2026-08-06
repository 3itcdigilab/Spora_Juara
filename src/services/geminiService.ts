// Google Gemini AI Service for Spora Juara

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const chatWithGemini = async (userPrompt: string, role: string = 'student', contextInfo?: string): Promise<string> => {
  const systemInstruction = `
    Anda adalah "Spora AI Recruiter & Career Assistant", AI Agent pintar terintegrasi dalam platform Spora Juara.
    Spora Juara adalah Ekosistem Vokasi & Industri Kendaraan Listrik (EV) di Indonesia.
    Tugas Anda adalah membantu pengguna (Siswa Vokasi/Kandidat, Mitra Industri EV, atau SMK):
    - Jika pengguna 'student': Berikan saran karir EV, bimbingan asesmen kompetensi, tips membuat portofolio perakitan EV, dan rekomendasi lowongan.
    - Jika pengguna 'industry': Bantu analisis kecocokan kandidat, kriteria asesmen psikometri & teknis, serta kebutuhan rekrutmen EV.
    - Jika pengguna 'school': Berikan saran penyelarasan kurikulum SMK dengan standar industri EV.
    
    Jawablah selalu secara profesional, ramah, meyakinkan, dalam bahasa Indonesia yang ringkas dan jelas.
  `;

  if (!GEMINI_API_KEY) {
    return generateFallbackAIResponse(userPrompt, role);
  }

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nUser Role: ${role}\nContext: ${contextInfo || 'None'}\n\nUser Question: ${userPrompt}` }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      return generateFallbackAIResponse(userPrompt, role);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      return reply;
    }
    return generateFallbackAIResponse(userPrompt, role);
  } catch (error) {
    return generateFallbackAIResponse(userPrompt, role);
  }
};

// Intelligent Fallback AI Response Generator
const generateFallbackAIResponse = (prompt: string, role: string): string => {
  const query = prompt.toLowerCase();

  if (query.includes('baterai') || query.includes('battery') || query.includes('pack')) {
    return "⚡ **Kompetensi EV Battery Assembly**: Industri EV sangat membutuhkan lulusan Vokasi dengan sertifikasi keselamatan tegangan tinggi (*High Voltage Safety 1000V*) dan keahlian *cell balancing testing*. Anda dapat melihat modul asesmen teknis Baterai EV di menu Asesmen!";
  }
  
  if (query.includes('job') || query.includes('lowongan') || query.includes('kerja') || query.includes('karir')) {
    return "💼 **Rekomendasi Karir EV Spora Juara**: Saat ini terdapat lowongan aktif dari mitra seperti Hyundai, Toyota, Wuling, CATL, dan PLN. Pastikan Talent Score Anda berada di atas 75/100 untuk meningkatkan peluang dilirik recruiter!";
  }

  if (query.includes('kurikulum') || query.includes('smk') || query.includes('sekolah')) {
    return "🎓 **Penyelarasan Kurikulum Vokasi EV**: Spora Juara memfasilitasi sekolah SMK untuk menyelaraskan modul praktik perakitan motor & baterai EV sesuai feedback langsung dari mitra industri kendaraan listrik.";
  }

  if (role === 'industry') {
    return "🏭 **Analisis Rekrutmen Industri**: Kandidat di Spora Juara dievaluasi berdasarkan 7 dimensi kompetensi terstandar BNSP. Anda dapat menyaring kandidat terbaik di menu *Talent Pool* atau *Recruitment Pipeline*.";
  }

  return "👋 Halo! Saya **Spora AI Assistant**. Ada yang ingin Anda tanyakan seputar kompetensi EV, asesmen sertifikasi Vokasi, atau lowongan kerja industri kendaraan listrik hari ini?";
};
