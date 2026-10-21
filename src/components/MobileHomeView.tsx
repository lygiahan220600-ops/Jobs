import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, MapPin } from 'lucide-react';
import { Job, Language, ShiftSlot, StudentProfile } from '../types';
import { useTranslation } from '../data/translations';
import { CITIES, JOB_TYPES, SALARY_CATEGORIES, SHIFT_SLOTS, MAJORS } from '../data/mockJobs';
import { MobileJobCard } from './MobileJobCard';

interface MobileHomeViewProps {
  jobs: Job[];
  savedJobIds: string[];
  appliedJobIds: string[];
  profile: StudentProfile;
  lang: Language;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onNavigateToSearch: (query: string) => void;
}

export const MobileHomeView: React.FC<MobileHomeViewProps> = ({
  jobs,
  savedJobIds,
  appliedJobIds,
  profile,
  lang,
  onSelectJob,
  onToggleSave,
  onNavigateToSearch,
}) => {
  const t = useTranslation(lang);

  // Quick Hero filters
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tất cả địa điểm');
  const [selectedSalary, setSelectedSalary] = useState('Tất cả mức lương');
  const [selectedJobType, setSelectedJobType] = useState('Tất cả loại hình');
  const [selectedShift, setSelectedShift] = useState<ShiftSlot | 'Tất cả'>('Tất cả');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter jobs & calculate reasons matching student profile
  const matchedJobs = useMemo(() => {
    return jobs.map((job) => {
      const matchReasons: string[] = [];

      // Keyword filter
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const inTitle = job.title.toLowerCase().includes(kw) || (job.titleEn && job.titleEn.toLowerCase().includes(kw));
        const inCompany = job.companyName.toLowerCase().includes(kw);
        const inCity = job.city.toLowerCase().includes(kw);
        const inSkills = job.skills.some((s) => s.toLowerCase().includes(kw));
        if (!inTitle && !inCompany && !inSkills && !inCity) return null;
      }

      // City filter (Khu vực toàn quốc)
      if (selectedCity !== 'Tất cả địa điểm' && job.city !== selectedCity) {
        return null;
      }

      // Salary filter
      if (selectedSalary !== 'Tất cả mức lương' && job.salaryCategory !== selectedSalary) {
        return null;
      }

      // Job Type filter
      if (selectedJobType !== 'Tất cả loại hình' && job.jobType !== selectedJobType) {
        return null;
      }

      // Shift filter
      if (selectedShift !== 'Tất cả' && !job.availableShifts.includes(selectedShift)) {
        return null;
      }

      // Calculate automated student profile matches
      if (profile.faculty && job.major.toLowerCase().includes(profile.faculty.toLowerCase())) {
        matchReasons.push(`Đúng ngành ${profile.faculty}`);
      }

      const sharedSkills = job.skills.filter((sk) =>
        profile.skills.some((ps) => ps.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(ps.toLowerCase()))
      );
      if (sharedSkills.length > 0) {
        matchReasons.push(`Kỹ năng (${sharedSkills.slice(0, 2).join(', ')})`);
      }

      if (profile.preferredCity && profile.preferredCity !== 'Tất cả địa điểm' && job.city === profile.preferredCity) {
        matchReasons.push(`Gần bạn (${job.city})`);
      }

      return { job, matchReasons };
    }).filter((item): item is { job: Job; matchReasons: string[] } => item !== null);
  }, [jobs, keyword, selectedCity, selectedSalary, selectedJobType, selectedShift, profile]);

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Hero Banner Responsive for both Mobile & Desktop */}
      <div className="bg-gradient-to-br from-[#0F766E] to-[#115E59] rounded-2xl p-4 sm:p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Việc làm sinh viên toàn quốc & Online Remote</span>
          </div>

          <h1 className="text-lg sm:text-2xl font-black font-display leading-tight">
            {t.heroHeading}
          </h1>

          <p className="text-xs sm:text-sm text-white/85 mt-1.5 line-clamp-2 leading-relaxed">
            Kết nối sinh viên các trường đại học, cao đẳng trên khắp 63 tỉnh thành với cơ hội thực tập, part-time và remote linh hoạt.
          </p>

          {/* Search bar */}
          <div className="mt-3.5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t.heroSearchPlaceholder}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl placeholder:text-slate-400 focus:outline-none shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Quick Filter Horizontal Scroll Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{t.filterBy}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-xs font-semibold text-[#0F766E] flex items-center gap-1 active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvancedFilters ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc khu vực'}</span>
          </button>
        </div>

        {/* Quick job type buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {['Tất cả loại hình', 'Part-time', 'Full-time', 'Thực tập'].map((type) => {
            const isSelected = selectedJobType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedJobType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                  isSelected
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type === 'Tất cả loại hình' ? 'Tất cả loại hình' : type}
              </button>
            );
          })}
        </div>

        {/* Khu vực toàn quốc: Hàng chọn nhanh các thành phố lớn */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['Tất cả địa điểm', 'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Bình Dương', 'Làm từ xa (Toàn quốc / Remote)'].map((city) => {
            const isCityActive = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  isCityActive
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city === 'Tất cả địa điểm' ? 'Toàn quốc' : city}
              </button>
            );
          })}
        </div>

        {/* Expandable detailed filter selects (Khu vực, Mức lương, Ca rảnh) */}
        {showAdvancedFilters && (
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.location} (Tỉnh/Thành phố toàn quốc)
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0F766E]"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.salary}
                </label>
                <select
                  value={selectedSalary}
                  onChange={(e) => setSelectedSalary(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0F766E]"
                >
                  {SALARY_CATEGORIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.shifts}
                </label>
                <div className="flex flex-wrap gap-1">
                  {(['Tất cả', ...SHIFT_SLOTS] as (ShiftSlot | 'Tất cả')[]).map((sh) => (
                    <button
                      key={sh}
                      type="button"
                      onClick={() => setSelectedShift(sh)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        selectedShift === sh
                          ? 'bg-[#0F766E] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {sh === 'Tất cả' ? 'Tất cả' : `Ca ${sh}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Matched Jobs Grid: 1 cột trên điện thoại, 2-3 cột trên máy tính/tablet */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-display">
              {t.matchedForYou}
            </h2>
            <p className="text-xs text-slate-500">
              {t.matchedSubtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-[#0F766E] tabular-nums bg-[#0F766E]/10 px-2.5 py-1 rounded-full">
            {matchedJobs.length} {t.jobsFound}
          </span>
        </div>

        {matchedJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-2xs">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              {t.noSearchResults}
            </p>
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setSelectedCity('Tất cả địa điểm');
                setSelectedSalary('Tất cả mức lương');
                setSelectedJobType('Tất cả loại hình');
                setSelectedShift('Tất cả');
              }}
              className="px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {matchedJobs.map(({ job, matchReasons }) => (
              <MobileJobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                hasApplied={appliedJobIds.includes(job.id)}
                matchReasons={matchReasons}
                lang={lang}
                onSelect={onSelectJob}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
