import React from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, MapPin, Mail, Download } from 'lucide-react';
import { Card, Button } from '../../components/ui/Card';

export const CandidateDetail: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/industry/talent-pool" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Talent Pool
      </Link>
      
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl">
              BS
            </div>
            <div>
              <h1 className="text-2xl font-bold">Budi Santoso {id}</h1>
              <p className="text-gray-500">Electrical Engineering • SMK N 1 Bandung</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> Bandung, Jawa Barat</span>
                <span className="flex items-center"><Mail className="w-4 h-4 mr-1"/> budi@example.com</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline">Add to Shortlist</Button>
            <Button>Invite to Apply</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Profile Overview</h2>
            <p className="text-gray-600 text-sm">Highly motivated fresh graduate with a strong foundation in electrical systems...</p>
            
            <h3 className="font-semibold mt-6 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['AutoCAD', 'PLC', 'Wiring', 'Safety Protocols'].map(s => (
                <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">{s}</span>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Resume</h2>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center"><div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold mr-3">PDF</div> Budi_Santoso_Resume.pdf</div>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2"/> Download</Button>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Talent Scores</h2>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600">88</div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Technical</span><span>90</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Psychometric</span><span>85</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Safety</span><span>95</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '95%'}}></div></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
