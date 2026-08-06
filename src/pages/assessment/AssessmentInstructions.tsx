import React from 'react';
import { useParams, Link } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock, HelpCircle, AlertTriangle } from 'lucide-react';

export const AssessmentInstructions: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <Badge variant="primary" className="mb-4">Technical Assessment</Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EV Fundamentals</h1>
        <p className="text-gray-500">Please read the instructions carefully before starting.</p>
      </div>

      <Card className="p-6 md:p-8 space-y-8">
        <div className="flex justify-around items-center py-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-center">
            <div className="flex justify-center mb-1 text-gray-500"><HelpCircle size={24}/></div>
            <div className="font-bold text-xl text-gray-900">30</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Questions</div>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <div className="flex justify-center mb-1 text-gray-500"><Clock size={24}/></div>
            <div className="font-bold text-xl text-gray-900">30</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Rules & Guidelines</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-blue-500 font-bold">•</span>
              One attempt only. Ensure you have a stable internet connection.
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-blue-500 font-bold">•</span>
              Answers are auto-saved. If disconnected, you can resume if time remains.
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-blue-500 font-bold">•</span>
              You can flag questions to review them later before submitting.
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-blue-500 font-bold">•</span>
              The assessment will auto-submit when the timer reaches zero.
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3 text-amber-800 text-sm">
          <AlertTriangle className="shrink-0 text-amber-600" size={20} />
          <p>Once you click start, the timer will begin immediately and cannot be paused.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
          <Link to="/student/assessments" className="flex-1">
            <Button variant="outline" className="w-full">Cancel</Button>
          </Link>
          <Link to={`/assessment/${id}/test`} className="flex-1">
            <Button className="w-full text-lg h-12">Start Assessment</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
