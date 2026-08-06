import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const SchoolStudents: React.FC = () => {
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Major', accessor: 'major' },
    { header: 'Year', accessor: 'year' },
    { header: 'Profile Completion', accessor: 'profile' },
    { header: 'Assessment Status', accessor: 'status', render: (val: string) => <Badge variant={val === 'Completed' ? 'success' : 'warning'}>{val}</Badge> },
    { header: 'Talent Score', accessor: 'score' },
    { header: 'Actions', accessor: 'id', render: () => <Button variant="outline" size="sm">View</Button> },
  ];
  const data = [
    { id: 1, name: 'Budi Santoso', major: 'Electrical', year: '2024', profile: '80%', status: 'Completed', score: 75 },
    { id: 2, name: 'Siti Aminah', major: 'Mechanical', year: '2024', profile: '60%', status: 'Pending', score: 60 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage and monitor your student talent pool.">
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button>Send Reminders</Button>
        </div>
      </PageHeader>
      
      <div className="flex gap-4 mb-4">
        <SearchBar placeholder="Search students..." />
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  );
};
