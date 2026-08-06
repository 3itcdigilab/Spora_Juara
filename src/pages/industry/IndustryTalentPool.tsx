import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Card'; // Mock button
import { CandidateCard } from '../../components/talent/CandidateCard';

export const IndustryTalentPool: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Talent Pool</h1>
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search: e.g., 'Electrical technician in Jawa Barat'" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden space-x-6">
        {/* Sidebar Filters */}
        <div className="w-64 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-4 overflow-y-auto hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center"><Filter className="w-4 h-4 mr-2"/> Filters</h2>
            <button className="text-xs text-blue-600">Reset</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Province</label>
              <select className="w-full text-sm border-gray-300 rounded-md"><option>Jawa Barat</option></select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Experience</label>
              <select className="w-full text-sm border-gray-300 rounded-md"><option>Fresh Graduate</option></select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Talent Score</label>
              <input type="range" className="w-full" />
            </div>
            <Button className="w-full mt-4">Apply Filters</Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Showing 142 candidates</span>
            <select className="text-sm border-gray-300 rounded-md"><option>Sort by: AI Match</option></select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            {[1,2,3,4,5,6].map(i => <CandidateCard key={i} id={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
