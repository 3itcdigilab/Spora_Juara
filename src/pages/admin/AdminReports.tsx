import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';

export const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Generate and export national reports." />
      <div className="p-4 bg-white rounded shadow">Report Generator Placeholder</div>
    </div>
  );
};
