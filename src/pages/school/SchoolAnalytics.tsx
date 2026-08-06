import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { LineChart } from '../../components/charts/LineChart';

export const SchoolAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deep dive into school performance and trends." />
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Average Score Trend</h3>
        <div className="h-80">
          <LineChart data={[{ id: 'Score', data: [{ x: 'Sem 1', y: 60 }, { x: 'Sem 2', y: 65 }, { x: 'Sem 3', y: 78 }] }]} />
        </div>
      </Card>
    </div>
  );
};
