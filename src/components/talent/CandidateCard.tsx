import React from 'react';
import { MapPin, GraduationCap, UserCheck } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { localDB } from '../../services/db';

interface CandidateCardProps {
  student?: any;
  id?: string | number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ student, id }) => {
  // If student object is not passed, fetch by id or fallback safely
  const candidate = student || (id ? localDB.getStudentById(id.toString()) : null);

  if (!candidate) return null;

  const candidateName = candidate.name || candidate.fullName || candidate.userId || `Kandidat Vokasi EV`;
  const schoolName = candidate.school || candidate.schoolName || 'SMK Negeri 1 Cikarang';
  const major = candidate.major || 'Teknik Kendaraan Ringan (Otomotif EV)';
  const province = candidate.province || 'Jawa Barat';
  const skills = candidate.skills || ['EV Battery Assembly', 'High Voltage Safety', 'Quality Control'];
  const score = candidate.score || localDB.getTalentScore(candidate.id)?.overall || 88;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all relative font-sans flex flex-col justify-between">
      <div className="absolute top-4 right-4 w-11 h-11 bg-cyan-50 rounded-2xl flex items-center justify-center border border-cyan-200">
        <span className="text-[#0099B8] font-black text-sm">{score}</span>
      </div>
      
      <div>
        <div className="flex items-center space-x-3.5 mb-4 pr-12">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-2xs shrink-0">
            {(candidateName || 'K').charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-slate-900 text-base truncate">{candidateName}</h3>
            <div className="flex items-center text-xs text-slate-500 font-semibold mt-0.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 mr-1 text-[#0099B8] shrink-0" /> {schoolName}
            </div>
            <div className="flex items-center text-xs text-slate-400 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" /> {province}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-[11px] font-bold text-[#0099B8] mb-2">{major}</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((sk: string) => (
              <Badge key={sk} variant="info" className="bg-slate-100 text-slate-700 font-medium text-[10px] border-none px-2 py-0.5">
                {sk}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-4 pt-3 border-t border-slate-100">
        <Link to={`/industry/talent-pool/${candidate.id}`} className="flex-1">
          <Button variant="outline" className="w-full text-xs font-bold text-slate-700 hover:bg-slate-50">
            View Profile
          </Button>
        </Link>
        <Button variant="primary" className="flex-1 text-xs font-bold bg-[#0099B8] hover:bg-[#007A93] text-white">
          Invite
        </Button>
      </div>
    </div>
  );
};
