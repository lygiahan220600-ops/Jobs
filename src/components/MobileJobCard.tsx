import React from 'react';
import { Bookmark, MapPin, Clock, ArrowRight, Send, CheckCircle2 } from 'lucide-react';
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
  onApplyQuick?: (job: Job, e: React.MouseEvent) => void;
  onOpenMessage?: (job: Job, e: React.MouseEvent) => void;
}

export const MobileJobCard: React.FC<MobileJobCardProps> = ({
  job,
  isSaved,
  hasApplied,
  matchReasons,
  lang,
  onSelect,
  onToggleSave,
  onApplyQuick,
}) => {
  const t = useTranslation(lang);
  const title = lang === 'en' && job.titleEn ? job.titleEn : job.title;
  const salary = lang === 'en' && job.salaryTextEn ? job.salaryTextEn : job.salaryText;

  return (
    <div
      onClick={() => onSelect(job)}
      className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs hover:border-[#2F5233]/60 hover:shadow-md transition-all cursor-pointer relative touch-manipulation group flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Company monogram + tags + bookmark */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs font-display transition-transform group-hover:scale-105"
              style={{ backgroundColor: job.companyColor || '#2F5233' }}
            >
              {job.companyShort}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-stone-900 truncate block">
                {job.companyName}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                <span className="font-semibold text-[#2F5233]">{job.jobType}</span>
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
                ? 'border-[#2F5233] bg-[#EBF2EB] text-[#2F5233]'
                : 'border-[#E8E2D5] bg-[#FAF7F2] text-stone-600 hover:text-stone-800'
            }`}
            aria-label={isSaved ? t.saved : t.saveJob}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#2F5233]' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#2F5233] transition-colors">
          {title}
        </h3>

        {/* Salary & Location Row (Kem surface) */}
        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-[#FAF7F2] border border-[#E8E2D5]/70 rounded-xl mb-2.5">
          <span className="font-bold text-[#2F5233] font-mono tabular-nums">
            {salary}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-stone-600">
            <MapPin className="w-3 h-3 shrink-0 text-[#2F5233]" />
            <span className="truncate max-w-[120px]">{job.city}</span>
          </div>
        </div>

        {/* Skills & Match Chips */}
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-stone-700 mb-2.5">
          <span className="bg-[#FAF7F2] border border-[#E8E2D5] text-stone-800 px-2 py-0.5 rounded-md font-medium">
            {job.major}
          </span>
          {job.skills.slice(0, 2).map((sk) => (
            <span
              key={sk}
              className="bg-white border border-[#E8E2D5] text-stone-600 px-2 py-0.5 rounded-md"
            >
              {sk}
            </span>
          ))}
        </div>

        {/* Matching reason tag if present */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="text-[10px] text-[#2F5233] font-medium mb-2.5 line-clamp-1 bg-[#EBF2EB] px-2 py-0.5 rounded-md border border-[#2F5233]/20">
            ✓ {matchReasons.join(' · ')}
          </div>
        )}
      </div>

      {/* Bottom Footer: Shifts & Quick Apply Action Button */}
      <div className="pt-2.5 border-t border-[#E8E2D5] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-stone-600 min-w-0">
          <Clock className="w-3 h-3 shrink-0 text-stone-600" />
          <span className="truncate max-w-[130px] sm:max-w-[150px]">
            {job.availableShifts.slice(0, 2).join(', ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {hasApplied ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F5233] bg-[#EBF2EB] border border-[#2F5233]/30 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5233]" />
              <span>Đã ứng tuyển</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onApplyQuick) {
                  onApplyQuick(job, e);
                } else {
                  onSelect(job);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2F5233] hover:bg-[#244127] active:scale-95 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all touch-manipulation"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ứng tuyển</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(job);
            }}
            className="p-1.5 rounded-xl text-stone-600 hover:text-stone-800 hover:bg-[#FAF7F2] transition-colors"
            title="Xem chi tiết"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
