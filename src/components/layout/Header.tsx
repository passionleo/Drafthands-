import React from 'react';
import { 
  Compass, 
  Layers, 
  BookOpen, 
  Award, 
  Search, 
  Grid3X3, 
  RotateCcw, 
  Sparkles, 
  Download, 
  Info, 
  GraduationCap, 
  PenTool, 
  Lock, 
  Zap, 
  ShieldCheck,
  Users,
  Tv,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Box
} from 'lucide-react';
import { CurriculumTier } from '../../types/curriculum';
import { TIER_CONFIG } from '../../data/curriculumData';
import { useSubscription } from '../../context/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '../../types/subscription';

interface HeaderProps {
  activeTier: CurriculumTier;
  onSelectTier: (tier: CurriculumTier) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenTheory: () => void;
  onOpenPractice: () => void;
  onOpenIsoDiagram?: () => void;
  onOpenOrthographicViewport?: () => void;
  onOpenTeacherPortal: () => void;
  onOpenParentPortal: () => void;
  onOpenProjectionMode: () => void;
  onOpenTeacherAssignments?: () => void;
  onOpenStudentAssignments?: () => void;
  onOpenLiveClass?: () => void;
  onToggleWhiteboardStudio: () => void;
  isWhiteboardOpen: boolean;
  onResetView: () => void;
  onExportSvg: () => void;
  currentTopicTitle: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onReturnToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTier,
  onSelectTier,
  searchQuery,
  onSearchChange,
  onOpenTheory,
  onOpenPractice,
  onOpenIsoDiagram,
  onOpenOrthographicViewport,
  onOpenTeacherPortal,
  onOpenParentPortal,
  onOpenProjectionMode,
  onOpenTeacherAssignments,
  onOpenStudentAssignments,
  onOpenLiveClass,
  onToggleWhiteboardStudio,
  isWhiteboardOpen,
  onResetView,
  onExportSvg,
  currentTopicTitle,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onReturnToLanding
}) => {
  const tiers: CurriculumTier[] = ['SS1', 'SS2', 'SS3', 'HIGHER_INSTITUTION'];
  const { subscription, isSubscribed, openPaywall } = useSubscription();

  const currentPlan = SUBSCRIPTION_PLANS[subscription.plan];

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30 select-none shrink-0 shadow-md">
      {/* Brand & Academy Title & Sidebar Toggle */}
      <div className="flex items-center gap-3 min-w-[240px]">
        {onToggleSidebar && (
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
            title={isSidebarCollapsed ? "Expand Curriculum Sidebar" : "Collapse Curriculum Sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
        <div 
          onClick={onReturnToLanding}
          className={`flex items-center gap-2.5 ${onReturnToLanding ? 'cursor-pointer group' : ''}`}
          title={onReturnToLanding ? "Return to Public Landing Page" : undefined}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                DRAFTHANDS
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                CAD & TD
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[200px] flex items-center gap-1">
              <span>Technical Graphics Academy</span>
              {onReturnToLanding && <span className="text-[10px] text-cyan-400/80 group-hover:underline font-mono">← Home</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Tier Switcher Tabs */}
      <nav className="hidden xl:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
        {tiers.map((tier) => {
          const cfg = TIER_CONFIG[tier];
          const isActive = activeTier === tier;
          return (
            <button
              key={tier}
              id={`tab-tier-${tier}`}
              onClick={() => onSelectTier(tier)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{tier === 'HIGHER_INSTITUTION' ? 'Higher Ed' : tier}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Actions: Search, Subscription Plan Badge, Parent Portal, Live Projection, Teacher Portal, Whiteboard Studio, Modals */}
      <div className="flex items-center gap-2">
        {/* Quick Search */}
        <div className="relative hidden 2xl:block w-36">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search topic..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950/90 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Freemium / Subscription Upgrade Button */}
        {isSubscribed ? (
          <button
            onClick={() => openPaywall()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 transition-colors shadow-sm"
            title="Subscription Active - Click to view details"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">{currentPlan.badge}</span>
          </button>
        ) : (
          <button
            onClick={() => openPaywall()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
            title="Freemium: First 3 Topics Free per class level. Upgrade for complete syllabus"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Paystack Pro</span>
          </button>
        )}

        {/* Student Practical Tasks Hub */}
        {onOpenStudentAssignments && (
          <button
            id="btn-open-student-assignments"
            onClick={onOpenStudentAssignments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 transition-colors shadow-sm"
            title="Student Assignments & Submissions Hub: View Tasks, Launch Studio, Submit Drawings"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">My Tasks</span>
          </button>
        )}

        {/* Teacher Task Dispatch & Rubric Evaluation */}
        {onOpenTeacherAssignments && (
          <button
            id="btn-open-teacher-assignments"
            onClick={onOpenTeacherAssignments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 border border-purple-500/40 transition-colors shadow-sm"
            title="Teacher Assignments & Evaluation Console: Dispatch Practical Tasks & Grade Drawings with WAEC Rubrics"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Grading Desk</span>
          </button>
        )}

        {/* Live Virtual Classroom (2-Way Video + Synced Whiteboard) */}
        {onOpenLiveClass && (
          <button
            id="btn-open-live-class"
            onClick={onOpenLiveClass}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600/30 to-pink-600/30 hover:from-red-600/45 hover:to-pink-600/45 text-red-300 border border-red-500/50 transition-all shadow-sm group"
            title="Drafthands Live Virtual Classroom: 2-Way Video/Audio & Real-Time Synchronized Technical Whiteboard"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <Tv className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Live Class</span>
          </button>
        )}

        {/* Live-Class Projection Mode (Pro Tier) */}
        <button
          id="btn-open-projection-mode"
          onClick={onOpenProjectionMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm"
          title="Teacher Live Projection Mode: Smart Board / Projector Interface with Laser Pointer & Step Playback"
        >
          <Tv className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Live Projection</span>
        </button>

        {/* Parent Monitoring Portal */}
        <button
          id="btn-open-parent-portal"
          onClick={onOpenParentPortal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-300 border border-blue-500/40 transition-colors shadow-sm"
          title="Parent Monitoring & Feedback Portal: View Ward Analytics, CA Scores & Progress Report"
        >
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Parent Portal</span>
        </button>

        {/* Teacher Lesson Note Generator Portal */}
        <button
          id="btn-open-teacher-portal"
          onClick={onOpenTeacherPortal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-300 border border-purple-500/40 transition-colors shadow-sm"
          title="Open Teacher Portal: Generate & Export Lesson Notes"
        >
          <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden lg:inline">Teacher Notes</span>
        </button>

        {/* Whiteboard Drawing Studio Mode Toggle */}
        <button
          id="btn-toggle-whiteboard-studio"
          onClick={onToggleWhiteboardStudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm border ${
            isWhiteboardOpen
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/30 font-bold'
              : 'bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border-slate-700/80'
          }`}
          title="Toggle Multi-Input Interactive Drawing Studio (Mouse, Stylus, Touch)"
        >
          <PenTool className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">{isWhiteboardOpen ? 'Exit Studio' : 'Drawing Studio'}</span>
        </button>

        {/* ISO 128 Blueprint Viewer Button */}
        {onOpenIsoDiagram && (
          <button
            id="btn-open-iso-blueprint"
            onClick={onOpenIsoDiagram}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500/20 to-blue-500/20 hover:from-sky-500/30 hover:to-blue-500/30 text-sky-300 border border-sky-500/40 transition-colors shadow-sm"
            title="Open Interactive ISO 128 Technical Vector Blueprint Viewer"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">ISO Blueprint</span>
          </button>
        )}

        {/* Orthographic Projection Viewport Button (ISO 5456 1st & 3rd Angle) */}
        {onOpenOrthographicViewport && (
          <button
            id="btn-open-ortho-viewport"
            onClick={onOpenOrthographicViewport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30 text-cyan-300 border border-cyan-500/40 transition-colors shadow-sm"
            title="Open Interactive 3D Isometric & 2D Orthographic Viewport (ISO 5456 1st & 3rd Angle)"
          >
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Ortho Viewport</span>
          </button>
        )}

        {/* Theory Reference Button */}
        <button
          id="btn-open-theory"
          onClick={onOpenTheory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
          title="View Engineering Theory & WAEC/NERDC Standards"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Theory</span>
        </button>

        {/* Practice / Exam Challenge */}
        <button
          id="btn-open-practice"
          onClick={onOpenPractice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm"
          title="Open Practice Mode and Technical Knowledge Check"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Practice</span>
        </button>

        {/* Export Drawing */}
        <button
          id="btn-export-svg"
          onClick={onExportSvg}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
          title="Export Technical Vector SVG"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
