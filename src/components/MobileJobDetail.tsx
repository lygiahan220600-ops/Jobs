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
  onSubmitApplication,
}) => {
  const t = useTranslation(lang);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Auto-fill from student profile
  const [applicantName, setApplicantName] = useState(profile.fullName);
  const [applicantEmail, setApplicantEmail] = useState(profile.email);
  const [applicantPhone, setApplicantPhone] = useState(profile.phone);
  const [applicantUni, setApplicantUni] = useState(profile.university);
  const [applicantMajor, setApplicantMajor] = useState(profile.faculty || job.major);
  const [applicantShifts, setApplicantShifts] = useState(job.availableShifts.join(', '));
  const [applicantNote, setApplicantNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    setApplicantName(profile.fullName);
    setApplicantEmail(profile.email);
    setApplicantPhone(profile.phone);
    setApplicantUni(profile.university);
    setApplicantMajor(profile.faculty || job.major);
  }, [profile, job]);

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
    <div className="max-w-md mx-auto px-4 py-3 pb-28">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 active:scale-95 transition-all touch-manipulation flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors touch-manipulation"
            aria-label="Chia sẻ"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`p-2 rounded-full border transition-colors touch-manipulation ${
              isSaved
                ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                : 'border-slate-200 bg-white text-slate-500'
            }`}
            aria-label={t.saveJob}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#0F766E]' : ''}`} />
          </button>
        </div>
      </div>

      {copiedShare && (
        <div className="mb-3 p-2 bg-slate-900 text-white text-xs rounded-xl text-center">
          Đã sao chép liên kết vào bộ nhớ tạm!
        </div>
      )}

      {/* Main Job Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 font-display shadow-xs"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyShort}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-900 truncate block">
              {job.companyName}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <span className="font-semibold text-[#0F766E]">{job.jobType}</span>
              <span>·</span>
              <span>{job.workMode}</span>
            </div>
          </div>
        </div>

        <h1 className="text-base font-extrabold text-slate-900 leading-snug">
          {title}
        </h1>

        <div className="flex items-baseline justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <span className="text-[11px] text-slate-500 block">{t.salary}</span>
            <span className="text-base font-bold text-[#0F766E] font-mono tabular-nums">
              {salary}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 tabular-nums">
            {t.deadline}: {job.deadline}
          </span>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block">{t.location}</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{job.city}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 flex items-start gap-2">
            <Clock className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block">{t.shifts}</span>
              <span className="font-semibold text-slate-800 line-clamp-1">
                {job.availableShifts.join(', ')}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block">{t.experience}</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{job.experience}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 flex items-start gap-2">
            <Users className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block">{t.vacancies}</span>
              <span className="font-semibold text-slate-800 tabular-nums">{job.vacancies} vị trí</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs mt-3 space-y-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0F766E]"></span>
          <span>{t.jobDescription}</span>
        </h2>
        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc pl-4">
          {descriptionList.map((desc, idx) => (
            <li key={idx}>{desc}</li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs mt-3 space-y-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0F766E]"></span>
          <span>{t.jobRequirements}</span>
        </h2>
        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc pl-4">
          {requirementsList.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
        <div className="pt-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">{t.skills}: </span>
          <span>{job.skills.join(' · ')}</span>
        </div>
      </div>

      {/* Benefits & Schedule */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs mt-3 space-y-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0F766E]"></span>
          <span>{t.jobBenefits}</span>
        </h2>
        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc pl-4">
          {benefitsList.map((ben, idx) => (
            <li key={idx}>{ben}</li>
          ))}
        </ul>

        <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
          <p>
            <strong className="text-slate-800">{t.companyAddress}: </strong>
            {job.address}
          </p>
          <p>
            <strong className="text-slate-800">{t.contactPerson}: </strong>
            {job.contactPerson}
          </p>
        </div>
      </div>

      {/* Fixed Mobile Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`p-3 rounded-xl border transition-colors touch-manipulation ${
              isSaved
                ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            aria-label={t.saveJob}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#0F766E]' : ''}`} />
          </button>

          {hasApplied ? (
            <button
              type="button"
              disabled
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.applied}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all touch-manipulation"
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5 pb-safe animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  {t.applyFormTitle}
                </h3>
                <p className="text-[11px] text-slate-500 truncate max-w-[260px]">
                  {job.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
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
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E] tabular-nums"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.emailAddress} *
                  </label>
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Trường ĐH / CĐ
                  </label>
                  <input
                    type="text"
                    value={applicantUni}
                    onChange={(e) => setApplicantUni(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ngành học
                  </label>
                  <input
                    type="text"
                    value={applicantMajor}
                    onChange={(e) => setApplicantMajor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ca rảnh có thể làm việc
                </label>
                <input
                  type="text"
                  value={applicantShifts}
                  onChange={(e) => setApplicantShifts(e.target.value)}
                  placeholder="VD: Ca Chiều T3, T5 và Cuối tuần"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Lời nhắn / Link CV (Drive/Portfolio)
                </label>
                <textarea
                  rows={2}
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  placeholder="Chia sẻ lý do ứng tuyển hoặc liên kết CV online..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F766E] text-white text-xs font-bold rounded-xl hover:bg-[#115E59]"
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
