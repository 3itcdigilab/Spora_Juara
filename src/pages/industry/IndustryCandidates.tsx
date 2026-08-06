import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockStudents } from '../../data/students';
import { mockTalentScores } from '../../data/talentScores';

export const IndustryCandidates: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([mockStudents[0]?.id, mockStudents[1]?.id]);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const selectedStudents = mockStudents.filter(s => selected.includes(s.id));

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Candidate Comparison</h1>
        <p className="text-slate-500 text-sm">Select up to 3 candidates for side-by-side competency comparison.</p>
      </div>

      {/* Candidate Selector */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Select Candidates to Compare ({selected.length}/3)</h3>
        <div className="flex flex-wrap gap-2">
          {mockStudents.slice(0, 8).map(s => {
            const isSel = selected.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSelect(s.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isSel ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSel ? '✓ ' : '+ '}{s.userId} ({s.major})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Comparison Grid */}
      {selectedStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedStudents.map(student => {
            const score = mockTalentScores.find(ts => ts.studentId === student.id);
            return (
              <Card key={student.id} className="p-6 space-y-4 border-t-4 border-t-blue-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg text-slate-900">{student.userId}</h2>
                    <p className="text-xs text-slate-500">{student.major}</p>
                    <p className="text-xs text-slate-400">{student.province}, Indonesia</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {score?.overall || 85}
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Competencies</h4>
                  {score?.dimensions.map(dim => (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{dim.label}</span>
                        <span className="text-slate-600">{dim.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${dim.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.map(sk => (
                      <Badge key={sk} variant="info">{sk}</Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button variant="primary" className="w-full">Invite to Apply</Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center text-slate-500">
          Select candidates above to display comparison details.
        </Card>
      )}
    </div>
  );
};
