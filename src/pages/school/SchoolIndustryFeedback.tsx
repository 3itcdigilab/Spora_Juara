import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';

export const SchoolIndustryFeedback: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Industry Feedback" description="Direct insights from our industry partners." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="p-6">
           <h3 className="text-lg font-semibold mb-2">Top Valued Skills</h3>
           <ul className="list-disc pl-5"><li>Work Ethic</li><li>Basic AutoCAD</li></ul>
         </Card>
         <Card className="p-6">
           <h3 className="text-lg font-semibold mb-2">Needs Improvement</h3>
           <ul className="list-disc pl-5"><li>English Communication</li><li>Safety Protocols</li></ul>
         </Card>
      </div>
    </div>
  );
};
