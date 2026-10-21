import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  RefreshCw,
  Palette,
  Printer,
  Save,
} from 'lucide-react';
import { AICVData, Language, StudentProfile, UserAccount } from '../types';
import { generateAICv } from '../services/geminiAiCv';

interface AICvBuilderViewProps {
  profile: StudentProfile;
  currentUser: UserAccount | null;
  lang: Language;
  onSaveToProfile: (updatedProfile: Partial<StudentProfile>) => void;
  showToast: (msg: string) => void;
}

export const AICvBuilderView: React.FC<AICvBuilderViewProps> = ({
  profile,
  currentUser,
  onSaveToProfile,
  showToast,
}) => {
  const [targetJob, setTargetJob] = useState('Thực tập sinh Marketing / Truyền thông');
  const [fullName, setFullName] = useState(profile.fullName || currentUser?.fullName || '');
  const [email, setEmail] = useState(profile.email || currentUser?.email || '');
  const [phone, setPhone] = useState(profile.phone || currentUser?.phone || '');
  const [university, setUniversity] = useState(profile.university || '');
  const [major, setMajor] = useState(profile.faculty || '');
  const [gpa, setGpa] = useState(profile.gpa || '');
  const [skills, setSkills] = useState(profile.skills.join(', ') || 'Giao tiếp, Làm việc nhóm, Sáng tạo, Tin học văn phòng, Tiếng Anh');
  const [notes, setNotes] = useState(profile.bio || 'Chưa có nhiều kinh nghiệm thực tế, ham học hỏi và sẵn sàng làm việc linh hoạt.');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [generatedCv, setGeneratedCv] = useState<AICVData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'minimalist' | 'classic' | 'creative'>('modern');
  const [, setCopied] = useState(false);

  // Auto-fill from profile
  const handleSyncProfile = () => {
    setFullName(profile.fullName || currentUser?.fullName || '');
    setEmail(profile.email || currentUser?.email || '');
    setPhone(profile.phone || currentUser?.phone || '');
    setUniversity(profile.university || '');
    setMajor(profile.faculty || '');
    setGpa(profile.gpa || '');
    if (profile.skills && profile.skills.length > 0) {
      setSkills(profile.skills.join(', '));
    }
    if (profile.bio) {
      setNotes(profile.bio);
    }
    showToast('Đã đồng bộ thông tin từ hồ sơ cá nhân của bạn!');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetJob.trim()) {
      showToast('Vui lòng nhập vị trí ứng tuyển mục tiêu!');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Đang phân tích yêu cầu vị trí và từ khóa ATS...');

    const timer1 = setTimeout(() => {
      setLoadingStep('AI đang thiết kế tóm tắt nghề nghiệp và kinh nghiệm thực chiến...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setLoadingStep('Đang định dạng bố cục CV chuẩn chỉnh và tối ưu hóa...');
    }, 2400);

    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await generateAICv(
        targetJob.trim(),
        {
          fullName: fullName.trim() || 'Nguyễn Văn Minh',
          email: email.trim() || 'ungvien@jobs.vn',
          phone: phone.trim() || '0912 345 678',
          university: university.trim() || 'Trường Đại học Quốc Gia',
          faculty: major.trim() || 'Kinh tế & Quản trị',
          gpa: gpa.trim() || '3.2 / 4.0',
          skills: skillsArray,
          bio: notes.trim(),
        },
        lang === 'vi' ? 'vi' : 'en'
      );
      setGeneratedCv(res);
      showToast('Đã tạo thành công CV bằng AI!');
    } catch {
      showToast('Đã xảy ra lỗi khi tạo CV, đang sử dụng mẫu tối ưu sẵn có.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!generatedCv) return;
    const text = `
CV: ${generatedCv.fullName} - ${generatedCv.targetJob}
Liên hệ: ${generatedCv.phone} | ${generatedCv.email} | ${generatedCv.address}

MỤC TIÊU NGHỀ NGHIỆP:
${generatedCv.summary}

HỌC VẤN:
${generatedCv.education.map((e) => `- ${e.school} (${e.year}): ${e.major} - GPA: ${e.gpa || 'Khá'}`).join('\n')}

KỸ NĂNG:
${generatedCv.skills.join(', ')}

KINH NGHIỆM LÀM VIỆC & DỰ ÁN:
${generatedCv.experience.map((ex) => `${ex.role} tại ${ex.company} (${ex.duration}):\n` + ex.highlights.map((h) => `  * ${h}`).join('\n')).join('\n\n')}

HOẠT ĐỘNG & CHỨNG CHỈ:
${generatedCv.certifications.join(', ')}
${generatedCv.activities.join(', ')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Đã sao chép toàn bộ nội dung CV vào bộ nhớ tạm!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToProfile = () => {
    if (!generatedCv) return;
    onSaveToProfile({
      fullName: generatedCv.fullName,
      email: generatedCv.email,
      phone: generatedCv.phone,
      faculty: generatedCv.education[0]?.major || major,
      university: generatedCv.education[0]?.school || university,
      skills: generatedCv.skills,
      bio: generatedCv.summary,
      cvFileName: `CV_AI_${generatedCv.fullName.replace(/\s+/g, '_')}.pdf`,
    });
    showToast('Đã lưu CV vào hồ sơ cá nhân của bạn!');
  };

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-28 space-y-5">
      {/* Top Banner in Moss Green */}
      <div className="bg-gradient-to-br from-[#1E3821] via-[#2F5233] to-[#3B5E3C] rounded-3xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-[#FAF7F2] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Jobs AI Resume Builder</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
              Tạo CV xin việc chuyên nghiệp bằng AI
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/90 mt-1 max-w-xl">
              Chỉ cần nhập vị trí mong muốn, trí tuệ nhân tạo sẽ tự động tạo CV chuẩn chỉnh, nêu bật kỹ năng và tối ưu hóa từ khóa tuyển dụng cho sinh viên.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSyncProfile}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold rounded-xl text-white transition-all backdrop-blur-xs border border-white/20 self-start sm:self-auto"
          >
            Đồng bộ từ hồ sơ cá nhân
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: INPUT FORM */}
        <div className="lg:col-span-5 bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2F5233]" />
              <span>Thông tin tạo CV</span>
            </h2>
            <span className="text-[11px] text-stone-500 font-medium">Bước 1: Nhập mục tiêu</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            {/* Target Job Position */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#2F5233]" />
                <span>Vị trí ứng tuyển mục tiêu <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="VD: Thực tập sinh Marketing, Lập trình Frontend React..."
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900 font-medium"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  'Thực tập sinh Marketing',
                  'Lập trình Web Frontend',
                  'Nhân viên Phục vụ Part-time',
                  'Cộng tác viên Bán hàng',
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setTargetJob(sug)}
                    className="text-[10px] px-2 py-0.5 bg-[#FAF7F2] hover:bg-[#EBF2EB] border border-[#E8E2D5] text-stone-700 hover:text-[#2F5233] rounded-md transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Họ và tên của bạn..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email.sinhvien@gmail.com..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              />
            </div>

            {/* Education & Major */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Trường Đại học / Cao đẳng
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="VD: ĐH Kinh tế..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Chuyên ngành học
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="VD: Quản trị Kinh doanh..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Kỹ năng hiện có (ngăn cách bởi dấu phẩy)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="VD: Giao tiếp, Tiếng Anh, Canva, Excel, React..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              />
            </div>

            {/* Notes / Aspirations */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Kinh nghiệm thêm / Thế mạnh / Ghi chú cho AI
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Chia sẻ thêm về bản thân để AI tối ưu hóa CV tốt hơn..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-900"
              />
            </div>

            {/* Submit Action in Moss Green */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#2F5233] hover:bg-[#244127] active:scale-[0.99] text-white font-bold rounded-2xl shadow-md shadow-[#2F5233]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Đang xử lý với AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tạo CV chuyên nghiệp với AI</span>
                </>
              )}
            </button>

            {isLoading && (
              <p className="text-center text-xs text-[#2F5233] font-semibold animate-pulse">
                {loadingStep}
              </p>
            )}
          </form>
        </div>

        {/* RIGHT: INTERACTIVE CV PREVIEW */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Controls Bar */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#2F5233]" /> Mẫu CV:
              </span>
              {(['modern', 'minimalist', 'classic', 'creative'] as const).map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                    selectedTemplate === tmpl
                      ? 'bg-[#2F5233] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] border border-[#E8E2D5] text-stone-700 hover:bg-[#F2ECE1]'
                  }`}
                >
                  {tmpl === 'modern' && 'Hiện đại'}
                  {tmpl === 'minimalist' && 'Tối giản'}
                  {tmpl === 'classic' && 'Cổ điển'}
                  {tmpl === 'creative' && 'Sáng tạo'}
                </button>
              ))}
            </div>

            {generatedCv && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSaveToProfile}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2F5233] hover:bg-[#244127] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  title="Lưu vào hồ sơ ứng viên"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu vào hồ sơ</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="p-1.5 text-stone-600 hover:bg-[#FAF7F2] rounded-xl transition-colors"
                  title="Sao chép nội dung"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Tải / In CV</span>
                </button>
              </div>
            )}
          </div>

          {/* CV Canvas Preview */}
          {generatedCv ? (
            <div
              id="cv-printable-area"
              className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm transition-all text-stone-800 ${
                selectedTemplate === 'modern'
                  ? 'border-[#2F5233]/30 bg-gradient-to-b from-[#EBF2EB]/30 to-white'
                  : selectedTemplate === 'minimalist'
                  ? 'border-[#E8E2D5] bg-white font-mono'
                  : selectedTemplate === 'creative'
                  ? 'border-[#2F5233]/40 bg-gradient-to-b from-[#FAF7F2] to-white'
                  : 'border-[#E8E2D5]'
              }`}
            >
              {/* CV Header */}
              <div className="border-b-2 border-[#2F5233]/20 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-display">
                    {generatedCv.fullName}
                  </h2>
                  <p className="text-sm font-bold text-[#2F5233] uppercase tracking-wide mt-0.5">
                    {generatedCv.targetJob}
                  </p>
                </div>

                <div className="text-xs text-stone-600 space-y-0.5 text-left sm:text-right">
                  <p>{generatedCv.phone} • {generatedCv.email}</p>
                  <p>{generatedCv.address}</p>
                </div>
              </div>

              {/* CV Body */}
              <div className="space-y-4 text-xs leading-relaxed">
                {/* Career Objective */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F5233] border-b border-[#E8E2D5] pb-1 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Mục tiêu nghề nghiệp & Giới thiệu</span>
                  </h3>
                  <p className="text-stone-700 text-justify">
                    {generatedCv.summary}
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F5233] border-b border-[#E8E2D5] pb-1 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Học vấn</span>
                  </h3>
                  {generatedCv.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-stone-900">{edu.school}</p>
                        <p className="text-stone-600">{edu.major}</p>
                      </div>
                      <div className="text-right text-stone-500">
                        <p>{edu.year}</p>
                        {edu.gpa && <p className="font-medium text-[#2F5233]">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F5233] border-b border-[#E8E2D5] pb-1 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Kỹ năng nổi bật</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedCv.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#EBF2EB] border border-[#2F5233]/30 text-[#2F5233] font-medium rounded-lg text-[11px]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                {generatedCv.experience && generatedCv.experience.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F5233] border-b border-[#E8E2D5] pb-1 mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Kinh nghiệm & Hoạt động thực tế</span>
                    </h3>
                    <div className="space-y-2.5">
                      {generatedCv.experience.map((exp, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-stone-900">{exp.role} • <span className="text-stone-600 font-normal">{exp.company}</span></span>
                            <span className="text-stone-500 text-[11px]">{exp.duration}</span>
                          </div>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-stone-600 pl-1">
                            {exp.highlights.map((h, hIdx) => (
                              <li key={hIdx}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications & Activities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {generatedCv.certifications && generatedCv.certifications.length > 0 && (
                    <div>
                      <h4 className="font-bold text-stone-800 mb-1">Chứng chỉ & Khóa học:</h4>
                      <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                        {generatedCv.certifications.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedCv.activities && generatedCv.activities.length > 0 && (
                    <div>
                      <h4 className="font-bold text-stone-800 mb-1">Hoạt động ngoại khóa:</h4>
                      <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                        {generatedCv.activities.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-[#E8E2D5] text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF2EB] flex items-center justify-center text-[#2F5233] mb-3">
                <Sparkles className="w-8 h-8 text-[#2F5233]" />
              </div>
              <h3 className="text-base font-bold text-stone-800">
                Chưa có bản xem trước CV
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-sm">
                Điền thông tin và bấm nút <strong>"Tạo CV chuyên nghiệp với AI"</strong> bên cạnh để hệ thống tự động soạn thảo bản CV hoàn chỉnh nhất cho bạn.
              </p>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="mt-4 px-5 py-2.5 bg-[#2F5233] hover:bg-[#244127] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                Tạo mẫu CV ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
