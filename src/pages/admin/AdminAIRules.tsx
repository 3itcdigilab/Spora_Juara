import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { defaultScoreConfig } from '../../data/scoreConfig';
import { Sparkles, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminAIRules: React.FC = () => {
  const { showToast } = useToast();
  
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('spora_score_config');
    return saved ? JSON.parse(saved) : defaultScoreConfig;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newWeight, setNewWeight] = useState(10);
  const [newDescription, setNewDescription] = useState('');

  const dimensions = config.dimensions || [];
  const totalWeight = Math.round(dimensions.reduce((acc: number, d: any) => acc + (d.weight * 100), 0));
  const isValidTotal = totalWeight === 100;

  const handleWeightChange = (key: string, newPct: number) => {
    const updatedDims = dimensions.map((d: any) => {
      if (d.key === key) {
        return { ...d, weight: newPct / 100 };
      }
      return d;
    });
    setConfig({ ...config, dimensions: updatedDims });
  };

  const handleAddDimension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newKey) {
      showToast('Please enter dimension key and label', 'warning');
      return;
    }
    const newDim = {
      key: newKey.toLowerCase().replace(/\s+/g, '_'),
      label: newLabel,
      weight: newWeight / 100,
      source: 'Custom Assessment',
      description: newDescription || 'Custom AI evaluation dimension',
      color: '#8B5CF6'
    };

    const updatedDims = [...dimensions, newDim];
    const newConf = { ...config, dimensions: updatedDims };
    setConfig(newConf);
    setIsModalOpen(false);
    setNewKey('');
    setNewLabel('');
    showToast(`Added dimension "${newLabel}"`, 'success');
  };

  const handleSaveConfig = () => {
    localStorage.setItem('spora_score_config', JSON.stringify(config));
    showToast('AI Rules & Talent Score weights updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader 
        title="AI Matching & Talent Rules" 
        subtitle="Configure the 7-dimension Talent Score weights, threshold limits, and dynamic calculation rules."
        actions={
          <Button onClick={handleSaveConfig} disabled={!isValidTotal} variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]">
            Save AI Rules
          </Button>
        }
      />
      
      {/* Weight Summary Banner */}
      <Card className="p-6 border-l-4 border-violet-500 bg-violet-50/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Talent Score Dimension Weights</h3>
              <p className="text-sm text-slate-500">Total Weight Sum must equal 100%. Current sum: <span className={isValidTotal ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>{totalWeight}%</span></p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> Add Custom Dimension
          </Button>
        </div>

        {!isValidTotal && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            Adjust sliders so that the total weight equals exactly 100% before saving.
          </div>
        )}
      </Card>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <h4 className="font-bold text-slate-900 text-base border-b pb-3">Dimension Weight Sliders</h4>
          
          <div className="space-y-5">
            {dimensions.map((dim: any) => {
              const pct = Math.round(dim.weight * 100);
              return (
                <div key={dim.key} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-800 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dim.color || '#3B82F6' }}></span>
                      {dim.label}
                    </span>
                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-xs">{pct}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={pct} 
                      onChange={(e) => handleWeightChange(dim.key, parseInt(e.target.value))}
                      className="w-full accent-[#0099B8] cursor-pointer" 
                    />
                  </div>
                  <p className="text-xs text-slate-400">{dim.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Global Threshold Rules */}
        <Card className="p-6 space-y-6">
          <h4 className="font-bold text-slate-900 text-base border-b pb-3">Matching Thresholds & Safety Limits</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Talent Score for National Pool</label>
              <Input 
                type="number" 
                value={config.minPoolScore || 60} 
                onChange={(e) => setConfig({ ...config, minPoolScore: parseInt(e.target.value) })}
              />
              <p className="text-xs text-slate-400 mt-1">Candidates below this score will not be visible in industry searches.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum AI Match % to Send Job Alerts</label>
              <Input 
                type="number" 
                value={config.minMatchPercent || 70} 
                onChange={(e) => setConfig({ ...config, minMatchPercent: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Profile Completion % Required</label>
              <Input 
                type="number" 
                value={config.minProfileCompletion || 60} 
                onChange={(e) => setConfig({ ...config, minProfileCompletion: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 space-y-2 border">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> Active AI Provider Engine
            </p>
            <p>Provider: <span className="font-mono bg-white px-1.5 py-0.5 rounded border text-blue-600">MockAIProvider (Deterministic + Local DB)</span></p>
            <p>Config Version: <span className="font-mono">{config.version || '4.0.0'}</span></p>
          </div>
        </Card>
      </div>

      {/* Modal Add Dimension */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Custom Score Dimension">
        <form onSubmit={handleAddDimension} className="space-y-4 pt-4">
          <Input label="Dimension Label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Digital Literacy" required />
          <Input label="Dimension Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. digital_literacy" required />
          <Input label="Initial Weight (%)" type="number" value={newWeight} onChange={(e) => setNewWeight(parseInt(e.target.value))} required />
          <Input label="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Description of what this measures..." />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Dimension</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
