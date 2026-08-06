import React, { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import { Sparkles, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

export const StudentAIRecommendation: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Career Paths');
  const [enrolled, setEnrolled] = useState<string[]>([]);

  const handleEnroll = (title: string) => {
    setEnrolled([...enrolled, title]);
    showToast(`Enrolled in "${title}"! Access granted in Spora Learning.`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-6 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-gray-500">Personalized career paths, skill gap training, and job matches based on your Talent Score.</p>
        </div>
      </div>

      <Tabs 
        tabs={[
          { id: 'Career Paths', label: 'Career Paths' },
          { id: 'Learning', label: 'Skill Gap Courses' },
          { id: 'Job Matches', label: 'High Match Jobs' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'Career Paths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'EV Battery Assembly Technician', match: 94, desc: 'Specialist in assembling, testing, and thermal management of high-voltage EV battery modules.', why: 'Your high Technical Aptitude (85) and Safety Awareness (90) make you an ideal candidate for battery lines.' },
              { title: 'Quality Assurance & Diagnostic Inspector', match: 88, desc: 'Inspect high-voltage electrical circuits and verify compliance before final factory release.', why: 'Your strong Attention to Detail combined with your cognitive psychometric score suggests high success here.' }
            ].map((path, i) => (
              <Card key={i} className="p-6 border-t-4 border-t-violet-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{path.title}</h3>
                  <Badge variant="info" className="bg-violet-50 text-violet-700 border-violet-200">{path.match}% Match</Badge>
                </div>
                <p className="text-gray-600 mb-6 text-sm">{path.desc}</p>
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                    <Sparkles size={14} className="text-violet-500"/> Why this recommendation?
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{path.why}</p>
                </div>
                <Link to="/student/jobs">
                  <Button variant="outline" className="w-full">Explore Open Vacancies</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'Learning' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Advanced High Voltage Safety', provider: 'Spora Academy', rel: 95, gap: 'Addresses missing Six Sigma & Safety Basics' },
              { title: 'BMS Diagnostics & Thermal Balancing', provider: 'Hyundai Training Center', rel: 85, gap: 'Improves Diagnostic Score (+10 pts)' },
              { title: 'Electric Motor Winding Certification', provider: 'SMK National Competency', rel: 80, gap: 'Unlocks Motor Specialist jobs' }
            ].map((course, i) => (
              <Card key={i} className="p-5 flex flex-col hover:shadow-md transition-shadow">
                <Badge variant="info" className="w-fit mb-3">Course</Badge>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-4"><BookOpen size={14}/> {course.provider}</p>
                <div className="mt-auto bg-amber-50 p-3 rounded-lg text-xs text-amber-800 mb-4 border border-amber-100">
                  <span className="font-bold">Target Gap:</span> {course.gap}
                </div>
                {enrolled.includes(course.title) ? (
                  <Button disabled variant="primary" className="w-full bg-emerald-600 border-emerald-600 text-white flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Enrolled
                  </Button>
                ) : (
                  <Button onClick={() => handleEnroll(course.title)} className="w-full flex items-center justify-center gap-2">
                    Enroll Now <ArrowRight size={16}/>
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'Job Matches' && (
          <div className="space-y-4">
            <Card className="p-6 flex flex-col md:flex-row items-center gap-6 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center font-bold text-2xl text-blue-600 shrink-0">H</div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">EV Battery Assembly Technician</h3>
                  <Sparkles size={16} className="text-violet-500" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-2">Hyundai Motor Manufacturing • Cikarang • Rp 6,000,000 - Rp 8,000,000</p>
                <p className="text-xs text-emerald-600 font-medium bg-emerald-50 w-fit px-2 py-1 rounded">Top Match: You exceed the required Talent Score by 10 points.</p>
              </div>
              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                <div className="text-2xl font-bold text-emerald-600">92% Match</div>
                <Link to="/student/jobs/job-1" className="w-full md:w-auto">
                  <Button variant="primary" className="w-full md:w-32">View & Apply</Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
