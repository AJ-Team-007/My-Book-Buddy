import React, { useState } from 'react';
import {
  CheckCircle2,
  BookOpen,
  Inbox,
  MessageSquare,
  Edit3,
  Sparkles,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronRight,
  Users,
  MapPin,
  Eye,
  Lock,
  Ban,
  Play,
} from 'lucide-react';
import { BookListing, BuyRequest, ScreenId, StudentUser } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface ProfileViewProps {
  currentUser: StudentUser;
  books: BookListing[];
  requests: BuyRequest[];
  onNavigate: (screen: ScreenId) => void;
  onSwitchUser: (userId: string) => void;
  onUpdateProfileName: (newName: string, newClass: string, newSchool: string) => void;
  isGoogleSignedIn: boolean;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  books,
  requests,
  onNavigate,
  onSwitchUser,
  onUpdateProfileName,
  isGoogleSignedIn,
  onGoogleSignIn,
  onGoogleSignOut,
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [nameInput, setNameInput] = useState(currentUser.displayName);
  const [classInput, setClassInput] = useState(currentUser.classGrade);
  const [schoolInput, setSchoolInput] = useState(currentUser.school);

  const [privacyShowClass, setPrivacyShowClass] = useState(true);
  const [privacyCampusOnly, setPrivacyCampusOnly] = useState(true);

  const myActiveCount = books.filter(
    (b) => b.sellerId === currentUser.id && b.status === 'Available'
  ).length;
  const mySoldCount = books.filter(
    (b) => b.sellerId === currentUser.id && b.status === 'Sold'
  ).length;
  const myRequestsCount = requests.filter(
    (r) => r.sellerId === currentUser.id || r.buyerId === currentUser.id
  ).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfileName(nameInput.trim() || currentUser.displayName, classInput, schoolInput);
    setEditingProfile(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Main Profile Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121836] via-[#0B0F26] to-[#1D123C] border border-[#7B3FE4]/50 p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF2E93] via-[#7B3FE4] to-[#00E5FF] p-1 mx-auto shadow-[0_0_30px_rgba(255,46,147,0.5)]">
          <div className="w-full h-full rounded-full bg-[#0B0F26] flex items-center justify-center text-white text-2xl font-extrabold">
            {currentUser.initials}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {currentUser.displayName}
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/50 text-[11px] font-bold text-[#38BDF8]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Student
          </span>
        </div>

        <p className="text-sm font-bold text-[#00E5FF] mt-1">
          {currentUser.classGrade} • {currentUser.board}
        </p>

        <p className="text-xs text-slate-300 mt-0.5">{currentUser.school}</p>

        <p className="text-xs font-semibold text-[#FFD13B] mt-2">
          Member since {currentUser.memberSince} • Created & Owned by Jaimin & Aarush
        </p>

        <p className="text-[11px] text-slate-400 mt-2 max-w-md mx-auto">
          🔒 Privacy Protected: No private email address or personal phone number is displayed publicly.
        </p>
      </div>

      {/* 3 Stat Boxes: Active Listings, Books Sold, Buy Requests */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigate('dashboard')}
          className="rounded-2xl bg-[#0B0F26] hover:bg-[#121836] border border-white/10 p-4 text-center cursor-pointer transition-colors"
        >
          <div className="text-2xl font-extrabold text-[#38BDF8] font-mono-num">
            {myActiveCount}
          </div>
          <div className="text-xs font-bold text-slate-400 mt-0.5">Active Listings</div>
        </div>

        <div
          onClick={() => onNavigate('dashboard')}
          className="rounded-2xl bg-[#0B0F26] hover:bg-[#121836] border border-white/10 p-4 text-center cursor-pointer transition-colors"
        >
          <div className="text-2xl font-extrabold text-[#10B981] font-mono-num">
            {mySoldCount}
          </div>
          <div className="text-xs font-bold text-slate-400 mt-0.5">Books Sold</div>
        </div>

        <div
          onClick={() => onNavigate('requests')}
          className="rounded-2xl bg-[#0B0F26] hover:bg-[#121836] border border-white/10 p-4 text-center cursor-pointer transition-colors"
        >
          <div className="text-2xl font-extrabold text-[#FFD13B] font-mono-num">
            {myRequestsCount}
          </div>
          <div className="text-xs font-bold text-slate-400 mt-0.5">Buy Requests</div>
        </div>
      </div>

      {/* Optional Inline Edit Profile Form */}
      {editingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl bg-[#0B0F26] border border-[#38BDF8]/50 p-5 space-y-4"
        >
          <h3 className="text-sm font-extrabold text-white">Edit Student Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Class</label>
              <input
                type="text"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">School</label>
              <input
                type="text"
                value={schoolInput}
                onChange={(e) => setSchoolInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingProfile(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#10B981] text-xs font-extrabold text-white"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Optional Inline Settings Drawer */}
      {showSettings && (
        <div className="rounded-3xl bg-[#0B0F26] border border-[#7B3FE4]/50 p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-white">
            Settings — Privacy Toggles & Quick Student Switcher
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121836] border border-white/10 cursor-pointer">
              <span className="text-xs font-semibold text-slate-200">
                Display Class & Board badge on book listings
              </span>
              <input
                type="checkbox"
                checked={privacyShowClass}
                onChange={(e) => setPrivacyShowClass(e.target.checked)}
                className="accent-[#7B3FE4] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121836] border border-white/10 cursor-pointer">
              <span className="text-xs font-semibold text-slate-200">
                Hide personal phone/email — allow in-app student chat only
              </span>
              <input
                type="checkbox"
                checked={privacyCampusOnly}
                onChange={(e) => setPrivacyCampusOnly(e.target.checked)}
                className="accent-[#10B981] w-4 h-4"
              />
            </label>
          </div>

          <div>
            <p className="text-xs font-bold text-[#38BDF8] mb-2">
              Quick Student Account Switcher:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['student-a', 'student-b', 'student-c'] as const).map((uid) => {
                const u = DEMO_USERS[uid];
                const active = currentUser.id === uid;
                return (
                  <button
                    key={uid}
                    type="button"
                    onClick={() => onSwitchUser(uid)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#7B3FE4]/30 border-[#38BDF8] text-white'
                        : 'bg-[#121836] border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>{u.shortRole}</div>
                    <div className="text-[10px] text-slate-400 truncate">{u.displayName}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Links List */}
      <div className="rounded-3xl bg-[#0B0F26] border border-white/10 divide-y divide-white/10 overflow-hidden shadow-xl">
        {[
          {
            label: 'My Listings',
            sub: 'View and manage your active and sold books',
            icon: BookOpen,
            color: 'text-[#38BDF8]',
            action: () => onNavigate('dashboard'),
          },
          {
            label: 'My Buy Requests',
            sub: 'Check received and sent book requests',
            icon: Inbox,
            color: 'text-[#FFD13B]',
            action: () => onNavigate('requests'),
          },
          {
            label: 'Messages',
            sub: 'Open student chat conversations',
            icon: MessageSquare,
            color: 'text-[#FF2E93]',
            action: () => onNavigate('messages'),
          },
          {
            label: 'Edit Profile',
            sub: 'Update student display name, class & school',
            icon: Edit3,
            color: 'text-[#10B981]',
            action: () => setEditingProfile((prev) => !prev),
          },
          {
            label: 'Demo Mode (Science Fair)',
            sub: 'Switch demo personas & launch 7-step guided tour',
            icon: Sparkles,
            color: 'text-[#FFD13B]',
            action: () => onNavigate('demo'),
          },
          {
            label: 'Trust & Safety',
            sub: 'Safe student exchange guidelines & community rules',
            icon: ShieldCheck,
            color: 'text-[#38BDF8]',
            action: () => onNavigate('trust'),
          },
          {
            label: 'Settings',
            sub: 'Privacy toggles & quick student persona switcher',
            icon: Settings,
            color: 'text-slate-300',
            action: () => setShowSettings((prev) => !prev),
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#121836] transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#121836] border border-white/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.sub}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          );
        })}
      </div>

      {/* Sign Out / Sign In Button (Real Firebase Google Auth) */}
      {isGoogleSignedIn ? (
        <button
          type="button"
          onClick={onGoogleSignOut}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#121836] hover:bg-rose-500/15 border border-white/15 hover:border-rose-500/50 text-xs sm:text-sm font-extrabold text-rose-400 flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Google Student Account</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onGoogleSignIn}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#7B3FE4] via-[#2563EB] to-[#00E5FF] hover:brightness-110 text-xs sm:text-sm font-extrabold text-white shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Sign In with Google (Enable Live Cloud Sync)</span>
        </button>
      )}
    </div>
  );
};

interface DemoModeViewProps {
  currentUser: StudentUser;
  onSwitchUser: (userId: string) => void;
  onStartDemoTour: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const DemoModeView: React.FC<DemoModeViewProps> = ({
  currentUser,
  onSwitchUser,
  onStartDemoTour,
  onNavigate,
}) => {
  const demoUsersList = [
    DEMO_USERS['student-a'],
    DEMO_USERS['student-b'],
    DEMO_USERS['student-c'],
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121836] via-[#0B0F26] to-[#23124B] border border-[#7B3FE4]/50 p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#FFD13B]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Demo Mode</h1>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#7B3FE4] text-white text-xs font-extrabold shadow-md">
            Created & Owned by Jaimin & Aarush
          </span>
        </div>

        <p className="text-sm text-slate-300">
          Explore the main features of My Book Buddy. Switch between student personas below or launch the interactive 7-step guided tour for Science Fair demonstrations.
        </p>

        {/* Start Demo Tour Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onStartDemoTour}
            className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#00E5FF] hover:brightness-110 text-white text-sm font-extrabold shadow-[0_10px_30px_rgba(16,185,129,0.45)] flex items-center justify-center gap-2.5 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Demo Tour (7-Step Interactive Walkthrough)</span>
          </button>
        </div>
      </div>

      {/* Selectable Demo Users */}
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#38BDF8]" />
          <span>Select Active Demo Student Persona</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoUsersList.map((u) => {
            const isActive = currentUser.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => onSwitchUser(u.id)}
                className={`rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#121836] border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.25)]'
                    : 'bg-[#0B0F26] border-white/10 hover:border-[#7B3FE4]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${u.avatarGradient} flex items-center justify-center text-white font-extrabold text-sm`}
                    >
                      {u.initials}
                    </div>
                    {isActive && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/50 text-[10px] font-extrabold text-[#34D399]">
                        ACTIVE USER
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-white">{u.shortRole}</h3>
                  <p className="text-xs font-bold text-[#38BDF8] mt-0.5">{u.displayName}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {u.classGrade} • {u.board}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{u.bio}</p>
                </div>

                <button
                  type="button"
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-[#00E5FF] text-[#070A18]'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {isActive ? 'Currently Selected' : `Switch to ${u.shortRole}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Step Tour Overview Card */}
      <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white">
          7-Step Guided Science Fair Flow
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {(
            [
              { label: '1. Browse', screen: 'browse' },
              { label: '2. Book Details', screen: 'book-details' },
              { label: '3. Request', screen: 'book-details' },
              { label: '4. Messages', screen: 'messages' },
              { label: '5. Chat', screen: 'chat' },
              { label: '6. My Listings', screen: 'dashboard' },
              { label: '7. Requests', screen: 'requests' },
            ] as const
          ).map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.screen)}
              className="p-3 rounded-xl bg-[#121836] hover:bg-[#7B3FE4]/30 border border-white/10 text-xs font-bold text-center text-slate-200 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrustSafetyView: React.FC = () => {
  const safetyCards = [
    {
      number: '01',
      title: 'Meet in Safe School or Public Places',
      description:
        'Meet only in safe/public places with appropriate adult or school supervision (such as the school library, reception, or main gate).',
      icon: MapPin,
      color: 'text-[#38BDF8]',
      border: 'border-[#38BDF8]/40',
    },
    {
      number: '02',
      title: 'Verify Book Condition First',
      description:
        'Verify the book before exchanging money. Check the edition, pages, and syllabus compatibility in person.',
      icon: Eye,
      color: 'text-[#10B981]',
      border: 'border-[#10B981]/40',
    },
    {
      number: '03',
      title: 'Protect Your Personal Privacy',
      description:
        'Do not share unnecessary personal information such as home addresses, private phone numbers, or banking passwords.',
      icon: Lock,
      color: 'text-[#FFD13B]',
      border: 'border-[#FFD13B]/40',
    },
    {
      number: '04',
      title: 'Direct Student Exchange — No Online Payments',
      description:
        'My Book Buddy does not process payments directly. All exchanges happen directly between students on campus.',
      icon: Ban,
      color: 'text-[#FF2E93]',
      border: 'border-[#FF2E93]/40',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header with Glowing Shield Icon */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121836] via-[#0B0F26] to-[#112233] border border-[#38BDF8]/40 p-6 sm:p-8 text-center space-y-3 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#7B3FE4] p-0.5 mx-auto shadow-[0_0_30px_rgba(0,229,255,0.45)]">
          <div className="w-full h-full bg-[#0B0F26] rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-[#00E5FF]" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Trust & Safety</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Essential community safety rules to keep every student textbook exchange simple, honest, and secure.
        </p>
      </div>

      {/* 4 Icon-Based Safety Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {safetyCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.number}
              className={`rounded-2xl bg-[#0B0F26] border ${card.border} p-5 space-y-3 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#121836] border border-white/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className="text-xs font-extrabold text-slate-500 font-mono-num">
                  RULE {card.number}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">{card.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Motto & Owner Credit */}
      <div className="rounded-3xl bg-[#0B0F26] border border-[#7B3FE4]/40 p-6 text-center space-y-1.5 shadow-[0_0_25px_rgba(123,63,228,0.2)]">
        <p className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-[#00E5FF] via-[#FF2E93] to-[#FFD13B] bg-clip-text text-transparent">
          Safe Sharing • Smart Learning • Better Together
        </p>
        <p className="text-xs font-bold text-white">
          Created & Owned by Jaimin & Aarush • Owner: Jaimin & Aarush
        </p>
      </div>
    </div>
  );
};
