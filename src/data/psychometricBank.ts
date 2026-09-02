export interface QuestionItem {
  id: string;
  assessmentId: string;
  category: 'Green Energy' | 'Logika & Mekanikal' | 'K3 Tegangan Tinggi' | 'Etos Kerja & Karakter' | 'Situational Judgment' | 'Learning Agility';
  dimension: 'technical' | 'safety' | 'psychometric' | 'learningAgility' | 'communication';
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const defaultQuestionBank: QuestionItem[] = [
  // --- PILAR 1: GREEN ENERGY & SUSTAINABILITY (4 Soal) ---
  {
    id: 'q-green-1',
    assessmentId: 'ass-1',
    category: 'Green Energy',
    dimension: 'technical',
    text: 'Mengapa efisiensi konversi energi dari sistem baterai ke motor listrik (Powertrain EV) lebih unggul dibandingkan mesin pembakaran dalam (ICE) dalam mendukung dekarbonisasi?',
    options: [
      'EV mampu mengonversi lebih dari 80-90% energi listrik menjadi daya gerak roda tanpa emisi gas buang langsung (tailpipe emission)',
      'Mesin ICE tidak membutuhkan pendinginan oli sama sekali',
      'Baterai EV menghasilkan bahan bakar fosil sintetis secara otomatis',
      'Motor listrik menggunakan bahan bakar minyak hanya saat kecepatan tinggi'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Motor listrik memiliki efisiensi konversi energi sangat tinggi (80-90%) dibandingkan ICE yang hanya sekitar 20-30%, sehingga memangkas emisi karbon secara signifikan.',
    difficulty: 'medium'
  },
  {
    id: 'q-green-2',
    assessmentId: 'ass-1',
    category: 'Green Energy',
    dimension: 'technical',
    text: 'Dalam siklus hidup baterai kendaraan listrik (Battery Lifecycle), apa yang dimaksud dengan pemanfaatan Second-Life Battery sebelum proses daur ulang (recycling)?',
    options: [
      'Menggunakan kembali modul baterai berkapasitas ~70-80% untuk penyimpanan energi stasioner (Energy Storage System / Solar PV)',
      'Membuang sel baterai ke tempat pembuangan akhir tanpa dipisah',
      'Mengisi ulang baterai dengan cairan asam sulfat pekat',
      'Membakar kemasan baterai untuk menghasilkan energi uap'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Baterai EV yang kapasitasnya turun ke 70-80% tidak lagi optimal untuk kendaraan tetapi sangat bernilai sebagai ESS (Energy Storage System) untuk menyimpan listrik tenaga surya (Solar PV).',
    difficulty: 'medium'
  },
  {
    id: 'q-green-3',
    assessmentId: 'ass-1',
    category: 'Green Energy',
    dimension: 'safety',
    text: 'Mengapa integrasi Stasiun Pengisian Kendaraan Listrik Umum (SPKLU) dengan Pembangkit Listrik Tenaga Surya (PLTS) Rooftop merupakan pilar penting ekosistem Green Energy?',
    options: [
      'Memastikan sumber energi listrik yang masuk ke baterai kendaraan benar-benar berasal dari energi baru terbarukan (Clean Energy)',
      'Menghilangkan kebutuhan kabel tembaga dalam stasiun pengisian',
      'Membuat baterai EV dapat terisi penuh hanya dalam 1 detik',
      'Mencegah motor listrik mengalami keausan mekanis pada ban'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Kombinasi SPKLU dan PLTS menciptakan ekosistem closed-loop zero emission di mana kendaraan listrik diisi oleh energi terbarukan murni.',
    difficulty: 'easy'
  },
  {
    id: 'q-green-4',
    assessmentId: 'ass-1',
    category: 'Green Energy',
    dimension: 'safety',
    text: 'Sesuai prinsip Circular Economy dan K3 Lingkungan, bagaimana penanganan modul baterai Lithium Ferrofosfat (LFP) yang telah rusak atau terbakar?',
    options: [
      'Ditempatkan pada wadah isolasi pasir/drum khusus B3, diberi label bahaya, dan diserahkan ke fasilitas daur ulang logam terakreditasi',
      'Dilarutkan langsung ke saluran air limbah industri',
      'Ditimbun bersama sampah domestik umum tanpa pelindung',
      'Dihancurkan dengan palu besi di area terbuka'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Limbah baterai lithium tergolong limbah B3 yang harus diamankan dalam container inert khusus sebelum proses pemurnian kembali logam nikel, kobalt, atau lithium.',
    difficulty: 'hard'
  },

  // --- PILAR 2: LOGIKA & PENALARAN SISTEM MEKANIKAL LISTRIK (3 Soal) ---
  {
    id: 'q-logic-1',
    assessmentId: 'ass-1',
    category: 'Logika & Mekanikal',
    dimension: 'technical',
    text: 'Jika sebuah motor listrik BLDC tidak berputar meskipun tegangan baterai normal dan controller aktif, urutan diagnosa logis manakah yang paling tepat?',
    options: [
      'Periksa sensor Hall effect motor → Cek sambungan kabel 3-phase UVW → Uji throttle input sinyal ke controller',
      'Langsung ganti motor listrik baru tanpa pengecekan kabel',
      'Naikkan voltase baterai hingga dua kali lipat untuk memaksa putaran',
      'Potong seluruh kabel harness dan sambungkan ulang acak'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Diagnosa sistematis dimulai dari sensor umpan balik posisi rotor (Hall Sensor), integritas kabel fase (UVW), dan sinyal throttle pengendali.',
    difficulty: 'medium'
  },
  {
    id: 'q-logic-2',
    assessmentId: 'ass-1',
    category: 'Logika & Mekanikal',
    dimension: 'technical',
    text: 'Pada sistem pendingin cair (liquid cooling) pack baterai EV, jika temperatur sel bagian tengah meningkat tajam sedangkan sel pinggir normal, apa kemungkinan penyebab logisnya?',
    options: [
      'Penyumbatan aliran coolant di saluran tengah atau thermal paste mengering pada modul tengah',
      'Ban kendaraan kekurangan tekanan udara',
      'Kabel lampu sein mengalami korsleting',
      'Kapasitas memori komputer dashboard penuh'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Distribusi panas yang tidak merata menandakan gangguan pada sirkulasi fluida pendingin di modul spesifik atau kegagalan thermal interface material (TIM).',
    difficulty: 'medium'
  },
  {
    id: 'q-logic-3',
    assessmentId: 'ass-1',
    category: 'Logika & Mekanikal',
    dimension: 'technical',
    text: 'Sebuah rangkaian seri terdiri dari 20 sel baterai lithium masing-masing 3.7V 50Ah. Berapakah total voltase dan kapasitas arus nominal pack tersebut?',
    options: [
      '74V dan 50Ah',
      '3.7V dan 1000Ah',
      '740V dan 50Ah',
      '37V dan 100Ah'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Rangkaian seri: Voltase total = 20 × 3.7V = 74V, sedangkan kapasitas arus tetap sama yaitu 50Ah.',
    difficulty: 'easy'
  },

  // --- PILAR 3: KESADARAN K3 & TEGANGAN TINGGI (HIGH VOLTAGE SAFETY) (4 Soal) ---
  {
    id: 'q-safety-1',
    assessmentId: 'ass-1',
    category: 'K3 Tegangan Tinggi',
    dimension: 'safety',
    text: 'Sebelum teknisi menyentuh terminal kabel oranye High Voltage (HV) pada kendaraan listrik, langkah keselamatan nomor 1 yang mutlak harus dilakukan adalah:',
    options: [
      'Cabut Service Disconnect Plug (SDP) / Manual Service Disconnect (MSD), tunggu discharge 5-10 menit, dan verifikasi nol volt (Zero Voltage Check)',
      'Langsung memotong kabel menggunakan tang potong tanpa isolasi',
      'Menyiram modul baterai dengan air dingin untuk meredakan suhu',
      'Menguji kabel dengan sentuhan jari tangan secara cepat'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'LOTO (Lockout/Tagout) dan pelepasan MSD diikuti verifikasi nol volt dengan multimeter berstandar CAT III/IV 1000V adalah SOP standar keselamatan internasional.',
    difficulty: 'easy'
  },
  {
    id: 'q-safety-2',
    assessmentId: 'ass-1',
    category: 'K3 Tegangan Tinggi',
    dimension: 'safety',
    text: 'Jenis sarung tangan keselamatan apa yang wajib digunakan saat menangani modul baterai sistem 400V - 800V DC?',
    options: [
      'Sarung tangan karet insulasi tegangan tinggi Class 0 / Class 00 (1000V) dilapisi sarung tangan pelindung mekanis kulit',
      'Sarung tangan kain katun rajut tipis',
      'Sarung tangan plastik sekali pakai',
      'Sarung tangan oven dapur tahan panas biasa'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Kombinasi sarung tangan karet berinsulasi dielektrik standar ASTM/EN60903 dan pelindung kulit luar melindungi teknisi dari sengatan listrik dan tusukan tajam.',
    difficulty: 'easy'
  },
  {
    id: 'q-safety-3',
    assessmentId: 'ass-1',
    category: 'K3 Tegangan Tinggi',
    dimension: 'safety',
    text: 'Jika terjadi tanda-tanda Thermal Runaway (keluar asap putih tebal, desisan gas, kenaikan suhu ekstrem) pada baterai EV di workshop, tindakan darurat pertama adalah:',
    options: [
      'Bunyikan alarm darurat, evakuasi seluruh personil dari arah angin, putuskan sumber daya utama, dan gunakan sistem pemadam kabut air bertekanan tinggi / pasir khusus',
      'Mendekat untuk menghirup asap guna mengenali jenis bahan kimia yang terbakar',
      'Menutup rapat pintu ruangan agar asap tidak keluar',
      'Menyiram dengan bensin agar cepat habis terbakar'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Thermal runaway menghasilkan gas beracun (HF, CO) dan panas tinggi. Evakuasi cepat dan isolasi area adalah prioritas utama keselamatan jiwa.',
    difficulty: 'hard'
  },
  {
    id: 'q-safety-4',
    assessmentId: 'ass-1',
    category: 'K3 Tegangan Tinggi',
    dimension: 'safety',
    text: 'Mengapa teknisi dilarang memakai cincin logam, kalung, jam tangan logam, atau sabuk gesper besi saat merakit baterai pack EV?',
    options: [
      'Logam pada tubuh dapat menyebabkan hubung singkat langsung (direct short circuit) berarus ribuan ampere yang memicu ledakan busur api (arc flash)',
      'Agar pakaian terlihat lebih santai dan modis',
      'Karena cincin logam dapat menyerap sinyal bluetooth controller',
      'Supaya berat badan teknisi tetap seimbang'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Benda konduktif yang menyentuh terminal baterai bertegangan akan menimbulkan arus lonjakan seketika yang dapat melelehkan logam dan melukai teknisi parah.',
    difficulty: 'easy'
  },

  // --- PILAR 4: KARAKTER & ETOS KERJA INDUSTRI (CONSCIENTIOUSNESS) (3 Soal) ---
  {
    id: 'q-work-1',
    assessmentId: 'ass-1',
    category: 'Etos Kerja & Karakter',
    dimension: 'psychometric',
    text: 'Saat melakukan pengencangan baut busbar baterai pack menggunakan Kunci Momen (Torque Wrench), Anda melihat spesifikasi torsi adalah 9.5 Nm. Sikap profesional Anda adalah:',
    options: [
      'Mengatur kunci momen tepat 9.5 Nm, mengencangkan hingga bunyi klik terverifikasi, dan memberi tanda cat inspeksi (torque marking) pada baut',
      'Mengencangkan sekuat tenaga dengan kunci biasa tanpa kalibrasi torsi',
      'Membiarkannya longgar agar mudah dilepas saat servis nanti',
      'Mengira-ngira kekencangan baut dengan perasaan tangan'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Presisi torsi sangat krusial pada modul baterai EV untuk mencegah resistansi kontak berlebih (panas) atau kerusakan ulir busbar.',
    difficulty: 'easy'
  },
  {
    id: 'q-work-2',
    assessmentId: 'ass-1',
    category: 'Etos Kerja & Karakter',
    dimension: 'psychometric',
    text: 'Dalam budaya kerja 5S/5R di lini manufaktur otomotif EV, apa yang Anda lakukan jika menemukan alat multimeter tergeletak di lantai jalur perakitan?',
    options: [
      'Segera mengambilnya, membersihkan, dan meletakkannya kembali ke rak shadow board penyimpanan alat yang sesuai (Seiton)',
      'Membiarkannya karena bukan Anda yang meletakkannya di sana',
      'Menendangnya ke sudut ruangan agar tidak mengganggu jalan',
      'Menunggu giliran petugas kebersihan membersihkannya di akhir shift'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Inisiatif menjaga kerapihan dan keselamatan lingkungan kerja mencerminkan disiplin standar industri tinggi (Kaizen & 5S).',
    difficulty: 'easy'
  },
  {
    id: 'q-work-3',
    assessmentId: 'ass-1',
    category: 'Etos Kerja & Karakter',
    dimension: 'psychometric',
    text: 'Bagaimana reaksi Anda ketika pekerjaan perakitan modul yang Anda selesaikan dinilai belum memenuhi standar Quality Control (QC)?',
    options: [
      'Menerima masukan QC secara terbuka, mempelajari titik kesalahan dengan teliti, dan memperbaiki komponen sesuai standar mutu tanpa rasa kesal',
      'Menyalahkan rekan kerja yang menyiapkan bahan baku',
      'Mendebat staf QC dan meminta agar produk diloloskan saja',
      'Menyembunyikan komponen yang cacat agar tidak terlihat supervisor'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Sikap akuntabel dan komitmen terhadap continuous quality improvement adalah karakter utama teknisi vokasi unggulan.',
    difficulty: 'easy'
  },

  // --- PILAR 5: SITUATIONAL JUDGMENT & KERJASAMA TIM (3 Soal) ---
  {
    id: 'q-sjt-1',
    assessmentId: 'ass-1',
    category: 'Situational Judgment',
    dimension: 'communication',
    text: 'Target perakitan harian tinggal 15 menit lagi, namun Anda melihat rekan kerja Anda bekerja di area High Voltage tanpa memasang pelindung mata (Face Shield). Apa tindakan Anda?',
    options: [
      'Segera menegur rekan dengan sopan dan mengingatkan untuk memakai APD sebelum melanjutkan, keselamatan kerja lebih penting dari mengejar target',
      'Mendiamkannya agar target harian tim tidak terganggu',
      'Mengambil foto rekan diam-diam untuk diviralkan di media sosial',
      'Meninggalkan workshop agar tidak terlibat bila terjadi kecelakaan'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Budaya keselamatan (Safety Culture) menuntut setiap personil saling menjaga dan mengutamakan Zero Accident di atas kuantitas output.',
    difficulty: 'medium'
  },
  {
    id: 'q-sjt-2',
    assessmentId: 'ass-1',
    category: 'Situational Judgment',
    dimension: 'communication',
    text: 'Saat pergantian shift (handover), Anda menemukan satu alat uji isolasi menunjukkan hasil pengukuran yang mencurigakan. Apa yang harus Anda sampaikan kepada tim shift berikutnya?',
    options: [
      'Menjelaskan kondisi alat secara detail dalam logbook serah terima dan menempelkan label "Under Inspection" pada alat tersebut',
      'Tidak perlu memberitahu agar shift berikutnya yang mencari tahu sendiri',
      'Membuang logbook agar tidak terlihat ada masalah teknis',
      'Menyatakan bahwa semua alat dalam kondisi 100% sempurna'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Komunikasi transparan dan dokumentasi logbook serah terima menjamin kesinambungan operasional pabrik yang aman dan handal.',
    difficulty: 'medium'
  },
  {
    id: 'q-sjt-3',
    assessmentId: 'ass-1',
    category: 'Situational Judgment',
    dimension: 'communication',
    text: 'Tim Anda mengalami perbedaan pendapat mengenai metode pemasangan harness motor listrik. Sebagai anggota tim, pendekatan apa yang paling konstruktif?',
    options: [
      'Membuka panduan teknis manufaktur (Service Manual / Blueprint), berdiskusi secara objektif berdasarkan data manual, dan menyepakati solusi terbaik bersama',
      'Memaksakan pendapat pribadi dengan suara paling keras',
      'Melakukan mogok kerja dan menolak berpartisipasi',
      'Memilih cara yang paling cepat meskipun menyalahi blueprint'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Penyelesaian masalah berbasis data manual teknis adalah etika profesional dalam rekayasa engineering otomotif.',
    difficulty: 'medium'
  },

  // --- PILAR 6: LEARNING AGILITY & ADAPTASI TEKNOLOGI HIJAU (3 Soal) ---
  {
    id: 'q-agility-1',
    assessmentId: 'ass-1',
    category: 'Learning Agility',
    dimension: 'learningAgility',
    text: 'Perusahaan memperkenalkan software diagnostik ECU/BMS versi baru yang belum pernah Anda pelajari di sekolah. Langkah proaktif yang Anda ambil adalah:',
    options: [
      'Mempelajari modul panduan pengguna secara mandiri, mengikuti sesi pelatihan dengan antusias, dan aktif bertanya kepada lead engineer',
      'Menolak menggunakan software baru dan tetap memakai cara manual lama',
      'Menunggu sampai dipaksa oleh manajemen baru mulai belajar',
      'Meminta dipindahkan ke divisi non-teknis agar tidak perlu belajar software'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Learning Agility tinggi ditunjukkan oleh inisiatif mandiri dalam menguasai tool teknologi digital terbaru yang terus berkembang pesat.',
    difficulty: 'easy'
  },
  {
    id: 'q-agility-2',
    assessmentId: 'ass-1',
    category: 'Learning Agility',
    dimension: 'learningAgility',
    text: 'Industri EV kini bergerak cepat mengadopsi teknologi baterai generasi baru seperti Semi-Solid State dan Sodium-Ion. Bagaimana Anda memposisikan diri menghadapi perubahan ini?',
    options: [
      'Rutin membaca publikasi teknologi Green Mobility, memperbarui pengetahuan dasar kimia sel, dan siap beradaptasi dengan protokol keselamatan baru',
      'Menganggap teknologi lama sudah cukup untuk selamanya',
      'Merasa cemas dan berhenti mengejar karir di bidang kendaraan listrik',
      'Menghindari segala bentuk informasi tentang teknologi baru'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Kemampuan beradaptasi dengan tren masa depan (Future-ready mindset) adalah pembeda talenta juara di ekosistem energi hijau.',
    difficulty: 'medium'
  },
  {
    id: 'q-agility-3',
    assessmentId: 'ass-1',
    category: 'Learning Agility',
    dimension: 'learningAgility',
    text: 'Ketika Anda melakukan kesalahan dalam memasang sensor kabel CAN Bus saat pelatihan, apa respon yang paling bernilai bagi perkembangan karir Anda?',
    options: [
      'Menganalisis mengapa kesalahan terjadi, mencatat pelajaran teknisnya (Lessons Learned), dan memastikan tidak mengulangi kesalahan yang sama',
      'Merasa putus asa dan menganggap diri tidak cocok di bidang kelistrikan',
      'Menyembunyikan kesalahan agar instruktur tidak tahu',
      'Menyalahkan instruktur karena penjelasannya kurang jelas'
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: 'Growth Mindset memandang kegagalan sebagai kesempatan emas untuk belajar dan menyempurnakan keterampilan teknis.',
    difficulty: 'easy'
  }
];

export function calculatePsychometricResult(answers: Record<string, string>): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  dimensions: {
    technical: number;
    safety: number;
    psychometric: number;
    learningAgility: number;
    communication: number;
  };
  archetype: {
    title: string;
    description: string;
    badge: string;
    icon: string;
  };
  strengths: string[];
  growthAreas: string[];
} {
  const dimensionTotals: Record<string, { earned: number; max: number }> = {
    technical: { earned: 0, max: 0 },
    safety: { earned: 0, max: 0 },
    psychometric: { earned: 0, max: 0 },
    learningAgility: { earned: 0, max: 0 },
    communication: { earned: 0, max: 0 }
  };

  let totalEarned = 0;
  const maxScore = defaultQuestionBank.length * 5; // 20 * 5 = 100

  defaultQuestionBank.forEach((q) => {
    const dim = q.dimension;
    dimensionTotals[dim].max += q.points;
    const userAnswer = answers[q.id];
    if (userAnswer === q.correctAnswer) {
      dimensionTotals[dim].earned += q.points;
      totalEarned += q.points;
    }
  });

  const getDimPct = (dim: string) => {
    const d = dimensionTotals[dim];
    return d.max > 0 ? Math.round((d.earned / d.max) * 100) : 80;
  };

  const dimScores = {
    technical: getDimPct('technical'),
    safety: getDimPct('safety'),
    psychometric: getDimPct('psychometric'),
    learningAgility: getDimPct('learningAgility'),
    communication: getDimPct('communication')
  };

  const pct = Math.round((totalEarned / maxScore) * 100);

  // Determine Archetype
  let archetype = {
    title: 'The Green Mobility Pioneer',
    description: 'Kandidat memiliki wawasan holistik mengenai transisi energi hijau, dasar teknis EV yang kuat, dan potensi kepemimpinan di masa depan.',
    badge: 'Green Tech Pioneer',
    icon: '🌱'
  };

  if (dimScores.safety >= 85 && dimScores.technical >= 80) {
    archetype = {
      title: 'The High-Voltage Safety Champion & Precision Specialist',
      description: 'Sangat teliti dengan kesadaran K3 tingkat tinggi pada sistem baterai tegangan tinggi. Cocok untuk posisi QC, Perakitan Baterai, dan Maintenance SPKLU.',
      badge: 'Safety & QC Master',
      icon: '⚡'
    };
  } else if (dimScores.learningAgility >= 85) {
    archetype = {
      title: 'The Agile Innovation & Systems Specialist',
      description: 'Memiliki kecepatan belajar luar biasa dalam mengadopsi software baru, diagnostik controller, dan teknologi Green Energy mutakhir.',
      badge: 'Agile Systems Specialist',
      icon: '🚀'
    };
  } else if (dimScores.psychometric >= 85 && dimScores.communication >= 80) {
    archetype = {
      title: 'The Collaborative Industrial Leader',
      description: 'Etos kerja 5S solid, disiplin tinggi, dan kemampuan koordinasi tim handover yang luar biasa untuk lini manufaktur otomotif.',
      badge: 'Industrial Team Lead',
      icon: '🤝'
    };
  }

  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (dimScores.safety >= 80) strengths.push('Pemahaman kuat terhadap SOP K3 Tegangan Tinggi dan penanganan darurat.');
  else growthAreas.push('Tingkatkan pengenalan APD berinsulasi 1000V dan prosedur Lockout/Tagout (LOTO).');

  if (dimScores.technical >= 80) strengths.push('Penguasaan mendalam mengenai efisiensi Green Energy dan sirkuit baterai EV.');
  else growthAreas.push('Perdalam pemahaman integrasi SPKLU dengan PLTS dan siklus hidup baterai.');

  if (dimScores.learningAgility >= 80) strengths.push('Adaptasi cepat terhadap perkembangan software diagnostik dan kimia baterai.');
  else growthAreas.push('Tingkatkan eksplorasi mandiri terhadap teknologi baterai generasi baru.');

  if (dimScores.psychometric >= 80) strengths.push('Ketelitian tinggi dalam standar torsi presisi dan budaya kerja 5S.');
  if (dimScores.communication >= 80) strengths.push('Kemampuan komunikasi transparan dan kerjasama tim yang konstruktif.');

  return {
    totalScore: totalEarned,
    maxScore,
    percentage: pct,
    dimensions: dimScores,
    archetype,
    strengths: strengths.length > 0 ? strengths : ['Memiliki motivasi tinggi dalam berkarir di industri EV.'],
    growthAreas: growthAreas.length > 0 ? growthAreas : ['Pertahankan performa dan lanjutkan sertifikasi BNSP.']
  };
}
