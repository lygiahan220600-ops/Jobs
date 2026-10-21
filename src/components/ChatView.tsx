import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  Search,
  CheckCheck,
  ArrowLeft,
  Briefcase,
  Sparkles,
  Compass,
} from 'lucide-react';
import { ChatConversation, ChatMessage, Job, Language, UserAccount } from '../types';

interface ChatViewProps {
  currentUser: UserAccount | null;
  conversations: ChatConversation[];
  activeConvId: string | null;
  jobs: Job[];
  lang: Language;
  onSelectConversation: (convId: string) => void;
  onSendMessage: (convId: string, text: string) => void;
  onBackToList?: () => void;
  onViewJobDetail?: (job: Job) => void;
  onNavigateToHome?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  conversations,
  activeConvId,
  jobs,
  lang,
  onSelectConversation,
  onSendMessage,
  onBackToList,
  onViewJobDetail,
  onNavigateToHome,
}) => {
  const [inputText, setInputText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    onSendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  const handleQuickChip = (msg: string) => {
    if (!activeConvId) return;
    onSendMessage(activeConvId, msg);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.toLowerCase();
    return (
      c.participantName.toLowerCase().includes(q) ||
      (c.companyName && c.companyName.toLowerCase().includes(q)) ||
      (c.jobTitle && c.jobTitle.toLowerCase().includes(q)) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  const targetJob = activeConv?.jobId ? jobs.find((j) => j.id === activeConv.jobId) : null;

  // Student quick reply chips
  const studentChips = [
    'Chào anh/chị, em muốn hỏi thêm về ca làm việc ạ',
    'Em có thể làm ca sáng thứ 2, 4, 6 ạ',
    'Dạ em đã chuẩn bị xong hồ sơ và CV rồi ạ',
    'Anh/chị cho em xin thông tin lịch phỏng vấn ạ',
  ];

  // Employer quick reply chips
  const employerChips = [
    'Chào bạn, công ty mời bạn tham gia phỏng vấn online nhé!',
    'Bạn có thể gửi thêm link CV hoặc bảng điểm không?',
    'Ca làm việc có thể sắp xếp linh hoạt theo lịch học của bạn',
    'Bạn có thể bắt đầu đi làm từ đầu tuần tới được không?',
  ];

  const chips = currentUser?.role === 'employer' ? employerChips : studentChips;

  // Khi chưa có tin nhắn nào (mặc định trống)
  if (conversations.length === 0) {
    return (
      <div className="w-full px-3 sm:px-6 py-4 pb-28">
        <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[500px]">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF2EB] text-[#2F5233] flex items-center justify-center mb-4 shadow-2xs">
            <MessageSquare className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F5233] bg-[#EBF2EB] px-3 py-1 rounded-full mb-2">
            Hộp tin nhắn tuyển dụng
          </span>

          <h2 className="text-lg sm:text-xl font-black text-stone-900 font-display">
            Hộp tin nhắn đang trống
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md leading-relaxed">
            Bạn chưa có cuộc trò chuyện nào. Khi bạn trao đổi với nhà tuyển dụng từ bài đăng hoặc duyệt hồ sơ ứng viên, tin nhắn sẽ <strong>tự động lưu vào tài khoản</strong> của bạn.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {onNavigateToHome && (
              <button
                type="button"
                onClick={onNavigateToHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F5233] hover:bg-[#244127] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Khám phá việc làm ngay</span>
              </button>
            )}
          </div>

          {currentUser ? (
            <p className="text-[11px] text-stone-600 mt-4">
              Đang đăng nhập: <strong>{currentUser.fullName}</strong> ({currentUser.email || currentUser.phone}) — Dữ liệu tin nhắn tự động đồng bộ theo tài khoản này.
            </p>
          ) : (
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl mt-4">
              💡 Hãy đăng nhập để lưu trữ lịch sử tin nhắn vĩnh viễn trên mọi thiết bị.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-28">
      <div className="bg-white border border-[#E8E2D5] rounded-3xl shadow-xs overflow-hidden flex flex-col md:flex-row h-[78vh] min-h-[580px]">
        {/* LEFT COLUMN: CONVERSATION LIST */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-[#E8E2D5] flex flex-col shrink-0 bg-[#FAF7F2] ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#E8E2D5] bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-stone-900 font-display flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2F5233]" />
                <span>Tin nhắn tuyển dụng</span>
              </h2>
              <span className="text-xs font-bold text-stone-600 tabular-nums">
                {conversations.length} hội thoại
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm hội thoại..."
                className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2F5233] border border-[#E8E2D5] focus:border-[#2F5233]"
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E8E2D5]/70">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-stone-600 text-xs">
                Không tìm thấy cuộc trò chuyện nào phù hợp.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConvId;

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => onSelectConversation(conv.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors touch-manipulation ${
                      isSelected ? 'bg-[#EBF2EB] border-l-4 border-[#2F5233]' : 'hover:bg-white/80'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2F5233] to-[#3B5E3C] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {conv.participantName[0]?.toUpperCase() || 'J'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {conv.participantName}
                        </span>
                        <span className="text-[10px] text-stone-600 shrink-0">
                          {conv.lastTimestamp}
                        </span>
                      </div>

                      {conv.companyName && (
                        <p className="text-[11px] text-[#2F5233] font-semibold truncate">
                          {conv.companyName}
                        </p>
                      )}

                      {conv.jobTitle && (
                        <p className="text-[10px] text-stone-600 font-medium truncate flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3 shrink-0 text-stone-600" />
                          <span className="truncate">{conv.jobTitle}</span>
                        </p>
                      )}

                      <p className="text-xs text-stone-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="min-w-4 h-4 px-1 rounded-full bg-[#2F5233] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT THREAD */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            !activeConvId ? 'hidden md:flex items-center justify-center text-stone-600' : 'flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Thread Top Bar */}
              <div className="p-3.5 sm:px-5 border-b border-[#E8E2D5] flex items-center justify-between bg-white z-10 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={onBackToList}
                    className="md:hidden p-1.5 rounded-xl text-stone-600 hover:bg-[#FAF7F2]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="w-9 h-9 rounded-xl bg-[#2F5233] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {activeConv.participantName[0]?.toUpperCase() || 'J'}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {activeConv.participantName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-stone-600">
                      {activeConv.companyName && (
                        <span className="font-semibold text-[#2F5233] truncate">
                          {activeConv.companyName}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[#2F5233] font-medium text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233] animate-pulse"></span>
                        Đang hoạt động
                      </span>
                    </div>
                  </div>
                </div>

                {targetJob && onViewJobDetail && (
                  <button
                    type="button"
                    onClick={() => onViewJobDetail(targetJob)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E8E2D5] text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#2F5233]" />
                    <span>Xem tin tuyển dụng</span>
                  </button>
                )}
              </div>

              {/* Job Reference Banner inside chat */}
              {activeConv.jobTitle && (
                <div className="px-4 py-2 bg-[#FAF7F2] border-b border-[#E8E2D5] flex items-center justify-between text-xs text-stone-700">
                  <span className="truncate flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#2F5233] shrink-0" />
                    <span>Đang trao đổi về: <strong>{activeConv.jobTitle}</strong></span>
                  </span>
                  {targetJob && onViewJobDetail && (
                    <button
                      type="button"
                      onClick={() => onViewJobDetail(targetJob)}
                      className="text-[#2F5233] font-bold shrink-0 ml-2 hover:underline sm:hidden"
                    >
                      Xem tin
                    </button>
                  )}
                </div>
              )}

              {/* Message Bubbles Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FAF7F2]/60">
                {activeConv.messages.map((msg) => {
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                          msg.isMe
                            ? 'bg-[#2F5233] text-white rounded-br-xs'
                            : 'bg-white text-stone-800 border border-[#E8E2D5] rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-stone-600 mt-1 px-1">
                        <span>{msg.timestamp}</span>
                        {msg.isMe && <CheckCheck className="w-3 h-3 text-[#2F5233]" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestion Chips */}
              <div className="px-3 pt-2 bg-white border-t border-[#E8E2D5] flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-bold text-stone-600 flex items-center gap-0.5 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#2F5233]" /> Gợi ý:
                </span>
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickChip(chip)}
                    className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#EBF2EB] hover:text-[#2F5233] hover:border-[#2F5233]/40 border border-[#E8E2D5] rounded-full text-[11px] text-stone-700 whitespace-nowrap transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Send Form */}
              <form onSubmit={handleSend} className="p-3 bg-white flex items-center gap-2 border-t border-[#E8E2D5]">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập tin nhắn trao đổi..."
                  className="flex-1 px-4 py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#2F5233] text-stone-800"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-[#2F5233] text-white hover:bg-[#244127] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center p-8">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-stone-800">Chọn cuộc trò chuyện để bắt đầu nhắn tin</h3>
              <p className="text-xs text-stone-600 mt-1 max-w-sm">
                Tin nhắn sẽ được tự động lưu vào tài khoản đang đăng nhập của bạn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
