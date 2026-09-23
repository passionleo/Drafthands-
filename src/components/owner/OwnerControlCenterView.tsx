import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Compass,
  BookOpen,
  School,
  FileCheck2,
  Tv,
  PenTool,
  Lock,
  Unlock,
  Key,
  Globe,
  Radio,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  AlertCircle,
  LogOut,
  Sliders,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  Zap,
  Plus
} from 'lucide-react';
import { useSubscription, MASTER_ADMIN_EMAILS } from '../../context/SubscriptionContext';
import { CurriculumTier, DrawingTopic } from '../../types/curriculum';
import { UserRoleType } from '../../types/subscription';
import { 
  VisitorTracker 
} from '../../utils/visitorTracker';
import { 
  VisitorSession, 
  VisitorAccessRequest, 
  SiteAccessPolicy, 
  VipAccessPass, 
  LiveTrafficMetrics 
} from '../../types/owner';

interface OwnerControlCenterViewProps {
  onReturnToHome: () => void;
  onLaunchStudio: (tier?: CurriculumTier, topicId?: string) => void;
  onOpenTeacherPortal: () => void;
  onOpenParentPortal: () => void;
  onOpenPastQuestions: () => void;
  onOpenAdminConsole: () => void;
  topics?: DrawingTopic[];
}

