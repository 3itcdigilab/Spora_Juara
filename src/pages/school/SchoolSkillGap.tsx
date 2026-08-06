import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const SchoolSkillGap: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Skill Gap Analysis" description="What industry needs vs. what our students have" />
      <Card className="p-6">
         <h3 className="text-lg font-semibold mb-4">Industry Requirement vs Student Capability</h3>
         <div className="space-y-4">
           <div>
             <div className="flex justify-between mb-1"><span className="text-sm font-medium">EV Battery Assembly</span><Badge variant="error">Critical</Badge></div>
             <div className="w-full bg-gray-200 rounded-full h-2.5 flex">
               <div className="bg-blue-600 h-2.5 rounded-l-full" style={{ width: '80%' }}></div>
               <div className="bg-red-400 h-2.5 rounded-r-full" style={{ width: '20%' }}></div>
             </div>
           </div>
         </div>
      </Card>
    </div>
  );
};
