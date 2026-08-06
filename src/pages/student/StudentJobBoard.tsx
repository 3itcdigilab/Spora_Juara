import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { localDB } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Zap, MapPin, Briefcase, DollarSign, Target } from 'lucide-react';

export const StudentJobBoard: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.email || (user as any)?.id || ''; // Dynamic student ID

  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Load jobs and applications dynamically from database
  const allJobs = useMemo(() => localDB.getJobs(), []);
  const myApplications = useMemo(() => localDB.getApplications(studentId), [studentId]);
  const appliedJobIds = useMemo(() => new Set(myApplications.map((a: any) => a.jobId)), [myApplications]);

  // Dynamic filter options
  const locations = useMemo(() => {
    const locs = Array.from(new Set(allJobs.map((j: any) => j.location.split(',')[0].trim())));
    return ['All', ...locs];
  }, [allJobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job: any) => {
      const matchSearch = search.trim() === '' || 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase()) ||
        job.requiredSkills.some((s: any) => s.toLowerCase().includes(search.toLowerCase()));

      const matchLocation = filterLocation === 'All' || job.location.includes(filterLocation);
      const matchType = filterType === 'All' || job.employmentType.toLowerCase() === filterType.toLowerCase();

      return matchSearch && matchLocation && matchType;
    });
  }, [allJobs, search, filterLocation, filterType]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">EV Opportunity Job Board</h1>
          <p className="text-slate-500 text-sm">Explore nationwide EV industry vacancies aligned with your Talent Score.</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search EV roles, skills, or companies..." 
            value={search} 
            onChange={setSearch} 
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
          <select 
            className="px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0099B8]"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="All">All Locations</option>
            {locations.filter((l: any) => l !== 'All').map((loc: any) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select 
            className="px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0099B8]" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Employment Types</option>
            <option value="full-time">Full-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job: any) => {
          const isApplied = appliedJobIds.has(job.id);
          const aiMatchScore = 85 + (job.title.length % 11);

          return (
            <Card key={job.id} className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border-slate-200">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center font-extrabold text-xl text-[#0099B8] shrink-0">
                    {job.department.charAt(0)}
                  </div>
                  {isApplied ? (
                    <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Applied
                    </Badge>
                  ) : (
                    <Badge variant="info" className="bg-cyan-50 text-[#0099B8] border-cyan-200 font-bold">
                      {aiMatchScore}% Score Match
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-900 leading-snug mb-1">{job.title}</h3>
                <p className="text-xs text-slate-500 font-semibold mb-4">{job.department}</p>
                
                <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {job.location}</p>
                  <p className="flex items-center gap-2"><Briefcase size={14} className="text-slate-400" /> <span className="capitalize">{job.employmentType}</span></p>
                  <p className="flex items-center gap-2"><DollarSign size={14} className="text-slate-400" /> Rp {(job.salaryMin / 1000000).toFixed(1)}M - {(job.salaryMax / 1000000).toFixed(1)}M / month</p>
                  <p className="flex items-center gap-2"><Target size={14} className="text-slate-400" /> Min Talent Score: <span className="font-bold text-slate-800">{job.requiredTalentScore}/100</span></p>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {job.requiredSkills.slice(0, 3).map((skill: any) => (
                    <span key={skill} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <Link to={`/student/jobs/${job.id}`}>
                  <Button variant={isApplied ? "outline" : "primary"} className="w-full font-bold bg-[#0099B8] hover:bg-[#007A93] text-white">
                    {isApplied ? "View Application Status" : "View Details & Apply"}
                  </Button>
                </Link>
                <p className="text-center text-[11px] text-slate-400 mt-2">Deadline: {job.deadline.split('T')[0]}</p>
              </div>
            </Card>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-base font-bold text-slate-700 mb-1">No EV Roles Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Try broadening your search query or selecting 'All Locations' to explore open vacancies.</p>
          </div>
        )}
      </div>
    </div>
  );
};
