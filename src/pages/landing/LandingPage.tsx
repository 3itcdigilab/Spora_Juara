import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { StatsSection } from './StatsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { FooterSection } from './FooterSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <FooterSection />
    </div>
  );
};
