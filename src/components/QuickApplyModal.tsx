import React, { useState, useEffect } from 'react';
import { X, Send, Clock, User, Mail, Phone, GraduationCap } from 'lucide-react';
import { Job, Language, StudentProfile, UserAccount } from '../types';

interface QuickApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  profile: StudentProfile;
  currentUser: UserAccount | null;
  lang: Language;
  onClose: () => void;
  onSubmit: (data: {
    jobId: string;
    fullName: string;
    email: string;
    phone: string;
    university: string;
    major: string;
    availableShifts: string;
    note: string;
  }) => void;
}

export const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  job,
  isOpen,
  profile,
  currentUser,
  lang,
  onClose,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState(profile.fullName || currentUser?.fullName || '');
  const [email, setEmail] = useState(profile.email || currentUser?.email || '');
  const [phone, setPhone] = useState(profile.phone || currentUser?.phone || '');
  const [university, setUniversity] = useState(profile.university || '');
  const [major, setMajor] = useState(profile.faculty || job?.major || '');
  const [availableShifts, setAvailableShifts] = useState(job?.availableShifts.join(', ') || 'Linh hoạt theo lịch học');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      setFullName(profile.fullName || currentUser?.fullName || '');
      setEmail(profile.email || currentUser?.email || '');
      setPhone(profile.phone || currentUser?.phone || '');
      setUniversity(profile.university || '');
      setMajor(profile.faculty || job.major || '');
      setAvailableShifts(job.availableShifts.join(', '));
      setNote('');
      setErrorMsg(null);
    }
  }, [job, profile, currentUser, isOpen]);

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ và tên, Email và Số điện thoại.');
      return;
    }

    onSubmit({
      jobId: job.id,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      university: university.trim(),
      major: major.trim(),
      availableShifts: availableShifts.trim(),
      note: note.trim(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E8E2D5] overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header in Moss Green Gradient */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#1E3821] via-[#2F5233] to-[#3B5E3C] text-white flex items-center justify-between">
          <div className="min-w-0 pr-3">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200">
              Nộp hồ sơ ứng tuyển
            </span>
            <h3 className="text-base font-extrabold truncate text-white">
              {job.title}
            </h3>
            <p className="text-xs text-[#FAF7F2]/90 truncate flex items-center gap-1.5 mt-0.5">
              <span>{job.companyName}</span>
              <span>•</span>
              <span className="text-emerald-200 font-bold">{job.salaryText}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body in Kem/Trắng palette */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs bg-white">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#2F5233]" />
                <span>Họ và tên <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] font-medium text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#2F5233]" />
                <span>Số điện thoại <span className="text-red-500">*</span></span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] font-medium text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-800 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#2F5233]" />
              <span>Email liên hệ <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="VD: sinhvien@gmail.com"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] font-medium text-stone-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#2F5233]" />
                <span>Trường Đại học / Cao đẳng</span>
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="VD: ĐH Bách Khoa, ĐH Kinh tế..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-800 mb-1">
                Ngành học
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="VD: Công nghệ thông tin..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-800 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#2F5233]" />
              <span>Ca làm việc có thể đăng ký</span>
            </label>
            <input
              type="text"
              value={availableShifts}
              onChange={(e) => setAvailableShifts(e.target.value)}
              placeholder="VD: Ca Sáng T2-T6, Cuối tuần..."
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-800 mb-1">
              Lời nhắn gửi Nhà tuyển dụng / Link CV đính kèm
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Giới thiệu nhanh về điểm mạnh hoặc đính kèm liên kết CV online của bạn..."
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-800"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#E8E2D5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-stone-700 font-semibold hover:bg-[#FAF7F2] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F5233] hover:bg-[#244127] active:scale-95 text-white font-bold shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Gửi đơn ứng tuyển ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
