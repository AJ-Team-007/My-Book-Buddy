import React from 'react';
import {
  Menu,
  Search,
  Bell,
  PlusCircle,
  Home,
  Compass,
  MessageSquare,
  User,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  X,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  Inbox,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { ScreenId, StudentUser, ViewportMode } from '../types';
import { BrandLogo } from './BrandLogo';

interface TopNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  currentUser: StudentUser;
  unreadMessagesCount: number;
  pendingRequestsCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onOpenMenu: () => void;
  viewportMode: ViewportMode;
  onChangeViewportMode: (mode: ViewportMode) => void;
  isGoogleSignedIn?: boolean;
  onGoogleSignIn?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeScreen,
  onNavigate,
  currentUser,
  unreadMessagesCount,
  pendingRequestsCount,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenMenu,
  viewportMode,
  onChangeViewportMode,
  isGoogleSignedIn = false,
  onGoogleSignIn,
}) => {
  const navLinks: { id: ScreenId; label: string; badge?: number }[] = [
    { id: 'home', label: 'Home' },
    { id: 'browse', label: 'Browse' },
    { id: 'sell', label: 'Sell a Book' },
    { id: 'messages', label: 'Messages', badge: unreadMessagesCount },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'demo', label: 'Demo Mode' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070A18]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger + Glowing Open-Book Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="w-10 h-10 rounded-xl bg-[#121836] hover:bg-[#1E293B] border border-white/10 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <BrandLogo onClick={() => onNavigate('home')} />
        </div>

        {/* Center (Desktop): Search bar + quick links */}
        {viewportMode !== 'mobile' && (
          <div className="hidden lg:flex items-center gap-5 flex-1 max-w-2xl mx-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit();
              }}
              className="relative flex-1 max-w-xs"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search title, subject, class..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121836] border border-white/10 focus:border-[#38BDF8] text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
            </form>

            <nav className="flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#7B3FE4]/30 to-[#FF2E93]/30 text-white border border-[#7B3FE4]/60 shadow-[0_0_12px_rgba(123,63,228,0.3)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#FF2E93] text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Right: Viewport Switcher Pill (Desktop), Search Icon, Buy Requests Bell, Verified Student Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Responsive Preview Switcher */}
          <div className="hidden xl:flex items-center bg-[#121836] p-1 rounded-xl border border-white/10 mr-1">
            {(
              [
                { id: 'auto', icon: Maximize2, label: 'Auto' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                { id: 'desktop', icon: Monitor, label: 'Desktop' },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              const active = viewportMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeViewportMode(m.id)}
                  title={`View ${m.label} layout`}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    active
                      ? 'bg-[#7B3FE4] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('browse')}
            aria-label="Search books"
            className="w-9 h-9 rounded-xl bg-[#121836] hover:bg-[#1E293B] border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#38BDF8] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('requests')}
            aria-label="Buy Requests and Notifications"
            className="relative w-9 h-9 rounded-xl bg-[#121836] hover:bg-[#1E293B] border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#FFD13B] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF2E93] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,46,147,0.8)]">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {!isGoogleSignedIn && onGoogleSignIn && (
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7B3FE4] to-[#00E5FF] hover:brightness-110 text-white text-xs font-extrabold shadow-[0_0_12px_rgba(0,229,255,0.3)] whitespace-nowrap transition-all"
            >
              <span>Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#121836] hover:bg-[#1E293B] border border-white/15 transition-all"
          >
            <div
              className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentUser.avatarGradient} flex items-center justify-center text-white text-xs font-extrabold shadow-sm relative`}
            >
              {currentUser.initials}
              <span className="w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-[#070A18] absolute -bottom-0.5 -right-0.5" />
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-200 max-w-[110px] truncate">
              {currentUser.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unreadMessagesCount: number;
  forceShow?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  unreadMessagesCount,
  forceShow = false,
}) => {
  return (
    <nav
      className={`${
        forceShow ? 'flex' : 'flex lg:hidden'
      } fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F26]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.6)]`}
    >
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
          activeScreen === 'home' ? 'text-[#38BDF8]' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('browse')}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
          activeScreen === 'browse' || activeScreen === 'book-details'
            ? 'text-[#38BDF8]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Browse</span>
      </button>

      {/* Center Glowing '+' Sell Button */}
      <button
        type="button"
        onClick={() => onNavigate('sell')}
        className="group -mt-4 flex flex-col items-center"
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#7B3FE4] via-[#FF2E93] to-[#FF6BB5] flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,46,147,0.65)] border-2 border-[#070A18] group-hover:scale-105 transition-transform">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-[#FF2E93] mt-0.5">Sell</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('messages')}
        className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
          activeScreen === 'messages' || activeScreen === 'chat'
            ? 'text-[#38BDF8]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 rounded-full bg-[#FF2E93] text-white text-[9px] font-bold flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold">Messages</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
          activeScreen === 'profile' ? 'text-[#38BDF8]' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Profile</span>
      </button>
    </nav>
  );
};

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  currentUser: StudentUser;
  viewportMode: ViewportMode;
  onChangeViewportMode: (mode: ViewportMode) => void;
  unreadMessagesCount: number;
  pendingRequestsCount: number;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onNavigate,
  currentUser,
  viewportMode,
  onChangeViewportMode,
  unreadMessagesCount,
  pendingRequestsCount,
}) => {
  if (!isOpen) return null;

  const menuItems: { id: ScreenId; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home Marketplace', icon: Home },
    { id: 'browse', label: 'Browse Books', icon: Compass },
    { id: 'sell', label: 'Sell a Book', icon: PlusCircle },
    { id: 'dashboard', label: 'My Dashboard & Listings', icon: LayoutDashboard },
    { id: 'requests', label: 'Buy Requests', icon: Inbox, badge: pendingRequestsCount },
    { id: 'messages', label: 'Messages & Chat', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'demo', label: 'Science Fair Demo Mode', icon: Sparkles },
    { id: 'trust', label: 'Trust & Safety Guidelines', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <aside className="relative w-80 max-w-[85vw] bg-[#0B0F26] border-r border-white/10 h-full flex flex-col justify-between z-10 overflow-y-auto p-5 shadow-[10px_0_40px_rgba(0,0,0,0.8)]">
        <div>
          {/* Top Brand + Close */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <BrandLogo
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
            />
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Student Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#121836] border border-white/10 flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-br ${currentUser.avatarGradient} flex items-center justify-center text-white font-extrabold text-sm shrink-0`}
            >
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUser.classGrade} • {currentUser.board}
              </p>
            </div>
          </div>

          {/* View Screen Size Switcher */}
          <div className="mt-4 p-3 rounded-2xl bg-[#121836]/70 border border-white/10">
            <p className="text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider mb-2">
              View Screen Size
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'auto', label: 'Auto Fit', icon: Maximize2 },
                  { id: 'mobile', label: 'Mobile (390px)', icon: Smartphone },
                  { id: 'tablet', label: 'Tablet (820px)', icon: Tablet },
                  { id: 'desktop', label: 'Desktop Full', icon: Monitor },
                ] as const
              ).map((mode) => {
                const Icon = mode.icon;
                const active = viewportMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onChangeViewportMode(mode.id)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_12px_rgba(123,63,228,0.4)]'
                        : 'bg-[#070A18]/60 text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#7B3FE4]/25 to-[#FF2E93]/25 text-white border border-[#7B3FE4]/50'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF2E93] text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Owner Credit Card in Side Menu */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#7B3FE4]/20 via-[#121836] to-[#FF2E93]/20 border border-[#7B3FE4]/40">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <BookOpen className="w-4 h-4 text-[#00E5FF]" />
              <span>MY BOOK BUDDY</span>
            </div>
            <p className="text-[11px] text-[#FFD13B] font-semibold mt-1">
              Created & Owned by Jaimin & Aarush
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Give Your Old Books a New Student
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};
