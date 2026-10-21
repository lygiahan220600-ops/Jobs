import React, { useState, useEffect } from 'react';
import { Bookmark, FileText, CheckCircle2, ArrowRight, Building2, Sparkles, MessageSquare, Send } from 'lucide-react';
import { Job, JobApplication, Language, SearchFilterState, StudentProfile, UserAccount, ChatConversation, ChatMessage } from './types';
import { EMPTY_STUDENT_PROFILE, INITIAL_JOBS } from './data/mockJobs';
import { INITIAL_CONVERSATIONS } from './data/mockChat';
import { useTranslation, SUPPORTED_LANGUAGES } from './data/translations';
import { MobileTopBar } from './components/MobileTopBar';
import { BottomNav, MobileTab } from './components/BottomNav';
import { MobileHomeView } from './components/MobileHomeView';
import { MobileSearchView } from './components/MobileSearchView';
import { MobileJobDetail } from './components/MobileJobDetail';
import { ProfileView } from './components/ProfileView';
import { ProfileSidebar } from './components/ProfileSidebar';
import { MobileAuthModal } from './components/MobileAuthModal';
import { MobileJobCard } from './components/MobileJobCard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { ChatView } from './components/ChatView';
import { AICvBuilderView } from './components/AICvBuilderView';
import { QuickApplyModal } from './components/QuickApplyModal';

