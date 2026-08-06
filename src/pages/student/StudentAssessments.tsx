import React from 'react';
import { Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Brain, Wrench, Lock } from 'lucide-react';

export const StudentAssessments: React.FC = () => {
  const profileComplete = true; // Toggle for testing locked state

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
        <p className="text-gray-500">Complete these to generate your Talent Score and get matched with top EV jobs.</p>
      </div>

      {!profileComplete && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
          <Lock className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-amber-900">Assessments Locked</h3>
            <p className="text-sm text-amber-700 mt-1">Please complete at least 60% of your profile to unlock assessments.</p>
            <Link to="/student/profile" className="text-sm font-bold text-amber-800 hover:underline mt-2 inline-block">Complete Profile →</Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`p-6 flex flex-col ${!profileComplete ? 'opacity-60 grayscale' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Brain size={24} />
            </div>
            <Badge variant="success">Completed</Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Psychometric Assessment</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4 flex-1">
            Measures cognitive abilities, problem-solving skills, and personality traits relevant to the EV industry.
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <span>50 Questions</span>
            <span>45 Minutes</span>
          </div>
          <Link to="/assessment/1/results" className={!profileComplete ? 'pointer-events-none' : ''}>
            <Button variant="outline" className="w-full">View Results</Button>
          </Link>
        </Card>

        <Card className={`p-6 flex flex-col ${!profileComplete ? 'opacity-60 grayscale' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Wrench size={24} />
            </div>
            <Badge variant="primary" className="bg-blue-100 text-blue-700">Available</Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Technical Assessment</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4 flex-1">
            Evaluates your knowledge of EV fundamentals, high-voltage safety, and basic mechanical aptitude.
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <span>30 Questions</span>
            <span>30 Minutes</span>
          </div>
          <Link to="/assessment/2/instructions" className={!profileComplete ? 'pointer-events-none' : ''}>
            <Button className="w-full" disabled={!profileComplete}>Start Assessment</Button>
          </Link>
        </Card>
      </div>

      <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 text-center mt-8">
        <h3 className="text-lg font-bold text-violet-900 mb-2">Ready to see your score?</h3>
        <p className="text-violet-700 text-sm mb-4">Finish both assessments to unlock your AI-powered Talent Score and personalized recommendations.</p>
        <Link to="/student/talent-score">
          <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-100">Preview Talent Score</Button>
        </Link>
      </div>
    </div>
  );
};
