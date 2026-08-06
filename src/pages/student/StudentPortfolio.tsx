import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { TagInput } from '../../components/ui/TagInput';
import { useToast } from '../../components/ui/Toast';
import { Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { localDB } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

export const StudentPortfolio: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const studentId = user?.email || '';

  const [projects, setProjects] = useState(() => localDB.getPortfolio(studentId));
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [tags, setTags] = useState<string[]>(['EV Battery', 'Simulation']);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showToast('Please fill in title and description.', 'warning');
      return;
    }

    const newProj = localDB.addPortfolioProject({
      studentId,
      title,
      description,
      imageUrl: '',
      projectUrl: projectUrl || '#',
      tags
    });

    setProjects([newProj, ...projects]);
    setModalOpen(false);
    setTitle('');
    setDescription('');
    setProjectUrl('');
    showToast(`Project "${title}" added to portfolio!`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500">Showcase your projects and practical engineering achievements.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj: any) => (
          <Card key={proj.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-40 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center text-cyan-600">
              <ImageIcon size={48} />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{proj.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{proj.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.tags?.map((t: string) => (
                  <Badge key={t} variant="info" className="text-[10px]">{t}</Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <span className="text-xs text-gray-500">{proj.completedDate || proj.date}</span>
                <a href={proj.projectUrl || proj.link || '#'} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View Project <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add Portfolio Project">
        <form onSubmit={handleAddProject} className="space-y-4 pt-4">
          <Input label="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. EV Battery Thermal BMS" required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
              rows={3} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your design, role, and practical result..."
              required
            />
          </div>
          <Input label="Project Link / GitHub (Optional)" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://github.com/..." />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags / Tech Stack</label>
            <TagInput tags={tags} onTagsChange={setTags} placeholder="Add a tag and press Enter" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
