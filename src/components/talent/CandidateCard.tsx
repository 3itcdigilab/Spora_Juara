import React from 'react';
import { MapPin, GraduationCap } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../ui/Card'; // Mock

export const CandidateCard: React.FC<{id: number}> = ({ id }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="absolute top-4 right-4 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-500">
        <span className="text-green-700 font-bold">88</span>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
          C{id}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Budi Santoso {id}</h3>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <GraduationCap className="w-3 h-3 mr-1"/> SMK N 1 Bandung
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3 mr-1"/> Jawa Barat
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Electrical</span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">AutoCAD</span>
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <Link to={`/industry/talent-pool/${id}`} className="flex-1">
          <Button variant="outline" className="w-full text-sm">View Profile</Button>
        </Link>
        <Button className="flex-1 text-sm">Invite</Button>
      </div>
    </div>
  );
};
