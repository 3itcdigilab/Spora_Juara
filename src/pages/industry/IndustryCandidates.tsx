import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { Users, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';

export const IndustryCandidates: React.FC = () => {
  const { showToast } = useToast();
  const studentsPool = useMemo(() => {
    return localDB.getStudents();
  }, []);

  const [selected, setSelected] = useState<string[]>(() => {
    if (studentsPool.length > 0) {
      return studentsPool.slice(0, 3).map((s: any) => s.id);
    }
    return [];
  });

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const selectedStudents = useMemo(() => {
    return studentsPool.filter((s: any) => selected.includes(s.id));
  }, [studentsPool, selected]);

  if (studentsPool.length === 0) {
    return (
      <div className="space-y-6 font-sans pb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Side-by-Side Comparison</h1>
          <p className="text-slate-500 text-sm">Bandingkan nilai kompetensi dan kualifikasi kandidat siswa vokasi secara langsung.</p>
        </div>

        <Card className="p-16 text-center text-slate-500 border-slate-200">
          <Users size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">Belum Ada Kandidat Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Belum ada data siswa vokasi yang mendaftar ke platform. Ketika siswa melakukan pendaftaran, Anda dapat membandingkan nilai kompetensi dan mengundang kandidat di sini.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/industry/vacancies">
              <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold text-xs">
                Kelola Lowongan
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Candidate Side-by-Side Comparison</h1>
        <p className="text-slate-500 text-sm">Select up to 3 candidates for side-by-side competency & skill comparison.</p>
      </div>

      {/* Candidate Selector */}
      <Card className="p-4 border-slate-200">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Select Candidates to Compare ({selected.length}/3)</h3>
        <div className="flex flex-wrap gap-2">
          {studentsPool.map((s: any) => {
            const isSel = selected.includes(s.id);
            const candidateName = s.name || s.fullName || s.major || 'Kandidat Vokasi';
            return (
              <button
                key={s.id}
                onClick={() => toggleSelect(s.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSel ? 'bg-cyan-50 border-[#0099B8] text-[#0099B8]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSel ? '✓ ' : '+ '}{candidateName} ({s.major})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Comparison Grid */}
      {selectedStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedStudents.map((student: any) => {
            const candidateName = student.name || student.fullName || student.major || 'Kandidat Vokasi';
            const score = localDB.getTalentScore(student.id);

            return (
              <Card key={student.id} className="p-6 space-y-4 border-t-4 border-t-[#0099B8] border-slate-200 shadow-2xs hover:shadow-md transition-all font-sans">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-extrabold text-base text-slate-900">{candidateName}</h2>
                    <p className="text-xs text-[#0099B8] font-bold mt-0.5">{student.major}</p>
                    <p className="text-xs text-slate-400 font-semibold">{student.province || 'Jawa Barat'}, Indonesia</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0099B8] font-black text-lg shadow-2xs">
                    {score?.overall || student.score || 88}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Competencies Evaluation</h4>
                  {score?.dimensions?.map((dim: any) => (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{dim.label}</span>
                        <span className="text-slate-900 font-extrabold">{dim.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0099B8] h-full rounded-full" style={{ width: `${dim.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Verified Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {(student.skills || ['EV Battery Assembly', 'High Voltage Safety']).map((sk: string) => (
                      <Badge key={sk} variant="info" className="bg-cyan-50 text-[#0099B8] text-[10px] font-bold">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <Button variant="primary" className="w-full bg-[#0099B8] hover:bg-[#007A93] text-white font-bold text-xs" onClick={() => showToast('Invitation sent to candidate', 'success')}>
                    Invite Candidate to Apply
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center text-slate-500">
          <Users size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-700">No Candidates Selected</p>
          <p className="text-xs text-slate-400">Select candidates above to display side-by-side comparison details.</p>
        </Card>
      )}
    </div>
  );
};
