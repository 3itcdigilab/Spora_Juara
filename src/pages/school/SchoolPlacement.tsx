import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';

export const SchoolPlacement: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Placement" description="Graduate placement details and hiring partners." />
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Hiring Partners</h3>
        <DataTable 
          columns={[{ header: 'Company', accessor: 'name' }, { header: 'Hires', accessor: 'hires' }, { header: 'Avg Salary', accessor: 'salary' }]} 
          data={[]} 
        />
      </Card>
    </div>
  );
};
