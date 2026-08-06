import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, MapPin, Mail, Download, GraduationCap, Award } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { localDB } from '../../services/db';

export const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const candidate = useMemo(() => {
    if (!id) return localDB.getStudentById('student-1');
    return localDB.getStudentById(id) || localDB.getStudentById('student-1');
  }, [id]);

  const score = useMemo(() => {
    return localDB.getTalentScore(candidate.id);
  }, [candidate]);

  const candidateName = candidate.name || candidate.fullName || candidate.userId || 'Kandidat Vokasi EV';
  const schoolName = candidate.school || candidate.schoolName || 'SMK Negeri 1 Cikarang';
  const major = candidate.major || 'Teknik Kendaraan Ringan (Otomotif EV)';
  const province = candidate.province || 'Jawa Barat';
  const skills = candidate.skills || ['EV Battery Assembly', 'High Voltage Safety', 'Quality Control'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-10">
      <Link to="/industry/talent-pool" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-[#0099B8] transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Talent Pool
      </Link>
      
      <Card className="p-6 md:p-8 border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm shrink-0">
              {candidateName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{candidateName}</h1>
              <p className="text-xs font-bold text-[#0099B8] mt-0.5">{major} • {schoolName}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-semibold">
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400"/> {province}, Indonesia</span>
                <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-slate-400"/> {candidate.email || 'candidate@vokasi.id'}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3 w-full md:w-auto">
            <Button variant="outline" className="text-xs font-bold flex-1 md:flex-initial">Add to Shortlist</Button>
            <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white text-xs font-bold flex-1 md:flex-initial">Invite to Apply</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Profile Overview</h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              Kandidat lulusan vokasi berkualitas tinggi dengan keahlian praktis dalam sistem otomotif kendaraan listrik (EV), perakitan baterai modul, dan verifikasi keselamatan kerja High Voltage.
            </p>
            
            <div>
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Verified Competencies & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: string) => (
                  <Badge key={s} variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 text-xs font-semibold px-3 py-1">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">Curriculum Vitae / Resume</h2>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
              <div className="flex items-center text-xs font-bold text-slate-800">
                <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-black text-xs mr-3">PDF</div> 
                CV_{candidateName.replace(/\s+/g, '_')}.pdf
              </div>
              <Button variant="outline" size="sm" className="text-xs font-bold">
                <Download className="w-3.5 h-3.5 mr-1.5"/> Download CV
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">National Talent Score</h2>
            <div className="text-center mb-6 bg-cyan-50 p-4 rounded-xl border border-cyan-100">
              <div className="text-4xl font-black text-[#0099B8]">{score?.overall || 88}</div>
              <div className="text-xs font-bold text-slate-600 mt-1">Overall Competency Score</div>
            </div>
            <div className="space-y-3 text-xs">
              {score?.dimensions?.map((dim: any) => (
                <div key={dim.key}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">{dim.label}</span>
                    <span className="text-slate-900 font-bold">{dim.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#0099B8] h-full rounded-full" style={{ width: `${dim.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