export default function App() {
  // Clear any old hardcoded mock profiles from previous sessions
  useEffect(() => {
    try {
      const oldDefault = localStorage.getItem('jobshub_student_profile');
      if (oldDefault && oldDefault.includes('Nguyễn Văn Minh')) {
        localStorage.removeItem('jobshub_student_profile');
      }
    } catch {}
  }, []);

  // Language State: 'vi' | 'en' | 'ja' | 'ko' | 'zh' | 'fr' | 'de'
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jobshub_lang');
      const isValid = SUPPORTED_LANGUAGES.some((l) => l.code === saved);
      return isValid ? (saved as Language) : 'vi';
    } catch {
      return 'vi';
    }
  });

  const t = useTranslation(lang);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Jobs Dataset (persisted so posted/moderated jobs persist)
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('jobshub_jobs_list');
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  // Saved Jobs
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('jobshub_saved_ids');
      return raw ? JSON.parse(raw) : ['job-01', 'job-03'];
    } catch {
      return ['job-01', 'job-03'];
    }
  });

  // Logged-in Account: Null if guest
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const raw = localStorage.getItem('jobshub_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Helper: lấy hồ sơ lưu riêng theo tài khoản người dùng
  const getProfileForUser = (user: UserAccount | null): StudentProfile => {
    if (!user) {
      return EMPTY_STUDENT_PROFILE;
    }
    try {
      const key = `jobshub_profile_user_${user.id || user.email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    return {
      ...EMPTY_STUDENT_PROFILE,
      fullName: user.role === 'employer' ? user.fullName : '',
      email: user.email || '',
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || '',
    };
  };

  // Student Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const rawUser = localStorage.getItem('jobshub_current_user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      return getProfileForUser(user);
    } catch {
      return EMPTY_STUDENT_PROFILE;
    }
  });

  // Applications
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const raw = localStorage.getItem('jobshub_applications');
      return raw ? JSON.parse(raw) : [
        {
          id: 'app-sample-1',
          jobId: 'job-01',
          jobTitle: 'Thực tập sinh Lập trình Web Frontend',
          companyName: 'FPT Software NextGen Hub',
          appliedAt: '20/10/2026',
          fullName: 'Trần Văn An',
          email: 'an.tran@student.edu.vn',
          phone: '0912 888 777',
          university: 'ĐH Bách Khoa',
          major: 'Công nghệ thông tin',
          availableShifts: 'Ca Sáng và Chiều T2-T6',
          note: 'Em có kinh nghiệm làm việc với React và Tailwind, rất mong được học hỏi tại công ty.',
          status: 'Đã duyệt',
        },
        {
          id: 'app-sample-2',
          jobId: 'job-02',
          jobTitle: 'Nhân viên Phục vụ & Pha chế Part-time',
          companyName: 'Highlands Coffee',
          appliedAt: '19/10/2026',
          fullName: 'Lê Thị Thu Thảo',
          email: 'thao.le@gmail.com',
          phone: '0977 333 444',
          university: 'ĐH Khoa học Xã hội & Nhân văn',
          major: 'Du lịch - Nhà hàng',
          availableShifts: 'Ca Tối và Cuối tuần',
          note: 'Em chăm chỉ, nhanh nhẹn và có thể làm thêm giờ khi quán đông khách.',
          status: 'Mời phỏng vấn',
        },
      ];
    } catch {
      return [];
    }
  });

  // Chat Conversations State
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('jobshub_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Quick Apply Modal State
  const [quickApplyJob, setQuickApplyJob] = useState<Job | null>(null);
  const [quickApplyOpen, setQuickApplyOpen] = useState(false);

  // Profile Slide Bar open/close state
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  // Search Filter State
  const [searchFilters, setSearchFilters] = useState<SearchFilterState>({
    keyword: '',
    location: 'Tất cả địa điểm',
    jobType: 'Tất cả loại hình',
    salaryCategory: 'Tất cả mức lương',
    experience: 'Tất cả kinh nghiệm',
    major: 'Tất cả ngành học',
    workMode: 'Tất cả hình thức',
    shift: 'Tất cả ca làm',
  });

  // Auth Modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('jobshub_lang', lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('jobshub_jobs_list', JSON.stringify(jobs));
    } catch {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('jobshub_conversations', JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('jobshub_saved_ids', JSON.stringify(savedJobIds));
    } catch {}
  }, [savedJobIds]);

  useEffect(() => {
    try {
      if (currentUser) {
        const key = `jobshub_profile_user_${currentUser.id || currentUser.email}`;
        localStorage.setItem(key, JSON.stringify(profile));
      }
    } catch {}
  }, [profile, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('jobshub_applications', JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('jobshub_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('jobshub_current_user');
      }
    } catch {}
  }, [currentUser]);

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === newLang);
    showToast(langObj ? `Đã chuyển sang ${langObj.name} (${langObj.flag})` : 'Language updated');
  };

  const handleToggleSaveJob = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetJob = jobs.find((j) => j.id === jobId);
    const title = targetJob ? (lang === 'en' && targetJob.titleEn ? targetJob.titleEn : targetJob.title) : '';
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast(lang === 'vi' ? `Đã bỏ lưu "${title}"` : `Removed "${title}" from saved`);
        return prev.filter((id) => id !== jobId);
      } else {
        showToast(lang === 'vi' ? `Đã lưu "${title}" vào mục yêu thích` : `Saved "${title}" to bookmarks`);
        return [...prev, jobId];
      }
    });
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeTab = (tab: MobileTab) => {
    setSelectedJob(null);
    setActiveTab(tab);
    if (tab === 'profile') {
      setIsProfileSidebarOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Apply Trigger
  const handleQuickApply = (job: Job) => {
    setQuickApplyJob(job);
    setQuickApplyOpen(true);
  };

  const handleSubmitApplication = (data: {
    jobId: string;
    fullName: string;
    email: string;
    phone: string;
    university: string;
    major: string;
    availableShifts: string;
    note: string;
  }) => {
    const job = jobs.find((j) => j.id === data.jobId);
    if (!job) return;

    const newApp: JobApplication = {
      id: 'app-' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      appliedAt: new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US'),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      university: data.university,
      major: data.major,
      availableShifts: data.availableShifts,
      note: data.note,
      status: 'Đã gửi hồ sơ',
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast(t.applySuccess || 'Nộp hồ sơ ứng tuyển thành công!');
  };

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập hoặc đăng ký để lưu hồ sơ theo tài khoản của bạn!');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    setProfile(updatedProfile);

    const updatedUser = {
      ...currentUser,
      fullName: updatedProfile.fullName || currentUser.fullName,
      avatarUrl: updatedProfile.avatarUrl || currentUser.avatarUrl,
      email: updatedProfile.email || currentUser.email,
      phone: updatedProfile.phone || currentUser.phone,
    };
    setCurrentUser(updatedUser);

    try {
      const userKey = `jobshub_profile_user_${currentUser.id || currentUser.email}`;
      localStorage.setItem(userKey, JSON.stringify(updatedProfile));
    } catch {}

    showToast('Đã lưu thông tin cá nhân vào tài khoản thành công!');
  };

  const handleAuthSuccess = (user: UserAccount, message: string) => {
    setCurrentUser(user);
    const userProfile = getProfileForUser(user);
    setProfile(userProfile);
    showToast(message);
    if (user.role === 'employer') {
      setActiveTab('employer');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProfile(EMPTY_STUDENT_PROFILE);
    setIsProfileSidebarOpen(false);
    setActiveTab('home');
    showToast(lang === 'vi' ? 'Đã đăng xuất tài khoản.' : 'Logged out.');
  };

  // Employer Actions
  const handleAddJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast('Đã đăng bài tuyển dụng thành công!');
  };

  const handleUpdateJobStatus = (jobId: string, status: 'published' | 'pending' | 'closed') => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
    showToast(
      status === 'published'
        ? 'Đã duyệt và công khai bài tuyển dụng!'
        : status === 'closed'
        ? 'Đã tạm đóng bài tuyển dụng'
        : 'Đã chuyển sang trạng thái chờ duyệt'
    );
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast('Đã xóa bài tuyển dụng');
  };

  const handleUpdateAppStatus = (appId: string, status: 'Đã duyệt' | 'Mời phỏng vấn' | 'Từ chối' | 'Nhà tuyển dụng đã xem') => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    showToast(`Đã cập nhật trạng thái hồ sơ: ${status}`);
  };

  // Chat Actions
  const handleOpenChatWithEmployer = (job: Job) => {
    let conv = conversations.find((c) => c.jobId === job.id);
    if (!conv) {
      conv = {
        id: 'conv-' + Date.now(),
        participantId: job.employerId || 'emp-' + job.id,
        participantName: job.contactPerson || job.companyName + ' (Tuyển dụng)',
        participantRole: 'employer',
        companyName: job.companyName,
        jobId: job.id,
        jobTitle: job.title,
        lastMessage: `Xin chào! Tôi có thể hỗ trợ gì cho bạn về vị trí ${job.title}?`,
        lastTimestamp: 'Vừa xong',
        unreadCount: 0,
        messages: [
          {
            id: 'msg-' + Date.now(),
            senderId: job.employerId || 'employer',
            senderName: job.contactPerson || job.companyName,
            senderRole: 'employer',
            text: `Chào bạn, cảm ơn bạn đã quan tâm đến vị trí ${job.title} tại ${job.companyName}! Bạn có câu hỏi nào về ca làm việc hoặc quy trình ứng tuyển không?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
          },
        ],
      };
      setConversations((prev) => [conv!, ...prev]);
    }
    setActiveConvId(conv.id);
    setSelectedJob(null);
    setActiveTab('messages');
  };

  const handleOpenChatWithCandidate = (candidateName: string, candidateEmail: string, jobTitle: string) => {
    let conv = conversations.find((c) => c.participantName === candidateName);
    if (!conv) {
      conv = {
        id: 'conv-' + Date.now(),
        participantId: 'cand-' + candidateEmail,
        participantName: candidateName,
        participantRole: 'candidate',
        companyName: currentUser?.companyName || 'Bộ phận Tuyển dụng',
        jobTitle: jobTitle,
        lastMessage: `Chào ${candidateName}, công ty đã nhận hồ sơ ứng tuyển của bạn.`,
        lastTimestamp: 'Vừa xong',
        unreadCount: 0,
        messages: [
          {
            id: 'msg-' + Date.now(),
            senderId: currentUser?.id || 'employer',
            senderName: currentUser?.fullName || 'Nhà tuyển dụng',
            senderRole: 'employer',
            text: `Chào ${candidateName}, công ty đã nhận hồ sơ ứng tuyển của bạn cho vị trí ${jobTitle}. Bạn có thể trao đổi thêm qua đây nhé!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
          },
        ],
      };
      setConversations((prev) => [conv!, ...prev]);
    }
    setActiveConvId(conv.id);
    setSelectedJob(null);
    setActiveTab('messages');
  };

  const handleSendMessage = (convId: string, text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderId: currentUser?.id || 'me',
      senderName: currentUser?.fullName || (currentUser?.role === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'),
      senderRole: currentUser?.role || 'candidate',
      text: text,
      timestamp: timeStr,
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: timeStr,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Auto-reply simulation from recruiter/candidate after 1.3s
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const targetConv = conversations.find((c) => c.id === convId);
      const isEmployerMe = currentUser?.role === 'employer';

      let replyText = 'Dạ vâng, cảm ơn thông tin từ bạn! Chúng tôi đã ghi nhận và sẽ phản hồi sớm nhất qua email hoặc tin nhắn nhé.';
      if (isEmployerMe) {
        replyText = 'Dạ em cảm ơn anh/chị tuyển dụng ạ! Em đã nhận được thông tin và sẽ chuẩn bị kỹ càng.';
      } else {
        if (text.toLowerCase().includes('ca') || text.toLowerCase().includes('lịch')) {
          replyText = 'Về lịch ca làm, bên mình luôn ưu tiên xếp ca theo thời khóa biểu học của bạn trên trường, bạn yên tâm nhé!';
        } else if (text.toLowerCase().includes('phỏng vấn') || text.toLowerCase().includes('hẹn')) {
          replyText = 'Lịch phỏng vấn bên mình có thể tổ chức online qua Google Meet hoặc trực tiếp tại văn phòng. Bạn kiểm tra email để nhận link nhé!';
        }
      }

      const replyMsg: ChatMessage = {
        id: 'msg-reply-' + Date.now(),
        senderId: 'partner',
        senderName: targetConv?.participantName || 'Phòng Nhân sự',
        senderRole: isEmployerMe ? 'candidate' : 'employer',
        text: replyText,
        timestamp: replyTime,
        isMe: false,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              lastMessage: replyText,
              lastTimestamp: replyTime,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1300);
  };

  const appliedJobIds = applications.map((a) => a.jobId);
  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col antialiased relative">
      {/* Responsive Top Bar */}
      <MobileTopBar
        lang={lang}
        onSelectLang={handleSelectLang}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onOpenProfileSidebar={() => {
          setIsProfileSidebarOpen(true);
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[90] w-auto max-w-[90vw] bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Responsive Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto">
        {selectedJob ? (
          <MobileJobDetail
            job={selectedJob}
            isSaved={savedJobIds.includes(selectedJob.id)}
            hasApplied={appliedJobIds.includes(selectedJob.id)}
            profile={profile}
            currentUser={currentUser}
            lang={lang}
            onBack={() => setSelectedJob(null)}
            onToggleSave={handleToggleSaveJob}
            onOpenChat={handleOpenChatWithEmployer}
            onSubmitApplication={handleSubmitApplication}
          />
        ) : activeTab === 'home' ? (
          <MobileHomeView
            jobs={jobs}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            profile={profile}
            lang={lang}
            onSelectJob={handleSelectJob}
            onToggleSave={handleToggleSaveJob}
            onApplyQuick={handleQuickApply}
            onNavigateToSearch={(q) => {
              setSearchFilters((prev) => ({ ...prev, keyword: q }));
              handleChangeTab('search');
            }}
            onNavigateToTab={(tab) => handleChangeTab(tab as MobileTab)}
          />
        ) : activeTab === 'search' ? (
          <MobileSearchView
            jobs={jobs}
            filters={searchFilters}
            setFilters={setSearchFilters}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            lang={lang}
            onSelectJob={handleSelectJob}
            onToggleSave={handleToggleSaveJob}
            onApplyQuick={handleQuickApply}
          />
        ) : activeTab === 'messages' ? (
          <ChatView
            currentUser={currentUser}
            conversations={conversations}
            activeConvId={activeConvId || conversations[0]?.id || null}
            jobs={jobs}
            lang={lang}
            onSelectConversation={(id) => setActiveConvId(id)}
            onSendMessage={handleSendMessage}
            onBackToList={() => setActiveConvId(null)}
            onViewJobDetail={handleSelectJob}
          />
        ) : activeTab === 'ai-cv' ? (
          <AICvBuilderView
            profile={profile}
            currentUser={currentUser}
            lang={lang}
            onSaveToProfile={handleSaveProfile as any}
            showToast={showToast}
          />
        ) : activeTab === 'employer' ? (
          <EmployerDashboard
            currentUser={currentUser}
            jobs={jobs}
            applications={applications}
            lang={lang}
            onAddJob={handleAddJob}
            onUpdateJobStatus={handleUpdateJobStatus}
            onDeleteJob={handleDeleteJob}
            onUpdateAppStatus={handleUpdateAppStatus}
            onOpenChatWithCandidate={handleOpenChatWithCandidate}
            onViewJobDetail={handleSelectJob}
            onSwitchToCandidate={() => setActiveTab('home')}
          />
        ) : activeTab === 'saved' ? (
          /* SAVED JOBS LIST */
          <div className="w-full px-3 sm:px-6 py-4 pb-28 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                  {t.savedTab}
                </h1>
                <p className="text-xs text-slate-500">
                  {savedJobsList.length} {t.jobsFound}
                </p>
              </div>
            </div>

            {savedJobsList.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-2xs mt-4">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h2 className="text-sm font-bold text-slate-900">
                  {t.noSavedJobs}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t.noSavedJobsDesc}
                </p>
                <button
                  type="button"
                  onClick={() => handleChangeTab('home')}
                  className="mt-4 px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-semibold"
                >
                  {t.homeTab}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {savedJobsList.map((job) => (
                  <MobileJobCard
                    key={job.id}
                    job={job}
                    isSaved={true}
                    hasApplied={appliedJobIds.includes(job.id)}
                    lang={lang}
                    onSelect={handleSelectJob}
                    onToggleSave={handleToggleSaveJob}
                    onApplyQuick={handleQuickApply}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'applications' ? (
          /* APPLICATIONS HISTORY */
          <div className="w-full px-3 sm:px-6 py-4 pb-28 space-y-3.5">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                {t.applicationsTab}
              </h1>
              <p className="text-xs text-slate-500">
                {applications.length} đơn đã nộp
              </p>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-2xs mt-4">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h2 className="text-sm font-bold text-slate-900">
                  {t.noAppliedJobs}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t.noAppliedJobsDesc}
                </p>
                <button
                  type="button"
                  onClick={() => handleChangeTab('home')}
                  className="mt-4 px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-semibold"
                >
                  {t.homeTab}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {applications.map((app) => {
                  const targetJob = jobs.find((j) => j.id === app.jobId);
                  return (
                    <div
                      key={app.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {app.status}
                        </span>
                        <span className="text-xs text-slate-400 tabular-nums">
                          {app.appliedAt}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          {app.jobTitle}
                        </h2>
                        <p className="text-xs text-[#0F766E] font-semibold">
                          {app.companyName}
                        </p>
                      </div>

                      <div className="text-xs text-slate-500 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span>Ứng viên: {app.fullName}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (targetJob) handleOpenChatWithEmployer(targetJob);
                              else setActiveTab('messages');
                            }}
                            className="text-[#0F766E] font-bold flex items-center gap-1 hover:underline text-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Nhắn tin</span>
                          </button>
                          {targetJob && (
                            <button
                              type="button"
                              onClick={() => handleSelectJob(targetJob)}
                              className="text-slate-600 font-bold flex items-center gap-0.5 hover:text-slate-900"
                            >
                              <span>Xem tin</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* PROFILE VIEW */
          <ProfileView
            profile={profile}
            onSaveProfile={handleSaveProfile}
            currentUser={currentUser}
            onLogout={handleLogout}
            lang={lang}
          />
        )}
      </main>

      {/* Quick Apply Modal */}
      <QuickApplyModal
        job={quickApplyJob}
        isOpen={quickApplyOpen}
        profile={profile}
        currentUser={currentUser}
        lang={lang}
        onClose={() => {
          setQuickApplyOpen(false);
          setQuickApplyJob(null);
        }}
        onSubmit={handleSubmitApplication}
      />

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={handleChangeTab}
        savedCount={savedJobIds.length}
        applicationsCount={applications.length}
        unreadMessagesCount={unreadMessagesCount}
        currentUser={currentUser}
        lang={lang}
      />

      {/* Slide bar đổ dọc bên trái để nhập & chỉnh sửa thông tin cá nhân */}
      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={() => setIsProfileSidebarOpen(false)}
        profile={profile}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        onLogout={handleLogout}
        lang={lang}
      />

      {/* Auth Modal (Login / Register / Social / Employer) */}
      <MobileAuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        lang={lang}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
