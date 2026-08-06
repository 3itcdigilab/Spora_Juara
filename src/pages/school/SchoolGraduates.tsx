import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import { DonutChart } from '../../components/charts/DonutChart';

export const SchoolGraduates: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Graduates" description="Track alumni outcomes and employment success." />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card className="p-4"><p className="text-sm text-gray-500">Total Graduates</p><p className="text-2xl font-bold">0</p></Card>
         <Card className="p-4"><p className="text-sm text-gray-500">Employed %</p><p className="text-2xl font-bold">0%</p></Card>
         <Card className="p-4"><p className="text-sm text-gray-500">Avg Time to Hire</p><p className="text-2xl font-bold">-</p></Card>
         <Card className="p-4"><p className="text-sm text-gray-500">Avg Starting Salary</p><p className="text-2xl font-bold">-</p></Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6">
           <h3 className="text-lg font-semibold mb-4">Recent Graduates</h3>
           <DataTable columns={[{ header: 'Name', accessor: 'name' }, { header: 'Company', accessor: 'company' }]} data={[]} />
        </Card>
        <Card className="p-6">
           <h3 className="text-lg font-semibold mb-4">Outcomes</h3>
           <div className="h-64">
             <DonutChart data={[{ id: 'Employed', value: 82 }, { id: 'Seeking', value: 10 }, { id: 'Education', value: 8 }]} />
           </div>
        </Card>
      </div>
    </div>
  );
};
