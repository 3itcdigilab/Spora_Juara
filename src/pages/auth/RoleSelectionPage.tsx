import React from 'react';
import { Link, useNavigate } from 'react-router';
import { GraduationCap, School, Factory } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

const roles = [
  {
    id: 'student',
    title: 'I\'m a Student / Talent Candidate',
    description: 'Take assessments, build your profile, and get discovered by top EV companies across Indonesia',
    icon: GraduationCap,
    badgeBg: 'bg-cyan-50',
    textColor: 'text-[#0099B8]'
  },
  {
    id: 'industry',
    title: 'I\'m an Industry Partner',
    description: 'Access pre-assessed vocational graduates, post job vacancies, and manage candidate pipelines',
    icon: Factory,
    badgeBg: 'bg-violet-50',
    textColor: 'text-violet-600'
  },
  {
    id: 'school',
    title: 'I\'m a Vocational School (SMK)',
    description: 'Track graduate placements, receive direct industry feedback, and align curriculum standards',
    icon: School,
    badgeBg: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  }
];

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    navigate(`/register?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <Logo size="lg" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Join Spora Juara</h1>
        <p className="text-sm md:text-base text-slate-600">Select your account type to get started with tailored features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto relative z-10">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="text-left bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-[#0099B8] hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0099B8] flex flex-col justify-between"
            >
              <div>
                <div className={`p-4 rounded-xl w-fit mb-5 ${role.badgeBg} ${role.textColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{role.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0099B8]">
                <span>Register as {role.id.toUpperCase()}</span>
                <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 text-center relative z-10 text-sm">
        <p className="text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#0099B8] hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