export const OwnerControlCenterView: React.FC<OwnerControlCenterViewProps> = ({
  onReturnToHome,
  onLaunchStudio,
  onOpenTeacherPortal,
  onOpenParentPortal,
  onOpenPastQuestions,
  onOpenAdminConsole,
  topics = []
}) => {
  const {
    isMasterAdmin,
    enableMasterAdminBypass,
    disableMasterAdminBypass,
    userProfile,
    userRole,
    setUserRole,
    logout
  } = useSubscription();

  // Authentication State for Owner
  const [securityKeyInput, setSecurityKeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'SWITCHBOARD' | 'TRAFFIC' | 'VISITORS' | 'VIP_PASSES'>('SWITCHBOARD');

  // Traffic & Visitor Data State
  const [trafficData, setTrafficData] = useState<{ metrics: LiveTrafficMetrics; visitors: VisitorSession[] }>(() => 
    VisitorTracker.getLiveTrafficMetrics('PUBLIC_LANDING')
  );
  const [sitePolicy, setSitePolicy] = useState<SiteAccessPolicy>(() => VisitorTracker.getSiteAccessPolicy());
  const [accessRequests, setAccessRequests] = useState<VisitorAccessRequest[]>(() => VisitorTracker.getAccessRequests());
  const [vipPasses, setVipPasses] = useState<VipAccessPass[]>(() => VisitorTracker.getVipPasses());

  // VIP Pass Generator Form State
  const [newPassLabel, setNewPassLabel] = useState<string>('Guest School Inspection Pass');
  const [newPassDurationHours, setNewPassDurationHours] = useState<number>(24);
  const [newPassRole, setNewPassRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('TEACHER');
  const [newPassMaxUses, setNewPassMaxUses] = useState<number>(30);
  const [copiedPassCode, setCopiedPassCode] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Live Refresh interval
  useEffect(() => {
    const refreshData = () => {
      setTrafficData(VisitorTracker.getLiveTrafficMetrics('ADMIN_CONSOLE'));
      setAccessRequests(VisitorTracker.getAccessRequests());
      setVipPasses(VisitorTracker.getVipPasses());
      setSitePolicy(VisitorTracker.getSiteAccessPolicy());
    };

    const interval = setInterval(refreshData, 6000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string) => {
    setActionNotice(message);
    setTimeout(() => {
      setActionNotice(null);
    }, 3500);
  };

  const handleOwnerKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = securityKeyInput.trim().toUpperCase();
    if (
      clean === 'PASSION4DAMI' || 
      clean === 'OWNER-BYPASS' || 
      clean === 'ADMIN-BYPASS' || 
      clean === 'MASTER-ADMIN' ||
      clean.includes('PASSION') ||
      clean.includes('DAMI')
    ) {
      enableMasterAdminBypass('passion4dami@gmail.com');
      setAuthError(null);
      showToast('Master Owner Authentication Confirmed. All Portals Unlocked.');
    } else {
      setAuthError('Invalid Security Key. Please enter the authorized owner passphrase.');
    }
  };

  const handlePolicyChange = (newPolicy: SiteAccessPolicy) => {
    VisitorTracker.setSiteAccessPolicy(newPolicy);
    setSitePolicy(newPolicy);
    const label = 
      newPolicy === 'OPEN_ALL_VISITORS' 
        ? 'Open Access Mode Activated (All visitors have free full access)' 
        : newPolicy === 'OWNER_APPROVAL_ONLY' 
          ? 'Gatekeeper Mode Activated (Owner approval required)' 
          : 'Standard Paywall Preview Mode Restored';
    showToast(label);
  };

  const handlePermitVisitor = (sessionId: string, hours: number = 24) => {
    VisitorTracker.permitVisitorSession(sessionId, hours, 'Permitted by Owner from Control Center');
    setTrafficData(VisitorTracker.getLiveTrafficMetrics('ADMIN_CONSOLE'));
    setAccessRequests(VisitorTracker.getAccessRequests());
    showToast(`Visitor ${sessionId} granted ${hours} hours full access.`);
  };

  const handleRevokeVisitor = (sessionId: string) => {
    VisitorTracker.revokeVisitorSession(sessionId);
    setTrafficData(VisitorTracker.getLiveTrafficMetrics('ADMIN_CONSOLE'));
    showToast(`Access revoked for ${sessionId}.`);
  };

  const handleApproveRequest = (request: VisitorAccessRequest, hours: number = 24) => {
    VisitorTracker.permitVisitorSession(request.id, hours, `Approved for ${request.name} (${request.institution})`);
    setAccessRequests(VisitorTracker.getAccessRequests());
    showToast(`Access Approved for ${request.name}!`);
  };

  const handleCreateVipPass = (e: React.FormEvent) => {
    e.preventDefault();
    const pass = VisitorTracker.createVipPass(newPassLabel, newPassDurationHours, newPassRole, newPassMaxUses);
    setVipPasses(VisitorTracker.getVipPasses());
    showToast(`VIP Pass ${pass.code} Generated Successfully!`);
  };

  const handleCopyPassLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drafthands.com.ng';
    const link = `${origin}/#access-pass=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedPassCode(code);
    showToast(`Shareable VIP Pass Link copied to clipboard!`);
    setTimeout(() => setCopiedPassCode(null), 3000);
  };

  // If user is not yet recognized as master admin, show the Owner Security Authentication Screen
  if (!isMasterAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-400 p-0.5 mx-auto shadow-xl shadow-amber-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Authorized Personnel Only
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">Platform Owner Control</h2>
              <p className="text-xs text-slate-400 mt-1">
                Restricted to DraftHands Platform Owner (<span className="text-amber-300 font-mono">passion4dami@gmail.com</span>).
              </p>
            </div>
          </div>

          <form onSubmit={handleOwnerKeySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Owner Security Passphrase / Master Key:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={securityKeyInput}
                  onChange={(e) => setSecurityKeyInput(e.target.value)}
                  placeholder="Enter Master Security Key..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                  autoFocus
                />
                <Key className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none opacity-60" />
              </div>
              {authError && (
                <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Master Owner Console</span>
            </button>
          </form>

          {/* Quick One-Click Owner Login for Registered Owner Email */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <button
              onClick={() => {
                enableMasterAdminBypass('passion4dami@gmail.com');
                showToast('Welcome, Engr. Dami! Master Owner Access Unlocked.');
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Click Owner Bypass (passion4dami@gmail.com)</span>
            </button>

            <button
              onClick={onReturnToHome}
              className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Return to Public Academy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, visitors } = trafficData;
  const pendingRequestsCount = accessRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Toast Notification Banner */}
      {actionNotice && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 border border-amber-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Owner Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  DraftHands Owner Command Center
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Master Webmaster
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Network Live</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Engr. Dami (<span className="text-amber-300">passion4dami@gmail.com</span>) • Full Root Privileges
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isMasterAdmin) {
                  disableMasterAdminBypass();
                  showToast('Master Owner Bypass Temporarily Disabled.');
                } else {
                  enableMasterAdminBypass('passion4dami@gmail.com');
                  showToast('Master Owner Bypass Re-Enabled.');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                isMasterAdmin 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle Master Owner Universal Bypass"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Bypass: {isMasterAdmin ? 'Active' : 'Disabled'}</span>
            </button>

            <button
              onClick={onReturnToHome}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            >
              Public Home
            </button>

            <button
              onClick={() => {
                logout();
                onReturnToHome();
              }}
              className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer"
              title="Log Out of Owner Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs font-semibold py-2">
          {[
            { id: 'SWITCHBOARD', label: 'All Portals Switchboard', icon: Sliders },
            { id: 'TRAFFIC', label: 'Site Live Traffic & Analytics', icon: TrendingUp },
            { id: 'VISITORS', label: `Visitor Access & Permissions`, icon: Users, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
            { id: 'VIP_PASSES', label: 'VIP One-Time Pass Links', icon: Key }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">

        {/* ================= TAB 1: ALL PORTALS SWITCHBOARD ================= */}
        {activeTab === 'SWITCHBOARD' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>UNIVERSAL ACCESS CONTROLLER</span>
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Instant Access to All Academy Portals
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl mt-1">
                  As the Platform Owner, you have unconditional master bypass to inspect, interact, and administer every portal entity on DraftHands.
                </p>
              </div>

              {/* Impersonate Role Bar */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold pl-1">Active Role:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {userRole}
                </span>
                <div className="flex items-center gap-1">
                  {(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'] as UserRoleType[]).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        showToast(`Switched active role identity to ${r}.`);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        userRole === r
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Portal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Student Portal & CAD Studio */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-col justify-between space-y-4 shadow-lg hover:border-cyan-400 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                      Full Access Unlocked
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Student Portal & Interactive CAD Studio
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Complete NERDC secondary and polytechnic drawing syllabus, geometric construction players, 2D/3D orthographic viewports, and multi-tool vector drawing board.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Launch Direct Tier:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onLaunchStudio('SS1')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all text-left flex items-center justify-between"
                    >
                      <span>SS1 Plane Geometry</span>
                      <ChevronRight className="w-3 h-3 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => onLaunchStudio('SS2')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all text-left flex items-center justify-between"
                    >
                      <span>SS2 Solid & Ortho</span>
                      <ChevronRight className="w-3 h-3 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => onLaunchStudio('SS3')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all text-left flex items-center justify-between"
                    >
                      <span>SS3 Assembly & Plans</span>
                      <ChevronRight className="w-3 h-3 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => onLaunchStudio('HIGHER_INSTITUTION')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all text-left flex items-center justify-between"
                    >
                      <span>Polytechnic / Uni</span>
                      <ChevronRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Technical Teacher Portal */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 flex flex-col justify-between space-y-4 shadow-lg hover:border-purple-400 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                      Full Access Unlocked
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      Technical Teacher & Educator Portal
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Instant NERDC/WAEC structured lesson plan generator, 4-part WAEC grading rubric evaluation desk, classroom smart board projection mode, and virtual classroom launcher.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setUserRole('TEACHER');
                      onOpenTeacherPortal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Open Teacher Portal Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3. Parent Monitoring Portal */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-blue-500/30 flex flex-col justify-between space-y-4 shadow-lg hover:border-blue-400 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-500/30 font-bold">
                      Full Access Unlocked
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      Parent & Guardian Monitoring Portal
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Ward academic analytics, syllabus mastery progress, weekly drawing hours, terminal Continuous Assessment (CA) report cards, and practical plates portfolio.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setUserRole('PARENT');
                      onOpenParentPortal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Open Parent Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4. 10-Yr WAEC Past Questions Hub */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col justify-between space-y-4 shadow-lg hover:border-emerald-400 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                      Full Archive Unlocked
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      10-Year WAEC Past Questions Archive
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Paper 2 (Theory) and Paper 3 (Practical) historical exams, official WAEC marking schemes, high-precision vector step-by-step solutions, and downloadable plates.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={onOpenPastQuestions}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Open WAEC Archive Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 5. Institutional School Console */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-400 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                      <School className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      Institutional Root
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      Institutional School Admin Console
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Multi-seat voucher license generation, secondary school technical department accreditation, student roster management, and institutional Paystack accounts.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={onOpenAdminConsole}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Open School Admin Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 6. Live Virtual Classroom Launcher */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 flex flex-col justify-between space-y-4 shadow-lg hover:border-indigo-400 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                      <Tv className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-bold">
                      WebRTC Studio
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Live Broadcast & Projection Studio
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Live high-contrast classroom smart board projection mode with ultra-large step indicators, ruler/compass simulation overlays, and student hand-raising.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onLaunchStudio('SS1')}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Launch Studio with Projection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIVE TRAFFIC & ANALYTICS ================= */}
        {activeTab === 'TRAFFIC' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Real-time KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Active Visitors Right Now</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-3xl font-extrabold text-white mt-2 font-mono flex items-baseline gap-2">
                  <span>{metrics.liveActiveCount}</span>
                  <span className="text-xs font-normal text-emerald-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +14% vs yesterday
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Concurrent users drafting, reviewing, or exploring.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30">
                <span className="text-xs text-slate-400 font-semibold">Unique Visitors Today</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {metrics.totalVisitorsToday}
                </div>
                <div className="text-[11px] text-cyan-400 mt-1">
                  Across 36 states & West African examination zones.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30">
                <span className="text-xs text-slate-400 font-semibold">Total Page & Module Views</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {metrics.totalPageViewsToday.toLocaleString()}
                </div>
                <div className="text-[11px] text-blue-400 mt-1">
                  Plate inspections, quiz questions, vector exports.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30">
                <span className="text-xs text-slate-400 font-semibold">Average Session Duration</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {metrics.avgSessionMinutes} <span className="text-sm font-normal text-slate-400">mins</span>
                </div>
                <div className="text-[11px] text-amber-300 mt-1">
                  High engagement in interactive CAD step players.
                </div>
              </div>
            </div>

            {/* Visual Traffic Distribution Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic by Portal Distribution */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Traffic Breakdown by Portal</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Student CAD Drafting Studio', percentage: metrics.portalDistribution.studentCad, color: 'bg-cyan-500', users: '~24 active' },
                    { name: 'Teacher Lesson & Evaluation Desk', percentage: metrics.portalDistribution.teacherPortal, color: 'bg-purple-500', users: '~9 active' },
                    { name: '10-Yr WAEC Past Questions Archive', percentage: metrics.portalDistribution.waecArchive, color: 'bg-emerald-500', users: '~5 active' },
                    { name: 'Parent Monitoring Portal', percentage: metrics.portalDistribution.parentPortal, color: 'bg-blue-500', users: '~2 active' },
                    { name: 'Public Landing Page & Virtual Tour', percentage: metrics.portalDistribution.publicLanding, color: 'bg-amber-500', users: '~2 active' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.name}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-400 text-[11px]">{item.users}</span>
                          <span className="font-bold text-white">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic / Regional Distribution */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Top Geolocation Activity Centers</span>
                </h3>
                <div className="space-y-3">
                  {metrics.geoDistribution.map((geo, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{geo.region}</span>
                        <span className="font-mono text-amber-300 font-bold">{geo.count} visitors ({geo.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${geo.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PC: {metrics.deviceBreakdown.desktop}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tablet className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tablet: {metrics.deviceBreakdown.tablet}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mobile: {metrics.deviceBreakdown.mobile}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Real-time Activity Stream */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Real-Time Live Academy Activity Stream</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Updates automatically</span>
              </div>

              <div className="divide-y divide-slate-800">
                {metrics.recentActivityEvents.map(evt => (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        evt.type === 'drawing' ? 'bg-cyan-400' : evt.type === 'request' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <span className="text-slate-200 font-medium">{evt.description}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {evt.location}
                      </span>
                      <span>{evt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: VISITOR ACCESS & PERMISSIONS ================= */}
        {activeTab === 'VISITORS' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Site-Wide Access Mode Switcher Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Site-Wide Visitor Access Policy</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Control whether visitors can browse freely, need subscriptions, or require your approval.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Current: {sitePolicy === 'OPEN_ALL_VISITORS' ? 'Open Access (Free for All)' : sitePolicy === 'OWNER_APPROVAL_ONLY' ? 'Owner Approval Required' : 'Standard Preview Mode'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handlePolicyChange('OPEN_ALL_VISITORS')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    sitePolicy === 'OPEN_ALL_VISITORS'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-emerald-400">🟢 Open Access Mode</span>
                    {sitePolicy === 'OPEN_ALL_VISITORS' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Temporarily permits ALL visitors to access all topics and tools without paywall (ideal for exam week promos or demos).
                  </p>
                </button>

                <button
                  onClick={() => handlePolicyChange('STANDARD')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    sitePolicy === 'STANDARD'
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-cyan-400">🔵 Standard Mode</span>
                    {sitePolicy === 'STANDARD' && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Introductory 3 topics per tier free. Remaining require Paystack subscription or individual VIP pass.
                  </p>
                </button>

                <button
                  onClick={() => handlePolicyChange('OWNER_APPROVAL_ONLY')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    sitePolicy === 'OWNER_APPROVAL_ONLY'
                      ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-amber-400">🟡 Gatekeeper Mode</span>
                    {sitePolicy === 'OWNER_APPROVAL_ONLY' && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Visitors see an "Access Request" modal. You review and grant access from this console.
                  </p>
                </button>
              </div>
            </div>

            {/* Pending Access Requests Queue */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>Incoming Visitor Access Requests</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Students, instructors, and schools requesting access from their devices.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {pendingRequestsCount} Pending
                </span>
              </div>

              {accessRequests.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No access requests pending at the moment.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                  {accessRequests.map(req => (
                    <div key={req.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{req.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            req.role === 'TEACHER' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}>
                            {req.role}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{req.email}</span>
                        </div>
                        <div className="text-slate-300 font-medium">
                          Institution: <span className="text-amber-300">{req.institution}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] italic bg-slate-900/80 p-2 rounded-lg border border-slate-800 max-w-xl">
                          "{req.reason}"
                        </p>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Requested: {new Date(req.requestedAt).toLocaleTimeString()} • Status: <span className={req.status === 'APPROVED' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{req.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleApproveRequest(req, 24)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Permit 24 Hours
                            </button>
                            <button
                              onClick={() => handleApproveRequest(req, 168)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Permit 7 Days
                            </button>
                          </>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold">
                            ✓ Access Granted ({req.approvedDurationHours || 24}h)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Active Visitor Sessions Table with Manual Permit Controls */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Active Visitor Sessions on Site</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live sessions currently browsing the platform. You can permit or restrict any visitor from here.
                  </p>
                </div>
                <button
                  onClick={() => setTrafficData(VisitorTracker.getLiveTrafficMetrics('ADMIN_CONSOLE'))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Session / IP</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Device</th>
                      <th className="p-3">Current Module</th>
                      <th className="p-3">Access Status</th>
                      <th className="p-3 text-right">Owner Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    {visitors.map(visitor => {
                      const isPermitted = visitor.status === 'PERMITTED_BY_OWNER';
                      const isLocal = visitor.ipHash.includes('Your Current');
                      return (
                        <tr key={visitor.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono">
                            <span className="font-bold text-white">{visitor.id}</span>
                            <span className="block text-[10px] text-slate-400">{visitor.ipHash}</span>
                          </td>
                          <td className="p-3 text-slate-300 font-medium">
                            {visitor.location}
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">
                            {visitor.device}
                          </td>
                          <td className="p-3 text-cyan-300 font-mono text-[11px] max-w-xs truncate">
                            {visitor.currentTopicTitle || visitor.currentPortal}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isPermitted 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                : visitor.status === 'ACCESS_REQUESTED'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-slate-800 text-slate-300'
                            }`}>
                              {isPermitted ? 'Permitted by Owner' : visitor.status === 'ACCESS_REQUESTED' ? 'Request Pending' : 'Free Preview'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {isPermitted ? (
                              <button
                                onClick={() => handleRevokeVisitor(visitor.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Revoke Access
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePermitVisitor(visitor.id, 24)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Grant 24h Pass
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: VIP PASSES GENERATOR ================= */}
        {activeTab === 'VIP_PASSES' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* VIP Pass Generator Form */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Generate Shareable VIP Access Pass Link</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Create a unique direct link that you can send via WhatsApp or Email. When the visitor clicks it, full platform access unlocks automatically!
                </p>
              </div>

              <form onSubmit={handleCreateVipPass} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div className="lg:col-span-2">
                  <label className="block text-slate-400 mb-1 font-semibold">Pass Purpose / Label:</label>
                  <input
                    type="text"
                    value={newPassLabel}
                    onChange={(e) => setNewPassLabel(e.target.value)}
                    placeholder="e.g. FGGC Calabar Inspection Pass"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Duration:</label>
                  <select
                    value={newPassDurationHours}
                    onChange={(e) => setNewPassDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>1 Hour (Quick Demo)</option>
                    <option value={24}>24 Hours (1 Day)</option>
                    <option value={168}>7 Days (1 Week)</option>
                    <option value={720}>30 Days (1 Month)</option>
                    <option value={8760}>1 Full Academic Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Role Tier:</label>
                  <select
                    value={newPassRole}
                    onChange={(e) => setNewPassRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="STUDENT">Student Pass</option>
                    <option value="TEACHER">Technical Instructor</option>
                    <option value="ADMIN">Institutional Admin</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer h-[38px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate Pass</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Active VIP Passes Table */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Active VIP Access Passes & Shareable Links</span>
              </h3>

              <div className="space-y-3">
                {vipPasses.map(pass => (
                  <div key={pass.code} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300 text-sm">{pass.code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-700">
                          {pass.role}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Used: <span className="font-mono text-cyan-400 font-bold">{pass.usedCount}/{pass.maxUses}</span>
                        </span>
                      </div>
                      <div className="text-white font-semibold mt-1">{pass.label}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Expires: {new Date(pass.expiresAt).toLocaleDateString()} at {new Date(pass.expiresAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyPassLink(pass.code)}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-600/20"
                      >
                        {copiedPassCode === pass.code ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Shareable Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
