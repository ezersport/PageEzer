import React from 'react';

interface EzLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'dark' | 'light' | 'square';
}

export const EzLogo: React.FC<EzLogoProps> = ({
  className = 'w-12 h-10',
  showText = true,
  variant = 'dark',
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {variant === 'square' ? (
          <img
            src="/images/ezer-icon.webp"
            alt="Ezer Sport Logo"
            className="w-full h-full object-contain rounded-xl shadow-sm"
            width="48"
            height="48"
          />
        ) : (
          <img
            src="/images/ezer-logo.webp"
            alt="Ezer Sport Logo"
            className={`w-full h-full object-contain transition-transform group-hover:scale-105 ${
              variant === 'light' ? 'brightness-0 invert' : ''
            }`}
            width="56"
            height="48"
          />
        )}
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-black text-2xl tracking-tighter uppercase italic ${
              variant === 'light' ? 'text-white' : 'text-[#0c3755]'
            }`}
          >
            EZER <span className="text-[#009fe3]">SPORT</span>
          </span>
          <span className="text-[11px] tracking-widest text-slate-400 font-medium">
            @ezer_sport
          </span>
        </div>
      )}
    </div>
  );
};
