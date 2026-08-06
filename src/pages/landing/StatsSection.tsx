import React, { useEffect, useRef, useState } from 'react';
import { Users, School, Building, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: 12500, suffix: '+', label: 'Registered Students' },
  { icon: School, value: 150, suffix: '+', label: 'Partner Schools' },
  { icon: Building, value: 45, suffix: '+', label: 'Industry Partners' },
  { icon: TrendingUp, value: 87, suffix: '%', label: 'Hiring Success Rate' }
];

const useCountUp = (end: number, duration: number = 2000, trigger: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, trigger]);

  return count;
};

const StatCard: React.FC<{ stat: typeof stats[0], isVisible: boolean }> = ({ stat, isVisible }) => {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center text-white">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-white/20 rounded-full">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="text-4xl font-bold mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-blue-100 font-medium">
        {stat.label}
      </div>
    </div>
  );
};

export const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-violet-700" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};
