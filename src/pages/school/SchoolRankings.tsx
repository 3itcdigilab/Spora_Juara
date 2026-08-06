import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Trophy } from 'lucide-react';

export const SchoolRankings: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Rankings" description="Benchmark your institution against others." />
      <Card className="p-8 text-center bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-4" />
        <h2 className="text-3xl font-bold text-amber-700">Your Ranking: #5 out of 150 schools</h2>
        <p className="text-amber-600 mt-2">Top 5% in West Java Province</p>
      </Card>
    </div>
  );
};
