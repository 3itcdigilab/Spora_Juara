import React, { useEffect, useRef, useState } from 'react';
import { Brain, Code, Zap, Users, BarChart3, GraduationCap, Award } from 'lucide-react';

const features = [
  { icon: Brain, title: "Psychometric Assessment", description: "Comprehensive personality and cognitive assessment to understand each candidate's potential" },
  { icon: Code, title: "Technical Assessment", description: "Domain-specific technical evaluations for EV industry competencies" },
  { icon: Zap, title: "Talent Matchmaking", description: "Standardized scoring algorithm connecting qualified talent with the right opportunity" },
  { icon: Users, title: "Digital Talent Pool", description: "National database of assessed and scored vocational graduates" },
  { icon: BarChart3, title: "Industry Dashboard", description: "Real-time recruitment analytics and candidate pipeline management" },
  { icon: GraduationCap, title: "School Analytics", description: "Performance tracking and curriculum feedback for vocational schools" },
  { icon: Award, title: "National Competency Standard", description: "Standardized assessment framework aligned with industry requirements" }
];

export const FeaturesSection: React.FC = () => {
  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleIndexes((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.feature-card');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Platform Features</h2>
          <p className="text-lg text-slate-600">Everything you need to build Indonesia's future EV workforce</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isVisible = visibleIndexes.has(idx);
            
            return (
              <div 
                key={idx}
                data-index={idx}
                className={`feature-card bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
