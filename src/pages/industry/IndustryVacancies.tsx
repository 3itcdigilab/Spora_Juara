import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import { localDB } from '../../services/db';
import { Job } from '../../data/types';
import { Plus, MapPin, Users, PauseCircle, PlayCircle, Trash2, Edit3, Briefcase } from 'lucide-react';

export const IndustryVacancies: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const rawJobs = useMemo(() => {
    return localDB.getJobs();
  }, [refreshKey]);

  const allApplications = useMemo(() => {
    return localDB.getApplications();
  }, [refreshKey]);

  const filteredJobs = useMemo(() => {
    return rawJobs.filter((job: any) => {
      const matchTab = activeTab === 'All' || job.status.toLowerCase() === activeTab.toLowerCase();
      const matchSearch = search.trim() === '' || 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [rawJobs, activeTab, search]);

  const handleToggleStatus = (jobId: string, currentStatus: Job['status']) => {
    const newStatus: Job['status'] = currentStatus === 'active' ? 'paused' : 'active';
    localDB.updateJob(jobId, { status: newStatus });
    setRefreshKey(prev => prev + 1);
    showToast(`Job status changed to ${newStatus}.`, 'info');
  };

  const handleDeleteJob = (jobId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete vacancy "${title}"?`)) {
      localDB.deleteJob(jobId);
      setRefreshKey(prev => prev + 1);
      showToast('Vacancy deleted.', 'warning');
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">EV Vacancies & Recruitment</h1>
          <p className="text-xs sm:text-sm text-slate-500">Manage active job openings, applicant pipelines, and posting statuses.</p>
        </div>

        <Link to="/industry/post-job">
          <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold flex items-center gap-2">
            <Plus size={16} /> Post New Vacancy
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
        <Tabs 
          tabs={[
            { id: 'All', label: `All Jobs (${rawJobs.length})` },
            { id: 'active', label: 'Active' },
            { id: 'paused', label: 'Paused' },
            { id: 'closed', label: 'Closed' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="w-full md:w-72">
          <SearchBar 
            placeholder="Search vacancies..." 
            value={search} 
            onChange={setSearch} 
          />
        </div>
      </div>

      {/* Vacancies Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 border-slate-200">
          <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">Belum Ada Lowongan Pekerjaan</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Belum ada lowongan pekerjaan yang diposting. Gunakan tombol '+ Post New Vacancy' di atas untuk mempublikasikan lowongan EV baru.
          </p>
          <Link to="/industry/post-job">
            <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold text-xs">
              + Post New Vacancy
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job: any) => {
            const appCount = allApplications.filter((a: any) => a.jobId === job.id).length;

            return (
              <Card key={job.id} className="p-6 flex flex-col justify-between border-slate-200 hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Badge 
                      variant={job.status === 'active' ? 'success' : job.status === 'paused' ? 'warning' : 'neutral'}
                      className="capitalize"
                    >
                      {job.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Users size={14} /> {appCount} Applicants
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 leading-snug mb-1">{job.title}</h3>
                  <p className="text-xs text-[#0099B8] font-bold mb-4">{job.department}</p>
                  
                  <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-medium">
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {job.location}</p>
                    <p className="flex items-center gap-2"><Briefcase size={14} className="text-slate-400" /> <span className="capitalize">{job.employmentType}</span></p>
                    <p className="flex items-center gap-2 font-bold text-slate-800">Rp {(job.salaryMin / 1000000).toFixed(1)}M - {(job.salaryMax / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link to="/industry/pipeline" className="flex-1">
                    <Button variant="outline" className="w-full text-xs font-bold text-slate-700">
                      View Applicants ({appCount})
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleToggleStatus(job.id, job.status)} 
                      className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                      title={job.status === 'active' ? 'Pause vacancy' : 'Activate vacancy'}
                    >
                      {job.status === 'active' ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id, job.title)} 
                      className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                      title="Delete vacancy"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
