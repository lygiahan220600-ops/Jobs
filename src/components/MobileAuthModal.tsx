import React, { useState } from 'react';
import { Eye, EyeOff, X, ArrowLeft } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { useTranslation } from '../data/translations';

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

  // Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<'candidate' | 'employer'>('candidate');

  // Forgot
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
      fullName: isPhone ? 'Sinh viên (' + loginIdentifier.trim() + ')' : loginIdentifier.split('@')[0],
      email: isPhone ? 'sinhvien@student.edu.vn' : loginIdentifier.trim(),
      phone: isPhone ? loginIdentifier.trim() : '0912 345 678',
      role: 'candidate',
    };

    onSuccess(user, t.loginSuccess);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.');
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
    };

    onSuccess(newUser, t.registerSuccess);
    onClose();
  };

  const handleSocialLogin = (provider: 'Google' | 'Mail' | 'Apple') => {
    const socialUser: UserAccount = {
      id: 'usr-social-' + Date.now(),
      fullName: `Sinh viên (${provider})`,
      email: `student.${provider.toLowerCase()}@edu.vn`,
      phone: '0988 776 655',
      role: accountType,
    };
    onSuccess(socialUser, `Đăng nhập nhanh qua ${provider} thành công!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto p-5 pb-safe animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-display">
              {view === 'login' && t.login}
              {view === 'register' && t.register}
              {view === 'forgot' && t.forgotPassword}
            </h2>
            <p className="text-[11px] text-slate-500">
              Jobs — Nền tảng việc làm sinh viên
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        {view !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl my-3">
            <button
              type="button"
              onClick={() => {
                setView('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                view === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
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
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                view === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
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
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {t.emailOrPhone}
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Email hoặc 0912 345 678"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  {t.password}
                </label>
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-[11px] font-semibold text-[#0F766E]"
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
                  className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                >
                  {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F766E] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {t.login}
            </button>

            {/* Social Logins */}
            <div className="pt-2">
              <span className="block text-[11px] text-slate-400 text-center mb-2">
                {t.orLoginWith}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="py-2 px-1 text-xs font-semibold border border-slate-200 rounded-xl text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50"
                >
                  <span className="text-red-500 font-bold">G</span> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Mail')}
                  className="py-2 px-1 text-xs font-semibold border border-slate-200 rounded-xl text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50"
                >
                  <span>✉</span> Mail
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Apple')}
                  className="py-2 px-1 text-xs font-semibold border border-slate-200 rounded-xl text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50"
                >
                  <span></span> Apple
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTER */}
        {view === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {t.accountType}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('candidate')}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center ${
                    accountType === 'candidate'
                      ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {t.candidateRole}
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('employer')}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center ${
                    accountType === 'employer'
                      ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {t.employerRole}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                {t.fullName}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="edu@vn"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E] tabular-nums"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                {t.password}
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Từ 6 ký tự"
                  className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                >
                  {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F766E] text-white text-xs font-bold rounded-xl shadow-xs mt-1"
            >
              {t.register}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD */}
        {view === 'forgot' && (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => setView('login')}
              className="text-xs text-slate-600 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại đăng nhập</span>
            </button>

            {forgotSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl">
                ✓ Đã gửi liên kết đặt lại mật khẩu đến{' '}
                <strong>{forgotInput}</strong>. Vui lòng kiểm tra email hoặc SMS.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!forgotInput.trim()) return;
                  setForgotSent(true);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-slate-600">
                  Nhập Email hoặc Số điện thoại đăng ký tài khoản để nhận mã OTP khôi phục.
                </p>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="sinhvien@edu.vn hoặc 0912..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0F766E] text-white text-xs font-bold rounded-xl"
                >
                  Gửi mã xác thực
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
