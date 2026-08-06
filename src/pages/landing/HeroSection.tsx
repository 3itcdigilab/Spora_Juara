import React from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router';
import { Sparkles, ShieldCheck, Zap, Award, CheckCircle2, Users, Building, GraduationCap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 font-sans bg-slate-50">
      {/* LOW OPACITY PHOTO BACKGROUND (EV Engineers Field Inspection Photo) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* The requested background photo with low opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.07] filter grayscale mix-blend-multiply"
          style={{ backgroundImage: `url('/images/ev-engineers.png')` }}
        ></div>

        {/* Soft Radial White/Slate Overlay Mask for pristine text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/90 to-slate-50"></div>

        {/* Ambient Gradient Orbs */}
        <div className="absolute top-0 -left-40 w-[550px] h-[550px] bg-[#0099B8]/15 rounded-full filter blur-[120px] mix-blend-multiply opacity-60"></div>
        <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-violet-400/15 rounded-full filter blur-[120px] mix-blend-multiply opacity-60"></div>
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-emerald-400/15 rounded-full filter blur-[140px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-[#0099B8] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#0099B8]" />
            <span>Spora Juara • Indonesia National EV Talent Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
            Accelerating <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0099B8] via-blue-600 to-violet-600">Skilled Talent</span> for Indonesia's EV Industry
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            AI-powered assessment, talent pooling, and intelligent recruitment connecting vocational schools, certified graduates, and top EV industries across Indonesia.
          </p>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mb-14">
            <Link to="/register?role=student" className="w-full sm:w-1/3">
              <Button size="lg" variant="primary" className="w-full py-4 text-base font-bold bg-[#0099B8] hover:bg-[#007A93] text-white shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 rounded-xl transition-all hover:scale-105">
                Join Talent Pool <Zap size={18} className="text-amber-300" />
              </Button>
            </Link>
            <Link to="/register?role=industry" className="w-full sm:w-1/3">
              <Button size="lg" variant="outline" className="w-full py-4 text-base font-bold border-[#0099B8] text-[#0099B8] hover:bg-cyan-50 bg-white shadow-xs rounded-xl transition-all">
                Partner as Industry
              </Button>
            </Link>
            <Link to="/register?role=school" className="w-full sm:w-1/3">
              <Button size="lg" variant="outline" className="w-full py-4 text-base font-bold border-slate-300 text-slate-700 hover:bg-slate-100 bg-white shadow-xs rounded-xl transition-all">
                Register School
              </Button>
            </Link>
          </div>
        </div>

        {/* VISUAL SHOWCASE CARDS */}
        <div className="max-w-5xl mx-auto mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Practical EV Motorcycle Assembly */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl group hover:shadow-2xl hover:border-[#0099B8]/50 transition-all duration-500 flex flex-col justify-between">
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                <img 
                  src="/images/ev-conversion.png" 
                  alt="EV Motorcycle Assembly & Conversion Workshop" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-md">
                  <Zap size={14} className="text-[#0099B8]" /> EV Motorcycle Conversion
                </div>

                <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Verified Talent Score: 92/100
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-base">Practicum EV Motorcycle Conversion</h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Ready for Industry
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Asesmen praktik perakitan & konversi kendaraan listrik langsung di fasilitas workshop vokasi tersertifikasi.
                </p>
              </div>
            </div>

            {/* Card 2: EV Field Engineers Inspection */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl group hover:shadow-2xl hover:border-[#0099B8]/50 transition-all duration-500 flex flex-col justify-between">
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                <img 
                  src="/images/ev-engineers.png" 
                  alt="EV Field Engineers Competency Inspection" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-md">
                  <ShieldCheck size={14} className="text-violet-600" /> High Voltage Safety (1000V)
                </div>

                <div className="absolute bottom-4 right-4 bg-[#0099B8] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5">
                  <Award size={15} /> BNSP Competency Verified
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-base">Curriculum & Field Verification</h3>
                  <span className="text-[11px] font-semibold text-[#0099B8] bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                    BNS-Certified
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Supervisi kompetensi instruktur & evaluasi standar keselamatan kerja listrik tegangan tinggi bersama pakar industri EV.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-3xl font-extrabold text-[#0099B8] block mb-1">12,500+</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <Users size={14} /> Certified Students
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-3xl font-extrabold text-emerald-600 block mb-1">150+</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <GraduationCap size={14} /> Partner Schools (SMK)
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-3xl font-extrabold text-violet-600 block mb-1">45+</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <Building size={14} /> EV Industry Leaders
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
