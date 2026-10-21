import React from 'react';
import { Compass, Search, Bookmark, User, FileText } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../data/translations';

export type MobileTab = 'home' | 'search' | 'saved' | 'applications' | 'profile';

interface BottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  savedCount: number;
  applicationsCount: number;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  savedCount,
  applicationsCount,
  lang,
}) => {
  const t = useTranslation(lang);

  const navItems = [
    {
      id: 'home' as MobileTab,
      label: t.homeTab,
      icon: Compass,
      badge: 0,
    },
    {
      id: 'search' as MobileTab,
      label: t.searchTab,
      icon: Search,
      badge: 0,
    },
    {
      id: 'saved' as MobileTab,
      label: t.savedTab,
      icon: Bookmark,
      badge: savedCount,
    },
    {
      id: 'applications' as MobileTab,
      label: t.applicationsTab,
      icon: FileText,
      badge: applicationsCount,
    },
    {
      id: 'profile' as MobileTab,
      label: t.profileTab,
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-14 items-center px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative touch-manipulation ${
                isActive ? 'text-[#0F766E]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#0F766E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 truncate max-w-[64px] ${
                  isActive ? 'font-bold text-[#0F766E]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
