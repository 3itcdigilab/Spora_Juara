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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job: any) => {
          const appCount = allApplications.filter((a: any) => a.jobId === job.id).length;

          return (
            <Card key={job.id} className="p-6 flex flex-col justify-between border-slate-200 hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    variant={job.status === 'active' ? 'success' : job.status === 'paused' ? 'warning' : 'neutral'}
                    className="capitalize font-bold text-xs"
                  >
                    {job.status}
                  </Badge>
                  
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Users size={12} /> {appCount} Applicants
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 leading-snug mb-1">{job.title}</h3>
                <p className="text-xs font-bold text-[#0099B8] mb-4">{job.department}</p>

                <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {job.location}</p>
                  <p className="flex items-center gap-2"><Briefcase size={14} className="text-slate-400" /> <span className="capitalize">{job.employmentType}</span></p>
                  <p className="flex items-center gap-2"><span className="text-emerald-600 font-bold">Rp {(job.salaryMin / 1000000).toFixed(1)}M - {(job.salaryMax / 1000000).toFixed(1)}M</span></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to="/industry/pipeline" className="flex-1">
                  <Button variant="outline" className="w-full text-xs font-bold text-[#0099B8] border-[#0099B8] hover:bg-cyan-50">
                    View Applicants ({appCount})
                  </Button>
                </Link>

                <button 
                  onClick={() => handleToggleStatus(job.id, job.status)}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors"
                  title={job.status === 'active' ? 'Pause Vacancy' : 'Activate Vacancy'}
                >
                  {job.status === 'active' ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                </button>

                <button 
                  onClick={() => handleDeleteJob(job.id, job.title)}
                  className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Vacancy"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-base font-bold text-slate-800 mb-1">No Vacancies Found</p>
            <p className="text-xs text-slate-500 mb-4">You have not created any job vacancies matching this filter.</p>
            <Link to="/industry/post-job">
              <Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold text-xs">
                Post New EV Vacancy
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
