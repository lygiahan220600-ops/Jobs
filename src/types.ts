export type Language = 'vi' | 'en' | 'ja' | 'ko' | 'zh' | 'fr' | 'de';

export type JobType = 'Part-time' | 'Full-time' | 'Thực tập';
export type WorkMode = 'Tại văn phòng' | 'Làm từ xa (Remote)' | 'Linh hoạt (Hybrid)';
export type ExperienceLevel = 'Chưa có kinh nghiệm' | 'Dưới 6 tháng' | 'Từ 6 tháng - 1 năm' | 'Trên 1 năm';
export type ShiftSlot = 'Sáng' | 'Chiều' | 'Tối' | 'Cuối tuần' | 'Linh hoạt theo lịch học';

export interface Job {
  id: string;
  title: string;
  titleEn?: string;
  companyName: string;
  companyShort: string;
  companyColor: string;
  address: string;
  city: string;
  district: string;
  salaryText: string;
  salaryTextEn?: string;
  salaryCategory: 'Dưới 3 triệu' | '3 - 6 triệu' | '6 - 10 triệu' | 'Trên 10 triệu' | 'Theo giờ (25k - 60k/h)';
  jobType: JobType;
  workMode: WorkMode;
  experience: ExperienceLevel;
  major: string;
  skills: string[];
  availableShifts: ShiftSlot[];
  postedAt: string;
  deadline: string;
  vacancies: number;
  description: string[];
  descriptionEn?: string[];
  requirements: string[];
  requirementsEn?: string[];
  benefits: string[];
  benefitsEn?: string[];
  scheduleDetail: string;
  contactPerson: string;
  employerId?: string;
  status?: 'published' | 'pending' | 'closed';
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  year: string;
  gpa?: string;
}

export interface StudentProfile {
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
  university: string;
  faculty: string;
  gpa: string;
  graduationYear: string;
  educationList?: EducationItem[];
  skills: string[];
  bio: string;
  desiredSalary: string;
  desiredJobType: string;
  preferredCity: string;
  portfolioUrl?: string;
  cvFileName?: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'candidate' | 'employer';
  avatarUrl?: string;
  companyName?: string;
}

export interface SearchFilterState {
  keyword: string;
  location: string;
  jobType: string;
  salaryCategory: string;
  experience: string;
  major: string;
  workMode: string;
  shift: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedAt: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  availableShifts: string;
  note: string;
  status: 'Đã gửi hồ sơ' | 'Nhà tuyển dụng đã xem' | 'Mời phỏng vấn' | 'Đã duyệt' | 'Từ chối';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'candidate' | 'employer';
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'candidate' | 'employer';
  participantAvatar?: string;
  companyName?: string;
  jobId?: string;
  jobTitle?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface AICVData {
  fullName: string;
  targetJob: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  skills: string[];
  education: {
    school: string;
    major: string;
    year: string;
    gpa?: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];
  projects: {
    name: string;
    role: string;
    description: string;
  }[];
  certifications: string[];
  activities: string[];
  template: 'modern' | 'minimalist' | 'classic' | 'creative';
}
