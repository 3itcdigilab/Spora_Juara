import React from 'react';
import { UserPlus, FileText, ClipboardCheck, Award, Users, Briefcase } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: "Register", description: "Create your account and select your role" },
  { icon: FileText, title: "Complete Profile", description: "Fill in your education, skills, and upload your CV" },
  { icon: ClipboardCheck, title: "Take Assessments", description: "Complete psychometric and technical assessments" },
  { icon: Award, title: "Competency Evaluation", description: "Our assessment system evaluates your skills and generates your Talent Score" },
  { icon: Users, title: "Join Talent Pool", description: "Enter the national talent pool visible to industry partners" },
  { icon: Briefcase, title: "Get Hired", description: "Get discovered, interviewed, and hired by leading EV companies" }
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">Your journey to a career in the EV industry</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2 rounded-full"></div>
          
          <div className="flex flex-col md:gap-8 gap-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 !== 0;
              
              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-center w-full">
                  {/* Timeline node */}
                  <div className="md:absolute left-1/2 transform md:-translate-x-1/2 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold z-10 shadow-lg border-4 border-slate-50 mb-4 md:mb-0">
                    {idx + 1}
                  </div>
                  
                  {/* Content card */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                      </div>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
