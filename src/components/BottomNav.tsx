import React from 'react';
import {
  Compass,
  Search,
  User,
  MessageSquare,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { Language, UserAccount } from '../types';

export type MobileTab =
  | 'home'
  | 'search'
  | 'saved'
  | 'applications'
  | 'messages'
  | 'ai-cv'
  | 'employer'
  | 'profile';

interface NavItem {
  id: MobileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: number;
  highlight?: boolean;
}

interface BottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  savedCount: number;
  applicationsCount: number;
  unreadMessagesCount: number;
  currentUser: UserAccount | null;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  applicationsCount,
  unreadMessagesCount,
  currentUser,
}) => {
  const isEmployer = currentUser?.role === 'employer';

  // Candidate Navigation Items
  const candidateItems: NavItem[] = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: Compass,
      badge: 0,
    },
    {
      id: 'search',
      label: 'Tìm việc',
      icon: Search,
      badge: 0,
    },
    {
      id: 'messages',
      label: 'Tin nhắn',
      icon: MessageSquare,
      badge: unreadMessagesCount,
    },
    {
      id: 'ai-cv',
      label: 'Tạo CV AI',
      icon: Sparkles,
      badge: 0,
      highlight: true,
    },
    {
      id: 'profile',
      label: 'Cá nhân',
      icon: User,
      badge: applicationsCount > 0 ? applicationsCount : 0,
    },
  ];

  // Employer Navigation Items
  const employerItems: NavItem[] = [
    {
      id: 'employer',
      label: 'Duyệt tin',
      icon: FileCheck,
      badge: 0,
    },
    {
      id: 'search',
      label: 'Thị trường',
      icon: Search,
      badge: 0,
    },
    {
      id: 'messages',
      label: 'Tin nhắn',
      icon: MessageSquare,
      badge: unreadMessagesCount,
    },
    {
      id: 'ai-cv',
      label: 'Tạo CV AI',
      icon: Sparkles,
      badge: 0,
    },
    {
      id: 'profile',
      label: 'Doanh nghiệp',
      icon: User,
      badge: applicationsCount > 0 ? applicationsCount : 0,
    },
  ];

  const navItems = isEmployer ? employerItems : candidateItems;

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D5] pb-safe shadow-[0_-4px_16px_rgba(47,82,51,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 touch-manipulation active:scale-95 ${
                isActive
                  ? 'text-[#2F5233] font-bold bg-[#FAF7F2]'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-[#FAF7F2]/50'
              }`}
            >
              {/* Highlight Glow for AI CV */}
              {item.highlight && !isActive && (
                <span className="absolute -top-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#2F5233] text-[#FAF7F2] tracking-wider animate-pulse">
                  AI
                </span>
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#2F5233]' : 'text-stone-500'
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 min-w-[16px] h-4 rounded-full bg-[#2F5233] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 leading-tight truncate max-w-full tracking-tight ${
                  isActive ? 'font-bold text-[#2F5233]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#2F5233] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
