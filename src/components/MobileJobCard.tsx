import React from 'react';
import { Bookmark, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Job, Language } from '../types';
import { useTranslation } from '../data/translations';

interface MobileJobCardProps {
  job: Job;
  isSaved: boolean;
  hasApplied: boolean;
  matchReasons?: string[];
  lang: Language;
  onSelect: (job: Job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
}

export const MobileJobCard: React.FC<MobileJobCardProps> = ({
  job,
  isSaved,
  hasApplied,
  matchReasons,
  lang,
  onSelect,
  onToggleSave,
}) => {
  const t = useTranslation(lang);
  const title = lang === 'en' && job.titleEn ? job.titleEn : job.title;
  const salary = lang === 'en' && job.salaryTextEn ? job.salaryTextEn : job.salaryText;

  return (
    <div
      onClick={() => onSelect(job)}
      className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-[#0F766E]/40 active:scale-[0.99] transition-all cursor-pointer relative touch-manipulation"
    >
      {/* Top Header: Company monogram + tags + bookmark */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs font-display"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyShort}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate block">
              {job.companyName}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-semibold text-[#0F766E]">{job.jobType}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{job.workMode}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => onToggleSave(job.id, e)}
          className={`p-2 rounded-full border transition-colors touch-manipulation ${
            isSaved
              ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
              : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700'
          }`}
          aria-label={isSaved ? t.saved : t.saveJob}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#0F766E]' : ''}`} />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
        {title}
      </h3>

      {/* Salary & Location Row */}
      <div className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl mb-2.5">
        <span className="font-bold text-[#0F766E] font-mono tabular-nums">
          {salary}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[120px]">{job.city}</span>
        </div>
      </div>

      {/* Skills & Match Chips */}
      <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-600 mb-2">
        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
          {job.major}
        </span>
        {job.skills.slice(0, 2).map((sk) => (
          <span
            key={sk}
            className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
          >
            {sk}
          </span>
        ))}
      </div>

      {/* Matching reason tag if present */}
      {matchReasons && matchReasons.length > 0 && (
        <div className="text-[10px] text-emerald-700 font-medium mb-2.5 line-clamp-1 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
          ✓ {matchReasons.join(' · ')}
        </div>
      )}

      {/* Bottom Footer: Shifts & Applied status */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[160px]">
            {job.availableShifts.slice(0, 2).join(', ')}
          </span>
        </div>

        {hasApplied ? (
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {t.applied}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-[#0F766E] flex items-center gap-0.5">
            <span>{t.viewDetails}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};
