import React, { useState } from 'react';
import { User as UserIcon, Menu, Check } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { AppLogo } from './AppLogo';

interface MobileTopBarProps {
  lang: Language;
  onSelectLang: (newLang: Language) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onOpenProfileSidebar: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  lang,
  onSelectLang,
  currentUser,
  onOpenAuth,
  onOpenProfileSidebar,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D5] pt-safe shadow-2xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Hamburger Menu (mở Slide bar hồ sơ bên trái) & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onOpenProfileSidebar}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#2F5233] active:scale-95 transition-all touch-manipulation border border-[#E8E2D5] shadow-2xs"
            aria-label="Mở thanh menu hồ sơ bên trái"
            title="Mở thanh hồ sơ cá nhân bên trái"
          >
            <Menu className="w-4 h-4 text-[#2F5233]" />
            <span className="text-xs font-bold text-stone-800">Hồ sơ</span>
          </button>

          {/* Official App Logo */}
          <AppLogo
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>

        {/* Right Controls: Ngôn ngữ thế giới & Tài khoản */}
        <div className="flex items-center gap-2 relative">
          {/* Menu Dropdown Chọn Ngôn Ngữ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E8E2D5] text-stone-700 text-xs font-semibold transition-colors touch-manipulation"
              aria-label="Tùy chọn ngôn ngữ quốc tế"
            >
              <span className="text-sm leading-none">{currentLangObj.flag}</span>
              <span className="uppercase text-[11px] font-bold text-stone-800">{currentLangObj.code}</span>
            </button>

            {/* Menu danh sách các ngôn ngữ trên thế giới */}
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E8E2D5] p-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-600 uppercase tracking-wider border-b border-[#E8E2D5] mb-1">
                    Chọn ngôn ngữ (Language)
                  </div>
                  {SUPPORTED_LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        onSelectLang(item.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        lang === item.code
                          ? 'bg-[#EBF2EB] text-[#2F5233] font-bold'
                          : 'text-stone-700 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <span>{item.nativeName}</span>
                      </span>
                      {lang === item.code && <Check className="w-3.5 h-3.5 text-[#2F5233]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Profile avatar or Login button */}
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenProfileSidebar}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#FAF7F2] touch-manipulation active:scale-95 transition-transform"
              aria-label="Mở thanh hồ sơ cá nhân"
            >
              <div className="w-8 h-8 rounded-full ring-2 ring-[#2F5233]/40 overflow-hidden flex items-center justify-center bg-[#FAF7F2] shrink-0">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#2F5233]">
                    {currentUser.fullName.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-stone-800 hidden md:block max-w-[120px] truncate">
                {currentUser.fullName}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#2F5233] text-white hover:bg-[#244127] active:scale-95 transition-all flex items-center gap-1.5 touch-manipulation shadow-xs"
              aria-label="Đăng nhập"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
