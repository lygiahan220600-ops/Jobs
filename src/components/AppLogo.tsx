import React from 'react';

export const APP_LOGO_SRC = '/assets/aistudio/1594f7e6bec13e9f67d0_f7a873b7.jpg';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  onClick?: () => void;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'dark',
  onClick,
}) => {
  const sizeClasses = {
    xs: {
      img: 'h-6 w-auto max-w-[80px]',
      title: 'text-sm',
      subtitle: 'text-[9px]',
    },
    sm: {
      img: 'h-8 w-auto max-w-[100px]',
      title: 'text-base',
      subtitle: 'text-[10px]',
    },
    md: {
      img: 'h-9 sm:h-10 w-auto max-w-[125px]',
      title: 'text-lg',
      subtitle: 'text-[11px]',
    },
    lg: {
      img: 'h-14 sm:h-16 w-auto max-w-[190px]',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-xs',
    },
  }[size];

  const titleColor = textColor === 'light' ? 'text-white' : 'text-slate-900';
  const subtitleColor = textColor === 'light' ? 'text-white/80' : 'text-slate-500';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer active:scale-98 transition-transform' : ''} ${className}`}
    >
      <div className="relative shrink-0 flex items-center justify-center bg-white rounded-xl shadow-2xs overflow-hidden border border-slate-200/80 p-0.5">
        <img
          src={APP_LOGO_SRC}
          alt="Jobs"
          className={`${sizeClasses.img} object-contain`}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="hidden min-[400px]:flex flex-col min-w-0">
          <span className={`${sizeClasses.title} font-black tracking-tight leading-tight font-display ${titleColor}`}>
            Jobs
          </span>
          <span className={`${sizeClasses.subtitle} font-medium leading-none ${subtitleColor} truncate hidden sm:block`}>
            Nền tảng tuyển dụng & việc làm
          </span>
        </div>
      )}
    </div>
  );
};
