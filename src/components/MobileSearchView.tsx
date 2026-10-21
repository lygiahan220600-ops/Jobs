import React, { useMemo } from 'react';
import { Search, RotateCcw, MapPin } from 'lucide-react';
import { Job, Language, SearchFilterState } from '../types';
import { useTranslation } from '../data/translations';
import {
  CITIES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  MAJORS,
  SALARY_CATEGORIES,
} from '../data/mockJobs';
import { MobileJobCard } from './MobileJobCard';

interface MobileSearchViewProps {
  jobs: Job[];
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  savedJobIds: string[];
  appliedJobIds: string[];
  lang: Language;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
}

export const MobileSearchView: React.FC<MobileSearchViewProps> = ({
  jobs,
  filters,
  setFilters,
  savedJobIds,
  appliedJobIds,
  lang,
  onSelectJob,
  onToggleSave,
}) => {
  const t = useTranslation(lang);

  const handleReset = () => {
    setFilters({
      keyword: '',
      location: 'Tất cả địa điểm',
      jobType: 'Tất cả loại hình',
      salaryCategory: 'Tất cả mức lương',
      experience: 'Tất cả kinh nghiệm',
      major: 'Tất cả ngành học',
      workMode: 'Tất cả hình thức',
      shift: 'Tất cả ca làm',
    });
  };

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Keyword
      if (filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase().trim();
        const inTitle = job.title.toLowerCase().includes(kw) || (job.titleEn && job.titleEn.toLowerCase().includes(kw));
        const inCompany = job.companyName.toLowerCase().includes(kw);
        const inCity = job.city.toLowerCase().includes(kw);
        const inSkills = job.skills.some((s) => s.toLowerCase().includes(kw));
        const inAddress = job.address.toLowerCase().includes(kw);
        if (!inTitle && !inCompany && !inSkills && !inAddress && !inCity) return false;
      }

      // 2. Location (Toàn quốc)
      if (filters.location !== 'Tất cả địa điểm' && job.city !== filters.location) {
        return false;
      }

      // 3. Job Type (part time, full time, thực tập)
      if (filters.jobType !== 'Tất cả loại hình' && job.jobType !== filters.jobType) {
        return false;
      }

      // 4. Salary
      if (filters.salaryCategory !== 'Tất cả mức lương' && job.salaryCategory !== filters.salaryCategory) {
        return false;
      }

      // 5. Experience
      if (filters.experience !== 'Tất cả kinh nghiệm' && job.experience !== filters.experience) {
        return false;
      }

      // Major
      if (filters.major !== 'Tất cả ngành học' && job.major !== filters.major) {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-28 space-y-3.5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.keyword}
          onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
          placeholder={t.heroSearchPlaceholder}
          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E] shadow-2xs"
        />
      </div>

      {/* Filter Options Responsive Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Location: Toàn quốc */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0F766E]" />
              <span>{t.location} (Toàn quốc)</span>
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0F766E]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type: Part-time, Full-time, Thực tập */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.workMode} / Loại hình
            </label>
            <select
              value={filters.jobType}
              onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value }))}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0F766E]"
            >
              {JOB_TYPES.map((jt) => (
                <option key={jt} value={jt}>
                  {jt}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.salary}
            </label>
            <select
              value={filters.salaryCategory}
              onChange={(e) => setFilters((prev) => ({ ...prev, salaryCategory: e.target.value }))}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0F766E]"
            >
              {SALARY_CATEGORIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.experience}
            </label>
            <select
              value={filters.experience}
              onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0F766E]"
            >
              {EXPERIENCE_LEVELS.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second row: Major & Reset button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="w-full sm:w-72">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.major}
            </label>
            <select
              value={filters.major}
              onChange={(e) => setFilters((prev) => ({ ...prev, major: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0F766E]"
            >
              {MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 self-end sm:self-auto touch-manipulation pt-1 sm:pt-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-sm font-bold text-slate-800">
          {t.jobsFound}: <strong className="text-[#0F766E] tabular-nums font-black">{filtered.length}</strong>
        </span>
      </div>

      {/* Job Cards Responsive Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-2xs">
          <p className="text-xs sm:text-sm text-slate-600 mb-3">
            {t.noSearchResults}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-semibold"
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((job) => (
            <MobileJobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              hasApplied={appliedJobIds.includes(job.id)}
              lang={lang}
              onSelect={onSelectJob}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
