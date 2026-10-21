import React, { useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
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
  onSelectJob: (job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onApplyQuick?: (job: Job) => void;
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
  onApplyQuick,
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
        <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.keyword}
          onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E2D5] rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#2F5233]/20 focus:border-[#2F5233] shadow-xs"
        />
      </div>

      {/* Filter Row 1: Location & Job Type */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          className="w-full px-2.5 py-2 text-xs bg-white border border-[#E8E2D5] rounded-xl text-stone-800 focus:outline-none focus:border-[#2F5233] shadow-2xs truncate"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.jobType}
          onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value }))}
          className="w-full px-2.5 py-2 text-xs bg-white border border-[#E8E2D5] rounded-xl text-stone-800 focus:outline-none focus:border-[#2F5233] shadow-2xs truncate"
        >
          {JOB_TYPES.map((jt) => (
            <option key={jt} value={jt}>
              {jt}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Row 2: Salary, Major, Experience */}
      <div className="grid grid-cols-3 gap-2">
        <select
          value={filters.salaryCategory}
          onChange={(e) => setFilters((prev) => ({ ...prev, salaryCategory: e.target.value }))}
          className="w-full px-2 py-2 text-[11px] sm:text-xs bg-white border border-[#E8E2D5] rounded-xl text-stone-800 focus:outline-none focus:border-[#2F5233] shadow-2xs truncate"
        >
          {SALARY_CATEGORIES.map((sc) => (
            <option key={sc} value={sc}>
              {sc}
            </option>
          ))}
        </select>

        <select
          value={filters.major}
          onChange={(e) => setFilters((prev) => ({ ...prev, major: e.target.value }))}
          className="w-full px-2 py-2 text-[11px] sm:text-xs bg-white border border-[#E8E2D5] rounded-xl text-stone-800 focus:outline-none focus:border-[#2F5233] shadow-2xs truncate"
        >
          {MAJORS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={filters.experience}
          onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))}
          className="w-full px-2 py-2 text-[11px] sm:text-xs bg-white border border-[#E8E2D5] rounded-xl text-stone-800 focus:outline-none focus:border-[#2F5233] shadow-2xs truncate"
        >
          {EXPERIENCE_LEVELS.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </div>

      {/* Results Header + Reset button */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-semibold text-stone-700">
          Tìm thấy <span className="text-[#2F5233] font-bold">{filtered.length}</span> việc làm
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-stone-600 hover:text-[#2F5233] text-[11px] font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.resetFilters}</span>
        </button>
      </div>

      {/* Job Cards Responsive Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 text-center shadow-xs">
          <p className="text-xs sm:text-sm text-stone-700 mb-3">
            {t.noSearchResults}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[#2F5233] text-white rounded-xl text-xs font-semibold hover:bg-[#244127] transition-colors"
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
              onApplyQuick={() => onApplyQuick && onApplyQuick(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
