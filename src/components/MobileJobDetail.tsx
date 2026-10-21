import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  Send,
  X,
  Building,
  MessageSquare,
} from 'lucide-react';
import { Job, Language, StudentProfile, UserAccount } from '../types';
import { useTranslation } from '../data/translations';

interface MobileJobDetailProps {
  job: Job;
  isSaved: boolean;
  hasApplied: boolean;
  profile: StudentProfile;
  currentUser: UserAccount | null;
  lang: Language;
  onBack: () => void;
  onToggleSave: (jobId: string) => void;
  onOpenChat?: (job: Job) => void;
  onSubmitApplication: (data: {
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

export const MobileJobDetail: React.FC<MobileJobDetailProps> = ({
  job,
  isSaved,
  hasApplied,
  profile,
  currentUser,
  lang,
  onBack,
  onToggleSave,
  onOpenChat,
  onSubmitApplication,
}) => {
  const t = useTranslation(lang);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Auto-fill from student profile
  const [applicantName, setApplicantName] = useState(profile.fullName || currentUser?.fullName || '');
  const [applicantEmail, setApplicantEmail] = useState(profile.email || currentUser?.email || '');
  const [applicantPhone, setApplicantPhone] = useState(profile.phone || currentUser?.phone || '');
  const [applicantUni, setApplicantUni] = useState(profile.university || '');
  const [applicantMajor, setApplicantMajor] = useState(profile.faculty || job.major);
  const [applicantShifts, setApplicantShifts] = useState(job.availableShifts.join(', '));
  const [applicantNote, setApplicantNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    setApplicantName(profile.fullName || currentUser?.fullName || '');
    setApplicantEmail(profile.email || currentUser?.email || '');
    setApplicantPhone(profile.phone || currentUser?.phone || '');
    setApplicantUni(profile.university || '');
    setApplicantMajor(profile.faculty || job.major);
  }, [profile, currentUser, job]);

  const title = lang === 'en' && job.titleEn ? job.titleEn : job.title;
  const salary = lang === 'en' && job.salaryTextEn ? job.salaryTextEn : job.salaryText;
  const descriptionList = lang === 'en' && job.descriptionEn ? job.descriptionEn : job.description;
  const requirementsList = lang === 'en' && job.requirementsEn ? job.requirementsEn : job.requirements;
  const benefitsList = lang === 'en' && job.benefitsEn ? job.benefitsEn : job.benefits;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `${job.title} tại ${job.companyName}`,
        url: window.location.href,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim() || !applicantPhone.trim()) {
      setFormError('Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.');
      return;
    }

    onSubmitApplication({
      jobId: job.id,
      fullName: applicantName.trim(),
      email: applicantEmail.trim(),
      phone: applicantPhone.trim(),
      university: applicantUni.trim(),
      major: applicantMajor.trim(),
      availableShifts: applicantShifts.trim(),
      note: applicantNote.trim(),
    });

    setShowApplyModal(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-6 py-4 pb-28">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-xl hover:bg-[#FAF7F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#FAF7F2] transition-colors"
            aria-label={t.share}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? 'border-[#2F5233] bg-[#EBF2EB] text-[#2F5233]'
                : 'border-[#E8E2D5] bg-white text-stone-600 hover:bg-[#FAF7F2]'
            }`}
            aria-label={isSaved ? t.saved : t.saveJob}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#2F5233]' : ''}`} />
          </button>
        </div>
      </div>

      {copiedShare && (
        <div className="mb-3 px-3 py-1.5 bg-[#EBF2EB] text-[#2F5233] text-xs rounded-xl border border-[#2F5233]/20 text-center animate-fadeIn font-medium">
          {t.copiedLink}
        </div>
      )}

