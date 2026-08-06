import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { mockFAQ } from '../../data/faq';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">Everything you need to know about Spora TalentOS</p>
        </div>

        <div className="space-y-4">
          {mockFAQ.map((faq) => (
            <div 
              key={faq.id} 
              className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-blue-300 bg-slate-50"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => toggle(faq.id)}
                aria-expanded={openId === faq.id}
              >
                <span className="font-semibold text-slate-900 pr-8">{faq.question}</span>
                {openId === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-5 pt-0 text-slate-600 border-t border-slate-100 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
