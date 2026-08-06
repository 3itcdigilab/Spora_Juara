import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { classNames } from '../../utils/helpers';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={classNames('fixed top-0 w-full z-50 transition-all duration-300', scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5' : 'bg-transparent py-4')}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group py-1">
          <Logo size="md" />
        </Link>

        <div className="hidden md:flex gap-8 font-semibold text-sm">
          <a href="#features" className="text-slate-700 hover:text-[#0099B8] transition-colors">Features</a>
          <a href="#how-it-works" className="text-slate-700 hover:text-[#0099B8] transition-colors">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" className="text-slate-700 hover:text-[#0099B8] font-bold">Login</Button></Link>
          <Link to="/role-selection"><Button variant="primary" className="bg-[#0099B8] hover:bg-[#007A93] text-white font-bold px-5">Get Started</Button></Link>
        </div>
      </div>
    </nav>
  );
};