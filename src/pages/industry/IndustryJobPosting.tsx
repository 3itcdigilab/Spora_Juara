import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TagInput } from '../../components/ui/TagInput';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export const IndustryJobPosting: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Cikarang, Jawa Barat');
  const [type, setType] = useState<'full-time' | 'contract' | 'internship'>('full-time');
  const [salaryMin, setSalaryMin] = useState(6000000);
  const [salaryMax, setSalaryMax] = useState(9000000);
  const [scoreReq, setScoreReq] = useState(75);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>(['EV Battery Assembly', 'High Voltage Safety']);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showToast('Please fill in job title and description.', 'warning');
      return;
    }

    localDB.postJob({
      industryId: user?.email || (user as any)?.id || 'ind-1',
      title,
      department,
      location,
      employmentType: type,
      salaryMin,
      salaryMax,
      requiredTalentScore: scoreReq,
      requiredSkills: skills,
      requiredCertifications: ['High Voltage Safety Level 1'],
      description,
      status: 'active'
    });

    showToast(`Vacancy "${title}" published live!`, 'success');
    navigate('/industry/vacancies');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Post New Vacancy</h1>
        <p className="text-slate-500 text-sm">Create an EV competency-focused job listing to reach qualified SMK graduates.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handlePublish} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Job Title" 
                placeholder="e.g. EV Battery Assembly Technician" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Engineering">Engineering & Production</option>
                <option value="Assembly">Assembly Line</option>
                <option value="Quality Control">Quality Assurance & Safety</option>
                <option value="Maintenance">Infrastructure & Charging</option>
              </select>
            </div>

            <div>
              <Input 
                label="Location" 
                placeholder="e.g. Cikarang, Jawa Barat" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={type}
                onChange={(e: any) => setType(e.target.value)}
              >
                <option value="full-time">Full-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship (Magang Vokasi)</option>
              </select>
            </div>

            <div>
              <Input 
                label="Minimum Talent Score Required (0-100)" 
                type="number" 
                value={scoreReq} 
                onChange={(e) => setScoreReq(parseInt(e.target.value))} 
              />
            </div>

            <div>
              <Input 
                label="Minimum Monthly Salary (IDR)" 
                type="number" 
                value={salaryMin} 
                onChange={(e) => setSalaryMin(parseInt(e.target.value))} 
              />
            </div>

            <div>
              <Input 
                label="Maximum Monthly Salary (IDR)" 
                type="number" 
                value={salaryMax} 
                onChange={(e) => setSalaryMax(parseInt(e.target.value))} 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills</label>
              <TagInput tags={skills} onTagsChange={setSkills} placeholder="Add required skill (e.g. High Voltage Safety)" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
              <textarea 
                rows={6} 
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Describe role responsibilities, battery assembly processes, and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => navigate('/industry/vacancies')}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]">Publish Vacancy</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
