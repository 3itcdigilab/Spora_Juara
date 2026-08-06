import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  useImageOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', useImageOnly = true }) => {
  const imageSizeClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10 lg:h-11',
    lg: 'h-12 sm:h-14 lg:h-16',
    xl: 'h-16 sm:h-20 lg:h-24'
  };

  if (useImageOnly) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img 
          src="/images/spora-juara-logo.png" 
          alt="Spora Juara" 
          className={`${imageSizeClasses[size]} w-auto object-contain transition-transform duration-300 hover:scale-105 shrink-0 mix-blend-multiply drop-shadow-xs`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans ${className}`}>
      <svg className="w-8 h-8 text-[#0099B8] shrink-0" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 5 L58 38 L92 25 L68 50 L92 75 L58 62 L50 95 L42 62 L8 75 L32 50 L8 25 L42 38 Z" />
      </svg>
      <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
        SPORA <span className="text-[#0099B8]">JUARA</span>
      </span>
    </div>
  );
};
