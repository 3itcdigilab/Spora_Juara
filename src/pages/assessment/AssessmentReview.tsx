import React from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, CheckCircle, Flag } from 'lucide-react';

export const AssessmentReview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock answers state from test
  const summary = {
    total: 30,
    answered: 28,
    unanswered: 2,
    flagged: 1
  };

  const mockReviewQuestions = [
    { id: 1, q: "What is the primary function of a BMS?", status: 'answered', ans: 'Monitoring cell voltage' },
    { id: 2, q: "Which tool is best for measuring high voltage...", status: 'flagged', ans: 'Multimeter' },
    { id: 3, q: "Identify the safe procedure for isolating...", status: 'unanswered', ans: null },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Your Answers</h1>
        <p className="text-gray-500">Please review before final submission.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-500 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
        </Card>
        <Card className="p-4 text-center border-emerald-200 bg-emerald-50/30">
          <p className="text-emerald-700 text-sm mb-1">Answered</p>
          <p className="text-2xl font-bold text-emerald-700">{summary.answered}</p>
        </Card>
        <Card className={`p-4 text-center ${summary.unanswered > 0 ? 'border-red-200 bg-red-50/30' : ''}`}>
          <p className={`${summary.unanswered > 0 ? 'text-red-700' : 'text-gray-500'} text-sm mb-1`}>Unanswered</p>
          <p className={`text-2xl font-bold ${summary.unanswered > 0 ? 'text-red-700' : 'text-gray-900'}`}>{summary.unanswered}</p>
        </Card>
        <Card className={`p-4 text-center ${summary.flagged > 0 ? 'border-amber-200 bg-amber-50/30' : ''}`}>
          <p className={`${summary.flagged > 0 ? 'text-amber-700' : 'text-gray-500'} text-sm mb-1`}>Flagged</p>
          <p className={`text-2xl font-bold ${summary.flagged > 0 ? 'text-amber-700' : 'text-gray-900'}`}>{summary.flagged}</p>
        </Card>
      </div>

      {summary.unanswered > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-3 text-amber-800 font-medium">
          <AlertTriangle size={20} />
          You have {summary.unanswered} unanswered questions. Are you sure you want to submit?
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="divide-y divide-gray-100">
          {mockReviewQuestions.map((q, idx) => (
            <div key={q.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{q.q}</p>
                <p className={`text-xs mt-1 ${q.ans ? 'text-gray-500' : 'text-red-500 font-medium'}`}>
                  {q.ans ? `Your Answer: ${q.ans}` : 'Not Answered'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {q.status === 'flagged' && <Flag size={16} className="text-amber-500" />}
                {q.status === 'answered' && <CheckCircle size={16} className="text-emerald-500" />}
                <Link to={`/assessment/${id}/test`} className="text-sm font-medium text-blue-600 hover:underline">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Link to={`/assessment/${id}/test`}>
          <Button variant="outline">Return to Test</Button>
        </Link>
        <Button size="lg" onClick={() => navigate(`/assessment/${id}/results`)}>Submit Assessment</Button>
      </div>
    </div>
  );
};
