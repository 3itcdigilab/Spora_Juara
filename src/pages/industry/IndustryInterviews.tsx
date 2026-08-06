import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { mockInterviews } from '../../data/interviews';
import { mockStudents } from '../../data/students';

export const IndustryInterviews: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviews, setInterviews] = useState(mockInterviews);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interview Schedule</h1>
          <p className="text-slate-500 text-sm">Manage upcoming and completed candidate interviews.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Schedule Interview</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((iv, idx) => {
          const student = mockStudents.find(s => s.id === iv.applicationId) || mockStudents[idx % mockStudents.length];
          return (
            <Card key={iv.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{student.userId}</h3>
                  <p className="text-xs text-slate-500">{student.major}</p>
                </div>
                <Badge variant={iv.status === 'scheduled' ? 'warning' : 'success'}>
                  {iv.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Date & Time</span>
                  <span className="font-medium">{iv.scheduledAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Duration</span>
                  <span className="font-medium">{iv.durationMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Interviewer</span>
                  <span className="font-medium">{iv.interviewerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Location</span>
                  <span className="font-medium text-blue-600 capitalize">{iv.location}</span>
                </div>
              </div>

              {iv.meetingUrl && (
                <a
                  href={iv.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs text-blue-600 font-medium hover:underline bg-blue-50 py-2 rounded-lg"
                >
                  Join Meeting Room ↗
                </a>
              )}
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Candidate Interview">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input label="Candidate Name / ID" placeholder="e.g. STU-001" required />
          <Input label="Interviewer Name" placeholder="e.g. HR Manager" required />
          <Input label="Date & Time" type="datetime-local" required />
          <Input label="Meeting Link (Google Meet / Zoom)" placeholder="https://meet.google.com/..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
