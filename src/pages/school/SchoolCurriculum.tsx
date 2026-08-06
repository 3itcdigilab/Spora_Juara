import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const SchoolCurriculum: React.FC = () => {
  const { showToast } = useToast();

  const handleExport = () => {
    showToast('Exporting recommendations to PDF...', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Curriculum Recommendations" description="Based on skill gap analysis and industry feedback">
         <Button onClick={handleExport}><Sparkles className="w-4 h-4 mr-2" /> Export Recommendations</Button>
      </PageHeader>
      
      <div className="space-y-4">
        <Card className="p-4 border-l-4 border-violet-500">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold flex items-center">1. Add EV Battery Management Module <Badge className="ml-2" variant="error">High Impact</Badge></h4>
              <p className="text-gray-600 mt-1">Industry feedback indicates a critical shortage in basic EV battery handling knowledge.</p>
            </div>
            <span className="text-sm text-gray-400">From Skill Gap</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
