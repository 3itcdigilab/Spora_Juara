import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Platform-wide analytics and trends." />
      <div className="p-4 bg-white rounded shadow">Analytics Dashboard Placeholder</div>
    </div>
  );
};
