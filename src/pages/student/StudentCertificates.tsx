import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { FileUpload } from '../../components/ui/FileUpload';
import { useToast } from '../../components/ui/Toast';
import { Upload, Award, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { localDB } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

export const StudentCertificates: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const studentId = user?.email || '';

  const [certs, setCerts] = useState(() => localDB.getCertificates(studentId));
  const [isModalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [type, setType] = useState('Technical');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !issuer) {
      showToast('Please fill in certificate name and issuer.', 'warning');
      return;
    }
    const newCert = localDB.addCertificate({
      studentId,
      name,
      issuingBody: issuer,
      type,
      issueDate,
      fileUrl: '#'
    });

    setCerts([newCert, ...certs]);
    setModalOpen(false);
    setName('');
    setIssuer('');
    showToast(`Certificate "${name}" uploaded & verified!`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500">Manage and verify your professional competency certifications.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Upload size={18} /> Upload Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert: any) => (
          <Card key={cert.id} className="p-5 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
                <Award size={24} />
              </div>
              {cert.status === 'verified' && <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 size={12}/> Verified</Badge>}
              {cert.status === 'pending' && <Badge variant="warning" className="flex items-center gap-1"><Clock size={12}/> Pending</Badge>}
              {cert.status === 'rejected' && <Badge variant="danger" className="flex items-center gap-1"><XCircle size={12}/> Rejected</Badge>}
            </div>
            
            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{cert.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{cert.issuingBody || cert.issuer}</p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Issued: {cert.issueDate || cert.date}</span>
              <Badge variant="info" className="text-[10px]">{cert.type}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Upload Certificate">
        <form onSubmit={handleUpload} className="space-y-4 pt-4">
          <Input label="Certificate Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. High Voltage Safety Level 1" required />
          <Input label="Issuing Organization" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="e.g. TÜV Rheinland" required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 border bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Technical">Technical</option>
              <option value="Safety">Safety</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Award">Award</option>
            </select>
          </div>
          <Input label="Issue Date" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Certificate File</label>
            <FileUpload accept=".pdf,.jpg,.png" onFileSelect={() => {}} helpText="PDF or image format, max 5MB" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Certificate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
