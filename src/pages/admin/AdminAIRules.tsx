import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { defaultScoreConfig } from '../../data/scoreConfig';
import { Sparkles, Plus, AlertCircle, CheckCircle2, Key, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { openRouterService } from '../../services/OpenRouterAI';

export const AdminAIRules: React.FC = () => {
  const { showToast } = useToast();
  
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('spora_score_config');
    return saved ? JSON.parse(saved) : defaultScoreConfig;
  });

  // OpenRouter State
  const [apiKey, setApiKey] = useState(() => openRouterService.getApiKey());
  const [selectedModel, setSelectedModel] = useState(() => openRouterService.getModel());
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

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

  const handleSaveOpenRouter = () => {
    openRouterService.setApiKey(apiKey);
    openRouterService.setModel(selectedModel);
    showToast('Konfigurasi OpenRouter AI berhasil disimpan!', 'success');
  };

  const handleTestOpenRouter = async () => {
    setIsTestingAI(true);
    setTestResult(null);
    try {
      openRouterService.setApiKey(apiKey);
      openRouterService.setModel(selectedModel);

      const report = await openRouterService.generatePsychologicalReport({
        studentId: 'test-user',
        studentName: 'Budi Pratama (Test)',
        nisn: '0071234501',
        schoolName: 'SMKN 1 Cikarang Pusat',
        major: 'Teknik Kendaraan Ringan EV',
        dimensionScores: {
          technical: 90,
          safety: 95,
          psychometric: 88,
          learningAgility: 92,
          communication: 85
        },
        overallScore: 90,
        personalityType: 'The High-Voltage Safety Champion'
      });

      setTestResult(`✓ Sukses! AI Engine (${report.modelUsed}) berhasil menganalisis profil: "${report.archetype}"`);
      showToast('Koneksi OpenRouter AI Berhasil!', 'success');
    } catch (err: any) {
      setTestResult(`❌ Error: ${err.message || 'Gagal terhubung ke OpenRouter.'}`);
      showToast('Gagal terhubung ke OpenRouter', 'error');
    } finally {
      setIsTestingAI(false);
    }
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
    <div className="space-y-6 font-sans pb-10">
      <PageHeader 
        title="AI Matching & Psychological Assessment Rules" 
        subtitle="Konfigurasi OpenRouter LLM, bobot dimensi Talent Score, dan parameter evaluasi psikologis otomatis."
        actions={
          <Button onClick={handleSaveConfig} disabled={!isValidTotal} variant="primary" className="bg-[#0099B8] hover:bg-[#007A93]">
            Save AI Rules
          </Button>
        }
      />

      {/* OpenRouter LLM Engine Integration Box */}
      <Card className="p-6 border-l-4 border-[#0099B8] bg-gradient-to-r from-cyan-50/50 via-white to-slate-50 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0099B8] text-white flex items-center justify-center shadow-md">
              <Zap size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">OpenRouter AI Integration</h3>
                {apiKey ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={13} /> Live LLM Connected
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
                    Local Heuristic Engine Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Gunakan OpenRouter API Key untuk mengaktifkan analisis psikologis mendalam, Big Five Traits, dan evaluasi K3 otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs font-bold border-cyan-300 text-[#0099B8] bg-white hover:bg-cyan-50"
              onClick={handleTestOpenRouter}
              disabled={isTestingAI}
            >
              {isTestingAI ? '🔄 Testing...' : '⚡ Test AI Generation'}
            </Button>
            <Button 
              size="sm" 
              variant="primary" 
              className="bg-[#0099B8] hover:bg-[#007A93] text-white text-xs font-bold"
              onClick={handleSaveOpenRouter}
            >
              Simpan API Key
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Key size={14} className="text-[#0099B8]" /> OpenRouter API Key
            </label>
            <input 
              type="password"
              placeholder="sk-or-v1-xxxxxxxxxxxxxxxx..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:ring-2 focus:ring-[#0099B8] focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Dapat diperoleh dari <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-[#0099B8] underline">openrouter.ai/keys</a>. Tersimpan aman di localStorage browser Anda.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Cpu size={14} className="text-[#0099B8]" /> Model Selection
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#0099B8] focus:outline-none font-medium"
            >
              <option value="deepseek/deepseek-chat">DeepSeek V3 (deepseek/deepseek-chat) — Cepat & Hemat</option>
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (anthropic/claude-3.5-sonnet) — Analisis Tertinggi</option>
              <option value="meta-llama/llama-3.3-70b-instruct">Meta Llama 3.3 70B (meta-llama/llama-3.3-70b-instruct)</option>
              <option value="google/gemini-flash-1.5">Google Gemini 1.5 Flash (google/gemini-flash-1.5)</option>
              <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini (openai/gpt-4o-mini)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Model yang digunakan untuk menghasilkan laporan psikometrik & behavioral assessment.
            </p>
          </div>
        </div>

        {testResult && (
          <div className="p-3 bg-white border border-cyan-200 rounded-xl text-xs text-slate-700 animate-fadeIn">
            {testResult}
          </div>
        )}
      </Card>
      
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
            <p>Provider: <span className="font-mono bg-white px-1.5 py-0.5 rounded border text-blue-600">{apiKey ? `OpenRouter API (${selectedModel})` : 'Spora Local Deterministic Engine'}</span></p>
            <p>Config Version: <span className="font-mono">{config.version || '4.0.0'}</span></p>
          </div>
        </Card>
      </div>

      {/* Add Dimension Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Custom Score Dimension">
        <form onSubmit={handleAddDimension} className="space-y-4 pt-2">
          <Input 
            label="Dimension Key (e.g. greenEnergy, safetyProtocol)" 
            value={newKey} 
            onChange={(e) => setNewKey(e.target.value)} 
            required 
          />
          <Input 
            label="Dimension Display Label (e.g. Green Energy Mastery)" 
            value={newLabel} 
            onChange={(e) => setNewLabel(e.target.value)} 
            required 
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Weight Percentage (%)</label>
            <Input 
              type="number" 
              value={newWeight} 
              onChange={(e) => setNewWeight(parseInt(e.target.value))} 
              required 
            />
          </div>
          <Input 
            label="Description" 
            value={newDescription} 
            onChange={(e) => setNewDescription(e.target.value)} 
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Dimension</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
