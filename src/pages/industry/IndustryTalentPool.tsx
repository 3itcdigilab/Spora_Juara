import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, GraduationCap, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CandidateCard } from '../../components/talent/CandidateCard';
import { localDB } from '../../services/db';

export const IndustryTalentPool: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterProvince, setFilterProvince] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync real candidate list from localDB and localStorage spora_students_db
  const candidates = useMemo(() => {
    const rawDb = localStorage.getItem('spora_students_db');
    let dbStudents = rawDb ? JSON.parse(rawDb) : [];

    // Also get from localDB
    const dbList = localDB.getStudents();
    dbList.forEach((st: any) => {
      if (!dbStudents.some((d: any) => d.id === st.id)) {
        dbStudents.push(st);
      }
    });

    return dbStudents;
  }, [refreshKey]);

  // Filter candidates based on search & province
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c: any) => {
      const matchSearch = !search.trim() || 
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.school?.toLowerCase().includes(search.toLowerCase()) ||
        c.major?.toLowerCase().includes(search.toLowerCase()) ||
        c.skills?.some((sk: string) => sk.toLowerCase().includes(search.toLowerCase()));

      const matchProvince = filterProvince === 'All' || c.province === filterProvince || c.school?.includes(filterProvince);
      return matchSearch && matchProvince;
    });
  }, [candidates, search, filterProvince]);

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">National EV Talent Pool</h1>
          <p className="text-xs sm:text-sm text-slate-500">Database nasional kandidat siswa vokasi EV terverifikasi standar industri.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search candidate, school, major..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0099B8]" 
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-xs text-slate-900 flex items-center"><Filter className="w-4 h-4 mr-1 text-[#0099B8]"/> Filters</h2>
            <button className="text-xs font-bold text-[#0099B8] hover:underline" onClick={() => { setSearch(''); setFilterProvince('All'); }}>Reset</button>
          </div>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Province Location</label>
              <select className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white" value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)}>
                <option value="All">All Provinces</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Banten">Banten</option>
              </select>
            </div>
            
            <div className="pt-2">
              <Button size="sm" variant="outline" className="w-full text-xs flex items-center justify-center gap-1.5" onClick={() => setRefreshKey(k => k + 1)}>
                <RefreshCw size={12} /> Refresh Database
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 text-xs">
            <span className="text-slate-500 font-bold">
              Showing {filteredCandidates.length} Registered Candidate(s)
            </span>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <Users size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-800 text-base mb-1">Belum Ada Data Siswa Terdaftar</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Database kandidat siswa vokasi saat ini kosong. Siswa yang mendaftar atau ditambahkan oleh Institusi Pendidikan akan muncul di sini secara otomatis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCandidates.map((candidate: any) => (
                <CandidateCard key={candidate.id} student={candidate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
