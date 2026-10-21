import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Camera,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Briefcase,
  Plus,
  LogOut,
  Save,
  Trash2,
  PenTool,
  Building2,
  User,
} from "lucide-react";
import { Language, StudentProfile, UserAccount, EducationItem } from "../types";
import { CITIES, STANDARD_MAJORS, SALARY_CATEGORIES } from "../data/mockJobs";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  currentUser: UserAccount | null;
  onSaveProfile: (updated: StudentProfile) => void;
  onLogout: () => void;
  lang: Language;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  isOpen,
  onClose,
  profile,
  currentUser,
  onSaveProfile,
  onLogout,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chuyên ngành: Tùy chọn "Khác" cho phép tự nhập thông tin
  const [isCustomMajor, setIsCustomMajor] = useState(false);
  const [customMajorText, setCustomMajorText] = useState('');

  // Quick add education
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEduSchool, setNewEduSchool] = useState('');
  const [newEduMajor, setNewEduMajor] = useState('');
  const [newEduYear, setNewEduYear] = useState('');

  useEffect(() => {
    setFormData(profile);
    if (!profile.faculty) {
      setIsCustomMajor(false);
      setCustomMajorText('');
    } else if (STANDARD_MAJORS.includes(profile.faculty)) {
      setIsCustomMajor(false);
      setCustomMajorText('');
    } else {
      setIsCustomMajor(true);
      setCustomMajorText(profile.faculty);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduSchool.trim()) return;

    const item: EducationItem = {
      id: 'edu-' + Date.now(),
      school: newEduSchool.trim(),
      major: newEduMajor.trim() || formData.faculty,
      degree: 'Đại học / Cao đẳng',
      year: newEduYear.trim() || '2023 - 2027',
    };

    const currentList = formData.educationList || [];
    setFormData((prev) => ({
      ...prev,
      educationList: [...currentList, item],
      university: prev.university || item.school,
    }));

    setNewEduSchool('');
    setNewEduMajor('');
    setNewEduYear('');
    setShowAddEdu(false);
  };

  const handleRemoveEdu = (id: string) => {
    const currentList = formData.educationList || [];
    setFormData((prev) => ({
      ...prev,
      educationList: currentList.filter((x) => x.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFaculty = isCustomMajor ? customMajorText.trim() : formData.faculty;
    const finalProfile = {
      ...formData,
      faculty: finalFaculty,
    };
    onSaveProfile(finalProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex" role="dialog" aria-modal="true">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide bar on left */}
      <div className="relative w-[90vw] sm:w-[420px] max-w-md h-[100dvh] bg-white shadow-2xl z-[10000] flex flex-col overflow-hidden animate-slideRight border-r border-[#E8E2D5]">
        {/* Header Bar */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-[#1E3821] via-[#2F5233] to-[#3B5E3C] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            {currentUser?.role === 'employer' ? (
              <Building2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <User className="w-4 h-4 text-emerald-300" />
            )}
            <div>
              <h2 className="text-sm font-black font-display text-white">
                {currentUser?.role === 'employer' ? 'Hồ sơ Doanh nghiệp' : 'Hồ sơ Ứng viên'}
              </h2>
              <p className="text-[10px] text-[#FAF7F2]/80">
                {currentUser ? currentUser.email || currentUser.phone : 'Chưa đăng nhập'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thông báo đã lưu thành công */}
        {savedSuccess && (
          <div className="px-4 py-2 bg-[#EBF2EB] text-[#2F5233] text-xs font-semibold flex items-center gap-2 shrink-0 border-b border-[#2F5233]/20 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#2F5233] shrink-0" />
            <span>✓ Đã lưu thông tin cá nhân vào tài khoản thành công!</span>
          </div>
        )}

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 pb-28">
          {/* Avatar card */}
          <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-3 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white ring-2 ring-[#2F5233]/30 flex items-center justify-center shadow-xs">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.fullName || 'Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-bold text-[#2F5233]">
                    {formData.fullName?.charAt(0) || (currentUser?.role === 'employer' ? 'DN' : 'SV')}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#2F5233] text-white shadow-md active:scale-95 hover:bg-[#244127]"
                title="Đổi ảnh đại diện"
              >
                <Camera className="w-3 h-3" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-stone-900 truncate">
                {formData.fullName || '(Họ và tên chưa nhập)'}
              </h3>
              <p className="text-[11px] text-[#2F5233] font-medium truncate">
                {isCustomMajor
                  ? (customMajorText || 'Chuyên ngành tự nhập...')
                  : (formData.faculty || 'Chưa chọn chuyên ngành')}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] text-[#2F5233] underline font-semibold mt-0.5 block"
              >
                Tải lên ảnh chân dung
              </button>
            </div>
          </div>

          {/* 1. HỌ VÀ TÊN, SỐ ĐIỆN THOẠI, EMAIL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wide block">
                1. Họ tên & Liên hệ
              </span>
              <span className="text-[9px] text-stone-400">
                * Bắt buộc
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                Họ và tên *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                placeholder="Nhập họ và tên..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl tabular-nums focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                  placeholder="0912..."
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                  placeholder="email@student.edu.vn"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                Địa chỉ hiện tại
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                placeholder="Số nhà, đường, Quận/Huyện, Tỉnh/TP..."
              />
            </div>
          </div>

          <hr className="border-[#E8E2D5]" />

          {/* 2. HỌC VẤN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#2F5233]" />
                <span>2. Học vấn & Chuyên ngành</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddEdu(true)}
                className="text-[10px] font-bold text-[#2F5233] flex items-center gap-0.5 bg-[#EBF2EB] px-2 py-0.5 rounded-lg active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm bậc học</span>
              </button>
            </div>

            {/* Form thêm học vấn nhanh */}
            {showAddEdu && (
              <div className="p-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl space-y-1.5 animate-fadeIn">
                <input
                  type="text"
                  value={newEduSchool}
                  onChange={(e) => setNewEduSchool(e.target.value)}
                  placeholder="Tên trường (VD: ĐH Bách Khoa TP.HCM)..."
                  className="w-full px-2 py-1 text-xs bg-white border border-[#E8E2D5] rounded-lg"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={newEduMajor}
                    onChange={(e) => setNewEduMajor(e.target.value)}
                    placeholder="Ngành học..."
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E8E2D5] rounded-lg"
                  />
                  <input
                    type="text"
                    value={newEduYear}
                    onChange={(e) => setNewEduYear(e.target.value)}
                    placeholder="Năm (2023-2027)..."
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E8E2D5] rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddEdu(false)}
                    className="text-[10px] font-semibold text-stone-500 px-2"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEdu}
                    className="text-[10px] font-bold text-white bg-[#2F5233] px-2.5 py-1 rounded-md"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}

            {/* Danh sách học vấn đã thêm */}
            {formData.educationList && formData.educationList.map((item) => (
              <div
                key={item.id}
                className="p-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-stone-900">{item.school}</p>
                  <p className="text-[10px] text-stone-500">{item.major} · {item.year}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEdu(item.id)}
                  className="text-stone-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                Trường Đại học / Cao đẳng chính
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                placeholder="VD: ĐH Quốc Gia / Kinh Tế / Bách Khoa..."
              />
            </div>

            {/* Chuyên ngành */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-semibold text-stone-700">
                  Chuyên ngành học
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMajor(false);
                      if (!STANDARD_MAJORS.includes(formData.faculty)) {
                        setFormData((prev) => ({ ...prev, faculty: '' }));
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                      !isCustomMajor
                        ? 'bg-[#2F5233] text-white shadow-2xs'
                        : 'bg-[#FAF7F2] border border-[#E8E2D5] text-stone-600 hover:bg-[#F2ECE1]'
                    }`}
                  >
                    Chọn danh sách
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMajor(true);
                      setFormData((prev) => ({ ...prev, faculty: customMajorText }));
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all flex items-center gap-0.5 ${
                      isCustomMajor
                        ? 'bg-[#2F5233] text-white shadow-2xs'
                        : 'bg-[#FAF7F2] border border-[#E8E2D5] text-stone-600 hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <PenTool className="w-2.5 h-2.5" />
                    <span>Tự nhập</span>
                  </button>
                </div>
              </div>

              {!isCustomMajor && (
                <select
                  value={formData.faculty || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'KHAC') {
                      setIsCustomMajor(true);
                      setFormData((prev) => ({ ...prev, faculty: customMajorText }));
                    } else {
                      setIsCustomMajor(false);
                      setFormData((prev) => ({ ...prev, faculty: val }));
                    }
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] font-medium text-stone-800"
                >
                  <option value="">-- Chọn chuyên ngành học --</option>
                  {STANDARD_MAJORS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="KHAC">✍️ Khác (Tự nhập ngành của bạn...)</option>
                </select>
              )}

              {isCustomMajor && (
                <div className="p-2.5 bg-[#EBF2EB] border border-[#2F5233]/40 rounded-xl space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2F5233] flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5 text-[#2F5233]" />
                      <span>Tự nhập tên chuyên ngành của bạn:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomMajor(false);
                        setFormData((prev) => ({ ...prev, faculty: STANDARD_MAJORS[0] }));
                      }}
                      className="text-[10px] text-[#2F5233] underline font-semibold"
                    >
                      Chọn lại danh sách
                    </button>
                  </div>
                  <input
                    type="text"
                    value={customMajorText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomMajorText(val);
                      setFormData((prev) => ({ ...prev, faculty: val }));
                    }}
                    placeholder="Ví dụ: Cơ điện tử, Luật thương mại, Y đa khoa, Kiến trúc..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#2F5233] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5233]/40 font-semibold text-stone-900 placeholder:text-stone-400"
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                  GPA
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl tabular-nums focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                  placeholder="3.5 / 4.0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                  Năm tốt nghiệp
                </label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl tabular-nums focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                  placeholder="2027"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#E8E2D5]" />

          {/* 3. KỸ NĂNG CÁ NHÂN */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#2F5233]" />
              <span>3. Kỹ năng cá nhân</span>
            </span>

            <div className="flex flex-wrap gap-1">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8E2D5] text-stone-800 text-[11px]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600"
                    aria-label={`Xóa kỹ năng ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {formData.skills.length === 0 && (
                <span className="text-[10px] text-stone-400 italic">
                  Chưa có kỹ năng. Hãy nhập kỹ năng bên dưới.
                </span>
              )}
            </div>

            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Thêm kỹ năng (VD: Tiếng Anh, React, Canva)..."
                className="flex-1 px-2 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-[#2F5233] hover:bg-[#244127] text-white rounded-xl text-xs font-bold active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <hr className="border-[#E8E2D5]" />

          {/* 4. NHU CẦU TÌM VIỆC */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#2F5233]" />
              <span>4. Nhu cầu tìm việc</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                  Hình thức
                </label>
                <select
                  value={formData.desiredJobType || 'Part-time'}
                  onChange={(e) => setFormData({ ...formData, desiredJobType: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                >
                  <option value="Part-time">Part-time</option>
                  <option value="Thực tập">Thực tập</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                  Khu vực toàn quốc
                </label>
                <select
                  value={formData.preferredCity || 'Tất cả địa điểm'}
                  onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                Mức lương mong muốn
              </label>
              <select
                value={formData.desiredSalary || 'Theo giờ (25k - 60k/h)'}
                onChange={(e) => setFormData({ ...formData, desiredSalary: e.target.value })}
                className="w-full px-2 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              >
                {SALARY_CATEGORIES.filter((s) => s !== 'Tất cả mức lương').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NÚT LƯU THAY ĐỔI & ĐĂNG XUẤT */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#2F5233] hover:bg-[#244127] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all touch-manipulation"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thay đổi hồ sơ</span>
            </button>

            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2 bg-[#FAF7F2] border border-[#E8E2D5] text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 hover:bg-[#F2ECE1] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất tài khoản</span>
              </button>
            ) : (
              <p className="text-[10px] text-center text-stone-500 italic pt-1">
                Đăng nhập để tự động lưu hồ sơ theo tài khoản của bạn.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
