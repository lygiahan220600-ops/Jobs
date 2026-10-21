import React, { useState } from 'react';
import { Globe, User as UserIcon, Menu, Check } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 pt-safe">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Hamburger Menu (mở Slide bar hồ sơ bên trái) & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenProfileSidebar}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition-all touch-manipulation border border-slate-200/80 shadow-2xs"
            aria-label="Mở thanh menu hồ sơ bên trái"
            title="Mở thanh hồ sơ cá nhân bên trái"
          >
            <Menu className="w-4 h-4 text-[#0F766E]" />
            <span className="text-xs font-bold text-slate-800">Hồ sơ</span>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="px-2 h-8 rounded-xl bg-[#0F766E] flex items-center justify-center text-white font-black text-xs shadow-xs font-display tracking-tight">
              Jobs
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 font-display leading-tight">
                Jobs
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                Nền tảng việc làm sinh viên toàn quốc
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Ngôn ngữ thế giới & Tài khoản */}
        <div className="flex items-center gap-2 relative">
          {/* Menu Dropdown Chọn Ngôn Ngữ Trên Thế Giới */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors touch-manipulation"
              aria-label="Tùy chọn ngôn ngữ quốc tế"
            >
              <span className="text-sm leading-none">{currentLangObj.flag}</span>
              <span className="uppercase text-[11px] font-bold">{currentLangObj.code}</span>
            </button>

            {/* Menu danh sách các ngôn ngữ trên thế giới */}
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
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
                          ? 'bg-[#0F766E]/10 text-[#0F766E] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <span>{item.nativeName}</span>
                      </span>
                      {lang === item.code && <Check className="w-3.5 h-3.5 text-[#0F766E]" />}
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
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 touch-manipulation active:scale-95 transition-transform"
              aria-label="Mở thanh hồ sơ cá nhân"
            >
              <div className="w-8 h-8 rounded-full ring-2 ring-[#0F766E]/40 overflow-hidden flex items-center justify-center bg-slate-100 shrink-0">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#0F766E]">
                    {currentUser.fullName.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden md:block max-w-[120px] truncate">
                {currentUser.fullName}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#0F766E] text-white hover:bg-[#115E59] active:scale-95 transition-all flex items-center gap-1.5 touch-manipulation shadow-xs"
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
