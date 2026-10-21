import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Building2, ArrowRight } from 'lucide-react';
import { Job, Language, ShiftSlot, StudentProfile } from '../types';
import { useTranslation } from '../data/translations';
import { CITIES, SALARY_CATEGORIES, SHIFT_SLOTS } from '../data/mockJobs';
import { MobileJobCard } from './MobileJobCard';
import { APP_LOGO_SRC } from './AppLogo';

interface MobileHomeViewProps {
  jobs: Job[];
  savedJobIds: string[];
  appliedJobIds: string[];
  profile: StudentProfile;
  lang: Language;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onNavigateToSearch: (query: string) => void;
  onApplyQuick?: (job: Job) => void;
  onNavigateToTab?: (tab: string) => void;
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
  onApplyQuick,
  onNavigateToTab,
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
    return jobs
      .filter((j) => (j.status || 'published') === 'published')
      .map((job) => {
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
      })
      .filter((item): item is { job: Job; matchReasons: string[] } => item !== null);
  }, [jobs, keyword, selectedCity, selectedSalary, selectedJobType, selectedShift, profile]);

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Hero Banner in Moss Green Gradient */}
      <div className="bg-gradient-to-br from-[#1E3821] via-[#2F5233] to-[#3B5E3C] rounded-3xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[#FAF7F2] text-[11px] font-semibold mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Nền tảng việc làm sinh viên & part-time</span>
          </div>

          <h1 className="text-lg sm:text-2xl font-black font-display leading-tight text-white">
            {t.heroHeading}
          </h1>

          <p className="text-xs sm:text-sm text-[#FAF7F2]/90 mt-1.5 line-clamp-2 leading-relaxed">
            Kết nối sinh viên trên khắp 63 tỉnh thành với cơ hội thực tập, part-time và remote linh hoạt theo lịch học.
          </p>

          {/* Search bar inside Hero */}
          <div className="mt-3.5 relative">
            <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && keyword.trim()) {
                  onNavigateToSearch(keyword.trim());
                }
              }}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-20 py-2.5 bg-white text-stone-900 rounded-2xl text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-xs"
            />
            <button
              type="button"
              onClick={() => onNavigateToSearch(keyword.trim())}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2F5233] text-white text-xs font-bold rounded-xl hover:bg-[#244127] transition-colors"
            >
              {t.searchTab}
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-4 -bottom-6 w-32 h-32 sm:w-44 sm:h-44 opacity-15 pointer-events-none flex items-center justify-center">
          <img
            src={APP_LOGO_SRC}
            alt="Jobs Watermark"
            className="w-full h-full object-contain filter invert"
          />
        </div>
      </div>

      {/* 2 Quick Feature Promotion Cards in Rêu - Trắng - Kem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card 1: Tạo CV AI */}
        <div
          onClick={() => onNavigateToTab && onNavigateToTab('ai-cv')}
          className="bg-white border border-[#E8E2D5] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-[#2F5233] hover:shadow-md transition-all active:scale-[0.99] group shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#2F5233] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                Tạo CV xin việc với AI
              </h3>
              <p className="text-[11px] text-stone-600 truncate mt-0.5">
                Tự động tối ưu hồ sơ chuẩn ATS cho sinh viên
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#2F5233] shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Card 2: Cổng Nhà Tuyển Dụng */}
        <div
          onClick={() => onNavigateToTab && onNavigateToTab('employer')}
          className="bg-[#244127] text-white rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#1E3821] hover:shadow-md transition-all active:scale-[0.99] group shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                Cổng Nhà Tuyển Dụng
              </h3>
              <p className="text-[11px] text-[#FAF7F2]/80 truncate mt-0.5">
                Đăng bài tuyển dụng & Duyệt hồ sơ nhanh
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Filter and Job matching section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {['Tất cả loại hình', 'Part-time', 'Thực tập', 'Full-time'].map((type) => {
              const isActive = selectedJobType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedJobType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#2F5233] text-white shadow-xs'
                      : 'bg-white border border-[#E8E2D5] text-stone-700 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors shrink-0 ${
              showAdvancedFilters
                ? 'bg-[#2F5233] text-white border-[#2F5233]'
                : 'bg-white border-[#E8E2D5] text-stone-700 hover:bg-[#FAF7F2]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bộ lọc</span>
          </button>
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
                    ? 'bg-[#2F5233] text-white font-bold shadow-2xs'
                    : 'bg-white border border-[#E8E2D5] text-stone-700 hover:bg-[#FAF7F2]'
                }`}
              >
                {city === 'Tất cả địa điểm' ? 'Toàn quốc' : city}
              </button>
            );
          })}
        </div>

        {/* Expandable detailed filter selects in Kem theme */}
        {showAdvancedFilters && (
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-3.5 shadow-xs space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {t.location} (Tỉnh/Thành phố)
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl text-stone-800 focus:outline-none focus:border-[#2F5233]"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {t.salary}
                </label>
                <select
                  value={selectedSalary}
                  onChange={(e) => setSelectedSalary(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl text-stone-800 focus:outline-none focus:border-[#2F5233]"
                >
                  {SALARY_CATEGORIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
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
                          ? 'bg-[#2F5233] text-white'
                          : 'bg-[#FAF7F2] border border-[#E8E2D5] text-stone-700 hover:bg-[#F2ECE1]'
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

      {/* Job list section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-stone-900 font-display">
              {t.matchedForYou}
            </h2>
            <p className="text-xs text-stone-600">
              {t.matchedSubtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-[#2F5233] tabular-nums bg-[#EBF2EB] border border-[#2F5233]/20 px-2.5 py-1 rounded-full">
            {matchedJobs.length} {t.jobsFound}
          </span>
        </div>

        {matchedJobs.length === 0 ? (
          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 text-center shadow-xs">
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
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
              className="px-4 py-2 bg-[#2F5233] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#244127]"
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
                onApplyQuick={() => onApplyQuick && onApplyQuick(job)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
