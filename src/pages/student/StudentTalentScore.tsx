import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ProgressGauge } from '../../components/charts/ProgressGauge';
import { RadarChart } from '../../components/charts/RadarChart';
import { Sparkles, Briefcase } from 'lucide-react';
import { Link } from 'react-router';

export const StudentTalentScore: React.FC = () => {
  const overallScore = 78;
  const isLocked = false; // set to true if assessments not complete

  const dimensions = [
    { label: 'Technical Aptitude', score: 85, weight: 'High' },
    { label: 'Cognitive Ability', score: 72, weight: 'Medium' },
    { label: 'Safety Awareness', score: 90, weight: 'High' },
    { label: 'Problem Solving', score: 68, weight: 'Medium' },
    { label: 'Teamwork', score: 82, weight: 'Low' },
    { label: 'Adaptability', score: 75, weight: 'Medium' },
    { label: 'Work Ethic', score: 88, weight: 'High' },
  ];

  if (isLocked) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🔒</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Talent Score Locked</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Complete both your Psychometric and Technical assessments to unlock your AI-powered Talent Score.
        </p>
        <Link to="/student/assessments">
          <Button size="lg">Go to Assessments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Your Talent Score</h1>
        <p className="text-sm text-gray-500">Calculated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="flex justify-center my-8">
        <ProgressGauge value={overallScore} max={100} size={200} color="emerald" label="Overall Score" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dimension Breakdown</h2>
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
             <RadarChart 
                data={dimensions.map(d => ({ dimension: d.label, score: d.score }))}
                indexBy="dimension"
                keys={['score']}
                height={350}
              />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Score Details</h2>
            <div className="space-y-5">
              {dimensions.map((dim, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{dim.label}</span>
                    <span className="font-bold text-gray-900">{dim.score}/100</span>
                  </div>
                  <ProgressBar value={dim.score} color={dim.score >= 80 ? 'emerald' : dim.score >= 70 ? 'blue' : 'amber'} />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">Weight:</span>
                    <Badge variant="secondary" className="text-[10px] py-0">{dim.weight}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-violet-200 bg-violet-50/50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-1">✓</span>
                <p className="text-sm text-gray-700">Strong technical aptitude for EV Battery Assembly, exceeding 85% of peers.</p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1">ℹ</span>
                <p className="text-sm text-gray-700">Recommended for roles in Quality Control and Assembly Tech based on high Safety Awareness.</p>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 mt-1">↗</span>
                <p className="text-sm text-gray-700">Growth area: Focus on Problem Solving to unlock advanced diagnostic roles.</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Industry Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { ind: 'EV Battery Manufacturing', match: 92, company: 'Hyundai, CATL' },
            { ind: 'Automotive Quality Assurance', match: 85, company: 'Toyota, Wuling' },
            { ind: 'Electric Motor Assembly', match: 78, company: 'Various Partners' }
          ].map((item, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.ind}</h3>
                  <Badge variant="success" className="shrink-0">{item.match}% Match</Badge>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-3">
                  <Briefcase size={14} /> {item.company}
                </p>
              </div>
              <Button variant="outline" className="mt-4 w-full text-sm">View Roles</Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
