import React, { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ValuePropositionGrid } from './ValuePropositionGrid';
import { CurriculumPreviewSection } from './CurriculumPreviewSection';
import { ExamArchiveSection } from './ExamArchiveSection';
import { TestimonialsSection } from './TestimonialsSection';
import { LandingFooter } from './LandingFooter';
import { NavigationVideoModal } from './NavigationVideoModal';
import { AuthModal, UserRoleType, PortalTargetType } from './AuthModal';
import { LandingPWAInstallModal } from '../pwa/LandingPWAInstallModal';
import { CurriculumTier } from '../../types/curriculum';
import { useSubscription } from '../../context/SubscriptionContext';
import { 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  BookOpen, 
  X,
  Compass,
  FileCheck2,
  Users,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onEnterStudio?: (options?: { 
    tier?: CurriculumTier; 
    topicId?: string; 
    role?: UserRoleType; 
    openTeacher?: boolean; 
    openParent?: boolean; 
    openLive?: boolean;
    openPastQuestions?: boolean;
    portal?: 'STUDENT' | 'TEACHER' | 'PARENT';
  }) => void;
  onOpenTeacherPortal?: () => void;
  onOpenParentPortal?: () => void;
  onOpenStudentPortal?: () => void;
  onOpenPastQuestions?: () => void;
  onOpenOwnerPortal?: () => void;
}

class LandingErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("LandingPage Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-cyan-400">DraftHands Academy</h2>
            <p className="text-sm text-slate-300">The landing view recovered from a minor render interruption.</p>
            <button
              onClick={() => {
                try { localStorage.clear(); sessionStorage.clear(); } catch {}
                window.location.hash = '#landing';
                window.location.reload();
              }}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-sm text-white cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              Reload Landing Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const LandingPageInner: React.FC<LandingPageProps> = ({ 
  onEnterStudio = () => {},
  onOpenTeacherPortal,
  onOpenParentPortal,
  onOpenStudentPortal,
  onOpenPastQuestions,
  onOpenOwnerPortal
}) => {
  const { 
    isAuthenticated, 
    isEmailVerified, 
    hasActivePaidSubscription, 
    isMasterAdmin, 
    authenticateUser, 
    openPaywall,
    setUserRole
  } = useSubscription();

  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'REGISTER'>('SIGN_IN');
  const [authTargetPortal, setAuthTargetPortal] = useState<PortalTargetType>('STUDENT');
  const [authTargetRole, setAuthTargetRole] = useState<UserRoleType>('STUDENT');

  // Callback to execute once authentication and email verification are completed
  const [pendingPortalAction, setPendingPortalAction] = useState<(() => void) | null>(null);

  // Post-Verification Full Package Payment Modal state
  const [showFullPackageModal, setShowFullPackageModal] = useState<boolean>(false);
  const [justVerifiedUser, setJustVerifiedUser] = useState<{ name: string; email: string; role: UserRoleType } | null>(null);

  /**
   * Enforces gatekeeping on portal entry:
   * Redirects unauthenticated / unverified visitors to Login with username & password or Register now.
   * Sends 6-digit email verification code before granting final access.
   * Owner portal is explicitly excluded.
   */
  const gatePortalAccess = (
    targetPortal: PortalTargetType,
    targetRole: UserRoleType,
    mode: 'SIGN_IN' | 'REGISTER',
    onSuccessCallback: () => void
  ) => {
    // If user is already authenticated and verified in current session
    if (isAuthenticated && isEmailVerified) {
      onSuccessCallback();
      return;
    }

    // Intercept and open login / register modal with email verification requirement
    setAuthTargetPortal(targetPortal);
    setAuthTargetRole(targetRole);
    setAuthMode(mode);
    setPendingPortalAction(() => onSuccessCallback);
    setIsAuthModalOpen(true);
  };

  const handleOpenAuth = (mode: 'SIGN_IN' | 'REGISTER' = 'SIGN_IN') => {
    gatePortalAccess('STUDENT', 'STUDENT', mode, () => {
      if (onOpenStudentPortal) onOpenStudentPortal();
      else onEnterStudio({ tier: 'SS1', portal: 'STUDENT' });
    });
  };

  const handleOpenVideoTour = () => {
    setIsVideoModalOpen(true);
  };

  // 1. Student Portal handler with gatekeeping
  const handleLaunchStudentPortal = (tier?: CurriculumTier) => {
    setUserRole('STUDENT');
    gatePortalAccess('STUDENT', 'STUDENT', 'SIGN_IN', () => {
      setUserRole('STUDENT');
      if (onOpenStudentPortal) {
        onOpenStudentPortal();
      } else {
        onEnterStudio({ tier: tier || 'SS1', portal: 'STUDENT' });
      }
    });
  };

  // 2. Syllabus Topic click handler with gatekeeping
  const handleLaunchTopic = (topicId: string) => {
    setUserRole('STUDENT');
    gatePortalAccess('STUDENT', 'STUDENT', 'SIGN_IN', () => {
      setUserRole('STUDENT');
      onEnterStudio({ topicId, portal: 'STUDENT' });
    });
  };

  // 3. Teacher Portal handler with gatekeeping
  const handleLaunchTeacherPortal = () => {
    setUserRole('TEACHER');
    gatePortalAccess('TEACHER', 'TEACHER', 'SIGN_IN', () => {
      setUserRole('TEACHER');
      if (onOpenTeacherPortal) {
        onOpenTeacherPortal();
      } else {
        onEnterStudio({ tier: 'SS1', role: 'TEACHER', openTeacher: true, portal: 'TEACHER' });
      }
    });
  };

  // 4. Parent Portal handler with gatekeeping
  const handleLaunchParentPortal = () => {
    setUserRole('PARENT');
    gatePortalAccess('PARENT', 'PARENT', 'SIGN_IN', () => {
      setUserRole('PARENT');
      if (onOpenParentPortal) {
        onOpenParentPortal();
      } else {
        onEnterStudio({ tier: 'SS1', role: 'PARENT', openParent: true, portal: 'PARENT' });
      }
    });
  };

  // 5. 10-Yr WAEC Past Questions handler with gatekeeping
  const handleLaunchPastQuestions = () => {
    setUserRole('STUDENT');
    gatePortalAccess('PAST_QUESTIONS', 'STUDENT', 'SIGN_IN', () => {
      setUserRole('STUDENT');
      if (onOpenPastQuestions) {
        onOpenPastQuestions();
      } else {
        onEnterStudio({ openPastQuestions: true });
      }
    });
  };

  // 6. Owner Portal: Login processing activated at the click of the portal
  const handleLaunchOwnerPortal = () => {
    setUserRole('ADMIN');
    gatePortalAccess('OWNER', 'ADMIN', 'SIGN_IN', () => {
      setUserRole('ADMIN');
      if (onOpenOwnerPortal) {
        onOpenOwnerPortal();
      } else {
        window.location.hash = '#owner';
      }
    });
  };

  // Handle successful login/registration and email verification
  const handleAuthSuccess = (
    role: UserRoleType, 
    userDetails: { name: string; email: string; institution?: string; isEmailVerified?: boolean },
    targetPortal?: PortalTargetType
  ) => {
    setUserRole(role);
    // 1. Authenticate user in subscription context
    authenticateUser({
      name: userDetails.name,
      email: userDetails.email,
      institution: userDetails.institution,
      role,
      isEmailVerified: true,
      isAuthenticated: true
    });

    const isOwner = role === 'ADMIN' || 
                    targetPortal === 'OWNER' ||
                    userDetails.email.toLowerCase().includes('passion4dami') || 
                    isMasterAdmin;

    const actionToRun = pendingPortalAction || (() => {
      if (targetPortal === 'OWNER' || role === 'ADMIN') {
        if (onOpenOwnerPortal) onOpenOwnerPortal();
        else window.location.hash = '#owner';
      } else if (targetPortal === 'TEACHER' || role === 'TEACHER') {
        if (onOpenTeacherPortal) onOpenTeacherPortal();
        else onEnterStudio({ tier: 'SS1', role: 'TEACHER', openTeacher: true, portal: 'TEACHER' });
      } else if (targetPortal === 'PARENT' || role === 'PARENT') {
        if (onOpenParentPortal) onOpenParentPortal();
        else onEnterStudio({ tier: 'SS1', role: 'PARENT', openParent: true, portal: 'PARENT' });
      } else if (targetPortal === 'PAST_QUESTIONS') {
        if (onOpenPastQuestions) onOpenPastQuestions();
        else onEnterStudio({ openPastQuestions: true });
      } else {
        if (onOpenStudentPortal) onOpenStudentPortal();
        else onEnterStudio({ tier: 'SS1', role: 'STUDENT', portal: 'STUDENT' });
      }
    });

    // 2. Enforce payment for full package requirement (Excluding Owner portal)
    if (isOwner) {
      actionToRun();
      setPendingPortalAction(null);
    } else if (!hasActivePaidSubscription) {
      setJustVerifiedUser({ name: userDetails.name, email: userDetails.email, role });
      setPendingPortalAction(() => actionToRun);
      setShowFullPackageModal(true);
    } else {
      // Direct access for paid users
      actionToRun();
      setPendingPortalAction(null);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Header with gated portals and direct owner portal */}
      <LandingHeader
        onOpenAuth={handleOpenAuth}
        onOpenVideoTour={handleOpenVideoTour}
        onLaunchStudio={handleLaunchStudentPortal}
        onNavigateSection={handleNavigateSection}
        onOpenTeacherPortal={handleLaunchTeacherPortal}
        onOpenParentPortal={handleLaunchParentPortal}
        onOpenStudentPortal={handleLaunchStudentPortal}
        onOpenPastQuestions={handleLaunchPastQuestions}
        onOpenOwnerPortal={handleLaunchOwnerPortal}
      />

      {/* 2. Hero Section */}
      <div id="hero">
        <HeroSection
          onOpenAuth={handleOpenAuth}
          onOpenVideoTour={handleOpenVideoTour}
          onLaunchStudio={handleLaunchStudentPortal}
        />
      </div>

      {/* 3. Value Proposition Grid */}
      <ValuePropositionGrid
        onLaunchStudio={handleLaunchStudentPortal}
        onOpenVideoTour={handleOpenVideoTour}
        onOpenAuth={handleOpenAuth}
      />

      {/* 4. Interactive Curriculum Catalog */}
      <CurriculumPreviewSection
        onSelectTopicToLaunch={handleLaunchTopic}
      />

      {/* 5. WAEC/NECO/NABTEB 10-Year Exam Archive */}
      <ExamArchiveSection
        onLaunchTopic={handleLaunchTopic}
        onOpenAuth={handleOpenAuth}
        onOpenPastQuestionsHub={handleLaunchPastQuestions}
      />

      {/* 6. Meet the Founder & Lead Educator */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-15 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Avatar / Badge representation */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-purple-600 p-1 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-white p-4 space-y-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 mb-1">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-bold uppercase">ISL Educator</span>
                  <span className="text-[11px] font-semibold text-slate-300">B.Tech Civil Engr.</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Engr. Kolawole Olawale Kayode</h3>
                <p className="text-xs font-medium text-cyan-400">Technical Drawing Department, ISL</p>
                <p className="text-[11px] text-slate-400">International School, University of Lagos (ISL)</p>
              </div>
            </div>

            {/* Right: Bio & Credentials */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Meet the Lead Educator & Architect</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Engineering Precision Meets Classroom Pedagogy
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                "Conceived and engineered by Engr. Kolawole Olawale Kayode, a Civil Engineer (B.Tech) and seasoned Technical Drawing tutor at the International School, University of Lagos (ISL). Combining civil engineering structural drafting precision with years of active classroom pedagogy preparing students for NERDC, WAEC, and NECO examinations, Engr. Kayode developed DraftHands to bridge manual board drafting with modern computer-aided design (CAD)."
              </p>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono">
                <strong>Byline:</strong> Conceived & Directed by Engr. Kolawole Olawale Kayode, B.Tech Civil Engr. • Technical Drawing Department, International School, University of Lagos (ISL).
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Testimonials & Accreditations */}
      <TestimonialsSection />

      {/* 8. Footer */}
      <LandingFooter
        onLaunchStudio={handleLaunchStudentPortal}
        onOpenAuth={handleOpenAuth}
        onOpenVideoTour={handleOpenVideoTour}
        onOpenStudentPortal={handleLaunchStudentPortal}
        onOpenTeacherPortal={handleLaunchTeacherPortal}
        onOpenParentPortal={handleLaunchParentPortal}
        onOpenPastQuestions={handleLaunchPastQuestions}
        onOpenOwnerPortal={handleLaunchOwnerPortal}
      />

      {/* Modals */}
      <NavigationVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onLaunchTopic={handleLaunchTopic}
      />

      {/* Auth & Email Verification Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        initialRole={authTargetRole}
        targetPortal={authTargetPortal}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Full Package Payment Required Modal (Per User Directive) */}
      {showFullPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Email Verified • Account Authorized
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Welcome, {justVerifiedUser?.name || 'Scholar'} ({justVerifiedUser?.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowFullPackageModal(false);
                  if (pendingPortalAction) {
                    pendingPortalAction();
                    setPendingPortalAction(null);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-blue-950/20 to-slate-900 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Full Package Access Required
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Paystack Checkout
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white leading-tight">
                  {justVerifiedUser?.role === 'TEACHER' 
                    ? 'Teacher Professional & Classroom License Payment' 
                    : justVerifiedUser?.role === 'PARENT'
                    ? 'Parent Ward Sponsorship & Full Package Pass'
                    : 'Unlock Complete NERDC Syllabus & 10-Year WAEC/NECO Solved Papers'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {justVerifiedUser?.role === 'TEACHER'
                    ? 'Activate your Teacher Master Pass to access NERDC lesson notes, student grading desk, and live virtual classes.'
                    : justVerifiedUser?.role === 'PARENT'
                    ? "Sponsor your ward's full session access to track continuous assessment, drafting sheets, and WAEC exam readiness."
                    : 'Your identity has been confirmed via email. Free access includes starter Plane Geometry topics. To unlock the full curriculum package across all senior classes, payment should be made.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>All 40+ SS1–SS3 Topics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>10-Yr WAEC Solved Papers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>3D Projections & Sectionals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Full Vector Blueprint Exports</span>
                  </div>
                </div>
              </div>

              {/* Pricing Callout */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Full Academic Session Pass</div>
                  <div className="text-[11px] text-slate-400">Unrestricted access for 3 full terms (12 months)</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-cyan-300 font-mono">₦6,500</div>
                  <div className="text-[10px] text-slate-500">Per Session</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setShowFullPackageModal(false);
                    openPaywall();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Make Payment for Full Package (Paystack)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setShowFullPackageModal(false);
                    if (pendingPortalAction) {
                      pendingPortalAction();
                      setPendingPortalAction(null);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continue with Free Starter Topics</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automated Non-Intrusive PWA Install Prompt Modal */}
      <LandingPWAInstallModal autoPromptDelay={1200} />
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = (props) => (
  <LandingErrorBoundary>
    <LandingPageInner {...props} />
  </LandingErrorBoundary>
);
