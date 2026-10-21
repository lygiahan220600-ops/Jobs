import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Plus,
  X,
  LogOut,
  User,
  Save,
  Calendar,
  FileText,
  Trash2,
  PenTool,
} from 'lucide-react';
import { Language, StudentProfile, UserAccount, EducationItem } from '../types';
import { useTranslation } from '../data/translations';
import { CITIES, STANDARD_MAJORS, SALARY_CATEGORIES } from '../data/mockJobs';

interface ProfileViewProps {
  profile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  lang: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  currentUser,
  onLogout,
  lang,
}) => {
  const t = useTranslation(lang);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Giá trị trong thẻ <select>
  const [selectedMajorOption, setSelectedMajorOption] = useState<string>(() => {
    if (!profile.faculty) return '';
    return STANDARD_MAJORS.includes(profile.faculty) ? profile.faculty : 'Khác';
  });

  // Văn bản tự nhập khi chọn "Khác"
  const [customMajorText, setCustomMajorText] = useState<string>(() => {
    if (!profile.faculty) return '';
    return STANDARD_MAJORS.includes(profile.faculty) ? '' : profile.faculty;
  });

  // New Education entry modal/inline form state
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [newEduSchool, setNewEduSchool] = useState('');
  const [newEduMajor, setNewEduMajor] = useState('');
  const [newEduYear, setNewEduYear] = useState('');
  const [newEduGpa, setNewEduGpa] = useState('');

  useEffect(() => {
    setFormData(profile);
    if (!profile.faculty) {
      setSelectedMajorOption('');
      setCustomMajorText('');
    } else if (STANDARD_MAJORS.includes(profile.faculty)) {
      setSelectedMajorOption(profile.faculty);
      setCustomMajorText('');
    } else {
      setSelectedMajorOption('Khác');
      setCustomMajorText(profile.faculty);
    }
  }, [profile]);

  // Upload Avatar
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

  // Upload CV PDF / Docx
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cvFileName: file.name }));
    }
  };

  // Skills
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

  // Education entries management
  const handleAddEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduSchool.trim()) return;

    const newEdu: EducationItem = {
      id: 'edu-' + Date.now(),
      school: newEduSchool.trim(),
      major: newEduMajor.trim() || formData.faculty,
      degree: 'Cử nhân / Kỹ sư',
      year: newEduYear.trim() || '2023 - 2027',
      gpa: newEduGpa.trim() || formData.gpa,
    };

    const currentList = formData.educationList || [];
    setFormData((prev) => ({
      ...prev,
      educationList: [...currentList, newEdu],
      university: prev.university || newEdu.school,
      faculty: prev.faculty || newEdu.major,
    }));

    setNewEduSchool('');
    setNewEduMajor('');
    setNewEduYear('');
    setNewEduGpa('');
    setShowAddEducation(false);
  };

  const handleRemoveEducation = (eduId: string) => {
    const currentList = formData.educationList || [];
    setFormData((prev) => ({
      ...prev,
      educationList: currentList.filter((item) => item.id !== eduId),
    }));
  };

  // Xử lý thay đổi select ngành
  const handleMajorSelectChange = (val: string) => {
    setSelectedMajorOption(val);
    if (val === 'Khác') {
      setFormData((prev) => ({ ...prev, faculty: customMajorText.trim() }));
    } else {
      setFormData((prev) => ({ ...prev, faculty: val }));
    }
  };

  // Xử lý khi tự gõ chuyên ngành
  const handleCustomMajorInputChange = (text: string) => {
    setCustomMajorText(text);
    setFormData((prev) => ({ ...prev, faculty: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFaculty = selectedMajorOption === 'Khác' ? customMajorText.trim() : selectedMajorOption;
    const finalProfile = {
      ...formData,
      faculty: finalFaculty,
    };
    onSaveProfile(finalProfile);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-36 max-w-4xl mx-auto space-y-4">
      {/* Page Title & Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
            Thông tin cá nhân
          </h1>
          <p className="text-xs text-stone-600">
            {currentUser ? `Tài khoản: ${currentUser.email || currentUser.phone}` : 'Hồ sơ người dùng (Tự động lưu khi đăng nhập)'}
          </p>
        </div>
      </div>

      {showSavedNotification && (
        <div className="p-3 bg-[#2F5233] text-white rounded-2xl flex items-center gap-2 text-xs font-bold shadow-md animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
          <span>✓ Đã lưu thông tin cá nhân thành công!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. THẺ ẢNH ĐẠI DIỆN & TỔNG QUAN */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-18 h-18 rounded-full overflow-hidden bg-[#FAF7F2] ring-4 ring-[#2F5233]/20 flex items-center justify-center shadow-xs">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-[#2F5233]">
                    {formData.fullName ? formData.fullName.charAt(0) : <User className="w-8 h-8 text-stone-400" />}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#2F5233] text-white shadow-md active:scale-95 transition-all hover:bg-[#244127]"
                aria-label={t.uploadPhoto}
              >
                <Camera className="w-3.5 h-3.5" />
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
              <h2 className="text-base font-bold text-stone-900 truncate">
                {formData.fullName || '(Chưa nhập họ và tên)'}
              </h2>
              <p className="text-xs text-[#2F5233] font-semibold truncate mt-0.5">
                {formData.faculty || '(Chưa nhập chuyên ngành)'} · {formData.university || '(Chưa nhập trường)'}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 text-xs text-[#2F5233] font-bold underline block active:opacity-75"
              >
                Chạm để đổi ảnh đại diện
              </button>
            </div>
          </div>
        </div>

        {/* 2. THÔNG TIN CÁ NHÂN & LIÊN HỆ CƠ BẢN */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-2.5">
            <User className="w-4 h-4 text-[#2F5233]" />
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              1. Thông tin cá nhân & Liên hệ
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Họ và tên *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              placeholder="Nhập họ và tên..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Số điện thoại *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] tabular-nums text-stone-900"
                  placeholder="Nhập số điện thoại..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email liên hệ *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                  placeholder="Nhập địa chỉ email..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ngày sinh
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full pl-8 pr-2 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Giới tính
              </label>
              <select
                value={formData.gender || 'Nam'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Địa chỉ hiện tại
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                placeholder="Số nhà, tên đường, Quận/Huyện, Tỉnh/TP..."
              />
            </div>
          </div>
        </div>

        {/* 3. THÔNG TIN HỌC VẤN */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#2F5233]" />
              <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                2. Thông tin học vấn
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddEducation(true)}
              className="px-2.5 py-1 rounded-lg bg-[#EBF2EB] text-[#2F5233] text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm học vấn</span>
            </button>
          </div>

          {/* Form thêm bậc học vấn mới */}
          {showAddEducation && (
            <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">Thêm quá trình học vấn mới</span>
                <button
                  type="button"
                  onClick={() => setShowAddEducation(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  Tên trường ĐH / CĐ / THPT *
                </label>
                <input
                  type="text"
                  value={newEduSchool}
                  onChange={(e) => setNewEduSchool(e.target.value)}
                  placeholder="Ví dụ: Đại học Bách Khoa TP.HCM"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D5] rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    Chuyên ngành
                  </label>
                  <input
                    type="text"
                    value={newEduMajor}
                    onChange={(e) => setNewEduMajor(e.target.value)}
                    placeholder="VD: Khoa học máy tính"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D5] rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    Niên khóa / Năm TN
                  </label>
                  <input
                    type="text"
                    value={newEduYear}
                    onChange={(e) => setNewEduYear(e.target.value)}
                    placeholder="VD: 2023 - 2027"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D5] rounded-lg tabular-nums text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  Điểm GPA / Xếp loại
                </label>
                <input
                  type="text"
                  value={newEduGpa}
                  onChange={(e) => setNewEduGpa(e.target.value)}
                  placeholder="VD: 3.6 / 4.0 (Giỏi)"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D5] rounded-lg text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddEducation(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAddEducationSubmit}
                  className="px-3 py-1.5 bg-[#2F5233] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#244127]"
                >
                  Lưu học vấn này
                </button>
              </div>
            </div>
          )}

          {/* Danh sách các bậc học vấn đã thêm */}
          {formData.educationList && formData.educationList.length > 0 && (
            <div className="space-y-2">
              {formData.educationList.map((edu) => (
                <div
                  key={edu.id}
                  className="p-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl flex items-start justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-stone-900 truncate">{edu.school}</h3>
                    <p className="text-[11px] text-[#2F5233] font-medium">{edu.major}</p>
                    <p className="text-[10px] text-stone-500 tabular-nums">
                      {edu.year} {edu.gpa ? `· GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded-md"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trường thông tin chính */}
          <div className="space-y-2.5 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Trường Đại học / Cao đẳng hiện tại
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                placeholder="VD: Đại học Sư Phạm / Bách Khoa / Kinh Tế..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Chuyên ngành học
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMajorOption(STANDARD_MAJORS[0]);
                      setFormData((prev) => ({ ...prev, faculty: STANDARD_MAJORS[0] }));
                    }}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedMajorOption !== 'Khác'
                        ? 'bg-[#2F5233] text-white shadow-2xs'
                        : 'bg-[#FAF7F2] border border-[#E8E2D5] text-stone-600 hover:bg-[#F2ECE1]'
                    }`}
                  >
                    Chọn danh sách
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMajorOption('Khác');
                      setFormData((prev) => ({ ...prev, faculty: customMajorText }));
                    }}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      selectedMajorOption === 'Khác'
                        ? 'bg-[#2F5233] text-white shadow-2xs'
                        : 'bg-[#FAF7F2] border border-[#E8E2D5] text-stone-600 hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <PenTool className="w-2.5 h-2.5" />
                    <span>Tự nhập khác</span>
                  </button>
                </div>
              </div>

              {selectedMajorOption !== 'Khác' && (
                <select
                  value={selectedMajorOption}
                  onChange={(e) => handleMajorSelectChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-800 font-medium"
                >
                  <option value="">-- Chọn chuyên ngành học --</option>
                  {STANDARD_MAJORS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="Khác">✍️ Khác (Tự nhập chuyên ngành...)</option>
                </select>
              )}

              {selectedMajorOption === 'Khác' && (
                <div className="p-3 bg-[#EBF2EB] border border-[#2F5233]/40 rounded-xl space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2F5233] flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-[#2F5233]" />
                      <span>Tự nhập tên chuyên ngành của bạn:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMajorOption(STANDARD_MAJORS[0]);
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
                    onChange={(e) => handleCustomMajorInputChange(e.target.value)}
                    placeholder="Ví dụ: Cơ điện tử, Luật thương mại, Y đa khoa, Kiến trúc..."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2F5233] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5233]/40 font-semibold text-stone-900"
                    autoFocus
                    required
                  />
                  <p className="text-[10px] text-[#2F5233]">
                    Chuyên ngành bạn tự nhập sẽ được lưu trực tiếp vào hồ sơ và hệ thống gợi ý việc làm.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Điểm GPA tích lũy
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] tabular-nums text-stone-900"
                  placeholder="3.5 / 4.0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Năm tốt nghiệp dự kiến
                </label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] tabular-nums text-stone-900"
                  placeholder="2027"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. KỸ NĂNG CÁ NHÂN */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-2.5">
            <Sparkles className="w-4 h-4 text-[#2F5233]" />
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              3. Kỹ năng cá nhân
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-800 text-xs font-medium border border-[#E8E2D5]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-600 p-0.5 rounded-full"
                  aria-label="Xóa kỹ năng"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Nhập kỹ năng mới (VD: Tiếng Anh, React, Canva)..."
              className="flex-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
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
              className="px-3.5 py-2 bg-[#2F5233] hover:bg-[#244127] text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          </div>
        </div>

        {/* 5. TẢI LÊN FILE CV */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-2.5">
            <FileText className="w-4 h-4 text-[#2F5233]" />
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              4. Hồ sơ đính kèm (CV / Resume)
            </h2>
          </div>

          <div className="p-3 bg-[#FAF7F2] border border-dashed border-[#E8E2D5] rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              {formData.cvFileName ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F5233]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2F5233]" />
                  <span className="truncate">{formData.cvFileName}</span>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-stone-700">Chưa tải lên file CV</p>
                  <p className="text-[10px] text-stone-500">Hỗ trợ file PDF, DOCX dung lượng dưới 5MB</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className="px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-xs font-semibold text-stone-700 shadow-2xs hover:bg-[#FAF7F2]"
            >
              {formData.cvFileName ? 'Thay đổi' : 'Tải file lên'}
            </button>
            <input
              type="file"
              ref={cvInputRef}
              onChange={handleCvChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </div>
        </div>

        {/* 6. NHU CẦU TÌM VIỆC & MỤC TIÊU NGHỀ NGHIỆP */}
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-2.5">
            <Briefcase className="w-4 h-4 text-[#2F5233]" />
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              5. Nhu cầu việc làm & Mục tiêu
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Hình thức ưu tiên
              </label>
              <select
                value={formData.desiredJobType}
                onChange={(e) => setFormData({ ...formData, desiredJobType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              >
                <option value="Part-time">Part-time</option>
                <option value="Thực tập">Thực tập</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Khu vực làm việc
              </label>
              <select
                value={formData.preferredCity}
                onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mức lương mong muốn
            </label>
            <select
              value={formData.desiredSalary}
              onChange={(e) => setFormData({ ...formData, desiredSalary: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
            >
              {SALARY_CATEGORIES.filter((s) => s !== 'Tất cả mức lương').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Giới thiệu ngắn về bản thân & Mục tiêu
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Chia sẻ lý do tìm việc, điểm mạnh và mục tiêu phấn đấu trong công việc..."
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
            />
          </div>
        </div>

        {/* NÚT LƯU THAY ĐỔI */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-[#2F5233] hover:bg-[#244127] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all touch-manipulation"
          >
            <Save className="w-4 h-4" />
            <span>Lưu toàn bộ thông tin cá nhân</span>
          </button>

          {currentUser && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] hover:bg-[#F2ECE1] text-stone-700 font-semibold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất tài khoản</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
