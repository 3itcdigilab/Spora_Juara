import React from 'react';
import { Quote } from 'lucide-react';
import { mockTestimonials } from '../../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-slate-600">Discover how Spora TalentOS is transforming the EV ecosystem</p>
        </div>

        {/* CSS-based automatic marquee scrolling */}
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee gap-6 whitespace-nowrap py-4">
            {[...mockTestimonials, ...mockTestimonials].map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className="inline-block w-80 md:w-96 whitespace-normal bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100 flex-shrink-0"
              >
                <Quote className="w-8 h-8 text-blue-200 mb-4" />
                <p className="text-slate-700 mb-6 italic">"{item.quote}"</p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500">{item.role}, {item.organization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
