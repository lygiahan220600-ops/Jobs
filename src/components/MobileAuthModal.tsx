import React, { useState } from 'react';
import { Eye, EyeOff, X, ArrowLeft, Building2, User, Sparkles } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { useTranslation } from '../data/translations';
import { APP_LOGO_SRC } from './AppLogo';

interface MobileAuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  lang: Language;
  onClose: () => void;
  onSuccess: (user: UserAccount, message: string) => void;
}

export const MobileAuthModal: React.FC<MobileAuthModalProps> = ({
  isOpen,
  initialMode,
  lang,
  onClose,
  onSuccess,
}) => {
  const t = useTranslation(lang);
  const [view, setView] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Role selection
  const [accountType, setAccountType] = useState<'candidate' | 'employer'>('candidate');

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot form
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setView(initialMode);
    setErrorMsg(null);
    setForgotSent(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại.');
      return;
    }
    if (loginPassword.length < 6) {
      setErrorMsg('Mật khẩu tối thiểu 6 ký tự.');
      return;
    }

    const isPhone = /^[0-9+ -]{9,15}$/.test(loginIdentifier.trim());
    const user: UserAccount = {
      id: 'usr-' + Date.now(),
      fullName: isPhone
        ? (accountType === 'employer' ? 'Nhà tuyển dụng (' + loginIdentifier.trim() + ')' : 'Sinh viên (' + loginIdentifier.trim() + ')')
        : loginIdentifier.split('@')[0],
      email: isPhone ? (accountType === 'employer' ? 'hr@company.com' : 'sinhvien@student.edu.vn') : loginIdentifier.trim(),
      phone: isPhone ? loginIdentifier.trim() : '0912 345 678',
      role: accountType,
      companyName: accountType === 'employer' ? (companyName || 'Doanh nghiệp Tuyển dụng') : undefined,
    };

    onSuccess(user, accountType === 'employer' ? 'Đăng nhập thành công với vai trò Nhà tuyển dụng!' : t.loginSuccess);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.');
      return;
    }
    if (accountType === 'employer' && !companyName.trim()) {
      setErrorMsg('Vui lòng nhập Tên công ty / Doanh nghiệp của bạn.');
      return;
    }
    if (registerPassword.length < 6) {
      setErrorMsg('Mật khẩu phải từ 6 ký tự trở lên.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu và xác nhận mật khẩu không trùng khớp.');
      return;
    }

    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: accountType,
      companyName: accountType === 'employer' ? companyName.trim() : undefined,
    };

    onSuccess(newUser, accountType === 'employer' ? 'Đăng ký tài khoản Nhà tuyển dụng thành công!' : t.registerSuccess);
    onClose();
  };

  const handleQuickDemo = (role: 'candidate' | 'employer') => {
    if (role === 'employer') {
      const demoEmployer: UserAccount = {
        id: 'usr-demo-emp',
        fullName: 'Chị Mai Lan (Phòng Tuyển dụng)',
        email: 'recruiter.lan@fptsoftware.vn',
        phone: '0903 888 999',
        role: 'employer',
        companyName: 'FPT Software NextGen Hub',
      };
      onSuccess(demoEmployer, 'Đã đăng nhập tài khoản mẫu Nhà tuyển dụng (FPT Software NextGen Hub)!');
    } else {
      const demoCandidate: UserAccount = {
        id: 'usr-demo-cand',
        fullName: 'Nguyễn Văn Minh',
        email: 'minh.nguyen@student.edu.vn',
        phone: '0988 123 456',
        role: 'candidate',
      };
      onSuccess(demoCandidate, 'Đã đăng nhập tài khoản mẫu Sinh viên / Ứng viên!');
    }
    onClose();
  };

  const handleSocialLogin = (provider: 'Google' | 'Mail' | 'Apple') => {
    const socialUser: UserAccount = {
      id: 'usr-social-' + Date.now(),
      fullName: accountType === 'employer' ? `Nhà tuyển dụng (${provider})` : `Sinh viên (${provider})`,
      email: `${accountType}.${provider.toLowerCase()}@jobs.vn`,
      phone: '0988 776 655',
      role: accountType,
      companyName: accountType === 'employer' ? 'Công ty Cổ phần Tuyển dụng' : undefined,
    };
    onSuccess(socialUser, `Đăng nhập qua ${provider} thành công!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8E2D5] p-5 sm:p-6 my-auto animate-fadeIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Logo */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2D5]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-[#E8E2D5] p-1 flex items-center justify-center shadow-2xs shrink-0">
              <img
                src={APP_LOGO_SRC}
                alt="Jobs Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 font-display leading-tight">
                {view === 'login' && t.login}
                {view === 'register' && t.register}
                {view === 'forgot' && t.forgotPassword}
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">
                Jobs — Nền tảng tuyển dụng & việc làm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#FAF7F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Tap Quick Demo Access Bar */}
        <div className="mt-3.5 p-2.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D5] space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F5233] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2F5233]" /> Đăng nhập thử nghiệm 1 chạm:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('employer')}
              className="px-2.5 py-1.5 bg-white hover:bg-[#EBF2EB] border border-[#2F5233]/30 rounded-xl text-[11px] font-bold text-[#2F5233] text-left flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 shrink-0 text-[#2F5233]" />
              <span className="truncate">🏢 Nhà tuyển dụng</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('candidate')}
              className="px-2.5 py-1.5 bg-white hover:bg-[#EBF2EB] border border-[#E8E2D5] rounded-xl text-[11px] font-bold text-stone-800 text-left flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <User className="w-3.5 h-3.5 shrink-0 text-stone-600" />
              <span className="truncate">🎓 Ứng viên SV</span>
            </button>
          </div>
        </div>

        {/* Role Selection Toggle */}
        <div className="mt-3">
          <label className="block text-[11px] font-bold text-stone-700 mb-1">
            Bạn đăng nhập với tư cách:
          </label>
          <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl">
            <button
              type="button"
              onClick={() => setAccountType('candidate')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                accountType === 'candidate'
                  ? 'bg-white text-[#2F5233] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sinh viên / Ứng viên</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('employer')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                accountType === 'employer'
                  ? 'bg-white text-[#2F5233] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Nhà tuyển dụng</span>
            </button>
          </div>
        </div>

        {/* Tab switch between Login and Register */}
        {view !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl my-3">
            <button
              type="button"
              onClick={() => {
                setView('login');
                setErrorMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                view === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setView('register');
                setErrorMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                view === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t.register}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-2.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl mb-3">
            {errorMsg}
          </div>
        )}

        {/* 1. LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                {t.emailOrPhone}
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Email hoặc 0912 345 678"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-stone-700">
                  {t.password}
                </label>
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-[11px] font-semibold text-[#2F5233]"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mật khẩu của bạn"
                  className="w-full pl-3 pr-9 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 p-1"
                >
                  {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2F5233] hover:bg-[#244127] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              {accountType === 'employer' ? 'Đăng nhập Nhà tuyển dụng' : t.login}
            </button>

            {/* Social Logins */}
            <div className="pt-2">
              <span className="block text-[11px] text-stone-400 text-center mb-2">
                {t.orLoginWith}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="py-2 text-xs font-semibold border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F2] flex items-center justify-center gap-1.5"
                >
                  <span className="font-bold text-red-500">G</span> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Mail')}
                  className="py-2 text-xs font-semibold border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F2] flex items-center justify-center gap-1.5"
                >
                  <span className="font-bold text-blue-500">@</span> Email
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Apple')}
                  className="py-2 text-xs font-semibold border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F2] flex items-center justify-center gap-1.5"
                >
                  <span className="font-bold text-stone-900"></span> Apple
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTER */}
        {view === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                {t.fullName}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn Minh"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              />
            </div>

            {accountType === 'employer' && (
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Tên công ty / Doanh nghiệp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="VD: Công ty TNHH NextGen Hub"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                {t.password} (Tối thiểu 6 ký tự)
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-9 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 p-1"
                >
                  {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-9 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2F5233] hover:bg-[#244127] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              {accountType === 'employer' ? 'Tạo tài khoản Nhà tuyển dụng' : t.register}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD */}
        {view === 'forgot' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setView('login')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Đăng nhập</span>
            </button>

            {forgotSent ? (
              <div className="p-4 bg-[#EBF2EB] border border-[#2F5233]/30 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-[#2F5233]">
                  Đã gửi liên kết đặt lại mật khẩu!
                </p>
                <p className="text-[11px] text-stone-600">
                  Vui lòng kiểm tra hộp thư hoặc tin nhắn SMS gửi đến <strong>{forgotInput}</strong> để đặt lại mật khẩu của bạn.
                </p>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="mt-2 px-4 py-1.5 bg-[#2F5233] text-white text-xs font-bold rounded-xl"
                >
                  Về trang Đăng nhập
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!forgotInput.trim()) {
                    setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại.');
                    return;
                  }
                  setForgotSent(true);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-stone-600">
                  Nhập email hoặc số điện thoại bạn đã đăng ký để nhận mã khôi phục mật khẩu.
                </p>
                <div>
                  <input
                    type="text"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="Email hoặc số điện thoại"
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2F5233] hover:bg-[#244127] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Gửi yêu cầu khôi phục
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
