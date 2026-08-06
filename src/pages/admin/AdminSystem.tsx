import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';

export const AdminSystem: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="System Health" description="Monitor platform status and audit logs." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card className="p-4"><p className="text-sm text-gray-500">API Status</p><p className="text-lg font-bold text-green-600">Healthy</p></Card>
         <Card className="p-4"><p className="text-sm text-gray-500">Response Time</p><p className="text-lg font-bold">245ms</p></Card>
         <Card className="p-4"><p className="text-sm text-gray-500">Active Users</p><p className="text-lg font-bold">1,234</p></Card>
         <Card className="p-4"><p className="text-sm text-gray-500">Error Rate</p><p className="text-lg font-bold">0.02%</p></Card>
      </div>
    </div>
  );
};
