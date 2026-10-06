import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  ArrowLeft,
  MoreVertical,
  Send,
  Camera,
  MapPin,
  Zap,
  CheckCheck,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, Conversation, StudentUser } from '../types';
import { SVG_OPEN_PAGES } from '../data/mockData';
import { processAndUploadBookImage } from '../firebase';
import { getConditionBadgeStyle } from './BookCard';

interface MessagesViewProps {
  conversations: Conversation[];
  onSelectConversation: (conv: Conversation) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  onSelectConversation,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.otherStudentName.toLowerCase().includes(search.toLowerCase()) ||
      c.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'unread') return c.unreadCount > 0;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Messages</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate textbook inspection and safe campus exchanges
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0B0F26] border border-white/15 focus:border-[#38BDF8] text-sm text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Tabs: All Conversations | Unread */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_15px_rgba(123,63,228,0.4)]'
              : 'bg-[#0B0F26] text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          All Conversations ({conversations.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            activeTab === 'unread'
              ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_15px_rgba(123,63,228,0.4)]'
              : 'bg-[#0B0F26] text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          <span>Unread ({totalUnread})</span>
        </button>
      </div>

      {/* Conversation Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-10 text-center space-y-2">
          <MessageSquare className="w-9 h-9 text-[#38BDF8] mx-auto" />
          <h3 className="text-sm font-bold text-white">No conversations found</h3>
          <p className="text-xs text-slate-400">
            Select a book and click "Message Seller" or "Request to Buy" to start chatting.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className="group rounded-2xl bg-[#0B0F26] hover:bg-[#121836] border border-white/10 hover:border-[#7B3FE4]/60 p-4 flex items-center gap-3.5 cursor-pointer transition-all shadow-md"
            >
              {/* Student Avatar with Online Dot */}
              <div className="relative shrink-0">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.otherStudentAvatarGradient} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}
                >
                  {conv.otherStudentInitials}
                </div>
                {conv.otherStudentOnline && (
                  <span className="w-3 h-3 rounded-full bg-[#10B981] ring-2 ring-[#0B0F26] absolute bottom-0 right-0" />
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white group-hover:text-[#38BDF8] transition-colors truncate">
                    {conv.otherStudentName}
                  </h3>
                  <span className="text-[11px] text-slate-400 shrink-0 font-mono-num">
                    {conv.lastTimestamp}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#FFD13B] truncate mt-0.5">
                  📘 {conv.bookTitle} • ₹{conv.bookPrice}
                </p>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <p
                    className={`text-xs truncate ${
                      conv.unreadCount > 0 ? 'text-white font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF2E93] text-white text-[10px] font-extrabold shrink-0 shadow-[0_0_10px_rgba(255,46,147,0.6)]">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ChatViewProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUser: StudentUser;
  onBack: () => void;
  onSendMessage: (text: string, attachedPhoto?: string, isLocationPin?: boolean) => void;
  onSimulatePartnerReply: () => void;
  onViewBookDetails: (bookId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  messages,
  currentUser,
  onBack,
  onSendMessage,
  onSimulatePartnerReply,
  onViewBookDetails,
}) => {
  const [inputText, setInputText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleAttachPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await processAndUploadBookImage(file);
    onSendMessage('Here is a clear photo of the textbook pages:', uploadedUrl);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] bg-[#0B0F26] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Chat Header (NO Call Icon as instructed) */}
      <div className="px-4 py-3 bg-[#121836] border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-200 hover:text-white shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${conversation.otherStudentAvatarGradient} flex items-center justify-center text-white font-extrabold text-xs`}
            >
              {conversation.otherStudentInitials}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#121836] absolute bottom-0 right-0" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-white truncate">
              {conversation.otherStudentName}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-[#10B981] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>Online • {conversation.otherStudentClass}</span>
            </div>
          </div>
        </div>

        {/* 3-Dot Menu (No call icon) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Conversation options"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0B0F26] border border-white/15 shadow-xl p-1.5 z-20">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onViewBookDetails(conversation.bookId);
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                View Book Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSimulatePartnerReply();
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-[#38BDF8] hover:bg-white/10"
              >
                Trigger Partner Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Book Context Card Below Header */}
      <div className="px-4 py-2.5 bg-[#070A18]/80 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={conversation.bookCover}
            alt={conversation.bookTitle}
            referrerPolicy="no-referrer"
            className="w-10 h-12 rounded-lg object-cover border border-white/10 shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold text-white truncate">
              {conversation.bookTitle}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-extrabold text-[#FFD13B] font-mono-num">
                ₹{conversation.bookPrice}
              </span>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${getConditionBadgeStyle(
                  conversation.bookCondition
                )}`}
              >
                {conversation.bookCondition}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewBookDetails(conversation.bookId)}
          className="px-3 py-1.5 rounded-xl bg-[#121836] hover:bg-[#7B3FE4]/30 border border-white/10 text-xs font-bold text-[#38BDF8] flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>View Book →</span>
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center my-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            Meet in school library or main gate during school hours
          </span>
        </div>

        {messages.map((msg) => {
          const isOutgoing = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md ${
                  isOutgoing
                    ? 'bg-gradient-to-r from-[#7B3FE4] to-[#2563EB] text-white rounded-br-xs'
                    : 'bg-[#121836] border border-white/10 text-slate-100 rounded-bl-xs'
                }`}
              >
                {msg.attachedPhoto && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-[220px]">
                    <img
                      src={msg.attachedPhoto}
                      alt="Attached textbook page"
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>

                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    isOutgoing ? 'text-blue-100/80' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isOutgoing && <CheckCheck className="w-3.5 h-3.5 text-[#00E5FF]" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick Action Chips Above Input */}
      <div className="px-3 py-2 bg-[#121836]/80 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() =>
            onSendMessage(
              'Here are the inside pages and index of the textbook — clean and unmarked!',
              SVG_OPEN_PAGES
            )
          }
          className="px-3 py-1.5 rounded-full bg-[#0B0F26] hover:bg-[#7B3FE4]/30 border border-white/15 text-[11px] font-bold text-slate-200 hover:text-white whitespace-nowrap shrink-0"
        >
          📷 Share Photos
        </button>

        <button
          type="button"
          onClick={() =>
            onSendMessage(
              '📍 Let’s meet at the School Main Gate / Library at 4:00 PM today for the book exchange.',
              undefined,
              true
            )
          }
          className="px-3 py-1.5 rounded-full bg-[#0B0F26] hover:bg-[#10B981]/30 border border-white/15 text-[11px] font-bold text-slate-200 hover:text-white whitespace-nowrap shrink-0"
        >
          📍 School Gate 4 PM
        </button>

        <button
          type="button"
          onClick={onSimulatePartnerReply}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF2E93]/25 to-[#7B3FE4]/25 hover:from-[#FF2E93]/40 hover:to-[#7B3FE4]/40 border border-[#FF2E93]/50 text-[11px] font-extrabold text-[#FFD13B] whitespace-nowrap shrink-0"
        >
          ⚡ Partner Reply
        </button>
      </div>

      {/* Bottom Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#121836] border-t border-white/10 flex items-center gap-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAttachPhotoFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach book photo"
          className="w-10 h-10 rounded-xl bg-[#0B0F26] hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B0F26] border border-white/15 focus:border-[#38BDF8] text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          aria-label="Send message"
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] hover:brightness-110 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,46,147,0.4)] shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