      {/* Main Card in White with Cream border */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-6 shadow-xs">
        {/* Company info */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-2xs font-display"
            style={{ backgroundColor: job.companyColor || '#2F5233' }}
          >
            {job.companyShort}
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
              {title}
            </h1>
            <p className="text-xs font-bold text-[#2F5233] mt-0.5">
              {job.companyName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2F5233]" />
              <span>{job.city} ({job.district})</span>
            </div>
          </div>
        </div>

        {/* Highlight Stats Grid (Cream boxes) */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E8E2D5] text-xs">
          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5]/70 flex items-start gap-2">
            <Building className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-stone-600 block">{t.salary}</span>
              <span className="font-bold text-[#2F5233] font-mono">{salary}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5]/70 flex items-start gap-2">
            <Clock className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-stone-600 block">{t.shifts}</span>
              <span className="font-semibold text-stone-800 line-clamp-1">
                {job.availableShifts.join(', ')}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5]/70 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-stone-600 block">{t.experience}</span>
              <span className="font-semibold text-stone-800 line-clamp-1">{job.experience}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5]/70 flex items-start gap-2">
            <Users className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-stone-600 block">{t.vacancies}</span>
              <span className="font-semibold text-stone-800 tabular-nums">{job.vacancies} vị trí</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs mt-3 space-y-2">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2F5233]"></span>
          <span>{t.jobDescription}</span>
        </h2>
        <ul className="space-y-2 text-xs text-stone-700 leading-relaxed list-disc pl-4">
          {descriptionList.map((desc, idx) => (
            <li key={idx}>{desc}</li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs mt-3 space-y-2">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2F5233]"></span>
          <span>{t.jobRequirements}</span>
        </h2>
        <ul className="space-y-2 text-xs text-stone-700 leading-relaxed list-disc pl-4">
          {requirementsList.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
        <div className="pt-2 text-xs text-stone-600">
          <span className="font-semibold text-stone-900">{t.skills}: </span>
          <span>{job.skills.join(' · ')}</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs mt-3 space-y-2">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2F5233]"></span>
          <span>{t.benefits}</span>
        </h2>
        <ul className="space-y-2 text-xs text-stone-700 leading-relaxed list-disc pl-4">
          {benefitsList.map((ben, idx) => (
            <li key={idx}>{ben}</li>
          ))}
        </ul>
      </div>

      {/* Contact & Address */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs mt-3">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
          {t.scheduleAndContact}
        </h2>
        <p className="text-xs text-stone-600">{job.scheduleDetail}</p>
        <div className="mt-3 p-3 bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl text-xs text-stone-600 space-y-1">
          <p>
            <strong className="text-stone-800">{t.companyAddress}: </strong>
            {job.address}
          </p>
          <p>
            <strong className="text-stone-800">{t.contactPerson}: </strong>
            {job.contactPerson}
          </p>
        </div>
      </div>

      {/* Fixed Mobile Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D5] p-3 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center gap-2">
          {/* Chat with Employer button in Moss/Cream */}
          <button
            type="button"
            onClick={() => onOpenChat && onOpenChat(job)}
            className="p-3 rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] hover:bg-[#EBF2EB] text-[#2F5233] transition-colors touch-manipulation flex items-center justify-center shrink-0 shadow-2xs"
            title="Nhắn tin với nhà tuyển dụng"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`p-3 rounded-xl border transition-colors touch-manipulation shrink-0 ${
              isSaved
                ? 'border-[#2F5233] bg-[#EBF2EB] text-[#2F5233]'
                : 'border-[#E8E2D5] bg-[#FAF7F2] text-stone-600 hover:bg-stone-100'
            }`}
            aria-label={t.saveJob}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#2F5233]' : ''}`} />
          </button>

          {hasApplied ? (
            <button
              type="button"
              disabled
              className="flex-1 py-3 px-4 rounded-xl bg-[#EBF2EB] text-[#2F5233] border border-[#2F5233]/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2F5233]" />
              <span>{t.applied}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#2F5233] hover:bg-[#244127] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all touch-manipulation"
            >
              <Send className="w-4 h-4" />
              <span>{t.applyNow}</span>
            </button>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 pb-safe animate-slideUp border border-[#E8E2D5]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-display">
                  {t.applyFormTitle}
                </h3>
                <p className="text-[11px] text-stone-600 truncate max-w-[260px]">
                  {job.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#FAF7F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 pt-3">
              {formError && (
                <div className="p-2 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Trường ĐH/CĐ
                  </label>
                  <input
                    type="text"
                    value={applicantUni}
                    onChange={(e) => setApplicantUni(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Ngành học
                  </label>
                  <input
                    type="text"
                    value={applicantMajor}
                    onChange={(e) => setApplicantMajor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Ca rảnh có thể làm việc
                </label>
                <input
                  type="text"
                  value={applicantShifts}
                  onChange={(e) => setApplicantShifts(e.target.value)}
                  placeholder="VD: Ca Chiều T3, T5 và Cuối tuần"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Lời nhắn / Link CV (Drive/Portfolio)
                </label>
                <textarea
                  rows={2}
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  placeholder="Chia sẻ lý do ứng tuyển hoặc liên kết CV online..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2F5233] text-white text-xs font-bold rounded-xl hover:bg-[#244127] transition-colors"
                >
                  {t.confirmApply}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
