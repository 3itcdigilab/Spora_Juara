import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockStudents } from '../../data/students';
import { mockJobs } from '../../data/jobs';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export const IndustryAIRecommendations: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Talent Recommendations</h1>
          <p className="text-slate-500 text-sm">Smart candidate matches surfaced by Spora's AI engine for your active vacancies.</p>
        </div>
      </div>

      {mockJobs.slice(0, 3).map(job => (
        <Card key={job.id} className="p-6 space-y-4 border-l-4 border-l-violet-600">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="font-bold text-lg text-slate-900">{job.title}</h2>
              <p className="text-xs text-slate-500">{job.department} • {job.location}</p>
            </div>
            <Badge variant="info">Target Score: ≥{job.requiredTalentScore}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockStudents.slice(0, 3).map((student, i) => {
              const matchPct = 95 - i * 5;
              return (
                <div key={student.id} className="bg-violet-50/50 border border-violet-100 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{student.userId}</h3>
                      <p className="text-xs text-slate-500">{student.major}</p>
                    </div>
                    <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded-full">
                      {matchPct}% Match
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5" /> High Technical Assessment
                    </p>
                    <p className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5" /> Certified in EV Wiring
                    </p>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <Link to={`/industry/talent-pool/${student.id}`}>
                      <Button variant="outline" className="text-xs py-1 px-3">View Profile</Button>
                    </Link>
                    <Button variant="primary" className="text-xs py-1 px-3">Invite</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};
