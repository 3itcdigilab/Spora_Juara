import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { LineChart } from '../../components/charts/LineChart';
import { DonutChart } from '../../components/charts/DonutChart';

export const IndustryReports: React.FC = () => {
  const { showToast } = useToast();

  const handleExport = () => {
    showToast('Exporting hiring analytics to CSV...', 'success');
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Hiring Analytics</h1>
        <div className="flex space-x-3">
          <select className="border-gray-300 rounded-md text-sm">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
          </select>
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2"/> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4"><h3 className="text-sm text-gray-500">Total Hires</h3><p className="text-2xl font-bold">12</p></Card>
        <Card className="p-4"><h3 className="text-sm text-gray-500">Avg Time-to-Hire</h3><p className="text-2xl font-bold">22d</p></Card>
        <Card className="p-4"><h3 className="text-sm text-gray-500">Offer Acceptance</h3><p className="text-2xl font-bold">92%</p></Card>
        <Card className="p-4"><h3 className="text-sm text-gray-500">Active Vacancies</h3><p className="text-2xl font-bold">8</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Time-to-Hire Trend</h2>
          <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-400">
            <LineChart />
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Hiring by Department</h2>
          <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-400">
            <DonutChart />
          </div>
        </Card>
      </div>
    </div>
  );
};
