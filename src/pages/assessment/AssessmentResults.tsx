import React from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { RadarChart } from '../../components/charts/RadarChart';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const AssessmentResults: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center">
        <Badge variant="success" className="mb-4">Assessment Completed</Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Technical Assessment Results</h1>
        <p className="text-gray-500">Great job! Here is your performance breakdown.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 text-center flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500 mb-2">Overall Score</p>
          <div className="text-6xl font-bold text-emerald-600 mb-4">85<span className="text-2xl text-gray-400">/100</span></div>
          <Badge variant="success" className="text-sm px-3 py-1">Excellent</Badge>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Competency Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">High Voltage Safety</span>
                <span>95%</span>
              </div>
              <ProgressBar value={95} color="emerald" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Battery Systems</span>
                <span>80%</span>
              </div>
              <ProgressBar value={80} color="emerald" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Electrical Fundamentals</span>
                <span>88%</span>
              </div>
              <ProgressBar value={88} color="emerald" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Diagnostics</span>
                <span>65%</span>
              </div>
              <ProgressBar value={65} color="amber" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" /> Top Strengths
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              Exceptional understanding of safety protocols and PPE requirements.
            </li>
            <li className="flex gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              Strong grasp of basic circuit theory and multimeter usage.
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-amber-500" /> Areas for Growth
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              Review advanced diagnostic procedures for identifying cell-level faults.
            </li>
            <li className="flex gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              Familiarize with CAN bus communication fundamentals.
            </li>
          </ul>
        </Card>
      </div>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-violet-200 p-2 rounded-full text-violet-700"><Sparkles size={24}/></div>
        </div>
        <h3 className="text-lg font-bold text-violet-900 mb-2">Your Talent Score is Ready!</h3>
        <p className="text-violet-700 text-sm mb-6 max-w-lg mx-auto">
          You have completed both required assessments. We have generated your comprehensive AI Talent Score and updated your job matches.
        </p>
        <Link to="/student/talent-score">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white border-0">View Talent Score</Button>
        </Link>
      </div>
    </div>
  );
};
